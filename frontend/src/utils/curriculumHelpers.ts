import {
  getCurriculumSync,
  getStrandData,
  type CurriculumELO,
  type CurriculumSCO,
} from '../data/curriculumLoader';

export interface OutcomeEntry {
  id: string;
  text: string;
  eloRef?: string;
}

/**
 * Get unique strand names for a subject and grade from cached curriculum data.
 */
export function getStrands(subject: string, grade: string): string[] {
  if (!subject || !grade) return [];
  const data = getCurriculumSync(grade, subject);
  if (!data) return [];
  return data.strands.map(s => s.strand_name);
}

/**
 * Get Essential Learning Outcomes as strings for a subject, grade, and strand.
 */
export function getELOs(subject: string, grade: string, strand: string): string[] {
  if (!subject || !grade || !strand) return [];
  const strandData = getStrandData(grade, subject, strand);
  if (!strandData) return [];
  return strandData.essential_learning_outcomes.map(elo => elo.elo_description);
}

/**
 * Get Specific Curriculum Outcomes as strings for a subject, grade, strand, and selected ELO.
 */
export function getSCOs(subject: string, grade: string, strand: string, elo: string): string[] {
  if (!subject || !grade || !strand || !elo) return [];
  const strandData = getStrandData(grade, subject, strand);
  if (!strandData) return [];
  const eloData = strandData.essential_learning_outcomes.find(e => e.elo_description === elo);
  if (!eloData) return [];
  return eloData.specific_curriculum_outcomes.map(sco => sco.description);
}

/**
 * Get ELOs with structured IDs.
 */
export function getELOsStructured(subject: string, grade: string, strand: string): OutcomeEntry[] {
  if (!subject || !grade || !strand) return [];
  const strandData = getStrandData(grade, subject, strand);
  if (!strandData) return [];
  return strandData.essential_learning_outcomes.map(elo => ({
    id: elo.elo_code || '',
    text: elo.elo_description,
  }));
}

/**
 * Get SCOs with structured IDs for a specific ELO.
 */
export function getSCOsStructured(subject: string, grade: string, strand: string, elo: string): OutcomeEntry[] {
  if (!subject || !grade || !strand || !elo) return [];
  const strandData = getStrandData(grade, subject, strand);
  if (!strandData) return [];
  const eloData = strandData.essential_learning_outcomes.find(e => e.elo_description === elo);
  if (!eloData) return [];
  return eloData.specific_curriculum_outcomes.map(sco => ({
    id: sco.sco_code,
    text: sco.description,
    eloRef: eloData.elo_code || '',
  }));
}

/**
 * Build a lookup from outcome text -> ID for all outcomes in a strand.
 */
export function getOutcomeIdLookup(subject: string, grade: string, strand: string): Map<string, string> {
  const lookup = new Map<string, string>();
  if (!subject || !grade || !strand) return lookup;
  const strandData = getStrandData(grade, subject, strand);
  if (!strandData) return lookup;
  for (const elo of strandData.essential_learning_outcomes) {
    if (elo.elo_code) lookup.set(elo.elo_description, elo.elo_code);
    for (const sco of elo.specific_curriculum_outcomes) {
      lookup.set(sco.description, sco.sco_code);
    }
  }
  return lookup;
}

/**
 * Get matching curriculum strands for a given subject, grade, and strand.
 * Returns the strand data wrapped in an array for backward compat.
 */
export function getCurriculumMatches(subject: string, grade: string, strand: string) {
  if (!subject || !grade || !strand) return [];
  const strandData = getStrandData(grade, subject, strand);
  if (!strandData) return [];
  const data = getCurriculumSync(grade, subject);
  const g = data?.metadata.grade || grade;
  const s = data?.metadata.subject || subject;
  const strandSlug = strandData.strand_name.toLowerCase().replace(/\s+/g, '-');
  const gradePrefix = g === 'K' ? 'kindergarten' : `grade${g}`;
  const id = `${gradePrefix}-${s.toLowerCase().replace(/\s+/g, '-')}-${strandSlug}`;
  return [{
    id,
    route: `/curriculum/${gradePrefix}-subjects/${s.toLowerCase().replace(/\s+/g, '-')}/${strandSlug}`,
    grade: g,
    subject: s,
    strand: strandData.strand_name,
    displayName: strandData.strand_name,
    essentialOutcomes: strandData.essential_learning_outcomes.map(e => ({
      id: e.elo_code || '',
      text: e.elo_description,
    })),
    specificOutcomes: strandData.essential_learning_outcomes.flatMap(e =>
      e.specific_curriculum_outcomes.map(sco => ({
        id: sco.sco_code,
        text: sco.description,
        eloRef: e.elo_code || '',
      }))
    ),
  }];
}
