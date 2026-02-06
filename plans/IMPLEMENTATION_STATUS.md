# Implementation Status - Image-First Worksheet System

## ✅ Completed (Backend Infrastructure)

### Phase 1-3: Core Systems ✓

- ✅ **Configuration Layer**
  - `backend/config/topic_presets.json` - 5 topics with 3+ presets each
  - `backend/config/style_profiles.json` - 4 style profiles (line_art_bw, cartoon_3d, illustrated_painting, realistic)
  - `backend/config/reference_images_index.json` - Reference image index structure

- ✅ **Scene Schema System**
  - `backend/scene_schema.py` - Complete with SceneSpec, SceneObject, SceneRelationship classes
  - `frontend/src/types/scene.ts` - TypeScript type definitions
  - Pydantic validation for scene specifications
  - Scene → prompt conversion logic
  - Scene → natural language for question context

- ✅ **IP-Adapter Manager**
  - `backend/ip_adapter_manager.py` - Reference image loading and selection
  - Tag-based filtering for subject-specific references
  - Random and deterministic selection modes

- ✅ **Image Asset Store**
  - `backend/image_asset_store.py` - Persistent storage with indexing
  - Scene spec stored with each image
  - Topic-based and preset-based searching
  - Asset lifecycle management (create, retrieve, delete)

- ✅ **API Endpoints**
  - `backend/scene_api_endpoints.py` - Complete REST API
  - `GET /api/topic-presets` - List all topics
  - `GET /api/topic-presets/{topic_id}` - Get topic details
  - `GET /api/style-profiles` - Get style profiles
  - `POST /api/generate-scene-image` - Generate from scene spec
  - `GET /api/image-assets/{asset_id}` - Retrieve stored assets
  - `GET /api/scene-stats` - System statistics
  - Integrated into `backend/main.py`

---

## 🔄 In Progress (Frontend Integration)

### Phase 5: Preset-Based UI (NEXT STEPS)

**Files to Modify:**

1. `frontend/src/components/WorksheetGenerator.tsx` - Major update needed
2. `frontend/src/utils/worksheetPromptBuilder.ts` - Add scene context
3. `frontend/src/lib/imageApi.ts` - Add scene generation methods (optional wrapper)

**Key Changes Needed in WorksheetGenerator.tsx:**

#### 1. Add New State Variables (after line 248)

```typescript
// Scene-based image generation state
import {
  SceneSpec,
  ImagePreset,
  StyleProfile,
  TopicPreset,
} from "../types/scene";

const [topicPresets, setTopicPresets] = useState<ImagePreset[]>([]);
const [selectedPreset, setSelectedPreset] = useState<string>("");
const [sceneSpec, setSceneSpec] = useState<SceneSpec | null>(null);
const [assetId, setAssetId] = useState<string | null>(null);
const [styleProfiles, setStyleProfiles] = useState<
  Record<string, StyleProfile>
>({});
const [loadingPresets, setLoadingPresets] = useState(false);
```

#### 2. Load Topic Presets (after line 334)

```typescript
// Load topic presets when subject/grade/topic changes
useEffect(() => {
  const loadTopicPresets = async () => {
    if (!formData.subject || !formData.gradeLevel || !formData.topic) {
      setTopicPresets([]);
      setSelectedPreset("");
      return;
    }

    // Build topic ID from form data
    const topicId = `${formData.subject.toLowerCase()}.grade${formData.gradeLevel}.${formData.topic.toLowerCase().replace(/\s+/g, "_")}`;

    setLoadingPresets(true);
    try {
      const response = await axios.get(
        `http://localhost:8000/api/topic-presets/${topicId}`,
      );
      setTopicPresets(response.data.image_presets || []);
      console.log(
        `Loaded ${response.data.image_presets?.length || 0} presets for ${topicId}`,
      );
    } catch (error) {
      console.log("No presets available for this topic:", topicId);
      setTopicPresets([]);
    } finally {
      setLoadingPresets(false);
    }
  };

  loadTopicPresets();
}, [formData.subject, formData.gradeLevel, formData.topic]);

