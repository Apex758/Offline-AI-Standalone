import json

with open('backend/config/topic_presets.json', 'r', encoding='utf-8') as f:
    presets = json.load(f)

test_key = 'science.grade1.space-systems'
print(f"Looking for: {test_key}")
print(f"Key exists: {test_key in presets}")

if test_key in presets:
    data = presets[test_key]
    print(f"Display name: {data['display_name']}")
    print(f"Presets: {len(data['image_presets'])}")
    for p in data['image_presets']:
        print(f"  - {p['id']}: {p['name']}")
else:
    print("\nAvailable science grade 1 keys:")
    for k in presets.keys():
        if 'science.grade1' in k:
            print(f"  {k}")
