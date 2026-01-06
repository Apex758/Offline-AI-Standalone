import React from 'react';

interface MatchingTemplateProps {
  subject?: string;
  gradeLevel?: string;
  topic?: string;
  questionCount?: number;
  questionType?: string;
  worksheetTitle?: string;
  includeImages?: boolean;
}

const MatchingTemplate: React.FC<MatchingTemplateProps> = ({
  subject = 'Subject',
  gradeLevel = 'Grade',
  topic = 'Topic',
  questionCount = 10,
  questionType = 'Matching',
  worksheetTitle,
  includeImages = false
}) => {
  return (
    <div className="bg-white p-6 max-w-4xl mx-auto font-sans text-sm">
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{worksheetTitle}</h1>
            <p className="text-gray-600">
              <strong>Subject:</strong> {subject} | <strong>Grade:</strong> {gradeLevel}
            </p>
            <p className="text-gray-600">
              <strong>Topic:</strong> {topic}
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Name: ____________________</p>
            <p className="text-gray-600">Date: ____________________</p>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Instructions:</h2>
        <p className="text-gray-700">
          Draw lines to match the items in Column A with the correct items in Column B.
        </p>
      </div>

      {/* Matching Section */}
      <div className="mb-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Column A - Prompts */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Column A</h3>
            <div className="space-y-4">
              {Array.from({ length: questionCount }, (_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">
                      Sample prompt {i + 1}: Item {String.fromCharCode(65 + i)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column B - Answers */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Column B</h3>
            <div className="space-y-4">
              {Array.from({ length: questionCount }, (_, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800">
                      Sample answer {i + 1}: Definition {String.fromCharCode(65 + i)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300">
        <p className="text-center text-gray-500 text-xs">
          Worksheet generated for educational purposes
        </p>
      </div>
    </div>
  );
};

export default MatchingTemplate;