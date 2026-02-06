# Visual Style System - Complete Guide

## Overview

Your application uses a **style profile system** that automatically applies visual styling to image generation prompts. This ensures generated images align with the selected visual style (3D Cartoon, Line Art, etc.).

---

## 🎨 Current Architecture

### 1. Style Profile System Location

**File**: [`backend/config/style_profiles.json`](backend/config/style_profiles.json)

**Available Styles**:
- `line_art_bw` - Black & White Line Art (K-2)
- `cartoon_3d` - 3D Cartoon/Pixar Style (2-5)
- `illustrated_painting` - Textured Artistic Style (4-6)
- `realistic` - Photorealistic Scientific (5-6)

---

## 🔧 How Styles Are Applied to Prompts

### Prompt Construction Flow

```
Final Prompt = Base Content + Style Suffix
```

**Example**:
```
Base Content: "A scene showing a flowering plant with roots, stem, leaves, and petals"
Style Suffix: ", 3D cartoon style, Pixar-like, colorful, friendly, smooth shading"
Final Prompt: "A scene showing a flowering plant with roots, stem, leaves, and petals, 3D cartoon style, Pixar-like, colorful, friendly, smooth shading"
```

### Code Implementation

**Location**: [`backend/scene_schema.py`](backend/scene_schema.py:260-300)

```python
def scene_to_prompt(self, scene: SceneSpec, style_suffix: str, base_prompt: str = "") -> str:
    # PRIORITY 1: Use base_prompt from preset
    if base_prompt:
        prompt = base_prompt
    # PRIORITY 2: Build from scene objects
    else:
        visible_objects = [obj for obj in scene.objects if obj.visible]
        object_names = [obj.name for obj in visible_objects]
        prompt = f"A scene showing {', '.join(object_names)}"
    
    # Add style suffix
    prompt += style_suffix
    return prompt
```

**Location**: [`backend/scene_api_endpoints.py`](backend/scene_api_endpoints.py:206)

```python
# Get style suffix from profile
style_suffix = style_profile.get("base_prompt_suffix", "")

# Build final prompt
prompt = builder.scene_to_prompt(scene_spec, style_suffix, base_prompt)
```

---

## 📋 Style Profile Components

### Complete Structure

Each style profile in [`style_profiles.json`](backend/config/style_profiles.json) contains:

```json
{
  "style_id": {
    "id": "unique_identifier",
    "name": "Human-readable name",
    "description": "What this style looks like",
    "grade_bands": ["K", "1", "2"],  // Recommended grades
    
    // ⭐ PROMPT ENGINEERING
    "base_prompt_suffix": ", style descriptors here",
    "negative_prompt": "things to avoid",
    
    // 🎛️ GENERATION SETTINGS
    "sdxl_settings": {
      "width": 512,
      "height": 512,
      "num_inference_steps": 4,
      "guidance_scale": 0.0,
      "cfg_scale": 7.0
    },
    
    // 🖼️ IP-ADAPTER (Style Transfer)
    "ip_adapter": {
      "enabled": true,
      "strength": 0.6,
      "reference_set": "line_art_references"
    }
  }
}
```

---

## 🎯 Detailed Style Breakdown

### 1. Line Art (Black & White)

**Purpose**: Simple coloring pages for young students

**Current Settings**:
```json
{
  "base_prompt_suffix": ", black and white line art, clean simple lines, coloring book style, no shading, clear outlines",
  "negative_prompt": "color, shading, gradient, photorealistic, complex details, text, labels, numbers, watermark, blurry"
}
```

**What It Does**:
- ✅ Creates simple, clear outlines
- ✅ Perfect for printing and coloring
- ✅ No colors or shading
- ❌ Avoids complexity and text

**Example Prompt**:
```
"A flowering plant with visible roots, stem, leaves, and flower petals, black and white line art, clean simple lines, coloring book style, no shading, clear outlines"
```

---

