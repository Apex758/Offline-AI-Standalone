import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Download, Eye, EyeOff, Undo2, Redo2, Eraser, Upload, Sparkles, Save, ChevronDown, ArrowRight, Square, Hash, Trash2, Layers, FileText, ImageOff, Palette, Pencil, X } from 'lucide-react';
import { HeartbeatLoader } from './ui/HeartbeatLoader';
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

type EditorTool = 'remove-object' | 'remove-background' | 'annotate' | 'coloring-page' | 'worksheet';

interface Annotation {
  id: string;
  type: 'arrow' | 'box' | 'number';
  x1: number; y1: number;
  x2: number; y2: number;
  label?: number;
  color: string;
  head1x?: number; head1y?: number;
  head2x?: number; head2y?: number;
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
  // New editor tool state
  // ========================================
  const [editorTool, setEditorTool] = useState<EditorTool>('remove-object');

  // Annotation state
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [annotationType, setAnnotationType] = useState<'arrow' | 'box' | 'number'>('arrow');
  const [annotationColor, setAnnotationColor] = useState('#ef4444');
  const [numberCounter, setNumberCounter] = useState(1);
  const [annotationDragging, setAnnotationDragging] = useState(false);
  const [annotationStart, setAnnotationStart] = useState<{ x: number; y: number } | null>(null);
  const [liveAnnotation, setLiveAnnotation] = useState<Annotation | null>(null);

  // Background removal
  const [isRemovingBg, setIsRemovingBg] = useState(false);

  // Worksheet
  const [showWorksheet, setShowWorksheet] = useState(false);
  const [worksheetTitle, setWorksheetTitle] = useState('');
  const [worksheetSubject, setWorksheetSubject] = useState('');
  const [worksheetQuestions, setWorksheetQuestions] = useState(5);
  const [worksheetIncludeImage, setWorksheetIncludeImage] = useState(true);
  const [worksheetImageSize, setWorksheetImageSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [worksheetGenerating, setWorksheetGenerating] = useState(false);
  const [worksheetPreview, setWorksheetPreview] = useState<string | null>(null);

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
  const svgRef = useRef<SVGSVGElement>(null);

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
  // EDITOR: Background Removal
  // ========================================
  const handleRemoveBackground = async () => {
    if (!history.current) return;
    setIsRemovingBg(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:8000/api/remove-background-base64', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: history.current }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to remove background');
      setHistory(prev => ({
        ...prev,
        undoStack: [...prev.undoStack, prev.current],
        current: data.imageData,
        redoStack: [],
      }));
      drawImageOnCanvas(data.imageData);
    } catch (err: any) {
      setError(err.message || 'Background removal failed');
    } finally {
      setIsRemovingBg(false);
    }
  };

