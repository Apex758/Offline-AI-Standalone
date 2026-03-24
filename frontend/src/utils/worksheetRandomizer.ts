/**
 * Seeded randomization engine for worksheet student versions.
 * Uses student ID as seed so each student always gets the same shuffle.
 */

import { WorksheetQuestion, StudentWorksheetVersion, ParsedWorksheet } from '../types/worksheet';

// Simple seeded PRNG (mulberry32)
function createRng(seed: string): () => number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h |= 0; h = h + 0x6D2B79F5 | 0;
    let t = Math.imul(h ^ h >>> 15, 1 | h);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function shuffleWithRng<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function shuffleWithSeed<T>(arr: T[], seed: string): T[] {
  return shuffleWithRng(arr, createRng(seed));
}

/**
 * Shuffle question order for a student.
 * For comprehension: keeps passage questions together (just shuffles order among them).
 */
export function randomizeQuestionOrder(
  questions: WorksheetQuestion[],
  studentId: string,
): WorksheetQuestion[] {
  return shuffleWithSeed(questions, studentId + '_qorder');
}

/**
 * Shuffle MC option order within each question for a student.
 * Returns new questions array with shuffled options and updated correctAnswer index.
 */
export function randomizeOptionOrder(
  questions: WorksheetQuestion[],
  studentId: string,
): { questions: WorksheetQuestion[]; optionMaps: Record<string, number[]> } {
  const optionMaps: Record<string, number[]> = {};

  const shuffled = questions.map((q, qi) => {
    if (!q.options || q.options.length === 0 || q.type !== 'multiple-choice') {
      return q;
    }

    const indices = q.options.map((_, i) => i);
    const shuffledIndices = shuffleWithSeed(indices, studentId + '_opt_' + qi);
    optionMaps[q.id] = shuffledIndices;

    const newOptions = shuffledIndices.map(i => q.options![i]);
    let newCorrectAnswer = q.correctAnswer;
    if (typeof q.correctAnswer === 'number') {
      newCorrectAnswer = shuffledIndices.indexOf(q.correctAnswer);
    }

    return { ...q, options: newOptions, correctAnswer: newCorrectAnswer };
  });

  return { questions: shuffled, optionMaps };
}

/**
 * Shuffle matching Column B for a student.
 * Returns shuffled column and the answer mapping (item# → letter).
 */
export function randomizeMatchingColumns(
  columnA: string[],
  columnB: string[],
  studentId: string,
): { shuffledColumnB: string[]; matchingAnswerMap: Record<number, string> } {
  const indices = columnB.map((_, i) => i);
  const shuffledIndices = shuffleWithSeed(indices, studentId + '_match');
  const shuffledColumnB = shuffledIndices.map(i => columnB[i]);

  // For each item in column A (index i), the correct answer is at the position
  // where columnB[i] ended up in shuffledColumnB
  const matchingAnswerMap: Record<number, string> = {};
  for (let i = 0; i < columnA.length; i++) {
    const newPos = shuffledColumnB.indexOf(columnB[i]);
    matchingAnswerMap[i + 1] = String.fromCharCode(65 + newPos);
  }

  return { shuffledColumnB, matchingAnswerMap };
}

/**
 * Build the correct answer map for a student version after all shuffling.
 */
function buildAnswerMap(questions: WorksheetQuestion[]): Record<string, string | number> {
  const map: Record<string, string | number> = {};
  for (const q of questions) {
    if (q.correctAnswer !== undefined && q.correctAnswer !== '') {
      map[q.id] = q.correctAnswer;
    }
  }
  return map;
}

/**
 * Generate all student versions from a single base worksheet.
 */
export function generateStudentVersions(
  baseWorksheet: ParsedWorksheet,
  students: Array<{ id: string; full_name: string; class_name?: string; grade_level?: string }>,
  randomizeQuestions: boolean,
  randomizeOptions: boolean,
  templateId: string,
): StudentWorksheetVersion[] {
  return students.map(student => {
    let questions = [...baseWorksheet.questions];
    let optionMaps: Record<string, number[]> | undefined;
    let shuffledColumnB: string[] | undefined;
    let matchingAnswerMap: Record<number, string> | undefined;
    let shuffledWordBank: string[] | undefined;

    if (randomizeQuestions && templateId !== 'matching') {
      questions = randomizeQuestionOrder(questions, student.id);
    }

    if (randomizeOptions) {
      if (templateId === 'multiple-choice' || templateId === 'comprehension') {
        const result = randomizeOptionOrder(questions, student.id);
        questions = result.questions;
        optionMaps = result.optionMaps;
      }

      if (templateId === 'matching' && baseWorksheet.matchingItems) {
        const result = randomizeMatchingColumns(
          baseWorksheet.matchingItems.columnA,
          baseWorksheet.matchingItems.columnB,
          student.id,
        );
        shuffledColumnB = result.shuffledColumnB;
        matchingAnswerMap = result.matchingAnswerMap;
      }

      if (templateId === 'list-based' && baseWorksheet.wordBank) {
        shuffledWordBank = shuffleWithSeed(baseWorksheet.wordBank, student.id + '_wb');
      }
    }

    return {
      student,
      questions,
      answerMap: buildAnswerMap(questions),
      optionMaps,
      shuffledColumnB,
      matchingAnswerMap,
      shuffledWordBank,
      printed: false,
    };
  });
}
