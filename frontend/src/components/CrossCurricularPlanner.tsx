import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Loader2, School, Trash2 } from 'lucide-react';

interface CrossCurricularPlannerProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
}

interface FormData {
  lessonTitle: string;
  gradeLevel: string;
  duration: string;
  bigIdea: string;
  integrationModel: string;
  primarySubject: string;
  supportingSubjects: string;
  learningStandards: string;
  primaryObjective: string;
  secondaryObjectives: string;
  studentsWillKnow: string;
  studentsWillBeSkilled: string;
  keyVocabulary: string;
  introduction: string;
  coreActivities: string;
  closureActivities: string;
  differentiationStrategies: string;
  assessmentMethods: string;
  mostChildren: string;
  someNotProgressed: string;
  someProgressedFurther: string;
  reflectionPrompts: string;
  teachingStrategies: string[];
  learningStyles: string[];
  learningPreferences: string[];
  multipleIntelligences: string[];
  customLearningStyles: string;
  materials: string;
  crossCurricularConnections: string;
}

const CrossCurricularPlanner: React.FC<CrossCurricularPlannerProps> = ({ tabId, savedData, onDataChange }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = savedData?.formData;
    if (saved && Object.keys(saved).length > 0 && saved.lessonTitle) {
      return saved;
    }
    return {
      lessonTitle: '',
      gradeLevel: '',
      duration: '',
      bigIdea: '',
      integrationModel: '',
      primarySubject: '',
      supportingSubjects: '',
      learningStandards: '',
      primaryObjective: '',
      secondaryObjectives: '',
      studentsWillKnow: '',
      studentsWillBeSkilled: '',
      keyVocabulary: '',
      introduction: '',
      coreActivities: '',
      closureActivities: '',
      differentiationStrategies: '',
      assessmentMethods: '',
      mostChildren: '',
      someNotProgressed: '',
      someProgressedFurther: '',
      reflectionPrompts: '',
      teachingStrategies: [],
      learningStyles: [],
      learningPreferences: [],
      multipleIntelligences: [],
      customLearningStyles: '',
      materials: '',
      crossCurricularConnections: ''
    };
  });

  const [generatedPlan, setGeneratedPlan] = useState<string>(savedData?.generatedPlan || '');

  const grades = ['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 
                  'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  
  const subjects = ['Mathematics', 'Language Arts', 'Science', 'Social Studies', 'Arts', 
                    'Physical Education', 'Technology'];
  
  const integrationModels = ['Multidisciplinary', 'Interdisciplinary', 'Transdisciplinary'];

  const teachingStrategiesOptions = [
    'Inquiry-Based Learning', 'Project-Based Learning', 'Direct Instruction',
    'Cooperative Learning', 'Differentiated Instruction', 'Flipped Classroom',
    'Gamification', 'Problem-Based Learning', 'Socratic Method',
    'Experiential Learning', 'Culturally Responsive Teaching', 'Universal Design for Learning'
  ];

  const learningStylesOptions = ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic', 'Social', 'Solitary'];
  const learningPreferencesOptions = ['Individual Work', 'Group Work', 'Pair Work', 'Whole Class', 'Independent Study'];
  const multipleIntelligencesOptions = ['Linguistic', 'Logical-Mathematical', 'Spatial', 'Musical',
                                        'Bodily-Kinesthetic', 'Interpersonal', 'Intrapersonal', 'Naturalistic'];

  useEffect(() => {
    const saved = savedData?.formData;
    if (!saved || Object.keys(saved).length === 0 || !saved.lessonTitle) {
      // Reset to default
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
    if (step === 1) return formData.lessonTitle && formData.gradeLevel && formData.duration && formData.bigIdea && formData.integrationModel;
    if (step === 2) return formData.primarySubject && formData.learningStandards;
    if (step === 3) return formData.primaryObjective;
    if (step === 4) return formData.introduction && formData.coreActivities;
    if (step === 5) return formData.assessmentMethods && formData.mostChildren;
    if (step === 6) return formData.teachingStrategies.length > 0 && formData.learningStyles.length > 0;
    return true;
  };

  const generatePlan = () => {
    setLoading(true);
    // TODO: Implement WebSocket connection for streaming
    setTimeout(() => {
      setGeneratedPlan('Cross-curricular plan generation will be implemented with backend');
      setLoading(false);
    }, 1000);
  };

  const clearForm = () => {
    setFormData({
      lessonTitle: '', gradeLevel: '', duration: '', bigIdea: '', integrationModel: '',
      primarySubject: '', supportingSubjects: '', learningStandards: '',
      primaryObjective: '', secondaryObjectives: '', studentsWillKnow: '', studentsWillBeSkilled: '', keyVocabulary: '',
      introduction: '', coreActivities: '', closureActivities: '', differentiationStrategies: '',
      assessmentMethods: '', mostChildren: '', someNotProgressed: '', someProgressedFurther: '', reflectionPrompts: '',
      teachingStrategies: [], learningStyles: [], learningPreferences: [], multipleIntelligences: [],
      customLearningStyles: '', materials: '', crossCurricularConnections: ''
    });
    setGeneratedPlan('');
    setStep(1);
  };

  const stepLabels = ['Basic Info', 'Subjects', 'Objectives', 'Activities', 'Assessment', 'Teaching & Learning', 'Resources'];

  return (
    <div className="flex h-full bg-white">
      <div className="flex-1 flex flex-col">
        {generatedPlan ? (
          <>
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Generated Cross-Curricular Plan</h2>
                <p className="text-sm text-gray-500">{formData.lessonTitle}</p>
              </div>
              <button onClick={() => setGeneratedPlan('')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create New Plan
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <div className="prose max-w-none">{generatedPlan}</div>
            </div>
          </>
        ) : (
          <>
            <div className="border-b border-gray-200 p-4">
              <h2 className="text-xl font-semibold text-gray-800">Cross-Curricular Lesson Planner</h2>
              <p className="text-sm text-gray-500">Create integrated subject lesson plans</p>
            </div>

            {/* Progress Indicator */}
            <div className="border-b border-gray-200 px-6 py-3 overflow-x-auto">
              <div className="flex items-center space-x-2 min-w-max">
                {stepLabels.map((label, idx) => (
                  <React.Fragment key={idx}>
                    <div className={`flex items-center ${step === idx + 1 ? 'text-teal-600' : 'text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        step > idx + 1 ? 'bg-green-500 text-white' : step === idx + 1 ? 'bg-teal-600 text-white' : 'bg-gray-300'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className="ml-2 text-xs font-medium whitespace-nowrap">{label}</span>
                    </div>
                    {idx < stepLabels.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <div className="space-y-6">
                    <input type="text" value={formData.lessonTitle} onChange={(e) => handleInputChange('lessonTitle', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Lesson Title *" />
                    <select value={formData.gradeLevel} onChange={(e) => handleInputChange('gradeLevel', e.target.value)} 
                      className="w-full px-4 py-2 border rounded-lg">
                      <option value="">Select grade level</option>
                      {grades.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <input type="text" value={formData.duration} onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Duration *" />
                    <textarea value={formData.bigIdea} onChange={(e) => handleInputChange('bigIdea', e.target.value)} rows={3}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Big Idea / Driving Concept *" />
                    <select value={formData.integrationModel} onChange={(e) => handleInputChange('integrationModel', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg">
                      <option value="">Select integration model</option>
                      {integrationModels.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                )}

                {/* Step 2: Subjects */}
                {step === 2 && (
                  <div className="space-y-6">
                    <select value={formData.primarySubject} onChange={(e) => handleInputChange('primarySubject', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg">
                      <option value="">Select primary subject</option>
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input type="text" value={formData.supportingSubjects} onChange={(e) => handleInputChange('supportingSubjects', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Supporting Subjects (comma-separated)" />
                    <textarea value={formData.learningStandards} onChange={(e) => handleInputChange('learningStandards', e.target.value)} rows={4}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Learning Standards *" />
                  </div>
                )}

                {/* Step 3: Objectives */}
                {step === 3 && (
                  <div className="space-y-6">
                    <textarea value={formData.primaryObjective} onChange={(e) => handleInputChange('primaryObjective', e.target.value)} rows={2}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Primary Learning Objective *" />
                    <textarea value={formData.secondaryObjectives} onChange={(e) => handleInputChange('secondaryObjectives', e.target.value)} rows={3}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Secondary Learning Objectives" />
                    <textarea value={formData.studentsWillKnow} onChange={(e) => handleInputChange('studentsWillKnow', e.target.value)} rows={2}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Students Will Know (Facts)" />
                    <textarea value={formData.studentsWillBeSkilled} onChange={(e) => handleInputChange('studentsWillBeSkilled', e.target.value)} rows={2}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Students Will Be Skilled At (Actions)" />
                    <input type="text" value={formData.keyVocabulary} onChange={(e) => handleInputChange('keyVocabulary', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Key Vocabulary (comma-separated)" />
                  </div>
                )}

                {/* Step 4: Activities */}
                {step === 4 && (
                  <div className="space-y-6">
                    <textarea value={formData.introduction} onChange={(e) => handleInputChange('introduction', e.target.value)} rows={3}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Introduction/Hook *" />
                    <textarea value={formData.coreActivities} onChange={(e) => handleInputChange('coreActivities', e.target.value)} rows={4}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Core Learning Activities *" />
                    <textarea value={formData.closureActivities} onChange={(e) => handleInputChange('closureActivities', e.target.value)} rows={3}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Closure Activities" />
                    <textarea value={formData.differentiationStrategies} onChange={(e) => handleInputChange('differentiationStrategies', e.target.value)} rows={3}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Differentiation Strategies" />
                  </div>
                )}

                {/* Step 5: Assessment */}
                {step === 5 && (
                  <div className="space-y-6">
                    <textarea value={formData.assessmentMethods} onChange={(e) => handleInputChange('assessmentMethods', e.target.value)} rows={3}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Assessment Methods *" />
                    <textarea value={formData.mostChildren} onChange={(e) => handleInputChange('mostChildren', e.target.value)} rows={2}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Most children will *" />
                    <textarea value={formData.someNotProgressed} onChange={(e) => handleInputChange('someNotProgressed', e.target.value)} rows={2}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Some will not have made so much progress" />
                    <textarea value={formData.someProgressedFurther} onChange={(e) => handleInputChange('someProgressedFurther', e.target.value)} rows={2}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Some will have progressed further" />
                    <textarea value={formData.reflectionPrompts} onChange={(e) => handleInputChange('reflectionPrompts', e.target.value)} rows={2}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Reflection Prompts" />
                  </div>
                )}

                {/* Step 6: Teaching & Learning */}
                {step === 6 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Teaching Strategies *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {teachingStrategiesOptions.map(s => (
                          <label key={s} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input type="checkbox" checked={formData.teachingStrategies.includes(s)}
                              onChange={() => handleCheckboxChange('teachingStrategies', s)} className="w-4 h-4 text-teal-600 rounded" />
                            <span className="text-sm">{s}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Learning Styles *</label>
                      <div className="grid grid-cols-3 gap-2">
                        {learningStylesOptions.map(s => (
                          <label key={s} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input type="checkbox" checked={formData.learningStyles.includes(s)}
                              onChange={() => handleCheckboxChange('learningStyles', s)} className="w-4 h-4 text-teal-600 rounded" />
                            <span className="text-sm">{s}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 7: Resources */}
                {step === 7 && (
                  <div className="space-y-6">
                    <textarea value={formData.materials} onChange={(e) => handleInputChange('materials', e.target.value)} rows={3}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Materials and Resources" />
                    <textarea value={formData.crossCurricularConnections} onChange={(e) => handleInputChange('crossCurricularConnections', e.target.value)} rows={4}
                      className="w-full px-4 py-2 border rounded-lg" placeholder="Suggested Cross-Curricular Connections" />
                  </div>
                )}
              </div>
            </div>

            <div className="border-t p-4 bg-gray-50">
              <div className="max-w-3xl mx-auto flex justify-between">
                <div>{step > 1 && <button onClick={() => setStep(step - 1)} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg">
                  <ChevronLeft className="w-5 h-5 mr-1" />Previous</button>}</div>
                <div className="flex gap-2">
                  <button onClick={clearForm} className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-5 h-5 mr-2" />Clear</button>
                  {step < 7 ? (
                    <button onClick={() => setStep(step + 1)} disabled={!validateStep()}
                      className="flex items-center px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300">
                      Next<ChevronRight className="w-5 h-5 ml-1" /></button>
                  ) : (
                    <button onClick={generatePlan} disabled={loading}
                      className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300">
                      {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generating...</> : 
                                 <><School className="w-5 h-5 mr-2" />Generate Lesson plan</>}
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

export default CrossCurricularPlanner;