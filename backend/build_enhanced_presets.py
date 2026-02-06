"""
Build ENHANCED comprehensive topic presets with 2-3 quality presets per strand
Ensures every strand has specific, pedagogically sound image presets
"""

import json
from pathlib import Path

# Read curriculum
with open('frontend/src/data/curriculumIndex.json', 'r', encoding='utf-8') as f:
    curriculum_data = json.load(f)

with open('curriculum_strands_analysis.json', 'r', encoding='utf-8') as f:
    strands = json.load(f)

print(f"Generating enhanced presets for {len(strands)} strands...")

# Enhanced preset generators that create 2-3 specific presets per strand

def create_base_preset_template(strand_name, grade, subject):
    """Create a versatile base preset that works for any strand"""
    return {
        "id": "general_overview",
        "name": f"{strand_name} Overview",
        "description": f"General visual overview of {strand_name} concepts",
        "base_prompt": f"An educational scene showing key concepts from {strand_name}, colorful and age-appropriate for grade {grade}",
        "objects": ["educational_elements", "learning_materials"],
        "relationships": ["conceptual_connections"],
        "exclusions": ["text", "complex_terminology", "inappropriate_content"],
        "recommended_styles": ["cartoon_3d", "illustrated_painting"]
    }

def generate_enhanced_math_presets(strand_name, grade):
    """Generate 2-3 specific presets for math strands"""
    strand_lower = strand_name.lower()
    presets = []
    
    if 'number' in strand_lower:
        presets.extend([
            {
                "id": "number_line_visual",
                "name": "Number Line",
                "description": "Visual number line for counting and ordering",
                "base_prompt": f"A colorful number line showing numbers clearly marked, educational style for grade {grade}",
                "objects": ["number_line", "numbers", "intervals"],
                "relationships": ["sequential_order", "equal_spacing"],
                "exclusions": ["text_labels", "equations"],
                "recommended_styles": ["line_art_bw", "cartoon_3d"]
            },
            {
                "id": "counting_collection",
                "name": "Counting Objects",
                "description": "Collection of objects for counting practice",
                "base_prompt": "Colorful objects arranged in groups for counting - blocks, toys, or fruits",
                "objects": ["counting_objects", "groups"],
                "relationships": ["grouping", "quantity"],
                "exclusions": ["numbers", "text"],
                "recommended_styles": ["cartoon_3d"]
            },
            {
                "id": "number_chart",
                "name": "Number Chart",
                "description": "Organized number display",
                "base_prompt": f"A hundreds chart or number grid showing organized numbers for grade {grade}",
                "objects": ["numbers", "grid", "patterns"],
                "relationships": ["number_patterns"],
                "exclusions": ["text"],
                "recommended_styles": ["illustrated_painting"]
            }
        ])
    
    elif 'geomet' in strand_lower or 'shape' in strand_lower:
        presets.extend([
            {
                "id": "2d_shapes",
                "name": "2D Shapes",
                "description": "Common flat shapes",
                "base_prompt": "Basic 2D geometric shapes - circles, squares, triangles, rectangles in bright colors",
                "objects": ["circle", "square", "triangle", "rectangle"],
                "relationships": ["shape_comparison"],
                "exclusions": ["text", "measurements"],
                "recommended_styles": ["line_art_bw", "cartoon_3d"]
            },
            {
                "id": "3d_solids",
                "name": "3D Shapes",
                "description": "Three-dimensional geometric solids",
                "base_prompt": "3D shapes - cube, sphere, cone, cylinder, pyramid with visible faces",
                "objects": ["cube", "sphere", "cone", "cylinder", "pyramid"],
                "relationships": ["dimensional_properties"],
                "exclusions": ["text", "formulas"],
                "recommended_styles": ["cartoon_3d"]
            },
            {
                "id": "shapes_in_environment",
                "name": "Shapes Around Us",
                "description": "Real-world objects showing geometric shapes",
                "base_prompt": "Everyday objects that show geometric shapes - ball, box, traffic sign, window",
                "objects": ["real_objects", "geometric_forms"],
                "relationships": ["shape_recognition"],
                "exclusions": ["text"],
                "recommended_styles": ["illustrated_painting"]
            }
        ])
    
    elif 'operation' in strand_lower:
        presets.extend([
            {
                "id": "operation_blocks",
                "name": "Operation with Blocks",
                "description": "Visual blocks showing addition/subtraction",
                "base_prompt": "Colorful blocks arranged to show mathematical operations visually",
                "objects": ["blocks", "groups", "quantities"],
                "relationships": ["combining", "separating"],
                "exclusions": ["numbers", "symbols"],
                "recommended_styles": ["cartoon_3d"]
            },
            {
                "id": "ten_frames",
                "name": "Ten Frames",
                "description": "Ten frame models for operations",
                "base_prompt": "Ten frames with counters showing number relationships",
                "objects": ["ten_frames", "counters"],
                "relationships": ["part_whole"],
                "exclusions": ["text"],
                "recommended_styles": ["illustrated_painting"]
            }
        ])
    
    elif 'measure' in strand_lower:
        presets.extend([
            {
                "id": "measurement_tools",
                "name": "Measurement Tools",
                "description": "Common tools for measuring",
                "base_prompt": "Measurement tools - ruler, scale, measuring cup, thermometer arranged neatly",
                "objects": ["ruler", "scale", "measuring_cup", "clock"],
                "relationships": ["tool_purpose"],
                "exclusions": ["numbers", "measurements"],
                "recommended_styles": ["cartoon_3d", "realistic"]
            },
            {
                "id": "comparing_lengths",
                "name": "Comparing Sizes",
                "description": "Objects of different sizes to compare",
                "base_prompt": "Objects of different lengths, heights, or sizes to compare - pencils, books, toys",
                "objects": ["objects_varying_sizes"],
                "relationships": ["size_comparison"],
                "exclusions": ["measurements", "text"],
                "recommended_styles": ["cartoon_3d"]
            }
        ])
    
    elif 'data' in strand_lower or 'probability' in strand_lower:
        presets.extend([
            {
                "id": "graph_template",
                "name": "Graph Structure",
                "description": "Empty graph template",
                "base_prompt": "A simple bar graph or pictograph template with grid lines but no data",
                "objects": ["axes", "grid", "graph_structure"],
                "relationships": ["data_display"],
                "exclusions": ["data_values", "text"],
                "recommended_styles": ["line_art_bw"]
            },
            {
                "id": "sorting_objects",
                "name": "Sorting Categories",
                "description": "Objects ready to sort and classify",
                "base_prompt": "A collection of objects that can be sorted by different attributes - colors, shapes, sizes",
                "objects": ["sortable_objects", "categories"],
                "relationships": ["classification"],
                "exclusions": ["text"],
                "recommended_styles": ["cartoon_3d"]
            }
        ])
    
    elif 'pattern' in strand_lower:
        presets.extend([
            {
                "id": "repeating_pattern",
                "name": "Repeating Patterns",
                "description": "Visual repeating pattern sequence",
                "base_prompt": "Colorful repeating pattern using shapes or objects - ABAB or ABCABC pattern",
                "objects": ["pattern_elements", "sequence"],
                "relationships": ["repetition", "order"],
                "exclusions": ["text"],
                "recommended_styles": ["cartoon_3d"]
            },
            {
                "id": "growing_pattern",
                "name": "Growing Patterns",
                "description": "Pattern that increases in size or quantity",
                "base_prompt": "A growing pattern sequence showing increasing quantities",
                "objects": ["pattern_stages", "growth_sequence"],
                "relationships": ["growth", "progression"],
                "exclusions": ["text", "numbers"],
                "recommended_styles": ["illustrated_painting"]
            }
        ])
    
    # If no specific presets generated, add base template
    if not presets:
        presets.append(create_base_preset_template(strand_name, grade, "Mathematics"))
    
    return presets[:3]  # Max 3 presets


