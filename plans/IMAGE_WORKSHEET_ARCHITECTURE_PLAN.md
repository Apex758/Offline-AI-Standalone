# Image-First Worksheet Generator Architecture Plan

## Executive Summary

This plan adapts your worksheet generator to follow an **image-first, hallucination-proof pipeline** where:

1. Images are generated (or selected) FIRST using structured scene specifications
2. Scene metadata is locked before worksheet generation
3. Questions are generated from structured scene descriptions, NOT from pixels
4. Both Image Generator and Worksheet Generator share the same image brain

---

## Current State Analysis

### ✅ What You Already Have

- **Backend:** [`image_service.py`](../backend/image_service.py) - SDXL-Turbo + IOPaint integration
- **Frontend:** [`WorksheetGenerator.tsx`](../frontend/src/components/WorksheetGenerator.tsx) - Full worksheet UI
- **API Layer:** [`imageApi.ts`](../frontend/src/lib/imageApi.ts) - Image generation API
- **Curriculum System:** Curriculum index with grade/subject/strand mapping
- **Prompt System:** [`worksheetPromptBuilder.ts`](../frontend/src/utils/worksheetPromptBuilder.ts) - LLM prompt construction

### ❌ What's Missing (The Gap)

- **Topic Preset System** - No predefined image intents per topic
- **Style Profiles** - Style settings are scattered, not systematized
- **Reference Image Library** - No IP-Adapter reference management
- **Scene Schema** - No structured scene specifications
- **Image-First Flow** - Images generated ad-hoc during worksheet creation
- **Metadata Store** - No persistent image → scene spec → questions mapping

---

## Phase 1: Configuration & Data Layer

### 1.1 Create Topic Preset System

**File:** `backend/config/topic_presets.json` (NEW)

```json
{
  "science.grade4.solar_system": {
    "topic_id": "science.grade4.solar_system",
    "display_name": "Solar System (Grade 4 Science)",
    "subject": "Science",
    "grade_band": "4",
    "strand": "Earth and Space Science",
    "image_presets": [
      {
        "id": "solar_system_overview",
        "name": "Solar System Overview",
        "description": "Complete solar system with all planets",
        "base_prompt": "A complete solar system diagram showing the sun and all eight planets in their orbital paths, colorful, educational style",
        "objects": [
          "sun",
          "mercury",
          "venus",
          "earth",
          "mars",
          "jupiter",
          "saturn",
          "uranus",
          "neptune"
        ],
        "relationships": ["orbiting", "relative_size"],
        "exclusions": ["text_labels", "measurements", "alien_life"],
        "recommended_styles": ["cartoon_3d", "illustrated_painting"]
      },
      {
        "id": "inner_planets_focus",
        "name": "Inner Planets Close-Up",
        "description": "Rocky planets with visible surface features",
        "base_prompt": "The four inner rocky planets of the solar system - Mercury, Venus, Earth, and Mars - showing their different surface features and sizes",
        "objects": ["mercury", "venus", "earth", "mars"],
        "relationships": ["size_comparison", "surface_features"],
        "exclusions": ["outer_planets", "text_labels"],
        "recommended_styles": ["realistic", "illustrated_painting"]
      },
      {
        "id": "sun_and_planets_diagram",
        "name": "Sun and Planet Relationships",
        "description": "Emphasis on the sun's centrality",
        "base_prompt": "A bright yellow sun at the center with planets arranged around it showing their orbital paths, educational diagram style",
        "objects": ["sun", "planets", "orbital_paths"],
        "relationships": ["central_star", "planetary_orbits"],
        "exclusions": ["moons", "asteroids", "text"],
        "recommended_styles": ["line_art_bw", "cartoon_3d"]
      }
    ]
  },
  "mathematics.grade3.fractions": {
    "topic_id": "mathematics.grade3.fractions",
    "display_name": "Fractions (Grade 3 Math)",
    "subject": "Mathematics",
    "grade_band": "3",
    "strand": "Number Sense",
    "image_presets": [
      {
        "id": "pizza_fractions",
        "name": "Pizza Fraction Models",
        "description": "Pizzas divided into equal slices",
        "base_prompt": "Circular pizzas divided into equal slices showing different fractions like halves, thirds, fourths, and eighths, colorful toppings",
        "objects": ["pizza", "slices", "equal_parts"],
        "relationships": ["part_to_whole", "equal_division"],
        "exclusions": ["numbers", "fraction_notation"],
        "recommended_styles": ["cartoon_3d", "illustrated_painting"]
      }
    ]
  },
  "language_arts.grade2.story_elements": {
    "topic_id": "language_arts.grade2.story_elements",
    "display_name": "Story Elements (Grade 2 Language Arts)",
    "subject": "Language Arts",
    "grade_band": "2",
    "strand": "Reading Comprehension",
    "image_presets": [
      {
        "id": "story_scene_characters",
        "name": "Story Scene with Characters",
        "description": "Characters in a story setting",
        "base_prompt": "A colorful storybook scene showing characters in a setting - a forest with a child, a friendly animal, and a small cottage",
        "objects": [
          "character_child",
          "character_animal",
          "setting_forest",
          "cottage"
        ],
        "relationships": ["character_in_setting", "size_scale"],
        "exclusions": ["speech_bubbles", "text", "complex_plot"],
        "recommended_styles": ["cartoon_3d", "illustrated_painting"]
      }
    ]
  }
}
```

