import json

# Check specific strand
test_key = 'science.grade4.energy'

with open('backend/config/topic_presets.json', 'r', encoding='utf-8') as f:
    presets = json.load(f)

print(f"Looking for: {test_key}")
print(f"Key exists: {test_key in presets}")

if test_key in presets:
    data = presets[test_key]
    print(f"✅ Found!")
    print(f"Display: {data['display_name']}")
    print(f"Presets: {len(data['image_presets'])}")
    for i, p in enumerate(data['image_presets']):
        print(f"  {i+1}. {p['id']}: {p['name']}")
else:
    print("\n❌ NOT FOUND")
    print("\nAll Science Grade 4 keys:")
    for k in sorted(presets.keys()):
        if 'science.grade4' in k:
            print(f"  {k} ({len(presets[k]['image_presets'])} presets)")
    
    print("\nSearching curriculum for Grade 4 Science strands:")
    with open('frontend/src/data/curriculumIndex.json', 'r', encoding='utf-8') as f:
        curr = json.load(f)
    
    grade4_science = [p for p in curr['indexedPages'] if p.get('subject') == 'Science' and p.get('grade') == '4']
    print(f"Found {len(grade4_science)} Grade 4 Science strands in curriculum:")
    for p in grade4_science:
        print(f"  - {p.get('strand')}: {p.get('displayName')}")