def generate_enhanced_science_presets(strand_name, grade):
    """Generate 2-3 specific presets for science strands"""
    strand_lower = strand_name.lower()
    presets = []
    
    if 'space' in strand_lower:
        presets.extend([
            {
                "id": "solar_system",
                "name": "Solar System",
                "description": "Sun and planets",
                "base_prompt": "Solar system with sun and planets in orbital paths",
                "objects": ["sun", "planets", "orbital_paths"],
                "relationships": ["orbiting"],
                "exclusions": ["text", "moons", "spacecraft"],
                "recommended_styles": ["cartoon_3d", "illustrated_painting"]
            },
            {
                "id": "day_night",
                "name": "Day and Night",
                "description": "Earth's rotation creating day/night",
                "base_prompt": "Earth showing one side in sunlight and one side in darkness",
                "objects": ["earth", "sun", "light_rays"],
                "relationships": ["rotation", "illumination"],
                "exclusions": ["text", "other_planets"],
                "recommended_styles": ["illustrated_painting"]
            }
        ])
    
    elif 'plant' in strand_lower or 'life' in strand_lower or 'organism' in strand_lower or 'structure' in strand_lower:
        presets.extend([
            {
                "id": "plant_parts",
                "name": "Plant Parts",
                "description": "Complete plant showing all parts",
                "base_prompt": "A flowering plant showing roots, stem, leaves, and flower clearly",
                "objects": ["roots", "stem", "leaves", "flower"],
                "relationships": ["parts_of_whole"],
                "exclusions": ["text_labels", "multiple_species"],
                "recommended_styles": ["line_art_bw", "illustrated_painting"]
            },
            {
                "id": "animal_features",
                "name": "Animal Features",
                "description": "Animal showing body parts and features",
                "base_prompt": f"A friendly animal showing clear body parts - head, legs, tail, appropriate for grade {grade}",
                "objects": ["animal_body", "features"],
                "relationships": ["body_structure"],
                "exclusions": ["text", "scary_elements"],
                "recommended_styles": ["cartoon_3d"]
            },
            {
                "id": "habitat_scene",
                "name": "Habitat",
                "description": "Natural habitat environment",
                "base_prompt": "A natural habitat showing plants and environment - forest, ocean, or desert",
                "objects": ["environment", "natural_elements"],
                "relationships": ["ecosystem"],
                "exclusions": ["text", "pollution"],
                "recommended_styles": ["illustrated_painting"]
            }
        ])
    
    elif 'earth' in strand_lower or 'weather' in strand_lower:
        presets.extend([
            {
                "id": "weather_types",
                "name": "Weather Conditions",
                "description": "Different types of weather",
                "base_prompt": "Four weather types - sunny, rainy, cloudy, windy with simple symbols",
                "objects": ["sun", "clouds", "rain", "wind"],
                "relationships": ["weather_variation"],
                "exclusions": ["text", "temperature_numbers"],
                "recommended_styles": ["cartoon_3d"]
            },
            {
                "id": "earth_features",
                "name": "Earth Features",
                "description": "Landforms and natural features",
                "base_prompt": "Natural earth features - mountains, rivers, valleys, rocks",
                "objects": ["landforms", "water_features"],
                "relationships": ["geographical_features"],
                "exclusions": ["text", "maps"],
                "recommended_styles": ["illustrated_painting"]
            }
        ])
    
    elif 'force' in strand_lower or 'motion' in strand_lower or 'interaction' in strand_lower:
        presets.extend([
            {
                "id": "push_pull",
                "name": "Push and Pull",
                "description": "Objects being pushed or pulled",
                "base_prompt": "Simple objects showing push and pull forces - ball being pushed, wagon being pulled",
                "objects": ["objects", "motion_indicators"],
                "relationships": ["force_application"],
                "exclusions": ["text", "complex_diagrams"],
                "recommended_styles": ["cartoon_3d"]
            },
            {
                "id": "motion_scene",
                "name": "Objects in Motion",
                "description": "Things that move",
                "base_prompt": "Objects showing different types of motion - rolling, sliding, bouncing",
                "objects": ["moving_objects", "motion_paths"],
                "relationships": ["movement_types"],
                "exclusions": ["text"],
                "recommended_styles": ["illustrated_painting"]
            }
        ])
    
    elif 'wave' in strand_lower or 'light' in strand_lower or 'sound' in strand_lower:
        presets.extend([
            {
                "id": "light_and_shadow",
                "name": "Light and Shadows",
                "description": "Light source creating shadows",
                "base_prompt": "A light source casting rays and creating shadows on simple objects",
                "objects": ["light_source", "light_rays", "shadows"],
                "relationships": ["light_to_shadow"],
                "exclusions": ["text"],
                "recommended_styles": ["illustrated_painting"]
            },
            {
                "id": "sound_sources",
                "name": "Sound Sources",
                "description": "Things that make sound",
                "base_prompt": "Musical instruments or sound-making objects - drum, bell, speaker",
                "objects": ["sound_sources", "musical_instruments"],
                "relationships": ["sound_production"],
                "exclusions": ["text", "musical_notes"],
                "recommended_styles": ["cartoon_3d"]
            }
        ])
    
    elif 'engineer' in strand_lower or 'design' in strand_lower:
        presets.extend([
            {
                "id": "simple_machine",
                "name": "Simple Machines",
                "description": "Basic machines and tools",
                "base_prompt": "Simple machines - lever, pulley, ramp, wheel",
                "objects": ["simple_machines", "tools"],
                "relationships": ["mechanical_advantage"],
                "exclusions": ["text", "complex_mechanisms"],
                "recommended_styles": ["cartoon_3d", "illustrated_painting"]
            },
            {
                "id": "building_materials",
                "name": "Building Materials",
                "description": "Materials for construction and design",
                "base_prompt": "Various building and craft materials - blocks, cardboard, tape, scissors",
                "objects": ["materials", "construction_items"],
                "relationships": ["material_properties"],
                "exclusions": ["text", "dangerous_tools"],
                "recommended_styles": ["cartoon_3d"]
            }
        ])
    
    elif 'energy' in strand_lower:
        presets.extend([
            {
                "id": "energy_sources",
                "name": "Energy Sources",
                "description": "Sources of energy",
                "base_prompt": "Energy sources - sun, battery, food, fuel",
                "objects": ["energy_sources"],
                "relationships": ["energy_types"],
                "exclusions": ["text", "dangerous_elements"],
                "recommended_styles": ["cartoon_3d"]
            },
            {
                "id": "energy_transfer",
                "name": "Energy in Action",
                "description": "Energy being transferred or used",
                "base_prompt": "Scenes showing energy transfer - light bulb glowing, moving object",
                "objects": ["energy_examples"],
                "relationships": ["energy_transfer"],
                "exclusions": ["text"],
                "recommended_styles": ["illustrated_painting"]
            }
        ])
    
    elif 'matter' in strand_lower or 'material' in strand_lower:
        presets.extend([
            {
                "id": "states_of_matter",
                "name": "States of Matter",
                "description": "Solid, liquid, gas examples",
                "base_prompt": "Examples of three states of matter - ice cube, water, steam",
                "objects": ["solid_example", "liquid_example", "gas_example"],
                "relationships": ["state_changes"],
                "exclusions": ["text", "chemical_formulas"],
                "recommended_styles": ["cartoon_3d"]
            },
            {
                "id": "material_properties",
                "name": "Material Properties",
                "description": "Materials with different properties",
                "base_prompt": "Different materials - metal, wood, plastic, fabric showing textures",
                "objects": ["materials", "textures"],
                "relationships": ["property_differences"],
                "exclusions": ["text"],
                "recommended_styles": ["realistic", "illustrated_painting"]
            }
        ])
    
    # Add inquiry/investigation preset for any science strand
    presets.append({
        "id": "investigation_setup",
        "name": "Science Investigation",
        "description": "Science investigation setup",
        "base_prompt": f"A simple science investigation setup with basic equipment for grade {grade}",
        "objects": ["investigation_materials", "observation_tools"],
        "relationships": ["scientific_inquiry"],
        "exclusions": ["text", "dangerous_chemicals"],
        "recommended_styles": ["cartoon_3d"]
    })
    
    return presets[:3]


