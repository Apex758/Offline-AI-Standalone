"""
Audit preset coverage - Check which strands need better presets
"""

import json

# Load curriculum and presets
with open('frontend/src/data/curriculumIndex.json', 'r', encoding='utf-8') as f:
    curriculum = json.load(f)

with open('backend/config/topic_presets.json', 'r', encoding='utf-8') as f:
    presets = json.load(f)

# Build strand mapping
curriculum_strands = {}
for page in curriculum['indexedPages']:
    subject = page.get('subject', '')
    grade = page.get('grade', '')
    strand = page.get('strand', '')
    
    if subject and grade and strand:
        key = f"{subject.lower().replace(' ', '_')}.grade{grade}.{strand}"
        curriculum_strands[key] = {
            'subject': subject,
            'grade': grade,
            'strand': strand,
            'display_name': page.get('displayName', '')
        }

print(f"Total curriculum strands: {len(curriculum_strands)}")
print(f"Total preset entries: {len(presets)}")

# Check coverage
missing = []
low_quality = []
good_coverage = []

for strand_key, strand_data in curriculum_strands.items():
    if strand_key not in presets:
        missing.append(strand_key)
    else:
        preset_data = presets[strand_key]
        num_presets = len(preset_data.get('image_presets', []))
        
        # Check if presets are generic or specific
        is_generic = any(
            p['id'] in ['general_science_scene', 'general_math_scene', 'general_language_arts_scene', 'general_social_studies_scene', 'general_preset']
            for p in preset_data.get('image_presets', [])
        )
        
        if is_generic or num_presets < 2:
            low_quality.append((strand_key, num_presets, strand_data['display_name']))
        else:
            good_coverage.append((strand_key, num_presets))

print(f"\n✅ Good coverage: {len(good_coverage)} strands")
print(f"⚠️  Low quality/generic: {len(low_quality)} strands")
print(f"❌ Missing: {len(missing)} strands")

if low_quality:
    print(f"\n📋 Strands needing better presets:")
    for strand_key, count, display_name in low_quality[:20]:
        print(f"  - {strand_key}")
        print(f"    {display_name} ({count} preset{'s' if count != 1 else ''})")

print(f"\n💡 Action needed: Enhance preset generator to create specific presets for all strands")
