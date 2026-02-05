import React from 'react';

export interface MathProblem {
  id: string;
  num1: number | string;
  num2: number | string;
  operator: '+' | '-' | 'x' | '÷' | '*' | '/';
  answer?: number | string;
}

interface MathTemplateProps {
  subject?: string;
  gradeLevel?: string;
  topic?: string;
  worksheetTitle?: string;
  instructions?: string;
  mathProblems?: MathProblem[];
  questions?: Array<{ id: string; question: string; correctAnswer?: string | number }>;
  columnCount?: number;
  showAnswers?: boolean;
  questionCount?: number;
}

const MathTemplate: React.FC<MathTemplateProps> = ({
  subject = 'Mathematics',
  gradeLevel = 'Grade',
  topic = 'Vertical Arithmetic',
  worksheetTitle,
  instructions = 'Solve the following problems.',
  mathProblems,
  questions,
  columnCount = 4,
  showAnswers = false,
  questionCount = 10
}) => {
  
  // Helper: Parse a string like "12 + 5" into a MathProblem object
  const parseQuestionToMathProblem = (q: { id: string; question: string; correctAnswer?: string | number }): MathProblem => {
    const match = q.question.match(/(\d+)\s*([+\-xX*÷/])\s*(\d+)/);
    
    if (match) {
      return {
        id: q.id,
        num1: parseInt(match[1]),
        operator: match[2] as any,
        num2: parseInt(match[3]),
        answer: q.correctAnswer
      };
    }
    // Fallback
    return {
      id: q.id,
      num1: q.question,
      num2: '',
      operator: '+' as any,
      answer: q.correctAnswer
    };
  };

  // Determine which data source to use
  let displayProblems: MathProblem[] = [];

  if (mathProblems && mathProblems.length > 0) {
    displayProblems = mathProblems;
  } else if (questions && questions.length > 0) {
    displayProblems = questions.map(parseQuestionToMathProblem);
  } else {
    // Generate placeholders if no data
    displayProblems = Array.from({ length: questionCount }, (_, i) => {
      const n1 = Math.floor(Math.random() * 50) + 10;
      const n2 = Math.floor(Math.random() * 50) + 10;
      return {
        id: `sample_${i}`,
        num1: n1,
        num2: n2,
        operator: i % 2 === 0 ? '+' : '-',
        answer: i % 2 === 0 ? n1 + n2 : n1 - n2
      };
    });
  }

  // Grid classes to control columns based on prop
  // Uses responsive grid: 1 col mobile, 2 col small, requested cols on medium+
  const gridClass = `grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${columnCount} gap-6`;

  return (
    <div className="bg-white p-6 max-w-4xl mx-auto font-sans text-sm">
      {/* --- Standard Header (Matches other templates) --- */}
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{worksheetTitle || 'Math Worksheet'}</h1>
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

      {/* --- Standard Instructions --- */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Instructions:</h2>
        <p className="text-gray-700">
          {instructions}
        </p>
      </div>

      {/* --- Questions Grid --- */}
      <div className={gridClass}>
        {displayProblems.map((problem, index) => (
          <div key={problem.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
            <div className="flex items-start space-x-3">
              {/* Question Number Badge (Matches style) */}
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-xs">
                {index + 1}
              </div>

              {/* Vertical Math Content */}
              <div className="flex-1 flex justify-center">
                <div className="font-mono text-2xl font-bold text-gray-800 text-right inline-block">
                  {/* Top Number */}
                  <div className="mb-1">{problem.num1}</div>
                  
                  {/* Bottom Number with Operator */}
                  <div className="border-b-2 border-gray-800 pb-1 relative min-w-[3rem]">
                    <span className="absolute left-[-1.5rem] text-gray-600 font-sans text-xl">
                      {problem.operator === '*' ? '×' : problem.operator === '/' ? '÷' : problem.operator}
                    </span>
                    {problem.num2}
                  </div>

                  {/* Answer Section */}
                  <div className="h-8 pt-1 text-blue-600 text-xl text-center">
                    {showAnswers && problem.answer !== undefined ? problem.answer : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Standard Footer (Matches other templates) --- */}
      <div className="mt-8 pt-4 border-t border-gray-300">
        <p className="text-center text-gray-500 text-xs">
          Worksheet generated for educational purposes
        </p>
      </div>
    </div>
  );
};

export default MathTemplate;