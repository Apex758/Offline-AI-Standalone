// components/LessonEditor.tsx
import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, Check, X } from 'lucide-react';

// Define lesson section structure
export interface LessonSection {
  id: string;
  name: string;
  content: string;
}

// Define the parsed lesson data structure
export interface ParsedLesson {
  metadata: {
    title: string;
    subject: string;
    gradeLevel: string;
    strand: string;
    topic: string;
    duration: string;
    studentCount: string;
    date?: string;
  };
  learningObjectives: string[];
  materials: string[];
  sections: LessonSection[];
  assessmentMethods: string[];
  pedagogicalStrategies?: string[];
  learningStyles?: string[];
  prerequisites?: string;
  specialNeeds?: string;
  additionalNotes?: string;
}

interface LessonEditorProps {
  lesson: ParsedLesson;
  onSave: (editedLesson: ParsedLesson) => void;
  onCancel: () => void;
}

const LessonEditor: React.FC<LessonEditorProps> = ({ lesson: initialLesson, onSave, onCancel }) => {
  // Deep clone to prevent mutations
  const [lesson, setLesson] = useState<ParsedLesson>(JSON.parse(JSON.stringify(initialLesson)));

  const updateMetadata = (field: keyof ParsedLesson['metadata'], value: string) => {
    setLesson(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [field]: value }
    }));
  };

  // Learning Objectives functions
  const addObjective = () => {
    setLesson(prev => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, '']
    }));
  };

  const updateObjective = (index: number, value: string) => {
    setLesson(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.map((obj, i) => 
        i === index ? value : obj
      )
    }));
  };

  const deleteObjective = (index: number) => {
    setLesson(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
    }));
  };

  const moveObjective = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= lesson.learningObjectives.length) return;

    const newObjectives = [...lesson.learningObjectives];
    [newObjectives[index], newObjectives[newIndex]] = [newObjectives[newIndex], newObjectives[index]];
    setLesson(prev => ({ ...prev, learningObjectives: newObjectives }));
  };

  // Materials functions
  const addMaterial = () => {
    setLesson(prev => ({
      ...prev,
      materials: [...prev.materials, '']
    }));
  };

  const updateMaterial = (index: number, value: string) => {
    setLesson(prev => ({
      ...prev,
      materials: prev.materials.map((mat, i) => 
        i === index ? value : mat
      )
    }));
  };

  const deleteMaterial = (index: number) => {
    setLesson(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const moveMaterial = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= lesson.materials.length) return;

    const newMaterials = [...lesson.materials];
    [newMaterials[index], newMaterials[newIndex]] = [newMaterials[newIndex], newMaterials[index]];
    setLesson(prev => ({ ...prev, materials: newMaterials }));
  };

  // Section functions
  const addSection = () => {
    const newSection: LessonSection = {
      id: `section_${Date.now()}`,
      name: '',
      content: ''
    };
    setLesson(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (sectionId: string, field: keyof LessonSection, value: string) => {
    setLesson(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, [field]: value } : section
      )
    }));
  };

  const deleteSection = (sectionId: string) => {
    setLesson(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= lesson.sections.length) return;

    const newSections = [...lesson.sections];
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    setLesson(prev => ({ ...prev, sections: newSections }));
  };

  // Assessment methods functions
  const addAssessment = () => {
    setLesson(prev => ({
      ...prev,
      assessmentMethods: [...prev.assessmentMethods, '']
    }));
  };

  const updateAssessment = (index: number, value: string) => {
    setLesson(prev => ({
      ...prev,
      assessmentMethods: prev.assessmentMethods.map((assess, i) => 
        i === index ? value : assess
      )
    }));
  };

  const deleteAssessment = (index: number) => {
    setLesson(prev => ({
      ...prev,
      assessmentMethods: prev.assessmentMethods.filter((_, i) => i !== index)
    }));
  };

  const moveAssessment = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= lesson.assessmentMethods.length) return;

    const newAssessments = [...lesson.assessmentMethods];
    [newAssessments[index], newAssessments[newIndex]] = [newAssessments[newIndex], newAssessments[index]];
    setLesson(prev => ({ ...prev, assessmentMethods: newAssessments }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-gray-200 p-6 bg-gradient-to-r from-cyan-50 to-blue-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Lesson Plan</h2>
        
        {/* Metadata Editing */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Title/Topic</label>
            <input
              type="text"
              value={lesson.metadata.title}
              onChange={(e) => updateMetadata('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter lesson title or topic"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={lesson.metadata.subject}
              onChange={(e) => updateMetadata('subject', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
            <input
              type="text"
              value={lesson.metadata.gradeLevel}
              onChange={(e) => updateMetadata('gradeLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Strand</label>
            <input
              type="text"
              value={lesson.metadata.strand}
              onChange={(e) => updateMetadata('strand', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
            <input
              type="text"
              value={lesson.metadata.duration}
              onChange={(e) => updateMetadata('duration', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., 45 minutes"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Student Count</label>
            <input
              type="text"
              value={lesson.metadata.studentCount}
              onChange={(e) => updateMetadata('studentCount', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., 25 students"
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        {/* Learning Objectives */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Learning Objectives</h3>
          <div className="space-y-2">
            {lesson.learningObjectives.map((objective, index) => (
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
                  placeholder="Enter learning objective"
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => moveObjective(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-cyan-600 disabled:opacity-30"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveObjective(index, 'down')}
                    disabled={index === lesson.learningObjectives.length - 1}
                    className="p-1 text-gray-500 hover:text-cyan-600 disabled:opacity-30"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => deleteObjective(index)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Delete objective"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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

        {/* Materials */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Materials Needed</h3>
          <div className="space-y-2">
            {lesson.materials.map((material, index) => (
              <div key={index} className="flex items-center gap-2">
                <button
                  className="p-1 hover:bg-gray-100 rounded cursor-move"
                  title="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4 text-gray-400" />
                </button>
                <span className="text-sm font-medium text-gray-600">•</span>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => updateMaterial(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter material or resource"
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => moveMaterial(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-cyan-600 disabled:opacity-30"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveMaterial(index, 'down')}
                    disabled={index === lesson.materials.length - 1}
                    className="p-1 text-gray-500 hover:text-cyan-600 disabled:opacity-30"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => deleteMaterial(index)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Delete material"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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

        {/* Lesson Sections */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Lesson Sections</h3>
          <div className="space-y-4">
            {lesson.sections.map((section, index) => (
              <div key={section.id} className="border border-gray-200 rounded-lg p-4 hover:border-cyan-300 transition">
                {/* Section Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    <button
                      className="p-1 hover:bg-gray-100 rounded cursor-move"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-4 h-4 text-gray-400" />
                    </button>
                    <span className="text-sm font-semibold text-gray-700">Section {index + 1}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => moveSection(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-500 hover:text-cyan-600 disabled:opacity-30"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveSection(index, 'down')}
                      disabled={index === lesson.sections.length - 1}
                      className="p-1 text-gray-500 hover:text-cyan-600 disabled:opacity-30"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="p-1 text-red-500 hover:text-red-700"
                      title="Delete section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Section Name */}
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section Name</label>
                  <input
                    type="text"
                    value={section.name}
                    onChange={(e) => updateSection(section.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g., Introduction, Main Activity, Conclusion"
                  />
                </div>

                {/* Section Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                  <textarea
                    value={section.content}
                    onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="Describe the activities, steps, and details for this section"
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addSection}
            className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-cyan-400 hover:text-cyan-600 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Lesson Section
          </button>
        </div>

        {/* Assessment Methods */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Assessment Methods</h3>
          <div className="space-y-2">
            {lesson.assessmentMethods.map((assessment, index) => (
              <div key={index} className="flex items-center gap-2">
                <button
                  className="p-1 hover:bg-gray-100 rounded cursor-move"
                  title="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4 text-gray-400" />
                </button>
                <span className="text-sm font-medium text-gray-600">•</span>
                <input
                  type="text"
                  value={assessment}
                  onChange={(e) => updateAssessment(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter assessment method"
                />
                <div className="flex gap-1">
                  <button
                    onClick={() => moveAssessment(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-500 hover:text-cyan-600 disabled:opacity-30"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveAssessment(index, 'down')}
                    disabled={index === lesson.assessmentMethods.length - 1}
                    className="p-1 text-gray-500 hover:text-cyan-600 disabled:opacity-30"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => deleteAssessment(index)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Delete assessment"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addAssessment}
            className="mt-3 w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-cyan-400 hover:text-cyan-600 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Assessment Method
          </button>
        </div>

        {/* Optional Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prerequisites</label>
            <textarea
              value={lesson.prerequisites || ''}
              onChange={(e) => setLesson(prev => ({ ...prev, prerequisites: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="Skills or knowledge students should have before this lesson"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Special Needs Accommodations</label>
            <textarea
              value={lesson.specialNeeds || ''}
              onChange={(e) => setLesson(prev => ({ ...prev, specialNeeds: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="Accommodations for students with special needs"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea
              value={lesson.additionalNotes || ''}
              onChange={(e) => setLesson(prev => ({ ...prev, additionalNotes: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
              placeholder="Any additional notes or instructions"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {lesson.learningObjectives.length} objective{lesson.learningObjectives.length !== 1 ? 's' : ''} • 
          {lesson.sections.length} section{lesson.sections.length !== 1 ? 's' : ''} • 
          {lesson.materials.length} material{lesson.materials.length !== 1 ? 's' : ''}
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
            onClick={() => onSave(lesson)}
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

export default LessonEditor;