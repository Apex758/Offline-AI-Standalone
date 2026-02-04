import React from 'react';
import { WorksheetQuestion } from '../../types/worksheet';

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
  passage?: string;
  questions?: WorksheetQuestion[];
  showAnswers?: boolean;
}

const ComprehensionTemplate: React.FC<ComprehensionTemplateProps> = ({
  subject = 'Subject',
  gradeLevel = 'Grade',
  topic = 'Topic',
  questionCount = 8,
  worksheetTitle,
  includeImages = false,
  imagePlacement = 'large-centered',
  generatedImage = null,
  passage,  // ← NEW
  questions,
  showAnswers = false
}) => {
  // Use actual passage if provided
  const displayPassage = passage || "Lorem ipsum dolor sit amet...";
  
  // Use actual questions if provided
  const displayQuestions: WorksheetQuestion[] = questions || Array.from({ length: questionCount }, (_, i) => ({
    id: `sample_${i}`,
    question: `Sample comprehension question ${i + 1}: What is the main idea?`,
    correctAnswer: undefined,
    type: 'comprehension'
  }));

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
          {/* ✅ UPDATED: Use actual passage */}
          <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {displayPassage}
          </div>
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
        {/* ✅ UPDATED: Map over actual questions */}
        {displayQuestions.map((q, index) => (
          <div key={q.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-semibold">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="mb-3">
                  <p className="text-gray-800 font-medium">
                    {q.question}
                  </p>
                </div>
                {showAnswers && q.correctAnswer ? (
                  <div className="mt-2 text-sm text-green-700">
                    Answer: {String(q.correctAnswer)}
                  </div>
                ) : (
                  <div className="border-b border-gray-300 pb-2">
                    <span className="text-gray-500 text-xs">Answer:</span>
                    <div className="mt-1 min-h-[3rem]"></div>
                   </div>
                 )}
              </div>
            </div>
          </div>
        ))}
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
