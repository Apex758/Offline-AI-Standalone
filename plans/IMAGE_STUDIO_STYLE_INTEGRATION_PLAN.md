# ImageStudio Visual Style Integration Plan

## 📋 Overview

This plan outlines how to integrate the visual style profile system into the **ImageStudio** component, enabling users to easily generate images with consistent styling (3D Cartoon, Line Art, Illustrated Painting, or Photorealistic).

---

## 🎯 Goals

1. **Add style selection dropdown** to ImageStudio's Generator tab
2. **Automatically apply style suffixes** to user prompts
3. **Auto-populate negative prompts** from style profiles
4. **Adjust SDXL settings** based on selected style
5. **Maintain backward compatibility** with existing manual prompts

---

## 🔍 Current State Analysis

### ImageStudio's Current Workflow

**File**: [`frontend/src/components/ImageStudio.tsx`](frontend/src/components/ImageStudio.tsx)

**Current Generation Flow**:
```tsx
// Lines 31-36: User inputs
const [prompt, setPrompt] = useState('');
const [negativePrompt, setNegativePrompt] = useState('multiple people, group, crowd...');
const [width, setWidth] = useState(1024);
const [height, setHeight] = useState(512);
const [numInferenceSteps, setNumInferenceSteps] = useState(2);

// Lines 224-230: Direct API call
const response = await imageApi.generateImageBase64({
  prompt,              // ← User types everything manually
  negativePrompt,      // ← User manages this
  width,
  height,
  numInferenceSteps
});
```

**❌ Current Limitations**:
- No style profile system integration
- Users must manually craft styled prompts
- No automatic negative prompt management
- No standardized styling guidance
- Inconsistent results across generations

---

## ✅ WorksheetGenerator's Approach (Reference)

**File**: [`frontend/src/components/WorksheetGenerator.tsx`](frontend/src/components/WorksheetGenerator.tsx)

**How it works**:
```tsx
// Lines 263-268: Load style profiles from backend
const [styleProfiles, setStyleProfiles] = useState<Record<string, StyleProfile>>({});
const response = await axios.get('http://localhost:8000/api/style-profiles');
setStyleProfiles(response.data.profiles || {});

// Lines 1228-1243: Style selection dropdown
<select value={formData.imageStyle}>
  <option value="cartoon_3d">3D Cartoon (Colorful, Pixar-like)</option>
  <option value="line_art_bw">Black & White Line Art (Coloring)</option>
  <option value="illustrated_painting">Illustrated Painting</option>
  <option value="realistic">Photorealistic</option>
</select>

// Lines 874-891: Scene-based image generation with automatic style application
const response = await axios.post("http://localhost:8000/api/generate-scene-image", {
  topic_id: topicId,
  preset_id: selectedPreset,
  style_profile_id: formData.imageStyle || "cartoon_3d"
});
```

**✅ Benefits**:
- Automatic style suffix application
- Pre-configured negative prompts
- Optimized SDXL settings per style
- Consistent, predictable results

---

## 🎨 Proposed Integration Design

### Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│         ImageStudio Generator Tab                   │
├─────────────────────────────────────────────────────┤
│                                                      │
│  [User Prompt Field]  ← User enters base content    │
│  "A flowering plant with roots"                     │
│                                                      │
│  [Visual Style Dropdown]  ← NEW!                    │
│  ▼ 3D Cartoon (Pixar-like)                         │
│                                                      │
│  [Advanced Options] (collapsible)                   │
│  ├─ Negative Prompt (auto-filled from style) ←NEW! │
│  ├─ Width/Height (auto-set from style)       ←NEW! │
│  └─ Inference Steps                                 │
│                                                      │
│  [Generate Button]                                  │
│                                                      │
└─────────────────────────────────────────────────────┘
                         ↓
              ┌──────────────────────┐
              │  Prompt Builder      │
              │  (NEW FUNCTION)      │
              └──────────────────────┘
                         ↓
    Final Prompt = Base Prompt + Style Suffix
    "A flowering plant with roots, 3D cartoon style,
     Pixar-like, colorful, friendly, smooth shading"
                         ↓
              ┌──────────────────────┐
              │  imageApi.generate   │
              └──────────────────────┘
```

---

## 🛠️ Implementation Plan

### Step 1: Add State for Style Management

**Location**: [`frontend/src/components/ImageStudio.tsx`](frontend/src/components/ImageStudio.tsx:31-41)

**Add new state variables**:
```tsx
// After line 36, add:
const [selectedStyle, setSelectedStyle] = useState<string>('cartoon_3d');
const [styleProfiles, setStyleProfiles] = useState<Record<string, StyleProfile>>({});
const [loadingStyles, setLoadingStyles] = useState(false);
const [showAdvanced, setShowAdvanced] = useState(false);
const [useManualNegative, setUseManualNegative] = useState(false);
```

**Add TypeScript interface**:
```tsx
// After line 16, add:
interface StyleProfile {
  id: string;
  name: string;
  description: string;
  grade_bands: string[];
  base_prompt_suffix: string;
  negative_prompt: string;
  sdxl_settings: {
    width: number;
    height: number;
    num_inference_steps: number;
    guidance_scale: number;
    cfg_scale: number;
  };
  ip_adapter: {
    enabled: boolean;
    strength: number;
    reference_set: string;
  };
}
```

---

### Step 2: Load Style Profiles on Mount

**Location**: After existing `useEffect` blocks

**Add new effect**:
```tsx
// Load style profiles from backend
useEffect(() => {
  const loadStyleProfiles = async () => {
    setLoadingStyles(true);
    try {
      const response = await fetch('http://localhost:8000/api/style-profiles');
      const data = await response.json();
      
      if (data.success && data.profiles) {
        setStyleProfiles(data.profiles);
        console.log('✅ Loaded style profiles:', Object.keys(data.profiles));
      }
    } catch (error) {
      console.error('Failed to load style profiles:', error);
      // Fallback to default settings
    } finally {
      setLoadingStyles(false);
    }
  };
  
  loadStyleProfiles();
}, []);
```

---

### Step 3: Auto-Update Settings When Style Changes

**Add effect to sync style settings**:
```tsx
// Auto-update negative prompt and dimensions when style changes
useEffect(() => {
  const profile = styleProfiles[selectedStyle];
  if (!profile) return;
  
  // Update negative prompt (unless user has manually edited it)
  if (!useManualNegative) {
    setNegativePrompt(profile.negative_prompt);
  }
  
  // Update dimensions
  setWidth(profile.sdxl_settings.width);
  setHeight(profile.sdxl_settings.height);
  setNumInferenceSteps(profile.sdxl_settings.num_inference_steps);
  
  console.log(`✅ Applied style settings for: ${profile.name}`);
}, [selectedStyle, styleProfiles]);
```

---

### Step 4: Create Prompt Builder Function

**Add new function**:
```tsx
/**
 * Build final prompt with style suffix
 */
