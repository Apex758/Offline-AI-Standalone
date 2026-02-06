import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Download, Eye, EyeOff, Undo2, Redo2, Eraser, Upload, Sparkles, Save, ChevronDown } from 'lucide-react';
import { imageApi, ImageGenerationContext, blobToDataURL, downloadImage, SavedImageRecord } from '../lib/imageApi';

interface ImageStudioProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
}

interface ImageHistory {
  original: string;
  current: string;
  undoStack: string[];
  redoStack: string[];
}

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

const ImageStudio: React.FC<ImageStudioProps> = ({ tabId, savedData, onDataChange }) => {
  const hasRestoredRef = useRef(false);

  const IMAGE_STORAGE_KEY = `image-studio-${tabId}`;

  // ========================================
  // Tab Management
  // ========================================
  const [activeTab, setActiveTab] = useState<'generator' | 'editor'>('generator');

  // ========================================
  // Generator States
  // ========================================
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('multiple people, group, crowd, deformed, distorted, blurry');
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(512);
  const [numInferenceSteps, setNumInferenceSteps] = useState(2);
  const [numImages, setNumImages] = useState(1);
  const [generationState, setGenerationState] = useState<'input' | 'generating' | 'results'>('input');
  const [imageSlots, setImageSlots] = useState<Array<{imageData: string | null, seed: number | null, status: 'pending' | 'generating' | 'completed' | 'error'}>>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ========================================
  // Style Management States (NEW)
  // ========================================
  const [selectedStyle, setSelectedStyle] = useState<string>('cartoon_3d');
  const [styleProfiles, setStyleProfiles] = useState<Record<string, StyleProfile>>({});
  const [loadingStyles, setLoadingStyles] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [useManualNegative, setUseManualNegative] = useState(false);

  // ========================================
  // Editor States
  // ========================================
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [history, setHistory] = useState<ImageHistory>({
    original: '',
    current: '',
    undoStack: [],
    redoStack: []
  });
  const [isInpainting, setIsInpainting] = useState(false);

  // Add new state for tracking saved image
  const [savedImageId, setSavedImageId] = useState<string | null>(null);

  // Track if image was newly uploaded (not restored)
  const [isNewUpload, setIsNewUpload] = useState(false);

  // Brush cursor state
  const [mousePos, setMousePos] = useState({x: 0, y: 0});
  const [showBrushCursor, setShowBrushCursor] = useState(false);

  // ========================================
  // Auto-save image to backend
  // ========================================
  const autoSaveImage = async (imageData: string, type: 'uploaded' | 'edited') => {
    try {
      const imageId = savedImageId || `img-${Date.now()}`;
      const imageRecord: SavedImageRecord = {
        id: imageId,
        title: `${type === 'uploaded' ? 'Uploaded' : 'Edited'} Image - ${new Date().toLocaleString()}`,
        timestamp: new Date().toISOString(),
        type: 'images',
        imageUrl: imageData,
        formData: {
          type,
          tabId
        }
      };

      await imageApi.saveImage(imageRecord);
      setSavedImageId(imageId);
      console.log(`Image auto-saved with ID: ${imageId}`);
    } catch (error) {
      console.error('Failed to auto-save image:', error);
      // Don't block the UI - just log the error
    }
  };

  // Canvas refs
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);

  // ========================================
  // Load style profiles from backend
  // ========================================
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

  // ========================================
  // Auto-update settings when style changes
  // ========================================
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
  }, [selectedStyle, styleProfiles, useManualNegative]);

  // ========================================
  // Modified: Restore saved state
  // ========================================
  useEffect(() => {
    if (savedData && !hasRestoredRef.current) {
      if (savedData.initialTab) setActiveTab(savedData.initialTab);
      if (savedData.prompt) setPrompt(savedData.prompt);
      if (savedData.selectedStyle) setSelectedStyle(savedData.selectedStyle);
      if (savedData.imageSlots) setImageSlots(savedData.imageSlots);
      if (savedData.generationState) setGenerationState(savedData.generationState);
      if (savedData.selectedImage) setSelectedImage(savedData.selectedImage);

      // Restore from sessionStorage
      try {
        const storedImageData = sessionStorage.getItem(IMAGE_STORAGE_KEY);
        if (storedImageData) {
          const { uploadedImage, history } = JSON.parse(storedImageData);
          if (uploadedImage) setUploadedImage(uploadedImage);
          if (history) setHistory(history);
        }
      } catch (error) {
        console.error('Failed to restore image from sessionStorage:', error);
      }

      // Load image from savedData if initialTab is 'editor' and no image was loaded from sessionStorage
      if (savedData.initialTab === 'editor' && savedData.imageUrl && !uploadedImage) {
        setUploadedImage(savedData.imageUrl);
        setHistory({
          original: savedData.imageUrl,
          current: savedData.imageUrl,
          undoStack: [],
          redoStack: []
        });
        if (savedData.imageId) {
          setSavedImageId(savedData.imageId);
        }
      }

      hasRestoredRef.current = true;
    }
  }, [savedData, uploadedImage]);
  
  // ========================================
  // Save light data to parent
  // ========================================
  useEffect(() => {
    onDataChange({
      initialTab: activeTab,
      prompt,
      selectedStyle,
      imageSlots,
      generationState,
      selectedImage
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, prompt, selectedStyle, imageSlots, generationState, selectedImage]);

  // ========================================
  // Save heavy image data to sessionStorage (larger quota, clears on browser close)
  // ========================================
  useEffect(() => {
    try {
      if (uploadedImage || history.current) {
        sessionStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify({
          uploadedImage,
          history
        }));
      }
    } catch (error) {
      console.warn('Could not save image to sessionStorage:', error);
    }
  }, [uploadedImage, history]);

  // ========================================
  // Modified: Redraw canvas when switching to editor tab
  // ========================================
  useEffect(() => {
    if (activeTab === 'editor' && history.current) {
      // Small delay to ensure canvas is mounted
      setTimeout(() => {
        drawImageOnCanvas(history.current);
        clearMaskCanvas();
      }, 100);
    }
  }, [activeTab, history.current]);

  // ========================================
  // NEW: Auto-save uploaded images only
  // ========================================
  // Auto-save when image is newly uploaded
  useEffect(() => {
    if (uploadedImage && history.original === uploadedImage && isNewUpload) {
      autoSaveImage(uploadedImage, 'uploaded');
      setIsNewUpload(false);
    }
  }, [uploadedImage, isNewUpload, history.original]);

  // ========================================
  // Build styled prompt with style suffix
  // ========================================
  const buildStyledPrompt = (basePrompt: string, styleId: string): string => {
    const profile = styleProfiles[styleId];
    
    if (!profile) {
      console.warn('⚠️ Style profile not available, using base prompt only');
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

  // ========================================
  // GENERATOR: Generate Images (Batch)
  // ========================================
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setGenerationState('generating');
    setError(null);

    // Initialize image slots
    const slots: Array<{imageData: string | null, seed: number | null, status: 'pending' | 'generating' | 'completed' | 'error'}> = Array.from({ length: numImages }, () => ({
      imageData: null,
      seed: null,
      status: 'pending'
    }));
    setImageSlots(slots);

    try {
      // 🆕 BUILD STYLED PROMPT
      const finalPrompt = buildStyledPrompt(prompt, selectedStyle);
      
      // Start all generations in parallel
      const generationPromises = slots.map(async (_, index) => {
        // Update slot to generating
        setImageSlots(prev => {
          const newSlots = [...prev];
          newSlots[index] = { ...newSlots[index], status: 'generating' };
          return newSlots;
        });

        try {
          const response = await imageApi.generateImageBase64({
            prompt: finalPrompt,  // ← Use styled prompt
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
                seed: Math.floor(Math.random() * 1000000), // Generate a random seed for display
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

      // Wait for all generations to complete
      await Promise.allSettled(generationPromises);

      setGenerationState('results');
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to generate images');
      setGenerationState('input');
    }
  };

  const resetToInput = () => {
    setGenerationState('input');
    setSelectedImage(null);
    setError(null);
    setImageSlots([]);
  };

  const handleDownloadGenerated = (imageData: string) => {
    downloadImage(imageData, `generated-${Date.now()}.png`);
  };

  const handleSaveGenerated = async (imageData: string) => {
    try {
      const imageId = `img-${Date.now()}`;
      const imageRecord = {
        id: imageId,
        title: `Generated Image - ${new Date().toLocaleString()}`,
        timestamp: new Date().toISOString(),
        type: 'images',
        imageUrl: imageData,
        formData: {
          prompt,
          negativePrompt,
          width,
          height,
          numInferenceSteps
        }
      };

      const response = await fetch('http://localhost:8000/api/images-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageRecord),
      });

      if (response.ok) {
        alert('Image saved to Resource Manager!');
      } else {
        throw new Error('Failed to save image');
      }
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image');
    }
  };


  // ========================================
  // EDITOR: Upload Image
  // ========================================
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;

      // Set state immediately
      setUploadedImage(dataUrl);
      setIsNewUpload(true);
      setHistory({
        original: dataUrl,
        current: dataUrl,
        undoStack: [],
        redoStack: []
      });

      // Draw on canvas after a short delay to ensure state is updated
      setTimeout(() => {
        drawImageOnCanvas(dataUrl);
        clearMaskCanvas();
      }, 100);
    };
    reader.readAsDataURL(file);
  };

  const drawImageOnCanvas = (imageData: string) => {
    const canvas = imageCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas size to image size
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Also set mask canvas size
      const maskCanvas = maskCanvasRef.current;
      if (maskCanvas) {
        maskCanvas.width = img.width;
        maskCanvas.height = img.height;
      }

      // Draw image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageData;
  };

  const clearMaskCanvas = () => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // ========================================
  // EDITOR: Mask Drawing
  // ========================================
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    drawOnMask(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const drawOnMask = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Update mouse position for cursor
    setMousePos({x: e.clientX - rect.left, y: e.clientY - rect.top});

    if (!isDrawing) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // White mask
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  };

  // ========================================
  // EDITOR: Object Removal (Inpainting)
  // ========================================
  const handleRemoveObject = async () => {
    const imageCanvas = imageCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;

    if (!imageCanvas || !maskCanvas || !uploadedImage) {
      setError('Please upload an image and draw a mask first');
      return;
    }

    // Check if mask has any content
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true });
    if (!maskCtx) return;

    const maskData = maskCtx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
    const hasContent = maskData.data.some(pixel => pixel > 0);
    
    if (!hasContent) {
      setError('Please draw on the image to mark areas to remove');
      return;
    }

    setIsInpainting(true);
    setError(null);

    try {
      // Convert canvases to data URLs
      const imageDataUrl = history.current;
      const maskDataUrl = maskCanvas.toDataURL('image/png');

      // Call inpainting API
      const response = await imageApi.inpaintImageBase64({
        image: imageDataUrl,
        mask: maskDataUrl
      });

      if (response.success && response.imageData) {
        // Update history
        setHistory(prev => ({
          ...prev,
          undoStack: [...prev.undoStack, prev.current],
          current: response.imageData,
          redoStack: []
        }));

        // Draw new image
        drawImageOnCanvas(response.imageData);
        clearMaskCanvas();
      } else {
        throw new Error('Inpainting failed');
      }
    } catch (err: any) {
      console.error('Inpainting error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to remove object');
    } finally {
      setIsInpainting(false);
    }
  };

  // ========================================
  // EDITOR: Undo/Redo
  // ========================================
  const handleUndo = () => {
    if (history.undoStack.length === 0) return;

    const previousState = history.undoStack[history.undoStack.length - 1];
    const newUndoStack = history.undoStack.slice(0, -1);

    setHistory(prev => ({
      ...prev,
      undoStack: newUndoStack,
      current: previousState,
      redoStack: [prev.current, ...prev.redoStack]
    }));

    drawImageOnCanvas(previousState);
    clearMaskCanvas();
  };

  const handleRedo = () => {
    if (history.redoStack.length === 0) return;

    const nextState = history.redoStack[0];
    const newRedoStack = history.redoStack.slice(1);

    setHistory(prev => ({
      ...prev,
      undoStack: [...prev.undoStack, prev.current],
      current: nextState,
      redoStack: newRedoStack
    }));

    drawImageOnCanvas(nextState);
    clearMaskCanvas();
  };

  const handleClearMask = () => {
    clearMaskCanvas();
  };

  const handleDownloadEdited = () => {
    if (history.current) {
      downloadImage(history.current, `edited-${Date.now()}.png`);
    }
  };

  const handleSaveEdited = async () => {
    if (!history.current) return;

    try {
      const imageId = `img-${Date.now()}`;
      const imageRecord = {
        id: imageId,
        title: `Edited Image - ${new Date().toLocaleString()}`,
        timestamp: new Date().toISOString(),
        type: 'images',
        imageUrl: history.current,
        formData: {
          type: 'edited',
          tabId
        }
      };

      const response = await fetch('http://localhost:8000/api/images-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageRecord),
      });

      if (response.ok) {
        alert('Image saved to Resource Manager!');
      } else {
        throw new Error('Failed to save image');
      }
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image');
    }
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="h-full bg-white flex flex-col" data-tutorial="image-studio-root">
      {/* Top Right Sliding Toggle */}
      <div className="flex justify-end p-4 border-b border-gray-200" data-tutorial="image-studio-tab-toggle">
        <div className="relative flex bg-gray-200 rounded-lg p-1">
          <div
            className={`absolute top-1 bottom-1 w-1/2 bg-blue-600 rounded-md transition-all duration-300 ease-in-out ${
              activeTab === 'generator' ? 'left-1' : 'left-1/2'
            }`}
          />
           <button
             onClick={() => setActiveTab('generator')}
             className={`relative z-10 flex items-center justify-center px-4 py-2 rounded-md transition-colors duration-300 ${
               activeTab === 'generator' ? 'text-white' : 'text-gray-700 hover:text-gray-900'
             }`}
           >
            <Sparkles className="w-4 h-4 mr-2" />
            Image Generator
          </button>
           <button
             onClick={() => setActiveTab('editor')}
             className={`relative z-10 flex items-center justify-center px-4 py-2 rounded-md transition-colors duration-300 ${
               activeTab === 'editor' ? 'text-white' : 'text-gray-700 hover:text-gray-900'
             }`}
           >
            <Eraser className="w-4 h-4 mr-2" />
            Image Editor
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {/* ========================================
            GENERATOR TAB
        ======================================== */}
         {activeTab === 'generator' && (
          <div className="h-full p-6 overflow-y-auto" data-tutorial="image-studio-generator-panel">
            {generationState === 'input' && (
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6" data-tutorial="image-studio-generator-title">AI Image Generator</h2>
                <div className="space-y-6">
                  
                  {/* Visual Style Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visual Style
                    </label>
                    <select
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={loadingStyles}
                    >
                      <option value="cartoon_3d">3D Cartoon</option>
                      <option value="line_art_bw">Black & White Line Art</option>
                      <option value="illustrated_painting">Illustrated Painting</option>
                      <option value="realistic">Photorealistic</option>
                    </select>
                    {styleProfiles[selectedStyle] && (
                      <p className="text-xs text-gray-500 mt-1">
                        {styleProfiles[selectedStyle].description}
                      </p>
                    )}
                  </div>

                  {/* Base Prompt Field */}
                  <div data-tutorial="image-studio-prompt">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prompt <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">
                      Describe what you want to generate. The selected style will be applied automatically.
                    </p>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="E.g., A flowering plant showing roots, stem, leaves, and flower petals"
                    />
                  </div>

                  {/* Advanced Options */}
                  <div className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-gray-50 transition rounded-lg"
                    >
                      <span className="text-sm font-medium text-gray-700">Advanced Options</span>
                      <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showAdvanced && (
                      <div className="px-4 pb-4 space-y-4 border-t border-gray-200 pt-4">
                        {/* Negative Prompt */}
                        <div data-tutorial="image-studio-negative-prompt">
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Negative Prompt
                            </label>
                            <label className="flex items-center text-xs text-gray-500">
                              <input
                                type="checkbox"
                                checked={useManualNegative}
                                onChange={(e) => setUseManualNegative(e.target.checked)}
                                className="mr-1 rounded"
                              />
                              Manual
                            </label>
                          </div>
                          <input
                            type="text"
                            value={negativePrompt}
                            onChange={(e) => {
                              setNegativePrompt(e.target.value);
                              setUseManualNegative(true);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Things to avoid in the image..."
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            {useManualNegative ? 'Custom settings' : 'Auto-filled from style profile'}
                          </p>
                        </div>

                        {/* Dimensions and Steps */}
                        <div className="grid grid-cols-3 gap-4" data-tutorial="image-studio-dimensions">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
                            <select
                              value={width}
                              onChange={(e) => setWidth(Number(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value={512}>512</option>
                              <option value={768}>768</option>
                              <option value={1024}>1024</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                            <select
                              value={height}
                              onChange={(e) => setHeight(Number(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value={512}>512</option>
                              <option value={768}>768</option>
                              <option value={1024}>1024</option>
                            </select>
                          </div>
                          <div data-tutorial="image-studio-steps">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Steps</label>
                            <select
                              value={numInferenceSteps}
                              onChange={(e) => setNumInferenceSteps(Number(e.target.value))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Batch Size */}
                  <div data-tutorial="image-studio-batch">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Batch Size</label>
                    <select
                      value={numImages}
                      onChange={(e) => setNumImages(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={1}>1 Image</option>
                      <option value={2}>2 Images</option>
                      <option value={3}>3 Images</option>
                      <option value={4}>4 Images</option>
                      <option value={5}>5 Images</option>
                    </select>
                  </div>

                  {/* Generate Button */}
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || loadingStyles}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center transition"
                    data-tutorial="image-studio-generate"
                  >
                    {loadingStyles ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generate Image
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {generationState === 'generating' && (
              <div className="max-w-5xl mx-auto" data-tutorial="image-studio-results">
                <h2 className="text-2xl font-semibold mb-6">Generating Images...</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {imageSlots.map((slot, i) => (
                    <div key={i} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="relative">
                        {slot.status === 'completed' && slot.imageData ? (
                          <>
                            <img
                              src={slot.imageData}
                              alt={`Generated ${i + 1}`}
                              className="w-full max-h-[400px] object-contain rounded-lg mb-4 cursor-pointer"
                              onClick={() => {
                                setSelectedImage(slot.imageData);
                                setShowImageModal(true);
                              }}
                            />
                            <div className="text-xs text-gray-500 mb-2">
                              Seed: {slot.seed}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDownloadGenerated(slot.imageData!)}
                                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center text-sm"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </button>
                              <button
                                onClick={() => handleSaveGenerated(slot.imageData!)}
                                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-sm"
                              >
                                <Save className="w-4 h-4 mr-1" />
                                Save
                              </button>
                            </div>
                          </>
                        ) : slot.status === 'generating' ? (
                          <div className="flex flex-col items-center justify-center h-[300px]">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                            <p className="text-sm text-gray-500">Generating...</p>
                          </div>
                        ) : slot.status === 'error' ? (
                          <div className="flex flex-col items-center justify-center h-[300px]">
                            <p className="text-sm text-red-500">Generation failed</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[300px]">
                            <p className="text-sm text-gray-400">Pending...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {generationState === 'results' && (
              <div className="max-w-5xl mx-auto" data-tutorial="image-studio-results">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Generated Image</h2>
                  <button
                    onClick={resetToInput}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Generate Another
                  </button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {imageSlots.map((slot, i) => (
                    <div key={i} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <div className="relative">
                        {slot.status === 'completed' && slot.imageData ? (
                          <>
                            <img
                              src={slot.imageData}
                              alt={`Generated ${i + 1}`}
                              className="w-full max-h-[400px] object-contain rounded-lg mb-4 cursor-pointer"
                              onClick={() => {
                                setSelectedImage(slot.imageData);
                                setShowImageModal(true);
                              }}
                            />
                            <div className="text-xs text-gray-500 mb-2">
                              Seed: {slot.seed}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDownloadGenerated(slot.imageData!)}
                                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center text-sm"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </button>
                              <button
                                onClick={() => handleSaveGenerated(slot.imageData!)}
                                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-sm"
                              >
                                <Save className="w-4 h-4 mr-1" />
                                Save
                              </button>
                            </div>
                          </>
                        ) : slot.status === 'generating' ? (
                          <div className="flex flex-col items-center justify-center h-[300px] cursor-pointer" onClick={() => setSelectedImage(null)}>
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                            <p className="text-sm text-gray-500">Generating...</p>
                            <p className="text-xs text-gray-400 mt-1">Click to view progress</p>
                          </div>
                        ) : slot.status === 'error' ? (
                          <div className="flex flex-col items-center justify-center h-[300px]">
                            <p className="text-sm text-red-500">Generation failed</p>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[300px]">
                            <p className="text-sm text-gray-400">Pending...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================
            EDITOR TAB
        ======================================== */}
        {activeTab === 'editor' && (
          <div className="h-full flex" data-tutorial="image-studio-editor-panel">
            {/* Main Canvas Area */}
            <div className="flex-1 p-6 overflow-y-auto">
              {!uploadedImage ? (
                <div className="h-full flex items-center justify-center" data-tutorial="image-studio-upload">
                  <div className="text-center">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <h2 className="text-xl font-semibold mb-2">Upload an Image</h2>
                    <p className="text-sm text-gray-500 mb-4">Start by uploading an image to edit</p>
                    <label className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      Choose File
                    </label>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Image Editor</h2>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center text-sm"
                      >
                        {showBeforeAfter ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                        {showBeforeAfter ? 'Hide Original' : 'Show Original'}
                      </button>
                      <label className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center text-sm">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <Upload className="w-4 h-4 mr-1" />
                        New Image
                      </label>
                    </div>
                  </div>

                  <div className="relative border border-gray-300 rounded-lg overflow-hidden bg-gray-100" data-tutorial="image-studio-canvas">
                    {/* Original image underneath */}
                    <img
                      src={history.original}
                      alt="Original"
                      className="absolute top-0 left-0 w-full h-full object-contain"
                      style={{ pointerEvents: 'none', zIndex: 1 }}
                    />
                    {/* Edited image on top, slides horizontally */}
                    <div
                      className="relative transition-transform duration-500 ease-in-out"
                      style={{
                        transform: showBeforeAfter ? 'translateX(100%)' : 'translateX(0%)',
                        zIndex: 2
                      }}
                    >
                      <canvas
                        ref={imageCanvasRef}
                        className="max-w-full h-auto"
                        style={{ display: 'block' }}
                      />
                      <canvas
                        ref={maskCanvasRef}
                        className="absolute top-0 left-0 max-w-full h-auto"
                        style={{ mixBlendMode: 'normal', cursor: 'none' }}
                        onMouseDown={startDrawing}
                        onMouseMove={drawOnMask}
                        onMouseUp={stopDrawing}
                        onMouseLeave={() => { stopDrawing(); setShowBrushCursor(false); }}
                        onMouseEnter={() => setShowBrushCursor(true)}
                      />
                      {showBrushCursor && (
                        <div
                          style={{
                            position: 'absolute',
                            left: mousePos.x - brushSize,
                            top: mousePos.y - brushSize,
                            width: brushSize * 2,
                            height: brushSize * 2,
                            border: '2px solid rgba(255, 255, 255, 0.8)',
                            borderRadius: '50%',
                            pointerEvents: 'none',
                            zIndex: 10
                          }}
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleRemoveObject}
                      disabled={isInpainting}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                      data-tutorial="image-studio-remove"
                    >
                      {isInpainting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Removing...
                        </>
                      ) : (
                        <>
                          <Eraser className="w-4 h-4 mr-2" />
                          Remove Marked Area
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleDownloadEdited}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar - Editor Tools */}
            {uploadedImage && (
              <div className="w-72 border-l border-gray-200 p-4 overflow-y-auto bg-gray-50" data-tutorial="image-studio-tools">
                <h3 className="text-lg font-semibold mb-4">Editor Tools</h3>

                <div className="space-y-4">
                  {/* Brush Size */}
                  <div data-tutorial="image-studio-brush">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brush Size: {brushSize}px
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  {/* Undo/Redo */}
                  <div className="flex gap-2" data-tutorial="image-studio-undo">
                    <button
                      onClick={handleUndo}
                      disabled={history.undoStack.length === 0}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Undo2 className="w-4 h-4 mr-1" />
                      Undo
                    </button>
                    <button
                      onClick={handleRedo}
                      disabled={history.redoStack.length === 0}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <Redo2 className="w-4 h-4 mr-1" />
                      Redo
                    </button>
                  </div>

                  {/* Clear Mask */}
                  <button
                    onClick={handleClearMask}
                    className="w-full px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 flex items-center justify-center"
                  >
                    <Eraser className="w-4 h-4 mr-1" />
                    Clear Mask
                  </button>

                  {/* Save to Resource Manager */}
                  <button
                    onClick={handleSaveEdited}
                    className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                    data-tutorial="image-studio-save-edited"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </button>

                  {/* Instructions */}
                  <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">How to Use:</h4>
                    <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Draw white marks over objects to remove</li>
                      <li>Adjust brush size as needed</li>
                      <li>Click "Remove Marked Area"</li>
                      <li>Wait 3-5 seconds for processing</li>
                      <li>Use Undo if needed</li>
                    </ol>
                  </div>

                  {/* History Info */}
                  <div className="mt-4 text-xs text-gray-500">
                    <p>Undo available: {history.undoStack.length}</p>
                    <p>Redo available: {history.redoStack.length}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setShowImageModal(false)}>
          <div className="max-w-4xl max-h-[90vh] p-4">
            <img
              src={selectedImage}
              alt="Selected image"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageStudio;
