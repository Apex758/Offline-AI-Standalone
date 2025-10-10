import React, { useState, useEffect } from 'react';
import { Loader2, GraduationCap, Trash2 } from 'lucide-react';

interface KindergartenPlannerProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
}

interface FormData {
  lessonTopic: string;
  curriculumUnit: string;
  week: string;
  dayOfWeek: string;
  date: string;
  ageGroup: string;
  students: string;
  creativityLevel: number;
  learningDomains: string[];
  duration: string;
  additionalRequirements: string;
  includeAssessments: boolean;
  includeMaterials: boolean;
  streamingGeneration: boolean;
}

const KindergartenPlanner: React.FC<KindergartenPlannerProps> = ({ tabId, savedData, onDataChange }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = savedData?.formData;
    if (saved && Object.keys(saved).length > 0 && saved.lessonTopic) {
      return saved;
    }
    return {
      lessonTopic: '',
      curriculumUnit: '',
      week: '',
      dayOfWeek: '',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      ageGroup: '',
      students: '',
      creativityLevel: 50,
      learningDomains: [],
      duration: '60',
      additionalRequirements: '',
      includeAssessments: true,
      includeMaterials: true,
      streamingGeneration: true
    };
  });

  const [generatedPlan, setGeneratedPlan] = useState<string>(savedData?.generatedPlan || '');

  const curriculumUnits = ['Belonging', 'Weather', 'Celebrations', 'Plants and animals', 'Games'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const ageGroups = ['3-4 years', '4-5 years', '5-6 years'];
  
  const learningDomainsOptions = [
    'Social-Emotional Development',
    'Language & Literacy',
    'Mathematics',
    'Science & Discovery',
    'Creative Arts',
    'Physical Development',
    'Social Studies'
  ];

  useEffect(() => {
    const saved = savedData?.formData;
    if (!saved || Object.keys(saved).length === 0 || !saved.lessonTopic) {
      setFormData({
        lessonTopic: '',
        curriculumUnit: '',
        week: '',
        dayOfWeek: '',
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        ageGroup: '',
        students: '',
        creativityLevel: 50,
        learningDomains: [],
        duration: '60',
        additionalRequirements: '',
        includeAssessments: true,
        includeMaterials: true,
        streamingGeneration: true
      });
      setGeneratedPlan('');
    } else {
      setFormData(saved);
      setGeneratedPlan(savedData?.generatedPlan || '');
    }
  }, [tabId]);

  useEffect(() => {
    onDataChange({ formData, generatedPlan });
  }, [formData, generatedPlan]);

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

  const generatePlan = () => {
    setLoading(true);
    // TODO: Implement WebSocket connection for streaming
    setTimeout(() => {
      setGeneratedPlan('Kindergarten plan generation will be implemented with backend');
      setLoading(false);
    }, 1000);
  };

  const clearForm = () => {
    setFormData({
      lessonTopic: '',
      curriculumUnit: '',
      week: '',
      dayOfWeek: '',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      ageGroup: '',
      students: '',
      creativityLevel: 50,
      learningDomains: [],
      duration: '60',
      additionalRequirements: '',
      includeAssessments: true,
      includeMaterials: true,
      streamingGeneration: true
    });
    setGeneratedPlan('');
  };

  const validateForm = () => {
    return formData.lessonTopic && formData.curriculumUnit && formData.week && 
           formData.dayOfWeek && formData.ageGroup && formData.students && 
           formData.learningDomains.length > 0;
  };

  return (
    <div className="flex h-full bg-white">
      <div className="flex-1 flex flex-col">
        {generatedPlan ? (
          <>
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Generated Kindergarten Lesson</h2>
                <p className="text-sm text-gray-500">{formData.lessonTopic} - {formData.curriculumUnit}</p>
              </div>
              <button
                onClick={() => setGeneratedPlan('')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create New Lesson
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <div className="prose max-w-none">
                {generatedPlan}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-xl font-semibold text-gray-800">AI-Powered Kindergarten Lesson Planner</h2>
              <p className="text-sm text-gray-500">Generate engaging, standards-aligned lesson plans tailored to your kindergarten students</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Topic <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lessonTopic}
                    onChange={(e) => handleInputChange('lessonTopic', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    placeholder="e.g., Exploring Colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Curriculum Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.curriculumUnit}
                    onChange={(e) => handleInputChange('curriculumUnit', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  >
                    <option value="">Select unit</option>
                    {curriculumUnits.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Week <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.week}
                      onChange={(e) => handleInputChange('week', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Day of Week <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.dayOfWeek}
                      onChange={(e) => handleInputChange('dayOfWeek', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">Select day</option>
                      {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age Group <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.ageGroup}
                      onChange={(e) => handleInputChange('ageGroup', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">Select age group</option>
                      {ageGroups.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Students <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.students}
                      onChange={(e) => handleInputChange('students', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Creativity Level <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Structured</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.creativityLevel}
                      onChange={(e) => handleInputChange('creativityLevel', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600">Highly Creative</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {formData.creativityLevel < 33 ? 'Structured' : formData.creativityLevel < 67 ? 'Balanced' : 'Highly Creative'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Learning Domains <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {learningDomainsOptions.map(domain => (
                      <label key={domain} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.learningDomains.includes(domain)}
                          onChange={() => handleCheckboxChange('learningDomains', domain)}
                          className="w-4 h-4 text-pink-600 rounded"
                        />
                        <span className="text-sm">{domain}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    min="15"
                    max="480"
                    placeholder="15 minutes to 8 hours"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Requirements
                  </label>
                  <textarea
                    value={formData.additionalRequirements}
                    onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Generation Options
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.includeAssessments}
                        onChange={(e) => handleInputChange('includeAssessments', e.target.checked)}
                        className="w-4 h-4 text-pink-600 rounded"
                      />
                      <span className="text-sm">Include Assessments</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.includeMaterials}
                        onChange={(e) => handleInputChange('includeMaterials', e.target.checked)}
                        className="w-4 h-4 text-pink-600 rounded"
                      />
                      <span className="text-sm">Include Materials</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.streamingGeneration}
                        onChange={(e) => handleInputChange('streamingGeneration', e.target.checked)}
                        className="w-4 h-4 text-pink-600 rounded"
                      />
                      <span className="text-sm">Streaming Generation</span>
                    </label>
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
                  onClick={generatePlan}
                  disabled={!validateForm() || loading}
                  className="flex items-center px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:bg-gray-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-5 h-5 mr-2" />
                      Generate Lesson Plan
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

export default KindergartenPlanner;