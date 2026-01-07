import React, { useState, useEffect, useRef } from 'react';
import { Loader2, Download, Eye, EyeOff, Undo2, Redo2, Eraser, Upload, Sparkles } from 'lucide-react';
import { imageApi, ImageGenerationContext, blobToDataURL, downloadImage } from '../lib/imageApi';

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

const ImageStudio: React.FC<ImageStudioProps> = ({ tabId, savedData, onDataChange }) => {
  const hasRestoredRef = useRef(false);

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
  const [generationState, setGenerationState] = useState<'input' | 'generating' | 'results'>('input');
  const [results, setResults] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  // Canvas refs
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);

  // ========================================
  // Restore saved state
  // ========================================
  useEffect(() => {
    if (savedData && !hasRestoredRef.current) {
      if (savedData.initialTab) setActiveTab(savedData.initialTab);
      if (savedData.prompt) setPrompt(savedData.prompt);
      if (savedData.results) setResults(savedData.results);
      hasRestoredRef.current = true;
    }
  }, [savedData]);
  
  // Save state changes
  useEffect(() => {
    onDataChange({
      initialTab: activeTab,
      prompt,
      results
    });
  }, [activeTab, prompt, results]);

  // ========================================
  // GENERATOR: Generate Image
  // ========================================
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setGenerationState('generating');
    setError(null);

    try {
      const response = await imageApi.generateImageBase64({
        prompt,
        negativePrompt,
        width,
        height,
        numInferenceSteps
      });

      if (response.success && response.imageData) {
        setResults([response.imageData]);
        setGenerationState('results');
      } else {
        throw new Error('Image generation failed');
      }
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to generate image');
      setGenerationState('input');
    }
  };

  const resetToInput = () => {
    setGenerationState('input');
    setSelectedImage(null);
    setError(null);
  };

  const handleDownloadGenerated = (imageData: string) => {
    downloadImage(imageData, `generated-${Date.now()}.png`);
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
      setUploadedImage(dataUrl);
      setHistory({
        original: dataUrl,
        current: dataUrl,
        undoStack: [],
        redoStack: []
      });
      
      // Draw image on canvas
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

    const ctx = canvas.getContext('2d');
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
    if (!isDrawing) return;

    const canvas = maskCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

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
    const maskCtx = maskCanvas.getContext('2d');
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

  // ========================================
  // RENDER
  // ========================================
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Top Right Sliding Toggle */}
      <div className="flex justify-end p-4 border-b border-gray-200">
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
          <div className="h-full p-6 overflow-y-auto">
            {generationState === 'input' && (
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6">AI Image Generator</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prompt <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="E.g., A colorful cartoon illustration of a pizza divided into 8 slices, 3 slices highlighted, educational style, simple shapes"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Negative Prompt <span className="text-gray-500">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={negativePrompt}
                      onChange={(e) => setNegativePrompt(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Things to avoid..."
                    />
                  </div>

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

                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim()}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Image
                  </button>
                </div>
              </div>
            )}

            {generationState === 'generating' && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-blue-600" />
                  <h2 className="text-xl font-semibold mb-2">Generating Image...</h2>
                  <p className="text-sm text-gray-500">This may take 5-15 seconds</p>
                </div>
              </div>
            )}

            {generationState === 'results' && (
              <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Generated Image</h2>
                  <button
                    onClick={resetToInput}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Generate Another
                  </button>
                </div>

                <div className="grid gap-6">
                  {results.map((img, i) => (
                    <div key={i} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <img
                        src={img}
                        alt={`Generated ${i + 1}`}
                        className="w-full max-h-[600px] object-contain rounded-lg mb-4"
                      />
                      <button
                        onClick={() => handleDownloadGenerated(img)}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Image
                      </button>
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
          <div className="h-full flex">
            {/* Main Canvas Area */}
            <div className="flex-1 p-6 overflow-y-auto">
              {!uploadedImage ? (
                <div className="h-full flex items-center justify-center">
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

                  <div className="relative border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
                    <div className="relative" style={{ maxHeight: '600px', overflow: 'auto' }}>
                      {showBeforeAfter && (
                        <img
                          src={history.original}
                          alt="Original"
                          className="absolute top-0 left-0 w-1/2 h-full object-contain opacity-50"
                          style={{ pointerEvents: 'none' }}
                        />
                      )}
                      <canvas
                        ref={imageCanvasRef}
                        className="max-w-full h-auto"
                        style={{ display: 'block' }}
                      />
                      <canvas
                        ref={maskCanvasRef}
                        className="absolute top-0 left-0 max-w-full h-auto cursor-crosshair"
                        style={{ mixBlendMode: 'multiply' }}
                        onMouseDown={startDrawing}
                        onMouseMove={drawOnMask}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleRemoveObject}
                      disabled={isInpainting}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
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
              <div className="w-72 border-l border-gray-200 p-4 overflow-y-auto bg-gray-50">
                <h3 className="text-lg font-semibold mb-4">Editor Tools</h3>

                <div className="space-y-4">
                  {/* Brush Size */}
                  <div>
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
                  <div className="flex gap-2">
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
    </div>
  );
};

export default ImageStudio;