  // ========================================
  // EDITOR: Coloring Page Generator
  // ========================================
  const handleColoringPage = () => {
    const canvas = imageCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width, h = canvas.height;
    const imageData = ctx.getImageData(0, 0, w, h);
    const d = imageData.data;

    // Grayscale
    const gray = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) {
      gray[i] = Math.round(0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]);
    }

    // Sobel edge detection
    const edges = new Uint8Array(w * h);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        const gx = -gray[(y - 1) * w + (x - 1)] - 2 * gray[y * w + (x - 1)] - gray[(y + 1) * w + (x - 1)]
                  + gray[(y - 1) * w + (x + 1)] + 2 * gray[y * w + (x + 1)] + gray[(y + 1) * w + (x + 1)];
        const gy = -gray[(y - 1) * w + (x - 1)] - 2 * gray[(y - 1) * w + x] - gray[(y - 1) * w + (x + 1)]
                  + gray[(y + 1) * w + (x - 1)] + 2 * gray[(y + 1) * w + x] + gray[(y + 1) * w + (x + 1)];
        edges[idx] = Math.min(255, Math.sqrt(gx * gx + gy * gy));
      }
    }

    // Threshold: edges → black, rest → white
    const threshold = 25;
    for (let i = 0; i < w * h; i++) {
      const c = edges[i] > threshold ? 0 : 255;
      d[i * 4] = c; d[i * 4 + 1] = c; d[i * 4 + 2] = c; d[i * 4 + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);

    const newDataUrl = canvas.toDataURL('image/png');
    setHistory(prev => ({
      ...prev,
      undoStack: [...prev.undoStack, prev.current],
      current: newDataUrl,
      redoStack: [],
    }));
  };

  // ========================================
  // EDITOR: Annotation Tool
  // ========================================
  const getAnnotationCoords = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
  };

  const computeArrowhead = (
    e: React.MouseEvent<SVGSVGElement>,
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const sx = (start.x / 100) * rect.width, sy = (start.y / 100) * rect.height;
    const ex = (end.x / 100) * rect.width, ey = (end.y / 100) * rect.height;
    const angle = Math.atan2(ey - sy, ex - sx);
    const len = 14, spread = Math.PI / 6;
    return {
      head1x: ((ex - len * Math.cos(angle - spread)) / rect.width) * 100,
      head1y: ((ey - len * Math.sin(angle - spread)) / rect.height) * 100,
      head2x: ((ex - len * Math.cos(angle + spread)) / rect.width) * 100,
      head2y: ((ey - len * Math.sin(angle + spread)) / rect.height) * 100,
    };
  };

  const onAnnotationMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    const coords = getAnnotationCoords(e);
    if (annotationType === 'number') {
      setAnnotations(prev => [...prev, {
        id: `ann-${Date.now()}`, type: 'number',
        x1: coords.x, y1: coords.y, x2: coords.x, y2: coords.y,
        label: numberCounter, color: annotationColor,
      }]);
      setNumberCounter(n => n + 1);
      return;
    }
    setAnnotationDragging(true);
    setAnnotationStart(coords);
  };

  const onAnnotationMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!annotationDragging || !annotationStart) return;
    const end = getAnnotationCoords(e);
    const ann: Annotation = {
      id: 'live', type: annotationType,
      x1: annotationStart.x, y1: annotationStart.y,
      x2: end.x, y2: end.y, color: annotationColor,
    };
    if (annotationType === 'arrow') {
      const heads = computeArrowhead(e, annotationStart, end);
      ann.head1x = heads.head1x; ann.head1y = heads.head1y;
      ann.head2x = heads.head2x; ann.head2y = heads.head2y;
    }
    setLiveAnnotation(ann);
  };

  const onAnnotationMouseUp = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!annotationDragging || !annotationStart) return;
    const end = getAnnotationCoords(e);
    const ann: Annotation = {
      id: `ann-${Date.now()}`, type: annotationType,
      x1: annotationStart.x, y1: annotationStart.y,
      x2: end.x, y2: end.y, color: annotationColor,
    };
    if (annotationType === 'arrow') {
      const heads = computeArrowhead(e, annotationStart, end);
      ann.head1x = heads.head1x; ann.head1y = heads.head1y;
      ann.head2x = heads.head2x; ann.head2y = heads.head2y;
    }
    setAnnotations(prev => [...prev, ann]);
    setLiveAnnotation(null);
    setAnnotationDragging(false);
    setAnnotationStart(null);
  };

  const handleFlattenAnnotations = () => {
    const canvas = imageCanvasRef.current;
    const svg = svgRef.current;
    if (!canvas || !svg || annotations.length === 0) return;
    const cloned = svg.cloneNode(true) as SVGSVGElement;
    cloned.setAttribute('width', String(canvas.width));
    cloned.setAttribute('height', String(canvas.height));
    const svgStr = new XMLSerializer().serializeToString(cloned);
    const url = URL.createObjectURL(new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' }));
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      const newDataUrl = canvas.toDataURL('image/png');
      setHistory(prev => ({
        ...prev, undoStack: [...prev.undoStack, prev.current], current: newDataUrl, redoStack: [],
      }));
      setAnnotations([]);
      setNumberCounter(1);
      setLiveAnnotation(null);
    };
    img.src = url;
  };

  // ========================================
  // EDITOR: Worksheet Generator
  // ========================================
  const generateWorksheetImage = async () => {
    setWorksheetGenerating(true);
    const W = 794, H = 1123, M = 50;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#cccccc'; ctx.lineWidth = 1;
    ctx.strokeRect(M, M, W - M * 2, H - M * 2);

    ctx.fillStyle = '#111111';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(worksheetTitle || 'Worksheet', W / 2, M + 42);

    if (worksheetSubject) {
      ctx.font = '15px Arial, sans-serif';
      ctx.fillStyle = '#555555';
      ctx.fillText(worksheetSubject, W / 2, M + 68);
    }

    let y = M + (worksheetSubject ? 95 : 78);
    ctx.font = '13px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#333333';
    ctx.fillText('Name:', M + 10, y);
    ctx.strokeStyle = '#aaaaaa'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(M + 58, y); ctx.lineTo(M + 280, y); ctx.stroke();
    ctx.fillText('Date:', W / 2 + 10, y);
    ctx.beginPath(); ctx.moveTo(W / 2 + 52, y); ctx.lineTo(W - M - 10, y); ctx.stroke();

    y += 18;
    ctx.strokeStyle = '#dddddd'; ctx.lineWidth = 0.5;
    ctx.beginPath(); ctx.moveTo(M, y); ctx.lineTo(W - M, y); ctx.stroke();
    y += 18;

    if (worksheetIncludeImage && history.current) {
      const maxH = worksheetImageSize === 'small' ? 180 : worksheetImageSize === 'medium' ? 270 : 370;
      const maxW = W - M * 2;
      await new Promise<void>(resolve => {
        const img = new Image();
        img.onload = () => {
          const ratio = Math.min(maxW / img.width, maxH / img.height);
          const iw = img.width * ratio, ih = img.height * ratio;
          const ix = (W - iw) / 2;
          ctx.drawImage(img, ix, y, iw, ih);
          ctx.strokeStyle = '#eeeeee'; ctx.lineWidth = 1;
          ctx.strokeRect(ix, y, iw, ih);
          y += ih + 22;
          resolve();
        };
        img.src = history.current!;
      });
    }

    for (let i = 0; i < worksheetQuestions; i++) {
      if (y > H - M - 50) break;
      ctx.font = '13px Arial, sans-serif'; ctx.fillStyle = '#222222'; ctx.textAlign = 'left';
      ctx.fillText(`${i + 1}.`, M + 10, y); y += 22;
      for (let j = 0; j < 2; j++) {
        ctx.strokeStyle = '#dddddd'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(M + 25, y); ctx.lineTo(W - M - 10, y); ctx.stroke();
        y += 24;
      }
      y += 6;
    }

    setWorksheetPreview(canvas.toDataURL('image/png'));
    setWorksheetGenerating(false);
  };

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="h-full tab-content-bg flex flex-col" data-tutorial="image-studio-root">
      {/* Top Right Sliding Toggle */}
      <div className="flex justify-end p-4 border-b border-theme" data-tutorial="image-studio-tab-toggle">
        <div className="relative flex bg-theme-tertiary rounded-lg p-1">
          <div
            className={`absolute top-1 bottom-1 w-1/2 bg-blue-600 rounded-md transition-all duration-300 ease-in-out ${
              activeTab === 'generator' ? 'left-1' : 'left-1/2'
            }`}
          />
           <button
             onClick={() => setActiveTab('generator')}
             className={`relative z-10 flex items-center justify-center px-4 py-2 rounded-md transition-colors duration-300 ${
               activeTab === 'generator' ? 'text-white' : 'text-theme-label hover:text-theme-title'
             }`}
           >
            <Sparkles className="w-4 h-4 mr-2" />
            Image Generator
          </button>
           <button
             onClick={() => setActiveTab('editor')}
             className={`relative z-10 flex items-center justify-center px-4 py-2 rounded-md transition-colors duration-300 ${
               activeTab === 'editor' ? 'text-white' : 'text-theme-label hover:text-theme-title'
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
                    <label className="block text-sm font-medium text-theme-label mb-2">
                      Visual Style
                    </label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        {
                          id: 'cartoon_3d',
                          label: '3D Cartoon',
                          icon: (
                            <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none">
                              <circle cx="32" cy="28" r="18" fill="#7DD3FC" stroke="#0284C7" strokeWidth="2"/>
                              <ellipse cx="32" cy="50" rx="18" ry="8" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2"/>
                              <circle cx="25" cy="25" r="4" fill="white"/>
                              <circle cx="39" cy="25" r="4" fill="white"/>
                              <circle cx="26" cy="26" r="2" fill="#1E40AF"/>
                              <circle cx="40" cy="26" r="2" fill="#1E40AF"/>
                              <path d="M26 35 Q32 40 38 35" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" fill="none"/>
                            </svg>
                          ),
                          hint: 'Colorful & friendly, Pixar-like 3D look',
                        },
                        {
                          id: 'line_art_bw',
                          label: 'Line Art',
                          icon: (
                            <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none">
                              <rect x="8" y="8" width="48" height="48" rx="4" fill="white" stroke="#374151" strokeWidth="2"/>
                              <path d="M16 24 Q32 16 48 24" stroke="#111827" strokeWidth="2" strokeLinecap="round" fill="none"/>
                              <path d="M16 32 Q32 40 48 32" stroke="#111827" strokeWidth="2" strokeLinecap="round" fill="none"/>
                              <circle cx="32" cy="20" r="6" stroke="#111827" strokeWidth="2" fill="none"/>
                              <line x1="16" y1="44" x2="48" y2="44" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          ),
                          hint: 'Clean B&W lines, coloring-book style',
                        },
                        {
                          id: 'illustrated_painting',
                          label: 'Painting',
                          icon: (
                            <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none">
                              <rect x="8" y="8" width="48" height="48" rx="4" fill="#FEF9C3"/>
                              <path d="M8 36 Q20 20 32 30 Q44 40 56 24" stroke="#D97706" strokeWidth="3" strokeLinecap="round" fill="none"/>
                              <circle cx="20" cy="18" r="7" fill="#FCA5A5" opacity="0.8"/>
                              <circle cx="44" cy="46" r="7" fill="#6EE7B7" opacity="0.8"/>
                              <circle cx="44" cy="18" r="5" fill="#93C5FD" opacity="0.8"/>
                              <path d="M10 52 Q30 44 54 52" stroke="#92400E" strokeWidth="2" strokeLinecap="round" fill="none"/>
                            </svg>
                          ),
                          hint: 'Textured brushstrokes, illustrated look',
                        },
                        {
                          id: 'realistic',
                          label: 'Realistic',
                          icon: (
                            <svg viewBox="0 0 64 64" className="w-10 h-10" fill="none">
                              <rect x="8" y="8" width="48" height="48" rx="4" fill="#1E293B"/>
                              <rect x="8" y="8" width="48" height="48" rx="4" fill="url(#realGrad)"/>
                              <defs>
                                <linearGradient id="realGrad" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
                                  <stop offset="0%" stopColor="#0F172A"/>
                                  <stop offset="100%" stopColor="#334155"/>
                                </linearGradient>
                              </defs>
                              <circle cx="32" cy="28" r="12" fill="#475569" stroke="#94A3B8" strokeWidth="1"/>
                              <circle cx="32" cy="28" r="8" fill="#64748B"/>
                              <circle cx="35" cy="25" r="3" fill="#94A3B8" opacity="0.6"/>
                              <ellipse cx="32" cy="48" rx="16" ry="5" fill="#334155" stroke="#475569" strokeWidth="1"/>
                            </svg>
                          ),
                          hint: 'Photorealistic, high-detail rendering',
                        },
                      ].map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          disabled={loadingStyles}
                          onClick={() => setSelectedStyle(style.id)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer text-center
                            ${selectedStyle === style.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md scale-[1.03]'
                              : 'border-theme hover:border-blue-300 hover:bg-theme-subtle'
                            }
                            ${loadingStyles ? 'opacity-50 cursor-not-allowed' : ''}
                          `}
                        >
                          <div className={`rounded-lg p-1 transition-all ${selectedStyle === style.id ? 'ring-2 ring-blue-400' : ''}`}>
                            {style.icon}
                          </div>
                          <span className={`text-xs font-semibold leading-tight ${selectedStyle === style.id ? 'text-blue-600 dark:text-blue-400' : 'text-theme-label'}`}>
                            {style.label}
                          </span>
                          {selectedStyle === style.id && (
                            <span className="text-[10px] text-blue-500 leading-tight">{style.hint}</span>
                          )}
                        </button>
                      ))}
                    </div>
                    {styleProfiles[selectedStyle] && (
                      <p className="text-xs text-theme-hint mt-2">
                        {styleProfiles[selectedStyle].description}
                      </p>
                    )}
                  </div>

                  {/* Base Prompt Field */}
                  <div data-tutorial="image-studio-prompt">
                    <label className="block text-sm font-medium text-theme-label mb-2">
                      Prompt <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-theme-hint mb-2">
                      Describe what you want to generate. The selected style will be applied automatically.
                    </p>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full p-3 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="E.g., A flowering plant showing roots, stem, leaves, and flower petals"
                    />
                  </div>

                  {/* Advanced Options */}
                  <div className="border border-theme rounded-lg">
                    <button
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="w-full px-4 py-2.5 flex items-center justify-between text-left hover:bg-theme-subtle transition rounded-lg"
                    >
                      <span className="text-sm font-medium text-theme-label">Advanced Options</span>
                      <ChevronDown className={`w-4 h-4 text-theme-hint transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showAdvanced && (
                      <div className="px-4 pb-4 space-y-4 border-t border-theme pt-4">
                        {/* Negative Prompt */}
                        <div data-tutorial="image-studio-negative-prompt">
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-theme-label">
                              Negative Prompt
                            </label>
                            <label className="flex items-center text-xs text-theme-hint">
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
                            className="w-full px-3 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Things to avoid in the image..."
                          />
                          <p className="text-xs text-theme-hint mt-1">
                            {useManualNegative ? 'Custom settings' : 'Auto-filled from style profile'}
                          </p>
                        </div>

                        {/* Dimensions and Steps */}
                        <div className="grid grid-cols-3 gap-4" data-tutorial="image-studio-dimensions">
                          <div>
                            <label className="block text-sm font-medium text-theme-label mb-2">Width</label>
                            <select
                              value={width}
                              onChange={(e) => setWidth(Number(e.target.value))}
                              className="w-full px-3 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value={512}>512</option>
                              <option value={768}>768</option>
                              <option value={1024}>1024</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-theme-label mb-2">Height</label>
                            <select
                              value={height}
                              onChange={(e) => setHeight(Number(e.target.value))}
                              className="w-full px-3 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value={512}>512</option>
                              <option value={768}>768</option>
                              <option value={1024}>1024</option>
                            </select>
                          </div>
                          <div data-tutorial="image-studio-steps">
                            <label className="block text-sm font-medium text-theme-label mb-2">Steps</label>
                            <select
                              value={numInferenceSteps}
                              onChange={(e) => setNumInferenceSteps(Number(e.target.value))}
                              className="w-full px-3 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    <label className="block text-sm font-medium text-theme-label mb-2">Batch Size</label>
                    <select
                      value={numImages}
                      onChange={(e) => setNumImages(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={1}>1 Image</option>
                      <option value={2}>2 Images</option>
                      <option value={3}>3 Images</option>
                      <option value={4}>4 Images</option>
                      <option value={5}>5 Images</option>
                    </select>
                  </div>

                  {/* Generate Button + Time Estimate */}
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || loadingStyles}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center transition"
                    data-tutorial="image-studio-generate"
                  >
                    {loadingStyles ? (
                      <>
                        <HeartbeatLoader className="w-5 h-5 mr-2" />
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
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold">Generating Images...</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {imageSlots.map((slot, i) => (
                    <div key={i} className="border border-theme-strong rounded-lg p-4 bg-theme-secondary">
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
                            <div className="text-xs text-theme-hint mb-2">
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
                            <HeartbeatLoader className="w-8 h-8 text-blue-600 mb-2" />
                            <p className="text-sm text-theme-hint">Generating...</p>
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
                    <div key={i} className="border border-theme-strong rounded-lg p-4 bg-theme-secondary">
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
                            <div className="text-xs text-theme-hint mb-2">
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
                            <HeartbeatLoader className="w-8 h-8 text-blue-600 mb-2" />
                            <p className="text-sm text-theme-hint">Generating...</p>
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
          <>
            {/* Worksheet Modal */}
            {showWorksheet && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                <div className="rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col widget-glass">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      Worksheet Maker
                    </h2>
                    <button onClick={() => { setShowWorksheet(false); setWorksheetPreview(null); }}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex flex-1 overflow-hidden">
                    {/* Settings panel */}
                    <div className="w-72 border-r border-gray-200 dark:border-gray-700 p-5 overflow-y-auto space-y-4 flex-shrink-0">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Worksheet Title</label>
                        <input type="text" value={worksheetTitle} onChange={e => setWorksheetTitle(e.target.value)}
                          placeholder="e.g. Parts of a Plant"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject / Topic</label>
                        <input type="text" value={worksheetSubject} onChange={e => setWorksheetSubject(e.target.value)}
                          placeholder="e.g. Science - Grade 4"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-800 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Number of Questions: {worksheetQuestions}
                        </label>
                        <input type="range" min={1} max={10} value={worksheetQuestions}
                          onChange={e => setWorksheetQuestions(Number(e.target.value))} className="w-full" />
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="wsIncludeImg" checked={worksheetIncludeImage}
                          onChange={e => setWorksheetIncludeImage(e.target.checked)} className="rounded" />
                        <label htmlFor="wsIncludeImg" className="text-sm text-gray-700 dark:text-gray-300">Include current image</label>
                      </div>
                      {worksheetIncludeImage && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image Size</label>
                          <select value={worksheetImageSize} onChange={e => setWorksheetImageSize(e.target.value as 'small' | 'medium' | 'large')}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-800 dark:text-white">
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                          </select>
                        </div>
                      )}
                      <button onClick={generateWorksheetImage} disabled={worksheetGenerating}
                        className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm font-medium">
                        {worksheetGenerating ? <HeartbeatLoader className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {worksheetGenerating ? 'Generating...' : 'Preview Worksheet'}
                      </button>
                      {worksheetPreview && (
                        <button onClick={() => downloadImage(worksheetPreview!, `worksheet-${Date.now()}.png`)}
                          className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm font-medium">
                          <Download className="w-4 h-4" />
                          Download PNG
                        </button>
                      )}
                    </div>
                    {/* Preview panel */}
                    <div className="flex-1 flex items-center justify-center overflow-auto p-6 bg-gray-100 dark:bg-gray-800">
                      {worksheetPreview ? (
                        <img src={worksheetPreview} alt="Worksheet preview"
                          className="max-w-full max-h-full shadow-xl rounded border border-gray-200" />
                      ) : (
                        <div className="text-center text-gray-400">
                          <FileText className="w-16 h-16 mx-auto mb-3 opacity-30" />
                          <p className="text-sm">Configure settings and click Preview to generate your worksheet</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="h-full flex" data-tutorial="image-studio-editor-panel">
              {/* Main Canvas Area */}
              <div className="flex-1 p-6 overflow-y-auto">
                {!uploadedImage ? (
                  <div className="h-full flex items-center justify-center" data-tutorial="image-studio-upload">
                    <div className="text-center">
                      <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h2 className="text-xl font-semibold mb-2">Upload an Image</h2>
                      <p className="text-sm text-theme-hint mb-4">Start by uploading an image to edit</p>
                      <label className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        Choose File
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold">Image Editor</h2>
                      <div className="flex gap-2">
                        <button onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                          className="px-3 py-1.5 border border-theme-strong rounded-lg hover:bg-theme-subtle flex items-center text-sm">
                          {showBeforeAfter ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                          {showBeforeAfter ? 'Hide Original' : 'Show Original'}
                        </button>
                        <label className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center text-sm">
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          <Upload className="w-4 h-4 mr-1" />New Image
                        </label>
                      </div>
                    </div>

                    <div className="relative border border-theme-strong rounded-lg overflow-hidden bg-theme-tertiary" data-tutorial="image-studio-canvas">
                      <img src={history.original} alt="Original"
                        className="absolute top-0 left-0 w-full h-full object-contain"
                        style={{ pointerEvents: 'none', zIndex: 1 }} />
                      <div className="relative transition-transform duration-500 ease-in-out"
                        style={{ transform: showBeforeAfter ? 'translateX(100%)' : 'translateX(0%)', zIndex: 2 }}>
                        <canvas ref={imageCanvasRef} className="max-w-full h-auto" style={{ display: 'block' }} />
                        <canvas ref={maskCanvasRef}
                          className="absolute top-0 left-0 max-w-full h-auto"
                          style={{
                            mixBlendMode: 'normal',
                            cursor: editorTool === 'remove-object' ? 'none' : 'default',
                            pointerEvents: editorTool === 'remove-object' ? 'auto' : 'none',
                          }}
                          onMouseDown={editorTool === 'remove-object' ? startDrawing : undefined}
                          onMouseMove={editorTool === 'remove-object' ? drawOnMask : undefined}
                          onMouseUp={editorTool === 'remove-object' ? stopDrawing : undefined}
                          onMouseLeave={editorTool === 'remove-object' ? () => { stopDrawing(); setShowBrushCursor(false); } : undefined}
                          onMouseEnter={editorTool === 'remove-object' ? () => setShowBrushCursor(true) : undefined}
                        />
                        {showBrushCursor && editorTool === 'remove-object' && (
                          <div style={{
                            position: 'absolute', left: mousePos.x - brushSize, top: mousePos.y - brushSize,
                            width: brushSize * 2, height: brushSize * 2,
                            border: '2px solid rgba(255,255,255,0.8)', borderRadius: '50%',
                            pointerEvents: 'none', zIndex: 10,
                          }} />
                        )}
                        {/* Annotation SVG overlay */}
                        {editorTool === 'annotate' && (
                          <svg ref={svgRef}
                            className="absolute top-0 left-0 w-full h-full"
                            style={{ zIndex: 20, cursor: 'crosshair' }}
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                            onMouseDown={onAnnotationMouseDown}
                            onMouseMove={onAnnotationMouseMove}
                            onMouseUp={onAnnotationMouseUp}
                            onMouseLeave={() => {
                              if (annotationDragging && liveAnnotation) {
                                setAnnotations(prev => [...prev, { ...liveAnnotation, id: `ann-${Date.now()}` }]);
                              }
                              setAnnotationDragging(false);
                              setAnnotationStart(null);
                              setLiveAnnotation(null);
                            }}
                          >
                            {[...annotations, ...(liveAnnotation ? [liveAnnotation] : [])].map(ann => {
                              if (ann.type === 'arrow') return (
                                <g key={ann.id}>
                                  <line x1={ann.x1} y1={ann.y1} x2={ann.x2} y2={ann.y2}
                                    stroke={ann.color} strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
                                  {ann.head1x !== undefined && (
                                    <polyline
                                      points={`${ann.head1x},${ann.head1y} ${ann.x2},${ann.y2} ${ann.head2x},${ann.head2y}`}
                                      fill="none" stroke={ann.color} strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
                                  )}
                                </g>
                              );
                              if (ann.type === 'box') return (
                                <rect key={ann.id}
                                  x={Math.min(ann.x1, ann.x2)} y={Math.min(ann.y1, ann.y2)}
                                  width={Math.abs(ann.x2 - ann.x1)} height={Math.abs(ann.y2 - ann.y1)}
                                  fill="none" stroke={ann.color} strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
                              );
                              if (ann.type === 'number') return (
                                <g key={ann.id}>
                                  <circle cx={ann.x1} cy={ann.y1} r="3" fill={ann.color} />
                                  <text x={ann.x1} y={ann.y1} textAnchor="middle" dominantBaseline="central"
                                    fill="white" fontSize="3.2" fontWeight="bold">{ann.label}</text>
                                </g>
                              );
                              return null;
                            })}
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Per-tool action buttons */}
                    {editorTool === 'remove-object' && (
                      <div className="flex gap-2">
                        <button onClick={handleRemoveObject} disabled={isInpainting}
                          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                          data-tutorial="image-studio-remove">
                          {isInpainting
                            ? <><HeartbeatLoader className="w-4 h-4 mr-2" />Removing...</>
                            : <><Eraser className="w-4 h-4 mr-2" />Remove Marked Area</>}
                        </button>
                        <button onClick={handleDownloadEdited}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center">
                          <Download className="w-4 h-4 mr-2" />Download
                        </button>
                      </div>
                    )}
                    {editorTool === 'remove-background' && (
                      <div className="flex gap-2">
                        <button onClick={handleRemoveBackground} disabled={isRemovingBg}
                          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                          {isRemovingBg
                            ? <><HeartbeatLoader className="w-4 h-4 mr-2" />Removing Background...</>
                            : <><ImageOff className="w-4 h-4 mr-2" />Remove Background</>}
                        </button>
                        <button onClick={handleDownloadEdited}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center">
                          <Download className="w-4 h-4 mr-2" />Download
                        </button>
                      </div>
                    )}
                    {editorTool === 'annotate' && (
                      <div className="flex gap-2">
                        <button onClick={handleFlattenAnnotations} disabled={annotations.length === 0}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                          <Layers className="w-4 h-4 mr-2" />Apply Annotations
                        </button>
                        <button onClick={handleDownloadEdited}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center">
                          <Download className="w-4 h-4 mr-2" />Download
                        </button>
                      </div>
                    )}
                    {editorTool === 'coloring-page' && (
                      <div className="flex gap-2">
                        <button onClick={handleColoringPage}
                          className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center justify-center">
                          <Palette className="w-4 h-4 mr-2" />Convert to Coloring Page
                        </button>
                        <button onClick={handleDownloadEdited}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center">
                          <Download className="w-4 h-4 mr-2" />Download
                        </button>
                      </div>
                    )}
                    {editorTool === 'worksheet' && (
                      <div className="flex gap-2">
                        <button onClick={() => setShowWorksheet(true)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center">
                          <FileText className="w-4 h-4 mr-2" />Open Worksheet Maker
                        </button>
                        <button onClick={handleDownloadEdited}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center">
                          <Download className="w-4 h-4 mr-2" />Download Image
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              {uploadedImage && (
                <div className="w-72 border-l border-theme p-4 overflow-y-auto bg-theme-secondary" data-tutorial="image-studio-tools">
                  <h3 className="text-sm font-semibold text-theme-label uppercase tracking-wide mb-3">Editor Tools</h3>

                  {/* Tool selector */}
                  <div className="grid grid-cols-5 gap-1 mb-1 p-1 bg-theme-tertiary rounded-lg">
                    {([
                      { id: 'remove-object' as EditorTool, icon: Eraser, label: 'Object Remover' },
                      { id: 'remove-background' as EditorTool, icon: ImageOff, label: 'Background Remover' },
                      { id: 'annotate' as EditorTool, icon: Pencil, label: 'Annotate' },
                      { id: 'coloring-page' as EditorTool, icon: Palette, label: 'Coloring Page' },
                      { id: 'worksheet' as EditorTool, icon: FileText, label: 'Worksheet Maker' },
                    ]).map(({ id, icon: Icon, label }) => (
                      <button key={id} onClick={() => setEditorTool(id)} title={label}
                        className={`p-2 rounded-md flex items-center justify-center transition ${
                          editorTool === id ? 'bg-blue-600 text-white shadow' : 'text-theme-label hover:bg-theme-hover'
                        }`}>
                        <Icon className="w-4 h-4" />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-theme-hint text-center mb-4">
                    {editorTool === 'remove-object' && 'Object Remover'}
                    {editorTool === 'remove-background' && 'Background Remover'}
                    {editorTool === 'annotate' && 'Annotation Tool'}
                    {editorTool === 'coloring-page' && 'Coloring Page Generator'}
                    {editorTool === 'worksheet' && 'Worksheet Maker'}
                  </p>

                  <div className="space-y-4">
                    {/* Object Remover */}
                    {editorTool === 'remove-object' && (
                      <>
                        <div data-tutorial="image-studio-brush">
                          <label className="block text-sm font-medium text-theme-label mb-2">Brush Size: {brushSize}px</label>
                          <input type="range" min="5" max="50" value={brushSize}
                            onChange={(e) => setBrushSize(Number(e.target.value))} className="w-full" />
                        </div>
                        <div className="flex gap-2" data-tutorial="image-studio-undo">
                          <button onClick={handleUndo} disabled={history.undoStack.length === 0}
                            className="flex-1 px-3 py-2 border border-theme-strong rounded-lg hover:bg-theme-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                            <Undo2 className="w-4 h-4 mr-1" />Undo
                          </button>
                          <button onClick={handleRedo} disabled={history.redoStack.length === 0}
                            className="flex-1 px-3 py-2 border border-theme-strong rounded-lg hover:bg-theme-hover disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                            <Redo2 className="w-4 h-4 mr-1" />Redo
                          </button>
                        </div>
                        <button onClick={handleClearMask}
                          className="w-full px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 flex items-center justify-center">
                          <Eraser className="w-4 h-4 mr-1" />Clear Mask
                        </button>
                        <button onClick={handleSaveEdited}
                          className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center"
                          data-tutorial="image-studio-save-edited">
                          <Save className="w-4 h-4 mr-1" />Save
                        </button>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <h4 className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1">How to Use:</h4>
                          <ol className="text-xs text-blue-800 dark:text-blue-400 space-y-1 list-decimal list-inside">
                            <li>Paint over the object to remove</li>
                            <li>Click "Remove Marked Area"</li>
                            <li>Use Undo to revert</li>
                          </ol>
                        </div>
                        <div className="text-xs text-theme-hint">
                          Undo: {history.undoStack.length} &nbsp; Redo: {history.redoStack.length}
                        </div>
                      </>
                    )}

                    {/* Background Remover */}
                    {editorTool === 'remove-background' && (
                      <>
                        <div className="flex gap-2">
                          <button onClick={handleUndo} disabled={history.undoStack.length === 0}
                            className="flex-1 px-3 py-2 border border-theme-strong rounded-lg hover:bg-theme-hover disabled:opacity-50 flex items-center justify-center text-sm">
                            <Undo2 className="w-4 h-4 mr-1" />Undo
                          </button>
                          <button onClick={handleRedo} disabled={history.redoStack.length === 0}
                            className="flex-1 px-3 py-2 border border-theme-strong rounded-lg hover:bg-theme-hover disabled:opacity-50 flex items-center justify-center text-sm">
                            <Redo2 className="w-4 h-4 mr-1" />Redo
                          </button>
                        </div>
                        <button onClick={handleSaveEdited}
                          className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center">
                          <Save className="w-4 h-4 mr-1" />Save
                        </button>
                        <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                          <h4 className="text-xs font-semibold text-purple-900 dark:text-purple-300 mb-1">How to Use:</h4>
                          <p className="text-xs text-purple-800 dark:text-purple-400">Click "Remove Background" below the canvas. The AI will automatically detect and remove the background, producing a transparent PNG.</p>
                        </div>
                      </>
                    )}

                    {/* Annotation Tool */}
                    {editorTool === 'annotate' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-theme-label mb-2">Annotation Type</label>
                          <div className="grid grid-cols-3 gap-1">
                            {([
                              { type: 'arrow' as const, icon: ArrowRight, label: 'Arrow' },
                              { type: 'box' as const, icon: Square, label: 'Box' },
                              { type: 'number' as const, icon: Hash, label: 'Number' },
                            ]).map(({ type, icon: Icon, label }) => (
                              <button key={type} onClick={() => setAnnotationType(type)}
                                className={`py-2 rounded-lg flex flex-col items-center gap-1 text-xs transition ${
                                  annotationType === type
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-theme-strong hover:bg-theme-hover text-theme-label'
                                }`}>
                                <Icon className="w-4 h-4" />{label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-theme-label mb-2">Color</label>
                          <div className="flex gap-2 flex-wrap items-center">
                            {['#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#000000'].map(c => (
                              <button key={c} onClick={() => setAnnotationColor(c)}
                                className={`w-6 h-6 rounded-full border-2 transition ${annotationColor === c ? 'border-white scale-110 shadow' : 'border-transparent'}`}
                                style={{ backgroundColor: c }} />
                            ))}
                            <input type="color" value={annotationColor}
                              onChange={e => setAnnotationColor(e.target.value)}
                              className="w-6 h-6 rounded-full cursor-pointer" title="Custom color" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={handleUndo} disabled={history.undoStack.length === 0}
                            className="flex-1 px-3 py-2 border border-theme-strong rounded-lg hover:bg-theme-hover disabled:opacity-50 flex items-center justify-center text-sm">
                            <Undo2 className="w-4 h-4 mr-1" />Undo
                          </button>
                          <button onClick={() => { setAnnotations([]); setNumberCounter(1); }}
                            disabled={annotations.length === 0}
                            className="flex-1 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 flex items-center justify-center text-sm">
                            <Trash2 className="w-4 h-4 mr-1" />Clear
                          </button>
                        </div>
                        <p className="text-xs text-theme-hint">
                          {annotationType === 'arrow' && 'Click and drag to draw arrows.'}
                          {annotationType === 'box' && 'Click and drag to draw boxes.'}
                          {annotationType === 'number' && 'Click to place numbered markers.'}
                          {annotations.length > 0 && ` ${annotations.length} annotation(s) placed.`}
                        </p>
                      </>
                    )}

                    {/* Coloring Page */}
                    {editorTool === 'coloring-page' && (
                      <>
                        <div className="flex gap-2">
                          <button onClick={handleUndo} disabled={history.undoStack.length === 0}
                            className="flex-1 px-3 py-2 border border-theme-strong rounded-lg hover:bg-theme-hover disabled:opacity-50 flex items-center justify-center text-sm">
                            <Undo2 className="w-4 h-4 mr-1" />Undo
                          </button>
                          <button onClick={handleRedo} disabled={history.redoStack.length === 0}
                            className="flex-1 px-3 py-2 border border-theme-strong rounded-lg hover:bg-theme-hover disabled:opacity-50 flex items-center justify-center text-sm">
                            <Redo2 className="w-4 h-4 mr-1" />Redo
                          </button>
                        </div>
                        <button onClick={handleSaveEdited}
                          className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center">
                          <Save className="w-4 h-4 mr-1" />Save
                        </button>
                        <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                          <h4 className="text-xs font-semibold text-orange-900 dark:text-orange-300 mb-1">How to Use:</h4>
                          <p className="text-xs text-orange-800 dark:text-orange-400">Click "Convert to Coloring Page" below. Edge detection will produce black outlines on a white background — perfect for printing and colouring.</p>
                        </div>
                      </>
                    )}

                    {/* Worksheet Maker */}
                    {editorTool === 'worksheet' && (
                      <>
                        <div className="flex gap-2">
                          <button onClick={handleUndo} disabled={history.undoStack.length === 0}
                            className="flex-1 px-3 py-2 border border-theme-strong rounded-lg hover:bg-theme-hover disabled:opacity-50 flex items-center justify-center text-sm">
                            <Undo2 className="w-4 h-4 mr-1" />Undo
                          </button>
                          <button onClick={handleRedo} disabled={history.redoStack.length === 0}
                            className="flex-1 px-3 py-2 border border-theme-strong rounded-lg hover:bg-theme-hover disabled:opacity-50 flex items-center justify-center text-sm">
                            <Redo2 className="w-4 h-4 mr-1" />Redo
                          </button>
                        </div>
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                          <h4 className="text-xs font-semibold text-blue-900 dark:text-blue-300 mb-1">Worksheet Maker</h4>
                          <p className="text-xs text-blue-800 dark:text-blue-400">Build a printable A4 worksheet featuring the current image with a title, name/date fields, and numbered question lines. Click "Open Worksheet Maker" below.</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
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
