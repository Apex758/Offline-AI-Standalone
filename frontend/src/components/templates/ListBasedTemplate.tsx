import React from 'react';
import { WorksheetQuestion } from '../../types/worksheet';

interface ListBasedTemplateProps {
  subject?: string;
  gradeLevel?: string;
  topic?: string;
  questionCount?: number;
  questionType?: string;
  worksheetTitle?: string;
  includeImages?: boolean;
  imageMode?: string;
  generatedImage?: string | null;
  questions?: WorksheetQuestion[];
  wordBank?: string; // For Word Bank questions
}

const ListBasedTemplate: React.FC<ListBasedTemplateProps> = ({
  subject = 'Subject',
  gradeLevel = 'Grade',
  topic = 'Topic',
  questionCount = 10,
  questionType = 'Short Answer',
  worksheetTitle,
  includeImages = false,
  imageMode = 'one-per-question',
  generatedImage = null,
  questions,
  wordBank
}) => {
  // Use actual questions if provided
  const displayQuestions = questions || Array.from({ length: questionCount }, (_, i) => ({
    id: `sample_${i}`,
    question: `Sample ${questionType} question ${i + 1}`
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
          Read each question carefully and provide your answer in the space provided.
        </p>
      </div>

      {/* Word Bank (if applicable) */}
      {questionType === 'Word Bank' && wordBank && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Word Bank</h3>
          <div className="text-sm text-gray-700">
            {wordBank}
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {displayQuestions.map((q, i) => (
          <div key={q.id} className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-semibold">
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="mb-2">
                <p className="text-gray-800">{q.question}</p>
              </div>
              
              {/* Answer space based on question type */}
              <div className="mt-2">
                {questionType === 'True / False' && (
                  <div className="flex space-x-6">
                    <label className="flex items-center space-x-2">
                      <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                      <span className="text-sm">True</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                      <span className="text-sm">False</span>
                    </label>
                  </div>
                )}
                
                {(questionType === 'Fill in the Blank' || questionType === 'Word Bank') && (
                  <div className="border-b-2 border-gray-400 w-full h-6"></div>
                )}
                
                {questionType === 'Short Answer' && (
                  <div className="min-h-[4rem] border-b border-gray-300"></div>
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

export default ListBasedTemplate;