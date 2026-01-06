import React, { useState, useEffect } from 'react';
import { FileText, Eye, Save, Plus, Trash2 } from 'lucide-react';

interface Question {
  id: string;
  type: string;
  text: string;
  options?: string[];
  correctAnswer?: string;
  passage?: string;
}

interface WorksheetData {
  title: string;
  subject: string;
  gradeLevel: string;
  questions: Question[];
}

interface WorksheetEditorProps {
  tabId?: string;
  savedData?: Record<string, unknown>;
  onDataChange?: (data: Record<string, unknown>) => void;
}

const questionTypes = [
  'Multiple Choice',
  'True / False',
  'Word Bank',
  'Fill in the Blank',
  'Short Answer',
  'Matching',
  'Comprehension'
];

const WorksheetEditor: React.FC<WorksheetEditorProps> = ({ tabId, savedData, onDataChange }) => {
  const LOCAL_STORAGE_KEY = `worksheet_editor_${tabId}`;

  const getDefaultWorksheetData = (): WorksheetData => ({
    title: 'Untitled Worksheet',
    subject: '',
    gradeLevel: '',
    questions: []
  });

  const [worksheetData, setWorksheetData] = useState<WorksheetData>(() => {
    if (savedData?.worksheetData && typeof savedData.worksheetData === 'object') {
      return savedData.worksheetData as WorksheetData;
    }
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.worksheetData && typeof parsed.worksheetData === 'object') {
          return parsed.worksheetData;
        }
      }
    } catch (e) {
      console.error('Failed to restore worksheetData:', e);
    }
    return getDefaultWorksheetData();
  });

  const handleWorksheetChange = (field: keyof WorksheetData, value: string | Question[]) => {
    setWorksheetData(prev => ({ ...prev, [field]: value }));
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type: 'Multiple Choice',
      text: '',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A'
    };
    setWorksheetData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setWorksheetData(prev => ({
      ...prev,
      questions: prev.questions.map(q => q.id === id ? { ...q, ...updates } : q)
    }));
  };

  const deleteQuestion = (id: string) => {
    setWorksheetData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== id)
    }));
  };

  const addOption = (questionId: string) => {
    setWorksheetData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? { ...q, options: [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`] }
          : q
      )
    }));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setWorksheetData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.map((opt, idx) => idx === optionIndex ? value : opt)
            }
          : q
      )
    }));
  };

  const deleteOption = (questionId: string, optionIndex: number) => {
    setWorksheetData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.filter((_, idx) => idx !== optionIndex)
            }
          : q
      )
    }));
  };

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ worksheetData }));
  }, [worksheetData]);

  // Notify parent
  useEffect(() => {
    onDataChange?.({ worksheetData });
  }, [worksheetData]);

  return (
    <div className="h-full bg-white grid grid-cols-2">
      {/* Left Panel - Editor (50%) */}
      <div className="flex flex-col border-r border-gray-200 overflow-y-auto">
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-xl font-semibold text-gray-800">Worksheet Editor</h2>
          <p className="text-sm text-gray-500">Create and edit worksheets manually</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Worksheet Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Worksheet Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={worksheetData.title}
                    onChange={(e) => handleWorksheetChange('title', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Worksheet Title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={worksheetData.subject}
                    onChange={(e) => handleWorksheetChange('subject', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Mathematics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Level
                  </label>
                  <input
                    type="text"
                    value={worksheetData.gradeLevel}
                    onChange={(e) => handleWorksheetChange('gradeLevel', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 3"
                  />
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Questions ({worksheetData.questions.length})</h3>
                <button
                  onClick={addQuestion}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </button>
              </div>

              <div className="space-y-4">
                {worksheetData.questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-md font-medium">Question {index + 1}</h4>
                      <button
                        onClick={() => deleteQuestion(question.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question Type
                        </label>
                        <select
                          value={question.type}
                          onChange={(e) => updateQuestion(question.id, { type: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {questionTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Question Text
                        </label>
                        <textarea
                          value={question.text}
                          onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                          placeholder="Enter your question here..."
                        />
                      </div>

                      {question.type === 'Comprehension' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Passage
                          </label>
                          <textarea
                            value={question.passage || ''}
                            onChange={(e) => updateQuestion(question.id, { passage: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={5}
                            placeholder="Enter the reading passage..."
                          />
                        </div>
                      )}

                      {(question.type === 'Multiple Choice' || question.type === 'True / False') && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Options
                            </label>
                            <button
                              onClick={() => addOption(question.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <Plus className="w-4 h-4 inline mr-1" />
                              Add Option
                            </button>
                          </div>
                          <div className="space-y-2">
                            {question.options?.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  name={`correct-${question.id}`}
                                  checked={question.correctAnswer === option}
                                  onChange={() => updateQuestion(question.id, { correctAnswer: option })}
                                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                                />
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                                  className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder={`Option ${optIndex + 1}`}
                                />
                                <button
                                  onClick={() => deleteOption(question.id, optIndex)}
                                  className="text-red-600 hover:text-red-800"
                                  disabled={question.options?.length === 1}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {question.type === 'Matching' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Matching Pairs (format: term1|definition1, term2|definition2)
                          </label>
                          <textarea
                            value={question.options?.join(', ') || ''}
                            onChange={(e) => updateQuestion(question.id, { options: e.target.value.split(', ').map(s => s.trim()) })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            placeholder="apple|fruit, dog|animal"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {worksheetData.questions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No questions added yet. Click "Add Question" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="max-w-4xl mx-auto flex justify-end">
            <button
              onClick={() => {
                // TODO: Implement save functionality
                console.log('Saving worksheet:', worksheetData);
              }}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Worksheet
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Preview (50%) */}
      <div className="bg-gray-50 border-l border-gray-200 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Worksheet Preview
          </h3>
          <p className="text-sm text-gray-500">Live preview of your worksheet</p>
        </div>

        <div className="flex-1 p-4">
          <div className="bg-white rounded-lg border border-gray-200 h-full overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-bold text-center mb-6">{worksheetData.title}</h1>
              <div className="text-sm text-gray-600 mb-4">
                Subject: {worksheetData.subject || 'Not specified'} | Grade: {worksheetData.gradeLevel || 'Not specified'}
              </div>

              <div className="space-y-6">
                {worksheetData.questions.map((question, index) => (
                  <div key={question.id} className="border-b border-gray-200 pb-4">
                    <div className="flex items-start space-x-2">
                      <span className="font-semibold text-gray-700">{index + 1}.</span>
                      <div className="flex-1">
                        <p className="mb-2">{question.text || 'Question text not entered'}</p>

                        {question.type === 'Comprehension' && question.passage && (
                          <div className="bg-gray-100 p-4 rounded mb-4">
                            <p className="text-sm">{question.passage}</p>
                          </div>
                        )}

                        {(question.type === 'Multiple Choice' || question.type === 'True / False') && (
                          <div className="space-y-1 ml-4">
                            {question.options?.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center space-x-2">
                                <span className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center text-xs">
                                  {String.fromCharCode(65 + optIndex)}
                                </span>
                                <span>{option}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {question.type === 'Matching' && (
                          <div className="grid grid-cols-2 gap-4 ml-4">
                            <div>
                              <h5 className="font-semibold mb-2">Terms</h5>
                              {question.options?.map((pair, idx) => {
                                const [term] = pair.split('|');
                                return <div key={idx} className="mb-1">{idx + 1}. {term}</div>;
                              })}
                            </div>
                            <div>
                              <h5 className="font-semibold mb-2">Definitions</h5>
                              {question.options?.map((pair, idx) => {
                                const [, def] = pair.split('|');
                                return <div key={idx} className="mb-1">{String.fromCharCode(65 + idx)}. {def}</div>;
                              })}
                            </div>
                          </div>
                        )}

                        {(question.type === 'Short Answer' || question.type === 'Fill in the Blank') && (
                          <div className="ml-4">
                            <div className="border-b border-gray-300 w-48 h-6"></div>
                          </div>
                        )}

                        {question.type === 'Word Bank' && (
                          <div className="ml-4 mt-2">
                            <p className="text-sm text-gray-600">Word Bank: {question.options?.join(', ') || 'No words specified'}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {worksheetData.questions.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Your worksheet preview will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorksheetEditor;