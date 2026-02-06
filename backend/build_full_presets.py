"""
Build comprehensive topic presets covering all curriculum strands
Generates 3-5 image presets per strand = ~300-500 total presets
"""

import json
from pathlib import Path

# Read curriculum index
with open('frontend/src/data/curriculumIndex.json', 'r', encoding='utf-8') as f:
    curriculum_data = json.load(f)

# Read existing analysis
with open('curriculum_strands_analysis.json', 'r', encoding='utf-8') as f:
    strands = json.load(f)

print(f"Building presets for {len(strands)} strands...")

# Preset generation templates by subject
def generate_math_presets(strand_name, grade):
    """Generate presets for math strands"""
    strand_lower = strand_name.lower()
    
    if 'number' in strand_lower:
        return [
            {
                "id": "number_line_model",
                "name": "Number Line Visual",
                "description": "Number line showing counting and ordering",
                "base_prompt": f"A colorful number line from 0 to {10 if int(grade) <= 2 else 100 if int(grade) <= 4 else 1000}, clear markings, educational style",
                "objects": ["number_line", "numbers", "tick_marks"],
                "relationships": ["sequential_order", "equal_spacing"],
                "exclusions": ["text_labels", "equations", "word_problems"],
                "recommended_styles": ["line_art_bw", "cartoon_3d"]
            },
            {
                "id": "counting_objects",
                "name": "Counting Objects",
                "description": "Groups of objects for counting practice",
                "base_prompt": "Groups of colorful objects arranged for counting, simple and clear, child-friendly items like blocks or fruits",
                "objects": ["counting_objects", "groups", "individual_items"],
                "relationships": ["grouping", "one_to_one_correspondence"],
                "exclusions": ["numbers", "text"],
                "recommended_styles": ["cartoon_3d", "illustrated_painting"]
            },
            {
                "id": "place_value_chart",
                "name": "Place Value Model",
                "description": "Visual model showing place value concepts",
                "base_prompt": "A place value chart with base-10 blocks showing ones, tens, and hundreds in different colors",
                "objects": ["ones_blocks", "tens_blocks", "hundreds_blocks"],
                "relationships": ["place_value_grouping", "size_relationships"],
                "exclusions": ["numbers", "text"],
                "recommended_styles": ["illustrated_painting", "cartoon_3d"]
            }
        ]
    
    elif 'geomet' in strand_lower or 'shape' in strand_lower:
        return [
            {
                "id": "2d_shapes_collection",
                "name": "2D Shapes Display",
                "description": "Common 2D shapes in different sizes and colors", 
                "base_prompt": "A collection of basic 2D geometric shapes - circles, squares, triangles, rectangles - in various bright colors",
                "objects": ["circle", "square", "triangle", "rectangle", "pentagon", "hexagon"],
                "relationships": ["shape_comparison", "size_variation"],
                "exclusions": ["text_labels", "numbers", "measurements"],
                "recommended_styles": ["line_art_bw", "cartoon_3d"]
            },
            {
                "id": "3d_shapes_display",
                "name": "3D Shapes Collection",
                "description": "Common 3D shapes rendered clearly",
                "base_prompt": "3D geometric solids - cube, sphere, cone, cylinder, pyramid - with visible faces and edges, colorful",
                "objects": ["cube", "sphere", "cone", "cylinder", "pyramid"],
                "relationships": ["dimensional_relationships", "face_edge_vertex"],
                "exclusions": ["text", "measurements", "formulas"],
                "recommended_styles": ["cartoon_3d", "illustrated_painting"]
            }
        ]
    
    elif 'fraction' in strand_lower or 'operation' in strand_lower:
        return [
            {
                "id": "fraction_circles",
                "name": "Fraction Circle Models",
                "description": "Circles divided into equal parts showing fractions",
                "base_prompt": "Circular fraction models divided into halves, thirds, fourths, and eighths with different colors for each section",
                "objects": ["whole_circle", "halves", "thirds", "fourths", "eighths"],
                "relationships": ["part_to_whole", "equal_parts"],
                "exclusions": ["numbers", "fraction_notation", "text"],
                "recommended_styles": ["line_art_bw", "illustrated_painting"]
            }
        ]
    
    elif 'measure' in strand_lower:
        return [
            {
                "id": "measurement_tools",
                "name": "Measurement Tools Display",
                "description": "Common measurement tools for length, mass, capacity",
                "base_prompt": "A collection of measurement tools - ruler, scale, measuring cup, clock - arranged neatly",
                "objects": ["ruler", "scale", "measuring_cup", "clock"],
                "relationships": ["tool_to_measurement_type"],
                "exclusions": ["numbers", "measurements", "text"],
                "recommended_styles": ["cartoon_3d", "realistic"]
            }
        ]
    
    elif 'data' in strand_lower or 'probability' in strand_lower:
        return [
            {
                "id": "simple_graph_template",
                "name": "Graph Template",
                "description": "Empty graph structure for data display",
                "base_prompt": "A simple bar graph template with grid lines and axes, colorful but no data filled in",
                "objects": ["axes", "grid_lines", "bars_empty"],
                "relationships": ["axis_orientation"],
                "exclusions": ["numbers", "data_values", "text_labels"],
                "recommended_styles": ["line_art_bw", "illustrated_painting"]
            }
        ]
    
    elif 'pattern' in strand_lower:
        return [
            {
                "id": "pattern_blocks",
                "name": "Pattern Block Sequence",
                "description": "Colorful blocks showing repeating patterns",
                "base_prompt": "A sequence of colorful pattern blocks arranged to show repeating patterns with shapes and colors",
                "objects": ["pattern_blocks", "sequence", "repeating_elements"],
                "relationships": ["pattern_repetition", "sequence_order"],
                "exclusions": ["text", "numbers"],
                "recommended_styles": ["cartoon_3d", "illustrated_painting"]
            }
        ]
    
    # Generic fallback for any math strand
    return [
        {
            "id": "general_math_scene",
            "name": "General Math Visual",
            "description": f"Visual representation for {strand_name}",
            "base_prompt": f"An educational diagram related to {strand_name}, colorful, clear, and simple for grade {grade}",
            "objects": ["educational_elements", "visual_aids"],
            "relationships": ["mathematical_relationships"],
            "exclusions": ["complex_text", "word_problems", "equations"],
            "recommended_styles": ["cartoon_3d", "illustrated_painting"]
        }
    ]


def generate_science_presets(strand_name, grade):
    """Generate presets for science strands"""
    strand_lower = strand_name.lower()
    
    if 'space' in strand_lower or 'solar' in strand_lower:
        return [
            {
                "id": "solar_system_overview",
                "name": "Solar System Overview",
                "description": "Complete solar system with planets",
                "base_prompt": "A complete solar system showing the sun and all planets in their orbital paths",
                "objects": ["sun", "mercury", "venus", "earth", "mars", "jupiter", "saturn", "uranus", "neptune"],
                "relationships": ["orbiting", "relative_size"],
                "exclusions": ["text_labels", "measurements", "moons", "spacecraft"],
                "recommended_styles": ["cartoon_3d", "illustrated_painting"]
            },
            {
                "id": "planet_close_up",
                "name": "Planet Details",
                "description": "Individual planet with surface features",
                "base_prompt": "A detailed view of a single planet showing surface features and atmosphere",
                "objects": ["single_planet", "surface_features", "atmosphere"],
                "relationships": ["surface_to_planet"],
                "exclusions": ["text", "other_planets", "moons"],
                "recommended_styles": ["realistic", "illustrated_painting"]
            }
        ]
    
    elif 'wave' in strand_lower or 'light' in strand_lower or 'sound' in strand_lower:
        return [
            {
                "id": "wave_diagram",
                "name": "Wave Visualization",
                "description": "Visual representation of waves",
                "base_prompt": "Colorful wave patterns showing peaks and troughs, simple wave diagram",
                "objects": ["waves", "crests", "troughs"],
                "relationships": ["wave_pattern", "repetition"],
                "exclusions": ["text", "labels", "measurements"],
                "recommended_styles": ["line_art_bw", "illustrated_painting"]
            },
            {
                "id": "light_rays_scene",
                "name": "Light and Shadows",
                "description": "Light source creating shadows",
                "base_prompt": "A light source casting rays and creating shadows on simple objects",
                "objects": ["light_source", "light_rays", "objects", "shadows"],
                "relationships": ["light_to_shadow", "directional_rays"],
                "exclusions": ["text", "complex_objects"],
                "recommended_styles": ["cartoon_3d", "illustrated_painting"]
            }
        ]
    
    elif 'plant' in strand_lower or 'life' in strand_lower or 'organism' in strand_lower:
        return [
            {
                "id": "plant_parts_diagram",
                "name": "Plant Parts",
                "description": "Complete plant showing all parts",
                "base_prompt": "A simple flowering plant showing visible roots, stem, leaves, and flower",
                "objects": ["roots", "stem", "leaves", "flower", "soil"],
                "relationships": ["parts_of_whole", "above_below_ground"],
                "exclusions": ["text_labels", "measurements", "multiple_species"],
                "recommended_styles": ["line_art_bw", "illustrated_painting"]
            },
            {
                "id": "animal_habitat",
                "name": "Animal in Habitat",
                "description": "Animal in its natural environment",
                "base_prompt": f"A friendly animal in its natural habitat, simple and colorful, appropriate for grade {grade}",
                "objects": ["animal", "habitat_elements", "environment"],
                "relationships": ["animal_to_environment"],
                "exclusions": ["text", "dangerous_situations", "scary_elements"],
                "recommended_styles": ["cartoon_3d"]
            }
        ]
    
    elif 'earth' in strand_lower or 'weather' in strand_lower:
        return [
            {
                "id": "weather_types_scene",
                "name": "Weather Types",
                "description": "Different weather conditions visualized",
                "base_prompt": "Four panels showing different weather types - sunny, rainy, cloudy, and windy - with simple icons",
                "objects": ["sun", "clouds", "rain", "wind_indicators"],
                "relationships": ["weather_variation"],
                "exclusions": ["text", "temperature_readings", "specific_locations"],
                "recommended_styles": ["cartoon_3d", "illustrated_painting"]
            }
        ]
     
    elif 'force' in strand_lower or 'motion' in strand_lower:
        return [
            {
                "id": "forces_in_action",
                "name": "Forces Demonstration",
                "description": "Objects showing push and pull forces",
                "base_prompt": "Simple objects demonstrating forces - a ball being pushed, a wagon being pulled, showing motion",
                "objects": ["ball", "wagon", "motion_indicators"],
                "relationships": ["force_to_motion", "cause_effect"],
                "exclusions": ["text", "arrows_with_labels", "people"],
                "recommended_styles": ["cartoon_3d"]
            }
        ]
    
    # Generic science fallback
    return [
        {
            "id": "general_science_scene",
            "name": f"{strand_name} Visual",
            "description": f"Scientific visualization for {strand_name}",
            "base_prompt": f"An educational science scene related to {strand_name}, clear and age-appropriate for grade {grade}",
            "objects": ["scientific_elements", "educational_components"],
            "relationships": ["scientific_relationships"],
            "exclusions": ["complex_text", "advanced_concepts", "dangerous_elements"],
            "recommended_styles": ["cartoon_3d", "illustrated_painting"]
        }
    ]