const buildStyledPrompt = (basePrompt: string, styleId: string): string => {
  const profile = styleProfiles[styleId];
  
  if (!profile) {
    console.warn('Style profile not found, using base prompt');
    return basePrompt;
  }
  
  // Combine base prompt with style suffix
  const finalPrompt = basePrompt.trim() + profile.base_prompt_suffix;
  
  console.log('📝 Built styled prompt:', {
    base: basePrompt,
    style: profile.name,
    suffix: profile.base_prompt_suffix,
    final: finalPrompt
  });
  
  return finalPrompt;
};
```

---

### Step 5: Update Generate Function

**Modify `handleGenerate` function** (Line 196):

```tsx
const handleGenerate = async () => {
  if (!prompt.trim()) {
    setError('Please enter a prompt');
    return;
  }

  setGenerationState('generating');
  setError(null);

  // Initialize image slots
  const slots = Array.from({ length: numImages }, () => ({
    imageData: null,
    seed: null,
    status: 'pending' as const
  }));
  setImageSlots(slots);

  try {
    // 🆕 BUILD STYLED PROMPT
    const finalPrompt = buildStyledPrompt(prompt, selectedStyle);
    
    // Start all generations in parallel
    const generationPromises = slots.map(async (_, index) => {
      setImageSlots(prev => {
        const newSlots = [...prev];
        newSlots[index] = { ...newSlots[index], status: 'generating' };
        return newSlots;
      });

      try {
        const response = await imageApi.generateImageBase64({
          prompt: finalPrompt,  // ← Use styled prompt instead of raw prompt
          negativePrompt,
          width,
          height,
          numInferenceSteps
        });

        if (response.success && response.imageData) {
          setImageSlots(prev => {
            const newSlots = [...prev];
            newSlots[index] = {
              imageData: response.imageData,
              seed: Math.floor(Math.random() * 1000000),
              status: 'completed'
            };
            return newSlots;
          });
        } else {
          setImageSlots(prev => {
            const newSlots = [...prev];
            newSlots[index] = { ...newSlots[index], status: 'error' };
            return newSlots;
          });
        }
      } catch (genError) {
        console.error(`Error generating image ${index + 1}:`, genError);
        setImageSlots(prev => {
          const newSlots = [...prev];
          newSlots[index] = { ...newSlots[index], status: 'error' };
          return newSlots;
        });
      }
    });

    await Promise.allSettled(generationPromises);
    setGenerationState('results');
  } catch (err: any) {
    console.error('Generation error:', err);
    setError(err.response?.data?.error || err.message || 'Failed to generate images');
    setGenerationState('input');
  }
};
```

---

### Step 6: Update UI - Add Style Selector

**Modify the Generator Tab UI** (starting at Line 624):

```tsx
{generationState === 'input' && (
  <div className="max-w-3xl mx-auto">
    <h2 className="text-2xl font-semibold mb-6">AI Image Generator</h2>
    <div className="space-y-6">
      
      {/* 🆕 VISUAL STYLE SELECTOR */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
        <label className="block text-sm font-medium text-gray-800 mb-2">
          🎨 Visual Style
        </label>
        <select
          value={selectedStyle}
          onChange={(e) => setSelectedStyle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base"
        >
          <option value="cartoon_3d">🎬 3D Cartoon (Colorful, Pixar-like)</option>
          <option value="line_art_bw">✏️ Black & White Line Art (Coloring Book)</option>
          <option value="illustrated_painting">🎨 Illustrated Painting (Artistic)</option>
          <option value="realistic">📸 Photorealistic (Scientific)</option>
        </select>
        
        {/* Show style description */}
        {styleProfiles[selectedStyle] && (
          <p className="text-xs text-gray-600 mt-2">
            {styleProfiles[selectedStyle].description}
          </p>
        )}
      </div>

      {/* EXISTING PROMPT FIELD */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Base Prompt <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-500 mb-2">
          ℹ️ Describe <strong>what</strong> you want. The style will be applied automatically.
        </p>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="E.g., A flowering plant showing roots, stem, leaves, and flower petals"
        />
      </div>

      {/* 🆕 ADVANCED OPTIONS (Collapsible) */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition"
        >
          <span className="text-sm font-medium text-gray-700">Advanced Options</span>
          <svg
            className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {showAdvanced && (
          <div className="px-4 pb-4 space-y-4 border-t border-gray-200 pt-4">
            {/* Negative Prompt */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Negative Prompt
                </label>
                <label className="flex items-center text-xs text-gray-600">
                  <input
                    type="checkbox"
                    checked={useManualNegative}
                    onChange={(e) => setUseManualNegative(e.target.checked)}
                    className="mr-1"
                  />
                  Manual override
                </label>
              </div>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => {
                  setNegativePrompt(e.target.value);
                  setUseManualNegative(true);
                }}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Things to avoid..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {useManualNegative ? '✏️ Custom negative prompt' : '🤖 Auto-filled from style profile'}
              </p>
            </div>

            {/* Dimensions and Steps */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                <select
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value={512}>512px</option>
                  <option value={768}>768px</option>
                  <option value={1024}>1024px</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                <select
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value={512}>512px</option>
                  <option value={768}>768px</option>
                  <option value={1024}>1024px</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Steps</label>
                <select
                  value={numInferenceSteps}
                  onChange={(e) => setNumInferenceSteps(Number(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value={1}>1 (Fastest)</option>
                  <option value={2}>2 (Recommended)</option>
                  <option value={3}>3</option>
                  <option value={4}>4 (Best Quality)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* EXISTING: Batch size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Batch Size</label>
        <select
          value={numImages}
          onChange={(e) => setNumImages(Number(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-lg"
        >
          <option value={1}>1 Image</option>
          <option value={2}>2 Images</option>
          <option value={3}>3 Images</option>
          <option value={4}>4 Images</option>
          <option value={5}>5 Images</option>
        </select>
      </div>

      {/* GENERATE BUTTON */}
      <button
        onClick={handleGenerate}
        disabled={!prompt.trim() || loadingStyles}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <Sparkles className="w-5 h-5 mr-2" />
        {loadingStyles ? 'Loading styles...' : 'Generate Image'}
      </button>
    </div>
  </div>
)}
```

---

### Step 7: Add Visual Preview Helper

**Optional enhancement - show example prompts**:

```tsx
{/* Add after style selector */}
{styleProfiles[selectedStyle] && (
  <div className="text-xs bg-gray-50 p-3 rounded border border-gray-200">
    <strong>Example with this style:</strong>
    <p className="mt-1 text-gray-600 italic">
      "A tropical beach scene"
      <span className="text-blue-600">
        {' → '}"{styleProfiles[selectedStyle].base_prompt_suffix}"
      </span>
    </p>
  </div>
)}
```

---

## 📊 Benefits of This Integration

### For Users
✅ **Easier to use** - No need to manually craft style prompts  
✅ **Consistent results** - Pre-configured settings ensure quality  
✅ **Educational** - Guidance on prompt structure  
✅ **Flexible** - Can still override with advanced options  

### For Development
✅ **Centralized styling** - All styles managed in one place  
✅ **Easy updates** - Change style profiles without touching UI code  
✅ **Maintainable** - Clear separation of content vs. style  
✅ **Scalable** - Easy to add new styles  

---

## 🎯 Migration Strategy

### Phase 1: Add Style System (Non-Breaking)
- Add style selector with "Manual" option as default
- Users can opt-in to style profiles
- Existing workflows continue to work

### Phase 2: Make Styles Default
- Set default style to "cartoon_3d"
- Add "Advanced/Manual Mode" option
- Guide users to new system

### Phase 3: Full Integration
- Remove manual mode option
- All generations use style profiles
- Update documentation

---

## 🔧 Technical Considerations

### 1. State Persistence

Save style selection to tab state:
```tsx
useEffect(() => {
  onDataChange({
    initialTab: activeTab,
    prompt,
    selectedStyle,  // ← Add this
    imageSlots,
    generationState,
    selectedImage
  });
}, [activeTab, prompt, selectedStyle, imageSlots, generationState, selectedImage]);
```

Restore on mount:
```tsx
useEffect(() => {
  if (savedData && !hasRestoredRef.current) {
    if (savedData.selectedStyle) setSelectedStyle(savedData.selectedStyle);
    // ... rest of restoration
  }
}, [savedData]);
```

### 2. Backward Compatibility

Handle cases where style profiles fail to load:
```tsx
const buildStyledPrompt = (basePrompt: string, styleId: string): string => {
  const profile = styleProfiles[styleId];
  
  // Fallback if profiles not loaded
  if (!profile) {
    console.warn('⚠️ Style profile not available, using base prompt only');
    return basePrompt;
  }
  
  return basePrompt.trim() + profile.base_prompt_suffix;
};
```

### 3. Loading States

Show loading indicator while fetching styles:
```tsx
{loadingStyles && (
  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-blue-600" />
    <p className="text-sm text-blue-700">Loading visual styles...</p>
  </div>
)}
```

---

## 📝 Example User Workflows

### Workflow 1: Quick Generation (Default)
1. User enters: "A tropical beach with palm trees"
2. Selects style: "3D Cartoon"
3. Clicks "Generate"
4. System applies: "A tropical beach with palm trees, 3D cartoon style, Pixar-like, colorful, friendly, smooth shading"
5. Image generated with cartoon_3d profile settings

### Workflow 2: Advanced Customization
1. User enters: "A scientific diagram of a cell"
2. Selects style: "Photorealistic"
3. Expands "Advanced Options"
4. Overrides negative prompt to add: "no labels, no text"
5. Adjusts dimensions to 1024x1024
6. Generates with custom settings

### Workflow 3: Line Art for Coloring
1. User enters: "A butterfly with detailed wings"
2. Selects style: "Black & White Line Art"
3. System auto-applies:
   - Prompt suffix: ", black and white line art, clean simple lines, coloring book style"
   - Negative: "color, shading, gradient, complex details"
   - Dimensions: 512x512 (optimal for line art)
4. Perfect coloring page generated

---

## 🚀 Next Steps

### Immediate (Must-Have)
1. ✅ Add state management for styles
2. ✅ Load style profiles from API
3. ✅ Create `buildStyledPrompt()` function
4. ✅ Update `handleGenerate()` to use styled prompts
5. ✅ Add style selector dropdown to UI

### Short-Term (Nice-to-Have)
6. Add visual style preview/examples
7. Save style preference in user settings
8. Add "Recent Styles" quick selector
9. Show before/after prompt comparison

### Long-Term (Future Enhancements)
10. Style mixing/blending options
11. Custom style profile creation
12. Style templates library
13. A/B comparison of different styles

---

## 📚 Files to Modify

| File | Changes Required |
|------|-----------------|
| [`frontend/src/components/ImageStudio.tsx`](frontend/src/components/ImageStudio.tsx) | ✅ Main implementation |
| [`frontend/src/types/scene.ts`](frontend/src/types/scene.ts) | ℹ️ Already has StyleProfile interface |
| [`backend/scene_api_endpoints.py`](backend/scene_api_endpoints.py) | ✅ Already has `/api/style-profiles` endpoint |
| [`backend/config/style_profiles.json`](backend/config/style_profiles.json) | ℹ️ No changes needed |

---

## 🎨 Visual Mockup

```
┌────────────────────────────────────────────────────┐
│  AI Image Generator                                │
├────────────────────────────────────────────────────┤
│                                                     │
│  🎨 Visual Style                       [Required]  │
│  ┌─────────────────────────────────────────────┐  │
│  │ 🎬 3D Cartoon (Colorful, Pixar-like)    ▼  │  │
│  └─────────────────────────────────────────────┘  │
│  Colorful, friendly, Pixar-like style for ages    │
│  6-10                                              │
│                                                     │
│  Base Prompt                           [Required]  │
│  ┌─────────────────────────────────────────────┐  │
│  │ A flowering plant showing roots, stem,      │  │
│  │ leaves, and flower petals                   │  │
│  │                                              │  │
│  └─────────────────────────────────────────────┘  │
│  ℹ️ Describe what you want. Style applied auto.   │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ ⚙️ Advanced Options                     ▼  │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  Batch Size                                        │
│  ┌─────────────────────────────────────────────┐  │
│  │ 2 Images                                ▼  │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │        ✨ Generate Image                     │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
└────────────────────────────────────────────────────┘
```

---

## ✨ Summary

This integration brings ImageStudio to feature parity with WorksheetGenerator's style system while maintaining the component's flexibility. Users get:

- **Guided experience** for beginners
- **Advanced control** for power users
- **Consistent styling** across the application
- **Educational prompts** that help them learn

The implementation is **backward compatible**, **scalable**, and follows the existing architecture patterns in your codebase.