// Load style profiles once
useEffect(() => {
  const loadStyleProfiles = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/style-profiles",
      );
      setStyleProfiles(response.data.profiles || {});
    } catch (error) {
      console.error("Error loading style profiles:", error);
    }
  };

  loadStyleProfiles();
}, []);
```

#### 3. New Scene Image Generation Handler (replace handleGenerateImage around line 652)

```typescript
const handleGenerateSceneImage = async () => {
  if (!selectedPreset) {
    setImageError("Please select an image preset");
    return;
  }

  setGeneratingImages(true);
  setImageError(null);

  try {
    const topicId = `${formData.subject.toLowerCase()}.grade${formData.gradeLevel}.${formData.topic.toLowerCase().replace(/\s+/g, "_")}`;

    const response = await axios.post(
      "http://localhost:8000/api/generate-scene-image",
      {
        topic_id: topicId,
        preset_id: selectedPreset,
        style_profile_id: formData.imageStyle || "cartoon_3d",
      },
    );

    if (response.data.success) {
      setGeneratedImages([response.data.imageData]);
      setSceneSpec(response.data.sceneSpec);
      setAssetId(response.data.assetId);
      console.log("Scene image generated:", response.data.sceneSpec.scene_id);
    } else {
      throw new Error("Image generation failed");
    }
  } catch (error: any) {
    console.error("Scene image generation error:", error);
    setImageError(
      error.response?.data?.detail || "Failed to generate image from scene",
    );
  } finally {
    setGeneratingImages(false);
  }
};
```

#### 4. Update Image Section UI (around line 947)

```typescript
{formData.includeImages && formData.subject !== 'Mathematics' && (
  <div className="space-y-4" data-tutorial="worksheet-generator-image-prompt">
    <h3 className="text-lg font-semibold text-gray-800">Scene-Based Image Generation</h3>

    {loadingPresets ? (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-sm text-gray-500 mt-2">Loading presets...</p>
      </div>
    ) : topicPresets.length > 0 ? (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image Intent <span className="text-red-500">*</span>
          </label>
          <select
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select what you want to show...</option>
            {topicPresets.map(preset => (
              <option key={preset.id} value={preset.id}>
                {preset.name} - {preset.description}
              </option>
            ))}
          </select>
          {selectedPreset && topicPresets.find(p => p.id === selectedPreset) && (
            <p className="text-xs text-gray-500 mt-1">
              Objects: {topicPresets.find(p => p.id === selectedPreset)?.objects.join(', ')}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Visual Style <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.imageStyle}
            onChange={(e) => handleInputChange('imageStyle', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="cartoon_3d">3D Cartoon (Colorful, Pixar-like)</option>
            <option value="line_art_bw">Black & White Line Art (Coloring)</option>
            <option value="illustrated_painting">Illustrated Painting</option>
            <option value="realistic">Photorealistic</option>
          </select>
          {styleProfiles[formData.imageStyle || 'cartoon_3d'] && (
            <p className="text-xs text-gray-500 mt-1">
              {styleProfiles[formData.imageStyle || 'cartoon_3d'].description}
            </p>
          )}
        </div>

        <button
          onClick={handleGenerateSceneImage}
          disabled={!selectedPreset || generatingImages}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {generatingImages ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
              Generating Scene Image...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2 inline" />
              Generate Image from Preset
            </>
          )}
        </button>
      </>
    ) : (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>No presets available for this topic.</strong><br/>
          Please select a different topic or proceed without images.
        </p>
      </div>
    )}

    {imageError && (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {imageError}
      </div>
    )}

    {generatedImages.length > 0 && sceneSpec && (
      <div className="space-y-2 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="text-sm font-semibold text-green-800">✓ Scene Image Generated</h4>
        <p className="text-xs text-green-700">
          Scene ID: {sceneSpec.scene_id}
        </p>
        <p className="text-xs text-green-700">
          Objects: {sceneSpec.objects.filter(o => o.visible).map(o => o.name).join(', ')}
        </p>
        <img
          src={generatedImages[0]}
          alt="Generated scene"
          className="w-full max-h-64 object-contain rounded-lg mt-2"
        />
      </div>
    )}
  </div>
)}
```

#### 5. Update handleGenerate to Include Scene Spec (around line 404)

```typescript
const handleGenerate = () => {
  // ... existing code ...

  // Build prompt WITH scene context if available
  const prompt = buildWorksheetPrompt(formData, sceneSpec); // Pass scene spec!

  const message = {
    prompt,
    formData: {
      ...formData,
      sceneSpec: sceneSpec, // Include in form data
      assetId: assetId,
    },
    jobId,
    generationMode: "queued",
  };

  // ... rest of code ...
};
```

---

### Phase 7: Question Generation from Scene

**File to Modify:** `frontend/src/utils/worksheetPromptBuilder.ts`

Add this function at the top (after imports):

```typescript
import { SceneSpec, formatSceneForPrompt } from "../types/scene";

function buildSceneContextPrompt(sceneSpec: SceneSpec | null): string {
  if (!sceneSpec) return "";

  return `

${formatSceneForPrompt(sceneSpec)}

CRITICAL: Questions MUST only reference objects and relationships listed above.
DO NOT invent or assume details not explicitly stated in the scene context.
`;
}
```

Update `buildWorksheetPrompt` signature (line 462):

```typescript
export function buildWorksheetPrompt(
  formData: WorksheetFormData,
  sceneSpec?: SceneSpec | null, // Add this parameter
): string {
  // ... existing code ...

  // Add scene context before template instructions
  if (sceneSpec) {
    prompt += buildSceneContextPrompt(sceneSpec);
  }

  prompt += templateInstructions;

  return prompt;
}
```

---

## 📋 Testing Checklist

### Backend Testing (Can Test Now)

```bash
# Start backend
cd backend
uvicorn main:app --reload

# Test endpoints (use Postman or curl)
curl http://localhost:8000/api/topic-presets
curl http://localhost:8000/api/style-profiles
curl http://localhost:8000/api/scene-stats

# Test scene generation
curl -X POST http://localhost:8000/api/generate-scene-image \
  -H "Content-Type: application/json" \
  -d '{
    "topic_id": "science.grade4.solar_system",
    "preset_id": "solar_system_overview",
    "style_profile_id": "cartoon_3d"
  }'
```

### Frontend Testing (After UI Updates)

1. **Load Presets Test**
   - Select: Science > Grade 4 > Topic: "Solar System"
   - Verify: 3 presets appear in dropdown

2. **Generate Scene Image Test**
   - Select preset: "Solar System Overview"
   - Select style: "Cartoon 3D"
   - Click "Generate Image from Preset"
   - Verify: Image appears with scene info

3. **Generate Worksheet Test**
   - With scene image loaded
   - Click "Generate Worksheet"
   - Verify: Questions reference only scene objects
   - Check question for excluded items (should not mention them)

4. **Hallucination Prevention Test**
   - Solar system scene excludes "moons"
   - Generated questions should NOT ask about moons
   - Questions should only reference: sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune

---

## 🚀 Quick Start (After Frontend Updates)

1. **Start Backend**

   ```bash
   cd backend
   python start_backend.py
   ```

2. **Start Frontend**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Workflow**
   - Navigate to Worksheet Generator
   - Select Science > Grade 4 > "Solar System"
   - Choose "Solar System Overview" preset
   - Choose "Cartoon 3D" style
   - Generate image (wait ~5-10 seconds)
   - Generate worksheet (image + scene context included)
   - Verify questions only reference visible planets

---

## 📊 System Architecture Overview

```
User Input (Topic Selection)
    ↓
Load Topic Presets (from backend/config/topic_presets.json)
    ↓
User Selects Preset + Style
    ↓
Build Scene Specification (backend/scene_schema.py)
    ↓
Generate Image (SDXL + IP-Adapter + Scene Spec)
    ↓
Store Image + Scene Spec (backend/image_asset_store.py)
    ↓
LOCK IMAGE + SCENE
    ↓
Generate Worksheet Questions (LLM with Scene Context)
    ↓
Validate Questions (Check against scene exclusions)
    ↓
Final Worksheet (Image + Valid Questions)
```

---

## 🎯 Success Metrics

After implementation:

- ✅ Teachers select from 3-5 presets (not freestyle prompts)
- ✅ Images generated from structured scenes
- ✅ Scene locked before question generation
- ✅ Questions reference only scene spec (no hallucination)
- ✅ Images reusable across worksheets
- ✅ Consistent visual style (IP-Adapter)

---

## 📝 Next Actions

1. **Immediate** - Update `WorksheetGenerator.tsx` with preset UI
2. **After UI** - Update `worksheetPromptBuilder.ts` with scene context
3. **Testing** - Run full end-to-end test with solar system topic
4. **Iteration** - Add more topic presets based on feedback
5. **Optional** - Curate reference images for IP-Adapter (improves consistency)

---

## 🔧 Maintenance Notes

- **Adding New Topics**: Edit `backend/config/topic_presets.json`
- **Adding New Styles**: Edit `backend/config/style_profiles.json`
- **Checking Assets**: `GET /api/scene-stats` for system overview
- **Cleaning Up**: Asset store has cleanup methods for orphaned files