**Action Items:**

- [ ] Create `backend/config/` directory
- [ ] Generate presets for K-6 core subjects (Math, Science, Language Arts, Social Studies)
- [ ] Minimum 3-5 presets per commonly taught topic
- [ ] Include `objects`, `relationships`, `exclusions` for each preset

---

### 1.2 Create Style Profile System

**File:** `backend/config/style_profiles.json` (NEW)

```json
{
  "line_art_bw": {
    "id": "line_art_bw",
    "name": "Black & White Line Art",
    "description": "Simple clean lines, perfect for K-2 coloring",
    "grade_bands": ["K", "1", "2"],
    "base_prompt_suffix": ", black and white line art, clean simple lines, coloring book style, no shading",
    "negative_prompt": "color, shading, gradient, photorealistic, complex details, text, labels, numbers",
    "sdxl_settings": {
      "width": 512,
      "height": 512,
      "num_inference_steps": 4,
      "guidance_scale": 0.0,
      "cfg_scale": 7.0
    },
    "ip_adapter": {
      "enabled": true,
      "strength": 0.6,
      "reference_set": "line_art_references"
    }
  },
  "cartoon_3d": {
    "id": "cartoon_3d",
    "name": "3D Cartoon Style",
    "description": "Colorful, friendly, Pixar-like style for ages 6-10",
    "grade_bands": ["2", "3", "4", "5"],
    "base_prompt_suffix": ", 3D cartoon style, Pixar-like, colorful, friendly, smooth shading, child-appropriate",
    "negative_prompt": "photorealistic, scary, violent, dark, text, labels, watermark, signature",
    "sdxl_settings": {
      "width": 768,
      "height": 512,
      "num_inference_steps": 4,
      "guidance_scale": 0.0,
      "cfg_scale": 7.0
    },
    "ip_adapter": {
      "enabled": true,
      "strength": 0.7,
      "reference_set": "cartoon_3d_references"
    }
  },
  "illustrated_painting": {
    "id": "illustrated_painting",
    "name": "Illustrated Painting",
    "description": "Textured, artistic style for grades 4-6",
    "grade_bands": ["4", "5", "6"],
    "base_prompt_suffix": ", illustrated painting style, textured brushstrokes, educational illustration, vibrant colors",
    "negative_prompt": "photographic, cartoon, childish, text, labels, numbers",
    "sdxl_settings": {
      "width": 768,
      "height": 768,
      "num_inference_steps": 4,
      "guidance_scale": 0.0,
      "cfg_scale": 7.0
    },
    "ip_adapter": {
      "enabled": true,
      "strength": 0.5,
      "reference_set": "illustrated_references"
    }
  },
  "realistic": {
    "id": "realistic",
    "name": "Photorealistic",
    "description": "Realistic scientific diagrams for upper grades",
    "grade_bands": ["5", "6"],
    "base_prompt_suffix": ", photorealistic, scientific accuracy, high detail, educational photography",
    "negative_prompt": "cartoon, stylized, artistic, text, labels, watermark",
    "sdxl_settings": {
      "width": 768,
      "height": 768,
      "num_inference_steps": 6,
      "guidance_scale": 0.0,
      "cfg_scale": 7.5
    },
    "ip_adapter": {
      "enabled": true,
      "strength": 0.4,
      "reference_set": "realistic_references"
    }
  }
}
```

**Action Items:**

- [ ] Create style profiles JSON
- [ ] Test each style with sample prompts
- [ ] Validate IP-Adapter strength values

---

## Phase 2: Reference Image System (IP-Adapter)

### 2.1 Create Reference Image Directory Structure

```
backend/
  config/
    reference_images/
      line_art_references/
        science/
          solar_system_01.png
          plants_01.png
        general/
          simple_objects_01.png
      cartoon_3d_references/
        science/
          planets_cartoon_01.png
        animals/
          friendly_animals_01.png
        general/
          characters_01.png
      illustrated_references/
        science/
          ecosystem_painting_01.png
        historical/
          ancient_civilizations_01.png
        general/
          landscapes_01.png
      realistic_references/
        science/
          microscope_photo_01.png
        geography/
          landforms_photo_01.png
```

