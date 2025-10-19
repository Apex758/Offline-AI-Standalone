// components/RubricEditor.tsx
import React, { useState } from 'react';
import { Plus, Trash2, Check, X, GripVertical } from 'lucide-react';

// Define the rubric data structure
export interface CriteriaRow {
  id: string;
  criterion: string;
  levels: { [key: string]: string }; // key is performance level name, value is description
  points?: { [key: string]: number }; // optional points for each level
}

export interface ParsedRubric {
  metadata: {
    title: string;
    assignmentType: string;
    subject: string;
    gradeLevel: string;
    learningObjectives?: string;
    specificRequirements?: string;
    includePointValues: boolean;
  };
  performanceLevels: string[]; // e.g., ["Excellent", "Good", "Satisfactory", "Needs Improvement"]
  criteria: CriteriaRow[];
}

interface RubricEditorProps {
  rubric: ParsedRubric;
  onSave: (editedRubric: ParsedRubric) => void;
  onCancel: () => void;
}

const RubricEditor: React.FC<RubricEditorProps> = ({ rubric: initialRubric, onSave, onCancel }) => {
  // Deep clone to prevent mutations
  const [rubric, setRubric] = useState<ParsedRubric>(JSON.parse(JSON.stringify(initialRubric)));

  const updateMetadata = (field: keyof ParsedRubric['metadata'], value: string | boolean) => {
    setRubric(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value }
    }));
  };

  const updatePerformanceLevel = (index: number, value: string) => {
    setRubric(prev => ({
      ...prev,
      performanceLevels: prev.performanceLevels.map((level, i) => 
        i === index ? value : level
      )
    }));
  };

  const addPerformanceLevel = () => {
    const newLevel = 'New Level';
    setRubric(prev => ({
      ...prev,
      performanceLevels: [...prev.performanceLevels, newLevel],
      criteria: prev.criteria.map(criterion => ({
        ...criterion,
        levels: { ...criterion.levels, [newLevel]: '' },
        points: criterion.points ? { ...criterion.points, [newLevel]: 0 } : undefined
      }))
    }));
  };

  const removePerformanceLevel = (index: number) => {
    const levelToRemove = rubric.performanceLevels[index];
    setRubric(prev => ({
      ...prev,
      performanceLevels: prev.performanceLevels.filter((_, i) => i !== index),
      criteria: prev.criteria.map(criterion => {
        const newLevels = { ...criterion.levels };
        delete newLevels[levelToRemove];
        const newPoints = criterion.points ? { ...criterion.points } : undefined;
        if (newPoints) delete newPoints[levelToRemove];
        return {
          ...criterion,
          levels: newLevels,
          points: newPoints
        };
      })
    }));
  };

  const updateCriterion = (criterionId: string, field: keyof CriteriaRow, value: string | { [key: string]: string } | { [key: string]: number }) => {
    setRubric(prev => ({
      ...prev,
      criteria: prev.criteria.map(c =>
        c.id === criterionId ? { ...c, [field]: value } : c
      )
    }));
  };

  const updateCriterionLevel = (criterionId: string, levelName: string, description: string) => {
    setRubric(prev => ({
      ...prev,
      criteria: prev.criteria.map(c => 
        c.id === criterionId ? {
          ...c,
          levels: { ...c.levels, [levelName]: description }
        } : c
      )
    }));
  };

  const updateCriterionPoints = (criterionId: string, levelName: string, points: number) => {
    setRubric(prev => ({
      ...prev,
      criteria: prev.criteria.map(c => 
        c.id === criterionId ? {
          ...c,
          points: { ...(c.points || {}), [levelName]: points }
        } : c
      )
    }));
  };

  const addCriterion = () => {
    const newCriterion: CriteriaRow = {
      id: `criterion_${Date.now()}`,
      criterion: '',
      levels: rubric.performanceLevels.reduce((acc, level) => {
        acc[level] = '';
        return acc;
      }, {} as { [key: string]: string }),
      points: rubric.metadata.includePointValues ? rubric.performanceLevels.reduce((acc, level) => {
        acc[level] = 0;
        return acc;
      }, {} as { [key: string]: number }) : undefined
    };
    setRubric(prev => ({
      ...prev,
      criteria: [...prev.criteria, newCriterion]
    }));
  };

  const deleteCriterion = (criterionId: string) => {
    setRubric(prev => ({
      ...prev,
      criteria: prev.criteria.filter(c => c.id !== criterionId)
    }));
  };

  const moveCriterion = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= rubric.criteria.length) return;

    const newCriteria = [...rubric.criteria];
    [newCriteria[index], newCriteria[newIndex]] = [newCriteria[newIndex], newCriteria[index]];
    setRubric(prev => ({ ...prev, criteria: newCriteria }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-cyan-50 to-blue-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Rubric</h2>
        
        {/* Metadata Editing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rubric Title</label>
            <input
              type="text"
              value={rubric.metadata.title}
              onChange={(e) => updateMetadata('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Type</label>
            <input
              type="text"
              value={rubric.metadata.assignmentType}
              onChange={(e) => updateMetadata('assignmentType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={rubric.metadata.subject}
              onChange={(e) => updateMetadata('subject', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
            <input
              type="text"
              value={rubric.metadata.gradeLevel}
              onChange={(e) => updateMetadata('gradeLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {/* Performance Levels */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Performance Levels</h3>
            <button
              onClick={addPerformanceLevel}
              className="flex items-center px-3 py-1.5 text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Level
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {rubric.performanceLevels.map((level, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={level}
                  onChange={(e) => updatePerformanceLevel(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="Level name"
                />
                {rubric.performanceLevels.length > 2 && (
                  <button
                    onClick={() => removePerformanceLevel(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded"
                    title="Remove level"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Criteria Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Criteria</h3>
          {rubric.criteria.map((criterion, index) => (
            <div key={criterion.id} className="border border-gray-200 rounded-lg p-4 hover:border-cyan-300 transition">
              {/* Criterion Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1">
                  <button
                    className="p-1 hover:bg-gray-100 rounded cursor-move"
                    title="Drag to reorder"
                  >
                    <GripVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Criterion {index + 1}
                    </label>
                    <input
                      type="text"
                      value={criterion.criterion}
                      onChange={(e) => updateCriterion(criterion.id, 'criterion', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                      placeholder="Enter criterion name (e.g., Content Knowledge, Organization)"
                    />
                  </div>
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => moveCriterion(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-cyan-600 disabled:opacity-30"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveCriterion(index, 'down')}
                    disabled={index === rubric.criteria.length - 1}
                    className="p-1 text-gray-500 hover:text-cyan-600 disabled:opacity-30"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => deleteCriterion(criterion.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Delete criterion"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Performance Level Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {rubric.performanceLevels.map((levelName) => (
                  <div key={levelName} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">{levelName}</label>
                      {rubric.metadata.includePointValues && (
                        <input
                          type="number"
                          value={criterion.points?.[levelName] || 0}
                          onChange={(e) => updateCriterionPoints(criterion.id, levelName, parseInt(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-cyan-500"
                          placeholder="pts"
                          min="0"
                        />
                      )}
                    </div>
                    <textarea
                      value={criterion.levels[levelName] || ''}
                      onChange={(e) => updateCriterionLevel(criterion.id, levelName, e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                      placeholder={`Description for ${levelName} level`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Add Criterion Button */}
        <button
          onClick={addCriterion}
          className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-cyan-400 hover:text-cyan-600 transition flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Criterion
        </button>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {rubric.criteria.length} criteria • {rubric.performanceLevels.length} performance levels
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
            onClick={() => onSave(rubric)}
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

export default RubricEditor;