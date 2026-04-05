export type { TrophyType, TrophyTier } from './trophyImages';

let _cache: typeof import('./trophyImages') | null = null;

async function _load() {
  if (!_cache) {
    _cache = await import('./trophyImages');
  }
  return _cache;
}

export async function getTrophyImageForTier(
  type: import('./trophyImages').TrophyType,
  tier: import('./trophyImages').TrophyTier
): Promise<string | undefined> {
  const mod = await _load();
  return mod.getTrophyImageForTier(type, tier);
}

export async function getTrophyImage(
  type: import('./trophyImages').TrophyType
): Promise<string | undefined> {
  const mod = await _load();
  return mod.getTrophyImage(type);
}
