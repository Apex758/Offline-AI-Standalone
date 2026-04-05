import { useState, useEffect, useMemo } from 'react';

export interface FieldMapping {
  subject?: string | null;
  gradeLevel?: string | null;
  strand?: string | null;
  essentialOutcomes?: string | null;
  specificOutcomes?: string | null;
}

const DEFAULT_FIELD_MAPPING: FieldMapping = {
  subject: 'subject',
  gradeLevel: 'gradeLevel',
  strand: 'strand',
  essentialOutcomes: 'essentialOutcomes',
  specificOutcomes: 'specificOutcomes',
};

export interface HistoryWithScore<T> extends Record<string, any> {
  _matchScore: number;
  _original: T;
}

export interface HistoryMatchResult<T> {
  matchCount: number;
  matchedHistories: T[];
  unmatchedHistories: T[];
  sortedHistories: T[];
}

function getFieldValue(obj: Record<string, any>, key: string | null | undefined): string {
  if (!key) return '';
  const val = obj?.[key];
  if (typeof val === 'string') return val.trim().toLowerCase();
  return '';
}

function computeScore(
  currentFormData: Record<string, any>,
  historyFormData: Record<string, any>,
  mapping: FieldMapping
): number {
  let score = 0;
  if (!historyFormData) return 0;

  // Exact match fields: subject, gradeLevel
  for (const field of ['subject', 'gradeLevel'] as const) {
    const formKey = mapping[field];
    if (!formKey) continue;
    const currentVal = getFieldValue(currentFormData, formKey);
    const historyVal = getFieldValue(historyFormData, formKey);
    if (currentVal && historyVal && currentVal === historyVal) {
      score++;
    }
  }

  // Includes match fields: strand, essentialOutcomes, specificOutcomes
  for (const field of ['strand', 'essentialOutcomes', 'specificOutcomes'] as const) {
    const formKey = mapping[field];
    if (!formKey) continue;
    const currentVal = getFieldValue(currentFormData, formKey);
    const historyVal = getFieldValue(historyFormData, formKey);
    if (currentVal && historyVal && (historyVal.includes(currentVal) || currentVal.includes(historyVal))) {
      score++;
    }
  }

  return score;
}

export function useHistoryMatching<T extends { formData: Record<string, any>; timestamp?: string }>(
  currentFormData: Record<string, any>,
  histories: T[],
  fieldMapping?: FieldMapping
): HistoryMatchResult<T> {
  const mapping = { ...DEFAULT_FIELD_MAPPING, ...fieldMapping };

  // Debounce form data changes by 300ms
  const [debouncedFormData, setDebouncedFormData] = useState(currentFormData);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFormData(currentFormData), 300);
    return () => clearTimeout(timer);
  }, [currentFormData]);

  return useMemo(() => {
    if (!histories || histories.length === 0) {
      return { matchCount: 0, matchedHistories: [], unmatchedHistories: [], sortedHistories: [] };
    }

    // Check if any matchable field has a value
    const hasAnyValue = ['subject', 'gradeLevel', 'strand', 'essentialOutcomes', 'specificOutcomes'].some(
      (field) => {
        const formKey = mapping[field as keyof FieldMapping];
        return formKey ? getFieldValue(debouncedFormData, formKey) !== '' : false;
      }
    );

    if (!hasAnyValue) {
      return { matchCount: 0, matchedHistories: [], unmatchedHistories: [], sortedHistories: histories };
    }

    const scored = histories.map((item) => ({
      item,
      score: computeScore(debouncedFormData, item.formData, mapping),
    }));

    const matched = scored.filter((s) => s.score > 0).sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // Secondary sort by timestamp descending
      const tA = a.item.timestamp || '';
      const tB = b.item.timestamp || '';
      return tB.localeCompare(tA);
    });

    const unmatched = scored.filter((s) => s.score === 0).sort((a, b) => {
      const tA = a.item.timestamp || '';
      const tB = b.item.timestamp || '';
      return tB.localeCompare(tA);
    });

    const matchedItems = matched.map((s) => s.item);
    const unmatchedItems = unmatched.map((s) => s.item);

    return {
      matchCount: matchedItems.length,
      matchedHistories: matchedItems,
      unmatchedHistories: unmatchedItems,
      sortedHistories: [...matchedItems, ...unmatchedItems],
    };
  }, [debouncedFormData, histories, mapping]);
}
