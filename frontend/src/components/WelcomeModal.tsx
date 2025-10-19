import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';

interface WelcomeModalProps {
  onClose: () => void;
  onStartTour: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ onClose, onStartTour }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleStartTour = () => {
    onStartTour();
    if (dontShowAgain) {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      {/* Semi-transparent backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleSkip}
      />
      
      {/* Modal card */}
      <div 
        className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-center mb-2">
            Welcome to PEARL AI! 🎓
          </h1>
          <p className="text-blue-100 text-center text-lg">
            Your AI-Powered Educational Assistant
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="space-y-4 mb-8">
            <p className="text-gray-700 text-lg leading-relaxed">
              PEARL AI is designed to help teachers create engaging lesson plans, quizzes, rubrics, and more - all tailored to the OECS curriculum.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Key Features:</h3>
              <ul className="space-y-2 text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>AI-powered lesson planning for multiple grade levels</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Customizable quiz and rubric generation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>OECS curriculum alignment and navigation</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Multi-tab workspace with split-screen viewing</span>
                </li>
              </ul>
            </div>

            <p className="text-gray-600 text-center italic">
              Take a quick tour to learn how to use all the features, or explore on your own!
            </p>
          </div>

          {/* Optional checkbox */}
          <div className="mb-6">
            <label className="flex items-center justify-center cursor-pointer group">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-800">
                Don't show this welcome message again
              </span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleSkip}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              I'll Explore on My Own
            </button>
            <button
              onClick={handleStartTour}
              className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Take the Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;