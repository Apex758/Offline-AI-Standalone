import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Loader2, Users, Trash2, Save, Download, History, X, Edit, Check, Copy, Sparkles } from 'lucide-react';
import AIAssistantPanel from './AIAssistantPanel';
import axios from 'axios';

interface MultigradePlannerProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
}

interface MultigradeHistory {
  id: string;
  title: string;
  timestamp: string;
  formData: FormData;
  generatedPlan: string;
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

const formatMultigradeText = (text: string) => {
  if (!text) return null;

  let cleanText = text;
  if (cleanText.includes("To change it, set a different value via -sys PROMPT")) {
    cleanText = cleanText.split("To change it, set a different value via -sys PROMPT")[1] || cleanText;
  }

  const lines = cleanText.split('\n');
  const elements: JSX.Element[] = [];
  let currentIndex = 0;

  lines.forEach((line) => {
    const trimmed = line.trim();
    
    if (!trimmed) {
      elements.push(<div key={`space-${currentIndex++}`} className="h-3"></div>);
      return;
    }

    // Main section headings
    if (trimmed.match(/^\*\*(.+)\*\*$/)) {
      const title = trimmed.replace(/\*\*/g, '');
      elements.push(
        <h2 key={`section-${currentIndex++}`} className="text-xl font-bold text-indigo-900 mt-8 mb-4 pb-2 border-b border-indigo-200">
          {title}
        </h2>
      );
      return;
    }

    // Field labels
    if (trimmed.match(/^\*\*[^*]+:\*\*/) || trimmed.match(/^\*\*[^*]+:$/)) {
      const title = trimmed.replace(/^\*\*/, '').replace(/\*\*$/, '').replace(/:$/, '');
      elements.push(
        <h3 key={`field-${currentIndex++}`} className="text-lg font-semibold text-indigo-700 mt-6 mb-3 bg-indigo-50 px-3 py-2 rounded-lg border-l-4 border-indigo-500">
          {title}:
        </h3>
      );
      return;
    }

    // Grade level sections with special highlighting
    if (trimmed.match(/^(Grade|Kindergarten|Differentiated Activities|Extension Activities).*:/i)) {
      elements.push(
        <div key={`grade-${currentIndex++}`} className="mt-4 mb-3">
          <div className="bg-gradient-to-r from-indigo-100 to-purple-50 border-l-4 border-indigo-600 p-4 rounded-r-lg shadow-sm">
            <h4 className="font-bold text-indigo-900 text-lg">{trimmed}</h4>
          </div>
        </div>
      );
      return;
    }

    // Bullet points
    if (trimmed.match(/^\s*\*\s+/) && !trimmed.startsWith('**')) {
      const content = trimmed.replace(/^\s*\*\s+/, '');
      elements.push(
        <div key={`bullet-${currentIndex++}`} className="mb-2 flex items-start ml-4">
          <span className="text-indigo-500 mr-3 mt-1.5 font-bold text-sm">•</span>
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
        <div key={`numbered-${currentIndex++}`} className="mb-3 flex items-start ml-4">
          <span className="text-indigo-600 mr-3 font-semibold min-w-[2rem] bg-indigo-50 rounded px-2 py-1 text-sm">
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

const MultigradePlanner: React.FC<MultigradePlannerProps> = ({ tabId, savedData, onDataChange }) => {
  const [loading, setLoading] = useState(false);
  const shouldReconnectRef = useRef(true);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [multigradeHistories, setMultigradeHistories] = useState<MultigradeHistory[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [step, setStep] = useState(savedData?.step || 1);

  // Add new states for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [assistantOpen, setAssistantOpen] = useState(false);

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
  const [streamingPlan, setStreamingPlan] = useState<string>(savedData?.streamingPlan || '');

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

  // Initialize edited content when plan is generated
  useEffect(() => {
    if (generatedPlan && !editedContent) {
      setEditedContent(generatedPlan);
    }
  }, [generatedPlan]);

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
      setStreamingPlan('');
      setStep(1);
    } else {
      setFormData(saved);
      setGeneratedPlan(savedData?.generatedPlan || '');
      setStreamingPlan(savedData?.streamingPlan || '');
      setStep(savedData?.step || 1);
    }
  }, [tabId]);

  useEffect(() => {
    onDataChange({ formData, generatedPlan, streamingPlan, step });
  }, [formData, generatedPlan, streamingPlan, step]);

  useEffect(() => {
    shouldReconnectRef.current = true;

    const connectWebSocket = () => {
      if (!shouldReconnectRef.current) return;

      try {
        const ws = new WebSocket('ws://localhost:8000/ws/multigrade');
        
        ws.onopen = () => {
          console.log('Multigrade WebSocket connected');
        };
        
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
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
          if (shouldReconnectRef.current && !loading) {
            reconnectTimeoutRef.current = setTimeout(connectWebSocket, 2000);
          }
        };
        
        wsRef.current = ws;
      } catch (error) {
        console.error('Failed to create WebSocket:', error);
        if (shouldReconnectRef.current) {
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, 2000);
        }
      }
    };
    
    connectWebSocket();
    
    return () => {
      shouldReconnectRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      wsRef.current = null;
    };
  }, []);

  // Enable editing mode
  const enableEditing = () => {
    setEditedContent(generatedPlan);
    setIsEditing(true);
  };

  // Save edited content
  const saveEditedContent = () => {
    setGeneratedPlan(editedContent);
    setIsEditing(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditedContent(generatedPlan);
    setIsEditing(false);
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editedContent || generatedPlan);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const loadMultigradeHistories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/multigrade-history');
      setMultigradeHistories(response.data);
    } catch (error) {
      console.error('Failed to load multigrade histories:', error);
    }
  };

  // Update savePlan to use edited content
  const savePlan = async () => {
    const contentToSave = isEditing ? editedContent : generatedPlan;
    if (!contentToSave) {
      alert('No plan to save');
      return;
    }

    setSaveStatus('saving');
    try {
      const planData = {
        id: currentPlanId || `multigrade_${Date.now()}`,
        title: `${formData.subject} - ${formData.topic} (${formData.gradeRange})`,
        timestamp: new Date().toISOString(),
        formData: formData,
        generatedPlan: contentToSave
      };

      if (!currentPlanId) {
        setCurrentPlanId(planData.id);
      }

      await axios.post('http://localhost:8000/api/multigrade-history', planData);
      await loadMultigradeHistories();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      
      // If we were editing, exit editing mode after save
      if (isEditing) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to save multigrade plan:', error);
      alert('Failed to save multigrade plan');
      setSaveStatus('idle');
    }
  };

  const loadMultigradeHistory = (history: MultigradeHistory) => {
    setFormData(history.formData);
    setGeneratedPlan(history.generatedPlan);
    setCurrentPlanId(history.id);
    setHistoryOpen(false);
  };

  const deleteMultigradeHistory = async (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this multigrade plan?')) return;
    
    try {
      await axios.delete(`http://localhost:8000/api/multigrade-history/${planId}`);
      await loadMultigradeHistories();
      if (currentPlanId === planId) {
        clearForm();
      }
    } catch (error) {
      console.error('Failed to delete multigrade plan:', error);
    }
  };

  // Update exportPlan to use edited content
  const exportPlan = () => {
    const contentToExport = isEditing ? editedContent : generatedPlan;
    if (!contentToExport) return;

    const content = `MULTIGRADE LESSON PLAN
${formData.subject} - ${formData.gradeRange}
${formData.topic}
Generated: ${new Date().toLocaleDateString()}

${contentToExport}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `multigrade-${formData.topic.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadMultigradeHistories();
  }, []);

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
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      alert('Connection not established. Please wait and try again.');
      return;
    }

