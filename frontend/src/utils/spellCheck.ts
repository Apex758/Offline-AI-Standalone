// Lightweight spell-check engine with built-in dictionary
// Loads lazily, runs synchronously after init, zero network dependency

let dictionary: Set<string> | null = null;
let customWords: Set<string> = new Set();

// Load custom words from localStorage
function loadCustomWords(): Set<string> {
  try {
    const stored = localStorage.getItem('spell-check-custom-words');
    if (stored) return new Set(JSON.parse(stored));
  } catch { /* ignore */ }
  return new Set();
}

function saveCustomWords() {
  try {
    localStorage.setItem('spell-check-custom-words', JSON.stringify([...customWords]));
  } catch { /* ignore */ }
}

export function addCustomWord(word: string) {
  customWords.add(word.toLowerCase());
  saveCustomWords();
}

export function removeCustomWord(word: string) {
  customWords.delete(word.toLowerCase());
  saveCustomWords();
}

// Core dictionary - comprehensive English word list
// Organized by frequency/category for maintainability
function buildDictionary(): Set<string> {
  const words = new Set<string>();

  // Helper to add words and common forms
  function addBase(w: string) {
    words.add(w);
  }
  function addWithPlural(w: string) {
    words.add(w);
    if (w.endsWith('y') && !/[aeiou]y$/.test(w)) {
      words.add(w.slice(0, -1) + 'ies');
    } else if (w.endsWith('s') || w.endsWith('sh') || w.endsWith('ch') || w.endsWith('x') || w.endsWith('z')) {
      words.add(w + 'es');
    } else {
      words.add(w + 's');
    }
  }
  function addVerb(base: string, past?: string, pastPart?: string, present?: string) {
    words.add(base);
    words.add(present || (base.endsWith('e') ? base.slice(0, -1) + 'ing' : base + 'ing'));
    words.add(base + 's');
    if (base.endsWith('e')) {
      words.add(base + 'd');
      words.add(base + 's');
    }
    if (past) words.add(past);
    if (pastPart) words.add(pastPart);
    // Common -ed form
    if (!past) {
      if (base.endsWith('e')) words.add(base + 'd');
      else words.add(base + 'ed');
    }
  }
  function addAdj(w: string) {
    words.add(w);
    words.add(w + 'ly');
    if (w.endsWith('e')) {
      words.add(w + 'r');
      words.add(w + 'st');
    } else if (w.endsWith('y')) {
      words.add(w.slice(0, -1) + 'ier');
      words.add(w.slice(0, -1) + 'iest');
      words.add(w.slice(0, -1) + 'ily');
    }
  }

  // ---- FUNCTION WORDS (articles, prepositions, conjunctions, pronouns) ----
  const functionWords = 'a an the and or but nor for yet so if then else when where how what which who whom whose why because since although though while until unless before after as than that this these those he she it they we you i me him her us them my your his its our their mine yours hers ours theirs myself yourself himself herself itself ourselves themselves each every either neither both all any few many much several some no not none such here there to of in on at by from with into onto upon about above below between among through during without within along across behind beyond near toward towards under over up down out off around';
  functionWords.split(' ').forEach(addBase);

  // ---- COMMON VERBS ----
  addVerb('be', 'was', 'been', 'being'); 'am is are were'.split(' ').forEach(addBase);
  addVerb('have', 'had', 'had', 'having'); addBase('has');
  addVerb('do', 'did', 'done', 'doing'); addBase('does');
  addVerb('say', 'said', 'said', 'saying');
  addVerb('get', 'got', 'gotten', 'getting');
  addVerb('make', 'made', 'made', 'making');
  addVerb('go', 'went', 'gone', 'going'); addBase('goes');
  addVerb('know', 'knew', 'known', 'knowing');
  addVerb('take', 'took', 'taken', 'taking');
  addVerb('see', 'saw', 'seen', 'seeing');
  addVerb('come', 'came', 'come', 'coming');
  addVerb('think', 'thought', 'thought', 'thinking');
  addVerb('look', 'looked', 'looked', 'looking');
  addVerb('want'); addVerb('give', 'gave', 'given', 'giving');
  addVerb('use'); addVerb('find', 'found', 'found', 'finding');
  addVerb('tell', 'told', 'told', 'telling');
  addVerb('ask'); addVerb('work'); addVerb('seem');
  addVerb('feel', 'felt', 'felt', 'feeling');
  addVerb('try', 'tried', 'tried', 'trying'); addBase('tries');
  addVerb('leave', 'left', 'left', 'leaving');
  addVerb('call'); addVerb('need'); addVerb('become', 'became', 'become', 'becoming');
  addVerb('keep', 'kept', 'kept', 'keeping');
  addVerb('let', 'let', 'let', 'letting');
  addVerb('begin', 'began', 'begun', 'beginning');
  addVerb('show', 'showed', 'shown', 'showing');
  addVerb('hear', 'heard', 'heard', 'hearing');
  addVerb('play'); addVerb('run', 'ran', 'run', 'running');
  addVerb('move'); addVerb('live'); addVerb('believe');
  addVerb('hold', 'held', 'held', 'holding');
  addVerb('bring', 'brought', 'brought', 'bringing');
  addVerb('happen'); addVerb('write', 'wrote', 'written', 'writing');
  addVerb('provide'); addVerb('sit', 'sat', 'sat', 'sitting');
  addVerb('stand', 'stood', 'stood', 'standing');
  addVerb('lose', 'lost', 'lost', 'losing');
  addVerb('pay', 'paid', 'paid', 'paying');
  addVerb('meet', 'met', 'met', 'meeting');
  addVerb('include'); addVerb('continue'); addVerb('set', 'set', 'set', 'setting');
  addVerb('learn', 'learned', 'learned', 'learning'); addBase('learnt');
  addVerb('change'); addVerb('lead', 'led', 'led', 'leading');
  addVerb('understand', 'understood', 'understood', 'understanding');
  addVerb('watch'); addVerb('follow'); addVerb('stop', 'stopped', 'stopped', 'stopping');
  addVerb('create'); addVerb('speak', 'spoke', 'spoken', 'speaking');
  addVerb('read', 'read', 'read', 'reading');
  addVerb('allow'); addVerb('add'); addVerb('spend', 'spent', 'spent', 'spending');
  addVerb('grow', 'grew', 'grown', 'growing');
  addVerb('open'); addVerb('walk'); addVerb('win', 'won', 'won', 'winning');
  addVerb('offer'); addVerb('remember'); addVerb('love');
  addVerb('consider'); addVerb('appear'); addVerb('buy', 'bought', 'bought', 'buying');
  addVerb('wait'); addVerb('serve'); addVerb('die', 'died', 'died', 'dying');
  addVerb('send', 'sent', 'sent', 'sending');
  addVerb('expect'); addVerb('build', 'built', 'built', 'building');
  addVerb('stay'); addVerb('fall', 'fell', 'fallen', 'falling');
  addVerb('cut', 'cut', 'cut', 'cutting');
  addVerb('reach'); addVerb('kill'); addVerb('remain');
  addVerb('suggest'); addVerb('raise'); addVerb('pass');
  addVerb('sell', 'sold', 'sold', 'selling');
  addVerb('require'); addVerb('report'); addVerb('decide');
  addVerb('pull'); addVerb('develop'); addVerb('describe');
  addVerb('agree'); addVerb('receive'); addVerb('achieve');
  addVerb('draw', 'drew', 'drawn', 'drawing');
  addVerb('choose', 'chose', 'chosen', 'choosing');
  addVerb('answer'); addVerb('support'); addVerb('explain');
  addVerb('plan', 'planned', 'planned', 'planning');
  addVerb('manage'); addVerb('accept'); addVerb('determine');
  addVerb('prepare'); addVerb('discuss'); addVerb('prove');
  addVerb('teach', 'taught', 'taught', 'teaching');
  addVerb('help'); addVerb('start'); addVerb('turn'); addVerb('place');
  addVerb('produce'); addVerb('present'); addVerb('like'); addVerb('share');
  addVerb('note'); addVerb('mark'); addVerb('check'); addVerb('form');
  addVerb('state'); addVerb('cover'); addVerb('remove'); addVerb('test');
  addVerb('involve'); addVerb('complete'); addVerb('identify');
  addVerb('apply', 'applied', 'applied', 'applying'); addBase('applies');
  addVerb('study', 'studied', 'studied', 'studying'); addBase('studies');
  addVerb('assess'); addVerb('evaluate'); addVerb('analyze');
  addVerb('observe'); addVerb('demonstrate'); addVerb('participate');
  addVerb('communicate'); addVerb('engage'); addVerb('explore');
  addVerb('design'); addVerb('implement'); addVerb('organize');
  addVerb('review'); addVerb('practice'); addVerb('collaborate');
  addVerb('integrate'); addVerb('differentiate'); addVerb('accommodate');
  addVerb('scaffold'); addVerb('facilitate'); addVerb('motivate');
  addVerb('encourage'); addVerb('guide'); addVerb('model');
  addVerb('measure'); addVerb('monitor'); addVerb('adapt');
  addVerb('modify'); addVerb('adjust'); addVerb('enhance');
  addVerb('reinforce'); addVerb('summarize'); addVerb('calculate');
  addVerb('solve'); addVerb('classify'); addVerb('compare');
  addVerb('contrast'); addVerb('define'); addVerb('illustrate');
  addVerb('investigate'); addVerb('predict'); addVerb('conclude');
  addVerb('respond'); addVerb('connect'); addVerb('relate');
  addVerb('generate'); addVerb('compose'); addVerb('construct');
  addVerb('select'); addVerb('collect'); addVerb('record');
  addVerb('research'); addVerb('interpret'); addVerb('justify');
  addVerb('examine'); addVerb('detect'); addVerb('establish');
  addVerb('indicate'); addVerb('recognize'); addVerb('reflect');
  addVerb('represent'); addVerb('transform'); addVerb('combine');
  addVerb('introduce'); addVerb('maintain'); addVerb('obtain');
  addVerb('contain'); addVerb('improve'); addVerb('increase');
  addVerb('reduce'); addVerb('avoid'); addVerb('cause');
  addVerb('enable'); addVerb('ensure'); addVerb('perform');
  addVerb('handle'); addVerb('process'); addVerb('attempt');
  addVerb('attend'); addVerb('express'); addVerb('focus');
  addVerb('assume'); addVerb('exist'); addVerb('occur');
  addVerb('depend'); addVerb('save'); addVerb('close');
  addVerb('feature'); addVerb('structure'); addVerb('value');

  // ---- COMMON NOUNS ----
  const nouns = [
    'time', 'year', 'people', 'way', 'day', 'man', 'woman', 'child', 'children',
    'world', 'life', 'hand', 'part', 'place', 'case', 'week', 'company',
    'system', 'program', 'question', 'work', 'government', 'number', 'night',
    'point', 'home', 'water', 'room', 'mother', 'area', 'money', 'story',
    'fact', 'month', 'lot', 'right', 'study', 'book', 'eye', 'job', 'word',
    'business', 'issue', 'side', 'kind', 'head', 'house', 'service', 'friend',
    'father', 'power', 'hour', 'game', 'line', 'end', 'member', 'law', 'car',
    'city', 'community', 'name', 'president', 'team', 'minute', 'idea', 'body',
    'information', 'back', 'parent', 'face', 'others', 'level', 'office',
    'door', 'health', 'person', 'art', 'war', 'history', 'party', 'result',
    'change', 'morning', 'reason', 'girl', 'guy', 'moment', 'air', 'teacher',
    'force', 'education', 'student', 'class', 'group', 'problem', 'family',
    'school', 'country', 'thing', 'state', 'example', 'age', 'food',
    'music', 'paper', 'language', 'color', 'colour', 'experience', 'society',
    'activity', 'area', 'form', 'table', 'answer', 'section', 'subject',
    'lesson', 'plan', 'grade', 'level', 'standard', 'skill', 'knowledge',
    'objective', 'goal', 'strategy', 'method', 'approach', 'technique',
    'resource', 'material', 'tool', 'assessment', 'evaluation', 'test',
    'quiz', 'exam', 'examination', 'rubric', 'criteria', 'criterion',
    'performance', 'achievement', 'progress', 'development', 'growth',
    'improvement', 'outcome', 'result', 'success', 'feedback', 'comment',
    'instruction', 'direction', 'procedure', 'process', 'step', 'stage',
    'phase', 'period', 'term', 'semester', 'quarter', 'year', 'schedule',
    'curriculum', 'syllabus', 'content', 'topic', 'theme', 'concept',
    'theory', 'principle', 'rule', 'guideline', 'framework', 'model',
    'structure', 'pattern', 'format', 'style', 'type', 'category',
    'classification', 'distinction', 'difference', 'similarity', 'comparison',
    'contrast', 'relationship', 'connection', 'link', 'association',
    'interaction', 'communication', 'discussion', 'conversation', 'dialogue',
    'debate', 'presentation', 'demonstration', 'explanation', 'description',
    'definition', 'interpretation', 'analysis', 'synthesis', 'summary',
    'review', 'report', 'essay', 'article', 'paragraph', 'sentence',
    'word', 'letter', 'character', 'symbol', 'number', 'figure', 'chart',
    'graph', 'diagram', 'image', 'picture', 'photo', 'photograph', 'video',
    'audio', 'recording', 'document', 'file', 'folder', 'page', 'chapter',
    'unit', 'module', 'course', 'program', 'project', 'task', 'assignment',
    'homework', 'practice', 'exercise', 'drill', 'worksheet', 'workbook',
    'textbook', 'reference', 'source', 'bibliography', 'citation',
    'note', 'notebook', 'journal', 'diary', 'portfolio', 'collection',
    'data', 'evidence', 'proof', 'support', 'argument', 'claim',
    'opinion', 'view', 'perspective', 'position', 'stance', 'attitude',
    'belief', 'value', 'norm', 'expectation', 'requirement', 'standard',
    'benchmark', 'target', 'aim', 'purpose', 'intention', 'motivation',
    'interest', 'enthusiasm', 'passion', 'commitment', 'dedication',
    'effort', 'attention', 'focus', 'concentration', 'awareness',
    'understanding', 'comprehension', 'insight', 'wisdom', 'intelligence',
    'ability', 'capability', 'capacity', 'potential', 'talent', 'gift',
    'strength', 'weakness', 'challenge', 'difficulty', 'obstacle',
    'barrier', 'limitation', 'constraint', 'opportunity', 'possibility',
    'option', 'choice', 'decision', 'solution', 'resolution', 'response',
    'reaction', 'effect', 'impact', 'influence', 'consequence',
    'benefit', 'advantage', 'disadvantage', 'risk', 'danger', 'threat',
    'safety', 'security', 'protection', 'prevention', 'care',
    'need', 'necessity', 'demand', 'request', 'wish', 'desire', 'hope',
    'dream', 'imagination', 'creativity', 'innovation', 'invention',
    'discovery', 'exploration', 'adventure', 'journey', 'trip', 'travel',
    'beginning', 'start', 'origin', 'source', 'cause', 'reason',
    'meaning', 'significance', 'importance', 'relevance',
    'quality', 'quantity', 'amount', 'size', 'shape', 'weight',
    'height', 'width', 'length', 'depth', 'distance', 'space',
    'area', 'volume', 'surface', 'edge', 'corner', 'center', 'centre',
    'middle', 'top', 'bottom', 'front', 'back', 'left', 'right',
    'north', 'south', 'east', 'west', 'direction', 'position',
    'location', 'place', 'site', 'spot', 'region', 'zone', 'territory',
    'environment', 'nature', 'climate', 'weather', 'temperature',
    'season', 'spring', 'summer', 'autumn', 'fall', 'winter',
    'sun', 'moon', 'star', 'sky', 'cloud', 'rain', 'snow', 'wind',
    'storm', 'ocean', 'sea', 'river', 'lake', 'mountain', 'hill',
    'valley', 'forest', 'jungle', 'desert', 'island', 'beach', 'coast',
    'land', 'earth', 'soil', 'rock', 'stone', 'sand', 'plant', 'tree',
    'flower', 'grass', 'leaf', 'leaves', 'root', 'seed', 'fruit',
    'vegetable', 'animal', 'bird', 'fish', 'dog', 'cat', 'horse',
    'science', 'mathematics', 'math', 'maths', 'arithmetic', 'algebra',
    'geometry', 'calculus', 'statistics', 'biology', 'chemistry', 'physics',
    'ecology', 'geology', 'astronomy', 'geography', 'psychology',
    'sociology', 'philosophy', 'literature', 'poetry', 'fiction',
    'technology', 'computer', 'internet', 'software', 'hardware',
    'database', 'network', 'website', 'application', 'device', 'machine',
    'energy', 'electricity', 'light', 'heat', 'sound', 'wave',
    'equation', 'formula', 'variable', 'function', 'factor', 'element',
    'compound', 'mixture', 'reaction', 'experiment', 'hypothesis',
    'observation', 'conclusion', 'evidence', 'measurement', 'unit',
    'percent', 'percentage', 'fraction', 'decimal', 'ratio', 'proportion',
    'average', 'mean', 'median', 'mode', 'range', 'total', 'sum',
    'difference', 'product', 'quotient', 'remainder', 'whole',
    'half', 'third', 'quarter', 'fifth', 'tenth', 'hundred', 'thousand',
    'million', 'billion', 'zero', 'one', 'two', 'three', 'four', 'five',
    'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
    'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
    'eighteen', 'nineteen', 'twenty', 'thirty', 'forty', 'fifty',
    'sixty', 'seventy', 'eighty', 'ninety',
    'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh',
    'eighth', 'ninth', 'tenth', 'last', 'next', 'previous',
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December',
    'today', 'tomorrow', 'yesterday', 'tonight', 'weekend',
    'king', 'queen', 'prince', 'princess', 'president', 'minister',
    'leader', 'manager', 'director', 'officer', 'official', 'agent',
    'soldier', 'doctor', 'nurse', 'lawyer', 'judge', 'writer',
    'author', 'artist', 'actor', 'singer', 'player', 'coach',
    'captain', 'chief', 'boss', 'owner', 'founder', 'member',
    'brother', 'sister', 'son', 'daughter', 'husband', 'wife',
    'uncle', 'aunt', 'cousin', 'nephew', 'niece', 'grandfather',
    'grandmother', 'grandson', 'granddaughter', 'baby', 'kid', 'teen',
    'teenager', 'adult', 'elder', 'youth', 'citizen', 'resident',
    'neighbor', 'stranger', 'visitor', 'guest', 'host', 'audience',
    'crowd', 'population', 'nation', 'culture', 'tradition', 'custom',
    'religion', 'faith', 'church', 'temple', 'mosque',
    'building', 'tower', 'bridge', 'road', 'street', 'path', 'highway',
    'airport', 'station', 'hospital', 'museum', 'library', 'theater',
    'restaurant', 'hotel', 'store', 'shop', 'market', 'bank',
    'classroom', 'laboratory', 'gymnasium', 'playground', 'cafeteria',
    'office', 'bedroom', 'bathroom', 'kitchen', 'garden', 'yard',
    'wall', 'floor', 'ceiling', 'roof', 'window', 'stairs',
    'chair', 'desk', 'board', 'screen', 'keyboard', 'mouse', 'pen',
    'pencil', 'eraser', 'ruler', 'scissors', 'glue', 'tape', 'marker',
    'crayon', 'paint', 'brush', 'canvas', 'clay', 'paper',
    'cup', 'glass', 'plate', 'bowl', 'bottle', 'box', 'bag', 'basket',
    'clock', 'watch', 'phone', 'camera', 'radio', 'television', 'tv',
    'morning', 'afternoon', 'evening', 'night', 'midnight', 'noon',
    'breakfast', 'lunch', 'dinner', 'meal', 'snack', 'drink',
    'bread', 'rice', 'meat', 'chicken', 'beef', 'pork', 'fish',
    'egg', 'milk', 'cheese', 'butter', 'sugar', 'salt', 'pepper',
    'oil', 'flour', 'cake', 'pie', 'cookie', 'chocolate', 'candy',
    'apple', 'orange', 'banana', 'grape', 'strawberry', 'mango',
    'shirt', 'pants', 'dress', 'shoes', 'hat', 'coat', 'jacket',
    'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink',
    'black', 'white', 'brown', 'gray', 'grey', 'silver', 'gold',
    'hundred', 'thousands', 'millions', 'pair', 'dozen', 'set',
    'island', 'continent', 'hemisphere', 'equator', 'latitude', 'longitude',
    'map', 'globe', 'atlas', 'compass',
    'paragraph', 'essay', 'composition', 'narrative', 'story',
    'poem', 'verse', 'stanza', 'rhyme', 'rhythm', 'meter', 'metre',
    'character', 'protagonist', 'antagonist', 'narrator', 'author',
    'plot', 'setting', 'conflict', 'resolution', 'climax', 'theme',
    'genre', 'fiction', 'nonfiction', 'biography', 'autobiography',
    'myth', 'legend', 'fable', 'fairy', 'tale', 'novel', 'drama',
    'comedy', 'tragedy', 'satire', 'irony', 'metaphor', 'simile',
    'personification', 'alliteration', 'onomatopoeia', 'hyperbole',
    'noun', 'verb', 'adjective', 'adverb', 'pronoun', 'preposition',
    'conjunction', 'interjection', 'article', 'clause', 'phrase',
    'prefix', 'suffix', 'root', 'syllable', 'vowel', 'consonant',
    'singular', 'plural', 'tense', 'past', 'present', 'future',
    'subject', 'predicate', 'object', 'complement', 'modifier',
    'punctuation', 'comma', 'period', 'colon', 'semicolon',
    'apostrophe', 'quotation', 'parenthesis', 'bracket', 'dash',
    'addition', 'subtraction', 'multiplication', 'division',
    'numerator', 'denominator', 'integer', 'exponent', 'square',
    'cube', 'circle', 'triangle', 'rectangle', 'polygon', 'angle',
    'parallel', 'perpendicular', 'diagonal', 'radius', 'diameter',
    'circumference', 'perimeter', 'symmetry', 'congruent', 'similar',
    'coordinate', 'axis', 'axes', 'origin', 'slope', 'intercept',
    'inequality', 'expression', 'coefficient', 'constant', 'term',
    'probability', 'frequency', 'distribution', 'sample', 'survey',
    'cell', 'tissue', 'organ', 'organism', 'species', 'habitat',
    'ecosystem', 'biodiversity', 'evolution', 'adaptation', 'mutation',
    'gene', 'chromosome', 'DNA', 'protein', 'enzyme', 'hormone',
    'photosynthesis', 'respiration', 'digestion', 'circulation',
    'nervous', 'skeletal', 'muscular', 'immune', 'reproductive',
    'atom', 'molecule', 'electron', 'proton', 'neutron', 'nucleus',
    'mass', 'density', 'gravity', 'force', 'motion', 'velocity',
    'acceleration', 'momentum', 'friction', 'pressure', 'temperature',
    'magnet', 'magnetic', 'electric', 'circuit', 'current', 'voltage',
    'resistance', 'conductor', 'insulator', 'semiconductor',
    'continent', 'ocean', 'pacific', 'atlantic', 'indian', 'arctic',
    'africa', 'asia', 'europe', 'antarctica', 'australia',
    'america', 'americas', 'caribbean', 'island', 'islands',
    'peninsula', 'plateau', 'plain', 'delta', 'basin', 'bay', 'gulf',
    'strait', 'canal', 'harbor', 'harbour', 'port',
    'democracy', 'republic', 'monarchy', 'constitution', 'amendment',
    'legislation', 'regulation', 'policy', 'election', 'vote', 'ballot',
    'citizen', 'rights', 'freedom', 'liberty', 'justice', 'equality',
    'economy', 'trade', 'commerce', 'industry', 'agriculture',
    'manufacturing', 'production', 'consumption', 'supply', 'demand',
    'market', 'price', 'cost', 'profit', 'loss', 'income', 'wage',
    'salary', 'tax', 'budget', 'debt', 'credit', 'investment',
    'accommodation', 'accommodations', 'differentiation', 'scaffolding',
    'kindergarten', 'preschool', 'elementary', 'primary', 'secondary',
    'high', 'college', 'university', 'graduate', 'undergraduate',
    'diploma', 'degree', 'certificate', 'credential', 'qualification',
    'pedagogy', 'didactic', 'andragogy', 'methodology', 'instructional',
    'formative', 'summative', 'diagnostic', 'standardized', 'norm',
    'strand', 'benchmark', 'indicator', 'proficiency', 'mastery',
    'literacy', 'numeracy', 'fluency', 'comprehension', 'vocabulary',
    'phonics', 'phonemic', 'decoding', 'encoding', 'blending',
    'segmenting', 'sight', 'spelling', 'grammar', 'syntax', 'semantics',
    'pragmatics', 'morphology', 'etymology', 'linguistics',
    'multiplication', 'area', 'volume', 'perimeter', 'circumference',
    'estimation', 'rounding', 'regrouping', 'borrowing', 'carrying',
    'manipulative', 'manipulatives', 'counters', 'blocks', 'tiles',
  ];
  nouns.forEach(n => addWithPlural(n));

  // ---- ADJECTIVES ----
  const adjectives = [
    'good', 'new', 'first', 'last', 'long', 'great', 'little', 'own', 'other',
    'old', 'right', 'big', 'high', 'different', 'small', 'large', 'next',
    'early', 'young', 'important', 'few', 'public', 'bad', 'same', 'able',
    'free', 'full', 'sure', 'true', 'whole', 'real', 'best', 'better',
    'clear', 'close', 'common', 'current', 'deep', 'easy', 'effective',
    'entire', 'final', 'general', 'hard', 'hot', 'late', 'local', 'low',
    'main', 'major', 'national', 'natural', 'nice', 'open', 'particular',
    'past', 'personal', 'physical', 'poor', 'possible', 'private',
    'ready', 'recent', 'serious', 'short', 'significant', 'similar',
    'simple', 'single', 'social', 'special', 'specific', 'strong',
    'total', 'various', 'wide', 'wrong', 'available', 'basic',
    'beautiful', 'black', 'central', 'certain', 'cold', 'complete',
    'critical', 'dark', 'dead', 'direct', 'economic', 'environmental',
    'essential', 'exact', 'fair', 'fast', 'financial', 'fine',
    'foreign', 'happy', 'heavy', 'huge', 'human', 'individual',
    'initial', 'key', 'light', 'likely', 'medical', 'mental',
    'military', 'modern', 'normal', 'obvious', 'original', 'perfect',
    'political', 'popular', 'positive', 'professional', 'proud',
    'quick', 'quiet', 'rapid', 'rare', 'relevant', 'responsible',
    'rich', 'safe', 'scientific', 'sharp', 'sick', 'smooth', 'soft',
    'solid', 'standard', 'strange', 'successful', 'sudden', 'sufficient',
    'sweet', 'tall', 'thick', 'thin', 'tight', 'tiny', 'top', 'tough',
    'traditional', 'typical', 'unique', 'useful', 'usual', 'valuable',
    'visible', 'visual', 'warm', 'weak', 'wild', 'willing', 'wise',
    'wonderful', 'appropriate', 'academic', 'cognitive', 'collaborative',
    'comprehensive', 'creative', 'cultural', 'diverse', 'educational',
    'emotional', 'engaging', 'flexible', 'fundamental', 'global',
    'inclusive', 'independent', 'innovative', 'interactive', 'linguistic',
    'logical', 'meaningful', 'oral', 'practical', 'primary', 'secondary',
    'strategic', 'structural', 'technical', 'verbal', 'written',
    'correct', 'incorrect', 'accurate', 'inaccurate', 'appropriate',
    'inappropriate', 'adequate', 'inadequate', 'relevant', 'irrelevant',
    'explicit', 'implicit', 'concrete', 'abstract', 'literal', 'figurative',
    'active', 'passive', 'formal', 'informal', 'complex', 'compound',
  ];
  adjectives.forEach(addAdj);
  // Irregular comparatives
  'best worst better worse less least more most fewer fewest'.split(' ').forEach(addBase);

  // ---- ADVERBS ----
  const adverbs = [
    'not', 'also', 'very', 'often', 'however', 'too', 'usually', 'really',
    'already', 'always', 'never', 'sometimes', 'together', 'perhaps',
    'almost', 'enough', 'quite', 'yet', 'still', 'even', 'again',
    'once', 'twice', 'ever', 'soon', 'anyway', 'indeed', 'therefore',
    'thus', 'hence', 'furthermore', 'moreover', 'nevertheless',
    'meanwhile', 'otherwise', 'instead', 'rather', 'simply', 'merely',
    'exactly', 'primarily', 'essentially', 'approximately', 'generally',
    'specifically', 'particularly', 'increasingly', 'effectively',
    'significantly', 'considerably', 'substantially', 'accordingly',
  ];
  adverbs.forEach(addBase);

  // ---- CONTRACTIONS ----
  const contractions = [
    "don't", "doesn't", "didn't", "isn't", "wasn't", "weren't", "aren't",
    "won't", "can't", "couldn't", "shouldn't", "wouldn't", "hasn't",
    "haven't", "hadn't", "you're", "they're", "we're", "he's", "she's",
    "it's", "who's", "what's", "that's", "there's", "here's", "where's",
    "let's", "I've", "you've", "we've", "they've", "I'm", "you'll",
    "we'll", "they'll", "I'll", "it'll", "that'll", "who'll", "I'd",
    "you'd", "he'd", "she'd", "we'd", "they'd",
  ];
  contractions.forEach(addBase);

  // ---- MISC common words ----
  const misc = [
    'ok', 'okay', 'yes', 'no', 'yeah', 'please', 'thank', 'thanks',
    'sorry', 'hello', 'hi', 'hey', 'goodbye', 'bye', 'welcome',
    'Mr', 'Mrs', 'Ms', 'Dr', 'Jr', 'Sr', 'etc', 'vs', 'eg', 'ie',
    'aka', 'dept', 'est', 'govt', 'inc', 'ltd', 'max', 'min', 'misc',
    'est', 'approx', 'avg', 'qty', 'ref', 'req', 'spec', 'temp',
    'cannot', 'could', 'would', 'should', 'shall', 'will', 'may', 'might',
    'must', 'ought', 'can', 'been', 'being', 'having', 'doing',
    'gets', 'puts', 'goes', 'says', 'sees', 'does', 'has',
    'men', 'women', 'feet', 'teeth', 'mice', 'geese', 'oxen',
    'datum', 'media', 'criteria', 'phenomena', 'alumni', 'analyses',
    'bases', 'crises', 'diagnoses', 'hypotheses', 'parentheses', 'syntheses', 'theses',
    'per', 'via', 'versus',
    'OECS', 'Assistant', 'AI',
    'St', 'Lucia', 'Vincent', 'Grenadines', 'Grenada', 'Dominica',
    'Antigua', 'Barbuda', 'Kitts', 'Nevis', 'Montserrat', 'Anguilla',
    'Caribbean', 'West', 'Indies',
  ];
  misc.forEach(addBase);

  // Add all lowercase versions too
  const toAdd: string[] = [];
  words.forEach(w => {
    toAdd.push(w.toLowerCase());
    // Also add Title Case version
    if (w.length > 0) {
      toAdd.push(w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    }
  });
  toAdd.forEach(w => words.add(w));

  return words;
}

// Initialize dictionary (lazy)
function getDictionary(): Set<string> {
  if (!dictionary) {
    dictionary = buildDictionary();
    customWords = loadCustomWords();
  }
  return dictionary;
}

// Check if a word is correctly spelled
export function isWordCorrect(word: string): boolean {
  if (!word || word.length <= 1) return true;

  // Skip numbers, URLs, emails, paths
  if (/^\d+$/.test(word)) return true;
  if (/^https?:\/\//i.test(word)) return true;
  if (/@/.test(word)) return true;
  if (/[/\\]/.test(word)) return true;
  // Skip words with numbers mixed in
  if (/\d/.test(word)) return true;
  // Skip ALL CAPS (acronyms)
  if (word === word.toUpperCase() && word.length <= 6) return true;

  const dict = getDictionary();

  // Check exact match
  if (dict.has(word)) return true;
  // Check lowercase
  if (dict.has(word.toLowerCase())) return true;
  // Check if it's in custom words
  if (customWords.has(word.toLowerCase())) return true;

  // Check possessive form (student's -> student)
  if (word.endsWith("'s") || word.endsWith("\u2019s")) {
    const base = word.slice(0, -2);
    if (dict.has(base) || dict.has(base.toLowerCase()) || customWords.has(base.toLowerCase())) return true;
  }

  return false;
}

export interface MisspelledWord {
  word: string;
  start: number; // character index in text
  end: number;
}

// Find all misspelled words in text
export function findMisspelledWords(text: string): MisspelledWord[] {
  const results: MisspelledWord[] = [];
  // Match word boundaries - handles contractions with apostrophes
  const wordRegex = /[a-zA-Z\u2019']+/g;
  let match;

  while ((match = wordRegex.exec(text)) !== null) {
    const word = match[0];
    // Skip if it's just apostrophes
    if (/^['\u2019]+$/.test(word)) continue;

    if (!isWordCorrect(word)) {
      results.push({
        word,
        start: match.index,
        end: match.index + word.length,
      });
    }
  }

  return results;
}

// Generate spelling suggestions using edit distance
export function getSuggestions(word: string, maxSuggestions = 5): string[] {
  const dict = getDictionary();
  const lowerWord = word.toLowerCase();
  const candidates: Array<{ word: string; distance: number }> = [];

  // Only search words of similar length (optimization)
  const minLen = Math.max(1, lowerWord.length - 2);
  const maxLen = lowerWord.length + 2;

  dict.forEach(dictWord => {
    const dw = dictWord.toLowerCase();
    if (dw.length < minLen || dw.length > maxLen) return;
    // Quick skip: if first letters are very different
    if (Math.abs(dw.charCodeAt(0) - lowerWord.charCodeAt(0)) > 3 &&
        dw[0] !== lowerWord[0]) return;

    const dist = editDistance(lowerWord, dw);
    if (dist <= 2) {
      candidates.push({ word: dictWord, distance: dist });
    }
  });

  // Sort by distance, then alphabetically
  candidates.sort((a, b) => a.distance - b.distance || a.word.localeCompare(b.word));

  // Match original case pattern
  const isCapitalized = word[0] === word[0].toUpperCase();
  return candidates.slice(0, maxSuggestions).map(c => {
    if (isCapitalized) {
      return c.word.charAt(0).toUpperCase() + c.word.slice(1);
    }
    return c.word.toLowerCase();
  });
}

// Levenshtein edit distance (optimized with early termination)
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // Quick check: if length difference > 2, skip
  if (Math.abs(a.length - b.length) > 2) return 3;

  const matrix: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= a.length; i++) {
    let rowMin = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );

      // Check for transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + cost);
      }

      rowMin = Math.min(rowMin, matrix[i][j]);
    }
    // Early termination: if minimum in this row is already > 2, stop
    if (rowMin > 2) return 3;
  }

  return matrix[a.length][b.length];
}

// Kept for backward compatibility — dictionary is built lazily on first use via getDictionary()
export function initSpellCheck() {
  getDictionary();
}
