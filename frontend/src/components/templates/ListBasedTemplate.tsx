import React from 'react';
import { WorksheetQuestion } from '../types/worksheet';

interface ListBasedTemplateProps {
  subject: string;
  gradeLevel: string;
  topic: string;
  questionCount: number;
  questionType: string;
  worksheetTitle: string;
  includeImages: boolean;
  imageMode?: string;
  imagePlacement?: string;
  generatedImage?: string | null;
  questions?: WorksheetQuestion[];
  wordBank?: string[];  // ✅ NEW: Word bank support
}

const ListBasedTemplate: React.FC<ListBasedTemplateProps> = ({
  subject,
  gradeLevel,
  topic,
  questionType,
  worksheetTitle,
  includeImages,
  imageMode,
  generatedImage,
  questions,
  wordBank  // ✅ Destructure the word bank prop
}) => {
  // Determine if we're in preview mode (no questions yet) or rendered mode (have questions)
  const isPreviewMode = !questions || questions.length === 0;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8">
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-center mb-2">{worksheetTitle}</h1>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subject: {subject}</span>
          <span>Grade: {gradeLevel}</span>
          <span>Name: _________________</span>
        </div>
      </div>

      {/* ✅ WORD BANK SECTION - Render if wordBank exists */}
      {wordBank && wordBank.length > 0 && (
        <div className="mb-8 p-4 border-2 border-gray-400 rounded-lg bg-gray-50">
          <h3 className="font-bold text-lg mb-2">Word Bank</h3>
          <div className="flex flex-wrap gap-3">
            {wordBank.map((word, index) => (
              <span 
                key={index} 
                className="px-3 py-1 bg-white border border-gray-300 rounded shadow-sm"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mb-6 p-3 bg-blue-50 border-l-4 border-blue-500">
        <p className="text-sm">
          {questionType === 'Word Bank' 
            ? 'Use the words from the word bank above to fill in the blanks in each sentence.'
            : questionType === 'True / False'
            ? 'Read each statement carefully and circle True or False.'
            : questionType === 'Fill in the Blank'
            ? 'Complete each sentence by filling in the blank with the correct word or phrase.'
            : questionType === 'Short Answer'
            ? 'Answer each question in 2-4 complete sentences.'
            : 'Answer the following questions.'}
        </p>
      </div>

      {/* Image (if shared mode) */}
      {includeImages && imageMode === 'shared' && (
        <div className="mb-6 flex justify-center">
          {generatedImage ? (
            <img
              src={generatedImage}
              alt="Worksheet illustration"
              className="max-w-md rounded-lg shadow-md"
            />
          ) : (
            <div className="max-w-md h-48 bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center text-sm text-gray-500">
              [Shared Image Placeholder]
            </div>
          )}
        </div>
      )}

      {/* Questions Section */}
      <div className="space-y-6">
        {isPreviewMode ? (
          // Preview Mode - Show placeholders
          <>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="border-b border-gray-300 pb-4">
                <div className="flex items-start space-x-3">
                  <span className="font-bold">{index + 1}.</span>
                  <div className="flex-1">
                    {questionType === 'Word Bank' || questionType === 'Fill in the Blank' ? (
                      <p className="text-gray-600 mb-2">
                        Sample sentence with _____________ to complete.
                      </p>
                    ) : questionType === 'True / False' ? (
                      <>
                        <p className="text-gray-600 mb-2">
                          Sample statement about {topic}.
                        </p>
                        <div className="flex space-x-4 ml-6">
                          <label className="flex items-center space-x-2">
                            <input type="radio" name={`q${index}`} disabled />
                            <span>True</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input type="radio" name={`q${index}`} disabled />
                            <span>False</span>
                          </label>
                        </div>
                      </>
                    ) : questionType === 'Short Answer' ? (
                      <>
                        <p className="text-gray-600 mb-2">
                          Sample question about {topic}?
                        </p>
                        <div className="space-y-2 mt-2">
                          <div className="border-b border-gray-300 h-8"></div>
                          <div className="border-b border-gray-300 h-8"></div>
                          <div className="border-b border-gray-300 h-8"></div>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-600">Sample question text</p>
                    )}

                    {/* Image per question (if one-per-question mode) */}
                    {includeImages && imageMode === 'one-per-question' && index === 0 && (
                      <div className="mt-3 mb-2">
                        {generatedImage ? (
                          <img
                            src={generatedImage}
                            alt="Question illustration"
                            className="max-w-xs rounded shadow"
                          />
                        ) : (
                          <div className="w-32 h-20 bg-gray-200 border border-gray-300 rounded flex items-center justify-center text-xs text-gray-500">
                            [Image Placeholder]
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          // Rendered Mode - Show actual questions
          <>
            {questions!.map((question, index) => (
              <div key={question.id} className="border-b border-gray-300 pb-4">
                <div className="flex items-start space-x-3">
                  <span className="font-bold">{index + 1}.</span>
                  <div className="flex-1">
                    {/* ✅ Render the actual question text */}
                    {questionType === 'Word Bank' || question.type === 'word-bank' ? (
                      // Word Bank question - just the sentence with blank
                      <p className="text-gray-800 leading-relaxed">
                        {question.question}
                      </p>
                    ) : questionType === 'Fill in the Blank' || question.type === 'fill-blank' ? (
                      // Fill in blank - sentence with blank
                      <p className="text-gray-800 leading-relaxed">
                        {question.question}
                      </p>
                    ) : questionType === 'True / False' || question.type === 'true-false' ? (
                      // True/False - statement with radio buttons
                      <>
                        <p className="text-gray-800 leading-relaxed mb-2">
                          {question.question}
                        </p>
                        <div className="flex space-x-4 ml-6">
                          <label className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              name={`q${index}`} 
                              className="w-4 h-4"
                            />
                            <span>True</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input 
                              type="radio" 
                              name={`q${index}`} 
                              className="w-4 h-4"
                            />
                            <span>False</span>
                          </label>
                        </div>
                      </>
                    ) : questionType === 'Short Answer' || question.type === 'short-answer' ? (
                      // Short answer - question with lines
                      <>
                        <p className="text-gray-800 leading-relaxed mb-2">
                          {question.question}
                        </p>
                        <div className="space-y-2 mt-3">
                          <div className="border-b border-gray-400 h-8"></div>
                          <div className="border-b border-gray-400 h-8"></div>
                          <div className="border-b border-gray-400 h-8"></div>
                        </div>
                      </>
                    ) : (
                      // Default - just show question
                      <p className="text-gray-800 leading-relaxed">
                        {question.question}
                      </p>
                    )}

                    {/* Image per question (if one-per-question mode) */}
                    {includeImages && imageMode === 'one-per-question' && index === 0 && (
                      <div className="mt-3 mb-2">
                        {generatedImage ? (
                          <img
                            src={generatedImage}
                            alt="Question illustration"
                            className="max-w-xs rounded shadow"
                          />
                        ) : (
                          <div className="w-32 h-20 bg-gray-200 border border-gray-300 rounded flex items-center justify-center text-xs text-gray-500">
                            [Image Placeholder]
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-300 text-center text-xs text-gray-500">
        <p>Generated for educational purposes</p>
      </div>
    </div>
  );
};

export default ListBasedTemplate;