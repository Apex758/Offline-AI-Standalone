import React, { useState, useEffect } from 'react';
import { FileText, Eye, Save, Plus, Trash2, GripVertical, Users, GraduationCap, Check } from 'lucide-react';

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
  'Calculations',
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

  const [viewMode, setViewMode] = useState<'student' | 'teacher'>('student');

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

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= worksheetData.questions.length) return;

    const newQuestions = [...worksheetData.questions];
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    setWorksheetData(prev => ({ ...prev, questions: newQuestions }));
  };

  const addOption = (questionId: string) => {
    setWorksheetData(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? { ...q, options: [...(q.options || []), `Option ${String.fromCharCode(65 + (q.options?.length || 0))}`] }
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
        <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Worksheet Editor</h2>
          
          {/* Metadata Editing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={worksheetData.title}
                onChange={(e) => handleWorksheetChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Worksheet Title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                value={worksheetData.subject}
                onChange={(e) => handleWorksheetChange('subject', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Mathematics"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grade Level
              </label>
              <input
                type="text"
                value={worksheetData.gradeLevel}
                onChange={(e) => handleWorksheetChange('gradeLevel', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 3"
              />
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {worksheetData.questions.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
                {/* Question Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1 hover:bg-gray-100 rounded cursor-move"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-4 h-4 text-gray-400" />
                    </button>
                    <span className="text-sm font-semibold text-gray-700">Question {index + 1}</span>
                    <select
                      value={question.type}
                      onChange={(e) => updateQuestion(question.id, { type: e.target.value })}
                      className="px-2 py-1 text-xs border border-gray-300 rounded"
                    >
                      {questionTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveQuestion(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-500 hover:text-blue-600 disabled:opacity-30"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveQuestion(index, 'down')}
                      disabled={index === worksheetData.questions.length - 1}
                      className="p-1 text-gray-500 hover:text-blue-600 disabled:opacity-30"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Delete question"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Question Text
                  </label>
                  <textarea
                    value={question.text}
                    onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your question here..."
                  />
                </div>

                {/* Comprehension Passage */}
                {question.type === 'Comprehension' && (
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Passage
                    </label>
                    <textarea
                      value={question.passage || ''}
                      onChange={(e) => updateQuestion(question.id, { passage: e.target.value })}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter the reading passage..."
                    />
                  </div>
                )}

                {/* Multiple Choice / True False Options */}
                {(question.type === 'Multiple Choice' || question.type === 'True / False') && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">Options</label>
                      {question.type === 'Multiple Choice' && (
                        <button
                          onClick={() => addOption(question.id)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          <Plus className="w-3 h-3 inline mr-1" />
                          Add Option
                        </button>
                      )}
                    </div>
                    {question.options?.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${question.id}`}
                          checked={question.correctAnswer === option}
                          onChange={() => updateQuestion(question.id, { correctAnswer: option })}
                          className="w-4 h-4 text-blue-600"
                          title="Mark as correct answer"
                        />
                        <span className="font-medium text-gray-600 w-6">
                          {String.fromCharCode(65 + optIndex)})
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                        />
                        {question.type === 'Multiple Choice' && question.options && question.options.length > 2 && (
                          <button
                            onClick={() => deleteOption(question.id, optIndex)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Matching Pairs */}
                {question.type === 'Matching' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Matching Pairs (format: term1|definition1, term2|definition2)
                    </label>
                    <textarea
                      value={question.options?.join(', ') || ''}
                      onChange={(e) => updateQuestion(question.id, { options: e.target.value.split(', ').map(s => s.trim()) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="apple|fruit, dog|animal"
                    />
                  </div>
                )}

                {/* Word Bank */}
                {question.type === 'Word Bank' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Word Bank (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={question.options?.join(', ') || ''}
                      onChange={(e) => updateQuestion(question.id, { options: e.target.value.split(',').map(s => s.trim()) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="word1, word2, word3"
                    />
                  </div>
                )}

                {/* Fill in Blank / Short Answer - Correct Answer */}
                {(question.type === 'Fill in the Blank' || question.type === 'Short Answer') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correct Answer
                    </label>
                    <input
                      type="text"
                      value={question.correctAnswer || ''}
                      onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder={question.type === 'Fill in the Blank' ? 'Enter the word/phrase' : 'Enter sample answer'}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add Question Button */}
          <button
            onClick={addQuestion}
            className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Question
          </button>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {worksheetData.questions.length} question{worksheetData.questions.length !== 1 ? 's' : ''}
          </div>
          <button
            onClick={() => {
              console.log('Saving worksheet:', worksheetData);
              // TODO: Implement actual save
            }}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Worksheet
          </button>
        </div>
      </div>

      {/* Right Panel - Preview (50%) */}
      <div className="bg-gray-50 border-l border-gray-200 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Worksheet Preview
              </h3>
              <p className="text-sm text-gray-500">Live preview of your worksheet</p>
            </div>
            
            {/* Student/Teacher Toggle */}
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('student')}
                className={`flex items-center px-3 py-1.5 rounded transition text-sm ${
                  viewMode === 'student'
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Users className="w-4 h-4 mr-1.5" />
                Student
                {viewMode === 'student' && <Check className="w-3 h-3 ml-1.5" />}
              </button>
              <button
                onClick={() => setViewMode('teacher')}
                className={`flex items-center px-3 py-1.5 rounded transition text-sm ${
                  viewMode === 'teacher'
                    ? 'bg-green-100 text-green-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <GraduationCap className="w-4 h-4 mr-1.5" />
                Teacher
                {viewMode === 'teacher' && <Check className="w-3 h-3 ml-1.5" />}
              </button>
            </div>
          </div>
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
                            {question.options?.map((option, optIndex) => {
                              const isCorrect = question.correctAnswer === option;
                              return (
                                <div key={optIndex} className="flex items-center space-x-2">
                                  <span className={`w-6 h-6 border rounded-full flex items-center justify-center text-xs ${
                                    isCorrect && viewMode === 'teacher'
                                      ? 'border-green-500 bg-green-50 text-green-700 font-semibold'
                                      : 'border-gray-300'
                                  }`}>
                                    {String.fromCharCode(65 + optIndex)}
                                  </span>
                                  <span className={isCorrect && viewMode === 'teacher' ? 'font-semibold' : ''}>
                                    {option}
                                  </span>
                                  {isCorrect && viewMode === 'teacher' && (
                                    <span className="text-xs text-green-700 ml-1">✓ Answer</span>
                                  )}
                                </div>
                              );
                            })}
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

                        {(question.type === 'Short Answer' || question.type === 'Fill in the Blank' || question.type === 'Calculations') && (
                          <div className="ml-4">
                            {viewMode === 'teacher' && question.correctAnswer ? (
                              <div className="p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                                <span className="font-semibold">Answer:</span> {question.correctAnswer}
                              </div>
                            ) : (
                              <div className="border-b border-gray-300 w-full h-6"></div>
                            )}
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