**File:** `backend/config/reference_images_index.json` (NEW)

```json
{
  "line_art_references": {
    "style_id": "line_art_bw",
    "images": [
      {
        "id": "line_art_solar_system_01",
        "path": "backend/config/reference_images/line_art_references/science/solar_system_01.png",
        "tags": ["science", "space", "planets"],
        "description": "Simple line art solar system diagram"
      },
      {
        "id": "line_art_objects_01",
        "path": "backend/config/reference_images/line_art_references/general/simple_objects_01.png",
        "tags": ["general", "objects"],
        "description": "Basic shapes and objects in line art"
      }
    ]
  },
  "cartoon_3d_references": {
    "style_id": "cartoon_3d",
    "images": [
      {
        "id": "cartoon_planets_01",
        "path": "backend/config/reference_images/cartoon_3d_references/science/planets_cartoon_01.png",
        "tags": ["science", "space", "planets"],
        "description": "Pixar-style colorful planets"
      }
    ]
  }
}
```

**Action Items:**

- [ ] Create reference image directory structure
- [ ] Curate 10-15 reference images per style profile
- [ ] Index all reference images
- [ ] Implement reference image loader in `image_service.py`

---

### 2.2 Implement IP-Adapter Reference Manager

**File:** `backend/ip_adapter_manager.py` (NEW)

```python
import json
import random
from pathlib import Path
from typing import List, Dict, Optional
from PIL import Image

class IPAdapterManager:
    """Manages reference images for IP-Adapter style transfer"""

    def __init__(self, index_path: str = "backend/config/reference_images_index.json"):
        self.index_path = Path(index_path)
        self.reference_index = self._load_index()

    def _load_index(self) -> Dict:
        """Load reference image index"""
        if not self.index_path.exists():
            return {}
        with open(self.index_path, 'r') as f:
            return json.load(f)

    def get_references_for_style(
        self,
        style_id: str,
        tags: Optional[List[str]] = None,
        count: int = 1,
        random_selection: bool = True
    ) -> List[Path]:
        """
        Get reference images for a given style

        Args:
            style_id: Style profile ID (e.g., "cartoon_3d")
            tags: Filter by tags (e.g., ["science", "space"])
            count: Number of references to return
            random_selection: Randomly select from matches

        Returns:
            List of file paths to reference images
        """
        reference_set_key = f"{style_id}_references"
        reference_set = self.reference_index.get(reference_set_key, {})
        images = reference_set.get("images", [])

        # Filter by tags if provided
        if tags:
            images = [
                img for img in images
                if any(tag in img.get("tags", []) for tag in tags)
            ]

        # If no tag matches, use all images from the set
        if not images:
            images = reference_set.get("images", [])

        # Select images
        if random_selection:
            selected = random.sample(images, min(count, len(images)))
        else:
            selected = images[:count]

        return [Path(img["path"]) for img in selected]

    def load_reference_images(self, paths: List[Path]) -> List[Image.Image]:
        """Load PIL Images from paths"""
        return [Image.open(path).convert("RGB") for path in paths if path.exists()]
```

**Action Items:**

- [ ] Create `ip_adapter_manager.py`
- [ ] Integrate with `image_service.py`
- [ ] Test reference image loading

---

## Phase 3: Scene Schema System

### 3.1 Define Scene Specification Schema

**File:** `frontend/src/types/scene.ts` (NEW)

