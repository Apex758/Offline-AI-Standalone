import curriculumIndex from '../data/curriculumIndex.json';

const pages = (curriculumIndex as any).indexedPages || [];

/**
 * Get unique strands matching a subject and grade from the curriculum index.
 */
export function getStrands(subject: string, grade: string): string[] {
  if (!subject || !grade) return [];
  const strandsSet = new Set<string>();
  pages.forEach((page: any) => {
    if (
      page.subject &&
      page.grade &&
      page.strand &&
      page.subject.toLowerCase() === subject.toLowerCase() &&
      page.grade.toString() === grade.toString()
    ) {
      strandsSet.add(page.strand);
    }
  });
  return Array.from(strandsSet);
}

/**
 * Get Essential Learning Outcomes matching subject, grade, and strand.
 */
export function getELOs(subject: string, grade: string, strand: string): string[] {
  if (!subject || !grade || !strand) return [];
  const elosSet = new Set<string>();
  pages.forEach((page: any) => {
    if (
      page.subject?.toLowerCase() === subject.toLowerCase() &&
      page.grade?.toString() === grade.toString() &&
      page.strand?.toLowerCase() === strand.toLowerCase() &&
      page.essentialOutcomes
    ) {
      page.essentialOutcomes.forEach((elo: any) => elosSet.add(typeof elo === 'string' ? elo : elo.text));
    }
  });
  return Array.from(elosSet);
}

/**
 * Get Specific Curriculum Outcomes matching subject, grade, strand, and a selected ELO.
 */
export function getSCOs(subject: string, grade: string, strand: string, elo: string): string[] {
  if (!subject || !grade || !strand || !elo) return [];
  const scosSet = new Set<string>();
  pages.forEach((page: any) => {
    if (
      page.subject?.toLowerCase() === subject.toLowerCase() &&
      page.grade?.toString() === grade.toString() &&
      page.strand?.toLowerCase() === strand.toLowerCase() &&
      page.essentialOutcomes?.some((e: any) => (typeof e === 'string' ? e : e.text) === elo) &&
      page.specificOutcomes
    ) {
      page.specificOutcomes.forEach((sco: any) => scosSet.add(typeof sco === 'string' ? sco : sco.text));
    }
  });
  return Array.from(scosSet);
}

/**
 * Get matching curriculum pages for a given subject, grade, and strand.
 */
export function getCurriculumMatches(subject: string, grade: string, strand: string) {
  if (!subject || !grade || !strand) return [];
  return pages.filter((page: any) =>
    page.subject?.toLowerCase() === subject.toLowerCase() &&
    page.grade === grade &&
    page.strand?.toLowerCase().includes(strand.toLowerCase())
  );
}
