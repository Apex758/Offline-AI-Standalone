import React, { useState, useEffect } from 'react';
import { Loader2, FileText, Trash2 } from 'lucide-react';

interface RubricGeneratorProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
}

interface FormData {
  assignmentTitle: string;
  assignmentType: string;
  subject: string;
  gradeLevel: string;
  learningObjectives: string;
  specificRequirements: string;
  performanceLevels: string;
  includePointValues: boolean;
  focusAreas: string[];
}

const RubricGenerator: React.FC<RubricGeneratorProps> = ({ tabId, savedData, onDataChange }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = savedData?.formData;
    if (saved && Object.keys(saved).length > 0 && saved.assignmentTitle) {
      return saved;
    }
    return {
      assignmentTitle: '',
      assignmentType: '',
      subject: '',
      gradeLevel: '',
      learningObjectives: '',
      specificRequirements: '',
      performanceLevels: '4',
      includePointValues: false,
      focusAreas: []
    };
  });

  const [generatedRubric, setGeneratedRubric] = useState<string>(savedData?.generatedRubric || '');

  const assignmentTypes = [
    'Essay', 'Presentation', 'Project', 'Lab Report', 'Creative Writing', 
    'Research Paper', 'Group Work', 'Portfolio', 'Performance', 'Other'
  ];

  const subjects = [
    'Language Arts', 'Mathematics', 'Science', 'Social Studies', 
    'Art', 'Music', 'Physical Education', 'Technology', 'Other'
  ];

  const grades = [
    'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
  ];

  const focusAreasOptions = [
    'Content Knowledge', 'Critical Thinking', 'Communication', 'Collaboration',
    'Creativity', 'Organization', 'Research Skills', 'Problem Solving',
    'Technical Skills', 'Presentation Skills'
  ];

  useEffect(() => {
    const saved = savedData?.formData;
    if (!saved || Object.keys(saved).length === 0 || !saved.assignmentTitle) {
      setFormData({
        assignmentTitle: '',
        assignmentType: '',
        subject: '',
        gradeLevel: '',
        learningObjectives: '',
        specificRequirements: '',
        performanceLevels: '4',
        includePointValues: false,
        focusAreas: []
      });
      setGeneratedRubric('');
    } else {
      setFormData(saved);
      setGeneratedRubric(savedData?.generatedRubric || '');
    }
  }, [tabId]);

  useEffect(() => {
    onDataChange({ formData, generatedRubric });
  }, [formData, generatedRubric]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: keyof FormData, value: string) => {
    const currentArray = formData[field] as string[];
    if (currentArray.includes(value)) {
      handleInputChange(field, currentArray.filter(item => item !== value));
    } else {
      handleInputChange(field, [...currentArray, value]);
    }
  };

  const generateRubric = () => {
    setLoading(true);
    // TODO: Implement WebSocket connection for streaming
    setTimeout(() => {
      setGeneratedRubric('Rubric generation will be implemented with backend');
      setLoading(false);
    }, 1000);
  };

  const clearForm = () => {
    setFormData({
      assignmentTitle: '',
      assignmentType: '',
      subject: '',
      gradeLevel: '',
      learningObjectives: '',
      specificRequirements: '',
      performanceLevels: '4',
      includePointValues: false,
      focusAreas: []
    });
    setGeneratedRubric('');
  };

  const validateForm = () => {
    return formData.assignmentTitle && formData.assignmentType && formData.subject && 
           formData.gradeLevel && formData.learningObjectives;
  };

  return (
    <div className="flex h-full bg-white">
      <div className="flex-1 flex flex-col">
        {generatedRubric ? (
          <>
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Generated Rubric</h2>
                <p className="text-sm text-gray-500">{formData.assignmentTitle}</p>
              </div>
              <button
                onClick={() => setGeneratedRubric('')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create New Rubric
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <div className="prose max-w-none">
                {generatedRubric}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-xl font-semibold text-gray-800">Rubric Details</h2>
              <p className="text-sm text-gray-500">Provide information about your assignment to generate a customized rubric</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.assignmentTitle}
                    onChange={(e) => handleInputChange('assignmentTitle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Persuasive Essay on Climate Change"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.assignmentType}
                    onChange={(e) => handleInputChange('assignmentType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select type</option>
                    {assignmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select subject</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => handleInputChange('gradeLevel', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select grade</option>
                    {grades.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Objectives <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.learningObjectives}
                    onChange={(e) => handleInputChange('learningObjectives', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="What should students demonstrate or achieve?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Requirements
                  </label>
                  <textarea
                    value={formData.specificRequirements}
                    onChange={(e) => handleInputChange('specificRequirements', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Any specific requirements or criteria for the assignment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Performance Levels
                  </label>
                  <div className="flex gap-4">
                    {['3', '4', '5', '6'].map(level => (
                      <label key={level} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="performanceLevels"
                          value={level}
                          checked={formData.performanceLevels === level}
                          onChange={(e) => handleInputChange('performanceLevels', e.target.value)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm">{level} Levels</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Options</label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.includePointValues}
                      onChange={(e) => handleInputChange('includePointValues', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm">Include point values</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Focus Areas (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {focusAreasOptions.map(area => (
                      <label key={area} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.focusAreas.includes(area)}
                          onChange={() => handleCheckboxChange('focusAreas', area)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="max-w-3xl mx-auto flex justify-between">
                <button
                  onClick={clearForm}
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  Clear Form
                </button>
                <button
                  onClick={generateRubric}
                  disabled={!validateForm() || loading}
                  className="flex items-center px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Generate Rubric
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RubricGenerator;