```typescript
/**
 * Structured scene specification - the bridge between image and questions
 */
export interface SceneSpec {
  // Unique identifier for this scene
  scene_id: string;

  // Topic context
  topic_id: string;
  subject: string;
  grade_level: string;
  strand: string;

  // What's actually in the scene
  objects: SceneObject[];

  // How objects relate to each other
  relationships: SceneRelationship[];

  // What's explicitly excluded (prevents hallucination)
  exclusions: string[];

  // Educational intent
  learning_objectives: string[];

  // Generation metadata
  created_at: string;
  image_preset_id?: string;
  style_profile_id?: string;
}

export interface SceneObject {
  id: string;
  type: string; // e.g., "planet", "character", "fraction_piece"
  name: string; // e.g., "Earth", "protagonist", "half_circle"
  properties: Record<string, any>; // e.g., {color: "blue", size: "large"}
  visible: boolean;
  countable: boolean; // Can students count these?
}

export interface SceneRelationship {
  type: string; // e.g., "orbiting", "larger_than", "part_of"
  subject: string; // object ID
  object: string; // object ID
  description: string;
}

// Example usage:
const example_scene: SceneSpec = {
  scene_id: "scene_solar_system_20260205_001",
  topic_id: "science.grade4.solar_system",
  subject: "Science",
  grade_level: "4",
  strand: "Earth and Space Science",

  objects: [
    {
      id: "sun_01",
      type: "star",
      name: "Sun",
      properties: { color: "yellow", size: "largest", position: "center" },
      visible: true,
      countable: true,
    },
    {
      id: "earth_01",
      type: "planet",
      name: "Earth",
      properties: {
        color: "blue_green",
        has_atmosphere: true,
        position: "third_orbit",
      },
      visible: true,
      countable: true,
    },
    {
      id: "mars_01",
      type: "planet",
      name: "Mars",
      properties: { color: "red", size: "small", position: "fourth_orbit" },
      visible: true,
      countable: true,
    },
  ],

  relationships: [
    {
      type: "orbits",
      subject: "earth_01",
      object: "sun_01",
      description: "Earth orbits around the Sun",
    },
    {
      type: "larger_than",
      subject: "earth_01",
      object: "mars_01",
      description: "Earth is larger than Mars",
    },
  ],

  exclusions: [
    "text_labels",
    "numerical_measurements",
    "alien_life",
    "spacecraft",
  ],

  learning_objectives: [
    "Identify planets in the solar system",
    "Understand orbital relationships",
    "Compare relative sizes of celestial bodies",
  ],

  created_at: "2026-02-05T22:00:00Z",
  image_preset_id: "solar_system_overview",
  style_profile_id: "cartoon_3d",
};
```

**Action Items:**

- [ ] Create `scene.ts` type definitions
- [ ] Add scene spec validation functions
- [ ] Create scene spec builder utilities

---

### 3.2 Implement Scene Schema Builder

**File:** `backend/scene_schema.py` (NEW)

```python
from typing import List, Dict, Any, Optional
from datetime import datetime
import json
from pydantic import BaseModel

class SceneObject(BaseModel):
    id: str
    type: str
    name: str
    properties: Dict[str, Any]
    visible: bool = True
    countable: bool = True

class SceneRelationship(BaseModel):
    type: str
    subject: str  # object ID
    object: str   # object ID
    description: str

class SceneSpec(BaseModel):
    scene_id: str
    topic_id: str
    subject: str
    grade_level: str
    strand: str
    objects: List[SceneObject]
    relationships: List[SceneRelationship]
    exclusions: List[str]
    learning_objectives: List[str]
    created_at: str
    image_preset_id: Optional[str] = None
    style_profile_id: Optional[str] = None

class SceneSchemaBuilder:
    """Builds structured scene specifications from topic presets"""

    def __init__(self, presets_path: str = "backend/config/topic_presets.json"):
        with open(presets_path, 'r') as f:
            self.presets = json.load(f)

    def build_scene_from_preset(
        self,
        topic_id: str,
        preset_id: str,
        style_profile_id: str
    ) -> SceneSpec:
        """
        Build a structured scene specification from a topic preset

        Args:
            topic_id: Topic identifier (e.g., "science.grade4.solar_system")
            preset_id: Image preset ID (e.g., "solar_system_overview")
            style_profile_id: Style profile ID (e.g., "cartoon_3d")

        Returns:
            SceneSpec with objects, relationships, and exclusions
        """
        topic_data = self.presets.get(topic_id)
        if not topic_data:
            raise ValueError(f"Topic {topic_id} not found")

        preset = next(
            (p for p in topic_data["image_presets"] if p["id"] == preset_id),
            None
        )
        if not preset:
            raise ValueError(f"Preset {preset_id} not found for topic {topic_id}")

        # Generate scene ID
        scene_id = f"scene_{topic_id.replace('.', '_')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}"

        # Convert preset objects to SceneObjects
        scene_objects = []
        for i, obj_type in enumerate(preset.get("objects", [])):
            scene_objects.append(SceneObject(
                id=f"{obj_type}_{i+1:02d}",
                type=obj_type,
                name=obj_type.replace("_", " ").title(),
                properties={"index": i},
                visible=True,
                countable=True
            ))

        # Build relationships from preset metadata
        relationships = []
        for rel_type in preset.get("relationships", []):
            # Example: infer relationships based on type
            if rel_type == "orbiting" and len(scene_objects) > 1:
                # Planets orbit the sun
                sun_obj = next((o for o in scene_objects if "sun" in o.type), None)
                if sun_obj:
                    for obj in scene_objects:
                        if obj != sun_obj and "planet" in obj.type:
                            relationships.append(SceneRelationship(
                                type="orbits",
                                subject=obj.id,
                                object=sun_obj.id,
                                description=f"{obj.name} orbits {sun_obj.name}"
                            ))

        return SceneSpec(
            scene_id=scene_id,
            topic_id=topic_id,
            subject=topic_data["subject"],
            grade_level=topic_data["grade_band"],
            strand=topic_data["strand"],
            objects=scene_objects,
            relationships=relationships,
            exclusions=preset.get("exclusions", []),
            learning_objectives=[],  # To be filled based on curriculum
            created_at=datetime.now().isoformat(),
            image_preset_id=preset_id,
            style_profile_id=style_profile_id
        )

    def scene_to_prompt(self, scene: SceneSpec, style_suffix: str) -> str:
        """Convert scene spec to image generation prompt"""
        # Build a natural language prompt from structured spec
        object_names = [obj.name for obj in scene.objects if obj.visible]
        prompt = f"A scene showing {', '.join(object_names)}"

        # Add relationships as context
        if scene.relationships:
            rel_desc = ", ".join([r.description for r in scene.relationships[:2]])
            prompt += f", where {rel_desc}"

        # Add style
        prompt += style_suffix

        return prompt
```