def generate_enhanced_language_arts_presets(strand_name, grade):
    """Generate 2-3 specific presets for language arts strands"""
    presets = []
    
    if 'reading' in strand_name.lower() or 'viewing' in strand_name.lower():
        presets.extend([
            {
                "id": "storybook_scene",
                "name": "Story Scene",
                "description": "Narrative scene with character and setting",
                "base_prompt": "A colorful storybook scene with character in a setting, child-friendly",
                "objects": ["character", "setting", "story_elements"],
                "relationships": ["narrative_context"],
                "exclusions": ["text", "speech_bubbles"],
                "recommended_styles": ["cartoon_3d", "illustrated_painting"]
            },
            {
                "id": "character_portrait",
                "name": "Character Focus",
                "description": "Single character showing emotion/action",
                "base_prompt": "A friendly character showing clear emotion or action, simple background",
                "objects": ["character", "expression"],
                "relationships": ["character_emotion"],
                "exclusions": ["text"],
                "recommended_styles": ["cartoon_3d"]
            },
            {
                "id": "setting_scene",
                "name": "Story Setting",
                "description": "Detailed setting without characters",
                "base_prompt": "An interesting setting - forest, classroom, beach - without characters",
                "objects": ["setting_elements", "environment"],
                "relationships": ["spatial_arrangement"],
                "exclusions": ["text", "characters"],
                "recommended_styles": ["illustrated_painting"]
            }
        ])
    
    elif 'writing' in strand_name.lower():
        presets.extend([
            {
                "id": "writing_prompt_scene",
                "name": "Story Starter",
                "description": "Interesting scene to inspire writing",
                "base_prompt": "An intriguing scene that inspires story writing - mysterious door, unusual object, interesting character",
                "objects": ["story_catalyst", "interesting_elements"],
                "relationships": ["narrative_potential"],
                "exclusions": ["text", "completed_story"],
                "recommended_styles": ["illustrated_painting", "cartoon_3d"]
            },
            {
                "id": "sequence_scene",
                "name": "Story Sequence Panel",
                "description": "Scene showing beginning, middle, or end",
                "base_prompt": "A scene showing one part of a story sequence, clear action or event",
                "objects": ["action_scene", "story_moment"],
                "relationships": ["sequential_narrative"],
                "exclusions": ["text"],
                "recommended_styles": ["cartoon_3d"]
            }
        ])
    
    elif 'listen' in strand_name.lower() or 'speaking' in strand_name.lower():
        presets.extend([
            {
                "id": "communication_scene",
                "name": "People Communicating",
                "description": "Characters in conversation",
                "base_prompt": "Two friendly characters appearing to communicate, expressive body language",
                "objects": ["characters", "interaction"],
                "relationships": ["communication"],
                "exclusions": ["speech_bubbles", "text"],
                "recommended_styles": ["cartoon_3d"]
            },
            {
                "id": "listening_scene",
                "name": "Listening Activity",
                "description": "Character(s) listening attentively",
                "base_prompt": "Character listening attentively - story time, nature sounds, music",
                "objects": ["listener", "sound_source"],
                "relationships": ["attention", "engagement"],
                "exclusions": ["text"],
                "recommended_styles": ["cartoon_3d"]
            }
        ])
    
    # Add base preset if needed
    if len(presets) < 2:
        presets.append(create_base_preset_template(strand_name, grade, "Language Arts"))
    
    return presets[:3]


