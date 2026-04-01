import React, { useState, useEffect, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Loading02IconData from '@hugeicons/core-free-icons/Loading02Icon';
import Download01IconData from '@hugeicons/core-free-icons/Download01Icon';
import { useAchievementTrigger } from '../contexts/AchievementContext';
import ViewIconData from '@hugeicons/core-free-icons/ViewIcon';
import ViewOffIconData from '@hugeicons/core-free-icons/ViewOffIcon';
import UndoIconData from '@hugeicons/core-free-icons/UndoIcon';
import RedoIconData from '@hugeicons/core-free-icons/RedoIcon';
import EraserIconData from '@hugeicons/core-free-icons/EraserIcon';
import Upload01IconData from '@hugeicons/core-free-icons/Upload01Icon';
import ColorsIconData from '@hugeicons/core-free-icons/ColorsIcon';
import SaveIconData from '@hugeicons/core-free-icons/SaveIcon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import ArrowLeft01IconData from '@hugeicons/core-free-icons/ArrowLeft01Icon';
import SquareIconData from '@hugeicons/core-free-icons/SquareIcon';
import HashtagIconData from '@hugeicons/core-free-icons/HashtagIcon';
import Delete02IconData from '@hugeicons/core-free-icons/Delete02Icon';
import Layers01IconData from '@hugeicons/core-free-icons/Layers01Icon';
import File01IconData from '@hugeicons/core-free-icons/File01Icon';
import ImageNotFound01IconData from '@hugeicons/core-free-icons/ImageNotFound01Icon';
import PencilEdit01IconData from '@hugeicons/core-free-icons/PencilEdit01Icon';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import FolderOpenIconData from '@hugeicons/core-free-icons/FolderOpenIcon';
import BookOpen01IconData from '@hugeicons/core-free-icons/BookOpen01Icon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const Loader2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Loading02IconData} {...p} />;
const Download: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Download01IconData} {...p} />;
const Eye: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ViewIconData} {...p} />;
const EyeOff: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ViewOffIconData} {...p} />;
const Undo2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={UndoIconData} {...p} />;
const Redo2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={RedoIconData} {...p} />;
const Eraser: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={EraserIconData} {...p} />;
const Upload: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Upload01IconData} {...p} />;
const Palette: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ColorsIconData} {...p} />;
const Save: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={SaveIconData} {...p} />;
const ChevronDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowDown01IconData} {...p} />;
const ArrowRight: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowRight01IconData} {...p} />;
const ArrowLeft: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowLeft01IconData} {...p} />;
const Square: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={SquareIconData} {...p} />;
const Hash: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={HashtagIconData} {...p} />;
const Trash2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Delete02IconData} {...p} />;
const Layers: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Layers01IconData} {...p} />;
const FileText: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={File01IconData} {...p} />;
const ImageOff: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ImageNotFound01IconData} {...p} />;
const Pencil: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PencilEdit01IconData} {...p} />;
const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Cancel01IconData} {...p} />;
const FolderOpen: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={FolderOpenIconData} {...p} />;
const BookOpen: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BookOpen01IconData} {...p} />;
import axios from 'axios';
import { HeartbeatLoader } from './ui/HeartbeatLoader';
import { imageApi, downloadImage, SavedImageRecord } from '../lib/imageApi';
import { useNotification } from '../contexts/NotificationContext';
import { useTabProcessing } from '../contexts/TabBusyContext';
import { useCapabilities } from '../contexts/CapabilitiesContext';
import SmartTextArea from './SmartTextArea';
import SmartInput from './SmartInput';

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

type EditorTool = 'remove-object' | 'remove-background' | 'annotate' | 'coloring-page' | 'worksheet' | 'comic-maker';

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
}