### 2. 3D Cartoon (Pixar-like)

**Purpose**: Engaging, colorful images for elementary students

**Current Settings**:
```json
{
  "base_prompt_suffix": ", 3D cartoon style, Pixar-like, colorful, friendly, smooth shading, child-appropriate, vibrant colors",
  "negative_prompt": "photorealistic, scary, violent, dark, grim, text, labels, watermark, signature, blurry, deformed"
}
```

**What It Does**:
- ✅ Creates vibrant, appealing images
- ✅ Friendly and approachable for children
- ✅ Smooth 3D rendering style
- ❌ Avoids scary or inappropriate content

**Example Prompt**:
```
"Caribbean children observing different types of weather (sunny, rainy, cloudy) with local landmarks in the background, 3D cartoon style, Pixar-like, colorful, friendly, smooth shading, child-appropriate, vibrant colors"
```

---

### 3. Illustrated Painting

**Purpose**: Artistic, textured images for older elementary students

**Current Settings**:
```json
{
  "base_prompt_suffix": ", illustrated painting style, textured brushstrokes, educational illustration, vibrant colors, artistic rendering",
  "negative_prompt": "photographic, overly cartoonish, childish, text, labels, numbers, watermark, low quality"
}
```

**What It Does**:
- ✅ Creates artistic, painterly images
- ✅ More sophisticated than cartoons
- ✅ Suitable for educational contexts
- ❌ Avoids overly childish or photographic looks

**Example Prompt**:
```
"The solar system showing the sun, inner planets (Mercury, Venus, Earth, Mars), illustrated painting style, textured brushstrokes, educational illustration, vibrant colors, artistic rendering"
```

---

### 4. Photorealistic

**Purpose**: Scientific accuracy for upper elementary students

**Current Settings**:
```json
{
  "base_prompt_suffix": ", photorealistic, scientific accuracy, high detail, educational photography style, clear and sharp",
  "negative_prompt": "cartoon, stylized, artistic interpretation, text, labels, watermark, blurry, low resolution"
}
```

**What It Does**:
- ✅ Creates realistic, accurate images
- ✅ Suitable for scientific observation
- ✅ High detail and clarity
- ❌ Avoids stylization and artistic liberties

**Example Prompt**:
```
"Cross-section of a flowering plant showing detailed root system, vascular tissue, and cellular structure, photorealistic, scientific accuracy, high detail, educational photography style, clear and sharp"
```

---

## 🚀 How to Enhance Your Prompts for Better Style Alignment

### Frontend: User Selection

**Location**: [`frontend/src/components/WorksheetGenerator.tsx`](frontend/src/components/WorksheetGenerator.tsx:1228-1243)

The user selects a style from a dropdown:

```tsx
<select
  value={formData.imageStyle}
  onChange={(e) => handleInputChange('imageStyle', e.target.value)}
>
  <option value="cartoon_3d">3D Cartoon (Colorful, Pixar-like)</option>
  <option value="line_art_bw">Black & White Line Art (Coloring)</option>
  <option value="illustrated_painting">Illustrated Painting</option>
  <option value="realistic">Photorealistic</option>
</select>
```

This selection is passed to the backend and automatically applied.

---

## 💡 Best Practices for Style-Aware Prompts

### 1. **Write Style-Agnostic Base Prompts**

Your base prompts (in topic presets) should focus on **CONTENT**, not style:

✅ **Good**:
```json
{
  "base_prompt": "A classroom scene with Caribbean children learning about different types of maps"
}
```

❌ **Bad** (includes style):
```json
{
  "base_prompt": "A 3D cartoon classroom scene with..."  // ❌ Style mixed with content
}
```

The style suffix will be automatically added!

---

### 2. **Leverage Negative Prompts**

Each style has **negative prompts** that prevent unwanted elements:

**Line Art**:
- Prevents: color, shading, gradient, complex details

**3D Cartoon**:
- Prevents: photorealistic, scary, violent, dark content

