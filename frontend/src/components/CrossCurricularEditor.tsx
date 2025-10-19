// components/CrossCurricularEditor.tsx
import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, Check, X, BookOpen, Link2 } from 'lucide-react';

// Subject color scheme for visual distinction
const SUBJECT_COLORS: { [key: string]: string } = {
  'Mathematics': '#3b82f6',
  'Language Arts': '#8b5cf6',
  'Science': '#10b981',
  'Social Studies': '#f59e0b',
  'Arts': '#ec4899',
  'Physical Education': '#06b6d4',
  'Technology': '#6366f1',
};

// Define subject-specific objective
export interface SubjectObjective {
  id: string;
  subject: string;
  objective: string;
}

// Define cross-curricular activity
export interface CrossCurricularActivity {
  id: string;
  name: string;
  description: string;
  subjects: string[]; // Which subjects are involved
  duration?: string;
}

// Define material with subject tags
export interface Material {
  id: string;
  name: string;
  subjects?: string[]; // Empty means common to all subjects
}

// Define the parsed cross-curricular plan data structure
export interface ParsedCrossCurricularPlan {
  metadata: {
    title: string;
    theme: string; // Big Idea/Driving Concept
    primarySubject: string;
    integrationSubjects: string[]; // Supporting subjects being integrated
    gradeLevel: string;
    duration: string;
    integrationModel: string; // Parallel, Sequential, Thematic, etc.
    date?: string;
  };
  learningStandards: string;
  subjectObjectives: SubjectObjective[]; // Objectives per subject
  crossCurricularActivities: CrossCurricularActivity[];
  materials: Material[];
  assessmentStrategies: string[];
  differentiationNotes?: string;
  reflectionPrompts?: string;
  keyVocabulary?: string;
}

interface CrossCurricularEditorProps {
  plan: ParsedCrossCurricularPlan;
  onSave: (editedPlan: ParsedCrossCurricularPlan) => void;
  onCancel: () => void;
}

