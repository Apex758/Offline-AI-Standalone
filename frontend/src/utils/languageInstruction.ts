const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
};

export function getLanguageInstruction(language?: string): string {
  if (!language || language === 'en') return '';
  const name = LANGUAGE_NAMES[language];
  if (!name) return '';
  return `\n\nIMPORTANT: You MUST respond entirely in ${name}. All content, instructions, labels, headings, and explanations must be written in ${name}. Do not use English unless it is a proper noun or technical term.\n`;
}
