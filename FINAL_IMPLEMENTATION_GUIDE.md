# Final Frontend Implementation - WorksheetGenerator.tsx

## ✅ COMPLETED SO FAR

1. ✅ Backend fully implemented (all 8 API endpoints working)
2. ✅ Scene schema system complete
3. ✅ `worksheetPromptBuilder.ts` updated with scene context
4. ✅ Type definitions in `scene.ts` complete
5. ✅ State variables added to WorksheetGenerator.tsx (lines 252-257)

## 📋 REMAINING CHANGES FOR WorksheetGenerator.tsx

### Step 1: Add useEffect Hooks (Insert after line 334 - "Auto-disable images for Mathematics")

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

// Load style profiles once on mount
useEffect(() => {
  const loadStyleProfiles = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/style-profiles",
      );
      setStyleProfiles(response.data.profiles || {});
      console.log("Style profiles loaded");
    } catch (error) {
      console.error("Error loading style profiles:", error);
    }
  };

  loadStyleProfiles();
}, []);
```

### Step 2: Add Scene Image Generation Handler (Insert after line 690 - after handleDownloadImage)

```typescript
// Scene-based image generation handler
const handleGenerateSceneImage = async () => {
  if (!selectedPreset) {
    setImageError("Please select an image preset");
    return;
  }

  setGeneratingImages(true);
  setImageError(null);

  try {
    const topicId = `${formData.subject.toLowerCase()}.grade${formData.gradeLevel}.${formData.topic.toLowerCase().replace(/\s+/g, "_")}`;

    console.log("Generating scene image:", {
      topicId,
      selectedPreset,
      style: formData.imageStyle,
    });

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
      console.log(
        "✅ Scene image generated:",
        response.data.sceneSpec.scene_id,
      );
      console.log(
        "   Objects:",
        response.data.sceneSpec.objects.map((o: any) => o.name).join(", "),
      );
      console.log("   Asset ID:", response.data.assetId);
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

### Step 3: Update handleGenerate to Pass Scene Spec (Replace around line 424)

Find the existing `handleGenerate` function and update the prompt building section:

```typescript
// BEFORE (around line 426):
const prompt = buildWorksheetPrompt(formData);

// AFTER:
const prompt = buildWorksheetPrompt(formData, sceneSpec);
```

Also update the message object to include scene spec:

```typescript
// BEFORE (around line 431):
const message = {
  prompt,
  formData,
  jobId,
  generationMode: "queued",
};

// AFTER:
const message = {
  prompt,
  formData: {
    ...formData,
    sceneSpec: sceneSpec,
    assetId: assetId,
  },
  jobId,
  generationMode: "queued",
};
```

### Step 4: Replace Image Section UI (Replace around line 947-1020)

Find the section starting with:

```typescript
{formData.includeImages && formData.subject !== 'Mathematics' && (
  <div className="space-y-4" data-tutorial="worksheet-generator-image-prompt">
```

Replace it with:

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
              📦 Objects: {topicPresets.find(p => p.id === selectedPreset)?.objects.join(', ')}
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
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {generatingImages ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating Scene Image...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Generate Image from Preset
            </>
          )}
        </button>

        {imageError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            ❌ {imageError}
          </div>
        )}

        {generatedImages.length > 0 && sceneSpec && (
          <div className="space-y-2 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-semibold text-green-800 flex items-center">
              <Check className="w-4 h-4 mr-1" />
              Scene Image Generated
            </h4>
            <div className="text-xs text-green-700 space-y-1">
              <p><strong>Scene ID:</strong> {sceneSpec.scene_id}</p>
              <p><strong>Objects:</strong> {sceneSpec.objects.filter(o => o.visible).map(o => o.name).join(', ')}</p>
              <p><strong>Excluded:</strong> {sceneSpec.exclusions.join(', ')}</p>
            </div>
            <img
              src={generatedImages[0]}
              alt="Generated scene"
              className="w-full max-h-64 object-contain rounded-lg mt-2 border border-green-300"
            />
            <div className="flex gap-2">
              <button
                onClick={() => handleDownloadImage(generatedImages[0])}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center text-sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Image
              </button>
            </div>
          </div>
        )}
      </>
    ) : formData.topic ? (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>⚠️ No presets available for "{formData.topic}"</strong><br/>
          This topic doesn't have curated image presets yet. You can:
          <ul className="list-disc ml-5 mt-2">
            <li>Try a different topic</li>
            <li>Proceed without images</li>
          </ul>
        </p>
      </div>
    ) : (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-600">
          Select a topic above to see available image presets
        </p>
      </div>
    )}
  </div>
)}
```

## 🎯 Implementation Steps

### Option A: Manual Copy-Paste (Recommended)

1. Open `frontend/src/components/WorksheetGenerator.tsx`
2. Copy Step 1 code → Paste after line 334
3. Copy Step 2 code → Paste after line 690
4. Make Step 3 changes (2 small edits to handleGenerate)
5. Replace Step 4 section (entire image UI block)
6. Save and test

### Option B: Create Patch File

I can create a complete unified diff file you can apply with `git apply`.

## ✅ Testing Checklist

After implementation:

1. **Backend Running**

   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. **Frontend Running**

   ```bash
   cd frontend
   npm run dev
   ```

3. **Test Workflow**
   - Navigate to Worksheet Generator
   - Select: Science > Grade 4
   - Type topic: "Solar System" (lowercase works fine)
   - Click to enable "Include Images"
   - Observe: 3 presets should appear
   - Select: "Solar System Overview"
   - Select style: "3D Cartoon"
   - Click "Generate Image from Preset"
   - Wait ~5-10 seconds for image
   - Verify: Scene details show objects (sun, planets)
   - Click "Generate Worksheet"
   - Verify: Questions reference only listed planets

4. **Hallucination Test**
   - Questions should NOT mention:
     - "moons" (excluded from solar system preset)
     - "spacecraft" (excluded)
     - Any other excluded items
   - Questions SHOULD only reference:
     - Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune

## 📊 Expected Results

**Success Indicators:**

- ✅ Presets load automatically when topic matches
- ✅ Image generates in 5-10 seconds
- ✅ Scene details displayed (objects, exclusions)
- ✅ Questions only reference scene objects
- ✅ No hallucinated content in questions

**Common Issues:**

- ❌ No presets shown → Topic name doesn't match preset ID (try exact topic names from presets.json)
- ❌ Image generation fails → Check backend logs, SDXL might not be loaded
- ❌ Questions still hallucinate → Check that sceneSpec is being passed to buildWorksheetPrompt

## 🔧 Debugging Tips

```typescript
// Add these console.logs if needed:
console.log("Form data:", {
  subject: formData.subject,
  grade: formData.gradeLevel,
  topic: formData.topic,
});
console.log("Topic ID built:", topicId);
console.log("Presets loaded:", topicPresets);
console.log("Scene spec:", sceneSpec);
console.log("Prompt includes scene?", prompt.includes("SCENE CONTEXT"));
```

## 📝 Summary

**Total Changes:**

- 2 new useEffect hooks (~40 lines)
- 1 new handler function (~30 lines)
- 2 small edits to existing handler (~4 lines)
- 1 large UI section replacement (~100 lines)

**Total LOC:** ~174 lines of new/modified code

**Time Estimate:** 30-45 minutes for careful implementation

---

## 🚀 ALTERNATIVE: Complete File Provided

If you prefer, I can generate the ENTIRE updated `WorksheetGenerator.tsx` file with all changes integrated. This would be a complete file replacement rather than manual edits.

Would you like:
A) Manual implementation following steps above
B) Complete file replacement (I generate the full file)
