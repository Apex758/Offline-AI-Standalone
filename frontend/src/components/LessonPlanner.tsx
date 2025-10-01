import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Loader2, FileText, Trash2 } from 'lucide-react';

interface LessonPlannerProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
}

interface FormData {
  subject: string;
  gradeLevel: string;
  topic: string;
  strand: string;
  essentialOutcomes: string;
  specificOutcomes: string;
  studentCount: string;
  duration: string;
  pedagogicalStrategies: string[];
  learningStyles: string[];
  learningPreferences: string[];
  multipleIntelligences: string[];
  customLearningStyles: string;
  materials: string;
  prerequisiteSkills: string;
  specialNeeds: boolean;
  specialNeedsDetails: string;
  additionalInstructions: string;
  referenceUrl: string;
}

const LessonPlanner: React.FC<LessonPlannerProps> = ({ tabId, savedData, onDataChange }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const shouldReconnectRef = useRef(true);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [generatedPlan, setGeneratedPlan] = useState<string>('');
  const [streamingPlan, setStreamingPlan] = useState<string>('');
  const wsRef = useRef<WebSocket | null>(null);
  const [formData, setFormData] = useState<FormData>({
    subject: '',
    gradeLevel: '',
    topic: '',
    strand: '',
    essentialOutcomes: '',
    specificOutcomes: '',
    studentCount: '',
    duration: '',
    pedagogicalStrategies: [],
    learningStyles: [],
    learningPreferences: [],
    multipleIntelligences: [],
    customLearningStyles: '',
    materials: '',
    prerequisiteSkills: '',
    specialNeeds: false,
    specialNeedsDetails: '',
    additionalInstructions: '',
    referenceUrl: ''
  });

  const subjects = [
    'Mathematics',
    'Language Arts',
    'Science',
    'Social Studies'
  ];

  const grades = ['K', '1', '2', '3', '4', '5', '6'];

  const strandsBySubject: { [key: string]: string[] } = {
    'Mathematics': ['Number Sense', 'Patterns and Relations', 'Shape and Space', 'Statistics and Probability'],
    'Language Arts': ['Reading', 'Writing', 'Listening and Speaking', 'Viewing and Representing'],
    'Science': ['Life Science', 'Physical Science', 'Earth and Space Science', 'Scientific Inquiry'],
    'Social Studies': ['History', 'Geography', 'Economics', 'Civics and Citizenship']
  };

  const pedagogicalStrategiesOptions = [
    'Inquiry-Based Learning', 'Project-Based Learning', 'Direct Instruction',
    'Cooperative Learning', 'Differentiated Instruction', 'Flipped Classroom',
    'Gamification', 'Problem-Based Learning', 'Socratic Method',
    'Experiential Learning', 'Culturally Responsive Teaching', 'Universal Design for Learning'
  ];

  const learningStylesOptions = ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic', 'Social', 'Solitary'];
  
  const learningPreferencesOptions = ['Individual Work', 'Group Work', 'Pair Work', 'Whole Class', 'Independent Study'];
  
  const multipleIntelligencesOptions = [
    'Linguistic', 'Logical-Mathematical', 'Spatial', 'Musical',
    'Bodily-Kinesthetic', 'Interpersonal', 'Intrapersonal', 'Naturalistic'
  ];

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
      return formData.subject && formData.gradeLevel && formData.topic && formData.strand &&
             formData.essentialOutcomes && formData.specificOutcomes &&
             formData.studentCount && formData.duration;
    }
    if (step === 2) {
      return formData.pedagogicalStrategies.length > 0 && formData.learningStyles.length > 0 &&
             formData.materials && formData.prerequisiteSkills;
    }
    return true;
  };

  useEffect(() => {
    shouldReconnectRef.current = true;

    const connectWebSocket = () => {
      if (!shouldReconnectRef.current) {
        return;
      }

      try {
        const ws = new WebSocket('ws://localhost:8000/ws/lesson-plan');
        
        ws.onopen = () => {
          console.log('Lesson Plan WebSocket connected');
        };
        
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          // Same message handling as chat
          if (data.type === 'token') {
            setStreamingPlan(prev => prev + data.content);
          } else if (data.type === 'done') {
            setStreamingPlan(current => {
              const finalMessage = current || data.full_response;
              setGeneratedPlan(finalMessage);
              setLoading(false);
              return '';
            });
          }
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setLoading(false);
        };
        
        ws.onclose = () => {
          console.log('WebSocket closed');
          wsRef.current = null;
          
          if (shouldReconnectRef.current) {
            console.log('Reconnecting in 2 seconds...');
            reconnectTimeoutRef.current = setTimeout(() => {
              connectWebSocket();
            }, 2000);
          }
        };
        
        wsRef.current = ws;
      } catch (error) {
        console.error('Failed to create WebSocket:', error);
        
        if (shouldReconnectRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, 2000);
        }
      }
    };
    
    connectWebSocket();
    
    return () => {
      console.log('Cleaning up WebSocket connection');
      shouldReconnectRef.current = false;
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      wsRef.current = null;
    };
  }, [tabId]);

  const generateLessonPlan = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      alert('Connection not established. Please wait and try again.');
      return;
    }

    setLoading(true);
    setStreamingPlan('');

    // Simple prompt - no complex formatting
    const prompt = `Generate a comprehensive lesson plan with the following specifications:

LESSON INFORMATION:
- Subject: ${formData.subject}
- Grade Level: ${formData.gradeLevel}
- Strand: ${formData.strand}
- Topic: ${formData.topic}
- Duration: ${formData.duration} minutes
- Number of Students: ${formData.studentCount}
- Date: ${new Date().toLocaleDateString()}

CURRICULUM ALIGNMENT:
Essential Learning Outcome: ${formData.essentialOutcomes}

Specific Curriculum Outcomes: ${formData.specificOutcomes}

TEACHING APPROACH:
- Pedagogical Strategies: ${formData.pedagogicalStrategies.join(', ')}
- Learning Styles: ${formData.learningStyles.join(', ')}
- Learning Preferences: ${formData.learningPreferences.join(', ')}
- Multiple Intelligences: ${formData.multipleIntelligences.join(', ')}
${formData.customLearningStyles ? `- Custom Learning Styles: ${formData.customLearningStyles}` : ''}

RESOURCES:
- Materials: ${formData.materials}
- Prerequisite Skills: ${formData.prerequisiteSkills}
${formData.referenceUrl ? `- Reference: ${formData.referenceUrl}` : ''}

${formData.specialNeeds ? `SPECIAL NEEDS ACCOMMODATIONS:\n${formData.specialNeedsDetails}` : ''}

${formData.additionalInstructions ? `ADDITIONAL INSTRUCTIONS:\n${formData.additionalInstructions}` : ''}

Please generate a detailed lesson plan with clear sections and practical details that a teacher can immediately implement.`;

    try {
      wsRef.current.send(JSON.stringify({
        prompt: prompt
      }));
    } catch (error) {
      console.error('Failed to send lesson plan request:', error);
      setLoading(false);
    }
  };


  const clearForm = () => {
    setFormData({
      subject: '',
      gradeLevel: '',
      topic: '',
      strand: '',
      essentialOutcomes: '',
      specificOutcomes: '',
      studentCount: '',
      duration: '',
      pedagogicalStrategies: [],
      learningStyles: [],
      learningPreferences: [],
      multipleIntelligences: [],
      customLearningStyles: '',
      materials: '',
      prerequisiteSkills: '',
      specialNeeds: false,
      specialNeedsDetails: '',
      additionalInstructions: '',
      referenceUrl: ''
    });
    setGeneratedPlan('');
    setStreamingPlan('');
    setStep(1);
  };

  if (generatedPlan || streamingPlan) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="border-b border-gray-200 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {loading ? 'Generating Lesson Plan...' : 'Generated Lesson Plan'}
            </h2>
            <p className="text-sm text-gray-500">{formData.subject} - Grade {formData.gradeLevel}</p>
          </div>
          {!loading && (
            <button
              onClick={() => {
                setGeneratedPlan('');
                setStreamingPlan('');
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create New Plan
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto">
            {/* Same simple approach as chat - just show the text */}
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {streamingPlan || generatedPlan}
              {loading && <span className="inline-block w-2 h-4 bg-blue-600 ml-1 animate-pulse"></span>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-xl font-semibold text-gray-800">AI Lesson Plan Generator</h2>
        <p className="text-sm text-gray-500">Fill in the details to generate a personalized D-OHPC lesson plan</p>
      </div>

      {/* Progress Steps */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-2xl">
          {['Basic Info', 'Teaching Strategy', 'Additional Details'].map((label, idx) => (
            <div key={idx} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                step > idx + 1 ? 'bg-green-600' : step === idx + 1 ? 'bg-blue-600' : 'bg-gray-300'
              } text-white font-semibold text-sm`}>
                {idx + 1}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                step === idx + 1 ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {label}
              </span>
              {idx < 2 && (
                <ChevronRight className="w-5 h-5 text-gray-400 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800">Basic Information</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => {
                    handleInputChange('subject', e.target.value);
                    handleInputChange('strand', ''); // Reset strand when subject changes
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              {formData.subject && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Strand <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.strand}
                    onChange={(e) => handleInputChange('strand', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a strand</option>
                    {strandsBySubject[formData.subject]?.map(strand => (
                      <option key={strand} value={strand}>{strand}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.gradeLevel}
                  onChange={(e) => handleInputChange('gradeLevel', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a grade</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>Grade {grade}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => handleInputChange('topic', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Water Cycle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Essential Learning Outcome <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.essentialOutcomes}
                  onChange={(e) => handleInputChange('essentialOutcomes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="The broad, overarching curriculum outcomes from curriculum standards"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specific Curriculum Outcomes <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.specificOutcomes}
                  onChange={(e) => handleInputChange('specificOutcomes', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="What students should know or be able to do by the end of the lesson"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Count <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.studentCount}
                    onChange={(e) => handleInputChange('studentCount', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 20"
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Teaching Strategy */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800">Teaching Strategy</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pedagogical Strategies <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Select all teaching strategies that will guide the structure and activities of your lesson plan
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {pedagogicalStrategiesOptions.map(strategy => (
                    <label key={strategy} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.pedagogicalStrategies.includes(strategy)}
                        onChange={() => handleCheckboxChange('pedagogicalStrategies', strategy)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{strategy}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Styles <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Select learning styles that best describe how your students prefer to learn
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {learningStylesOptions.map(style => (
                    <label key={style} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.learningStyles.includes(style)}
                        onChange={() => handleCheckboxChange('learningStyles', style)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{style}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Preferences
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Select how your students prefer to work and learn
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {learningPreferencesOptions.map(pref => (
                    <label key={pref} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.learningPreferences.includes(pref)}
                        onChange={() => handleCheckboxChange('learningPreferences', pref)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{pref}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Multiple Intelligences
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Select the types of intelligence your students demonstrate
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {multipleIntelligencesOptions.map(intel => (
                    <label key={intel} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.multipleIntelligences.includes(intel)}
                        onChange={() => handleCheckboxChange('multipleIntelligences', intel)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{intel}</span>
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any specific learning styles or preferences not covered above"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Resources needed for the lesson (e.g., chart paper, colored markers, projector)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prerequisite Skills <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.prerequisiteSkills}
                  onChange={(e) => handleInputChange('prerequisiteSkills', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Skills students should already have before this lesson"
                />
              </div>
            </div>
          )}

          {/* Step 3: Additional Details */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-gray-800">Additional Details</h3>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.specialNeeds}
                    onChange={(e) => handleInputChange('specialNeeds', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Students with Special Needs</span>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe specific accommodations or modifications needed"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Instructions
                </label>
                <textarea
                  value={formData.additionalInstructions}
                  onChange={(e) => handleInputChange('additionalInstructions', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional context or specific requirements for the lesson plan"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reference URL
                </label>
                <input
                  type="url"
                  value={formData.referenceUrl}
                  onChange={(e) => handleInputChange('referenceUrl', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/resource"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5 mr-1" />
                Previous
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={clearForm}
              className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Clear Form
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                disabled={!validateStep()}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            ) : (
              <button
                onClick={generateLessonPlan}
                disabled={loading}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 mr-2" />
                    Generate Lesson Plan
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanner;