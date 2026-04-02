import os, base64, glob

BASE = r"C:\Users\LG\Desktop\Projects\Offline AI Standalone"
PROCESSED = os.path.join(BASE, "trophies-processed")
OLD_COMPRESSED = os.path.join(BASE, "trophies-compressed")

# Trophy types that already existed as gold (from trophies-compressed)
# We need to know which old gold images to keep vs replace
# Regenerated golds (replace): owl, brain, flame
# New golds (add): compass, chat-bubble, lightning
# Keep existing golds: scale, scroll, quill, milestone, clipboard, bar-chart, mortarboard

# First, read all new processed images
new_images = {}  # (type, tier) -> base64
for f in sorted(os.listdir(PROCESSED)):
    if not f.endswith('.webp'):
        continue
    parts = f.replace('.webp', '').rsplit('_', 1)
    if len(parts) != 2:
        continue
    trophy_type, tier = parts
    with open(os.path.join(PROCESSED, f), 'rb') as fh:
        b64 = base64.b64encode(fh.read()).decode('ascii')
    new_images[(trophy_type, tier)] = b64
    print(f"Loaded {trophy_type}_{tier} ({len(b64)//1024}KB b64)")

# Now read the existing trophyImages.ts to extract old gold images we want to keep
# The old golds to keep: scale, scroll, quill, milestone, clipboard, bar-chart, mortarboard
import re

ts_path = os.path.join(BASE, "frontend", "src", "assets", "trophyImages.ts")
with open(ts_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Extract each key's base64 data
old_golds = {}
pattern = r"'([a-z-]+)':\s*'(data:image/webp;base64,[^']+)'"
for m in re.finditer(pattern, content):
    trophy_type = m.group(1)
    data_uri = m.group(2)
    old_golds[trophy_type] = data_uri
    print(f"Found existing gold: {trophy_type} ({len(data_uri)//1024}KB)")

# Types where we keep the old gold (not regenerated, not newly added)
KEEP_OLD_GOLD = {'scale', 'scroll', 'quill', 'milestone', 'clipboard', 'bar-chart', 'mortarboard'}

# All trophy types
ALL_TYPES = ['scale', 'scroll', 'owl', 'flame', 'quill', 'milestone', 'clipboard',
             'brain', 'bar-chart', 'mortarboard', 'compass', 'chat-bubble', 'lightning']

# Build the new TS file
lines = []
lines.append("export type TrophyType = 'scroll' | 'quill' | 'mortarboard' | 'scale' | 'clipboard'")
lines.append("  | 'milestone' | 'compass' | 'flame' | 'chat-bubble' | 'brain' | 'bar-chart' | 'owl' | 'lightning';")
lines.append("")
lines.append("export type TrophyTier = 'gold' | 'silver' | 'bronze';")
lines.append("")
lines.append("interface TrophyTierImages {")
lines.append("  gold?: string;")
lines.append("  silver?: string;")
lines.append("  bronze?: string;")
lines.append("}")
lines.append("")
lines.append("const TROPHY_IMAGES: Partial<Record<TrophyType, TrophyTierImages>> = {")

for tt in ALL_TYPES:
    lines.append(f"  '{tt}': {{")
    for tier in ['gold', 'silver', 'bronze']:
        if tt in KEEP_OLD_GOLD and tier == 'gold':
            if tt in old_golds:
                lines.append(f"    {tier}: '{old_golds[tt]}',")
            else:
                print(f"WARNING: no old gold for {tt}")
        elif (tt, tier) in new_images:
            lines.append(f"    {tier}: 'data:image/webp;base64,{new_images[(tt, tier)]}',")
    lines.append("  },")

lines.append("};")
lines.append("")
lines.append("/** Backwards-compatible: returns gold image for a trophy type */")
lines.append("export function getTrophyImage(type: TrophyType): string | undefined {")
lines.append("  return TROPHY_IMAGES[type]?.gold;")
lines.append("}")
lines.append("")
lines.append("/** Returns image for a specific tier, falling back to gold */")
lines.append("export function getTrophyImageForTier(type: TrophyType, tier: TrophyTier): string | undefined {")
lines.append("  const imgs = TROPHY_IMAGES[type];")
lines.append("  if (!imgs) return undefined;")
lines.append("  return imgs[tier] ?? imgs.gold;")
lines.append("}")
lines.append("")
lines.append("export default TROPHY_IMAGES;")
lines.append("")

output = '\n'.join(lines)
with open(ts_path, 'w', encoding='utf-8') as f:
    f.write(output)

print(f"\nWrote {len(output)//1024}KB to trophyImages.ts")
print(f"Total entries: {sum(1 for k in new_images)} new + {len([t for t in KEEP_OLD_GOLD if t in old_golds])} kept old golds")
