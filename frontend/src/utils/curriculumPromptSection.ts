export type CurriculumToolContext =
  | 'lesson'
  | 'worksheet'
  | 'quiz'
  | 'rubric'
  | 'cross-curricular'
  | 'multigrade'
  | 'kindergarten';

const TOOL_FRAMING: Record<CurriculumToolContext, string> = {
  'lesson': 'align lesson objectives to these outcomes',
  'worksheet': 'ensure all questions and activities assess these outcomes',
  'quiz': 'quiz questions should test student understanding of these outcomes',
  'rubric': 'rubric criteria should measure mastery of these outcomes',
  'cross-curricular': 'integrated activities should connect to these outcomes from the primary subject',
  'multigrade': 'differentiate activities so each grade level addresses these outcomes at their developmental level',
  'kindergarten': 'address these outcomes through play-based, developmentally appropriate activities',
};

/**
 * Build a curriculum alignment section for any generator prompt.
 * Returns an empty string if no outcomes are provided.
 */
export function buildCurriculumPromptSection(
  essentialOutcomes: string,
  specificOutcomes: string,
  toolContext: CurriculumToolContext
): string {
  const elo = essentialOutcomes?.trim();
  const scoRaw = specificOutcomes?.trim();

  if (!elo && !scoRaw) return '';

  const framing = TOOL_FRAMING[toolContext];
  let section = `\nCURRICULUM ALIGNMENT (${framing}):`;

  if (elo) {
    section += `\n\nEssential Learning Outcome:\n${elo}`;
  }

  if (scoRaw) {
    const scos = scoRaw.split('\n').filter(s => s.trim());
    section += `\n\nSpecific Curriculum Outcomes:`;
    scos.forEach((sco, i) => {
      section += `\n  ${i + 1}. ${sco}`;
    });
  }

  return section + '\n';
}
