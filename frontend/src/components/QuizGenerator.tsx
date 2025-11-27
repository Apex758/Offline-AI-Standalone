import React, { useState, useEffect, useRef } from 'react';
import { Loader2, ListChecks, Trash2, Save, Download, History, X, Edit, Check, Sparkles } from 'lucide-react';
import AIAssistantPanel from './AIAssistantPanel';
import QuizEditor from './QuizEditor';
import axios from 'axios';
import { ParsedQuiz, parseQuizFromAI, quizToDisplayText, displayTextToQuiz } from '../types/quiz';
import { buildQuizPrompt } from '../utils/quizPromptBuilder';
import { useSettings } from '../contexts/SettingsContext';
import { TutorialOverlay } from './TutorialOverlay';
import { TutorialButton } from './TutorialButton';
import { tutorials, TUTORIAL_IDS } from '../data/tutorialSteps';

interface QuizGeneratorProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
}

interface QuizHistory {
  id: string;
  title: string;
  timestamp: string;
  formData: FormData;
  generatedQuiz: string;
  parsedQuiz?: ParsedQuiz; // Add parsed quiz to history
}

interface FormData {
  subject: string;
  gradeLevel: string;
  learningOutcomes: string;
  questionTypes: string[];
  cognitiveLevels: string[];
  timeLimitPerQuestion: string;
  randomizeQuestions: boolean;
  numberOfQuestions: string;
}

