import type { BundledScene } from '../types/storybook';

/**
 * 20 bundled SVG background scenes shipped with the app.
 * Available at all tiers — no AI generation required.
 * SVG files live in frontend/src/assets/storybook-scenes/
 */
export const BUNDLED_SCENES: BundledScene[] = [
  // Outdoors
  { id: 'sunny-park',      name: 'Sunny Park',        category: 'outdoors', file: 'sunny-park.svg',      keywords: ['park', 'sunny', 'grass', 'trees', 'bench', 'outdoor', 'green'] },
  { id: 'beach-ocean',     name: 'Beach & Ocean',     category: 'outdoors', file: 'beach-ocean.svg',     keywords: ['beach', 'ocean', 'sea', 'sand', 'waves', 'water', 'coast'] },
  { id: 'forest-path',     name: 'Forest Path',       category: 'outdoors', file: 'forest-path.svg',     keywords: ['forest', 'woods', 'path', 'trail', 'trees', 'nature'] },
  { id: 'farm',            name: 'Farm',               category: 'outdoors', file: 'farm.svg',            keywords: ['farm', 'barn', 'field', 'animals', 'country', 'rural'] },
  { id: 'playground',      name: 'Playground',        category: 'outdoors', file: 'playground.svg',      keywords: ['playground', 'slide', 'swing', 'play', 'park', 'children'] },
  { id: 'flower-garden',   name: 'Flower Garden',     category: 'outdoors', file: 'flower-garden.svg',   keywords: ['garden', 'flowers', 'plants', 'bloom', 'colorful', 'spring'] },
  { id: 'mountain-trail',  name: 'Mountain Trail',    category: 'outdoors', file: 'mountain-trail.svg',  keywords: ['mountain', 'trail', 'hiking', 'hills', 'outdoors', 'climb'] },

  // Indoors
  { id: 'classroom',       name: 'Classroom',         category: 'indoors', file: 'classroom.svg',        keywords: ['classroom', 'school', 'desks', 'board', 'teacher', 'learning'] },
  { id: 'living-room',     name: 'Cozy Living Room',  category: 'indoors', file: 'living-room.svg',      keywords: ['living room', 'home', 'cozy', 'sofa', 'indoor', 'house', 'inside'] },
  { id: 'kitchen',         name: 'Kitchen',           category: 'indoors', file: 'kitchen.svg',          keywords: ['kitchen', 'cooking', 'food', 'home', 'inside', 'house'] },
  { id: 'bedroom',         name: 'Bedroom',           category: 'indoors', file: 'bedroom.svg',          keywords: ['bedroom', 'bed', 'sleep', 'night', 'home', 'inside', 'room'] },
  { id: 'library',         name: 'Library',           category: 'indoors', file: 'library.svg',          keywords: ['library', 'books', 'reading', 'bookshelves', 'study', 'quiet'] },

  // Fantasy / Adventure
  { id: 'castle',          name: 'Castle Courtyard',  category: 'fantasy', file: 'castle.svg',           keywords: ['castle', 'courtyard', 'kingdom', 'fantasy', 'medieval', 'royal'] },
  { id: 'underwater',      name: 'Underwater Ocean',  category: 'fantasy', file: 'underwater.svg',       keywords: ['underwater', 'ocean', 'fish', 'coral', 'sea', 'deep', 'ocean floor'] },
  { id: 'outer-space',     name: 'Outer Space',       category: 'fantasy', file: 'outer-space.svg',      keywords: ['space', 'stars', 'planets', 'galaxy', 'night sky', 'rocket', 'universe'] },
  { id: 'enchanted-forest',name: 'Enchanted Forest',  category: 'fantasy', file: 'enchanted-forest.svg', keywords: ['enchanted', 'magical', 'forest', 'fairy', 'glowing', 'fantasy', 'mushrooms'] },
  { id: 'cave',            name: 'Cave',              category: 'fantasy', file: 'cave.svg',             keywords: ['cave', 'cavern', 'underground', 'dark', 'crystals', 'adventure'] },

  // Weather / Time
  { id: 'rainy-street',    name: 'Rainy Day Street',  category: 'weather', file: 'rainy-street.svg',     keywords: ['rain', 'rainy', 'street', 'puddles', 'umbrella', 'cloudy', 'wet'] },
  { id: 'snowy-village',   name: 'Snowy Village',     category: 'weather', file: 'snowy-village.svg',    keywords: ['snow', 'snowy', 'village', 'winter', 'cold', 'white', 'houses'] },
  { id: 'sunset-field',    name: 'Golden Sunset Field',category: 'weather', file: 'sunset-field.svg',   keywords: ['sunset', 'golden', 'field', 'evening', 'dusk', 'warm', 'sky'] },
];

/**
 * Find the best matching bundled scene for a given sceneId from the LLM.
 * Uses keyword matching — falls back to 'sunny-park' if no match.
 */
export function findBestScene(sceneId: string): BundledScene {
  const query = sceneId.toLowerCase().replace(/[-_]/g, ' ');
  const words = query.split(/\s+/);

  let bestMatch: BundledScene | null = null;
  let bestScore = 0;

  for (const scene of BUNDLED_SCENES) {
    let score = 0;
    const searchTargets = [
      scene.id.replace(/-/g, ' '),
      scene.name.toLowerCase(),
      ...scene.keywords,
    ];
    const combined = searchTargets.join(' ');
    for (const word of words) {
      if (word.length < 3) continue;
      if (combined.includes(word)) score++;
    }
    // Exact id match is a strong signal
    if (scene.id === sceneId || scene.id === query.replace(/\s+/g, '-')) score += 10;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = scene;
    }
  }

  return bestMatch ?? BUNDLED_SCENES[0];
}

/** Get scenes grouped by category */
export function getScenesByCategory(): Record<string, BundledScene[]> {
  const groups: Record<string, BundledScene[]> = {};
  for (const scene of BUNDLED_SCENES) {
    if (!groups[scene.category]) groups[scene.category] = [];
    groups[scene.category].push(scene);
  }
  return groups;
}

export const SCENE_CATEGORY_LABELS: Record<string, string> = {
  outdoors: 'Outdoors',
  indoors: 'Indoors',
  fantasy: 'Fantasy & Adventure',
  weather: 'Weather & Time',
};