**Action Items:**

- [ ] Create `scene_schema.py`
- [ ] Implement preset → scene spec conversion
- [ ] Add scene spec → prompt conversion
- [ ] Test scene spec generation

---

## Phase 4: Image-First Pipeline Refactor

### 4.1 Update Image Service

**File:** `backend/image_service.py` (MODIFY)

Add scene-aware image generation:

```python
# Add to ImageService class

def generate_image_from_scene(
    self,
    scene_spec: dict,
    style_profile: dict,
    reference_images: Optional[List] = None
) -> Optional[bytes]:
    """
    Generate image from structured scene specification

    Args:
        scene_spec: SceneSpec dictionary
        style_profile: Style profile dictionary
       reference_images: PIL Images for IP-Adapter

    Returns:
        bytes: PNG image data
    """
    from scene_schema import SceneSchemaBuilder

    builder = SceneSchemaBuilder()

    # Convert scene spec to prompt
    style_suffix = style_profile.get("base_prompt_suffix", "")
    prompt = builder.scene_to_prompt(scene_spec, style_suffix)

    # Get SDXL settings from style profile
    settings = style_profile.get("sdxl_settings", {})

    # Generate image
    return self.generate_image(
        prompt=prompt,
        negative_prompt=style_profile.get("negative_prompt", ""),
        width=settings.get("width", 512),
        height=settings.get("height", 512),
        num_inference_steps=settings.get("num_inference_steps", 4),
        guidance_scale=settings.get("guidance_scale", 0.0),
        # TODO: Add IP-Adapter integration here
    )
```

**Action Items:**

- [ ] Add `generate_image_from_scene` method
- [ ] Integrate IP-Adapter with reference images
- [ ] Test scene-based generation

---

### 4.2 Create Backend API Endpoints

**File:** `backend/main.py` (MODIFY)

Add new endpoints:

```python
from scene_schema import SceneSchemaBuilder, SceneSpec
from ip_adapter_manager import IPAdapterManager

# Initialize at startup
scene_builder = SceneSchemaBuilder()
ip_manager = IPAdapterManager()

@app.get("/api/topic-presets")
async def get_topic_presets():
    """Get all available topic presets"""
    return scene_builder.presets

@app.get("/api/topic-presets/{topic_id}")
async def get_topic_preset(topic_id: str):
    """Get presets for a specific topic"""
    topic_data = scene_builder.presets.get(topic_id)
    if not topic_data:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic_data

@app.post("/api/generate-scene-image")
async def generate_scene_image(request: Request):
    """
    Generate image from scene specification

    Request body:
    {
        "topic_id": "science.grade4.solar_system",
        "preset_id": "solar_system_overview",
        "style_profile_id": "cartoon_3d"
    }

    Returns:
    {
        "success": true,
        "imageData": "data:image/png;base64,...",
        "sceneSpec": {...},
        "metadata": {...}
    }
    """
    data = await request.json()

    # Build scene spec from preset
    scene_spec = scene_builder.build_scene_from_preset(
        topic_id=data["topic_id"],
        preset_id=data["preset_id"],
        style_profile_id=data["style_profile_id"]
    )

    # Load style profile
    with open("backend/config/style_profiles.json", 'r') as f:
        style_profiles = json.load(f)
    style_profile = style_profiles[data["style_profile_id"]]

    # Get reference images for IP-Adapter
    ref_paths = ip_manager.get_references_for_style(
        data["style_profile_id"],
        tags=[scene_spec.subject.lower()],
        count=2
    )
    ref_images = ip_manager.load_reference_images(ref_paths)

    # Generate image
    image_service = get_image_service()
    image_bytes = image_service.generate_image_from_scene(
        scene_spec=scene_spec.dict(),
        style_profile=style_profile,
        reference_images=ref_images
    )

    if not image_bytes:
        raise HTTPException(status_code=500, detail="Image generation failed")

    # Convert to base64
    image_b64 = base64.b64encode(image_bytes).decode('utf-8')

    return {
        "success": True,
        "imageData": f"data:image/png;base64,{image_b64}",
        "sceneSpec": scene_spec.dict(),
        "metadata": {
            "topic_id": data["topic_id"],
            "preset_id": data["preset_id"],
            "style_profile_id": data["style_profile_id"],
            "generated_at": datetime.now().isoformat()
        }
    }
```

