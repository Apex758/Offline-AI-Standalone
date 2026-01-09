import React from 'react';

interface ComprehensionTemplateProps {
  subject?: string;
  gradeLevel?: string;
  topic?: string;
  questionCount?: number;
  questionType?: string;
  worksheetTitle?: string;
  includeImages?: boolean;
  imagePlacement?: string;
  generatedImage?: string | null;
}

const ComprehensionTemplate: React.FC<ComprehensionTemplateProps> = ({
  subject = 'Subject',
  gradeLevel = 'Grade',
  topic = 'Topic',
  questionCount = 8,
  questionType = 'Comprehension',
  worksheetTitle,
  includeImages = false,
  imagePlacement = 'large-centered',
  generatedImage = null
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

      {/* Passage Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Reading Passage</h2>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          {includeImages && imagePlacement === 'large-centered' && (
            <div className="mb-4">
              {generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated worksheet image"
                  className="w-64 h-32 object-contain border border-gray-300 rounded mx-auto"
                />
              ) : (
                <div className="w-64 h-32 bg-gray-200 border border-gray-300 rounded flex items-center justify-center text-xs text-gray-500 mx-auto">
                  [Large Centered Passage Image]
                </div>
              )}
            </div>
          )}
          {includeImages && imagePlacement === 'small-corner' && (
            <div className="mb-4 float-right ml-4">
              {generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated worksheet image"
                  className="w-32 h-20 object-contain border border-gray-300 rounded"
                />
              ) : (
                <div className="w-32 h-20 bg-gray-200 border border-gray-300 rounded flex items-center justify-center text-xs text-gray-500">
                  [Small Corner Image]
                </div>
              )}
            </div>
          )}
          <p className="text-gray-800 leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          <p className="text-gray-800 leading-relaxed mt-4">
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Comprehension Questions</h2>
        <p className="text-gray-700">
          Read the passage above and answer the questions below.
        </p>
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {Array.from({ length: questionCount }, (_, i) => {
          const questionNumber = i + 1;
          let questionText = '';
          let answerSpace = null;

          switch (questionType) {
            case 'Multiple Choice':
              questionText = `Sample comprehension question ${questionNumber}: Which of the following is correct?`;
              answerSpace = (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:border-blue-500">
                      <span className="text-xs font-semibold">A</span>
                    </div>
                    <span className="text-gray-700">Option A</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:border-blue-500">
                      <span className="text-xs font-semibold">B</span>
                    </div>
                    <span className="text-gray-700">Option B</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:border-blue-500">
                      <span className="text-xs font-semibold">C</span>
                    </div>
                    <span className="text-gray-700">Option C</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center cursor-pointer hover:border-blue-500">
                      <span className="text-xs font-semibold">D</span>
                    </div>
                    <span className="text-gray-700">Option D</span>
                  </div>
                </div>
              );
              break;
            case 'True / False':
              questionText = `Sample comprehension question ${questionNumber}: This statement about the passage is true.`;
              answerSpace = (
                <div className="flex space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                    <span className="text-sm">True</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                    <span className="text-sm">False</span>
                  </div>
                </div>
              );
              break;
            default: // Comprehension, Short Answer
              questionText = i % 2 === 0
                ? `Sample comprehension question ${questionNumber}: What is the main idea of the passage?`
                : `Sample comprehension question ${questionNumber}: Explain your answer in 2-3 sentences.`;
              answerSpace = (
                <div className="border-b border-gray-300 pb-2">
                  <span className="text-gray-500 text-xs">Answer:</span>
                  <div className="mt-1 min-h-[3rem]"></div>
                </div>
              );
              break;
          }

          return (
            <div key={i} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold">
                  {questionNumber}
                </div>
                <div className="flex-1">
                  <div className="mb-3">
                    <p className="text-gray-800 font-medium">
                      {questionText}
                    </p>
                  </div>
                  {answerSpace}
                </div>
              </div>
            </div>
          );
        })}
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

export default ComprehensionTemplate;