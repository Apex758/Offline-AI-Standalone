import React from 'react';
import { WorksheetQuestion } from '../types/worksheet';
import { Skeleton } from '../ui/skeleton';

interface ListBasedTemplateProps {
  subject: string;
  gradeLevel: string;
  topic: string;
  questionCount: number;
  questionType: string;
  worksheetTitle: string;
  includeImages: boolean;
  imageMode?: 'shared';
  imagePlacement?: string;
  generatedImage?: string | null;
  questions?: WorksheetQuestion[];
  wordBank?: string[];
  showAnswers?: boolean;
  loading?: boolean;
}

const ListBasedTemplate: React.FC<ListBasedTemplateProps> = ({
  subject,
  gradeLevel,
  topic,
  questionCount,
  questionType,
  worksheetTitle,
  includeImages,
  imageMode,
  generatedImage,
  questions,
  wordBank,
  showAnswers = false,
  loading = false
}) => {
  // Determine if we're in preview mode (no questions yet) or rendered mode (have questions)
  const isPreviewMode = !questions || questions.length === 0;

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8">
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        {loading ? (
          <>
            <Skeleton className="h-7 w-64 mx-auto mb-2 bg-gray-200" />
            <div className="flex justify-between text-sm text-gray-600">
              <Skeleton className="h-4 w-24 bg-gray-200" />
              <Skeleton className="h-4 w-20 bg-gray-200" />
              <span>Name: _________________</span>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center mb-2">{worksheetTitle}</h1>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Subject: {subject}</span>
              <span>Grade: {gradeLevel}</span>
              <span>Name: _________________</span>
            </div>
          </>
        )}
      </div>

      {/* Word Bank Section */}
      {loading && (questionType === 'Word Bank') ? (
        <div className="mb-8 p-4 border-2 border-gray-400 rounded-lg bg-gray-50">
          <h3 className="font-bold text-lg mb-2">Word Bank</h3>
          <div className="flex flex-wrap gap-3">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded bg-gray-200" />
            ))}
          </div>
        </div>
      ) : wordBank && wordBank.length > 0 ? (
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
      ) : null}

      {/* Instructions */}
      <div className="mb-6 p-3 bg-blue-50 border-l-4 border-blue-500">
        {loading ? (
          <Skeleton className="h-4 w-80 bg-blue-100" />
        ) : (
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
        )}
      </div>

      {/* Image (if shared mode) */}
      {includeImages && imageMode === 'shared' && (
        <div className="mb-6 flex justify-center">
          {loading ? (
            <Skeleton className="max-w-md h-48 w-full bg-gray-200 rounded-lg" />
          ) : generatedImage ? (
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
        {loading ? (
          // Loading Mode - Show skeleton placeholders
          <>
            {Array.from({ length: questionCount }).map((_, index) => (
              <div key={`skeleton_${index}`} className="border-b border-gray-300 pb-4">
                <div className="flex items-start space-x-3">
                  <span className="font-bold">{index + 1}.</span>
                  <div className="flex-1">
                    <Skeleton className="h-4 w-5/6 mb-2 bg-gray-200" />
                    {(questionType === 'True / False') ? (
                      <div className="flex space-x-4 ml-6">
                        <Skeleton className="h-4 w-12 bg-gray-200" />
                        <Skeleton className="h-4 w-12 bg-gray-200" />
                      </div>
                    ) : (questionType === 'Short Answer') ? (
                      <div className="space-y-2 mt-2">
                        <div className="border-b border-gray-300 h-8"></div>
                        <div className="border-b border-gray-300 h-8"></div>
                      </div>
                    ) : (
                      <Skeleton className="h-4 w-2/3 bg-gray-200" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : isPreviewMode ? (
          // Preview Mode - Show placeholders
          <>
            {Array.from({ length: questionCount }).map((_, index) => (
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

                    {/* Image per question removed; only shared image is supported */}
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

                    {showAnswers && question.correctAnswer !== undefined && question.correctAnswer !== '' && (
                      <div className="mt-2 text-sm text-green-700">
                        Answer: {String(question.correctAnswer)}
                      </div>
                    )}

                    {/* Image per question removed; only shared image is supported */}
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