def generate_language_arts_presets(strand_name, grade):
    """Generate presets for language arts strands"""
    strand_lower = strand_name.lower()
    
    if 'reading' in strand_lower or 'viewing' in strand_lower:
        return [
            {
                "id": "storybook_scene",
                "name": "Storybook Scene",
                "description": "Simple story scene with character and setting",
                "base_prompt": "A colorful storybook illustration showing a character in a simple setting, child-friendly and engaging",
                "objects": ["character", "setting_elements", "background"],
                "relationships": ["character_in_setting"],
                "exclusions": ["text", "speech_bubbles", "words"],
                "recommended_styles": ["cartoon_3d", "illustrated_painting"]
            },
{
                "id": "book_cover_style",
                "name": "Book Cover Scene",
                "description": "Illustrated scene suitable for a book cover",
                "base_prompt": "An engaging illustration suitable for a children's book cover, showing an interesting scene without text",
                "objects": ["scene_elements", "focal_point"],
                "relationships": ["visual_composition"],
                "exclusions": ["text", "title", "author_name"],
                "recommended_styles": ["illustrated_painting"]
            }
        ]
    
    elif 'writing' in strand_lower:
        return [
            {
                "id": "writing_inspiration_scene",
                "name": "Story Inspiration Scene",
                "description": "Interesting scene to inspire creative writing",
                "base_prompt": "An interesting scene that could inspire a story - a mysterious door, a magical forest, or an unusual object",
                "objects": ["story_elements", "setting", "interesting_object"],
                "relationships": ["visual_narrative"],
                "exclusions": ["text", "completed_story", "characters_with_dialogue"],
                "recommended_styles": ["illustrated_painting", "cartoon_3d"]
            }
        ]
    
    elif 'listening' in strand_lower or 'speaking' in strand_lower:
        return [
            {
                "id": "communication_scene",
                "name": "Communication Scene",
                "description": "People or characters in communication",
                "base_prompt": "Two friendly characters appearing to communicate, simple and expressive body language",
                "objects": ["character_1", "character_2", "setting"],
                "relationships": ["interaction", "communication"],
                "exclusions": ["speech_bubbles", "text", "words"],
                "recommended_styles": ["cartoon_3d"]
            }
        ]
    
    # Generic fallback
    return [
        {
            "id": "general_language_arts_scene",
            "name": f"{strand_name} Visual",
            "description": f"Visual for {strand_name} activities",
            "base_prompt": f"An educational scene related to {strand_name}, engaging and age-appropriate for grade {grade}",
            "objects": ["educational_elements", "grade_appropriate_content"],
            "relationships": ["learning_context"],
            "exclusions": ["text", "words", "complex_dialogue"],
            "recommended_styles": ["cartoon_3d", "illustrated_painting"]
        }
    ]