**Illustrated Painting**:
- Prevents: photographic look, overly childish elements

**Realistic**:
- Prevents: cartoon, stylized, artistic interpretation

You **don't need to manually exclude these** - they're automatically applied!

---

### 3. **Use Descriptive Content Language**

Focus on describing **what should be in the scene**:

```json
{
  "base_prompt": "A cross-section view of Earth showing the crust, mantle, outer core, and inner core layers with different colors representing each layer"
}
```

The style system will handle:
- Visual style (cartoon, realistic, etc.)
- Color treatment (B&W vs. color)
- Rendering technique (line art, 3D, painting, photo)

---

## 🔍 Where Styles Are Defined

### Topic Presets

**Location**: [`backend/config/topic_presets.json`](backend/config/topic_presets.json)

Topic presets define the **content** (what objects to show):

```json
{
  "science.grade2.plants": {
    "subject": "Science",
    "grade_band": "2",
    "strand": "Life Science",
    "image_presets": [
      {
        "id": "plant_parts",
        "name": "Basic Plant Parts",
        "description": "Shows roots, stem, leaves, flower",
        "base_prompt": "A simple flowering plant showing roots underground, stem, green leaves, and a colorful flower",
        "objects": ["roots", "stem", "leaves", "flower"],
        "exclusions": ["soil_cross_section", "insects"]
      }
    ]
  }
}
```

### Style Profiles

**Location**: [`backend/config/style_profiles.json`](backend/config/style_profiles.json)

Style profiles define the **visual treatment** (how it looks):

```json
{
  "cartoon_3d": {
    "base_prompt_suffix": ", 3D cartoon style, Pixar-like, colorful, friendly, smooth shading",
    "negative_prompt": "photorealistic, scary, violent, dark, grim"
  }
}
```

---

## 🎨 Visual Style Enhancement Opportunities

### Current System Strengths
✅ Automatic style application
✅ Grade-appropriate styling
✅ Clean separation of content and style
✅ IP-Adapter for style consistency
✅ Comprehensive negative prompts

### Potential Enhancements

#### 1. **Add Cultural Context to Styles**

For Caribbean/regional content, enhance prompts:

```json
{
  "base_prompt_suffix_regional": ", featuring Caribbean cultural elements, tropical colors, local architecture style, culturally authentic"
}
```

#### 2. **Subject-Specific Style Variations**

Different subjects might benefit from style tweaks:

```json
{
  "science_variant": {
    "base_prompt_suffix": ", 3D cartoon style with educational clarity, labeled visual elements ready for annotation, scientific accuracy maintained"
  },
  "social_studies_variant": {
    "base_prompt_suffix": ", 3D cartoon style with cultural authenticity, diverse representation, historically accurate details"
  }
}
```

#### 3. **Complexity Levels Within Styles**

Add detail level control:

```json
{
  "detail_levels": {
    "simple": ", 3D cartoon style, simplified shapes, minimal details, clear and bold",
    "standard": ", 3D cartoon style, Pixar-like, colorful, friendly, smooth shading",
    "detailed": ", 3D cartoon style with rich environmental details, complex scene composition, multiple visual layers"
  }
}
```

#### 4. **Season/Time-Aware Styling**

For topics requiring specific contexts:

```json
{
  "context_modifiers": {
    "time_of_day": ", during golden hour lighting",
    "season": ", in tropical dry season with lush vegetation",
    "weather": ", under clear blue Caribbean sky"
  }
}
```

---

## 📖 Complete Example: From Selection to Final Prompt

### User Workflow

1. **User selects**:
   - Subject: Science
   - Grade: 2
   - Strand: Life Science
   - Topic: Plant Parts
   - Preset: "Basic Plant Parts"
   - Style: "3D Cartoon"

2. **System retrieves** (from `topic_presets.json`):
```json
{
  "base_prompt": "A simple flowering plant showing roots underground, stem, green leaves, and a colorful flower"
}
```

