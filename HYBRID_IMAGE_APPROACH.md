# Hybrid Image Generation Approach

## Problem Identified
Current implementation **blocks** image generation when no presets exist for a topic.
User wants style selection (cartoon, 3D, realistic, etc.) to **always be available**.

## ✅ Fixed Approach: Preset-Enhanced Manual Mode

### New UI Flow

```
┌─────────────────────────────────┐
│  Include Images? ☑️              │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│  Visual Style (ALWAYS SHOWN)    │
│  ○ 3D Cartoon                   │
│  ○ Line Art B&W                 │
│  ○ Illustrated Painting         │
│  ○ Photorealistic               │
└─────────────────────────────────┘
         ↓
┌─────────────────────────────────┐
│  IF PRESETS AVAILABLE:          │
│  ┌──────────────────────────┐  │
│  │ Image Intent (Preset)    │  │
│  │ ○ Solar System Overview  │  │
│  │ ○ Inner Planets Focus    │  │
│  └──────────────────────────┘  │
│  [Generate from Preset]         │
│                                 │
│  OR                             │
│                                 │
│  Manual Prompt:                 │
│  ┌──────────────────────────┐  │
│  │ [User types description] │  │
│  └──────────────────────────┘  │
│  [Generate from Prompt]         │
└─────────────────────────────────┘
```

## Code Changes for WorksheetGenerator.tsx

### 1. Replace Image Section (around line 947-1020)

```typescript
{formData.includeImages && formData.subject !== 'Mathematics' && (  
  <div className="space-y-4" data-tutorial="worksheet-generator-image-prompt">
    <h3 className="text-lg font-semibold text-gray-800">AI Image Generation</h3>
    
    {/* ALWAYS SHOW STYLE SELECTION */}
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

    {/* SHOW PRESETS IF AVAILABLE */}
    {loadingPresets ? (
      <div className="p-3 text-center bg-gray-50 rounded-lg">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-xs text-gray-500 mt-2">Loading presets...</p>
      </div>
    ) : topicPresets.length > 0 && (
      <div className="border-t border-gray-200 pt-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
          <p className="text-sm text-blue-800">
            <strong>✨ Preset Available!</strong> We have curated image options for this topic.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image Intent (Preset - Recommended)
          </label>
          <select
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a preset...</option>
            {topicPresets.map(preset => (
              <option key={preset.id} value={preset.id}>
                {preset.name} - {preset.description}
              </option>
            ))}
          </select>
          {selectedPreset && topicPresets.find(p => p.id === selectedPreset) && (
            <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
              <strong>Objects:</strong> {topicPresets.find(p => p.id === selectedPreset)?.objects.join(', ')}
            </div>
          )}
        </div>

        <button
          onClick={handleGenerateSceneImage}
          disabled={!selectedPreset || generatingImages}
          className="w-full px-6 py-3 mt-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {generatingImages ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Generating from Preset...
            </>
          ) : (
            <>
              <Wand2 className="w-5 h-5 mr-2" />
              Generate from Preset
            </>
          )}
        </button>
        
        <div className="text-center text-sm text-gray-500 my-3">or</div>
      </div>
    )}

    {/* ALWAYS SHOW MANUAL PROMPT OPTION */}
    <div className={topicPresets.length > 0 ? 'border-t border-gray-200 pt-4' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {topicPresets.length > 0 ? 'Manual Prompt (Alternative)' : 'Image Prompt'}
        <span className="text-red-500">*</span>
      </label>
      <textarea
        value={imagePrompt}
        onChange={(e) => setImagePrompt(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        rows={3}
        placeholder="Describe the image you want to generate..."
      />
    </div>

    <button
      onClick={handleGenerateImage}
      disabled={generatingImages || !imagePrompt.trim()}
      className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
      data-tutorial="worksheet-generator-image-generate"
    >
      {generatingImages ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="w-5 h-5 mr-2" />
          {topicPresets.length > 0 ? 'Generate from Manual Prompt' : 'Generate Image'}
        </>
      )}
    </button>

    {imageError && (
      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
        <span>{imageError}</span>
        <button
          onClick={() => {
            setImageError(null);
            if (selectedPreset) {
              handleGenerateSceneImage();
            } else {
              handleGenerateImage();
            }
          }}
          className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
        >
          Retry
        </button>
      </div>
    )}

    {generatedImages.length > 0 && (
      <div className="space-y-4" data-tutorial="worksheet-generator-generated-images">
        {sceneSpec ? (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="text-sm font-semibold text-green-800 flex items-center mb-2">
              <Check className="w-4 h-4 mr-1" />
              Scene-Based Image Generated
            </h4>
            <div className="text-xs text-green-700 space-y-1 mb-3">
              <p><strong>Scene ID:</strong> {sceneSpec.scene_id}</p>
              <p><strong>Objects:</strong> {sceneSpec.objects.filter(o => o.visible).map(o => o.name).join(', ')}</p>
              {sceneSpec.exclusions.length > 0 && (
                <p><strong>Excluded:</strong> {sceneSpec.exclusions.join(', ')}</p>
              )}
            </div>
            <img
              src={generatedImages[0]}
              alt="Generated scene"
              className="w-full max-h-64 object-contain rounded-lg bg-white border border-green-300"
            />
            <button
              onClick={() => handleDownloadImage(generatedImages[0])}
              className="w-full mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Image
            </button>
          </div>
        ) : (
          <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h4 className="text-md font-semibold text-gray-800 mb-2">Generated Image</h4>
            <img
              src={generatedImages[0]}
              alt="Generated image"
              className="w-full max-h-64 object-contain rounded-lg mb-4"
            />
            <button
              onClick={() => handleDownloadImage(generatedImages[0])}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Image
            </button>
          </div>
        )}
      </div>
    )}
  </div>
)}
```

## Key Changes

1. ✅ **Style selector ALWAYS shown** when images enabled
2. ✅ **Presets appear** if available (optional enhancement)
3. ✅ **Manual prompt** always available as fallback
4. ✅ **Two buttons**:
   - "Generate from Preset" (if preset selected)
   - "Generate from Manual Prompt" (always available)
5. ✅ **Scene info shown** if generated from preset
6. ✅ **Standard display** for manual generated images

## Benefits

- ✓ Teachers can generate images for ANY topic
- ✓ Presets provide guidance when available
- ✓ Scene specs created when using presets (hallucination prevention)
- ✓ Manual prompts still work (backward compatible)
- ✓ Style profiles applied in both modes
