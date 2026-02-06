"""
Generate comprehensive topic presets from curriculum structure
"""

import json
from pathlib import Path

# Read curriculum index
with open('frontend/src/data/curriculumIndex.json', 'r', encoding='utf-8') as f:
    curriculum_data = json.load(f)

# Extract unique subject/grade/strand combinations
unique_strands = {}
for page in curriculum_data['indexedPages']:
    subject = page.get('subject', '')
    grade = page.get('grade', '')
    strand = page.get('strand', '')
    display_name = page.get('displayName', '')
    
    if subject and grade and strand:
        key = f"{subject.lower().replace(' ', '_')}.grade{grade}.{strand}"
        unique_strands[key] = {
            'subject': subject,
            'grade': grade,
            'strand': strand,
            'display_name': display_name
        }

print(f"Found {len(unique_strands)} unique strand combinations")
print("\nFirst 20:")
for i, (key, data) in enumerate(list(unique_strands.items())[:20]):
    print(f"{i+1}. {key}")
    print(f"   {data['subject']} | Grade {data['grade']} | {data['display_name']}")

# Save to file for review
with open('curriculum_strands_analysis.json', 'w', encoding='utf-8') as f:
    json.dump(unique_strands, f, indent=2)

print(f"\n✅ Saved analysis to curriculum_strands_analysis.json")
