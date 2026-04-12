/**
 * Shared utility for extracting AI-generated titles from responses.
 *
 * When a user doesn't provide a title, the prompt builder appends an instruction
 * asking the AI to include a generated title at the end of its response in the format:
 * [GENERATED_TITLE: Your Title Here]
 *
 * This utility extracts that title and returns cleaned content.
 */

export interface TitleExtractionResult {
  /** The extracted title, or null if none found */
  title: string | null;
  /** The content with the title marker stripped out */
  content: string;
}

/**
 * Extract an AI-generated title from the response text.
 * Looks for the pattern [GENERATED_TITLE: ...] anywhere in the text (typically at the end).
 * Strips the marker line from the content.
 */
export function extractGeneratedTitle(text: string): TitleExtractionResult {
  if (!text) return { title: null, content: text };

  // Match [GENERATED_TITLE: ...] pattern - can be on its own line or inline
  const titleRegex = /\[GENERATED_TITLE:\s*(.+?)\s*\]/;
  const match = text.match(titleRegex);

  if (match && match[1]) {
    // Strip the entire line containing the marker
    const cleaned = text
      .replace(/\n?\s*\[GENERATED_TITLE:\s*.+?\s*\]\s*\n?/, '\n')
      .trim();
    return {
      title: match[1].trim(),
      content: cleaned,
    };
  }

  return { title: null, content: text };
}

/**
 * Build the prompt instruction to inject when no title is provided.
 * @param documentType - e.g. "lesson plan", "quiz", "rubric", "worksheet"
 * @param contextHint - additional context like "based on the subject, grade, and content"
 */
export function buildTitleGenerationInstruction(
  documentType: string,
  contextHint?: string
): string {
  const hint = contextHint || `based on the subject, grade level, and content`;
  return (
    `\n\nIMPORTANT: Since no specific title was provided, you MUST end your entire response with a generated title ` +
    `for this ${documentType} on its own line in this exact format:\n` +
    `[GENERATED_TITLE: Your Descriptive Title Here]\n` +
    `The title should be clear, descriptive, and suitable as a document heading ${hint}. ` +
    `Keep it concise (under 60 characters). Do NOT include the word "${documentType}" in the title unless it adds clarity.`
  );
}