**Action Items:**

- [ ] Add topic preset endpoints
- [ ] Add scene image generation endpoint
- [ ] Test API integration

---

## Phase 5: Preset-Based UI Update

### 5.1 Update Worksheet Generator UI

**File:** `frontend/src/components/WorksheetGenerator.tsx` (MODIFY)

Replace free-form image prompt with preset selection:

```typescript
// Add state for presets
const [topicPresets, setTopicPresets] = useState<TopicPreset[]>([]);
const [selectedPreset, setSelectedPreset] = useState<string>('');
const [sceneSpec, setSceneSpec] = useState<SceneSpec | null>(null);

// Load presets when topic changes
useEffect(() => {
  const loadPresets = async () => {
    if (!formData.subject || !formData.gradeLevel || !formData.topic) {
      setTopicPresets([]);
      return;
    }

    // Build topic ID from form data
    const topicId = `${formData.subject.toLowerCase()}.grade${formData.gradeLevel}.${formData.topic.toLowerCase().replace(/\s+/g, '_')}`;

    try {
      const response = await axios.get(`http://localhost:8000/api/topic-presets/${topicId}`);
      setTopicPresets(response.data.image_presets || []);
    } catch (error) {
      console.log('No presets found for this topic, using manual mode');
      setTopicPresets([]);
    }
  };

  loadPresets();
}, [formData.subject, formData.gradeLevel, formData.topic]);