def generate_enhanced_social_studies_presets(strand_name, grade):
    """Generate 2-3 specific presets for social studies strands"""
    presets = []
    
    if 'spatial' in strand_name.lower() or 'geography' in strand_name.lower():
        presets.extend([
            {
                "id": "simple_map",
                "name": "Simple Map",
                "description": "Basic map showing geographical features",
                "base_prompt": "A simple map-style view showing land, water, and basic features",
                "objects": ["land", "water", "geographical_features"],
                "relationships": ["spatial_relationships"],
                "exclusions": ["text_labels", "place_names"],
                "recommended_styles": ["illustrated_painting"]
            },
            {
                "id": "landscape_view",
                "name": "Landscape Scene",
                "description": "Natural or community landscape",
                "base_prompt": "A landscape showing natural or community features - hills, buildings, roads",
                "objects": ["landscape_elements", "community_features"],
                "relationships": ["spatial_arrangement"],
                "exclusions": ["text", "specific_labels"],
                "recommended_styles": ["cartoon_3d", "illustrated_painting"]
            }
        ])
    
    elif 'community' in strand_name.lower() or 'civic' in strand_name.lower():
        presets.extend([
            {
                "id": "community_helper",
                "name": "Community Helper",
                "description": "Community helper at work",
                "base_prompt": f"A friendly community helper at work - firefighter, teacher, doctor - grade {grade} appropriate",
                "objects": ["community_helper", "work_environment", "tools"],
                "relationships": ["helper_to_role"],
                "exclusions": ["text", "dangerous_situations"],
                "recommended_styles": ["cartoon_3d"]
            },
            {
                "id": "community_building",
                "name": "Community Place",
                "description": "Important community location",
                "base_prompt": "A community building - school, library, fire station, hospital",
                "objects": ["building", "community_space"],
                "relationships": ["place_to_purpose"],
                "exclusions": ["text", "signs"],
                "recommended_styles": ["cartoon_3d", "illustrated_painting"]
            }
        ])
    
    elif 'historical' in strand_name.lower() or 'culture' in strand_name.lower():
        presets.extend([
            {
                "id": "cultural_scene",
                "name": "Cultural Scene",
                "description": "Cultural celebration or tradition",
                "base_prompt": f"A cultural celebration scene appropriate for grade {grade}, colorful and respectful",
                "objects": ["celebratory_elements", "cultural_items"],
                "relationships": ["cultural_context"],
                "exclusions": ["text", "stereotypes"],
                "recommended_styles": ["illustrated_painting"]
            },
            {
                "id": "historical_setting",
                "name": "Historical Setting",
                "description": "Simple historical environment",
                "base_prompt": f"A simple historical setting or traditional scene for grade {grade}",
                "objects": ["historical_elements", "period_items"],
                "relationships": ["historical_context"],
                "exclusions": ["text", "complex_politics"],
                "recommended_styles": ["illustrated_painting"]
            }
        ])
    
    elif 'economic' in strand_name.lower():
        presets.extend([
            {
                "id": "goods_display",
                "name": "Goods and Products",
                "description": "Items people buy and sell",
                "base_prompt": "A display of goods - fruits, toys, books on shelves or in a market",
                "objects": ["goods", "products"],
                "relationships": ["economic_exchange"],
                "exclusions": ["prices", "money_amounts", "text"],
                "recommended_styles": ["cartoon_3d"]
            },
            {
                "id": "service_scene",
                "name": "Service Provider",
                "description": "Someone providing a service",
                "base_prompt": "A person providing a service - teacher teaching, doctor helping",
                "objects": ["service_provider", "service_context"],
                "relationships": ["service_provision"],
                "exclusions": ["text"],
                "recommended_styles": ["cartoon_3d"]
            }
        ])
    
    # Add base if needed
    if len(presets) < 2:
        presets.append(create_base_preset_template(strand_name, grade, "Social Studies"))
    
    return presets[:3]