3. **System retrieves** (from `style_profiles.json`):
```json
{
  "base_prompt_suffix": ", 3D cartoon style, Pixar-like, colorful, friendly, smooth shading, child-appropriate, vibrant colors",
  "negative_prompt": "photorealistic, scary, violent, dark, grim, text, labels, watermark, signature, blurry, deformed"
}
```

4. **System constructs final prompt**:
```
POSITIVE: "A simple flowering plant showing roots underground, stem, green leaves, and a colorful flower, 3D cartoon style, Pixar-like, colorful, friendly, smooth shading, child-appropriate, vibrant colors"

NEGATIVE: "photorealistic, scary, violent, dark, grim, text, labels, watermark, signature, blurry, deformed"
```

5. **Image generated** with:
   - Width: 768px
   - Height: 512px
   - Steps: 4
   - Guidance: 0.0
   - IP-Adapter strength: 0.7 (using cartoon_3d_references)

---

## 🛠️ Implementation Reference

### Key Files

| File | Purpose |
|------|---------|
| [`backend/config/style_profiles.json`](backend/config/style_profiles.json) | Defines all visual styles |
| [`backend/config/topic_presets.json`](backend/config/topic_presets.json) | Defines content (what to show) |
| [`backend/scene_schema.py`](backend/scene_schema.py) | Builds prompts from specs |
| [`backend/scene_api_endpoints.py`](backend/scene_api_endpoints.py) | API for image generation |
| [`frontend/src/components/WorksheetGenerator.tsx`](frontend/src/components/WorksheetGenerator.tsx) | User interface for style selection |

---

## 📝 Quick Reference: Modifying Styles

### To Add a New Style

1. **Add to `style_profiles.json`**:
```json
{
  "watercolor": {
    "id": "watercolor",
    "name": "Watercolor Art",
    "description": "Soft, flowing watercolor painting style",
    "grade_bands": ["3", "4", "5"],
    "base_prompt_suffix": ", watercolor painting style, soft edges, flowing colors, artistic brushwork, gentle tones",
    "negative_prompt": "sharp edges, digital, 3D, photographic, text, labels",
    "sdxl_settings": {
      "width": 768,
      "height": 768,
      "num_inference_steps": 6,
      "guidance_scale": 0.0,
      "cfg_scale": 7.0
    },
    "ip_adapter": {
      "enabled": true,
      "strength": 0.5,
      "reference_set": "watercolor_references"
    }
  }
}
```

2. **Add to frontend dropdown** in `WorksheetGenerator.tsx`:
```tsx
<option value="watercolor">Watercolor Art</option>
```

3. **Add reference images** (optional):
   - Place in `backend/reference_images/watercolor_references/`
   - Update `reference_images_index.json`

---

## 🎯 Summary

### Your current system automatically handles:
✅ Style suffix application to prompts
✅ Negative prompt management
✅ SDXL parameter optimization per style
✅ IP-Adapter style consistency
✅ Grade-appropriate styling

### You DON'T need to:
❌ Manually add style descriptors to base prompts
❌ Worry about negative prompts
❌ Adjust SDXL settings per generation
❌ Handle style conflicts

### The system architecture ensures:
🎨 Content (what) is separated from style (how)
🔄 Styles are consistently applied
📚 Grade-appropriate visual complexity
🌐 Culturally appropriate content

---

## 💬 Next Steps

If you want to enhance style alignment in your prompts:

1. **Review your topic preset base prompts** - ensure they're style-agnostic
2. **Test different style suffixes** - experiment with more descriptive language
3. **Add cultural/contextual modifiers** - for regional content
4. **Collect reference images** - to improve IP-Adapter consistency
5. **Create subject-specific variants** - for math vs. science vs. social studies

The architecture is already well-designed - any enhancements should focus on refining the **base_prompt_suffix** and **negative_prompt** values in [`style_profiles.json`](backend/config/style_profiles.json)!
