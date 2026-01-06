import React, { useState, useEffect } from 'react';

interface ImageStudioProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
}

const ImageStudio: React.FC<ImageStudioProps> = ({ tabId, savedData, onDataChange }) => {
  const [activeTab, setActiveTab] = useState<'generator' | 'editor'>('generator');

  // Generator states
  const [prompt, setPrompt] = useState('');
  const [keyPoints, setKeyPoints] = useState('');
  const [colorMode, setColorMode] = useState('RGB');
  const [numImages, setNumImages] = useState(1);
  const [slider1, setSlider1] = useState(50);
  const [generationState, setGenerationState] = useState<'input' | 'generating' | 'results'>('input');
  const [results, setResults] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (savedData?.initialTab) {
      setActiveTab(savedData.initialTab);
    }
  }, [savedData]);

  const handleGenerate = () => {
    setGenerationState('generating');
    // Simulate generation delay
    setTimeout(() => {
      const mockImages = Array.from({ length: numImages }, (_, i) => `https://via.placeholder.com/300x300?text=Image+${i + 1}`);
      setResults(mockImages);
      setGenerationState('results');
    }, 2000); // 2 second delay
  };

  const resetToInput = () => {
    setGenerationState('input');
    setSelectedImage(null);
  };

  return (
    <div className="h-full bg-white flex flex-col">
      {/* Top Right Toggle Buttons */}
      <div className="flex justify-end p-4 border-b border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'generator'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Image Generator
          </button>
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-4 py-2 rounded-lg transition ${
              activeTab === 'editor'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Image Editor
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-6">
        {activeTab === 'generator' && (
          <div className="h-full flex">
            {/* Main Content */}
            <div className="flex-1 pr-4">
              {generationState === 'input' && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Image Generator</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Main Prompt</label>
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        rows={4}
                        placeholder="Enter your image prompt here..."
                      />
                    </div>
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color Mode</label>
                        <select
                          value={colorMode}
                          onChange={(e) => setColorMode(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="RGB">RGB</option>
                          <option value="Grayscale">Grayscale</option>
                          <option value="CMYK">CMYK</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Images</label>
                        <select
                          value={numImages}
                          onChange={(e) => setNumImages(Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value={1}>1</option>
                          <option value={2}>2</option>
                          <option value={3}>3</option>
                          <option value={4}>4</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Slider Placeholder</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={slider1}
                        onChange={(e) => setSlider1(Number(e.target.value))}
                        className="w-full"
                      />
                      <span className="text-sm text-gray-500">Value: {slider1}</span>
                    </div>
                    <button
                      onClick={handleGenerate}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              )}
              {generationState === 'generating' && (
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-4">Generating Images...</h2>
                  <div className="space-y-2">
                    {Array.from({ length: numImages }, (_, i) => (
                      <div key={i} className="flex items-center justify-center p-4 border border-gray-300 rounded-md">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2">Generating Image {i + 1}...</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {generationState === 'results' && !selectedImage && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Generated Images</h2>
                    <button
                      onClick={resetToInput}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Back to Inputs
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {results.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Generated ${i + 1}`}
                        className="w-full h-32 object-cover border border-gray-300 rounded-md cursor-pointer hover:opacity-75"
                        onClick={() => setSelectedImage(img)}
                      />
                    ))}
                  </div>
                </div>
              )}
              {selectedImage && (
                <div>
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    Back to Thumbnails
                  </button>
                  <img src={selectedImage} alt="Full Size" className="w-full max-h-96 object-contain border border-gray-300 rounded-md" />
                </div>
              )}
            </div>
            {/* Side Panel for Key Points */}
            <div className="w-64 border-l border-gray-200 pl-4">
              <h3 className="text-lg font-medium mb-2">Key Points</h3>
              <textarea
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={10}
                placeholder="Enter key points here..."
              />
            </div>
          </div>
        )}
        {activeTab === 'editor' && (
          <div className="text-center text-gray-500">
            <h2 className="text-xl font-semibold mb-4">Image Editor</h2>
            <p>Image Editor functionality coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageStudio;