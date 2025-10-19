// components/QuizEditor.tsx
import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, Check, X } from 'lucide-react';
import { ParsedQuiz, QuizQuestion } from '../types/quiz';

interface QuizEditorProps {
  quiz: ParsedQuiz;
  onSave: (quiz: ParsedQuiz) => void;
  onCancel: () => void;
}

const QuizEditor: React.FC<QuizEditorProps> = ({ quiz: initialQuiz, onSave, onCancel }) => {
  const [quiz, setQuiz] = useState<ParsedQuiz>(JSON.parse(JSON.stringify(initialQuiz)));

  const updateMetadata = (field: keyof ParsedQuiz['metadata'], value: any) => {
    setQuiz(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value }
    }));
  };

  const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, ...updates } : q
      )
    }));
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q_${Date.now()}`,
      type: 'multiple-choice',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      cognitiveLevel: '',
      points: 1
    };
    setQuiz(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
      metadata: { ...prev.metadata, totalQuestions: prev.questions.length + 1 }
    }));
  };

  const deleteQuestion = (index: number) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
      metadata: { ...prev.metadata, totalQuestions: prev.questions.length - 1 }
    }));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= quiz.questions.length) return;

    const newQuestions = [...quiz.questions];
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    setQuiz(prev => ({ ...prev, questions: newQuestions }));
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setQuiz(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i !== questionIndex) return q;
        const newOptions = [...(q.options || [])];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      })
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-cyan-50 to-blue-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Quiz</h2>
        
        {/* Metadata Editing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
            <input
              type="text"
              value={quiz.metadata.title}
              onChange={(e) => updateMetadata('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
            <input
              type="text"
              value={quiz.metadata.instructions || ''}
              onChange={(e) => updateMetadata('instructions', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="Optional instructions for students"
            />
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        <div className="space-y-4">
          {quiz.questions.map((question, index) => (
            <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:border-cyan-300 transition">
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
                    onChange={(e) => updateQuestion(index, { 
                      type: e.target.value as QuizQuestion['type'],
                      options: e.target.value === 'multiple-choice' ? ['', '', '', ''] :
                               e.target.value === 'true-false' ? ['True', 'False'] : undefined,
                      correctAnswer: e.target.value === 'true-false' ? 'true' : 0
                    })}
                    className="px-2 py-1 text-xs border border-gray-300 rounded"
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="true-false">True/False</option>
                    <option value="fill-blank">Fill in Blank</option>
                    <option value="open-ended">Open-Ended</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => moveQuestion(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-cyan-600 disabled:opacity-30"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveQuestion(index, 'down')}
                    disabled={index === quiz.questions.length - 1}
                    className="p-1 text-gray-500 hover:text-cyan-600 disabled:opacity-30"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => deleteQuestion(index)}
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
                  Question {question.type === 'true-false' ? '(Statement)' : ''}
                </label>
                <textarea
                  value={question.question}
                  onChange={(e) => updateQuestion(index, { question: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder={question.type === 'true-false' 
                    ? "Write a statement that is true or false" 
                    : "Enter your question here"}
                />
              </div>

              {/* Type-Specific Fields */}
              {question.type === 'multiple-choice' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Options</label>
                  {question.options?.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${question.id}`}
                        checked={question.correctAnswer === optIndex}
                        onChange={() => updateQuestion(index, { correctAnswer: optIndex })}
                        className="w-4 h-4 text-cyan-600"
                        title="Mark as correct answer"
                      />
                      <span className="font-medium text-gray-600 w-6">
                        {String.fromCharCode(65 + optIndex)})
                      </span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, optIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500"
                        placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                      />
                    </div>
                  ))}
                </div>
              )}

              {question.type === 'true-false' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`tf-${question.id}`}
                        checked={question.correctAnswer === 'true'}
                        onChange={() => updateQuestion(index, { correctAnswer: 'true' })}
                        className="w-4 h-4 text-cyan-600 mr-2"
                      />
                      True
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name={`tf-${question.id}`}
                        checked={question.correctAnswer === 'false'}
                        onChange={() => updateQuestion(index, { correctAnswer: 'false' })}
                        className="w-4 h-4 text-cyan-600 mr-2"
                      />
                      False
                    </label>
                  </div>
                </div>
              )}

              {question.type === 'fill-blank' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correct Answer
                  </label>
                  <input
                    type="text"
                    value={String(question.correctAnswer || '')}
                    onChange={(e) => updateQuestion(index, { correctAnswer: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter the word/phrase that fills the blank"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use _____ in the question above to show where the blank should be
                  </p>
                </div>
              )}

              {question.type === 'open-ended' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sample Answer / Key Points
                  </label>
                  <textarea
                    value={String(question.correctAnswer || '')}
                    onChange={(e) => updateQuestion(index, { correctAnswer: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="Provide a sample answer or list key points students should include"
                  />
                </div>
              )}

              {/* Optional Fields */}
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Cognitive Level</label>
                  <input
                    type="text"
                    value={question.cognitiveLevel || ''}
                    onChange={(e) => updateQuestion(index, { cognitiveLevel: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    placeholder="e.g., Knowledge"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Points</label>
                  <input
                    type="number"
                    value={question.points || 1}
                    onChange={(e) => updateQuestion(index, { points: parseInt(e.target.value) || 1 })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Explanation</label>
                  <input
                    type="text"
                    value={question.explanation || ''}
                    onChange={(e) => updateQuestion(index, { explanation: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                    placeholder="Optional"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Question Button */}
        <button
          onClick={addQuestion}
          className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-cyan-400 hover:text-cyan-600 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Question
        </button>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''} • 
          Total points: {quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0)}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            onClick={() => onSave(quiz)}
            className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700"
          >
            <Check className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizEditor;