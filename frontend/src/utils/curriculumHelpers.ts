import { getCurriculumPages } from '../data/curriculumLoader';

/**
 * Get unique strands matching a subject and grade from the curriculum index.
 */
export function getStrands(subject: string, grade: string): string[] {
  if (!subject || !grade) return [];
  const strandsSet = new Set<string>();
  getCurriculumPages().forEach((page: any) => {
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
  getCurriculumPages().forEach((page: any) => {
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
  getCurriculumPages().forEach((page: any) => {
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

export interface OutcomeEntry {
  id: string;
  text: string;
  eloRef?: string;
}

/**
 * Get ELOs with structured IDs.
 */
export function getELOsStructured(subject: string, grade: string, strand: string): OutcomeEntry[] {
  if (!subject || !grade || !strand) return [];
  const seen = new Set<string>();
  const results: OutcomeEntry[] = [];
  getCurriculumPages().forEach((page: any) => {
    if (
      page.subject?.toLowerCase() === subject.toLowerCase() &&
      page.grade?.toString() === grade.toString() &&
      page.strand?.toLowerCase() === strand.toLowerCase() &&
      page.essentialOutcomes
    ) {
      page.essentialOutcomes.forEach((elo: any) => {
        const entry: OutcomeEntry = typeof elo === 'string'
          ? { id: '', text: elo }
          : { id: elo.id || '', text: elo.text };
        if (!seen.has(entry.text)) {
          seen.add(entry.text);
          results.push(entry);
        }
      });
    }
  });
  return results;
}

/**
 * Get SCOs with structured IDs.
 */
export function getSCOsStructured(subject: string, grade: string, strand: string, elo: string): OutcomeEntry[] {
  if (!subject || !grade || !strand || !elo) return [];
  const seen = new Set<string>();
  const results: OutcomeEntry[] = [];
  getCurriculumPages().forEach((page: any) => {
    if (
      page.subject?.toLowerCase() === subject.toLowerCase() &&
      page.grade?.toString() === grade.toString() &&
      page.strand?.toLowerCase() === strand.toLowerCase() &&
      page.essentialOutcomes?.some((e: any) => (typeof e === 'string' ? e : e.text) === elo) &&
      page.specificOutcomes
    ) {
      page.specificOutcomes.forEach((sco: any) => {
        const entry: OutcomeEntry = typeof sco === 'string'
          ? { id: '', text: sco }
          : { id: sco.id || '', text: sco.text, eloRef: sco.eloRef };
        if (!seen.has(entry.text)) {
          seen.add(entry.text);
          results.push(entry);
        }
      });
    }
  });
  return results;
}

/**
 * Build a lookup from outcome text -> ID for all pages matching subject/grade/strand.
 */
export function getOutcomeIdLookup(subject: string, grade: string, strand: string): Map<string, string> {
  const lookup = new Map<string, string>();
  if (!subject || !grade || !strand) return lookup;
  getCurriculumPages().forEach((page: any) => {
    if (
      page.subject?.toLowerCase() === subject.toLowerCase() &&
      page.grade?.toString() === grade.toString() &&
      page.strand?.toLowerCase() === strand.toLowerCase()
    ) {
      (page.essentialOutcomes || []).forEach((o: any) => {
        if (typeof o === 'object' && o.id) lookup.set(o.text, o.id);
      });
      (page.specificOutcomes || []).forEach((o: any) => {
        if (typeof o === 'object' && o.id) lookup.set(o.text, o.id);
      });
    }
  });
  return lookup;
}

/**
 * Get matching curriculum pages for a given subject, grade, and strand.
 */
export function getCurriculumMatches(subject: string, grade: string, strand: string) {
  if (!subject || !grade || !strand) return [];
  return getCurriculumPages().filter((page: any) =>
    page.subject?.toLowerCase() === subject.toLowerCase() &&
    page.grade === grade &&
    page.strand?.toLowerCase().includes(strand.toLowerCase())
  );
}