    setLoading(true);
    setStreamingPlan('');

    const prompt = `Generate a comprehensive multigrade lesson plan with the following specifications:

MULTIGRADE INFORMATION:
- Subject: ${formData.subject}
- Grade Range: ${formData.gradeRange}
- Topic: ${formData.topic}
- Total Students: ${formData.totalStudents}
- Duration: ${formData.duration} minutes
- Date: ${new Date().toLocaleDateString()}

CURRICULUM ALIGNMENT:
Essential Learning Outcomes: ${formData.essentialLearningOutcomes}

Specific Learning Objectives: ${formData.specificLearningObjectives}

${formData.prerequisiteSkills ? `PREREQUISITE SKILLS:\n${formData.prerequisiteSkills}\n` : ''}

RESOURCES:
- Materials: ${formData.materials}

TEACHING APPROACH:
- Learning Styles: ${formData.learningStyles.join(', ')}
- Learning Preferences: ${formData.learningPreferences.join(', ')}
- Multiple Intelligences: ${formData.multipleIntelligences.join(', ')}
${formData.customLearningStyles ? `- Custom Learning Styles: ${formData.customLearningStyles}` : ''}
- Pedagogical Strategies: ${formData.pedagogicalStrategies.join(', ')}
- Multigrade Strategies: ${formData.multigradeStrategies.join(', ')}

${formData.specialNeeds ? `SPECIAL NEEDS ACCOMMODATIONS:\n${formData.specialNeedsDetails}\n` : ''}

${formData.differentiationNotes ? `DIFFERENTIATION NOTES:\n${formData.differentiationNotes}\n` : ''}

Please generate a detailed multigrade lesson plan with clear differentiation strategies for each grade level, flexible grouping approaches, and activities that can be implemented simultaneously across multiple grades. Include specific learning objectives and activities tailored to each grade level within the range.`;

