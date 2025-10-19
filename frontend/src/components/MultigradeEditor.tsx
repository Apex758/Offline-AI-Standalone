// components/MultigradeEditor.tsx
import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, Check, X, Copy, Users } from 'lucide-react';

// Define grade-specific activity structure
export interface GradeActivity {
  id: string;
  gradeLevel: string;
  activityName: string;
  description: string;
  duration?: string;
}

// Define material with optional grade-level tag
export interface Material {
  id: string;
  name: string;
  gradeLevels?: string[]; // Empty means common to all grades
}

// Define the parsed multigrade plan data structure
export interface ParsedMultigradePlan {
  metadata: {
    title: string;
    subject: string;
    gradeLevels: string[]; // e.g., ["Grade 1", "Grade 2", "Grade 3"]
    gradeRange: string; // e.g., "Grade 1 - Grade 3"
    duration: string;
    totalStudents: string;
    date?: string;
  };
  commonObjectives: string[]; // Shared across all grades
  gradeSpecificObjectives: { [gradeLevel: string]: string[] }; // Objectives per grade
  materials: Material[];
  gradeActivities: GradeActivity[]; // All activities with grade labels
  assessmentStrategies: string[];
  differentiationNotes?: string;
  multigradeStrategies?: string[];
  prerequisites?: string;
}

interface MultigradeEditorProps {
  plan: ParsedMultigradePlan;
  onSave: (editedPlan: ParsedMultigradePlan) => void;
  onCancel: () => void;
}