def generate_social_studies_presets(strand_name, grade):
    """Generate presets for social studies strands"""
    strand_lower = strand_name.lower()
    
    if 'spatial' in strand_lower or 'geography' in strand_lower:
        return [
            {
                "id": "map_style_view",
                "name": "Map-Style View",
                "description": "Simplified map or geographical view",
                "base_prompt": "A simple map-style illustration showing geographical features like mountains, rivers, and coastlines",
                "objects": ["land", "water", "geographical_features"],
                "relationships": ["spatial_arrangement"],
                "exclusions": ["text_labels", "place_names", "measurements"],
                "recommended_styles": ["illustrated_painting", "cartoon_3d"]
            }
        ]
    
    elif 'community' in strand_lower or 'civic' in strand_lower:
        return [
            {
                "id": "community_scene",
                "name": "Community Helper Scene",
                "description": "Community helpers in their work environment",
                "base_prompt": f"A friendly community helper at work - firefighter, teacher, or doctor - in a simple work setting, grade {grade} appropriate",
                "objects": ["community_helper", "work_setting", "tools_equipment"],
                "relationships": ["person_to_profession", "tools_to_work"],
                "exclusions": ["text", "dangerous_situations", "complex_scenes"],
                "recommended_styles": ["cartoon_3d"]
            }
        ]
    
    elif 'historical' in strand_lower or 'culture' in strand_lower:
        return [
            {
                "id": "historical_scene",
                "name": "Historical Setting",
                "description": "Simple historical or cultural scene",
                "base_prompt": f"A simple historical or cultural scene appropriate for grade {grade}, showing traditional elements without text",
                "objects": ["historical_elements", "cultural_items", "setting"],
                "relationships": ["cultural_context"],
                "exclusions": ["text", "specific_dates", "complex_politics"],
                "recommended_styles": ["illustrated_painting"]
            }
        ]
    
    elif 'economic' in strand_lower:
        return [
            {
                "id": "goods_services_scene",
                "name": "Goods and Services",
                "description": "Visual showing goods or services",
                "base_prompt": "A simple scene showing goods in a store or someone providing a service, child-friendly",
                "objects": ["goods_items", "service_provider", "setting"],
                "relationships": ["economic_exchange"],
                "exclusions": ["money_amounts", "prices", "text"],
                "recommended_styles": ["cartoon_3d"]
            }
        ]
    
    # Generic fallback
    return [
        {
            "id": "general_social_studies_scene",
            "name": f"{strand_name} Scene",
            "description": f"Social studies scene for {strand_name}",
            "base_prompt": f"An educational social studies scene related to {strand_name}, appropriate for grade {grade}",
            "objects": ["social_elements", "community_aspects"],
            "relationships": ["social_relationships"],
            "exclusions": ["text", "specific_names", "complex_politics"],
            "recommended_styles": ["cartoon_3d", "illustrated_painting"]
        }
    ]


