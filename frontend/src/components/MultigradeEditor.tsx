// components/MultigradeEditor.tsx
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { ParsedMultigrade } from '../types/multigrade';

interface MultigradeEditorProps {
  plan: ParsedMultigrade;
  onSave: (editedPlan: ParsedMultigrade) => void;
  onCancel: () => void;
}

const MultigradeEditor: React.FC<MultigradeEditorProps> = ({ plan: initialPlan, onSave, onCancel }) => {
  // Deep clone to prevent mutations
  const [plan, setPlan] = useState<ParsedMultigrade>(JSON.parse(JSON.stringify(initialPlan)));

  // Color scheme for different grades
  const gradeColors: { [key: string]: string } = {
    'Kindergarten': '#10b981',
    'Grade 1': '#3b82f6',
    'Grade 2': '#8b5cf6',
    'Grade 3': '#f59e0b',
    'Grade 4': '#ef4444',
    'Grade 5': '#06b6d4',
    'Grade 6': '#ec4899',
  };

  const getGradeColor = (gradeLevel: string): string => {
    return gradeColors[gradeLevel] || '#6b7280';
  };

  const updateMetadata = (field: keyof ParsedMultigrade['metadata'], value: string | string[]) => {
    setPlan(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value }
    }));
  };

  // Update common objective
  const updateCommonObjective = (value: string) => {
    setPlan(prev => ({
      ...prev,
      sharedObjectives: {
        ...prev.sharedObjectives,
        common: value
      }
    }));
  };

  // Update grade-specific objective
  const updateGradeObjective = (gradeLevel: string, value: string) => {
    setPlan(prev => ({
      ...prev,
      sharedObjectives: {
        ...prev.sharedObjectives,
        gradeSpecific: prev.sharedObjectives.gradeSpecific.map(gs =>
          gs.grade === gradeLevel ? { ...gs, objective: value } : gs
        )
      }
    }));
  };

  // Update shared material
  const updateSharedMaterial = (index: number, value: string) => {
    setPlan(prev => ({
      ...prev,
      materials: {
        ...prev.materials,
        shared: prev.materials.shared.map((m, i) => i === index ? value : m)
      }
    }));
  };

  // Update section content
  const updateSection = (sectionId: string, content: string) => {
    setPlan(prev => ({
      ...prev,
      sections: prev.sections.map(s =>
        s.id === sectionId ? { ...s, content } : s
      )
    }));
  };

  // Update common assessment
  const updateCommonAssessment = (index: number, value: string) => {
    setPlan(prev => ({
      ...prev,
      assessmentStrategies: {
        ...prev.assessmentStrategies,
        common: prev.assessmentStrategies.common.map((a, i) => i === index ? value : a)
      }
    }));
  };

  // Update grade-specific assessment criteria
  const updateGradeAssessment = (gradeLevel: string, value: string) => {
    setPlan(prev => ({
      ...prev,
      assessmentStrategies: {
        ...prev.assessmentStrategies,
        gradeSpecific: prev.assessmentStrategies.gradeSpecific.map(gs =>
          gs.grade === gradeLevel ? { ...gs, criteria: value } : gs
        )
      }
    }));
  };

  // Update differentiation notes for a grade
  const updateDifferentiationNote = (gradeLevel: string, value: string) => {
    setPlan(prev => ({
      ...prev,
      differentiationNotes: prev.differentiationNotes.map(dn =>
        dn.grade === gradeLevel ? { ...dn, notes: value } : dn
      )
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-cyan-50 to-blue-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Multigrade Plan</h2>
        
        {/* Metadata Editing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Title/Topic</label>
            <input
              type="text"
              value={plan.metadata.title}
              onChange={(e) => updateMetadata('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter plan title or topic"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={plan.metadata.subject}
              onChange={(e) => updateMetadata('subject', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
            <input
              type="text"
              value={plan.metadata.duration}
              onChange={(e) => updateMetadata('duration', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., 45 minutes"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Students</label>
            <input
              type="text"
              value={plan.metadata.totalStudents}
              onChange={(e) => updateMetadata('totalStudents', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {/* Common Objective */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Common Learning Objective (All Grades)</h3>
          <textarea
            value={plan.sharedObjectives.common}
            onChange={(e) => updateCommonObjective(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            placeholder="Enter the common conceptual understanding for all grades"
          />
        </div>

        {/* Grade-Specific Objectives */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Grade-Specific Objectives</h3>
          <div className="space-y-3">
            {plan.sharedObjectives.gradeSpecific.map((gradeObj) => (
              <div key={gradeObj.grade} className="border border-gray-200 rounded-lg p-3">
                <label className="block text-sm font-medium mb-2" style={{ color: getGradeColor(gradeObj.grade) }}>
                  {gradeObj.grade}
                </label>
                <textarea
                  value={gradeObj.objective}
                  onChange={(e) => updateGradeObjective(gradeObj.grade, e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder={`Objective for ${gradeObj.grade}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Shared Materials */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Shared Materials (All Grades)</h3>
          <div className="space-y-2">
            {plan.materials.shared.map((material, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">•</span>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => updateSharedMaterial(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter shared material"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Lesson Sections */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Lesson Procedures</h3>
          <div className="space-y-4">
            {plan.sections.map((section) => (
              <div key={section.id} className="border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-700 mb-2">{section.name}</h5>
                <textarea
                  value={section.content}
                  onChange={(e) => updateSection(section.id, e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="Section content"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Common Assessment Strategies */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Common Assessment Strategies</h3>
          <div className="space-y-2">
            {plan.assessmentStrategies.common.map((assessment, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">•</span>
                <input
                  type="text"
                  value={assessment}
                  onChange={(e) => updateCommonAssessment(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter assessment strategy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Grade-Specific Assessment Criteria */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Grade-Specific Success Criteria</h3>
          <div className="space-y-3">
            {plan.assessmentStrategies.gradeSpecific.map((gradeAssess) => (
              <div key={gradeAssess.grade} className="border border-gray-200 rounded-lg p-3">
                <label className="block text-sm font-medium mb-2" style={{ color: getGradeColor(gradeAssess.grade) }}>
                  {gradeAssess.grade}
                </label>
                <textarea
                  value={gradeAssess.criteria}
                  onChange={(e) => updateGradeAssessment(gradeAssess.grade, e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder={`Success criteria for ${gradeAssess.grade}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Differentiation Notes */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Differentiation Across Grades</h3>
          <div className="space-y-3">
            {plan.differentiationNotes.map((diffNote) => (
              <div key={diffNote.grade} className="border border-gray-200 rounded-lg p-3">
                <label className="block text-sm font-medium mb-2" style={{ color: getGradeColor(diffNote.grade) }}>
                  {diffNote.grade}
                </label>
                <textarea
                  value={diffNote.notes}
                  onChange={(e) => updateDifferentiationNote(diffNote.grade, e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder={`Differentiation notes for ${diffNote.grade}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Optional Fields */}
        <div className="space-y-4">
          {plan.classroomManagement && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Classroom Management Strategies</label>
              <textarea
                value={plan.classroomManagement || ''}
                onChange={(e) => setPlan(prev => ({ ...prev, classroomManagement: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                placeholder="Classroom management strategies"
              />
            </div>
          )}

          {plan.extensionsAndModifications && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Extensions and Modifications</label>
              <textarea
                value={plan.extensionsAndModifications || ''}
                onChange={(e) => setPlan(prev => ({ ...prev, extensionsAndModifications: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                placeholder="Extensions and modifications"
              />
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {plan.metadata.gradeLevels.length} grade level{plan.metadata.gradeLevels.length !== 1 ? 's' : ''} • 
          {plan.sections.length} section{plan.sections.length !== 1 ? 's' : ''} • 
          {plan.materials.shared.length} shared material{plan.materials.shared.length !== 1 ? 's' : ''}
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
            onClick={() => onSave(plan)}
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

export default MultigradeEditor;
