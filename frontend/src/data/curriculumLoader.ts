// Curriculum data loader — loads per-grade-subject JSON files on demand
// Each file contains all strands for that grade+subject combination

import { useState, useEffect } from 'react';

// ---- Types ----

export interface CurriculumSCO {
  sco_code: string;
  description: string;
}

export interface CurriculumELO {
  elo_description: string;
  elo_code?: string;
  specific_curriculum_outcomes: CurriculumSCO[];
  inclusive_assessment_strategies?: string[];
  inclusive_learning_strategies?: string[];
}

export interface CurriculumStrand {
  strand_name: string;
  essential_learning_outcomes: CurriculumELO[];
  resources?: any[];
}

export interface CurriculumFile {
  metadata: {
    filename: string;
    curriculum: string;
    grade: string;   // "1"-"6" or "K"
    subject: string; // "Language Arts", "Mathematics", etc.
  };
  strands: CurriculumStrand[];
}

// ---- File mapping ----

const GRADE_SUBJECT_FILES: Record<string, () => Promise<any>> = {
  'K-Kindergarten-belonging-unit': () => import('./curriculum/kindergarten-belonging-unit.json'),
  'K-Kindergarten-celebrations-unit': () => import('./curriculum/kindergarten-celebrations-unit.json'),
  'K-Kindergarten-games-unit': () => import('./curriculum/kindergarten-games-unit.json'),
  'K-Kindergarten-plants-and-animals-unit': () => import('./curriculum/kindergarten-plants-and-animals-unit.json'),
  'K-Kindergarten-weather-unit': () => import('./curriculum/kindergarten-weather-unit.json'),
  '1-Language Arts': () => import('./curriculum/grade1-language-arts-curriculum.json'),
  '1-Mathematics': () => import('./curriculum/grade1-mathematics-curriculum.json'),
  '1-Science': () => import('./curriculum/grade1-science-curriculum.json'),
  '1-Social Studies': () => import('./curriculum/grade1-social-studies-curriculum.json'),
  '2-Language Arts': () => import('./curriculum/grade2-language-arts-curriculum.json'),
  '2-Mathematics': () => import('./curriculum/grade2-mathematics-curriculum.json'),
  '2-Science': () => import('./curriculum/grade2-science-curriculum.json'),
  '2-Social Studies': () => import('./curriculum/grade2-social-studies-curriculum.json'),
  '3-Language Arts': () => import('./curriculum/grade3-language-arts-curriculum.json'),
  '3-Mathematics': () => import('./curriculum/grade3-mathematics-curriculum.json'),
  '3-Science': () => import('./curriculum/grade3-science-curriculum.json'),
  '3-Social Studies': () => import('./curriculum/grade3-social-studies-curriculum.json'),
  '4-Language Arts': () => import('./curriculum/grade4-language-arts-curriculum.json'),
  '4-Mathematics': () => import('./curriculum/grade4-mathematics-curriculum.json'),
  '4-Science': () => import('./curriculum/grade4-science-curriculum.json'),
  '4-Social Studies': () => import('./curriculum/grade4-social-studies-curriculum.json'),
  '5-Language Arts': () => import('./curriculum/grade5-language-arts-curriculum.json'),
  '5-Mathematics': () => import('./curriculum/grade5-mathematics-curriculum.json'),
  '5-Science': () => import('./curriculum/grade5-science-curriculum.json'),
  '5-Social Studies': () => import('./curriculum/grade5-social-studies-curriculum.json'),
  '6-Language Arts': () => import('./curriculum/grade6-language-arts-curriculum.json'),
  '6-Mathematics': () => import('./curriculum/grade6-mathematics-curriculum.json'),
  '6-Science': () => import('./curriculum/grade6-science-curriculum.json'),
  '6-Social Studies': () => import('./curriculum/grade6-social-studies-curriculum.json'),
};

// ---- Cache ----

const _cache: Record<string, CurriculumFile> = {};
const _promises: Record<string, Promise<CurriculumFile>> = {};

// ---- Grade/subject helpers ----

export function normalizeGrade(grade: string): string {
  const g = grade.trim();
  if (/^k(indergarten)?$/i.test(g)) return 'K';
  const m = g.match(/(\d+)/);
  return m ? m[1] : g;
}

function getFileKey(grade: string, subject: string): string {
  const g = normalizeGrade(grade);
  return `${g}-${subject}`;
}

function getKindergartenUnitKey(unitName: string): string {
  return `K-Kindergarten-${unitName}`;
}

// ---- Core load functions ----

/**
 * Load a curriculum file by grade + subject. Returns cached if already loaded.
 */
export async function loadCurriculum(grade: string, subject: string): Promise<CurriculumFile | null> {
  const key = getFileKey(grade, subject);
  if (_cache[key]) return _cache[key];
  if (_promises[key]) return _promises[key];

  const loader = GRADE_SUBJECT_FILES[key];
  if (!loader) return null;

  _promises[key] = loader().then(m => {
    const data = m.default || m;
    _cache[key] = data;
    return data;
  });

  return _promises[key];
}

/**
 * Load a kindergarten unit file by unit name.
 */
export async function loadKindergartenUnit(unitName: string): Promise<CurriculumFile | null> {
  const key = getKindergartenUnitKey(unitName);
  if (_cache[key]) return _cache[key];
  if (_promises[key]) return _promises[key];

  const loader = GRADE_SUBJECT_FILES[key];
  if (!loader) return null;

  _promises[key] = loader().then(m => {
    const data = m.default || m;
    _cache[key] = data;
    return data;
  });

  return _promises[key];
}

