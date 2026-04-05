// Common autocorrect mappings - instantly fix common typos on Space/Enter
export const AUTOCORRECT_MAP: Record<string, string> = {
  // Common typos
  'teh': 'the', 'thier': 'their', 'hte': 'the', 'taht': 'that',
  'adn': 'and', 'htat': 'that', 'waht': 'what', 'wiht': 'with',
  'htis': 'this', 'whit': 'with', 'form': 'from', 'fomr': 'from',
  'jsut': 'just', 'ahve': 'have', 'hvae': 'have', 'knwo': 'know',
  'konw': 'know', 'liek': 'like', 'hwo': 'who', 'woudl': 'would',
  'shoudl': 'should', 'coudl': 'could', 'dont': "don't", 'doesnt': "doesn't",
  'didnt': "didn't", 'isnt': "isn't", 'wasnt': "wasn't", 'werent': "weren't",
  'arent': "aren't", 'wont': "won't", 'cant': "can't", 'couldnt': "couldn't",
  'shouldnt': "shouldn't", 'wouldnt': "wouldn't", 'hasnt': "hasn't",
  'havent': "haven't", 'hadnt': "hadn't", 'youre': "you're", 'theyre': "they're",
  'hes': "he's", 'shes': "she's",
  'whos': "who's", 'whats': "what's", 'thats': "that's", 'theres': "there's",
  'heres': "here's", 'wheres': "where's", 'lets': "let's", 'ive': "I've",
  'youve': "you've", 'weve': "we've", 'theyve': "they've",
  'im': "I'm", 'youll': "you'll", 'theyll': "they'll",
  'ill': "I'll", 'itll': "it'll", 'thatll': "that'll", 'wholl': "who'll",

  // Common misspellings
  'recieve': 'receive', 'acheive': 'achieve', 'accross': 'across',
  'adress': 'address', 'agressive': 'aggressive', 'apparantly': 'apparently',
  'arguement': 'argument', 'assasinate': 'assassinate', 'basicly': 'basically',
  'begining': 'beginning', 'beleive': 'believe', 'buisness': 'business',
  'calender': 'calendar', 'catagory': 'category', 'cemetary': 'cemetery',
  'changable': 'changeable', 'collegue': 'colleague', 'comming': 'coming',
  'commited': 'committed', 'concensus': 'consensus', 'copywrite': 'copyright',
  'definate': 'definite', 'definately': 'definitely', 'dilemna': 'dilemma',
  'dissapear': 'disappear', 'dissapoint': 'disappoint', 'enviroment': 'environment',
  'excercise': 'exercise', 'existance': 'existence', 'experiance': 'experience',
  'facinate': 'fascinate', 'firey': 'fiery', 'foriegn': 'foreign',
  'freind': 'friend', 'goverment': 'government', 'gaurd': 'guard',
  'happend': 'happened', 'harrass': 'harass', 'humourous': 'humorous',
  'ignorence': 'ignorance', 'immediatly': 'immediately', 'independant': 'independent',
  'inteligence': 'intelligence', 'intresting': 'interesting', 'jewlery': 'jewelry',
  'judgement': 'judgment', 'knowlege': 'knowledge', 'liason': 'liaison',
  'libary': 'library', 'lisence': 'license', 'maintainance': 'maintenance',
  'millenium': 'millennium', 'minature': 'miniature', 'mischievious': 'mischievous',
  'mispell': 'misspell', 'neccessary': 'necessary', 'necessery': 'necessary',
  'noticable': 'noticeable', 'occassion': 'occasion', 'occured': 'occurred',
  'occurence': 'occurrence', 'parliment': 'parliament', 'persistant': 'persistent',
  'posession': 'possession', 'prefered': 'preferred', 'privelege': 'privilege',
  'profesional': 'professional', 'pronounciation': 'pronunciation',
  'publically': 'publicly', 'realy': 'really', 'reccommend': 'recommend',
  'recomend': 'recommend', 'refered': 'referred', 'relevent': 'relevant',
  'religous': 'religious', 'remeber': 'remember', 'repitition': 'repetition',
  'resistence': 'resistance', 'rythm': 'rhythm', 'sacrilegious': 'sacrilegious',
  'seize': 'seize', 'sentance': 'sentence', 'seperate': 'separate',
  'sergent': 'sergeant', 'succesful': 'successful', 'supercede': 'supersede',
  'suprise': 'surprise', 'tendancy': 'tendency', 'therefor': 'therefore',
  'threshhold': 'threshold', 'tommorow': 'tomorrow', 'tommorrow': 'tomorrow',
  'tounge': 'tongue', 'truely': 'truly', 'tyrany': 'tyranny',
  'underate': 'underrate', 'untill': 'until', 'upholstry': 'upholstery',
  'useable': 'usable', 'vaccuum': 'vacuum', 'vegetable': 'vegetable',
  'vehical': 'vehicle', 'vicious': 'vicious', 'wether': 'whether',
  'wierd': 'weird', 'writting': 'writing',

  // Education-specific
  'assesment': 'assessment', 'asessment': 'assessment', 'curriculm': 'curriculum',
  'curiculum': 'curriculum', 'objetive': 'objective', 'pedagogey': 'pedagogy',
  'ruberic': 'rubric', 'sillabus': 'syllabus', 'assigment': 'assignment',
  'assignement': 'assignment', 'diferentiation': 'differentiation',
  'diferentiated': 'differentiated', 'scaffoleding': 'scaffolding',
  'accomodation': 'accommodation', 'accomodations': 'accommodations',
  'kindergarden': 'kindergarten', 'kindergaten': 'kindergarten',
  'mathmatics': 'mathematics', 'arithmatic': 'arithmetic',
  'grammer': 'grammar', 'gramer': 'grammar', 'langauge': 'language',
  'lanugage': 'language', 'litterature': 'literature', 'litreature': 'literature',
  'geograpy': 'geography', 'govenment': 'government',
  'explaination': 'explanation', 'discusion': 'discussion',
  'activites': 'activities', 'activties': 'activities',
  'studens': 'students', 'studnets': 'students', 'studnet': 'student',

  // Capitalization fixes
  'i': 'I',
  'monday': 'Monday', 'tuesday': 'Tuesday', 'wednesday': 'Wednesday',
  'thursday': 'Thursday', 'friday': 'Friday', 'saturday': 'Saturday',
  'sunday': 'Sunday', 'january': 'January', 'february': 'February',
  'march': 'March', 'april': 'April', 'june': 'June', 'july': 'July',
  'august': 'August', 'september': 'September', 'october': 'October',
  'november': 'November', 'december': 'December',
};

// Apply autocorrect to the last typed word
export function applyAutocorrect(text: string, cursorPos: number): { text: string; newCursorPos: number } | null {
  // Find the word that just ended (cursor is after space/punctuation)
  const beforeCursor = text.slice(0, cursorPos);
  const match = beforeCursor.match(/(\S+)\s$/);
  if (!match) return null;

  const word = match[1];
  const correction = AUTOCORRECT_MAP[word.toLowerCase()];
  if (!correction) return null;

  // Preserve case pattern
  let corrected = correction;
  if (word[0] === word[0].toUpperCase() && word.length > 1) {
    // If original started with uppercase (and isn't a single char like 'i'),
    // capitalize the correction too
    corrected = correction.charAt(0).toUpperCase() + correction.slice(1);
  }

  // Calculate exact word boundaries: the matched word ends right before the trailing space
  const wordEnd = cursorPos - 1; // position of the space char
  const wordStart = wordEnd - word.length;
  const newText = text.slice(0, wordStart) + corrected + text.slice(wordStart + word.length);
  const newCursorPos = wordStart + corrected.length + 1; // +1 for the space

  return { text: newText, newCursorPos };
}
