import React, { useState, useEffect } from 'react';
import { Loader2, ListChecks, Trash2, Save, Download, History, X } from 'lucide-react';

interface QuizGeneratorProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
}

interface FormData {
  subject: string;
  gradeLevel: string;
  learningOutcomes: string;
  questionTypes: string[];
  cognitiveLevels: string[];
  timeLimitPerQuestion: string;
  randomizeQuestions: boolean;
  numberOfQuestions: string;
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ tabId, savedData, onDataChange }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = savedData?.formData;
    if (saved && Object.keys(saved).length > 0 && saved.subject) {
      return saved;
    }
    return {
      subject: '',
      gradeLevel: '',
      learningOutcomes: '',
      questionTypes: [],
      cognitiveLevels: [],
      timeLimitPerQuestion: '',
      randomizeQuestions: false,
      numberOfQuestions: '10'
    };
  });

  const [generatedQuiz, setGeneratedQuiz] = useState<string>(savedData?.generatedQuiz || '');

  const subjects = ['Mathematics', 'Science', 'Language Arts', 'Social Studies', 'Music', 'Physical Education'];
  const grades = ['K', '1', '2', '3', '4', '5', '6'];
  const questionTypesOptions = ['Multiple Choice', 'True/False', 'Open-Ended', 'Fill-in-the-Blank'];
  const cognitiveLevelsOptions = ['Knowledge', 'Comprehension', 'Application', 'Analysis', 'Synthesis', 'Evaluation'];

  useEffect(() => {
    const saved = savedData?.formData;
    if (!saved || Object.keys(saved).length === 0 || !saved.subject) {
      setFormData({
        subject: '',
        gradeLevel: '',
        learningOutcomes: '',
        questionTypes: [],
        cognitiveLevels: [],
        timeLimitPerQuestion: '',
        randomizeQuestions: false,
        numberOfQuestions: '10'
      });
      setGeneratedQuiz('');
    } else {
      setFormData(saved);
      setGeneratedQuiz(savedData?.generatedQuiz || '');
    }
  }, [tabId]);

  useEffect(() => {
    onDataChange({ formData, generatedQuiz });
  }, [formData, generatedQuiz]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof FormData, value: string) => {
    const currentArray = formData[field] as string[];
    if (currentArray.includes(value)) {
      handleInputChange(field, currentArray.filter(item => item !== value));
    } else {
      handleInputChange(field, [...currentArray, value]);
    }
  };

  const generateQuiz = () => {
    setLoading(true);
    // TODO: Implement WebSocket connection for streaming
    setTimeout(() => {
      setGeneratedQuiz('Quiz generation will be implemented with backend');
      setLoading(false);
    }, 1000);
  };

  const clearForm = () => {
    setFormData({
      subject: '',
      gradeLevel: '',
      learningOutcomes: '',
      questionTypes: [],
      cognitiveLevels: [],
      timeLimitPerQuestion: '',
      randomizeQuestions: false,
      numberOfQuestions: '10'
    });
    setGeneratedQuiz('');
  };

  const validateForm = () => {
    return formData.subject && formData.gradeLevel && formData.learningOutcomes && 
           formData.questionTypes.length > 0 && formData.cognitiveLevels.length > 0;
  };

  return (
    <div className="flex h-full bg-white">
      <div className="flex-1 flex flex-col">
        {generatedQuiz ? (
          <>
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Generated Quiz</h2>
                <p className="text-sm text-gray-500">{formData.subject} - Grade {formData.gradeLevel}</p>
              </div>
              <button
                onClick={() => setGeneratedQuiz('')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create New Quiz
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <div className="prose max-w-none">
                {generatedQuiz}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-xl font-semibold text-gray-800">Quiz Configuration</h2>
              <p className="text-sm text-gray-500">Configure your quiz parameters</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => handleInputChange('gradeLevel', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a grade</option>
                    {grades.map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.numberOfQuestions}
                    onChange={(e) => handleInputChange('numberOfQuestions', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                    max="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Outcomes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.learningOutcomes}
                    onChange={(e) => handleInputChange('learningOutcomes', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="What should students know or be able to demonstrate?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Question Types <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {questionTypesOptions.map(type => (
                      <label key={type} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.questionTypes.includes(type)}
                          onChange={() => handleCheckboxChange('questionTypes', type)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Cognitive Levels <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {cognitiveLevelsOptions.map(level => (
                      <label key={level} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.cognitiveLevels.includes(level)}
                          onChange={() => handleCheckboxChange('cognitiveLevels', level)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit per Question (in seconds, optional)
                  </label>
                  <input
                    type="number"
                    value={formData.timeLimitPerQuestion}
                    onChange={(e) => handleInputChange('timeLimitPerQuestion', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 60"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.randomizeQuestions}
                      onChange={(e) => handleInputChange('randomizeQuestions', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Randomize Questions</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="max-w-3xl mx-auto flex justify-between">
                <button
                  onClick={clearForm}
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Clear Form
                </button>
                <button
                  onClick={generateQuiz}
                  disabled={!validateForm() || loading}
                  className="flex items-center px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ListChecks className="w-5 h-5 mr-2" />
                      Generate Quiz
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuizGenerator;