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

const formatLessonText = (text: string) => {
  if (!text) return null;

  // Clean the text first
  let cleanText = text;
  if (cleanText.includes("To change it, set a different value via -sys PROMPT")) {
    cleanText = cleanText.split("To change it, set a different value via -sys PROMPT")[1] || cleanText;
  }

  const lines = cleanText.split('\n');
  const elements: JSX.Element[] = [];
  let currentIndex = 0;
  let detailsCollected: string[] = [];

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    
    if (!trimmed) {
      elements.push(<div key={`space-${currentIndex++}`} className="h-3"></div>);
      return;
    }

    // Collect the basic details for grid layout
    if (trimmed.match(/^\*\*(Grade Level|Subject|Strand|Topic|Duration|Date):/)) {
      detailsCollected.push(trimmed);
      
      // When we have all 6 details, render them in a grid
      if (detailsCollected.length === 6) {
        elements.push(
          <div key={`details-grid-${currentIndex++}`} className="grid grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
            {detailsCollected.map((detail, i) => {
              const [label, value] = detail.replace(/\*\*/g, '').split(': ');
              return (
                <div key={i} className="text-sm">
                  <span className="font-semibold text-gray-600">{label}:</span>
                  <span className="ml-2 text-gray-800">{value}</span>
                </div>
              );
            })}
          </div>
        );
        detailsCollected = []; // Reset
      }
      return;
    }

    // Skip main lesson title
    if (trimmed.match(/^\*\*Lesson Plan:/)) {
      return;
    }

    // Section headings (surrounded by **)
    if (trimmed.match(/^\*\*(.+)\*\*$/)) {
      const title = trimmed.replace(/\*\*/g, '');
      elements.push(
        <h2 key={`section-${currentIndex++}`} className="text-xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-200">
          {title}
        </h2>
      );
      return;
    }

    // Field labels (start with ** but don't end with **)
    if (trimmed.match(/^\*\*[^*]+:\*\*/) || trimmed.match(/^\*\*[^*]+:$/)) {
      const title = trimmed.replace(/^\*\*/, '').replace(/\*\*$/, '').replace(/:$/, '');
      elements.push(
        <h3 key={`field-${currentIndex++}`} className="text-lg font-semibold text-blue-700 mt-6 mb-2">
          {title}:
        </h3>
      );
      return;
    }

    // Bullet points with + (nested)
    if (trimmed.match(/^\s*\+\s+/)) {
      const content = trimmed.replace(/^\s*\+\s+/, '');
      elements.push(
        <div key={`nested-${currentIndex++}`} className="ml-8 mb-2 flex items-start">
          <span className="text-blue-400 mr-2 mt-1.5 text-xs">▸</span>
          <span className="text-gray-600 leading-relaxed text-sm">{content}</span>
        </div>
      );
      return;
    }

    // Regular bullet points
    if (trimmed.match(/^\s*\*\s+/) && !trimmed.startsWith('**')) {
      const content = trimmed.replace(/^\s*\*\s+/, '');
      elements.push(
        <div key={`bullet-${currentIndex++}`} className="mb-2 flex items-start">
          <span className="text-blue-500 mr-3 mt-1.5 font-bold text-sm">•</span>
          <span className="text-gray-700 leading-relaxed">{content}</span>
        </div>
      );
      return;
    }

    // Numbered items
    if (trimmed.match(/^\d+\./)) {
      const number = trimmed.match(/^\d+\./)?.[0] || '';
      const content = trimmed.replace(/^\d+\.\s*/, '');
      elements.push(
        <div key={`numbered-${currentIndex++}`} className="mb-3 flex items-start">
          <span className="text-blue-600 mr-3 font-semibold min-w-[2rem] bg-blue-50 rounded px-2 py-1 text-sm">
            {number}
          </span>
          <span className="text-gray-700 leading-relaxed pt-1">{content}</span>
        </div>
      );
      return;
    }

    // Regular paragraphs
    if (trimmed.length > 0) {
      elements.push(
        <p key={`p-${currentIndex++}`} className="text-gray-700 leading-relaxed mb-3">
          {trimmed}
        </p>
      );
    }
  });

  return elements;
};

const LessonPlanner: React.FC<LessonPlannerProps> = ({ tabId, savedData, onDataChange }) => {
  const [loading, setLoading] = useState(false);
  const shouldReconnectRef = useRef(true);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [formData, setFormData] = useState<FormData>(() => {
    // Load saved data if available
    return savedData?.formData || {
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
    };
  });

  const [generatedPlan, setGeneratedPlan] = useState<string>(savedData?.generatedPlan || '');
  const [streamingPlan, setStreamingPlan] = useState<string>('');
  const [step, setStep] = useState(savedData?.step || 1);

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

  // Save data whenever it changes
  useEffect(() => {
    onDataChange({
      formData,
      generatedPlan,
      step
    });
  }, [formData, generatedPlan, step]);

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
      <div className="h-full flex flex-col bg-white overflow-hidden">
        <div className="border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
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
        
        <div className="flex-1 overflow-y-auto bg-white p-6">
          {/* Modern Header Card */}
          {(streamingPlan || generatedPlan) && (
            <div className="mb-8">
              <div className="relative overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-700"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/90 to-purple-600/90"></div>
                
                {/* Content */}
                <div className="relative px-8 py-8">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Subject badge */}
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                        <span className="text-white text-sm font-medium">{formData.subject}</span>
                      </div>
                      
                      {/* Main title */}
                      <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
                        {formData.topic ? `Exploring ${formData.topic}` : 'Lesson Plan'}
                      </h1>
                      
                      {/* Subtitle details */}
                      <div className="flex flex-wrap items-center gap-4 text-blue-100">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-200 rounded-full mr-2"></div>
                          <span className="text-sm">Grade {formData.gradeLevel}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-200 rounded-full mr-2"></div>
                          <span className="text-sm">{formData.strand}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-200 rounded-full mr-2"></div>
                          <span className="text-sm">{formData.duration} minutes</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-200 rounded-full mr-2"></div>
                          <span className="text-sm">{formData.studentCount} students</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Loading indicator */}
                    {loading && (
                      <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                        <div className="flex items-center text-white">
                          <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                          <div>
                            <div className="text-sm font-medium">Generating...</div>
                            <div className="text-xs text-blue-100">AI-powered lesson plan</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Bottom info bar */}
                  <div className="mt-6 pt-4 border-t border-white/20">
                    <div className="flex items-center justify-between">
                      <div className="text-blue-100 text-sm">
                        <span className="opacity-75">Generated on</span> {new Date().toLocaleDateString()}
                      </div>
                      {!loading && (
                        <div className="flex items-center text-green-200 text-sm">
                          <div className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></div>
                          <span>Generation Complete</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
              </div>
            </div>
          )}

          {/* Formatted content */}
          <div className="prose prose-lg max-w-none">
            <div className="space-y-1">
              {formatLessonText(streamingPlan || generatedPlan)}
              {loading && streamingPlan && (
                <span className="inline-flex items-center ml-1">
                  <span className="w-0.5 h-5 bg-blue-500 animate-pulse rounded-full"></span>
                </span>
              )}
            </div>
          </div>

          {/* Loading progress at bottom */}
          {loading && (
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-blue-900 font-medium">Creating your lesson plan</div>
                  <div className="text-blue-600 text-sm mt-1">Tailored for your specific requirements</div>
                </div>
                <div className="flex space-x-1">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
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
      <div className="flex-1 overflow-y-auto p-6" style={{ height: 'calc(100vh - 200px)' }}>
        <div className="max-w-4xl mx-auto">
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