import React from 'react';

interface ListBasedTemplateProps {
  subject?: string;
  gradeLevel?: string;
  topic?: string;
  questionCount?: number;
  questionType?: string;
  worksheetTitle?: string;
  includeImages?: boolean;
}

const ListBasedTemplate: React.FC<ListBasedTemplateProps> = ({
  subject = 'Subject',
  gradeLevel = 'Grade',
  topic = 'Topic',
  questionCount = 10,
  questionType = 'Short Answer',
  worksheetTitle,
  includeImages = false
}) => {
  const getQuestionContent = (index: number) => {
    const questionNumber = index + 1;

    switch (questionType) {
      case 'True / False':
        return {
          question: `Sample true/false question ${questionNumber}: This statement is true.`,
          answerSpace: (
            <div className="flex space-x-6 mt-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                <span className="text-sm">True</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border border-gray-400 rounded-full"></div>
                <span className="text-sm">False</span>
              </div>
            </div>
          )
        };

      case 'Fill in the Blank':
        return {
          question: `Sample fill-in-the-blank ${questionNumber}: The ________ is the center of our solar system.`,
          answerSpace: (
            <div className="mt-2">
              <span className="text-sm text-gray-600">Answer:</span>
              <div className="border-b-2 border-gray-400 w-24 h-6 inline-block ml-2"></div>
            </div>
          )
        };

      case 'Word Bank':
        return {
          question: `Sample word bank question ${questionNumber}: Match the words to complete the sentence.`,
          answerSpace: (
            <div className="mt-2 space-y-2">
              <div className="text-xs text-gray-600">Word Bank: sun, moon, stars, planets</div>
              <div className="flex space-x-4">
                <span className="text-sm">1.</span>
                <div className="border-b border-gray-400 w-16 h-5"></div>
                <span className="text-sm">2.</span>
                <div className="border-b border-gray-400 w-16 h-5"></div>
              </div>
            </div>
          )
        };

      default: // Short Answer
        return {
          question: `Sample ${questionType.toLowerCase()} question ${questionNumber}: Explain your answer in 2-3 sentences.`,
          answerSpace: (
            <div className="mt-2 min-h-[4rem] border-b border-gray-300"></div>
          )
        };
    }
  };

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
      {questionType === 'Word Bank' && (
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Word Bank</h3>
          <div className="text-sm text-gray-700">
            sun, moon, stars, planets, earth, mars, venus, jupiter
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {Array.from({ length: questionCount }, (_, i) => {
          const questionContent = getQuestionContent(i);
          return (
            <div key={i} className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-semibold">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="mb-2">
                  <p className="text-gray-800">
                    {questionContent.question}
                  </p>
                  {includeImages && i % 3 === 0 && (
                    <div className="mt-2 mb-2">
                      <div className="w-24 h-16 bg-gray-200 border border-gray-300 rounded flex items-center justify-center text-xs text-gray-500">
                        [Image Placeholder]
                      </div>
                    </div>
                  )}
                </div>
                {questionContent.answerSpace}
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

export default ListBasedTemplate;