const ImageStudio: React.FC<ImageStudioProps> = ({ tabId, savedData, onDataChange }) => {
  const hasRestoredRef = useRef(false);
  const triggerCheck = useAchievementTrigger();
  const { notify } = useNotification();
  const { hasDiffusion, hasLama } = useCapabilities();

  const IMAGE_STORAGE_KEY = `image-studio-${tabId}`;

  // ========================================
  // Tab Management
  // ========================================
  const [activeTab, setActiveTab] = useState<'generator' | 'editor'>(hasDiffusion ? 'generator' : 'editor');

  // ========================================
  // Generator States
  // ========================================
  const [prompt, setPrompt] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});
  const [negativePrompt, setNegativePrompt] = useState('deformed, distorted, blurry, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, bad anatomy, bad proportions, extra limbs, disfigured, fused fingers, too many fingers, six fingers, long neck, ugly, low quality, worst quality');
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [numInferenceSteps, setNumInferenceSteps] = useState(4);
  const [numImages, setNumImages] = useState(1);
  const [referenceImage, setReferenceImage] = useState<string | null>(null); // img2img reference
  const [img2imgStrength, setImg2imgStrength] = useState(0.5); // 0 = keep original, 1 = fully new
  const [generationState, setGenerationState] = useState<'input' | 'generating' | 'results'>('input');
  const setTabProcessingImg = useTabProcessing('image-generation');
  useEffect(() => { setTabProcessingImg(generationState === 'generating'); }, [generationState, setTabProcessingImg]);
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

  // Model capability flags (fetched from backend)
  const [modelCapabilities, setModelCapabilities] = useState<{
    supports_negative_prompt: boolean;
    supports_img2img: boolean;
  }>({ supports_negative_prompt: true, supports_img2img: true });

  // ========================================
  // Editor States
  // ========================================
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(20);
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [coloringDetail, setColoringDetail] = useState(50); // 0-100 detail level
  const [showResourcePicker, setShowResourcePicker] = useState(false);
  const [resourceImages, setResourceImages] = useState<SavedImageRecord[]>([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [history, setHistory] = useState<ImageHistory>({
    original: '',
    current: '',
    undoStack: [],
    redoStack: []
  });
  const [isInpainting, setIsInpainting] = useState(false);
  const [bgRemovalStrength, setBgRemovalStrength] = useState(100);

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
  // Comic Page Maker States
  // ========================================
  type ComicTemplate = 'grid-2x2' | 'strip-3' | 'hero-3' | 'asymmetric-4';

  interface ComicPanelSlot {
    imageData: string | null;
    prompt: string;
    status: 'idle' | 'generating' | 'completed' | 'error';
  }

  const [comicTemplate, setComicTemplate] = useState<ComicTemplate>('grid-2x2');
  const [comicDescription, setComicDescription] = useState('');
  const [comicPanels, setComicPanels] = useState<ComicPanelSlot[]>([]);
  const [comicState, setComicState] = useState<'input' | 'generating-prompts' | 'generating-images' | 'done'>('input');
  const setTabProcessingComic = useTabProcessing('comic-generation');
  useEffect(() => { setTabProcessingComic(comicState === 'generating-prompts' || comicState === 'generating-images'); }, [comicState, setTabProcessingComic]);
  const [comicError, setComicError] = useState<string | null>(null);
  const [comicFinalImage, setComicFinalImage] = useState<string | null>(null);

  const comicTemplateConfig: Record<ComicTemplate, { name: string; panels: number; description: string }> = {
    'grid-2x2': { name: '2x2 Grid', panels: 4, description: 'Classic 4-panel grid layout' },
    'strip-3': { name: '3-Panel Strip', panels: 3, description: 'Horizontal comic strip' },
    'hero-3': { name: 'Hero + 3 Small', panels: 4, description: 'One large panel + 3 smaller ones' },
    'asymmetric-4': { name: 'Asymmetric 4', panels: 4, description: 'Mixed sizes for dynamic layouts' },
  };

  // ========================================
  // Queue Another Popup States
  // ========================================
  const [showQueuePopup, setShowQueuePopup] = useState(false);
  const [queuePrompt, setQueuePrompt] = useState('');
  const [queueStyle, setQueueStyle] = useState('cartoon_3d');
  const [queueNumImages, setQueueNumImages] = useState(1);
  const [queueReferenceImage, setQueueReferenceImage] = useState<string | null>(null);
  const [queueImg2imgStrength, setQueueImg2imgStrength] = useState(0.5);

  interface QueuedGeneration {
    id: string;
    prompt: string;
    style: string;
    numImages: number;
    referenceImage: string | null;
    img2imgStrength: number;
    status: 'waiting' | 'generating' | 'completed' | 'error';
    results: Array<{ imageData: string | null; seed: number | null; status: string }>;
  }

  const [generationQueue, setGenerationQueue] = useState<QueuedGeneration[]>([]);
  const isProcessingQueueRef = useRef(false);

  // ========================================
  // Auto-save image to backend
  // ========================================
  const autoSaveImage = async (imageData: string, type: 'uploaded' | 'edited') => {
    try {
      const imageId = savedImageId || `img-${Date.now()}`;
      const imageRecord: SavedImageRecord = {
        id: imageId,
        title: type === 'uploaded'
          ? `Uploaded — ${new Date().toLocaleString()}`
          : buildImageTitle('Edited'),
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
  // Fetch model capabilities from backend
  // ========================================
  useEffect(() => {
    const loadModelCapabilities = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/diffusion-models/active');
        const data = await response.json();
        const caps = {
          supports_negative_prompt: data.supports_negative_prompt ?? true,
          supports_img2img: data.supports_img2img ?? true,
        };
        setModelCapabilities(caps);
        // Clear reference images if model doesn't support img2img
        if (!caps.supports_img2img) {
          setReferenceImage(null);
          setQueueReferenceImage(null);
        }
      } catch (error) {
        console.error('Failed to load model capabilities:', error);
      }
    };
    loadModelCapabilities();
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
      if (savedData.initialTab) setActiveTab(!hasDiffusion && savedData.initialTab === 'generator' ? 'editor' : savedData.initialTab);
      if (savedData.prompt) setPrompt(savedData.prompt);
      if (savedData.selectedStyle) setSelectedStyle(savedData.selectedStyle);
      if (savedData.imageSlots) setImageSlots(savedData.imageSlots);
      if (savedData.generationState) {
        // If we were stuck in 'generating' (e.g. tab restored after long generation),
        // check if slots are actually done — if so go to results, otherwise back to input
        if (savedData.generationState === 'generating') {
          const slots = savedData.imageSlots || [];
          const allDone = slots.length > 0 && slots.every((s: any) => s.status === 'completed' || s.status === 'error');
          const hasCompleted = slots.some((s: any) => s.status === 'completed');
          setGenerationState(allDone && hasCompleted ? 'results' : 'input');
        } else {
          setGenerationState(savedData.generationState);
        }
      }
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
  // Safety: auto-transition to results if all slots are done but state is stuck on 'generating'
  // ========================================
  useEffect(() => {
    if (generationState === 'generating' && imageSlots.length > 0) {
      const allDone = imageSlots.every(s => s.status === 'completed' || s.status === 'error');
      if (allDone) {
        const hasCompleted = imageSlots.some(s => s.status === 'completed');
        setGenerationState(hasCompleted ? 'results' : 'input');
      }
    }
  }, [generationState, imageSlots]);

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
      setValidationErrors({ prompt: true });
      setTimeout(() => {
        const firstError = document.querySelector('[data-validation-error="true"]');
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
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
            ...(modelCapabilities.supports_negative_prompt && { negativePrompt }),
            width,
            height,
            numInferenceSteps,
            ...(modelCapabilities.supports_img2img && referenceImage && { initImage: referenceImage, strength: img2imgStrength })
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
      notify('Image generation complete!', 'success');

      // Process queued generations
      processQueue();
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to generate images');
      setGenerationState('input');
      notify('Image generation failed', 'error');
    }
  };

  const resetToInput = () => {
    setGenerationState('input');
    setSelectedImage(null);
    setError(null);
    setImageSlots([]);
  };

  // ========================================
  // Queue: Add to Queue & Process
  // ========================================
  const handleAddToQueue = () => {
    if (!queuePrompt.trim()) return;

    const newItem: QueuedGeneration = {
      id: `q-${Date.now()}`,
      prompt: queuePrompt,
      style: queueStyle,
      numImages: queueNumImages,
      referenceImage: queueReferenceImage,
      img2imgStrength: queueImg2imgStrength,
      status: 'waiting',
      results: [],
    };

    setGenerationQueue(prev => [...prev, newItem]);
    notify(`Added to queue: "${queuePrompt.slice(0, 40)}..."`, 'info');

    // Reset popup fields
    setQueuePrompt('');
    setQueueReferenceImage(null);
    setShowQueuePopup(false);

    // If nothing is currently generating, start processing
    if (generationState !== 'generating') {
      setTimeout(() => processQueue(), 100);
    }
  };

  const processQueue = async () => {
    if (isProcessingQueueRef.current) return;

    setGenerationQueue(prev => {
      const next = prev.find(q => q.status === 'waiting');
      if (!next) return prev;
      return prev; // Just check if there's work — actual processing below
    });

    // Get the first waiting item
    const waitingItem = generationQueue.find(q => q.status === 'waiting');
    if (!waitingItem) return;

    isProcessingQueueRef.current = true;

    // Mark as generating
    setGenerationQueue(prev => prev.map(q =>
      q.id === waitingItem.id ? { ...q, status: 'generating' } : q
    ));

    const styledPrompt = buildStyledPrompt(waitingItem.prompt, waitingItem.style);
    const profile = styleProfiles[waitingItem.style];
    const negPrompt = profile?.negative_prompt || negativePrompt;
    const w = profile?.sdxl_settings?.width || 512;
    const h = profile?.sdxl_settings?.height || 512;
    const steps = profile?.sdxl_settings?.num_inference_steps || numInferenceSteps;

    const results: Array<{ imageData: string | null; seed: number | null; status: string }> = [];

    for (let i = 0; i < waitingItem.numImages; i++) {
      try {
        const response = await imageApi.generateImageBase64({
          prompt: styledPrompt,
          ...(modelCapabilities.supports_negative_prompt && { negativePrompt: negPrompt }),
          width: w,
          height: h,
          numInferenceSteps: steps,
          ...(modelCapabilities.supports_img2img && waitingItem.referenceImage && {
            initImage: waitingItem.referenceImage,
            strength: waitingItem.img2imgStrength,
          }),
        });

        if (response.success && response.imageData) {
          results.push({ imageData: response.imageData, seed: Math.floor(Math.random() * 1000000), status: 'completed' });
        } else {
          results.push({ imageData: null, seed: null, status: 'error' });
        }
      } catch {
        results.push({ imageData: null, seed: null, status: 'error' });
      }
    }

    // Mark as completed with results
    setGenerationQueue(prev => prev.map(q =>
      q.id === waitingItem.id ? { ...q, status: 'completed', results } : q
    ));

    const completedCount = results.filter(r => r.status === 'completed').length;
    notify(`Queue item done: ${completedCount}/${waitingItem.numImages} images generated`, 'success');

    isProcessingQueueRef.current = false;

    // Process next in queue
    setTimeout(() => processQueue(), 300);
  };

  // Auto-process queue when generationState changes away from generating
  useEffect(() => {
    if (generationState === 'results' && generationQueue.some(q => q.status === 'waiting')) {
      processQueue();
    }
  }, [generationState]);

  // ========================================
  // COMIC: Generate Comic Page
  // ========================================
  const handleComicGenerate = async () => {
    if (!comicDescription.trim()) {
      setComicError('Please enter a story description');
      return;
    }

    const templateCfg = comicTemplateConfig[comicTemplate];
    const numPanels = templateCfg.panels;

    setComicState('generating-prompts');
    setComicError(null);
    setComicFinalImage(null);

    // Initialize panels
    const initialPanels: ComicPanelSlot[] = Array.from({ length: numPanels }, () => ({
      imageData: null,
      prompt: '',
      status: 'idle',
    }));
    setComicPanels(initialPanels);

    try {
      // Step 1: Get scene prompts from LLM
      const promptResponse = await axios.post('http://localhost:8000/api/generate-comic-prompts', {
        description: comicDescription,
        numPanels,
      });

      if (!promptResponse.data.success) {
        throw new Error(promptResponse.data.error || 'Failed to generate scene prompts');
      }

      const scenePrompts: string[] = promptResponse.data.prompts;

      // Update panels with prompts
      const panelsWithPrompts = scenePrompts.map((p: string) => ({
        imageData: null,
        prompt: p,
        status: 'idle' as const,
      }));
      setComicPanels(panelsWithPrompts);
      setComicState('generating-images');

      // Step 2: Generate images one at a time (queued)
      // Use low strength to keep the reference image's style/characters closely
      for (let i = 0; i < panelsWithPrompts.length; i++) {
        // Mark current panel as generating
        setComicPanels(prev => {
          const next = [...prev];
          next[i] = { ...next[i], status: 'generating' };
          return next;
        });

        try {
          const response = await imageApi.generateImageBase64({
            prompt: panelsWithPrompts[i].prompt,
            ...(modelCapabilities.supports_negative_prompt && { negativePrompt }),
            width: 512,
            height: 512,
            numInferenceSteps,
            ...(modelCapabilities.supports_img2img && history.current && { initImage: history.current, strength: 0.35 }),
          });

          if (response.success && response.imageData) {
            setComicPanels(prev => {
              const next = [...prev];
              next[i] = { ...next[i], imageData: response.imageData, status: 'completed' };
              return next;
            });
          } else {
            setComicPanels(prev => {
              const next = [...prev];
              next[i] = { ...next[i], status: 'error' };
              return next;
            });
          }
        } catch (genError) {
          console.error(`Error generating comic panel ${i + 1}:`, genError);
          setComicPanels(prev => {
            const next = [...prev];
            next[i] = { ...next[i], status: 'error' };
            return next;
          });
        }
      }

      setComicState('done');
      notify('Comic page generation complete!', 'success');
    } catch (err: any) {
      console.error('Comic generation error:', err);
      setComicError(err.response?.data?.error || err.message || 'Failed to generate comic');
      notify('Comic page generation failed', 'error');
      setComicState('input');
    }
  };

  // Stitch comic panels into a single image using canvas
  const stitchComicPage = (panels: ComicPanelSlot[], template: ComicTemplate): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const gap = 12;
      const border = 24;
      const panelSize = 512;

      let canvasW: number, canvasH: number;
      interface PanelRect { x: number; y: number; w: number; h: number }
      let rects: PanelRect[] = [];

      if (template === 'grid-2x2') {
        canvasW = border * 2 + panelSize * 2 + gap;
        canvasH = border * 2 + panelSize * 2 + gap;
        rects = [
          { x: border, y: border, w: panelSize, h: panelSize },
          { x: border + panelSize + gap, y: border, w: panelSize, h: panelSize },
          { x: border, y: border + panelSize + gap, w: panelSize, h: panelSize },
          { x: border + panelSize + gap, y: border + panelSize + gap, w: panelSize, h: panelSize },
        ];
      } else if (template === 'strip-3') {
        canvasW = border * 2 + panelSize * 3 + gap * 2;
        canvasH = border * 2 + panelSize;
        rects = [
          { x: border, y: border, w: panelSize, h: panelSize },
          { x: border + panelSize + gap, y: border, w: panelSize, h: panelSize },
          { x: border + (panelSize + gap) * 2, y: border, w: panelSize, h: panelSize },
        ];
      } else if (template === 'hero-3') {
        const heroW = panelSize * 2 + gap;
        const heroH = panelSize;
        const smallW = Math.floor((heroW - gap * 2) / 3);
        canvasW = border * 2 + heroW;
        canvasH = border * 2 + heroH + gap + smallW;
        rects = [
          { x: border, y: border, w: heroW, h: heroH },
          { x: border, y: border + heroH + gap, w: smallW, h: smallW },
          { x: border + smallW + gap, y: border + heroH + gap, w: smallW, h: smallW },
          { x: border + (smallW + gap) * 2, y: border + heroH + gap, w: smallW, h: smallW },
        ];
      } else {
        // asymmetric-4: tall left + 3 stacked right
        const tallW = Math.floor(panelSize * 1.2);
        const tallH = panelSize * 2 + gap;
        const smallW = panelSize;
        const smallH = Math.floor((tallH - gap * 2) / 3);
        canvasW = border * 2 + tallW + gap + smallW;
        canvasH = border * 2 + tallH;
        rects = [
          { x: border, y: border, w: tallW, h: tallH },
          { x: border + tallW + gap, y: border, w: smallW, h: smallH },
          { x: border + tallW + gap, y: border + smallH + gap, w: smallW, h: smallH },
          { x: border + tallW + gap, y: border + (smallH + gap) * 2, w: smallW, h: smallH },
        ];
      }

      canvas.width = canvasW;
      canvas.height = canvasH;

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvasW, canvasH);

      // Draw borders for all panels first
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 3;
      rects.forEach(r => {
        ctx.strokeRect(r.x, r.y, r.w, r.h);
      });

      // Load and draw each panel image
      let loaded = 0;
      const total = panels.filter(p => p.imageData).length;

      if (total === 0) {
        resolve(canvas.toDataURL('image/png'));
        return;
      }

      panels.forEach((panel, i) => {
        if (!panel.imageData || !rects[i]) return;
        const img = new Image();
        img.onload = () => {
          const r = rects[i];
          ctx.save();
          ctx.beginPath();
          ctx.rect(r.x, r.y, r.w, r.h);
          ctx.clip();
          // Cover-fit the image
          const scale = Math.max(r.w / img.width, r.h / img.height);
          const drawW = img.width * scale;
          const drawH = img.height * scale;
          const drawX = r.x + (r.w - drawW) / 2;
          const drawY = r.y + (r.h - drawH) / 2;
          ctx.drawImage(img, drawX, drawY, drawW, drawH);
          ctx.restore();
          // Redraw border on top
          ctx.strokeStyle = '#1a1a1a';
          ctx.lineWidth = 3;
          ctx.strokeRect(r.x, r.y, r.w, r.h);

          loaded++;
          if (loaded === total) {
            resolve(canvas.toDataURL('image/png'));
          }
        };
        img.src = panel.imageData;
      });
    });
  };

  const handleDownloadComic = async () => {
    if (comicPanels.some(p => p.imageData)) {
      const stitched = await stitchComicPage(comicPanels, comicTemplate);
      downloadImage(stitched, `comic-page-${Date.now()}.png`);
    }
  };

  const handleSaveComic = async () => {
    if (!comicPanels.some(p => p.imageData)) return;
    try {
      const stitched = await stitchComicPage(comicPanels, comicTemplate);
      const imageId = `img-${Date.now()}`;
      const imageRecord = {
        id: imageId,
        title: `Comic Page — ${comicDescription.slice(0, 50)}`,
        prompt: comicDescription,
        timestamp: new Date().toISOString(),
        type: 'images',
        imageUrl: stitched,
        formData: { type: 'comic', comicDescription, comicTemplate },
      };
      await fetch('http://localhost:8000/api/images-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(imageRecord),
      });
      triggerCheck();
      alert('Comic page saved to Resource Manager!');
    } catch (error) {
      console.error('Error saving comic:', error);
      alert('Failed to save comic page');
    }
  };

  const resetComic = () => {
    setComicState('input');
    setComicPanels([]);
    setComicError(null);
    setComicFinalImage(null);
  };

  // Build a descriptive filename from the prompt
  const buildImageFilename = (prefix: string, ext: string = 'png') => {
    const slug = prompt
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 6)
      .join('-');
    const ts = new Date().toISOString().slice(0, 10);
    return slug ? `${prefix}-${slug}-${ts}.${ext}` : `${prefix}-${ts}-${Date.now()}.${ext}`;
  };

  const buildImageTitle = (prefix: string) => {
    const short = prompt.length > 60 ? prompt.slice(0, 57) + '...' : prompt;
    return short ? `${prefix} — ${short}` : `${prefix} — ${new Date().toLocaleString()}`;
  };

  const handleDownloadGenerated = (imageData: string) => {
    downloadImage(imageData, buildImageFilename('generated'));
  };

  const handleSaveGenerated = async (imageData: string) => {
    try {
      const imageId = `img-${Date.now()}`;
      const imageRecord = {
        id: imageId,
        title: buildImageTitle('Generated'),
        prompt,
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
        triggerCheck();
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

  const openResourcePicker = async () => {
    setShowResourcePicker(true);
    setLoadingResources(true);
    try {
      const response = await axios.get('http://localhost:8000/api/images-history');
      setResourceImages(response.data || []);
    } catch (error) {
      console.error('Failed to load resource images:', error);
      setResourceImages([]);
    } finally {
      setLoadingResources(false);
    }
  };

  const loadResourceImage = (image: SavedImageRecord) => {
    if (!image.imageUrl) return;
    setUploadedImage(image.imageUrl);
    setIsNewUpload(false);
    setSavedImageId(image.id);
    setHistory({
      original: image.imageUrl,
      current: image.imageUrl,
      undoStack: [],
      redoStack: []
    });
    setShowResourcePicker(false);
    setTimeout(() => {
      drawImageOnCanvas(image.imageUrl!);
      clearMaskCanvas();
    }, 100);
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
      downloadImage(history.current, buildImageFilename('edited'));
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
        triggerCheck();
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
        body: JSON.stringify({ image: history.current, strength: bgRemovalStrength }),
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

    // Step 1: Convert to grayscale
    const gray = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) {
      gray[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2];
    }

    // Step 2: Gaussian blur to remove noise/texture (radius scales with detail)
    // Lower detail = more blur = fewer lines; higher detail = less blur = more lines
    const blurRadius = Math.max(1, Math.round(4 - (coloringDetail / 100) * 3)); // 4 at 0%, 1 at 100%
    const blurred = new Float32Array(w * h);

    // Build 1D Gaussian kernel
    const kernelSize = blurRadius * 2 + 1;
    const kernel = new Float32Array(kernelSize);
    const sigma = blurRadius / 2;
    let kernelSum = 0;
    for (let i = 0; i < kernelSize; i++) {
      const x = i - blurRadius;
      kernel[i] = Math.exp(-(x * x) / (2 * sigma * sigma));
      kernelSum += kernel[i];
    }
    for (let i = 0; i < kernelSize; i++) kernel[i] /= kernelSum;

    // Horizontal pass
    const temp = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let sum = 0;
        for (let k = -blurRadius; k <= blurRadius; k++) {
          const sx = Math.min(w - 1, Math.max(0, x + k));
          sum += gray[y * w + sx] * kernel[k + blurRadius];
        }
        temp[y * w + x] = sum;
      }
    }
    // Vertical pass
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let sum = 0;
        for (let k = -blurRadius; k <= blurRadius; k++) {
          const sy = Math.min(h - 1, Math.max(0, y + k));
          sum += temp[sy * w + x] * kernel[k + blurRadius];
        }
        blurred[y * w + x] = sum;
      }
    }

    // Step 3: Sobel edge detection on blurred image
    const edgeMag = new Float32Array(w * h);
    let maxEdge = 0;
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        const gx = -blurred[(y - 1) * w + (x - 1)] - 2 * blurred[y * w + (x - 1)] - blurred[(y + 1) * w + (x - 1)]
                  + blurred[(y - 1) * w + (x + 1)] + 2 * blurred[y * w + (x + 1)] + blurred[(y + 1) * w + (x + 1)];
        const gy = -blurred[(y - 1) * w + (x - 1)] - 2 * blurred[(y - 1) * w + x] - blurred[(y - 1) * w + (x + 1)]
                  + blurred[(y + 1) * w + (x - 1)] + 2 * blurred[(y + 1) * w + x] + blurred[(y + 1) * w + (x + 1)];
        const mag = Math.sqrt(gx * gx + gy * gy);
        edgeMag[idx] = mag;
        if (mag > maxEdge) maxEdge = mag;
      }
    }

    // Step 4: Adaptive threshold based on detail level
    // Normalize edges, then threshold
    const threshold = 0.08 + (1 - coloringDetail / 100) * 0.15; // 0.08 at 100% detail, 0.23 at 0%
    const edges = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) {
      edges[i] = (maxEdge > 0 && edgeMag[i] / maxEdge > threshold) ? 1 : 0;
    }

    // Step 5: Remove isolated noise pixels (if a black pixel has fewer than 2 black neighbors, remove it)
    const cleaned = new Uint8Array(w * h);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = y * w + x;
        if (!edges[idx]) continue;
        let neighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            if (dy === 0 && dx === 0) continue;
            if (edges[(y + dy) * w + (x + dx)]) neighbors++;
          }
        }
        cleaned[idx] = neighbors >= 2 ? 1 : 0;
      }
    }

    // Step 6: Thicken lines slightly for a more printable coloring page
    const final = new Uint8Array(w * h);
    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        if (cleaned[y * w + x]) {
          // Set this pixel and immediate neighbors for thicker lines
          final[y * w + x] = 1;
          final[y * w + (x + 1)] = 1;
          final[(y + 1) * w + x] = 1;
        }
      }
    }

    // Step 7: Write result — black lines on white background
    for (let i = 0; i < w * h; i++) {
      const c = final[i] ? 0 : 255;
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
  // Comic Panel Card Component
  // ========================================
  const ComicPanelCard = ({ panel, index, isHero }: { panel?: ComicPanelSlot; index: number; isHero?: boolean }) => {
    if (!panel) {
      return (
        <div className={`border-2 border-dashed border-theme rounded-lg flex items-center justify-center bg-theme-tertiary ${isHero ? 'h-[350px]' : 'h-[280px]'}`}>
          <p className="text-sm text-gray-400">Panel {index + 1}</p>
        </div>
      );
    }

    return (
      <div className={`border-2 border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-900 ${isHero ? 'h-[350px]' : 'h-[280px]'} relative`}>
        {panel.status === 'completed' && panel.imageData ? (
          <>
            <img loading="lazy"
              src={panel.imageData}
              alt={`Panel ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {panel.prompt && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                <p className="text-white text-[10px] leading-tight line-clamp-2">{panel.prompt}</p>
              </div>
            )}
          </>
        ) : panel.status === 'generating' ? (
          <div className="flex flex-col items-center justify-center h-full bg-theme-tertiary">
            <HeartbeatLoader className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-sm text-theme-hint">Generating Panel {index + 1}...</p>
            {panel.prompt && (
              <p className="text-[10px] text-theme-hint mt-2 px-4 text-center line-clamp-2">{panel.prompt}</p>
            )}
          </div>
        ) : panel.status === 'error' ? (
          <div className="flex flex-col items-center justify-center h-full bg-red-50 dark:bg-red-900/20">
            <p className="text-sm text-red-500">Panel {index + 1} failed</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full bg-theme-tertiary">
            <p className="text-sm text-gray-400">Panel {index + 1}</p>
            {panel.prompt && (
              <p className="text-[10px] text-theme-hint mt-2 px-4 text-center line-clamp-2">{panel.prompt}</p>
            )}
          </div>
        )}
      </div>
    );
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
             onClick={() => { if (hasDiffusion) setActiveTab('generator'); }}
             disabled={!hasDiffusion}
             title={!hasDiffusion ? 'Requires a diffusion model' : undefined}
             className={`relative z-10 flex items-center justify-center px-4 py-2 rounded-md transition-colors duration-300 ${
               activeTab === 'generator' ? 'text-white' : 'text-theme-label hover:text-theme-title'
             } ${!hasDiffusion ? 'opacity-40 cursor-not-allowed' : ''}`}
           >
            <Palette className="w-4 h-4 mr-2" />
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

      {/* Tab Content — Card Flip */}
      <div className="flex-1 overflow-hidden image-studio-flip-container">
        <div className={`image-studio-flip-inner ${activeTab === 'editor' ? 'flipped' : ''}`}>
        {/* ========================================
            GENERATOR TAB (Front Face)
        ======================================== */}
          <div className="image-studio-flip-front h-full p-6 overflow-y-auto" data-tutorial="image-studio-generator-panel">
            {generationState === 'input' && (
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6" data-tutorial="image-studio-generator-title">Image Generator</h2>
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
                    <SmartTextArea
                      value={prompt}
                      onChange={(val) => {
                        setPrompt(val);
                        if (validationErrors.prompt) setValidationErrors({});
                      }}
                      data-validation-error={validationErrors.prompt ? 'true' : undefined}
                      className={`w-full p-3 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.prompt ? 'validation-error' : ''}`}
                      rows={4}
                      placeholder="E.g., A flowering plant showing roots, stem, leaves, and flower petals"
                    />
                  </div>

                  {/* Image-to-Image Reference (only for models that support img2img) */}
                  {modelCapabilities.supports_img2img && (
                  <div className="border border-theme rounded-lg p-4">
                    <label className="block text-sm font-medium text-theme-label mb-2">
                      Reference Image <span className="text-xs text-theme-hint">(optional - for image-to-image editing)</span>
                    </label>
                    {referenceImage ? (
                      <div className="relative">
                        <img loading="lazy"
                          src={referenceImage}
                          alt="Reference"
                          className="w-full max-h-48 object-contain rounded-lg border border-theme"
                        />
                        <button
                          onClick={() => setReferenceImage(null)}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                          title="Remove reference image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-xs font-medium text-theme-label">
                              Transformation Strength: {Math.round(img2imgStrength * 100)}%
                            </label>
                          </div>
                          <input
                            type="range"
                            min="0.1"
                            max="1.0"
                            step="0.05"
                            value={img2imgStrength}
                            onChange={(e) => setImg2imgStrength(parseFloat(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                          />
                          <div className="flex justify-between text-[10px] text-theme-hint mt-1">
                            <span>Keep original</span>
                            <span>Fully transform</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-theme rounded-lg cursor-pointer hover:bg-theme-subtle transition">
                        <Upload className="w-6 h-6 text-theme-hint mb-1" />
                        <span className="text-xs text-theme-hint">Upload an image to edit with your prompt</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setReferenceImage(ev.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                            e.target.value = '';
                          }}
                        />
                      </label>
                    )}
                  </div>
                  )}

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
                    disabled={loadingStyles}
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
                        <Palette className="w-5 h-5 mr-2" />
                        {referenceImage ? 'Edit Image' : 'Generate Image'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {generationState === 'generating' && (
              <div className="max-w-5xl mx-auto" data-tutorial="image-studio-results">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Generating Images...</h2>
                  <button
                    onClick={() => setShowQueuePopup(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                  >
                    <Layers className="w-4 h-4 mr-1" />
                    Add to Queue
                  </button>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {imageSlots.map((slot, i) => (
                    <div key={i} className="border border-theme-strong rounded-lg p-4 bg-theme-secondary">
                      <div className="relative">
                        {slot.status === 'completed' && slot.imageData ? (
                          <>
                            <img loading="lazy"
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
                              <button
                                onClick={() => {
                                  setReferenceImage(slot.imageData!);
                                  setGenerationState('input');
                                }}
                                className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center text-sm"
                                title="Use this image as a reference and edit it with a new prompt"
                              >
                                <Pencil className="w-4 h-4 mr-1" />
                                Edit
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowQueuePopup(true)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                    >
                      <Layers className="w-4 h-4 mr-1" />
                      Add to Queue
                    </button>
                    <button
                      onClick={resetToInput}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      Generate Another
                    </button>
                  </div>
                </div>

                {/* Queued items indicator */}
                {generationQueue.length > 0 && (
                  <div className="mb-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
                        Queue: {generationQueue.filter(q => q.status === 'completed').length}/{generationQueue.length} completed
                      </span>
                      {generationQueue.some(q => q.status === 'generating') && (
                        <span className="flex items-center text-xs text-indigo-600 dark:text-indigo-400">
                          <HeartbeatLoader className="w-3 h-3 mr-1" /> Processing...
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1 mt-2">
                      {generationQueue.map(q => (
                        <div key={q.id} className={`h-1.5 flex-1 rounded-full ${
                          q.status === 'completed' ? 'bg-green-500' :
                          q.status === 'generating' ? 'bg-indigo-500 animate-pulse' :
                          q.status === 'error' ? 'bg-red-500' :
                          'bg-gray-300 dark:bg-gray-600'
                        }`} title={`${q.prompt.slice(0, 30)}... — ${q.status}`} />
                      ))}
                    </div>
                    {/* Show completed queue results */}
                    {generationQueue.some(q => q.status === 'completed' && q.results.length > 0) && (
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {generationQueue.filter(q => q.status === 'completed').flatMap(q =>
                          q.results.filter(r => r.imageData).map((r, i) => (
                            <img loading="lazy" key={`${q.id}-${i}`} src={r.imageData!} alt="Queued result"
                              className="w-full aspect-square object-cover rounded-md border border-theme cursor-pointer hover:ring-2 hover:ring-indigo-500"
                              onClick={() => { setSelectedImage(r.imageData); setShowImageModal(true); }}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {imageSlots.map((slot, i) => (
                    <div key={i} className="border border-theme-strong rounded-lg p-4 bg-theme-secondary">
                      <div className="relative">
                        {slot.status === 'completed' && slot.imageData ? (
                          <>
                            <img loading="lazy"
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
                              <button
                                onClick={() => {
                                  setReferenceImage(slot.imageData!);
                                  setGenerationState('input');
                                }}
                                className="flex-1 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center text-sm"
                                title="Use this image as a reference and edit it with a new prompt"
                              >
                                <Pencil className="w-4 h-4 mr-1" />
                                Edit
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

        {/* ========================================
            EDITOR TAB (Back Face)
        ======================================== */}
          <div className="image-studio-flip-back h-full">
            <div className="h-full flex" data-tutorial="image-studio-editor-panel">
              {/* Main Canvas Area */}
              <div className="flex-1 p-6 overflow-y-auto">
                {!uploadedImage ? (
                  <div className="h-full flex items-center justify-center" data-tutorial="image-studio-upload">
                    <div className="text-center">
                      <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <h2 className="text-xl font-semibold mb-2">Upload an Image</h2>
                      <p className="text-sm text-theme-hint mb-4">Start by uploading an image or pick one from your resources</p>
                      <div className="flex gap-3 justify-center">
                        <label className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          <Upload className="w-4 h-4 mr-2" />Choose File
                        </label>
                        <button onClick={openResourcePicker}
                          className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                          <FolderOpen className="w-4 h-4 mr-2" />My Resources
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setUploadedImage(null); setHistory({ original: '', current: '', undoStack: [], redoStack: [] }); setShowBeforeAfter(false); }}
                          className="p-1.5 rounded-lg hover:bg-theme-hover text-theme-secondary" title="Back">
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl font-semibold">Image Editor</h2>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                          className="px-3 py-1.5 border border-theme-strong rounded-lg hover:bg-theme-subtle flex items-center text-sm">
                          {showBeforeAfter ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                          {showBeforeAfter ? 'Hide Original' : 'Show Original'}
                        </button>
                        <button onClick={openResourcePicker}
                          className="px-3 py-1.5 border border-theme-strong rounded-lg hover:bg-theme-subtle flex items-center text-sm">
                          <FolderOpen className="w-4 h-4 mr-1" />My Resources
                        </button>
                        <label className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center text-sm">
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                          <Upload className="w-4 h-4 mr-1" />New Image
                        </label>
                      </div>
                    </div>

                    {/* Comic Panel Grid (shown when comic-maker is active and has panels) */}
                    {editorTool === 'comic-maker' && comicPanels.length > 0 && (
                      <div className="border border-theme-strong rounded-lg overflow-hidden bg-theme-tertiary p-4">
                        {comicState === 'generating-prompts' && (
                          <div className="flex items-center justify-center py-12">
                            <HeartbeatLoader className="w-8 h-8 text-blue-600 mr-3" />
                            <span className="text-theme-hint">Writing scene prompts...</span>
                          </div>
                        )}
                        {(comicState === 'generating-images' || comicState === 'done') && (
                          <div className={`grid gap-3 ${
                            comicTemplate === 'strip-3' ? 'grid-cols-3' :
                            comicTemplate === 'grid-2x2' ? 'grid-cols-2' :
                            comicTemplate === 'hero-3' ? 'grid-cols-1' :
                            'grid-cols-2'
                          }`}>
                            {comicTemplate === 'hero-3' ? (
                              <>
                                <div className="col-span-1">
                                  <ComicPanelCard panel={comicPanels[0]} index={0} isHero />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                  {comicPanels.slice(1).map((panel, i) => (
                                    <ComicPanelCard key={i + 1} panel={panel} index={i + 1} />
                                  ))}
                                </div>
                              </>
                            ) : (
                              comicPanels.map((panel, i) => (
                                <ComicPanelCard key={i} panel={panel} index={i} />
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Regular Canvas (hidden when comic panel grid is visible) */}
                    <div className={`relative flex items-center justify-center border border-theme-strong rounded-lg overflow-hidden bg-theme-tertiary ${editorTool === 'comic-maker' && comicPanels.length > 0 ? 'hidden' : ''}`} data-tutorial="image-studio-canvas">
                      {showBeforeAfter && (
                        <img loading="lazy" src={history.original} alt="Original"
                          className="absolute top-0 left-0 w-full h-full object-contain"
                          style={{ pointerEvents: 'none', zIndex: 1 }} />
                      )}
                      <div className="relative transition-opacity duration-500 ease-in-out"
                        style={{ opacity: showBeforeAfter ? 0 : 1, zIndex: 2 }}>
                        <canvas ref={imageCanvasRef} className="max-w-full h-auto" style={{ display: 'block', margin: '0 auto' }} />
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
                    {editorTool === 'comic-maker' && comicState === 'input' && (
                      <div className="flex gap-2">
                        <button onClick={handleComicGenerate}
                          disabled={!comicDescription.trim() || comicState !== 'input'}
                          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                          <BookOpen className="w-4 h-4 mr-2" />Generate Comic Page
                        </button>
                      </div>
                    )}
                    {editorTool === 'comic-maker' && comicState !== 'input' && (
                      <div className="flex gap-2">
                        {comicState === 'done' && (
                          <>
                            <button onClick={handleDownloadComic}
                              className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center text-sm">
                              <Download className="w-4 h-4 mr-1" />Download
                            </button>
                            <button onClick={handleSaveComic}
                              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-sm">
                              <Save className="w-4 h-4 mr-1" />Save
                            </button>
                          </>
                        )}
                        <button onClick={resetComic}
                          className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center justify-center text-sm">
                          New
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
                  <div className="grid grid-cols-6 gap-1 mb-1 p-1 bg-theme-tertiary rounded-lg">
                    {([
                      { id: 'remove-object' as EditorTool, icon: Eraser, label: 'Object Remover', needsDiffusion: false, needsLama: true },
                      { id: 'remove-background' as EditorTool, icon: ImageOff, label: 'Background Remover', needsDiffusion: false, needsLama: false },
                      { id: 'annotate' as EditorTool, icon: Pencil, label: 'Annotate', needsDiffusion: false, needsLama: false },
                      { id: 'coloring-page' as EditorTool, icon: Palette, label: 'Coloring Page', needsDiffusion: false, needsLama: false },
                      { id: 'worksheet' as EditorTool, icon: FileText, label: 'Worksheet Maker', needsDiffusion: false, needsLama: false },
                      { id: 'comic-maker' as EditorTool, icon: BookOpen, label: 'Comic Maker', needsDiffusion: true, needsLama: false },
                    ]).map(({ id, icon: Icon, label, needsDiffusion, needsLama }) => {
                      const toolLocked = (needsDiffusion && !hasDiffusion) || (needsLama && !hasLama);
                      return (
                        <button key={id} onClick={() => { if (!toolLocked) setEditorTool(id); }}
                          title={toolLocked ? `${label} requires ${needsLama && !hasLama ? 'the LaMa model (big-lama.pt)' : 'a diffusion model'}` : label}
                          disabled={toolLocked}
                          className={`p-2 rounded-md flex items-center justify-center transition ${
                            editorTool === id ? 'bg-blue-600 text-white shadow' : 'text-theme-label hover:bg-theme-hover'
                          } ${toolLocked ? 'opacity-30 cursor-not-allowed' : ''}`}>
                          <Icon className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-theme-hint text-center mb-4">
                    {editorTool === 'remove-object' && 'Object Remover'}
                    {editorTool === 'remove-background' && 'Background Remover'}
                    {editorTool === 'annotate' && 'Annotation Tool'}
                    {editorTool === 'coloring-page' && 'Coloring Page Generator'}
                    {editorTool === 'worksheet' && 'Worksheet Maker'}
                    {editorTool === 'comic-maker' && 'Comic Page Maker'}
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
                        <div>
                          <label className="block text-sm font-medium text-theme-label mb-1">Strength: {bgRemovalStrength}%</label>
                          <input type="range" min={10} max={100} step={5} value={bgRemovalStrength}
                            onChange={e => setBgRemovalStrength(Number(e.target.value))}
                            className="w-full accent-purple-600" />
                          <div className="flex justify-between text-xs text-theme-label-secondary mt-0.5">
                            <span>Subtle</span><span>Full</span>
                          </div>
                        </div>
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
                          <p className="text-xs text-purple-800 dark:text-purple-400">Adjust the strength slider, then click "Remove Background" below the canvas. Lower strength keeps more of the semi-transparent edges.</p>
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
                        <div>
                          <label className="text-xs font-medium block mb-1">Detail Level: {coloringDetail}%</label>
                          <input type="range" min="0" max="100" value={coloringDetail}
                            onChange={e => setColoringDetail(Number(e.target.value))}
                            className="w-full accent-orange-500" />
                          <div className="flex justify-between text-[10px] text-theme-secondary mt-0.5">
                            <span>Simple</span><span>Detailed</span>
                          </div>
                        </div>
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
                          <p className="text-xs text-orange-800 dark:text-orange-400">Adjust the detail slider, then click "Convert to Coloring Page". Use Undo to revert and try different detail levels.</p>
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

                    {/* Comic Maker */}
                    {editorTool === 'comic-maker' && (
                      <>
                        {/* Template Selector */}
                        <div>
                          <label className="block text-xs font-medium text-theme-label mb-2">Page Template</label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {([
                              { id: 'grid-2x2' as ComicTemplate, label: '2x2 Grid',
                                svg: (<svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                                  <rect x="2" y="2" width="16" height="16" rx="1" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
                                  <rect x="22" y="2" width="16" height="16" rx="1" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
                                  <rect x="2" y="22" width="16" height="16" rx="1" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
                                  <rect x="22" y="22" width="16" height="16" rx="1" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
                                </svg>)
                              },
                              { id: 'strip-3' as ComicTemplate, label: '3 Strip',
                                svg: (<svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                                  <rect x="1" y="6" width="11" height="28" rx="1" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
                                  <rect x="14.5" y="6" width="11" height="28" rx="1" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
                                  <rect x="28" y="6" width="11" height="28" rx="1" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
                                </svg>)
                              },
                              { id: 'hero-3' as ComicTemplate, label: 'Hero+3',
                                svg: (<svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                                  <rect x="2" y="2" width="36" height="20" rx="1" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
                                  <rect x="2" y="26" width="10" height="12" rx="1" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
                                  <rect x="15" y="26" width="10" height="12" rx="1" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
                                  <rect x="28" y="26" width="10" height="12" rx="1" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
                                </svg>)
                              },
                              { id: 'asymmetric-4' as ComicTemplate, label: 'Asymmetric',
                                svg: (<svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
                                  <rect x="2" y="2" width="18" height="36" rx="1" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
                                  <rect x="24" y="2" width="14" height="10" rx="1" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
                                  <rect x="24" y="15" width="14" height="10" rx="1" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
                                  <rect x="24" y="28" width="14" height="10" rx="1" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1.5"/>
                                </svg>)
                              },
                            ]).map((tpl) => (
                              <button key={tpl.id} onClick={() => setComicTemplate(tpl.id)}
                                className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all text-center
                                  ${comicTemplate === tpl.id
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                                    : 'border-theme hover:border-blue-300'
                                  }`}>
                                {tpl.svg}
                                <span className="text-[10px] font-medium">{tpl.label}</span>
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-theme-hint mt-1">
                            {comicTemplateConfig[comicTemplate].panels} panels
                          </p>
                        </div>

                        {/* Story Description */}
                        <div>
                          <label className="block text-xs font-medium text-theme-label mb-1">
                            Story Description
                          </label>
                          <SmartTextArea
                            value={comicDescription}
                            onChange={(val) => setComicDescription(val)}
                            className="w-full p-2 border border-theme-strong rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder="A cat discovers a hidden garden, explores the flowers, and befriends a butterfly..."
                          />
                        </div>

                        {/* Status when generating */}
                        {comicState === 'generating-prompts' && (
                          <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <div className="flex items-center gap-2">
                              <HeartbeatLoader className="w-4 h-4 text-blue-600" />
                              <span className="text-xs text-blue-700 dark:text-blue-300">Writing scene prompts...</span>
                            </div>
                          </div>
                        )}
                        {comicState === 'generating-images' && (
                          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                            <div className="flex items-center gap-2">
                              <HeartbeatLoader className="w-4 h-4 text-indigo-600" />
                              <span className="text-xs text-indigo-700 dark:text-indigo-300">
                                Panel {comicPanels.filter(p => p.status === 'completed').length + 1} of {comicPanels.length}
                              </span>
                            </div>
                          </div>
                        )}
                        {comicState === 'done' && (
                          <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                            <span className="text-xs text-green-700 dark:text-green-300 font-medium">Comic page ready!</span>
                          </div>
                        )}

                        {comicError && (
                          <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <span className="text-xs text-red-700 dark:text-red-300">{comicError}</span>
                          </div>
                        )}

                        <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
                          <h4 className="text-xs font-semibold text-indigo-900 dark:text-indigo-300 mb-1">How to Use:</h4>
                          <ol className="text-xs text-indigo-800 dark:text-indigo-400 space-y-1 list-decimal list-inside">
                            <li>Choose a template layout</li>
                            <li>Describe your story</li>
                            <li>Click "Generate Comic Page"</li>
                          </ol>
                          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1.5">
                            The current image is used as a reference — panels will match its style and characters.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Worksheet Modal (outside flip container for proper z-index) */}
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
              <div className="w-72 border-r border-gray-200 dark:border-gray-700 p-5 overflow-y-auto space-y-4 flex-shrink-0">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Worksheet Title</label>
                  <SmartInput value={worksheetTitle} onChange={val => setWorksheetTitle(val)}
                    placeholder="e.g. Parts of a Plant"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm dark:bg-gray-800 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject / Topic</label>
                  <SmartInput value={worksheetSubject} onChange={val => setWorksheetSubject(val)}
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
                  <button onClick={() => downloadImage(worksheetPreview!, buildImageFilename('worksheet'))}
                    className="w-full px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm font-medium">
                    <Download className="w-4 h-4" />
                    Download PNG
                  </button>
                )}
              </div>
              <div className="flex-1 flex items-center justify-center overflow-auto p-6 bg-gray-100 dark:bg-gray-800">
                {worksheetPreview ? (
                  <img loading="lazy" src={worksheetPreview} alt="Worksheet preview"
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

      {/* Resource Picker Modal (outside flip container for proper z-index) */}
      {showResourcePicker && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col widget-glass">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-purple-600" />
                Pick from My Resources
              </h2>
              <button onClick={() => setShowResourcePicker(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {loadingResources ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                </div>
              ) : resourceImages.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <ImageOff className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">No saved images found</p>
                  <p className="text-xs mt-1">Generate or upload images first, then they'll appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {resourceImages.map((img) => (
                    <button key={img.id} onClick={() => loadResourceImage(img)}
                      className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all bg-gray-100 dark:bg-gray-800">
                      <img loading="lazy" src={img.imageUrl} alt={img.title || 'Saved image'}
                        className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end">
                        <div className="w-full p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-xs truncate">{img.title || 'Untitled'}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Queue Another Popup */}
      {showQueuePopup && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setShowQueuePopup(false)}>
          <div className="rounded-2xl w-full max-w-lg widget-glass max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Add to Queue
              </h2>
              <button onClick={() => setShowQueuePopup(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Style Selector */}
              <div>
                <label className="block text-sm font-medium text-theme-label mb-2">Visual Style</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'cartoon_3d', label: '3D Cartoon' },
                    { id: 'line_art_bw', label: 'Line Art' },
                    { id: 'illustrated_painting', label: 'Painting' },
                    { id: 'realistic', label: 'Realistic' },
                  ].map((style) => (
                    <button key={style.id} onClick={() => setQueueStyle(style.id)}
                      className={`py-2 px-2 rounded-lg border text-xs font-semibold transition-all
                        ${queueStyle === style.id
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
                          : 'border-theme hover:border-indigo-300 text-theme-label'
                        }`}>
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prompt */}
              <div>
                <label className="block text-sm font-medium text-theme-label mb-2">
                  Prompt <span className="text-red-500">*</span>
                </label>
                <SmartTextArea
                  value={queuePrompt}
                  onChange={(val) => setQueuePrompt(val)}
                  className="w-full p-3 border border-theme-strong rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe the image you want to generate..."
                  autoFocus
                />
              </div>

              {/* Reference Image (only for models that support img2img) */}
              {modelCapabilities.supports_img2img && (
              <div>
                <label className="block text-sm font-medium text-theme-label mb-2">
                  Reference Image <span className="text-xs text-theme-hint">(optional)</span>
                </label>
                {queueReferenceImage ? (
                  <div className="relative">
                    <img loading="lazy" src={queueReferenceImage} alt="Reference" className="w-full max-h-32 object-contain rounded-lg border border-theme" />
                    <button onClick={() => setQueueReferenceImage(null)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
                      <X className="w-3 h-3" />
                    </button>
                    <div className="mt-2">
                      <label className="text-xs font-medium text-theme-label">
                        Strength: {Math.round(queueImg2imgStrength * 100)}%
                      </label>
                      <input type="range" min="0.1" max="1.0" step="0.05" value={queueImg2imgStrength}
                        onChange={(e) => setQueueImg2imgStrength(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-16 border-2 border-dashed border-theme rounded-lg cursor-pointer hover:bg-theme-subtle transition">
                    <Upload className="w-5 h-5 text-theme-hint mb-1" />
                    <span className="text-xs text-theme-hint">Upload reference</span>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (ev) => setQueueReferenceImage(ev.target?.result as string);
                        reader.readAsDataURL(file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                )}
              </div>
              )}

              {/* Batch Size */}
              <div>
                <label className="block text-sm font-medium text-theme-label mb-2">Number of Images</label>
                <select value={queueNumImages} onChange={(e) => setQueueNumImages(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-indigo-500">
                  <option value={1}>1 Image</option>
                  <option value={2}>2 Images</option>
                  <option value={3}>3 Images</option>
                  <option value={4}>4 Images</option>
                  <option value={5}>5 Images</option>
                </select>
              </div>

              {/* Queue count indicator */}
              {generationQueue.filter(q => q.status === 'waiting').length > 0 && (
                <p className="text-xs text-indigo-600 dark:text-indigo-400">
                  {generationQueue.filter(q => q.status === 'waiting').length} item(s) already waiting in queue
                </p>
              )}

              {/* Add Button */}
              <button
                onClick={handleAddToQueue}
                disabled={!queuePrompt.trim()}
                className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center transition"
              >
                <Layers className="w-5 h-5 mr-2" />
                Add to Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setShowImageModal(false)}>
          <div className="max-w-4xl max-h-[90vh] p-4">
            <img loading="lazy"
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