const formatQuizText = (text: string, accentColor: string) => {
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

    // Question numbers
    if (trimmed.match(/^Question \d+:/)) {
      elements.push(
        <h3 key={`question-${currentIndex++}`} className="text-lg font-semibold mt-6 mb-3 p-3 rounded-lg" style={{ color: `${accentColor}cc`, backgroundColor: `${accentColor}0d` }}>
          {trimmed}
        </h3>
      );
      return;
    }

    // Answer options (A), B), C), D))
    if (trimmed.match(/^[A-D]\)/)) {
      elements.push(
        <div key={`option-${currentIndex++}`} className="ml-6 mb-2 flex items-start">
          <span className="mr-3 font-semibold" style={{ color: `${accentColor}cc` }}>{trimmed.substring(0, 2)}</span>
          <span className="text-gray-700">{trimmed.substring(2).trim()}</span>
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

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ tabId, savedData, onDataChange }) => {
  const { settings, markTutorialComplete, isTutorialCompleted } = useSettings();
  const tabColor = settings.tabColors['quiz-generator'];
  const [loading, setLoading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const shouldReconnectRef = useRef(true);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [quizHistories, setQuizHistories] = useState<QuizHistory[]>([]);
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // State for structured editing
  const [isEditing, setIsEditing] = useState(false);
  const [parsedQuiz, setParsedQuiz] = useState<ParsedQuiz | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);

  // Track initialization per tab to prevent state loss on tab switches
  const hasInitializedRef = useRef(false);
  const currentTabIdRef = useRef(tabId);

  // Helper function to get default empty form data
  const getDefaultFormData = (): FormData => ({
    subject: '',
    gradeLevel: '',
    learningOutcomes: '',
    questionTypes: [],
    cognitiveLevels: [],
    timeLimitPerQuestion: '',
    randomizeQuestions: false,
    numberOfQuestions: '10'
  });

  // Form data
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = savedData?.formData;
    // Robust validation: check if saved data exists AND has meaningful content
    if (saved && typeof saved === 'object' && saved.subject?.trim()) {
      return saved;
    }
    return getDefaultFormData();
  });

  const [generatedQuiz, setGeneratedQuiz] = useState<string>(savedData?.generatedQuiz || '');
  const [streamingQuiz, setStreamingQuiz] = useState<string>(savedData?.streamingQuiz || '');

  const subjects = ['Mathematics', 'Science', 'Language Arts', 'Social Studies', 'Music', 'Physical Education'];
  const grades = ['K', '1', '2', '3', '4', '5', '6'];
  const questionTypesOptions = ['Multiple Choice', 'True/False', 'Open-Ended', 'Fill-in-the-Blank'];
  const cognitiveLevelsOptions = ['Knowledge', 'Comprehension', 'Application', 'Analysis', 'Synthesis', 'Evaluation'];

  // Try to parse quiz when generated (for restored/loaded quizzes)
  useEffect(() => {
    if (generatedQuiz && !parsedQuiz) {
      console.log('Attempting to parse loaded/restored quiz...');
      const parsed = parseQuizFromAI(generatedQuiz);
      if (parsed) {
        console.log('Loaded quiz parsed successfully');
        setParsedQuiz(parsed);
      } else {
        console.log('Loaded quiz parsing failed, creating fallback');
        // Fallback: convert text to parsed format
        setParsedQuiz(displayTextToQuiz(generatedQuiz, {
          title: `${formData.subject} Quiz`,
          subject: formData.subject,
          gradeLevel: formData.gradeLevel,
          totalQuestions: parseInt(formData.numberOfQuestions)
        }));
      }
    }
  }, [generatedQuiz]);

  // Auto-enable editing mode if startInEditMode flag is set
  useEffect(() => {
    if (savedData?.startInEditMode && parsedQuiz && !isEditing) {
      console.log('Auto-enabling edit mode for quiz');
      setIsEditing(true);
    }
  }, [savedData?.startInEditMode, parsedQuiz, isEditing]);

  // WebSocket setup
  useEffect(() => {
    shouldReconnectRef.current = true;

    const connectWebSocket = () => {
      if (!shouldReconnectRef.current) return;

      try {
        // Detect if running in Electron
        const isElectron = typeof window !== 'undefined' && window.electronAPI;

        let wsUrl: string;
        if (isElectron) {
          // Electron/Production: direct connection to backend
          wsUrl = 'ws://127.0.0.1:8000/ws/quiz';
        } else {
          // Vite/Development: use proxy through dev server
          const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
          const host = window.location.host;
          wsUrl = `${protocol}//${host}/ws/quiz`;
        }

        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('Quiz WebSocket connected');
        };
        
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === 'token') {
            setStreamingQuiz(prev => prev + data.content);
          } else if (data.type === 'done') {
            setStreamingQuiz(current => {
              const finalMessage = current || data.full_response;
              setGeneratedQuiz(finalMessage);
              
              console.log('Quiz generation complete, parsing...');
              
              // Try to parse immediately
              const parsed = parseQuizFromAI(finalMessage);
              if (parsed) {
                console.log('Quiz parsed successfully:', parsed.questions.length, 'questions');
                setParsedQuiz(parsed);
              } else {
                console.warn('Quiz parsing failed, creating fallback structure');
                // Create a fallback parsed quiz so editing still works
                setParsedQuiz(displayTextToQuiz(finalMessage, {
                  title: `${formData.subject} Quiz`,
                  subject: formData.subject,
                  gradeLevel: formData.gradeLevel,
                  totalQuestions: parseInt(formData.numberOfQuestions)
                }));
              }
              
              setLoading(false);
              return '';
            });
          } else if (data.type === 'error') {
            console.error('Quiz generation error:', data.message);
            alert('Quiz generation failed: ' + data.message);
            setLoading(false);
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

  // FIXED: Properly handle tab switches without losing state
  useEffect(() => {
    const isNewTab = currentTabIdRef.current !== tabId;
    currentTabIdRef.current = tabId;
    
    // Only update state when switching tabs OR on first initialization
    if (isNewTab || !hasInitializedRef.current) {
      const saved = savedData?.formData;
      
      // Robust validation: check if saved data has meaningful content
      if (saved && typeof saved === 'object' && saved.subject?.trim()) {
        // Restore all state for this tab
        setFormData(saved);
        setGeneratedQuiz(savedData?.generatedQuiz || '');
        setStreamingQuiz(savedData?.streamingQuiz || '');
        setParsedQuiz(savedData?.parsedQuiz || null);
      } else {
        // New tab or empty tab - set to default state
        setFormData(getDefaultFormData());
        setGeneratedQuiz('');
        setStreamingQuiz('');
        setParsedQuiz(null);
      }
      
      hasInitializedRef.current = true;
    }
  }, [tabId, savedData]);

  // Enable structured editing mode
  const enableEditing = () => {
    if (parsedQuiz) {
      setIsEditing(true);
    } else {
      alert('Cannot edit: Quiz format not recognized. Try regenerating the quiz.');
    }
  };

  // Save edited quiz
  const saveEditedQuiz = (editedQuiz: ParsedQuiz) => {
    setParsedQuiz(editedQuiz);
    const displayText = quizToDisplayText(editedQuiz);
    setGeneratedQuiz(displayText);
    setIsEditing(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
  };

  const loadQuizHistories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/quiz-history');
      setQuizHistories(response.data);
    } catch (error) {
      console.error('Failed to load quiz histories:', error);
    }
  };

  const saveQuiz = async () => {
    const contentToSave = parsedQuiz ? quizToDisplayText(parsedQuiz) : generatedQuiz;
    if (!contentToSave) {
      alert('No quiz to save');
      return;
    }

    setSaveStatus('saving');
    try {
      const quizData = {
        id: currentQuizId || `quiz_${Date.now()}`,
        title: `${formData.subject} Quiz - Grade ${formData.gradeLevel} (${formData.numberOfQuestions} questions)`,
        timestamp: new Date().toISOString(),
        formData: formData,
        generatedQuiz: contentToSave,
        parsedQuiz: parsedQuiz || undefined
      };

      if (!currentQuizId) {
        setCurrentQuizId(quizData.id);
      }

      await axios.post('http://localhost:8000/api/quiz-history', quizData);
      await loadQuizHistories();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save quiz:', error);
      alert('Failed to save quiz');
      setSaveStatus('idle');
    }
  };

  const exportQuiz = () => {
    const contentToExport = parsedQuiz ? quizToDisplayText(parsedQuiz) : generatedQuiz;
    if (!contentToExport) return;

    const content = `QUIZ
${formData.subject} - Grade ${formData.gradeLevel}
${formData.numberOfQuestions} Questions
Generated: ${new Date().toLocaleDateString()}

${contentToExport}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-${formData.subject.toLowerCase()}-grade${formData.gradeLevel}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadQuizHistories();
  }, []);

  const loadQuizHistory = (history: QuizHistory) => {
    setFormData(history.formData);
    setGeneratedQuiz(history.generatedQuiz);
    setParsedQuiz(history.parsedQuiz || null);
    setCurrentQuizId(history.id);
    setHistoryOpen(false);
  };

  const deleteQuizHistory = async (quizId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this quiz?')) return;
    
    try {
      await axios.delete(`http://localhost:8000/api/quiz-history/${quizId}`);
      await loadQuizHistories();
      if (currentQuizId === quizId) {
        clearForm();
      }
    } catch (error) {
      console.error('Failed to delete quiz:', error);
    }
  };

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

  const generateQuiz = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      alert('Connection not established. Please wait and try again.');
      return;
    }

    setLoading(true);
    setStreamingQuiz('');
    setParsedQuiz(null);

    // Use the new prompt builder
    const prompt = buildQuizPrompt(formData);

    try {
      wsRef.current.send(JSON.stringify({ prompt }));
    } catch (error) {
      console.error('Failed to send quiz request:', error);
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      subject: '',
      gradeLevel: '',
      learningOutcomes: '',
      questionTypes: [],
      cognitiveLevels: [],
      timeLimitPerQuestion: '',
      randomizeQuestions: false,
      numberOfQuestions: '10'
    });
    setGeneratedQuiz('');
    setStreamingQuiz('');
    setParsedQuiz(null);
    setCurrentQuizId(null);
    setIsEditing(false);
  };

  const validateForm = () => {
    return formData.subject && formData.gradeLevel && formData.learningOutcomes && 
           formData.questionTypes.length > 0 && formData.cognitiveLevels.length > 0;
  };

  // Auto-show tutorial on first use
  useEffect(() => {
    if (
      settings.tutorials.tutorialPreferences.autoShowOnFirstUse &&
      !isTutorialCompleted(TUTORIAL_IDS.QUIZ_GENERATOR)
    ) {
      setShowTutorial(true);
    }
  }, [settings, isTutorialCompleted]);

  const handleTutorialComplete = () => {
    markTutorialComplete(TUTORIAL_IDS.QUIZ_GENERATOR);
    setShowTutorial(false);
  };

  // Save data whenever it changes
  useEffect(() => {
    onDataChange({ formData, generatedQuiz, streamingQuiz, parsedQuiz });
  }, [formData, generatedQuiz, streamingQuiz, parsedQuiz]);


  return (
    <div className="flex h-full bg-white relative" data-tutorial="quiz-generator-welcome">
      <div className="flex-1 flex flex-col bg-white">
        {(generatedQuiz || streamingQuiz || isEditing) ? (
          <>
            {isEditing && parsedQuiz ? (
              // Show Structured Editor
              <QuizEditor
                quiz={parsedQuiz}
                onSave={saveEditedQuiz}
                onCancel={cancelEditing}
              />
            ) : (
              // Show generated quiz (existing display code)
              <>
                <div className="border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {loading ? 'Generating Quiz...' : 'Generated Quiz'}
                    </h2>
                    <p className="text-sm text-gray-500">{formData.subject} - Grade {formData.gradeLevel}</p>
                  </div>
                  {!loading && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={enableEditing}
                        disabled={!parsedQuiz}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        title={!parsedQuiz ? "Quiz format not recognized" : "Edit quiz"}
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
                        onClick={saveQuiz}
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
                            Save Quiz
                          </>
                        )}
                      </button>
                      <button
                        onClick={exportQuiz}
                        className="flex items-center px-4 py-2 text-white rounded-lg transition"
                        data-tutorial="quiz-generator-export"
                        style={{ backgroundColor: tabColor }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </button>
                      <button
                        onClick={() => setHistoryOpen(!historyOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                        title="Quiz History"
                      >
                        <History className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => {
                          setGeneratedQuiz('');
                          setStreamingQuiz('');
                          setParsedQuiz(null);
                          setIsEditing(false);
                        }}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                      >
                        Create New Quiz
                      </button>
                    </div>
                  )}
                </div>
            
                <div className="flex-1 overflow-y-auto bg-white p-6">
                  {(streamingQuiz || generatedQuiz) && (
                    <div className="mb-8">
                      <div className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br" style={{
                          background: `linear-gradient(to bottom right, ${tabColor}, ${tabColor}dd, ${tabColor}bb)`
                        }}></div>
                        <div className="absolute inset-0" style={{
                          background: `linear-gradient(to bottom right, ${tabColor}e6, ${tabColor}cc)`
                        }}></div>
                        
                        <div className="relative px-8 py-8">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                                <span className="text-white text-sm font-medium">{formData.subject}</span>
                              </div>
                              
                              <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
                                {formData.numberOfQuestions}-Question Assessment
                              </h1>
                              
                              <div className="flex flex-wrap items-center gap-4 text-cyan-100">
                                <div className="flex items-center">
                                  <div className="w-2 h-2 bg-cyan-200 rounded-full mr-2"></div>
                                  <span className="text-sm">Grade {formData.gradeLevel}</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-2 h-2 bg-cyan-200 rounded-full mr-2"></div>
                                  <span className="text-sm">{formData.questionTypes.join(', ')}</span>
                                </div>
                              </div>
                            </div>
                            
                            {loading && (
                              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                                <div className="flex items-center text-white">
                                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                                  <div>
                                    <div className="text-sm font-medium">Generating...</div>
                                    <div className="text-xs text-cyan-100">AI-powered quiz</div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-6 pt-4 border-t border-white/20">
                            <div className="flex items-center justify-between">
                              <div className="text-cyan-100 text-sm">
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
                    <div className="space-y-1">
                      {formatQuizText(streamingQuiz || generatedQuiz, tabColor)}
                      {loading && streamingQuiz && (
                        <span className="inline-flex items-center ml-1">
                          <span className="w-0.5 h-5 animate-pulse rounded-full" style={{ backgroundColor: tabColor }}></span>
                        </span>
                      )}
                    </div>
                  </div>

                  {loading && (
                    <div className="mt-8 rounded-xl p-6 border" style={{
                      background: `linear-gradient(to right, ${tabColor}0d, ${tabColor}1a)`,
                      borderColor: `${tabColor}33`
                    }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium" style={{ color: `${tabColor}dd` }}>Creating your quiz</div>
                          <div className="text-sm mt-1" style={{ color: `${tabColor}99` }}>Tailored for your learning outcomes</div>
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
            )}
          </>
        ) : (
          // Form view
          <>
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Quiz Configuration</h2>
                <p className="text-sm text-gray-500">Configure your quiz parameters</p>
              </div>
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                title="Quiz History"
              >
                <History className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                <div data-tutorial="quiz-generator-subject">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                  >
                    <option value="">Select a subject</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div data-tutorial="quiz-generator-grade">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => handleInputChange('gradeLevel', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                  >
                    <option value="">Select a grade</option>
                    {grades.map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>

                <div data-tutorial="quiz-generator-question-count">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.numberOfQuestions}
                    onChange={(e) => handleInputChange('numberOfQuestions', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                    min="1"
                    max="50"
                  />
                </div>

                <div data-tutorial="quiz-generator-topic">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Outcomes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.learningOutcomes}
                    onChange={(e) => handleInputChange('learningOutcomes', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                    placeholder="What should students know or be able to demonstrate?"
                  />
                </div>

                <div data-tutorial="quiz-generator-question-types">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Question Types <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {questionTypesOptions.map(type => (
                      <label key={type} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.questionTypes.includes(type)}
                          onChange={() => handleCheckboxChange('questionTypes', type)}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: tabColor }}
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div data-tutorial="quiz-generator-cognitive-levels">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Cognitive Levels <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {cognitiveLevelsOptions.map(level => (
                      <label key={level} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.cognitiveLevels.includes(level)}
                          onChange={() => handleCheckboxChange('cognitiveLevels', level)}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: tabColor }}
                        />
                        <span className="text-sm">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit per Question (in seconds, optional)
                  </label>
                  <input
                    type="number"
                    value={formData.timeLimitPerQuestion}
                    onChange={(e) => handleInputChange('timeLimitPerQuestion', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                    placeholder="e.g., 60"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.randomizeQuestions}
                      onChange={(e) => handleInputChange('randomizeQuestions', e.target.checked)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: tabColor }}
                    />
                    <span className="text-sm font-medium text-gray-700">Randomize Questions</span>
                  </label>
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
                  onClick={generateQuiz}
                  disabled={!validateForm() || loading}
                  className="flex items-center px-6 py-2 text-white rounded-lg disabled:bg-gray-300 transition"
                  data-tutorial="quiz-generator-generate"
                  style={!validateForm() || loading ? {} : { backgroundColor: tabColor }}
                  onMouseEnter={(e) => !loading && !(!validateForm()) && (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={(e) => !loading && !(!validateForm()) && (e.currentTarget.style.opacity = '1')}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ListChecks className="w-5 h-5 mr-2" />
                      Generate Quiz
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
            <h3 className="text-lg font-semibold text-gray-800">Saved Quizzes</h3>
            <button
              onClick={() => setHistoryOpen(false)}
              className="p-1 rounded hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
            {quizHistories.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <ListChecks className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No saved quizzes yet</p>
              </div>
            ) : (
              quizHistories.map((history) => (
                <div
                  key={history.id}
                  onClick={() => loadQuizHistory(history)}
                  className={`p-3 rounded-lg cursor-pointer transition group hover:bg-white ${
                    currentQuizId === history.id ? 'bg-white shadow-sm' : 'bg-gray-100'
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
                      onClick={(e) => deleteQuizHistory(history.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition"
                      title="Delete quiz"
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
        content={generatedQuiz}
        contentType="quiz"
        onContentUpdate={(newContent) => {
          setGeneratedQuiz(newContent);
          const parsed = parseQuizFromAI(newContent);
          if (parsed) setParsedQuiz(parsed);
        }}
      />

      <TutorialOverlay
        steps={tutorials[TUTORIAL_IDS.QUIZ_GENERATOR].steps}
        onComplete={handleTutorialComplete}
        autoStart={showTutorial}
        showFloatingButton={false}
      />

      {/* Disable local TutorialButton (handled globally in Dashboard) */}
      
    </div>
  );
};

export default QuizGenerator;