    try {
      wsRef.current.send(JSON.stringify({ prompt }));
    } catch (error) {
      console.error('Failed to send multigrade plan request:', error);
      setLoading(false);
    }
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
    setStreamingPlan('');
    setCurrentPlanId(null);
    setStep(1);
    setIsEditing(false);
    setEditedContent('');
  };

  return (
    <div className="flex h-full bg-white relative">
      <div className="flex-1 flex flex-col bg-white">
        {(generatedPlan || streamingPlan || isEditing) ? (
          <>
            <div className="border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {loading ? 'Generating Multigrade Plan...' : 
                   isEditing ? 'Editing Multigrade Plan' : 'Generated Multigrade Plan'}
                </h2>
                <p className="text-sm text-gray-500">{formData.subject} - {formData.gradeRange}</p>
              </div>
              {!loading && (
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={cancelEditing}
                        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                      <button
                        onClick={saveEditedContent}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Save Edits
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={enableEditing}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => setAssistantOpen(true)}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-lg"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Assistant
                      </button>
                      <button
                        onClick={savePlan}
                        disabled={saveStatus === 'saving'}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
                      >
                        {saveStatus === 'saving' ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : saveStatus === 'saved' ? (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Saved!
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Plan
                          </>
                        )}
                      </button>
                      <button
                        onClick={exportPlan}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setHistoryOpen(!historyOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                    title="Multigrade Plan History"
                  >
                    <History className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => {
                      setGeneratedPlan('');
                      setStreamingPlan('');
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Create New Plan
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto bg-white p-6">
              {(streamingPlan || generatedPlan) && !isEditing && (
                <div className="mb-8">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-blue-700"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/90 to-blue-600/90"></div>
                    
                    <div className="relative px-8 py-8">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                            <span className="text-white text-sm font-medium">{formData.subject}</span>
                          </div>
                          
                          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
                            {formData.topic ? `${formData.topic} - Multigrade` : 'Multigrade Lesson Plan'}
                          </h1>
                          
                          <div className="flex flex-wrap items-center gap-4 text-indigo-100">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-indigo-200 rounded-full mr-2"></div>
                              <span className="text-sm">{formData.gradeRange}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-indigo-200 rounded-full mr-2"></div>
                              <span className="text-sm">{formData.totalStudents} students</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-indigo-200 rounded-full mr-2"></div>
                              <span className="text-sm">{formData.duration} minutes</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-indigo-200 rounded-full mr-2"></div>
                              <span className="text-sm">{formData.multigradeStrategies.length} strategies</span>
                            </div>
                          </div>
                        </div>
                        
                        {loading && (
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                            <div className="flex items-center text-white">
                              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                              <div>
                                <div className="text-sm font-medium">Generating...</div>
                                <div className="text-xs text-indigo-100">AI-powered multigrade plan</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-white/20">
                        <div className="flex items-center justify-between">
                          <div className="text-indigo-100 text-sm">
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
                    
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  </div>
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700">
                        Edit your multigrade plan:
                      </label>
                      <div className="text-sm text-gray-500">
                        {editedContent.length} characters
                      </div>
                    </div>
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-vertical"
                      placeholder="Edit your multigrade plan content here..."
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>You can format using markdown-style **bold** and *italic*</span>
                      <span>Lines will be preserved in the final output</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    {formatMultigradeText(streamingPlan || generatedPlan)}
                    {loading && streamingPlan && (
                      <span className="inline-flex items-center ml-1">
                        <span className="w-0.5 h-5 bg-indigo-500 animate-pulse rounded-full"></span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {loading && (
                <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-indigo-900 font-medium">Creating your multigrade plan</div>
                      <div className="text-indigo-600 text-sm mt-1">Differentiated activities for multiple grade levels</div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-indigo-400 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Create Multigrade Lesson Plan</h2>
                <p className="text-sm text-gray-500">Design a lesson that addresses multiple grade levels simultaneously</p>
              </div>
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                title="Multigrade Plan History"
              >
                <History className="w-5 h-5 text-gray-600" />
              </button>
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
                      disabled={loading || !validateStep()}
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

      {/* History Panel */}
      <div
        className={`border-l border-gray-200 bg-gray-50 transition-all duration-300 overflow-hidden ${
          historyOpen ? 'w-80' : 'w-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Saved Multigrade Plans</h3>
            <button
              onClick={() => setHistoryOpen(false)}
              className="p-1 rounded hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
            {multigradeHistories.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No saved multigrade plans yet</p>
              </div>
            ) : (
              multigradeHistories.map((history) => (
                <div
                  key={history.id}
                  onClick={() => loadMultigradeHistory(history)}
                  className={`p-3 rounded-lg cursor-pointer transition group hover:bg-white ${
                    currentPlanId === history.id ? 'bg-white shadow-sm' : 'bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 line-clamp-2">
                        {history.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(history.timestamp).toLocaleDateString()} {new Date(history.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => deleteMultigradeHistory(history.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition"
                      title="Delete multigrade plan"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* AI Assistant Panel */}
      <AIAssistantPanel
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        content={generatedPlan}
        contentType="multigrade"
        onContentUpdate={(newContent) => {
          setGeneratedPlan(newContent);
          setEditedContent(newContent);
        }}
      />
    </div>
  );
};

export default MultigradePlanner;