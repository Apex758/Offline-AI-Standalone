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
 * NOT a general-purpose JSON recovery tool. Edge cases (escapes mid-string,
 * unicode surrogates, numbers mid-stream) are handled conservatively.
 */

export function parsePartialJson<T = unknown>(raw: string): Partial<T> | null {
  if (!raw) return null;

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
  if (firstBrace === -1) return null;
  s = s.slice(firstBrace);

  // Fast path: already valid.
  try {
    return JSON.parse(s) as Partial<T>;
  } catch {
    /* fall through to repair */
  }

  const repaired = repairJson(s);
  if (!repaired) return null;
  try {
    return JSON.parse(repaired) as Partial<T>;
  } catch {
    return null;
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
