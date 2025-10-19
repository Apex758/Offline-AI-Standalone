import React, { useState, useEffect, useRef } from 'react';
import { Loader2, GraduationCap, Trash2, Save, Download, History, X, Edit, Check, Copy, Sparkles } from 'lucide-react';
import AIAssistantPanel from './AIAssistantPanel';
import axios from 'axios';
import { useSettings } from '../contexts/SettingsContext';
import { TutorialOverlay } from './TutorialOverlay';
import { TutorialButton } from './TutorialButton';
import { tutorials, TUTORIAL_IDS } from '../data/tutorialSteps';

interface KindergartenPlannerProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
}

interface KindergartenHistory {
  id: string;
  title: string;
  timestamp: string;
  formData: FormData;
  generatedPlan: string;
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
}

const formatKindergartenText = (text: string, accentColor: string) => {
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
        <h2 key={`section-${currentIndex++}`} className="text-xl font-bold mt-8 mb-4 pb-2" style={{ color: `${accentColor}dd`, borderBottom: `2px solid ${accentColor}33` }}>
          {title}
        </h2>
      );
      return;
    }

    // Field labels
    if (trimmed.match(/^\*\*[^*]+:\*\*/) || trimmed.match(/^\*\*[^*]+:$/)) {
      const title = trimmed.replace(/^\*\*/, '').replace(/\*\*$/, '').replace(/:$/, '');
      elements.push(
        <h3 key={`field-${currentIndex++}`} className="text-lg font-semibold mt-6 mb-3 px-3 py-2 rounded-lg border-l-4" style={{ color: `${accentColor}cc`, backgroundColor: `${accentColor}0d`, borderColor: accentColor }}>
          {title}:
        </h3>
      );
      return;
    }

    // Activity items with special highlighting
    if (trimmed.match(/^(Circle Time|Art Activity|Story Time|Music|Outdoor Play|Learning Centers|Small Group).*:/i)) {
      elements.push(
        <div key={`activity-${currentIndex++}`} className="mt-4 mb-3">
          <div className="border-l-4 p-4 rounded-r-lg shadow-sm" style={{ background: `linear-gradient(to right, ${accentColor}1a, ${accentColor}0d)`, borderColor: `${accentColor}cc` }}>
            <h4 className="font-bold text-lg" style={{ color: `${accentColor}dd` }}>{trimmed}</h4>
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
          <span className="mr-3 mt-1.5 font-bold text-sm" style={{ color: `${accentColor}99` }}>•</span>
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
          <span className="mr-3 font-semibold min-w-[2rem] rounded px-2 py-1 text-sm" style={{ color: `${accentColor}cc`, backgroundColor: `${accentColor}0d` }}>
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

const KindergartenPlanner: React.FC<KindergartenPlannerProps> = ({ tabId, savedData, onDataChange }) => {
  const { settings, markTutorialComplete, isTutorialCompleted } = useSettings();
  const tabColor = settings.tabColors['kindergarten-planner'];
  const [showTutorial, setShowTutorial] = useState(false);
  const [loading, setLoading] = useState(false);
  const shouldReconnectRef = useRef(true);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [kindergartenHistories, setKindergartenHistories] = useState<KindergartenHistory[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Add new states for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [assistantOpen, setAssistantOpen] = useState(false);

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
      includeMaterials: true
    };
  });

  const [generatedPlan, setGeneratedPlan] = useState<string>(savedData?.generatedPlan || '');
  const [streamingPlan, setStreamingPlan] = useState<string>(savedData?.streamingPlan || '');

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

  // Initialize edited content when plan is generated
  useEffect(() => {
    if (generatedPlan && !editedContent) {
      setEditedContent(generatedPlan);
    }
  }, [generatedPlan]);

  // Tutorial auto-show logic
  useEffect(() => {
    if (
      settings.tutorials.tutorialPreferences.autoShowOnFirstUse &&
      !isTutorialCompleted(TUTORIAL_IDS.KINDERGARTEN_PLANNER)
    ) {
      setShowTutorial(true);
    }
  }, [settings, isTutorialCompleted]);

  const handleTutorialComplete = () => {
    markTutorialComplete(TUTORIAL_IDS.KINDERGARTEN_PLANNER);
    setShowTutorial(false);
  };

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
        includeMaterials: true
      });
      setGeneratedPlan('');
      setStreamingPlan('');
    } else {
      setFormData(saved);
      setGeneratedPlan(savedData?.generatedPlan || '');
      setStreamingPlan(savedData?.streamingPlan || '');
    }
  }, [tabId]);

  useEffect(() => {
    onDataChange({ formData, generatedPlan, streamingPlan });
  }, [formData, generatedPlan, streamingPlan]);

  useEffect(() => {
    shouldReconnectRef.current = true;

    const connectWebSocket = () => {
      if (!shouldReconnectRef.current) return;

      try {
        const ws = new WebSocket('ws://localhost:8000/ws/kindergarten');
        
        ws.onopen = () => {
          console.log('Kindergarten WebSocket connected');
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

  const loadKindergartenHistories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/kindergarten-history');
      setKindergartenHistories(response.data);
    } catch (error) {
      console.error('Failed to load kindergarten histories:', error);
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
        id: currentPlanId || `kindergarten_${Date.now()}`,
        title: `${formData.lessonTopic} - ${formData.curriculumUnit} (${formData.ageGroup})`,
        timestamp: new Date().toISOString(),
        formData: formData,
        generatedPlan: contentToSave
      };

      if (!currentPlanId) {
        setCurrentPlanId(planData.id);
      }

      await axios.post('http://localhost:8000/api/kindergarten-history', planData);
      await loadKindergartenHistories();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      
      // If we were editing, exit editing mode after save
      if (isEditing) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to save kindergarten plan:', error);
      alert('Failed to save kindergarten plan');
      setSaveStatus('idle');
    }
  };

  const loadKindergartenHistory = (history: KindergartenHistory) => {
    setFormData(history.formData);
    setGeneratedPlan(history.generatedPlan);
    setCurrentPlanId(history.id);
    setHistoryOpen(false);
  };

  const deleteKindergartenHistory = async (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this kindergarten plan?')) return;
    
    try {
      await axios.delete(`http://localhost:8000/api/kindergarten-history/${planId}`);
      await loadKindergartenHistories();
      if (currentPlanId === planId) {
        clearForm();
      }
    } catch (error) {
      console.error('Failed to delete kindergarten plan:', error);
    }
  };

  // Update exportPlan to use edited content
  const exportPlan = () => {
    const contentToExport = isEditing ? editedContent : generatedPlan;
    if (!contentToExport) return;

    const content = `KINDERGARTEN LESSON PLAN
${formData.lessonTopic}
${formData.curriculumUnit} - ${formData.ageGroup}
Week ${formData.week}, ${formData.dayOfWeek}
Generated: ${new Date().toLocaleDateString()}

${contentToExport}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kindergarten-${formData.lessonTopic.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadKindergartenHistories();
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

  const generatePlan = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      alert('Connection not established. Please wait and try again.');
      return;
    }

    setLoading(true);
    setStreamingPlan('');

    const prompt = `Generate a developmentally appropriate kindergarten lesson plan with the following specifications:

LESSON INFORMATION:
- Topic: ${formData.lessonTopic}
- Curriculum Unit: ${formData.curriculumUnit}
- Week: ${formData.week}
- Day: ${formData.dayOfWeek}
- Date: ${formData.date}
- Age Group: ${formData.ageGroup}
- Number of Students: ${formData.students}
- Duration: ${formData.duration} minutes
- Creativity Level: ${formData.creativityLevel}/100

LEARNING DOMAINS:
${formData.learningDomains.join(', ')}

${formData.additionalRequirements ? `ADDITIONAL REQUIREMENTS:\n${formData.additionalRequirements}\n` : ''}

GENERATION OPTIONS:
${formData.includeAssessments ? '- Include assessment strategies' : ''}
${formData.includeMaterials ? '- Include materials list' : ''}

Please create an engaging, play-based lesson plan with clear learning objectives, hands-on activities, and developmentally appropriate practices. Focus on exploration, creativity, and social-emotional learning.`;

    try {
      wsRef.current.send(JSON.stringify({ prompt }));
    } catch (error) {
      console.error('Failed to send kindergarten plan request:', error);
      setLoading(false);
    }
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
      includeMaterials: true
    });
    setGeneratedPlan('');
    setStreamingPlan('');
    setCurrentPlanId(null);
    setIsEditing(false);
    setEditedContent('');
  };

  const validateForm = () => {
    return formData.lessonTopic && formData.curriculumUnit && formData.week && 
           formData.dayOfWeek && formData.ageGroup && formData.students && 
           formData.learningDomains.length > 0;
  };

  return (
    <div className="flex h-full bg-white relative" data-tutorial="kinder-planner-welcome">
      <div className="flex-1 flex flex-col bg-white">
        {(generatedPlan || streamingPlan || isEditing) ? (
          <>
            <div className="border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {loading ? 'Generating Kindergarten Plan...' : 
                   isEditing ? 'Editing Kindergarten Plan' : 'Generated Kindergarten Plan'}
                </h2>
                <p className="text-sm text-gray-500">{formData.lessonTopic} - {formData.curriculumUnit}</p>
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
                        className="flex items-center px-4 py-2 text-white rounded-lg transition"
                        style={{ backgroundColor: tabColor }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        data-tutorial="kinder-planner-export"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setHistoryOpen(!historyOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                    title="Kindergarten Plan History"
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
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${tabColor}, ${tabColor}dd, ${tabColor}bb)` }}></div>
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${tabColor}e6, ${tabColor}cc)` }}></div>
                    
                    <div className="relative px-8 py-8">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                            <span className="text-white text-sm font-medium">{formData.curriculumUnit}</span>
                          </div>
                          
                          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
                            {formData.lessonTopic}
                          </h1>
                          
                          <div className="flex flex-wrap items-center gap-4 text-pink-100">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-pink-200 rounded-full mr-2"></div>
                              <span className="text-sm">{formData.ageGroup}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-pink-200 rounded-full mr-2"></div>
                              <span className="text-sm">Week {formData.week}, {formData.dayOfWeek}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-pink-200 rounded-full mr-2"></div>
                              <span className="text-sm">{formData.duration} minutes</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-pink-200 rounded-full mr-2"></div>
                              <span className="text-sm">{formData.students} students</span>
                            </div>
                          </div>
                        </div>
                        
                        {loading && (
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                            <div className="flex items-center text-white">
                              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                              <div>
                                <div className="text-sm font-medium">Generating...</div>
                                <div className="text-xs text-pink-100">AI-powered kindergarten plan</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-white/20">
                        <div className="flex items-center justify-between">
                          <div className="text-pink-100 text-sm">
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
                        Edit your kindergarten plan:
                      </label>
                      <div className="text-sm text-gray-500">
                        {editedContent.length} characters
                      </div>
                    </div>
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-vertical"
                      placeholder="Edit your kindergarten plan content here..."
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>You can format using markdown-style **bold** and *italic*</span>
                      <span>Lines will be preserved in the final output</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    {formatKindergartenText(streamingPlan || generatedPlan, tabColor)}
                    {loading && streamingPlan && (
                      <span className="inline-flex items-center ml-1">
                        <span className="w-0.5 h-5 animate-pulse rounded-full" style={{ backgroundColor: tabColor }}></span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {loading && (
                <div className="mt-8 rounded-xl p-6 border" style={{ background: `linear-gradient(to right, ${tabColor}0d, ${tabColor}1a)`, borderColor: `${tabColor}33` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium" style={{ color: `${tabColor}dd` }}>Creating your kindergarten plan</div>
                      <div className="text-sm mt-1" style={{ color: `${tabColor}99` }}>Play-based learning activities and developmentally appropriate practices</div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: `${tabColor}66` }}></div>
                      <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: `${tabColor}99`, animationDelay: '0.1s' }}></div>
                      <div className="w-3 h-3 rounded-full animate-bounce" style={{ backgroundColor: `${tabColor}cc`, animationDelay: '0.2s' }}></div>
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
                <h2 className="text-xl font-semibold text-gray-800">AI-Powered Kindergarten Lesson Planner</h2>
                <p className="text-sm text-gray-500">Generate engaging, developmentally appropriate lesson plans tailored to your kindergarten students</p>
              </div>
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                title="Kindergarten Plan History"
              >
                <History className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                <div data-tutorial="kinder-planner-theme">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Topic <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.lessonTopic}
                    onChange={(e) => handleInputChange('lessonTopic', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                      style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                      style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                      style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                      style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                    />
                  </div>
                </div>

                <div data-tutorial="kinder-planner-centers">
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

                <div data-tutorial="kinder-planner-learning-areas">
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
                          className="w-4 h-4 rounded"
                          style={{ accentColor: tabColor }}
                        />
                        <span className="text-sm">{domain}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div data-tutorial="kinder-planner-circle-time">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                    min="15"
                    max="480"
                    placeholder="15 minutes to 8 hours"
                  />
                </div>

                <div data-tutorial="kinder-planner-play-activities">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Requirements
                  </label>
                  <textarea
                    value={formData.additionalRequirements}
                    onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                  />
                </div>

                <div data-tutorial="kinder-planner-assessment">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Generation Options
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.includeAssessments}
                        onChange={(e) => handleInputChange('includeAssessments', e.target.checked)}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: tabColor }}
                      />
                      <span className="text-sm">Include Assessments</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.includeMaterials}
                        onChange={(e) => handleInputChange('includeMaterials', e.target.checked)}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: tabColor }}
                      />
                      <span className="text-sm">Include Materials</span>
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
                  className="flex items-center px-6 py-2 text-white rounded-lg disabled:bg-gray-300 transition"
                  style={!validateForm() || loading ? {} : { backgroundColor: tabColor }}
                  onMouseEnter={(e) => !loading && validateForm() && (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={(e) => !loading && validateForm() && (e.currentTarget.style.opacity = '1')}
                  data-tutorial="kinder-planner-generate"
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

      {/* History Panel */}
      <div
        className={`border-l border-gray-200 bg-gray-50 transition-all duration-300 overflow-hidden ${
          historyOpen ? 'w-80' : 'w-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Saved Kindergarten Plans</h3>
            <button
              onClick={() => setHistoryOpen(false)}
              className="p-1 rounded hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
            {kindergartenHistories.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <GraduationCap className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No saved kindergarten plans yet</p>
              </div>
            ) : (
              kindergartenHistories.map((history) => (
                <div
                  key={history.id}
                  onClick={() => loadKindergartenHistory(history)}
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
                      onClick={(e) => deleteKindergartenHistory(history.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition"
                      title="Delete kindergarten plan"
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
        contentType="kindergarten"
        onContentUpdate={(newContent) => {
          setGeneratedPlan(newContent);
          setEditedContent(newContent);
        }}
      />

      {/* Tutorial Components */}
      <TutorialOverlay
        steps={tutorials[TUTORIAL_IDS.KINDERGARTEN_PLANNER].steps}
        onComplete={handleTutorialComplete}
        autoStart={showTutorial}
        showFloatingButton={false}
      />

      {!showTutorial && (
        <TutorialButton
          tutorialId={TUTORIAL_IDS.KINDERGARTEN_PLANNER}
          onStartTutorial={() => setShowTutorial(true)}
          position="bottom-right"
        />
      )}
    </div>
  );
};

export default KindergartenPlanner;