def generate_science_presets_generic(strand_name, grade):
    """Generic fallback for any science strand"""
    return [
        {
            "id": "general_science_diagram",
            "name": f"{strand_name} Diagram",
            "description": f"Educational diagram for {strand_name}",
            "base_prompt": f"A clear educational science diagram related to {strand_name}, appropriate for grade {grade} students",
            "objects": ["scientific_elements", "diagram_components"],
            "relationships": ["scientific_relationships"],
            "exclusions": ["text_labels", "complex_terminology", "dangerous_elements"],
            "recommended_styles": ["illustrated_painting", "realistic"]
        },
        {
            "id": "hands_on_science",
            "name": "Hands-On Science Scene",
            "description": "Science experiment or investigation setup",
            "base_prompt": f"A simple science investigation setup related to {strand_name}, colorful equipment and materials",
            "objects": ["investigation_materials", "science_tools"],
            "relationships": ["scientific_investigation"],
            "exclusions": ["text", "dangerous_chemicals", "complex_apparatus"],
            "recommended_styles": ["cartoon_3d"]
        }
    ]


# Build comprehensive presets
all_presets = {}

for topic_id, data in strands.items():
    subject = data['subject']
    grade = data['grade']
    strand = data['strand']
    display_name = data['display_name']
    
    # Generate presets based on subject
    if subject == 'Mathematics':
        presets = generate_math_presets(display_name, grade)
    elif subject == 'Science':
        presets = generate_science_presets(display_name, grade)
    elif subject == 'Language Arts':
        presets = generate_language_arts_presets(display_name, grade)
    elif subject == 'Social Studies':
        presets = generate_social_studies_presets(display_name, grade)
    else:
        # Generic fallback for any subject
        presets = [{
            "id": "general_preset",
            "name": f"{display_name} Visual",
            "description": f"Educational visual for {display_name}",
            "base_prompt": f"An educational scene related to {display_name} for grade {grade}",
            "objects": ["educational_elements"],
            "relationships": ["learning_context"],
            "exclusions": ["text", "complex_details"],
            "recommended_styles": ["cartoon_3d", "illustrated_painting"]
        }]
    
    # Add to all_presets
    all_presets[topic_id] = {
        "topic_id": topic_id,
        "display_name": f"{display_name} (Grade {grade} {subject})",
        "subject": subject,
        "grade_band": grade,
        "strand": strand,
        "image_presets": presets
    }

print(f"\n✅ Generated {len(all_presets)} topic entries")
print(f"✅ Total presets: {sum(len(t['image_presets']) for t in all_presets.values())}")

# Save to file
output_path = Path('backend/config/topic_presets_comprehensive.json')
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(all_presets, f, indent=2)

print(f"\n✅ Saved to {output_path}")
print("\nSample topics:")
for i, (key, data) in enumerate(list(all_presets.items())[:5]):
    print(f"{i+1}. {key}")
    print(f"   Presets: {len(data['image_presets'])}")