# Build enhanced presets
all_presets = {}

for topic_id, data in strands.items():
    subject = data['subject']
    grade = data['grade']
    strand = data['strand']
    display_name = data['display_name']
    
    # Generate 2-3 quality presets based on subject
    if subject == 'Mathematics':
        presets = generate_enhanced_math_presets(display_name, grade)
    elif subject == 'Science':
        presets = generate_enhanced_science_presets(display_name, grade)
    elif subject == 'Language Arts':
        presets = generate_enhanced_language_arts_presets(display_name, grade)
    elif subject == 'Social Studies':
        presets = generate_enhanced_social_studies_presets(display_name, grade)
    else:
        presets = [create_base_preset_template(display_name, grade, subject)]
    
    # Ensure every strand has at least 2 presets
    while len(presets) < 2:
        presets.append(create_base_preset_template(display_name, grade, subject))
    
    all_presets[topic_id] = {
        "topic_id": topic_id,
        "display_name": f"{display_name} (Grade {grade} {subject})",
        "subject": subject,
        "grade_band": grade,
        "strand": strand,
        "image_presets": presets
    }

total_presets = sum(len(t['image_presets']) for t in all_presets.values())
print(f"\n✅ Generated {len(all_presets)} topics")
print(f"✅ Total presets: {total_presets}")
print(f"✅ Average: {total_presets / len(all_presets):.1f} presets per strand")

# Save
output_path = Path('backend/config/topic_presets.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(all_presets, f, indent=2)

print(f"\n✅ Saved to {output_path}")
print("\n🎯 Quality Check:")
single_preset = sum(1 for t in all_presets.values() if len(t['image_presets']) == 1)
two_presets = sum(1 for t in all_presets.values() if len(t['image_presets']) == 2)
three_plus = sum(1 for t in all_presets.values() if len(t['image_presets']) >= 3)
print(f"  Strands with 1 preset: {single_preset}")
print(f"  Strands with 2 presets: {two_presets}")
print(f"  Strands with 3+ presets: {three_plus}")
