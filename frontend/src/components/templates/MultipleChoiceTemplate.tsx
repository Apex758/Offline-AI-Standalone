import React from 'react';

interface MultipleChoiceTemplateProps {
  subject?: string;
  gradeLevel?: string;
  topic?: string;
  questionCount?: number;
  questionType?: string;
  worksheetTitle?: string;
  includeImages?: boolean;
  imageMode?: 'shared';
  generatedImage?: string | null;
  questions?: Array<{  // ← ADD THIS
    question: string;
    options?: string[];
    correctAnswer?: number;
    id: string;
  }>;
  showAnswers?: boolean;
}

const MultipleChoiceTemplate: React.FC<MultipleChoiceTemplateProps> = ({
  subject = 'Subject',
  gradeLevel = 'Grade',
  topic = 'Topic',
  questionCount = 10,
  questionType = 'Multiple Choice', // eslint-disable-line @typescript-eslint/no-unused-vars
  worksheetTitle,
  includeImages = false,
  imageMode = 'shared',
  generatedImage = null,
  questions,
  showAnswers = false
}) => {
  // Use actual questions if provided, otherwise generate placeholders
  const displayQuestions = questions || Array.from({ length: questionCount }, (_, i) => ({
    id: `sample_${i}`,
    question: `Sample multiple choice question ${i + 1}: Which of the following is correct?`,
    options: ['Option A', 'Option B', 'Option C', 'Option D']
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

      {/* Instructions */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Instructions:</h2>
        <p className="text-gray-700">
          Read each question and circle the correct answer (A, B, C, or D).
        </p>
      </div>

      {/* Shared Image */}
      {includeImages && imageMode === 'shared' && (
        <div className="mb-6">
          {generatedImage ? (
            <img
              src={generatedImage}
              alt="Generated worksheet image"
              className="w-48 h-32 object-contain border border-gray-300 rounded mx-auto"
            />
          ) : (
            <div className="w-48 h-32 bg-gray-200 border border-gray-300 rounded flex items-center justify-center text-xs text-gray-500 mx-auto">
              [Shared Image Placeholder]
            </div>
          )}
        </div>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {displayQuestions.map((q, i) => (
          <div key={q.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="mb-3">
                  <p className="text-gray-800 font-medium">
                    {q.question}
                  </p>
                </div>
                 <div className="grid grid-cols-2 gap-3">
                   {q.options?.map((option, optIndex) => {
                     const isCorrect = typeof q.correctAnswer === 'number' && q.correctAnswer === optIndex;
                     return (
                       <div key={optIndex} className="flex items-center space-x-2">
                         <div
                           className={`w-6 h-6 border-2 rounded-full flex items-center justify-center cursor-pointer ${
                             isCorrect && showAnswers
                               ? 'border-green-500 bg-green-50 text-green-700'
                               : 'border-gray-300 hover:border-blue-500'
                           }`}
                         >
                           <span className="text-xs font-semibold">{String.fromCharCode(65 + optIndex)}</span>
                         </div>
                         <span className={`text-gray-700 ${isCorrect && showAnswers ? 'font-semibold' : ''}`}>
                           {option}
                         </span>
                         {isCorrect && showAnswers && (
                           <span className="text-xs text-green-700 ml-1">(Answer)</span>
                         )}
                       </div>
                     );
                   })}
                 </div>
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

export default MultipleChoiceTemplate;