const MultigradeEditor: React.FC<MultigradeEditorProps> = ({ plan: initialPlan, onSave, onCancel }) => {
  // Deep clone to prevent mutations
  const [plan, setPlan] = useState<ParsedMultigradePlan>(JSON.parse(JSON.stringify(initialPlan)));
  const [selectedGrade, setSelectedGrade] = useState<string>(plan.metadata.gradeLevels[0] || '');

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

  const updateMetadata = (field: keyof ParsedMultigradePlan['metadata'], value: string | string[]) => {
    setPlan(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value }
    }));
  };

  // Common Objectives functions
  const addCommonObjective = () => {
    setPlan(prev => ({
      ...prev,
      commonObjectives: [...prev.commonObjectives, '']
    }));
  };

  const updateCommonObjective = (index: number, value: string) => {
    setPlan(prev => ({
      ...prev,
      commonObjectives: prev.commonObjectives.map((obj, i) => 
        i === index ? value : obj
      )
    }));
  };

  const deleteCommonObjective = (index: number) => {
    setPlan(prev => ({
      ...prev,
      commonObjectives: prev.commonObjectives.filter((_, i) => i !== index)
    }));
  };

  // Grade-Specific Objectives functions
  const addGradeObjective = (gradeLevel: string) => {
    setPlan(prev => ({
      ...prev,
      gradeSpecificObjectives: {
        ...prev.gradeSpecificObjectives,
        [gradeLevel]: [...(prev.gradeSpecificObjectives[gradeLevel] || []), '']
      }
    }));
  };

  const updateGradeObjective = (gradeLevel: string, index: number, value: string) => {
    setPlan(prev => ({
      ...prev,
      gradeSpecificObjectives: {
        ...prev.gradeSpecificObjectives,
        [gradeLevel]: (prev.gradeSpecificObjectives[gradeLevel] || []).map((obj, i) => 
          i === index ? value : obj
        )
      }
    }));
  };

  const deleteGradeObjective = (gradeLevel: string, index: number) => {
    setPlan(prev => ({
      ...prev,
      gradeSpecificObjectives: {
        ...prev.gradeSpecificObjectives,
        [gradeLevel]: (prev.gradeSpecificObjectives[gradeLevel] || []).filter((_, i) => i !== index)
      }
    }));
  };

  // Material functions
  const addMaterial = () => {
    const newMaterial: Material = {
      id: `material_${Date.now()}`,
      name: '',
      gradeLevels: []
    };
    setPlan(prev => ({
      ...prev,
      materials: [...prev.materials, newMaterial]
    }));
  };

  const updateMaterial = (materialId: string, field: keyof Material, value: string | string[]) => {
    setPlan(prev => ({
      ...prev,
      materials: prev.materials.map(m =>
        m.id === materialId ? { ...m, [field]: value } : m
      )
    }));
  };

  const toggleMaterialGrade = (materialId: string, gradeLevel: string) => {
    setPlan(prev => ({
      ...prev,
      materials: prev.materials.map(m => {
        if (m.id !== materialId) return m;
        const grades = m.gradeLevels || [];
        const hasGrade = grades.includes(gradeLevel);
        return {
          ...m,
          gradeLevels: hasGrade
            ? grades.filter(g => g !== gradeLevel)
            : [...grades, gradeLevel]
        };
      })
    }));
  };

  const deleteMaterial = (materialId: string) => {
    setPlan(prev => ({
      ...prev,
      materials: prev.materials.filter(m => m.id !== materialId)
    }));
  };

  // Activity functions
  const addActivity = (gradeLevel: string) => {
    const newActivity: GradeActivity = {
      id: `activity_${Date.now()}`,
      gradeLevel,
      activityName: '',
      description: '',
      duration: ''
    };
    setPlan(prev => ({
      ...prev,
      gradeActivities: [...prev.gradeActivities, newActivity]
    }));
  };

  const updateActivity = (activityId: string, field: keyof GradeActivity, value: string) => {
    setPlan(prev => ({
      ...prev,
      gradeActivities: prev.gradeActivities.map(a =>
        a.id === activityId ? { ...a, [field]: value } : a
      )
    }));
  };

  const deleteActivity = (activityId: string) => {
    setPlan(prev => ({
      ...prev,
      gradeActivities: prev.gradeActivities.filter(a => a.id !== activityId)
    }));
  };

  const copyActivityToGrade = (activityId: string, targetGrade: string) => {
    const activity = plan.gradeActivities.find(a => a.id === activityId);
    if (!activity) return;

    const newActivity: GradeActivity = {
      ...activity,
      id: `activity_${Date.now()}`,
      gradeLevel: targetGrade
    };
    setPlan(prev => ({
      ...prev,
      gradeActivities: [...prev.gradeActivities, newActivity]
    }));
  };

  // Assessment functions
  const addAssessment = () => {
    setPlan(prev => ({
      ...prev,
      assessmentStrategies: [...prev.assessmentStrategies, '']
    }));
  };

  const updateAssessment = (index: number, value: string) => {
    setPlan(prev => ({
      ...prev,
      assessmentStrategies: prev.assessmentStrategies.map((assess, i) => 
        i === index ? value : assess
      )
    }));
  };

  const deleteAssessment = (index: number) => {
    setPlan(prev => ({
      ...prev,
      assessmentStrategies: prev.assessmentStrategies.filter((_, i) => i !== index)
    }));
  };

  // Filter activities by selected grade
  const getActivitiesForGrade = (gradeLevel: string) => {
    return plan.gradeActivities.filter(a => a.gradeLevel === gradeLevel);
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade Range</label>
            <input
              type="text"
              value={plan.metadata.gradeRange}
              onChange={(e) => updateMetadata('gradeRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., Grade 1 - Grade 3"
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
        {/* Common Objectives */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Common Learning Objectives (All Grades)</h3>
          <div className="space-y-2">
            {plan.commonObjectives.map((objective, index) => (
              <div key={index} className="flex items-center gap-2">
                <button
                  className="p-1 hover:bg-gray-100 rounded cursor-move"
                  title="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4 text-gray-400" />
                </button>
                <span className="text-sm font-medium text-gray-600 min-w-[1.5rem]">{index + 1}.</span>
                <input
                  type="text"
                  value={objective}
                  onChange={(e) => updateCommonObjective(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter common objective for all grades"
                />
                <button
                  onClick={() => deleteCommonObjective(index)}
                  className="p-1 text-red-500 hover:text-red-700"
                  title="Delete objective"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addCommonObjective}
            className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-cyan-400 hover:text-cyan-600 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Common Objective
          </button>
        </div>

        {/* Grade Level Tabs */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Grade-Specific Content</h3>
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {plan.metadata.gradeLevels.map((grade) => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap flex items-center gap-2 ${
                  selectedGrade === grade
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={selectedGrade === grade ? { backgroundColor: getGradeColor(grade) } : {}}
              >
                <Users className="w-4 h-4" />
                {grade}
              </button>
            ))}
          </div>

          {/* Grade-Specific Objectives */}
          <div className="mb-6 border border-gray-200 rounded-lg p-4" style={{ borderColor: `${getGradeColor(selectedGrade)}33` }}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-semibold" style={{ color: getGradeColor(selectedGrade) }}>
                {selectedGrade} - Specific Objectives
              </h4>
              <button
                onClick={() => addGradeObjective(selectedGrade)}
                className="flex items-center px-3 py-1.5 text-sm text-white rounded-lg hover:opacity-90 transition"
                style={{ backgroundColor: getGradeColor(selectedGrade) }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Objective
              </button>
            </div>
            <div className="space-y-2">
              {(plan.gradeSpecificObjectives[selectedGrade] || []).map((objective, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600 min-w-[1.5rem]">{index + 1}.</span>
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => updateGradeObjective(selectedGrade, index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder={`Objective specific to ${selectedGrade}`}
                  />
                  <button
                    onClick={() => deleteGradeObjective(selectedGrade, index)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Delete objective"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(!plan.gradeSpecificObjectives[selectedGrade] || plan.gradeSpecificObjectives[selectedGrade].length === 0) && (
                <p className="text-sm text-gray-500 italic">No specific objectives yet for {selectedGrade}</p>
              )}
            </div>
          </div>

          {/* Grade-Specific Activities */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-semibold" style={{ color: getGradeColor(selectedGrade) }}>
                {selectedGrade} - Activities
              </h4>
              <button
                onClick={() => addActivity(selectedGrade)}
                className="flex items-center px-3 py-1.5 text-sm text-white rounded-lg hover:opacity-90 transition"
                style={{ backgroundColor: getGradeColor(selectedGrade) }}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Activity
              </button>
            </div>
            <div className="space-y-3">
              {getActivitiesForGrade(selectedGrade).map((activity) => (
                <div 
                  key={activity.id} 
                  className="border rounded-lg p-4 hover:border-cyan-300 transition"
                  style={{ borderColor: `${getGradeColor(selectedGrade)}33`, backgroundColor: `${getGradeColor(selectedGrade)}05` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div 
                        className="px-2 py-1 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: getGradeColor(selectedGrade) }}
                      >
                        {activity.gradeLevel}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="relative group">
                        <button
                          className="p-1 text-gray-500 hover:text-cyan-600"
                          title="Copy to another grade"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 hidden group-hover:block z-10 whitespace-nowrap">
                          {plan.metadata.gradeLevels.filter(g => g !== activity.gradeLevel).map(grade => (
                            <button
                              key={grade}
                              onClick={() => copyActivityToGrade(activity.id, grade)}
                              className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
                            >
                              Copy to {grade}
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteActivity(activity.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Delete activity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Activity Name</label>
                      <input
                        type="text"
                        value={activity.activityName}
                        onChange={(e) => updateActivity(activity.id, 'activityName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                        placeholder="Enter activity name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={activity.description}
                        onChange={(e) => updateActivity(activity.id, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                        placeholder="Describe the activity steps and instructions"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (optional)</label>
                      <input
                        type="text"
                        value={activity.duration || ''}
                        onChange={(e) => updateActivity(activity.id, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                        placeholder="e.g., 15 minutes"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {getActivitiesForGrade(selectedGrade).length === 0 && (
                <p className="text-sm text-gray-500 italic text-center py-4">No activities yet for {selectedGrade}</p>
              )}
            </div>
          </div>
        </div>

        {/* Materials */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Materials Needed</h3>
          <div className="space-y-3">
            {plan.materials.map((material) => (
              <div key={material.id} className="border border-gray-200 rounded-lg p-3 hover:border-cyan-300 transition">
                <div className="flex items-start gap-2 mb-2">
                  <input
                    type="text"
                    value={material.name}
                    onChange={(e) => updateMaterial(material.id, 'name', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="Enter material or resource"
                  />
                  <button
                    onClick={() => deleteMaterial(material.id)}
                    className="p-2 text-red-500 hover:text-red-700"
                    title="Delete material"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 ml-2">
                  <span className="text-xs text-gray-600">Applies to:</span>
                  {material.gradeLevels?.length === 0 ? (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">All Grades</span>
                  ) : (
                    plan.metadata.gradeLevels.map(grade => (
                      <button
                        key={grade}
                        onClick={() => toggleMaterialGrade(material.id, grade)}
                        className={`px-2 py-1 text-xs rounded transition ${
                          material.gradeLevels?.includes(grade)
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        style={material.gradeLevels?.includes(grade) ? { backgroundColor: getGradeColor(grade) } : {}}
                      >
                        {grade}
                      </button>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addMaterial}
            className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-cyan-400 hover:text-cyan-600 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Material
          </button>
        </div>

        {/* Assessment Strategies */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Assessment Strategies</h3>
          <div className="space-y-2">
            {plan.assessmentStrategies.map((assessment, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">•</span>
                <input
                  type="text"
                  value={assessment}
                  onChange={(e) => updateAssessment(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter assessment strategy"
                />
                <button
                  onClick={() => deleteAssessment(index)}
                  className="p-1 text-red-500 hover:text-red-700"
                  title="Delete assessment"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addAssessment}
            className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-cyan-400 hover:text-cyan-600 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Assessment Strategy
          </button>
        </div>

        {/* Optional Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Differentiation Notes</label>
            <textarea
              value={plan.differentiationNotes || ''}
              onChange={(e) => setPlan(prev => ({ ...prev, differentiationNotes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="Additional notes about how to differentiate across grade levels"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prerequisites</label>
            <textarea
              value={plan.prerequisites || ''}
              onChange={(e) => setPlan(prev => ({ ...prev, prerequisites: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="Skills or knowledge students should have before this lesson"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {plan.metadata.gradeLevels.length} grade level{plan.metadata.gradeLevels.length !== 1 ? 's' : ''} • 
          {plan.gradeActivities.length} activit{plan.gradeActivities.length !== 1 ? 'ies' : 'y'} • 
          {plan.materials.length} material{plan.materials.length !== 1 ? 's' : ''}
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