/**
 * Get cached curriculum data synchronously (null if not yet loaded).
 */
export function getCurriculumSync(grade: string, subject: string): CurriculumFile | null {
  return _cache[getFileKey(grade, subject)] || null;
}

// ---- Strand/ELO/SCO accessors ----

/**
 * Get strand names for a grade + subject from cached data.
 */
export function getStrands(grade: string, subject: string): string[] {
  const data = getCurriculumSync(grade, subject);
  if (!data) return [];
  return data.strands.map(s => s.strand_name);
}

/**
 * Get a specific strand's full data.
 */
export function getStrandData(grade: string, subject: string, strandName: string): CurriculumStrand | null {
  const data = getCurriculumSync(grade, subject);
  if (!data) return null;
  return data.strands.find(s => s.strand_name.toLowerCase() === strandName.toLowerCase()) || null;
}

/**
 * Get ELOs for a strand.
 */
export function getELOs(grade: string, subject: string, strandName: string): CurriculumELO[] {
  const strand = getStrandData(grade, subject, strandName);
  if (!strand) return [];
  return strand.essential_learning_outcomes;
}

/**
 * Get SCOs for a specific ELO within a strand.
 */
export function getSCOs(grade: string, subject: string, strandName: string, eloDescription: string): CurriculumSCO[] {
  const elos = getELOs(grade, subject, strandName);
  const elo = elos.find(e => e.elo_description === eloDescription);
  if (!elo) return [];
  return elo.specific_curriculum_outcomes;
}

/**
 * Get assessment strategies for a strand.
 */
export function getAssessmentStrategies(grade: string, subject: string, strandName: string): string[] {
  const elos = getELOs(grade, subject, strandName);
  const strategies: string[] = [];
  for (const elo of elos) {
    if (elo.inclusive_assessment_strategies) {
      strategies.push(...elo.inclusive_assessment_strategies);
    }
  }
  return strategies;
}

/**
 * Get learning strategies for a strand.
 */
export function getLearningStrategies(grade: string, subject: string, strandName: string): string[] {
  const elos = getELOs(grade, subject, strandName);
  const strategies: string[] = [];
  for (const elo of elos) {
    if (elo.inclusive_learning_strategies) {
      strategies.push(...elo.inclusive_learning_strategies);
    }
  }
  return strategies;
}

/**
 * Get resources for a strand.
 */
export function getResources(grade: string, subject: string, strandName: string): any[] {
  const strand = getStrandData(grade, subject, strandName);
  if (!strand) return [];
  return strand.resources || [];
}

// ---- React hooks ----

/**
 * React hook to load curriculum data for a grade + subject.
 * Returns { data, strands, loading }.
 */
export function useCurriculum(grade: string, subject: string) {
  const [data, setData] = useState<CurriculumFile | null>(getCurriculumSync(grade, subject));
  const [loading, setLoading] = useState(!data && !!grade && !!subject);

  useEffect(() => {
    if (!grade || !subject) {
      setData(null);
      setLoading(false);
      return;
    }

    const cached = getCurriculumSync(grade, subject);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    loadCurriculum(grade, subject).then(result => {
      setData(result);
      setLoading(false);
    });
  }, [grade, subject]);

  return {
    data,
    strands: data?.strands || [],
    loading,
  };
}

/**
 * React hook to load a kindergarten unit.
 */
export function useKindergartenUnit(unitName: string) {
  const [data, setData] = useState<CurriculumFile | null>(null);
  const [loading, setLoading] = useState(!!unitName);

  useEffect(() => {
    if (!unitName) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    loadKindergartenUnit(unitName).then(result => {
      setData(result);
      setLoading(false);
    });
  }, [unitName]);

  return { data, strands: data?.strands || [], loading };
}

// ---- Available grades/subjects (static) ----

export const GRADES = ['K', '1', '2', '3', '4', '5', '6'];
export const SUBJECTS = ['Language Arts', 'Mathematics', 'Science', 'Social Studies'];
export const KINDERGARTEN_UNITS = [
  'belonging-unit',
  'celebrations-unit',
  'games-unit',
  'plants-and-animals-unit',
  'weather-unit',
];

// ---- Backward-compat: preload all files for components that need full access ----

let _allLoaded = false;
let _allLoadedPromise: Promise<void> | null = null;

/**
 * Preload all curriculum files. Useful for the Standards browser or backend-like full search.
 */
export async function preloadAllCurriculum(): Promise<void> {
  if (_allLoaded) return;
  if (_allLoadedPromise) return _allLoadedPromise;

  _allLoadedPromise = Promise.all(
    Object.entries(GRADE_SUBJECT_FILES).map(async ([key, loader]) => {
      if (!_cache[key]) {
        const m = await loader();
        _cache[key] = m.default || m;
      }
    })
  ).then(() => { _allLoaded = true; });

  return _allLoadedPromise;
}

/**
 * Get all loaded curriculum files as an array. Must call preloadAllCurriculum() first.
 */
export function getAllCurriculumFiles(): CurriculumFile[] {
  return Object.values(_cache);
}

// ---- Curriculum tree (navigation structure, separate from curriculum data) ----

let _curriculumTree: any = null;
let _treePromise: Promise<any> | null = null;

export async function getCurriculumTree() {
  if (_curriculumTree) return _curriculumTree;
  if (!_treePromise) {
    _treePromise = import('./curriculumTree.json').then(m => {
      _curriculumTree = m.default;
      return _curriculumTree;
    });
  }
  return _treePromise;
}