// Replace manual image prompt with preset selector
const renderImageSection = () => {
  if (!formData.includeImages) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Image Selection</h3>

      {topicPresets.length > 0 ? (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Intent (What do you want to show?)
            </label>
            <select
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select an image type...</option>
              {topicPresets.map(preset => (
                <option key={preset.id} value={preset.id}>
                  {preset.name} - {preset.description}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Visual Style
            </label>
            <select
              value={formData.imageStyle}
              onChange={(e) => handleInputChange('imageStyle', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="cartoon_3d">3D Cartoon (Colorful, Pixar-like)</option>
              <option value="line_art_bw">Black & White Line Art (Coloring)</option>
              <option value="illustrated_painting">Illustrated Painting</option>
              <option value="realistic">Photorealistic</option>
            </select>
          </div>

          <button
            onClick={handleGenerateSceneImage}
            disabled={!selectedPreset || generatingImages}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {generatingImages ? 'Generating Image...' : 'Generate Image from Preset'}
          </button>
        </>
      ) : (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            No presets available for this topic. You can still generate worksheets without images.
          </p>
        </div>
      )}
    </div>
  );
};

// New handler for scene-based image generation
const handleGenerateSceneImage = async () => {
  if (!selectedPreset) return;

  setGeneratingImages(true);
  setImageError(null);

  try {
    const topicId = `${formData.subject.toLowerCase()}.grade${formData.gradeLevel}.${formData.topic.toLowerCase().replace(/\s+/g, '_')}`;

    const response = await axios.post('http://localhost:8000/api/generate-scene-image', {
      topic_id: topicId,
      preset_id: selectedPreset,
      style_profile_id: formData.imageStyle
    });

    if (response.data.success) {
      setGeneratedImages([response.data.imageData]);
      setSceneSpec(response.data.sceneSpec); // Store scene spec for question generation
    } else {
      throw new Error('Image generation failed');
    }
  } catch (err) {
    setImageError('Failed to generate image');
  } finally {
    setGeneratingImages(false);
  }
};
```

**Action Items:**

- [ ] Add preset loading logic
- [ ] Replace manual prompt with preset selector
- [ ] Add style profile dropdown
- [ ] Store scene spec with generated image

---

## Phase 6: Metadata & Asset Store

### 6.1 Create Image Asset Store

**File:** `backend/image_asset_store.py` (NEW)

```python
import json
import hashlib
from pathlib import Path
from datetime import datetime
from typing import Optional, Dict, List

class ImageAsset:
    """Represents a stored image with its metadata"""
    def __init__(
        self,
        asset_id: str,
        image_path: Path,
        scene_spec: Dict,
        style_profile_id: str,
        metadata: Dict
    ):
        self.asset_id = asset_id
        self.image_path = image_path
        self.scene_spec = scene_spec
        self.style_profile_id = style_profile_id
        self.metadata = metadata
        self.created_at = datetime.now().isoformat()

class ImageAssetStore:
    """Manages persistent storage of generated images and their metadata"""

    def __init__(self, store_dir: str = "backend/data/image_assets"):
        self.store_dir = Path(store_dir)
        self.store_dir.mkdir(parents=True, exist_ok=True)
        self.index_file = self.store_dir / "index.json"
        self.index = self._load_index()

    def _load_index(self) -> Dict:
        """Load asset index"""
        if not self.index_file.exists():
            return {}
        with open(self.index_file, 'r') as f:
            return json.load(f)

    def _save_index(self):
        """Save asset index"""
        with open(self.index_file, 'w') as f:
            json.dump(self.index, f, indent=2)

    def store_image(
        self,
        image_data: bytes,
        scene_spec: Dict,
        style_profile_id: str,
        metadata: Optional[Dict] = None
    ) -> str:
        """
        Store image with its scene specification and metadata

        Returns:
            asset_id: Unique identifier for the stored asset
        """
        # Generate asset ID from content hash
        content_hash = hashlib.sha256(image_data).hexdigest()[:16]
        asset_id = f"asset_{content_hash}_{int(datetime.now().timestamp())}"

        # Save image file
        image_path = self.store_dir / f"{asset_id}.png"
        with open(image_path, 'wb') as f:
            f.write(image_data)

        # Save metadata
        asset_metadata = {
            "asset_id": asset_id,
            "image_path": str(image_path),
            "scene_spec": scene_spec,
            "style_profile_id": style_profile_id,
            "metadata": metadata or {},
            "created_at": datetime.now().isoformat()
        }

        self.index[asset_id] = asset_metadata
        self._save_index()

        return asset_id

    def get_asset(self, asset_id: str) -> Optional[Dict]:
        """Retrieve asset metadata"""
        return self.index.get(asset_id)

    def find_assets_by_topic(self, topic_id: str) -> List[Dict]:
        """Find all assets for a given topic"""
        return [
            asset for asset in self.index.values()
            if asset.get("scene_spec", {}).get("topic_id") == topic_id
        ]

    def get_image_path(self, asset_id: str) -> Optional[Path]:
        """Get file path for an asset's image"""
        asset = self.get_asset(asset_id)
        if asset:
            return Path(asset["image_path"])
        return None
```

**Action Items:**

- [ ] Create `image_asset_store.py`
- [ ] Integrate with image generation endpoint
- [ ] Add asset retrieval endpoints
- [ ] Test asset persistence

---

## Phase 7: Question Generation from Scene

### 7.1 Create Worksheet Prompt Builder with Scene Context

**File:** `frontend/src/utils/worksheetPromptBuilder.ts` (MODIFY)

Add scene-aware question generation:

```typescript
function buildSceneContextPrompt(sceneSpec: SceneSpec): string {
  if (!sceneSpec) return "";

  const objects = sceneSpec.objects
    .filter((obj) => obj.visible)
    .map(
      (obj) =>
        `- ${obj.name} (${obj.type})${obj.countable ? " [countable]" : ""}`,
    )
    .join("\n");

  const relationships = sceneSpec.relationships
    .map((rel) => `- ${rel.description}`)
    .join("\n");

  const exclusions = sceneSpec.exclusions.map((ex) => `- NO ${ex}`).join("\n");

  return `
SCENE CONTEXT (Important - use ONLY this information):

Objects visible in the image:
${objects}

Relationships between objects:
${relationships}

What is NOT in the scene (do not reference these):
${exclusions}

RULES FOR QUESTION GENERATION:
1. Only reference objects explicitly listed above
2. Only ask about visible, countable objects
3. Respect the relationships described
4. NEVER reference excluded items
5. Questions must be answerable from the scene description alone
6. Do not assume details not explicitly stated

Example Good Questions (based on above):
- "How many [countable objects] are shown?"
- "Which object is [relationship]?"
- "What can you observe about [specific object]?"

Example BAD Questions (avoid these):
- Questions about excluded items
- Questions requiring specific measurements not provided
- Questions about objects not in the list
`;
}

export function buildWorksheetPrompt(
  formData: WorksheetFormData,
  sceneSpec?: SceneSpec | null,
): string {
  const gradeSpec =
    GRADE_SPECS[formData.gradeLevel as keyof typeof GRADE_SPECS];

  // Build base prompt
  let prompt = `You are creating an educational worksheet for Grade ${formData.gradeLevel} students.

CURRICULUM CONTEXT:
- Subject: ${formData.subject}
- Strand: ${formData.strand}
- Topic: ${formData.topic}

GRADE LEVEL REQUIREMENTS:
[... existing grade spec content ...]

`;

  // Add scene context if available
  if (sceneSpec) {
    prompt += buildSceneContextPrompt(sceneSpec);
  }

  // Add template instructions
  prompt += templateInstructions;

  return prompt;
}
```

**Action Items:**

- [ ] Modify `buildWorksheetPrompt` to accept scene spec
- [ ] Add scene context formatting
- [ ] Add strict rules to prevent hallucination
- [ ] Test with various scene types

---

### 7.2 Update Worksheet Generation Flow

**File:** `frontend/src/components/WorksheetGenerator.tsx` (MODIFY)

```typescript
const handleGenerate = () => {
  // ... existing setup code ...

  // Build prompt WITH scene context if image was generated from preset
  const prompt = buildWorksheetPrompt(formData, sceneSpec);

  const message = {
    prompt,
    formData: {
      ...formData,
      sceneSpec: sceneSpec, // Include scene spec in form data
    },
    jobId,
    generationMode: "queued",
  };

  // ... rest of generation code ...
};
```

**Action Items:**

- [ ] Pass scene spec to prompt builder
- [ ] Include scene spec in worksheet metadata
- [ ] Update worksheet history to store scene specs

---

## Phase 8: Integration & Testing

### 8.1 End-to-End Testing Plan

**Test Scenario 1: Solar System Worksheet (Science Grade 4)**

1. User selects: Subject=Science, Grade=4, Strand=Earth Science, Topic=Solar System
2. System loads presets: `solar_system_overview`, `inner_planets_focus`, etc.
3. User chooses preset: `solar_system_overview`
4. User chooses style: `cartoon_3d`
5. System generates:
   - Scene spec with sun, 8 planets, orbital relationships
   - Image using preset + style + IP-Adapter references
   - Stores image + scene spec in asset store
6. User generates worksheet
7. System creates questions using ONLY scene spec:
   - "How many planets are orbiting the sun?" ✓
   - "Which planet is closest to the sun?" ✓
   - "Are there any moons visible?" ✗ (excluded from scene)

**Test Scenario 2: Fractions Worksheet (Math Grade 3)**

1. Topic: Fractions (pizza model)
2. Preset: `pizza_fractions`
3. Scene contains: 3 pizzas (halves, fourths, eighths)
4. Questions MUST reference only what's in scene spec
5. No hallucinated toppings or sizes not in spec

**Test files to create:**

```
tests/
  integration/
    test_image_first_workflow.py
    test_scene_spec_generation.py
    test_question_from_scene.py
  fixtures/
    sample_scene_specs.json
    sample_presets.json
```

**Action Items:**

- [ ] Create integration test suite
- [ ] Test all major subject/grade combinations
- [ ] Validate no hallucination in questions
- [ ] Test image reusability across worksheets

---

### 8.2 Migration Checklist

**Backend:**

- [ ] Create `backend/config/` directory
- [ ] Add `topic_presets.json` with 10+ topics
- [ ] Add `style_profiles.json` with 4 styles
- [ ] Create `reference_images/` directory structure
- [ ] Implement `scene_schema.py`
- [ ] Implement `ip_adapter_manager.py`
- [ ] Implement `image_asset_store.py`
- [ ] Update `image_service.py` with scene generation
- [ ] Add API endpoints to `main.py`

**Frontend:**

- [ ] Create `frontend/src/types/scene.ts`
- [ ] Update `WorksheetGenerator.tsx` UI
- [ ] Modify `worksheetPromptBuilder.ts`
- [ ] Add preset loading logic
- [ ] Update image generation flow

**Data:**

- [ ] Curate reference images (10-15 per style)
- [ ] Create topic presets for common subjects
- [ ] Test style profiles with sample prompts

---

## Success Metrics

After implementation, you should be able to:

✅ **No Freestyle Prompts by Default**

- Teachers select from 3-5 curated presets per topic
- Presets map to known-good prompt structures

✅ **Image Generated FIRST**

- Scene specification created before any generation
- Image locked before worksheet questions

✅ **Zero Hallucination**

- Questions reference ONLY objects in scene spec
- No pixels analyzed by text model

✅ **Reusable Images**

- Same image can generate multiple worksheet variants
- Image + scene spec stored as reusable asset

✅ **Consistent Style**

- IP-Adapter references ensure style stability
- Grade-appropriate visual complexity

---

## Next Steps

1. **Start with Phase 1** - Set up configuration files
2. **Test incrementally** - Validate each phase before moving on
3. **Gather feedback** - Test with sample topics before scaling
4. **Iterate on presets** - Refine based on actual usage

Would you like me to proceed with implementation of any specific phase?
