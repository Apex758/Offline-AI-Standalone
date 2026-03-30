// Lazy loader for large curriculum JSON files
// These are loaded on first use instead of bundled into the main chunk

import { useState, useEffect } from 'react';

let _curriculumIndex: any = null;
let _curriculumTree: any = null;
let _indexPromise: Promise<any> | null = null;
let _treePromise: Promise<any> | null = null;

export async function getCurriculumIndex() {
  if (_curriculumIndex) return _curriculumIndex;
  if (!_indexPromise) {
    _indexPromise = import('./curriculumIndex.json').then(m => {
      _curriculumIndex = m.default;
      return _curriculumIndex;
    });
  }
  return _indexPromise;
}

/** Synchronous access — returns cached data or null if not yet loaded. */
export function getCurriculumIndexSync(): any | null {
  return _curriculumIndex;
}

/** Get the indexedPages array synchronously (empty array if not loaded yet). */
export function getCurriculumPages(): any[] {
  return _curriculumIndex ? (_curriculumIndex.indexedPages || []) : [];
}

/**
 * React hook for async curriculum index loading.
 * Returns { curriculumIndex, pages, loading }.
 */
export function useCurriculumIndex() {
  const [loaded, setLoaded] = useState(_curriculumIndex !== null);

  useEffect(() => {
    if (_curriculumIndex) {
      setLoaded(true);
      return;
    }
    getCurriculumIndex().then(() => setLoaded(true));
  }, []);

  return {
    curriculumIndex: _curriculumIndex,
    pages: getCurriculumPages(),
    loading: !loaded,
  };
}

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
