import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Loader2, Users, Trash2 } from 'lucide-react';

interface MultigradePlannerProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
}

interface FormData {
  subject: string;
  gradeRange: string;
  topic: string;
  essentialLearningOutcomes: string;
  specificLearningObjectives: string;
  totalStudents: string;
  prerequisiteSkills: string;
  duration: string;
  materials: string;
  learningStyles: string[];
  learningPreferences: string[];
  multipleIntelligences: string[];
  customLearningStyles: string;
  pedagogicalStrategies: string[];
  multigradeStrategies: string[];
  specialNeeds: boolean;
  specialNeedsDetails: string;
  differentiationNotes: string;
}

const MultigradePlanner: React.FC<MultigradePlannerProps> = ({ tabId, savedData, onDataChange }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = savedData?.formData;
    if (saved && Object.keys(saved).length > 0 && saved.subject) {
      return saved;
    }
    return {
      subject: '',
      gradeRange: '',
      topic: '',
      essentialLearningOutcomes: '',
      specificLearningObjectives: '',
      totalStudents: '',
      prerequisiteSkills: '',
      duration: '',
      materials: '',
      learningStyles: [],
      learningPreferences: [],
      multipleIntelligences: [],
      customLearningStyles: '',
      pedagogicalStrategies: [],
      multigradeStrategies: [],
      specialNeeds: false,
      specialNeedsDetails: '',
      differentiationNotes: ''
    };
  });

  const [generatedPlan, setGeneratedPlan] = useState<string>(savedData?.generatedPlan || '');

  const subjects = ['Mathematics', 'Science', 'Language Arts', 'Social Studies', 'Art', 'Music', 'Physical Education'];
  
  const gradeRanges = [
    'Kindergarten - Grade 1', 'Grade 1 - Grade 2', 'Grade 2 - Grade 3',
    'Grade 3 - Grade 4', 'Grade 4 - Grade 5', 'Grade 5 - Grade 6',
    'Grade 1 - Grade 3', 'Grade 2 - Grade 4', 'Grade 3 - Grade 5',
    'Grade 4 - Grade 6', 'Grade 1 - Grade 6'
  ];

  const learningStylesOptions = ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic', 'Mixed'];
  const learningPreferencesOptions = ['Individual Work', 'Group Work', 'Pair Work', 'Whole Class', 'Independent Study'];
  const multipleIntelligencesOptions = [
    'Linguistic', 'Logical-Mathematical', 'Spatial', 'Musical',
    'Bodily-Kinesthetic', 'Interpersonal', 'Intrapersonal', 'Naturalistic'
  ];

  const pedagogicalStrategiesOptions = [
    'Direct Instruction', 'Inquiry-Based Learning', 'Cooperative Learning',
    'Problem-Based Learning', 'Project-Based Learning', 'Flipped Classroom',
    'Blended Learning', 'Gamification'
  ];

  const multigradeStrategiesOptions = [
    'Peer Teaching', 'Differentiated Tasks', 'Rotation Activities',
    'Self-Directed Learning', 'Integrated Curriculum', 'Staggered Instruction',
    'Mixed-Grade Collaborative Groups', 'Learning Centers', 'Tiered Assignments',
    'Flexible Grouping'
  ];

  useEffect(() => {
    const saved = savedData?.formData;
    if (!saved || Object.keys(saved).length === 0 || !saved.subject) {
      setFormData({
        subject: '',
        gradeRange: '',
        topic: '',
        essentialLearningOutcomes: '',
        specificLearningObjectives: '',
        totalStudents: '',
        prerequisiteSkills: '',
        duration: '',
        materials: '',
        learningStyles: [],
        learningPreferences: [],
        multipleIntelligences: [],
        customLearningStyles: '',
        pedagogicalStrategies: [],
        multigradeStrategies: [],
        specialNeeds: false,
        specialNeedsDetails: '',
        differentiationNotes: ''
      });
      setGeneratedPlan('');
      setStep(1);
    } else {
      setFormData(saved);
      setGeneratedPlan(savedData?.generatedPlan || '');
      setStep(savedData?.step || 1);
    }
  }, [tabId]);

  useEffect(() => {
    onDataChange({ formData, generatedPlan, step });
  }, [formData, generatedPlan, step]);

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

  const validateStep = () => {
    if (step === 1) {
      return formData.subject && formData.gradeRange && formData.topic && 
             formData.essentialLearningOutcomes && formData.specificLearningObjectives &&
             formData.totalStudents && formData.duration && formData.materials;
    }
    if (step === 2) {
      return formData.learningStyles.length > 0 && formData.pedagogicalStrategies.length > 0 &&
             formData.multigradeStrategies.length > 0;
    }
    return true;
  };

  const generatePlan = () => {
    setLoading(true);
    // TODO: Implement WebSocket connection for streaming
    setTimeout(() => {
      setGeneratedPlan('Multigrade plan generation will be implemented with backend');
      setLoading(false);
    }, 1000);
  };

  const clearForm = () => {
    setFormData({
      subject: '',
      gradeRange: '',
      topic: '',
      essentialLearningOutcomes: '',
      specificLearningObjectives: '',
      totalStudents: '',
      prerequisiteSkills: '',
      duration: '',
      materials: '',
      learningStyles: [],
      learningPreferences: [],
      multipleIntelligences: [],
      customLearningStyles: '',
      pedagogicalStrategies: [],
      multigradeStrategies: [],
      specialNeeds: false,
      specialNeedsDetails: '',
      differentiationNotes: ''
    });
    setGeneratedPlan('');
    setStep(1);
  };

  return (
    <div className="flex h-full bg-white">
      <div className="flex-1 flex flex-col">
        {generatedPlan ? (
          <>
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Generated Multigrade Plan</h2>
                <p className="text-sm text-gray-500">{formData.subject} - {formData.gradeRange}</p>
              </div>
              <button
                onClick={() => setGeneratedPlan('')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create New Plan
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
              <h2 className="text-xl font-semibold text-gray-800">Create Multigrade Lesson Plan</h2>
              <p className="text-sm text-gray-500">Design a lesson that addresses multiple grade levels simultaneously</p>
            </div>

            {/* Progress Steps */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between max-w-2xl">
                {['Basic Info', 'Learning & Strategies', 'Additional Details'].map((label, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      step > idx + 1 ? 'bg-green-600' : step === idx + 1 ? 'bg-indigo-600' : 'bg-gray-300'
                    } text-white font-semibold text-sm`}>
                      {idx + 1}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      step === idx + 1 ? 'text-indigo-600' : 'text-gray-500'
                    }`}>
                      {label}
                    </span>
                    {idx < 2 && <ChevronRight className="w-5 h-5 text-gray-400 mx-4" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-800">Basic Information</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select a subject</option>
                          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Grade Range <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.gradeRange}
                          onChange={(e) => handleInputChange('gradeRange', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select grade range</option>
                          {gradeRanges.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Topic <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.topic}
                        onChange={(e) => handleInputChange('topic', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Essential Learning Outcomes <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.essentialLearningOutcomes}
                        onChange={(e) => handleInputChange('essentialLearningOutcomes', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="Include outcomes for each grade level in your range"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specific Learning Objectives <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.specificLearningObjectives}
                        onChange={(e) => handleInputChange('specificLearningObjectives', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Number of Students <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.totalStudents}
                          onChange={(e) => handleInputChange('totalStudents', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration (minutes) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.duration}
                          onChange={(e) => handleInputChange('duration', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prerequisite Skills
                      </label>
                      <textarea
                        value={formData.prerequisiteSkills}
                        onChange={(e) => handleInputChange('prerequisiteSkills', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Materials <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.materials}
                        onChange={(e) => handleInputChange('materials', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Learning & Strategies */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-800">Learning Styles & Preferences</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Learning Styles <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {learningStylesOptions.map(style => (
                          <label key={style} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.learningStyles.includes(style)}
                              onChange={() => handleCheckboxChange('learningStyles', style)}
                              className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <span className="text-sm">{style}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Learning Preferences
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {learningPreferencesOptions.map(pref => (
                          <label key={pref} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.learningPreferences.includes(pref)}
                              onChange={() => handleCheckboxChange('learningPreferences', pref)}
                              className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <span className="text-sm">{pref}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Multiple Intelligences
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {multipleIntelligencesOptions.map(intel => (
                          <label key={intel} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.multipleIntelligences.includes(intel)}
                              onChange={() => handleCheckboxChange('multipleIntelligences', intel)}
                              className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <span className="text-sm">{intel}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Learning Styles (Optional)
                      </label>
                      <textarea
                        value={formData.customLearningStyles}
                        onChange={(e) => handleInputChange('customLearningStyles', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mt-8">Teaching Strategies</h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Pedagogical Strategies <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {pedagogicalStrategiesOptions.map(strategy => (
                          <label key={strategy} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.pedagogicalStrategies.includes(strategy)}
                              onChange={() => handleCheckboxChange('pedagogicalStrategies', strategy)}
                              className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <span className="text-sm">{strategy}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Multigrade Teaching Strategies <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {multigradeStrategiesOptions.map(strategy => (
                          <label key={strategy} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.multigradeStrategies.includes(strategy)}
                              onChange={() => handleCheckboxChange('multigradeStrategies', strategy)}
                              className="w-4 h-4 text-indigo-600 rounded"
                            />
                            <span className="text-sm">{strategy}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Additional Details */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-800">Special Needs Accommodations</h3>

                    <div>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.specialNeeds}
                          onChange={(e) => handleInputChange('specialNeeds', e.target.checked)}
                          className="w-4 h-4 text-indigo-600 rounded"
                        />
                        <span className="text-sm font-medium">Check if there are students with special needs in any grade level</span>
                      </label>
                    </div>

                    {formData.specialNeeds && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Special Needs Details
                        </label>
                        <textarea
                          value={formData.specialNeedsDetails}
                          onChange={(e) => handleInputChange('specialNeedsDetails', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Differentiation Notes
                      </label>
                      <textarea
                        value={formData.differentiationNotes}
                        onChange={(e) => handleInputChange('differentiationNotes', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        placeholder="How will you differentiate for different grade levels?"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="max-w-3xl mx-auto flex items-center justify-between">
                <div>
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
                    >
                      <ChevronLeft className="w-5 h-5 mr-1" />
                      Previous
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={clearForm}
                    className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Clear Form
                  </button>

                  {step < 3 ? (
                    <button
                      onClick={() => setStep(step + 1)}
                      disabled={!validateStep()}
                      className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300"
                    >
                      Next
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </button>
                  ) : (
                    <button
                      onClick={generatePlan}
                      disabled={loading}
                      className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Users className="w-5 h-5 mr-2" />
                          Generate Multigrade Plan
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MultigradePlanner;