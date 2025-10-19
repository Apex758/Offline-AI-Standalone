// components/KindergartenEditor.tsx
import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, Check, X, Palette, Music, Book, Footprints, Users, Apple } from 'lucide-react';

// Activity type with corresponding icon and color
export interface ActivityType {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export const ACTIVITY_TYPES: ActivityType[] = [
  { id: 'circle-time', name: 'Circle Time', icon: Users, color: '#3b82f6' },
  { id: 'centers', name: 'Learning Centers', icon: Book, color: '#8b5cf6' },
  { id: 'art', name: 'Art Activity', icon: Palette, color: '#ec4899' },
  { id: 'music', name: 'Music/Movement', icon: Music, color: '#10b981' },
  { id: 'story', name: 'Story Time', icon: Book, color: '#f59e0b' },
  { id: 'outdoor', name: 'Outdoor Play', icon: Footprints, color: '#06b6d4' },
  { id: 'snack', name: 'Snack Time', icon: Apple, color: '#ef4444' },
];

export const DEVELOPMENTAL_DOMAINS = [
  'Cognitive',
  'Physical',
  'Social-Emotional',
  'Language',
];

// Define kindergarten activity structure
export interface KindergartenActivity {
  id: string;
  type: string; // Activity type ID
  name: string;
  description: string;
  duration?: string;
  learningGoals?: string;
}

// Define material with age-appropriateness
export interface KindergartenMaterial {
  id: string;
  name: string;
  ageAppropriate: boolean;
  safetyNotes?: string;
}

// Define the parsed kindergarten plan data structure
export interface ParsedKindergartenPlan {
  metadata: {
    title: string;
    theme: string; // Lesson topic
    curriculumUnit: string;
    week: string;
    dayOfWeek: string;
    date: string;
    ageGroup: string;
    students: string;
    duration: string;
  };
  learningObjectives: string[];
  developmentalDomains: string[]; // Selected domains
  activities: KindergartenActivity[];
  materials: KindergartenMaterial[];
  assessmentObservations: string[];
  differentiationNotes?: string;
  prerequisites?: string;
}

interface KindergartenEditorProps {
  plan: ParsedKindergartenPlan;
  onSave: (editedPlan: ParsedKindergartenPlan) => void;
  onCancel: () => void;
}

const KindergartenEditor: React.FC<KindergartenEditorProps> = ({ plan: initialPlan, onSave, onCancel }) => {
  // Deep clone to prevent mutations
  const [plan, setPlan] = useState<ParsedKindergartenPlan>(JSON.parse(JSON.stringify(initialPlan)));

  const getActivityType = (typeId: string): ActivityType => {
    return ACTIVITY_TYPES.find(t => t.id === typeId) || ACTIVITY_TYPES[0];
  };

  const updateMetadata = (field: keyof ParsedKindergartenPlan['metadata'], value: string) => {
    setPlan(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value }
    }));
  };

  // Learning Objectives functions
  const addObjective = () => {
    setPlan(prev => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, '']
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setPlan(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.map((obj, i) => 
        i === index ? value : obj
      )
    }));
  };

  const deleteObjective = (index: number) => {
    setPlan(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
    }));
  };

  // Activity functions
  const addActivity = (typeId: string) => {
    const activityType = getActivityType(typeId);
    const newActivity: KindergartenActivity = {
      id: `activity_${Date.now()}`,
      type: typeId,
      name: activityType.name,
      description: '',
      duration: '',
      learningGoals: ''
    };
    setPlan(prev => ({
      ...prev,
      activities: [...prev.activities, newActivity]
    }));
  };

  const updateActivity = (activityId: string, field: keyof KindergartenActivity, value: string) => {
    setPlan(prev => ({
      ...prev,
      activities: prev.activities.map(a =>
        a.id === activityId ? { ...a, [field]: value } : a
      )
    }));
  };

  const deleteActivity = (activityId: string) => {
    setPlan(prev => ({
      ...prev,
      activities: prev.activities.filter(a => a.id !== activityId)
    }));
  };

  const moveActivity = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= plan.activities.length) return;

    const newActivities = [...plan.activities];
    [newActivities[index], newActivities[newIndex]] = [newActivities[newIndex], newActivities[index]];
    setPlan(prev => ({ ...prev, activities: newActivities }));
  };

  // Material functions
  const addMaterial = () => {
    const newMaterial: KindergartenMaterial = {
      id: `material_${Date.now()}`,
      name: '',
      ageAppropriate: true,
      safetyNotes: ''
    };
    setPlan(prev => ({
      ...prev,
      materials: [...prev.materials, newMaterial]
    }));
  };

  const updateMaterial = (materialId: string, field: keyof KindergartenMaterial, value: string | boolean) => {
    setPlan(prev => ({
      ...prev,
      materials: prev.materials.map(m =>
        m.id === materialId ? { ...m, [field]: value } : m
      )
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
      assessmentObservations: [...prev.assessmentObservations, '']
    }));
  };

  const updateAssessment = (index: number, value: string) => {
    setPlan(prev => ({
      ...prev,
      assessmentObservations: prev.assessmentObservations.map((assess, i) => 
        i === index ? value : assess
      )
    }));
  };

  const deleteAssessment = (index: number) => {
    setPlan(prev => ({
      ...prev,
      assessmentObservations: prev.assessmentObservations.filter((_, i) => i !== index)
    }));
  };

  // Developmental domain toggle
  const toggleDomain = (domain: string) => {
    setPlan(prev => ({
      ...prev,
      developmentalDomains: prev.developmentalDomains.includes(domain)
        ? prev.developmentalDomains.filter(d => d !== domain)
        : [...prev.developmentalDomains, domain]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-cyan-50 to-blue-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Kindergarten Plan</h2>
        
        {/* Metadata Editing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Topic/Title</label>
            <input
              type="text"
              value={plan.metadata.title}
              onChange={(e) => updateMetadata('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter lesson topic"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Curriculum Unit</label>
            <input
              type="text"
              value={plan.metadata.curriculumUnit}
              onChange={(e) => updateMetadata('curriculumUnit', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
            <input
              type="text"
              value={plan.metadata.ageGroup}
              onChange={(e) => updateMetadata('ageGroup', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., 4-5 years"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
            <input
              type="text"
              value={plan.metadata.duration}
              onChange={(e) => updateMetadata('duration', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., 60 minutes"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Week/Day</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={plan.metadata.week}
                onChange={(e) => updateMetadata('week', e.target.value)}
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                placeholder="Week"
              />
              <input
                type="text"
                value={plan.metadata.dayOfWeek}
                onChange={(e) => updateMetadata('dayOfWeek', e.target.value)}
                className="w-2/3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                placeholder="Day of Week"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Students</label>
            <input
              type="text"
              value={plan.metadata.students}
              onChange={(e) => updateMetadata('students', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* Developmental Domains */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Developmental Domains</label>
          <div className="flex flex-wrap gap-2">
            {DEVELOPMENTAL_DOMAINS.map(domain => (
              <button
                key={domain}
                onClick={() => toggleDomain(domain)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  plan.developmentalDomains.includes(domain)
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {/* Learning Objectives */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Learning Objectives</h3>
          <div className="space-y-2">
            {plan.learningObjectives.map((objective, index) => (
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
                  onChange={(e) => updateObjective(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter developmentally appropriate learning objective"
                />
                <button
                  onClick={() => deleteObjective(index)}
                  className="p-1 text-red-500 hover:text-red-700"
                  title="Delete objective"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={addObjective}
            className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-cyan-400 hover:text-cyan-600 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Learning Objective
          </button>
        </div>

        {/* Activity Type Quick-Insert Buttons */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Add Activities</h3>
          <div className="grid grid-cols-3 gap-2">
            {ACTIVITY_TYPES.map(activityType => {
              const Icon = activityType.icon;
              return (
                <button
                  key={activityType.id}
                  onClick={() => addActivity(activityType.id)}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-white font-medium hover:opacity-90 transition"
                  style={{ backgroundColor: activityType.color }}
                >
                  <Icon className="w-4 h-4" />
                  {activityType.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Activities List */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Planned Activities</h3>
          <div className="space-y-3">
            {plan.activities.map((activity, index) => {
              const activityType = getActivityType(activity.type);
              const Icon = activityType.icon;
              return (
                <div 
                  key={activity.id} 
                  className="border rounded-lg p-4 hover:border-cyan-300 transition"
                  style={{ 
                    borderColor: `${activityType.color}33`,
                    backgroundColor: `${activityType.color}05`
                  }}
                >
                  {/* Activity Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1 hover:bg-gray-100 rounded cursor-move"
                        title="Drag to reorder"
                      >
                        <GripVertical className="w-4 h-4 text-gray-400" />
                      </button>
                      <div 
                        className="flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-medium"
                        style={{ backgroundColor: activityType.color }}
                      >
                        <Icon className="w-4 h-4" />
                        {activityType.name}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => moveActivity(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-500 hover:text-cyan-600 disabled:opacity-30"
                        title="Move up"
                      >
                        ↑
                      </button>
                      <button
                        onClick={() => moveActivity(index, 'down')}
                        disabled={index === plan.activities.length - 1}
                        className="p-1 text-gray-500 hover:text-cyan-600 disabled:opacity-30"
                        title="Move down"
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => deleteActivity(activity.id)}
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Delete activity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Activity Fields */}
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
                        placeholder="Describe the activity steps and instructions"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <input
                          type="text"
                          value={activity.duration || ''}
                          onChange={(e) => updateActivity(activity.id, 'duration', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                          placeholder="e.g., 15 minutes"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Learning Goals</label>
                        <input
                          type="text"
                          value={activity.learningGoals || ''}
                          onChange={(e) => updateActivity(activity.id, 'learningGoals', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                          placeholder="What children will learn"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {plan.activities.length === 0 && (
              <p className="text-sm text-gray-500 italic text-center py-4">No activities yet. Use the buttons above to add activities.</p>
            )}
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
                  <label className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={material.ageAppropriate}
                      onChange={(e) => updateMaterial(material.id, 'ageAppropriate', e.target.checked)}
                      className="w-4 h-4 text-cyan-600 rounded"
                    />
                    <span className="text-sm text-gray-700 whitespace-nowrap">Age-Appropriate</span>
                  </label>
                  <button
                    onClick={() => deleteMaterial(material.id)}
                    className="p-2 text-red-500 hover:text-red-700"
                    title="Delete material"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <input
                    type="text"
                    value={material.safetyNotes || ''}
                    onChange={(e) => updateMaterial(material.id, 'safetyNotes', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="Safety notes (optional)"
                  />
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

        {/* Assessment Observations */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Assessment & Observations</h3>
          <div className="space-y-2">
            {plan.assessmentObservations.map((assessment, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-600">•</span>
                <input
                  type="text"
                  value={assessment}
                  onChange={(e) => updateAssessment(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="What to observe or assess"
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
            Add Assessment Point
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
              placeholder="How to adapt for different learning levels and needs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prerequisites</label>
            <textarea
              value={plan.prerequisites || ''}
              onChange={(e) => setPlan(prev => ({ ...prev, prerequisites: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="Skills or knowledge children should have"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {plan.activities.length} activit{plan.activities.length !== 1 ? 'ies' : 'y'} • 
          {plan.materials.length} material{plan.materials.length !== 1 ? 's' : ''} • 
          {plan.developmentalDomains.length} domain{plan.developmentalDomains.length !== 1 ? 's' : ''}
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

export default KindergartenEditor;