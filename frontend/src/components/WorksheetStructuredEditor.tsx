import React, { useState } from 'react';
import { Plus, Trash2, ChevronUp, ChevronDown, Check, X } from 'lucide-react';
import { ParsedWorksheet, WorksheetQuestion } from '../types/worksheet';

interface WorksheetStructuredEditorProps {
  worksheet: ParsedWorksheet;
  onSave: (editedWorksheet: ParsedWorksheet) => void;
  onCancel: () => void;
  accentColor?: string;
}

const WorksheetStructuredEditor: React.FC<WorksheetStructuredEditorProps> = ({
  worksheet: initialWorksheet,
  onSave,
  onCancel,
  accentColor = '#3b82f6' // Blue for worksheets
}) => {
  const [worksheet, setWorksheet] = useState<ParsedWorksheet>(
    JSON.parse(JSON.stringify(initialWorksheet))
  );

  // Metadata editing
  const updateMetadata = (field: keyof ParsedWorksheet['metadata'], value: string) => {
    setWorksheet(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value }
    }));
  };

  // Question management
  const addQuestion = () => {
    const newQuestion: WorksheetQuestion = {
      id: `q_${Date.now()}`,
      question: '',
      type: 'fill-blank',
      correctAnswer: ''
    };
    setWorksheet(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (index: number, updates: Partial<WorksheetQuestion>) => {
    setWorksheet(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, ...updates } : q
      )
    }));
  };

  const deleteQuestion = (index: number) => {
    setWorksheet(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= worksheet.questions.length) return;

    const newQuestions = [...worksheet.questions];
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    setWorksheet(prev => ({ ...prev, questions: newQuestions }));
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    setWorksheet(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i !== questionIndex) return q;
        const newOptions = [...(q.options || [])];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      })
    }));
  };

  const addOption = (questionIndex: number) => {
    setWorksheet(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i !== questionIndex) return q;
        return {
          ...q,
          options: [...(q.options || []), `Option ${String.fromCharCode(65 + (q.options?.length || 0))}`]
        };
      })
    }));
  };

  const deleteOption = (questionIndex: number, optionIndex: number) => {
    setWorksheet(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => {
        if (i !== questionIndex) return q;
        return {
          ...q,
          options: q.options?.filter((_, idx) => idx !== optionIndex)
        };
      })
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-5xl mx-auto max-h-[90vh] flex flex-col">
      {/* Gradient Header - BLUE theme for worksheets */}
      <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Worksheet</h2>
        
        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Worksheet Title
            </label>
            <input
              type="text"
              value={worksheet.metadata.title}
              onChange={(e) => updateMetadata('title', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              placeholder="Enter worksheet title"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={worksheet.metadata.subject}
              onChange={(e) => updateMetadata('subject', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              placeholder="e.g., Science"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Grade Level
            </label>
            <input
              type="text"
              value={worksheet.metadata.gradeLevel}
              onChange={(e) => updateMetadata('gradeLevel', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              placeholder="e.g., Grade 4"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 mb-2">
              Instructions (Optional)
            </label>
            <input
              type="text"
              value={worksheet.metadata.instructions || ''}
              onChange={(e) => updateMetadata('instructions', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              placeholder="e.g., Use the word bank to fill in the blanks"
            />
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="p-6 space-y-4 overflow-y-auto flex-1">
        {worksheet.questions.map((question, index) => (
          <div
            key={question.id || index}
            className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
          >
            {/* Question header with controls */}
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-gray-800">Question {index + 1}</h4>
              <div className="flex gap-2">
                <button
                  onClick={() => moveQuestion(index, 'up')}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  title="Move up"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => moveQuestion(index, 'down')}
                  disabled={index === worksheet.questions.length - 1}
                  className="p-1 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  title="Move down"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteQuestion(index)}
                  className="p-1 rounded hover:bg-red-100 text-red-600 transition"
                  title="Delete question"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Question text */}
            <div className="mb-3">
              <label className="block text-sm text-gray-600 mb-1">Question Text</label>
              <textarea
                value={question.question}
                onChange={(e) => updateQuestion(index, { question: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={2}
                placeholder="Enter question text..."
              />
            </div>

            {/* Options (for multiple choice) */}
            {question.options && question.options.length > 0 && (
              <div className="mb-3">
                <label className="text-sm text-gray-600 mb-2 block">Options:</label>
                <div className="space-y-2">
                  {question.options.map((option, optIndex) => (
                    <div key={optIndex} className="flex gap-2">
                      <span className="text-sm font-medium text-gray-500 mt-2">
                        {String.fromCharCode(65 + optIndex)})
                      </span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, optIndex, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                      />
                      <button
                        onClick={() => deleteOption(index, optIndex)}
                        className="p-2 rounded hover:bg-red-100 text-red-600"
                        title="Delete option"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(index)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    + Add Option
                  </button>
                </div>
              </div>
            )}

            {/* Answer field */}
            {question.correctAnswer !== undefined && (
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Correct Answer {question.options ? '(Letter or Full Answer)' : ''}:
                </label>
                <input
                  type="text"
                  value={question.correctAnswer}
                  onChange={(e) => updateQuestion(index, { correctAnswer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter correct answer..."
                />
              </div>
            )}
          </div>
        ))}

        {/* Add Question Button */}
        <button
          onClick={addQuestion}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5 text-blue-600" />
          <span className="text-blue-600 font-medium">Add Question</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 p-6 border-t border-gray-200 rounded-b-lg">
        <button
          onClick={onCancel}
          className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition font-medium flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          onClick={() => onSave(worksheet)}
          className="px-6 py-2 rounded-lg text-white hover:opacity-90 transition font-medium shadow-md flex items-center gap-2"
          style={{ backgroundColor: accentColor }}
        >
          <Check className="w-4 h-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default WorksheetStructuredEditor;
