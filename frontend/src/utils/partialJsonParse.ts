/**
 * Lenient partial-JSON parser for streaming LLM output.
 *
 * Takes an incomplete JSON string (mid-stream) and attempts to close any
 * open strings/arrays/objects to produce valid JSON that parses cleanly.
 * Unfinished trailing values are dropped rather than guessed.
 *
 * Designed for our schema-constrained lesson plan stream. Because the
 * backend enforces grammar-constrained decoding, the incoming bytes are
 * always a PREFIX of a valid JSON object -- we just need to make each
 * prefix self-consistent so React can render progressively.
 *
 * Also exposes `parsePartialJsonWithProgress` which additionally returns
 * the JSON path and partial text of the value currently being typed, so
 * the UI can show text flowing into a specific field live (instead of
 * waiting for the field to commit before anything appears).
 *
 * NOT a general-purpose JSON recovery tool. Edge cases (escapes mid-string,
 * unicode surrogates, numbers mid-stream) are handled conservatively.
 */

export interface PartialJsonProgress<T = unknown> {
  /** Repaired+parsed committed state (fields already closed). */
  data: Partial<T> | null;
  /**
   * JSON path to the value currently being typed (e.g.
   * `["general_objective"]` or `["ksv", "knowledge", 2]`).
   * null if no string value is currently open.
   */
  inProgressPath: (string | number)[] | null;
  /**
   * Partial text content of the value currently being typed, with JSON
   * escape sequences resolved. Empty string if a new string just opened.
   * null if no string value is currently open.
   */
  inProgressValue: string | null;
}

export function parsePartialJson<T = unknown>(raw: string): Partial<T> | null {
  return parsePartialJsonWithProgress<T>(raw).data;
}

export function parsePartialJsonWithProgress<T = unknown>(
  raw: string
): PartialJsonProgress<T> {
  const empty: PartialJsonProgress<T> = {
    data: null,
    inProgressPath: null,
    inProgressValue: null,
  };
  if (!raw) return empty;

  // Strip any leading/trailing whitespace and an accidental markdown fence.
  let s = raw.trim();
  if (s.startsWith("```")) {
    s = s.replace(/^```(?:json)?\s*/i, "");
    const fenceEnd = s.lastIndexOf("```");
    if (fenceEnd !== -1) s = s.slice(0, fenceEnd);
    s = s.trim();
  }

  // Find the first opening brace; anything before is noise.
  const firstBrace = s.indexOf("{");
  if (firstBrace === -1) return empty;
  s = s.slice(firstBrace);

  // Extract progress info (path + partial string content currently open).
  const progress = extractProgress(s);

  // Fast path: already valid.
  try {
    const data = JSON.parse(s) as Partial<T>;
    return {
      data,
      inProgressPath: progress.path,
      inProgressValue: progress.value,
    };
  } catch {
    /* fall through to repair */
  }

  const repaired = repairJson(s);
  if (!repaired) {
    return {
      data: null,
      inProgressPath: progress.path,
      inProgressValue: progress.value,
    };
  }
  try {
    const data = JSON.parse(repaired) as Partial<T>;
    return {
      data,
      inProgressPath: progress.path,
      inProgressValue: progress.value,
    };
  } catch {
    return {
      data: null,
      inProgressPath: progress.path,
      inProgressValue: progress.value,
    };
  }
}

// ---------------------------------------------------------------------------
// Progress extraction — walks the raw prefix and reports whether there's a
// string currently open and where it lives in the JSON tree.
// ---------------------------------------------------------------------------

interface ProgressResult {
  path: (string | number)[] | null;
  value: string | null;
}

interface Frame {
  kind: "obj" | "arr";
  currentKey: string | null; // for obj: most recently closed key (active value being typed)
  currentIdx: number; // for arr: index of the current element
}

function extractProgress(s: string): ProgressResult {
  const path: (string | number)[] = [];
  const stack: Frame[] = [];
  let inString = false;
  let escape = false;
  let stringStart = -1;
  let stringIsKey = false;
  let afterColon = false;

  for (let i = 0; i < s.length; i++) {
    const c = s[i];

    if (inString) {
      if (escape) {
        escape = false;
        continue;
      }
      if (c === "\\") {
        escape = true;
        continue;
      }
      if (c === '"') {
        inString = false;
        // Closing a string.
        if (stringIsKey) {
          // Remember the key we just closed — it becomes the currentKey on the top frame.
          const top = stack[stack.length - 1];
          if (top && top.kind === "obj") {
            const keyText = s.slice(stringStart + 1, i);
            top.currentKey = safeDecodeString(keyText);
          }
        }
        stringStart = -1;
        stringIsKey = false;
      }
      continue;
    }

    if (c === '"') {
      inString = true;
      stringStart = i;
      const top = stack[stack.length - 1];
      stringIsKey = !!(top && top.kind === "obj" && !afterColon);
      afterColon = false;
      continue;
    }

    if (c === "{") {
      // Pushing a new object as the value of the current key/index.
      pushPathForValue(path, stack);
      stack.push({ kind: "obj", currentKey: null, currentIdx: 0 });
      afterColon = false;
      continue;
    }

    if (c === "[") {
      pushPathForValue(path, stack);
      stack.push({ kind: "arr", currentKey: null, currentIdx: 0 });
      afterColon = false;
      continue;
    }

    if (c === "}" || c === "]") {
      stack.pop();
      if (path.length > 0) path.pop();
      afterColon = false;
      continue;
    }

    if (c === ":") {
      afterColon = true;
      continue;
    }

    if (c === ",") {
      const top = stack[stack.length - 1];
      if (top && top.kind === "arr") {
        top.currentIdx += 1;
      } else if (top && top.kind === "obj") {
        top.currentKey = null;
      }
      afterColon = false;
      continue;
    }
    // numbers / true / false / null literals — not tracked as in-progress values
    // (they commit atomically and are less useful for per-character feedback).
  }

  // If we ended inside a string value, report it.
  if (inString && !stringIsKey && stringStart !== -1) {
    const top = stack[stack.length - 1];
    const partialPath = [...path];
    if (top) {
      if (top.kind === "obj" && top.currentKey != null) {
        partialPath.push(top.currentKey);
      } else if (top.kind === "arr") {
        partialPath.push(top.currentIdx);
      }
    }
    const rawPartial = s.slice(stringStart + 1);
    const value = safeDecodeString(rawPartial);
    return { path: partialPath, value };
  }

  return { path: null, value: null };
}

/**
 * When we encounter `{` or `[` that will become a value, push the
 * current key/index onto `path` so nested values are addressable.
 * Root-level objects/arrays do not push anything.
 */
function pushPathForValue(
  path: (string | number)[],
  stack: Frame[]
): void {
  const top = stack[stack.length - 1];
  if (!top) return; // root container
  if (top.kind === "obj" && top.currentKey != null) {
    path.push(top.currentKey);
  } else if (top.kind === "arr") {
    path.push(top.currentIdx);
  }
}

/**
 * Decode a partial JSON string (without the closing quote) into displayable
 * text, resolving escape sequences where possible and dropping dangling
 * unterminated escapes.
 */
function safeDecodeString(raw: string): string {
  // Drop trailing unterminated escape sequences before trying to parse.
  let trimmed = raw.replace(/\\u[0-9a-fA-F]{0,3}$/, "");
  if (trimmed.endsWith("\\")) trimmed = trimmed.slice(0, -1);
  try {
    return JSON.parse(`"${trimmed}"`);
  } catch {
    // Strip any backslashes and return as-is; better than nothing.
    return trimmed.replace(/\\/g, "");
  }
}

/**
 * Walk the string, track structural state, then append closers for whatever
 * remains open. Drops any trailing partial token (unterminated number, bare
 * key without value, dangling comma).
 */
function repairJson(s: string): string | null {
  const stack: Array<"{" | "[" | '"'> = [];
  let inString = false;
  let escape = false;
  // Index of the last "safe" character we can truncate to. A position is
  // safe after a complete value inside an array/object, or after a closing
  // quote on a string value.
  let lastSafeEnd = -1;
  // Track whether we're expecting a value (just saw ':' or '[' or ',' at value position)
  // so that we know to NOT keep dangling keys.
  let afterColon = false;
  let expectingKey = false;

  for (let i = 0; i < s.length; i++) {
    const c = s[i];

    if (inString) {
      if (escape) {
        escape = false;
      } else if (c === "\\") {
        escape = true;
      } else if (c === '"') {
        inString = false;
        // Closing a string. If this string was a value (not a key), that's a safe endpoint.
        if (!expectingKey) {
          lastSafeEnd = i;
        }
        expectingKey = false;
        afterColon = false;
      }
      continue;
    }

    if (c === '"') {
      inString = true;
      // Was this string going to be a key or a value?
      // If we're inside an object and not afterColon, it's a key.
      const top = stack[stack.length - 1];
      expectingKey = top === "{" && !afterColon;
      continue;
    }

    if (c === "{") {
      stack.push("{");
      afterColon = false;
      continue;
    }
    if (c === "[") {
      stack.push("[");
      afterColon = false;
      continue;
    }
    if (c === "}" || c === "]") {
      stack.pop();
      lastSafeEnd = i;
      afterColon = false;
      continue;
    }
    if (c === ":") {
      afterColon = true;
      continue;
    }
    if (c === ",") {
      lastSafeEnd = i - 1; // everything before the comma is a complete value
      afterColon = false;
      continue;
    }
    // number / true / false / null literal characters -- not tracked precisely;
    // we'll rely on lastSafeEnd which was set at the previous comma/closer.
  }

  // Truncate back to the last safe position, then close remaining open containers.
  // If we're mid-string, truncate before the opening quote so we don't leave a half-word.
  let truncated: string;
  if (inString) {
    truncated = s.slice(0, lastSafeEnd + 1);
  } else {
    // Even when not in a string, the tail could be a dangling key/partial number.
    // Safest: truncate to lastSafeEnd + 1 (inclusive of the last safe char).
    truncated = s.slice(0, lastSafeEnd + 1);
  }

  if (!truncated) return null;

  // Rebuild stack against the truncated prefix so closers match actual depth.
  const finalStack = stackOf(truncated);
  let out = truncated;
  // Drop trailing comma if any
  out = out.replace(/,\s*$/, "");
  // Drop dangling ": value?" if we truncated mid-value (rare after lastSafeEnd logic)
  out = out.replace(/:\s*$/, "").replace(/,\s*$/, "");

  // Close remaining containers in reverse.
  for (let i = finalStack.length - 1; i >= 0; i--) {
    out += finalStack[i] === "{" ? "}" : "]";
  }

  return out;
}

/** Recompute the open-container stack for a known-good prefix. */
function stackOf(s: string): Array<"{" | "["> {
  const stack: Array<"{" | "["> = [];
  let inString = false;
  let escape = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inString) {
      if (escape) escape = false;
      else if (c === "\\") escape = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') inString = true;
    else if (c === "{") stack.push("{");
    else if (c === "[") stack.push("[");
    else if (c === "}" || c === "]") stack.pop();
  }
  return stack;
}