const CrossCurricularEditor: React.FC<CrossCurricularEditorProps> = ({ plan: initialPlan, onSave, onCancel }) => {
  // Deep clone to prevent mutations
  const [plan, setPlan] = useState<ParsedCrossCurricularPlan>(JSON.parse(JSON.stringify(initialPlan)));
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  const getSubjectColor = (subject: string): string => {
    return SUBJECT_COLORS[subject] || '#6b7280';
  };

  const allSubjects = [plan.metadata.primarySubject, ...plan.metadata.integrationSubjects];

  const updateMetadata = (field: keyof ParsedCrossCurricularPlan['metadata'], value: string | string[]) => {
    setPlan(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value }
    }));
  };

  // Subject Objectives functions
  const addSubjectObjective = (subject: string) => {
    const newObjective: SubjectObjective = {
      id: `obj_${Date.now()}`,
      subject,
      objective: ''
    };
    setPlan(prev => ({
      ...prev,
      subjectObjectives: [...prev.subjectObjectives, newObjective]
    }));
  };

  const updateSubjectObjective = (objectiveId: string, field: keyof SubjectObjective, value: string) => {
    setPlan(prev => ({
      ...prev,
      subjectObjectives: prev.subjectObjectives.map(obj =>
        obj.id === objectiveId ? { ...obj, [field]: value } : obj
      )
    }));
  };

  const deleteSubjectObjective = (objectiveId: string) => {
    setPlan(prev => ({
      ...prev,
      subjectObjectives: prev.subjectObjectives.filter(obj => obj.id !== objectiveId)
    }));
  };

  // Activity functions
  const addActivity = () => {
    const newActivity: CrossCurricularActivity = {
      id: `activity_${Date.now()}`,
      name: '',
      description: '',
      subjects: [plan.metadata.primarySubject],
      duration: ''
    };
    setPlan(prev => ({
      ...prev,
      crossCurricularActivities: [...prev.crossCurricularActivities, newActivity]
    }));
  };

  const updateActivity = (activityId: string, field: keyof CrossCurricularActivity, value: string | string[]) => {
    setPlan(prev => ({
      ...prev,
      crossCurricularActivities: prev.crossCurricularActivities.map(a =>
        a.id === activityId ? { ...a, [field]: value } : a
      )
    }));
  };

  const toggleActivitySubject = (activityId: string, subject: string) => {
    setPlan(prev => ({
      ...prev,
      crossCurricularActivities: prev.crossCurricularActivities.map(a => {
        if (a.id !== activityId) return a;
        const subjects = a.subjects || [];
        const hasSubject = subjects.includes(subject);
        return {
          ...a,
          subjects: hasSubject
            ? subjects.filter(s => s !== subject)
            : [...subjects, subject]
        };
      })
    }));
  };

  const deleteActivity = (activityId: string) => {
    setPlan(prev => ({
      ...prev,
      crossCurricularActivities: prev.crossCurricularActivities.filter(a => a.id !== activityId)
    }));
  };

  // Material functions
  const addMaterial = () => {
    const newMaterial: Material = {
      id: `material_${Date.now()}`,
      name: '',
      subjects: []
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

  const toggleMaterialSubject = (materialId: string, subject: string) => {
    setPlan(prev => ({
      ...prev,
      materials: prev.materials.map(m => {
        if (m.id !== materialId) return m;
        const subjects = m.subjects || [];
        const hasSubject = subjects.includes(subject);
        return {
          ...m,
          subjects: hasSubject
            ? subjects.filter(s => s !== subject)
            : [...subjects, subject]
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

  // Filter activities by subject
  const getFilteredActivities = () => {
    if (selectedSubjectFilter === 'all') return plan.crossCurricularActivities;
    return plan.crossCurricularActivities.filter(a => 
      a.subjects.includes(selectedSubjectFilter)
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-cyan-50 to-blue-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Cross-Curricular Plan</h2>
        
        {/* Metadata Editing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Title</label>
            <input
              type="text"
              value={plan.metadata.title}
              onChange={(e) => updateMetadata('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter plan title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Big Idea/Theme</label>
            <input
              type="text"
              value={plan.metadata.theme}
              onChange={(e) => updateMetadata('theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="Central connecting concept"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Primary Subject</label>
            <input
              type="text"
              value={plan.metadata.primarySubject}
              onChange={(e) => updateMetadata('primarySubject', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Integration Model</label>
            <select
              value={plan.metadata.integrationModel}
              onChange={(e) => updateMetadata('integrationModel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            >
              <option value="Multidisciplinary">Multidisciplinary</option>
              <option value="Interdisciplinary">Interdisciplinary</option>
              <option value="Transdisciplinary">Transdisciplinary</option>
              <option value="Parallel">Parallel</option>
              <option value="Sequential">Sequential</option>
              <option value="Thematic">Thematic</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
            <input
              type="text"
              value={plan.metadata.gradeLevel}
              onChange={(e) => updateMetadata('gradeLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <input
              type="text"
              value={plan.metadata.duration}
              onChange={(e) => updateMetadata('duration', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., 45 minutes"
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {/* Learning Standards */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Learning Standards</h3>
          <textarea
            value={plan.learningStandards}
            onChange={(e) => setPlan(prev => ({ ...prev, learningStandards: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            placeholder="Curriculum standards from all integrated subjects"
          />
        </div>

        {/* Subject-Specific Objectives */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
            <BookOpen className="w-5 h-5 mr-2" />
            Subject-Specific Objectives
          </h3>
          <div className="space-y-3">
            {allSubjects.map((subject) => (
              <div key={subject} className="border rounded-lg p-4" style={{ borderColor: `${getSubjectColor(subject)}33`, backgroundColor: `${getSubjectColor(subject)}05` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div 
                      className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ backgroundColor: getSubjectColor(subject) }}
                    >
                      {subject}
                    </div>
                  </div>
                  <button
                    onClick={() => addSubjectObjective(subject)}
                    className="flex items-center px-3 py-1.5 text-sm text-white rounded-lg hover:opacity-90 transition"
                    style={{ backgroundColor: getSubjectColor(subject) }}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Objective
                  </button>
                </div>
                <div className="space-y-2">
                  {plan.subjectObjectives
                    .filter(obj => obj.subject === subject)
                    .map((objective) => (
                      <div key={objective.id} className="flex items-center gap-2">
                        <button
                          className="p-1 hover:bg-gray-100 rounded cursor-move"
                          title="Drag to reorder"
                        >
                          <GripVertical className="w-4 h-4 text-gray-400" />
                        </button>
                        <input
                          type="text"
                          value={objective.objective}
                          onChange={(e) => updateSubjectObjective(objective.id, 'objective', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                          placeholder={`Objective for ${subject}`}
                        />
                        <button
                          onClick={() => deleteSubjectObjective(objective.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                          title="Delete objective"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  {plan.subjectObjectives.filter(obj => obj.subject === subject).length === 0 && (
                    <p className="text-sm text-gray-500 italic">No objectives yet for {subject}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cross-Curricular Activities */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Link2 className="w-5 h-5 mr-2" />
              Cross-Curricular Activities
            </h3>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Filter by:</label>
              <select
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
                className="px-2 py-1 text-sm border border-gray-300 rounded"
              >
                <option value="all">All Subjects</option>
                {allSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-4">
            {getFilteredActivities().map((activity) => (
              <div 
                key={activity.id} 
                className="border border-gray-200 rounded-lg p-4 hover:border-cyan-300 transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex flex-wrap gap-2">
                    {activity.subjects.map(subject => (
                      <div 
                        key={subject}
                        className="px-2 py-1 rounded text-xs font-medium text-white"
                        style={{ backgroundColor: getSubjectColor(subject) }}
                      >
                        {subject}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => deleteActivity(activity.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Delete activity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Activity Name</label>
                    <input
                      type="text"
                      value={activity.name}
                      onChange={(e) => updateActivity(activity.id, 'name', e.target.value)}
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
                      placeholder="Describe the activity and how subjects integrate"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (optional)</label>
                      <input
                        type="text"
                        value={activity.duration || ''}
                        onChange={(e) => updateActivity(activity.id, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                        placeholder="e.g., 20 minutes"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subjects Involved</label>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {allSubjects.map(subject => (
                          <button
                            key={subject}
                            onClick={() => toggleActivitySubject(activity.id, subject)}
                            className={`px-2 py-1 text-xs rounded transition ${
                              activity.subjects.includes(subject)
                                ? 'text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            style={activity.subjects.includes(subject) ? { backgroundColor: getSubjectColor(subject) } : {}}
                          >
                            {subject}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addActivity}
            className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-cyan-400 hover:text-cyan-600 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Cross-Curricular Activity
          </button>
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
                  {material.subjects?.length === 0 ? (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">All Subjects</span>
                  ) : (
                    allSubjects.map(subject => (
                      <button
                        key={subject}
                        onClick={() => toggleMaterialSubject(material.id, subject)}
                        className={`px-2 py-1 text-xs rounded transition ${
                          material.subjects?.includes(subject)
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        style={material.subjects?.includes(subject) ? { backgroundColor: getSubjectColor(subject) } : {}}
                      >
                        {subject}
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
                  placeholder="Enter assessment strategy across subjects"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Key Vocabulary</label>
            <input
              type="text"
              value={plan.keyVocabulary || ''}
              onChange={(e) => setPlan(prev => ({ ...prev, keyVocabulary: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="Important terms from all subjects (comma-separated)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Differentiation Notes</label>
            <textarea
              value={plan.differentiationNotes || ''}
              onChange={(e) => setPlan(prev => ({ ...prev, differentiationNotes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="How to differentiate across learning levels and subjects"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reflection Prompts</label>
            <textarea
              value={plan.reflectionPrompts || ''}
              onChange={(e) => setPlan(prev => ({ ...prev, reflectionPrompts: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="Questions to help students reflect on cross-curricular connections"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {allSubjects.length} subject{allSubjects.length !== 1 ? 's' : ''} • 
          {plan.crossCurricularActivities.length} activit{plan.crossCurricularActivities.length !== 1 ? 'ies' : 'y'} • 
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

export default CrossCurricularEditor;