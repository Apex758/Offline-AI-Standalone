// Lazy loader for large curriculum JSON files
// These are loaded on first use instead of bundled into the main chunk

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
