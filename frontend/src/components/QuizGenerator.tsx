import React, { useState, useEffect } from 'react';
import { Loader2, ListChecks, Trash2, Save, Download, History, X, Edit, Check, Sparkles, FileText, Users, GraduationCap, ChevronDown, ClipboardCheck, BookOpen } from 'lucide-react';
import ExportButton from './ExportButton';
import AIAssistantPanel from './AIAssistantPanel';
import QuizEditor from './QuizEditor';
import QuizGrader from './QuizGrader';
import axios from 'axios';
import { ParsedQuiz, parseQuizFromAI, quizToDisplayText, displayTextToQuiz } from '../types/quiz';
import { buildQuizPrompt } from '../utils/quizPromptBuilder';
import CurriculumAlignmentFields from './ui/CurriculumAlignmentFields';
import RelatedCurriculumBox from './ui/RelatedCurriculumBox';
import { useSettings } from '../contexts/SettingsContext';
import { TutorialOverlay } from './TutorialOverlay';
import { TutorialButton } from './TutorialButton';
import { tutorials, TUTORIAL_IDS } from '../data/tutorialSteps';
import { getWebSocketUrl, isElectronEnvironment } from '../config/api.config';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useQueue } from '../contexts/QueueContext';
import { GeneratorSkeleton } from './ui/GeneratorSkeleton';
import { HeartbeatLoader } from './ui/HeartbeatLoader';

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
  parsedQuiz?: ParsedQuiz;
}

interface LessonPlanHistoryItem {
  id: string;
  title: string;
  timestamp: string;
  formData: {
    subject: string;
    gradeLevel: string;
    topic: string;
    essentialOutcomes: string;
    specificOutcomes: string;
  };
  parsedLesson?: {
    learningObjectives: string[];
  };
  generatedPlan?: string;
}

interface FormData {
  subject: string;
  gradeLevel: string;
  learningOutcomes: string;
  questionTypes: string[];
  cognitiveLevels: string[];
  timeLimitPerQuestion: string;
  numberOfQuestions: string;
  strand: string;
  essentialOutcomes: string;
  specificOutcomes: string;
}

const formatQuizText = (text: string, accentColor: string) => {
  if (!text) return null;

  let cleanText = text;
  if (cleanText.includes("To change it, set a different value via -sys PROMPT")) {
    cleanText = cleanText.split("To change it, set a different value via -sys PROMPT")[1] || cleanText;
  }

  // Remove introductory sentences like "Here are the X questions for the..."
  cleanText = cleanText.replace(/^Here are (?:the )?\d+ questions? for (?:the )?.*?:\s*/i, '');
  cleanText = cleanText.replace(/^Below (?:is|are) (?:the )?\d+ questions? for (?:the )?.*?:\s*/i, '');
  cleanText = cleanText.replace(/^Here (?:is|are) (?:the )?\d+ questions? for (?:the )?.*?:\s*/i, '');
  cleanText = cleanText.replace(/^The following (?:is|are|questions? )?.*?:\s*/i, '');

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
          <span className="text-theme-label">{trimmed.substring(2).trim()}</span>
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
          <span className="text-theme-label leading-relaxed">{content}</span>
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
          <span className="text-theme-label leading-relaxed pt-1">{content}</span>
        </div>
      );
      return;
    }

    // Regular paragraphs
    if (trimmed.length > 0) {
      elements.push(
        <p key={`p-${currentIndex++}`} className="text-theme-label leading-relaxed mb-3">
          {trimmed}
        </p>
      );
    }
  });

  return elements;
};

const ENDPOINT = '/ws/quiz';
const QuizGenerator: React.FC<QuizGeneratorProps> = ({ tabId, savedData, onDataChange }) => {
  const { settings, markTutorialComplete, isTutorialCompleted } = useSettings();
  const { getConnection, getStreamingContent, getIsStreaming, clearStreaming } = useWebSocket();
  const { enqueue, queueEnabled } = useQueue();
  const tabColor = settings.tabColors['quiz-generator'];
  const [showTutorial, setShowTutorial] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [quizHistories, setQuizHistories] = useState<QuizHistory[]>([]);
  const [lessonPickerOpen, setLessonPickerOpen] = useState(false);
  const [lessonPlanOptions, setLessonPlanOptions] = useState<LessonPlanHistoryItem[]>([]);
  const [lessonPickerLoading, setLessonPickerLoading] = useState(false);
  const [lockedLessonPlan, setLockedLessonPlan] = useState<LessonPlanHistoryItem | null>(null);
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // State for structured editing
  const [isEditing, setIsEditing] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [parsedQuiz, setParsedQuiz] = useState<ParsedQuiz | null>(() => {
    // First check savedData (for resource manager view/edit)
    if (savedData?.parsedQuiz && typeof savedData.parsedQuiz === 'object') {
      return savedData.parsedQuiz;
    }
    return null;
  });
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<'teacher' | 'student'>('teacher');
  const [showVersionMenu, setShowVersionMenu] = useState(false);
  const [useCurriculum, setUseCurriculum] = useState(true);

  // Class quiz mode state
  const [classQuizMode, setClassQuizMode] = useState(false);
  const [selectedClassName, setSelectedClassName] = useState('');
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [classStudents, setClassStudents] = useState<Array<{id: string, full_name: string}>>([]);
  const [randomizeClassQuestions, setRandomizeClassQuestions] = useState(false);
  const [classQuizData, setClassQuizData] = useState<Array<{id: string, name: string, questionOrder: number[]}> | null>(null);
  const [selectedStudentIdx, setSelectedStudentIdx] = useState<number | null>(null);
  // Helper function to get default empty form data
  const getDefaultFormData = (): FormData => ({
    subject: '',
    gradeLevel: '',
    learningOutcomes: '',
    questionTypes: [],
    cognitiveLevels: [],
    timeLimitPerQuestion: '',
    numberOfQuestions: '10',
    strand: '',
    essentialOutcomes: '',
    specificOutcomes: '',
  });

  // Form data
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = savedData?.formData;
    if (saved && typeof saved === 'object' && saved.subject?.trim()) {
      return saved;
    }
    return getDefaultFormData();
  });

  const [generatedQuiz, setGeneratedQuiz] = useState<string>(savedData?.generatedQuiz || '');
  
  // ✅ Read streaming content from context (read-only, no setter!)
  const streamingQuiz = getStreamingContent(tabId, ENDPOINT);
  const contextLoading = getIsStreaming(tabId, ENDPOINT);
  // Per-tab local loading state
  const [localLoadingMap, setLocalLoadingMap] = useState<{ [tabId: string]: boolean }>({});
  const loading = !!localLoadingMap[tabId] || contextLoading;

  // Computed values for class quiz display
  const viewingStudent = selectedStudentIdx !== null && classQuizData ? classQuizData[selectedStudentIdx] : null;
  const displayParsedQuiz: ParsedQuiz | null = viewingStudent && parsedQuiz ? {
    ...parsedQuiz,
    questions: viewingStudent.questionOrder.map(i => parsedQuiz.questions[i])
  } : parsedQuiz;
  const effectiveVersion: 'teacher' | 'student' = viewingStudent ? 'student' : selectedVersion;

  const allSubjects = ['Mathematics', 'Science', 'Language Arts', 'Social Studies', 'Music', 'Physical Education'];
  const allGrades = ['K', '1', '2', '3', '4', '5', '6'];

  const subjects = settings.profile.filterContentByProfile && settings.profile.subjects.length > 0
    ? allSubjects.filter(s => settings.profile.subjects.includes(s))
    : allSubjects;

  const grades = settings.profile.filterContentByProfile && settings.profile.gradeLevels.length > 0
    ? allGrades.filter(g => settings.profile.gradeLevels.includes(g.toLowerCase()))
    : allGrades;
  // Auto-select when only one option from profile filtering
  useEffect(() => {
    if (!settings.profile.filterContentByProfile) return;
    const updates: Partial<FormData> = {};
    if (subjects.length === 1 && !formData.subject) updates.subject = subjects[0];
    if (grades.length === 1 && !formData.gradeLevel) updates.gradeLevel = grades[0];
    if (Object.keys(updates).length > 0) setFormData(prev => ({ ...prev, ...updates }));
  }, [subjects, grades, settings.profile.filterContentByProfile]);

  // Fetch available classes when class quiz mode is enabled
  useEffect(() => {
    if (classQuizMode) {
      axios.get('http://localhost:8000/api/classes').then(r => {
        setAvailableClasses(r.data.map((c: any) => c.class_name));
      }).catch(() => {});
    }
  }, [classQuizMode]);

  // Fetch students when class is selected
  useEffect(() => {
    if (selectedClassName) {
      axios.get(`http://localhost:8000/api/students?class_name=${encodeURIComponent(selectedClassName)}`).then(r => {
        setClassStudents(r.data);
      }).catch(() => {});
    } else {
      setClassStudents([]);
    }
  }, [selectedClassName]);

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

  // ✅ Connect WebSocket on mount
  useEffect(() => {
    getConnection(tabId, ENDPOINT);
  }, [tabId]);

  useEffect(() => {
    const LOCAL_STORAGE_KEY = `quiz_state_${tabId}`;
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setFormData(parsed.formData || getDefaultFormData());
        setGeneratedQuiz(parsed.generatedQuiz || '');
        setParsedQuiz(parsed.parsedQuiz || null);
        setCurrentQuizId(parsed.currentQuizId || null);
        setIsEditing(parsed.isEditing || false);
        setLocalLoadingMap(parsed.localLoadingMap || {});  // ✅ RESTORE LOADING STATE
      } catch (e) {
        console.error('Failed to parse saved state:', e);
        setFormData(getDefaultFormData());
        setGeneratedQuiz('');
        setParsedQuiz(null);
        setCurrentQuizId(null);
        setIsEditing(false);
        setLocalLoadingMap({});
      }
    } else {
      setFormData(getDefaultFormData());
      setGeneratedQuiz('');
      setParsedQuiz(null);
      setCurrentQuizId(null);
      setIsEditing(false);
      setLocalLoadingMap({});
    }
  }, [tabId]);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(`quiz_state_${tabId}`, JSON.stringify({
      formData,
      generatedQuiz,
      parsedQuiz,
      currentQuizId,
      isEditing,
      localLoadingMap  // ✅ SAVE LOADING STATE
    }));
  }, [formData, generatedQuiz, parsedQuiz, currentQuizId, isEditing, localLoadingMap]);


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

  const loadLessonPlans = async () => {
    setLessonPickerLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/lesson-plan-history');
      setLessonPlanOptions(response.data);
    } catch (error) {
      console.error('Failed to load lesson plans:', error);
    } finally {
      setLessonPickerLoading(false);
    }
  };

  const mapLessonPlanToQuizForm = (lesson: LessonPlanHistoryItem) => {
    let learningOutcomes = '';
    if (lesson.parsedLesson?.learningObjectives?.length) {
      learningOutcomes = lesson.parsedLesson.learningObjectives.join('\n');
    } else {
      const parts = [lesson.formData.specificOutcomes, lesson.formData.essentialOutcomes]
        .filter(Boolean);
      learningOutcomes = parts.join('\n\n');
    }
    return {
      subject: lesson.formData.subject || '',
      gradeLevel: lesson.formData.gradeLevel || '',
      learningOutcomes,
    };
  };

  const handleSelectLessonPlan = (lesson: LessonPlanHistoryItem) => {
    setFormData(prev => ({ ...prev, ...mapLessonPlanToQuizForm(lesson) }));
    setLockedLessonPlan(lesson);
    setLessonPickerOpen(false);
  };

  const saveQuiz = async () => {
    if (!generatedQuiz && !parsedQuiz) {
      alert('No quiz to save');
      return;
    }

    setSaveStatus('saving');
    try {
      // Build a proper title with fallbacks
      const title = formData.subject?.trim()
        ? `${formData.subject} Quiz - Grade ${formData.gradeLevel || 'Unknown'} (${formData.numberOfQuestions || '10'} questions)`
        : `Quiz - Grade ${formData.gradeLevel || 'Unknown'} (${formData.numberOfQuestions || '10'} questions)`;
      
      const quizData = {
        id: currentQuizId || `quiz_${Date.now()}`,
        title: title,
        timestamp: new Date().toISOString(),
        formData: formData,
        generatedQuiz: generatedQuiz,  // ✅ Save original clean text
        parsedQuiz: parsedQuiz || undefined
      };

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
    const prompt = buildQuizPrompt(formData, lockedLessonPlan?.generatedPlan);

    if (queueEnabled) {
      enqueue({
        label: `Quiz - ${formData.subject} (Grade ${formData.gradeLevel})`,
        toolType: 'Quiz',
        tabId,
        endpoint: ENDPOINT,
        prompt,
        generationMode: settings.generationMode,
      });
      return;
    }

    const ws = getConnection(tabId, ENDPOINT);
    if (ws.readyState !== WebSocket.OPEN) {
      alert('Connection not established. Please wait and try again.');
      return;
    }
    setLocalLoadingMap(prev => ({ ...prev, [tabId]: true }));

    try {
      ws.send(JSON.stringify({
        prompt,
        generationMode: settings.generationMode,
      }));
    } catch (error) {
      console.error('Failed to send quiz request:', error);
    }
  };

  const clearForm = () => {
    setFormData(getDefaultFormData());
    setGeneratedQuiz('');
    // ✅ Clear streaming content in context
    clearStreaming(tabId, ENDPOINT);
    setParsedQuiz(null);
    setCurrentQuizId(null);
    setIsEditing(false);
    setLockedLessonPlan(null);
    setClassQuizData(null);
    setSelectedStudentIdx(null);
    localStorage.removeItem(`quiz_state_${tabId}`);
  };

  const validateForm = () => {
    const hasQuizOptions = formData.questionTypes.length > 0 && formData.cognitiveLevels.length > 0;
    if (lockedLessonPlan) {
      return hasQuizOptions;
    }
    return formData.subject && formData.gradeLevel && hasQuizOptions &&
           formData.strand && formData.essentialOutcomes && formData.specificOutcomes;
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

  // ✅ Save data whenever it changes (no streamingQuiz in saved data)
  useEffect(() => {
    onDataChange({ formData, generatedQuiz, parsedQuiz });
  }, [formData, generatedQuiz, parsedQuiz]);

  // ✅ Finalization logic - when streaming completes, update generatedQuiz
  useEffect(() => {
    if (streamingQuiz && !contextLoading) {
      setGeneratedQuiz(streamingQuiz);
      const parsed = parseQuizFromAI(streamingQuiz);
      if (parsed) {
        setParsedQuiz(parsed);
      } else {
        setParsedQuiz(displayTextToQuiz(streamingQuiz, {
          title: `${formData.subject} Quiz`,
          subject: formData.subject,
          gradeLevel: formData.gradeLevel,
          totalQuestions: parseInt(formData.numberOfQuestions)
        }));
      }
      clearStreaming(tabId, ENDPOINT);
      setLocalLoadingMap(prev => {
        const newMap = { ...prev };
        delete newMap[tabId];
        return newMap;
      });

      // Generate class quiz data if in class mode
      const finalParsed = parsed || parsedQuiz;
      if (classQuizMode && classStudents.length > 0 && finalParsed) {
        const studentData = classStudents.map(student => {
          const numQuestions = finalParsed.questions.length;
          const order = Array.from({length: numQuestions}, (_, i) => i);
          if (randomizeClassQuestions) {
            // Fisher-Yates shuffle
            for (let i = order.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [order[i], order[j]] = [order[j], order[i]];
            }
          }
          return { id: student.id, name: student.full_name, questionOrder: order };
        });
        setClassQuizData(studentData);
        setSelectedStudentIdx(null);
      }
    }
  }, [streamingQuiz, contextLoading]);

  return (
    <div className="flex h-full tab-content-bg relative" data-tutorial="quiz-generator-welcome">
      {/* Student Quiz Panel (left side) - only when class quiz is generated */}
      {classQuizData && (generatedQuiz || streamingQuiz) && !loading && (
        <div className="border-r border-theme bg-theme-secondary flex flex-col flex-shrink-0" style={{ width: '260px' }}>
          <div className="p-3 border-b border-theme">
            <h3 className="text-sm font-semibold text-theme-heading">Student Quizzes</h3>
            <p className="text-xs text-theme-hint mt-0.5">{classQuizData.length} students</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5 scrollbar-hide">
            {/* Teacher version option */}
            <button
              onClick={() => setSelectedStudentIdx(null)}
              className={`w-full text-left p-2.5 rounded-lg transition text-sm ${
                selectedStudentIdx === null ? 'bg-theme-surface shadow-sm border border-theme' : 'hover:bg-theme-subtle'
              }`}
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 flex-shrink-0" style={{ color: tabColor }} />
                <span className="font-medium text-theme-heading text-xs">Teacher Version</span>
              </div>
            </button>

            <div className="border-t border-theme my-1.5" />

            {/* Student entries */}
            {classQuizData.map((student, idx) => (
              <button
                key={student.id}
                onClick={() => setSelectedStudentIdx(idx)}
                className={`w-full text-left p-2 rounded-lg transition text-sm ${
                  selectedStudentIdx === idx ? 'bg-theme-surface shadow-sm border border-theme' : 'hover:bg-theme-subtle'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0"
                    style={{ backgroundColor: tabColor }}
                  >
                    {student.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-theme-label text-xs truncate">{student.name}</div>
                    <div className="text-[10px] text-theme-hint">{student.id}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col tab-content-bg overflow-hidden" style={{ perspective: '2000px' }}>
        {/* Card Flip Container */}
        <div
          className="flex-1 flex flex-col"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.7s cubic-bezier(0.4, 0.0, 0.2, 1)',
            transform: isGrading ? 'rotateY(180deg)' : 'rotateY(0deg)',
            position: 'relative',
            minHeight: 0,
          }}
        >
          {/* FRONT FACE — Quiz Builder / Generated Quiz */}
          <div
            className="flex-1 flex flex-col tab-content-bg"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              position: isGrading ? 'absolute' : 'relative',
              inset: 0,
              minHeight: 0,
              pointerEvents: isGrading ? 'none' : 'auto',
            }}
          >
        {(generatedQuiz || streamingQuiz || isEditing || loading) ? (
          <>
            {isEditing && parsedQuiz ? (
              // Show Structured Editor
              <QuizEditor
                quiz={parsedQuiz}
                onSave={saveEditedQuiz}
                onCancel={cancelEditing}
              />
            ) : loading && !streamingQuiz && !generatedQuiz ? (
              <GeneratorSkeleton accentColor={tabColor} type="quiz" />
            ) : (
              // Show generated quiz (existing display code)
              <>
                <div className="border-b border-theme p-4 flex items-center justify-between flex-shrink-0">
                  <div>
                    <h2 className="text-xl font-semibold text-theme-heading">
                      {loading ? 'Generating Quiz...' : 'Generated Quiz'}
                    </h2>
                    <p className="text-sm text-theme-hint">{formData.subject} - Grade {formData.gradeLevel}</p>
                  </div>
                  {!loading && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsGrading(true)}
                        className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
                        title="Grade this quiz"
                      >
                        <ClipboardCheck className="w-4 h-4 mr-2" />
                        Grade Quiz
                      </button>
                      <button
                        onClick={enableEditing}
                        disabled={!parsedQuiz}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                      >
                        {saveStatus === 'saving' ? (
                          <>
                            <HeartbeatLoader className="w-4 h-4 mr-2" />
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
                      {/* Version Selector Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setShowVersionMenu(!showVersionMenu)}
                          className="flex items-center px-4 py-2 bg-theme-tertiary text-theme-label rounded-lg hover:bg-theme-hover transition border border-theme-strong"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          {selectedVersion === 'teacher' ? 'Teacher Version' : 'Student Version'}
                          <ChevronDown className="w-4 h-4 ml-2" />
                        </button>

                        {showVersionMenu && (
                          <>
                            {/* Backdrop */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setShowVersionMenu(false)}
                            />

                            {/* Menu */}
                            <div className="absolute left-0 mt-2 w-56 bg-theme-surface rounded-lg shadow-xl border border-theme z-20 overflow-hidden">
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    setSelectedVersion('student');
                                    setShowVersionMenu(false);
                                  }}
                                  className={`w-full text-left px-4 py-2 hover:bg-theme-subtle flex items-center justify-between transition ${
                                    selectedVersion === 'student' ? 'bg-blue-50' : ''
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-3 text-blue-600" />
                                    <div>
                                      <div className="text-sm font-medium text-theme-title">Student Version</div>
                                      <div className="text-xs text-theme-hint">Clean quiz without answers</div>
                                    </div>
                                  </div>
                                  {selectedVersion === 'student' && (
                                    <Check className="w-4 h-4 text-blue-600" />
                                  )}
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedVersion('teacher');
                                    setShowVersionMenu(false);
                                  }}
                                  className={`w-full text-left px-4 py-2 hover:bg-theme-subtle flex items-center justify-between transition ${
                                    selectedVersion === 'teacher' ? 'bg-blue-50' : ''
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <GraduationCap className="w-4 h-4 mr-3 text-green-600" />
                                    <div>
                                      <div className="text-sm font-medium text-theme-title">Teacher Version</div>
                                      <div className="text-xs text-theme-hint">With answer key & explanations</div>
                                    </div>
                                  </div>
                                  {selectedVersion === 'teacher' && (
                                    <Check className="w-4 h-4 text-green-600" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <ExportButton
                        dataType="quiz"
                        data={{
                          content: displayParsedQuiz ? quizToDisplayText(displayParsedQuiz) : generatedQuiz,
                          formData: formData,
                          accentColor: tabColor,
                          exportOptions: effectiveVersion === 'student' ? {
                            showAnswerKey: false,
                            showExplanations: false,
                            boldCorrectAnswers: false
                          } : {
                            showAnswerKey: true,
                            showExplanations: true,
                            boldCorrectAnswers: true
                          }
                        }}
                        filename={`quiz-${formData.subject.toLowerCase()}-grade${formData.gradeLevel}-${viewingStudent ? viewingStudent.name.replace(/\s+/g, '-') : effectiveVersion}`}
                        className="ml-2"
                      />
                      <button
                        onClick={() => setHistoryOpen(!historyOpen)}
                        className="p-2 rounded-lg hover:bg-theme-hover transition"
                        title="Quiz History"
                      >
                        <History className="w-5 h-5 text-theme-muted" />
                      </button>
                      <button
                        onClick={() => {
                          setGeneratedQuiz('');
                          clearStreaming(tabId, ENDPOINT);
                          setParsedQuiz(null);
                          setIsEditing(false);
                          setIsGrading(false);
                          setClassQuizData(null);
                          setSelectedStudentIdx(null);
                        }}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                      >
                        Create New Quiz
                      </button>
                    </div>
                  )}
                </div>
            
                <div className="flex-1 overflow-y-auto bg-theme-surface p-6">
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
                                  <HeartbeatLoader className="w-5 h-5 mr-3" />
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
                      {displayParsedQuiz && !loading ? (
                        // ✅ Conditionally render based on effectiveVersion (student view when viewing class quiz student)
                        <div className="space-y-6">
                          {/* Student info banner */}
                          {viewingStudent && (
                            <div className="p-4 rounded-xl border-2 mb-2" style={{ borderColor: `${tabColor}44`, backgroundColor: `${tabColor}08` }}>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: tabColor }}>
                                  {viewingStudent.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="font-semibold text-theme-heading text-base">{viewingStudent.name}</div>
                                  <div className="text-sm text-theme-muted">Student ID: {viewingStudent.id}</div>
                                </div>
                              </div>
                            </div>
                          )}

                          {displayParsedQuiz.questions.map((question, qIndex) => {
                            const correctAnswerIndex = question.correctAnswer as number;
                            const correctLetter = question.type === 'multiple-choice' && typeof correctAnswerIndex === 'number'
                              ? String.fromCharCode(65 + correctAnswerIndex)
                              : null;

                            return (
                              <div key={question.id} className="space-y-3">
                                <h3 className="text-lg font-semibold p-3 rounded-lg" style={{ color: `${tabColor}cc`, backgroundColor: `${tabColor}0d` }}>
                                  Question {qIndex + 1}: {question.question}
                                </h3>
                                
                                {question.type === 'multiple-choice' && question.options && (
                                  <div className="ml-6 space-y-2">
                                    {question.options.map((option, oIndex) => {
                                      const letter = String.fromCharCode(65 + oIndex);
                                      const isCorrect = effectiveVersion === 'teacher' && correctAnswerIndex === oIndex;
                                      return (
                                        <div key={oIndex} className="flex items-start">
                                          <span 
                                            className={`mr-3 font-semibold ${isCorrect ? 'px-2 py-0.5 rounded' : ''}`}
                                            style={{ 
                                              color: isCorrect ? tabColor : `${tabColor}cc`,
                                              backgroundColor: isCorrect ? `${tabColor}15` : 'transparent',
                                              fontWeight: isCorrect ? '700' : '600'
                                            }}
                                          >
                                            {letter})
                                          </span>
                                          <span className={`text-theme-label ${isCorrect ? 'font-medium' : ''}`}>
                                            {option}
                                          </span>
                                        </div>
                                      );
                                    })}
                                    
                                    {/* Show answer only in teacher version */}
                                    {effectiveVersion === 'teacher' && (
                                      <div className="mt-3 text-sm">
                                        <span className="font-semibold text-green-700">
                                          Correct Answer: {correctLetter}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {question.type === 'true-false' && (
                                  <div className="ml-6 space-y-2">
                                    <div className="flex items-start">
                                      <span
                                        className={`mr-3 font-semibold ${effectiveVersion === 'teacher' && question.correctAnswer === 'true' ? 'px-2 py-0.5 rounded' : ''}`}
                                        style={{
                                          color: effectiveVersion === 'teacher' && question.correctAnswer === 'true' ? tabColor : `${tabColor}cc`,
                                          backgroundColor: effectiveVersion === 'teacher' && question.correctAnswer === 'true' ? `${tabColor}15` : 'transparent'
                                        }}
                                      >
                                        A)
                                      </span>
                                      <span className={`text-theme-label ${effectiveVersion === 'teacher' && question.correctAnswer === 'true' ? 'font-medium' : ''}`}>
                                        True
                                      </span>
                                    </div>
                                    <div className="flex items-start">
                                      <span
                                        className={`mr-3 font-semibold ${effectiveVersion === 'teacher' && question.correctAnswer === 'false' ? 'px-2 py-0.5 rounded' : ''}`}
                                        style={{
                                          color: effectiveVersion === 'teacher' && question.correctAnswer === 'false' ? tabColor : `${tabColor}cc`,
                                          backgroundColor: effectiveVersion === 'teacher' && question.correctAnswer === 'false' ? `${tabColor}15` : 'transparent'
                                        }}
                                      >
                                        B)
                                      </span>
                                      <span className={`text-theme-label ${effectiveVersion === 'teacher' && question.correctAnswer === 'false' ? 'font-medium' : ''}`}>
                                        False
                                      </span>
                                    </div>

                                    {/* Show answer only in teacher version */}
                                    {effectiveVersion === 'teacher' && (
                                      <div className="mt-3 text-sm">
                                        <span className="font-semibold text-green-700">
                                          Correct Answer: {question.correctAnswer === 'true' ? 'True' : 'False'}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {question.type === 'fill-blank' && effectiveVersion === 'teacher' && (
                                  <div className="ml-6 space-y-2">
                                    <div className="text-sm">
                                      <span className="font-semibold text-green-700">
                                        Answer: {question.correctAnswer}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                
                                {question.type === 'open-ended' && effectiveVersion === 'teacher' && (
                                  <div className="ml-6 space-y-2">
                                    <div className="text-sm">
                                      <span className="font-semibold text-theme-label">Sample Answer:</span>
                                      <p className="text-theme-muted mt-1 whitespace-pre-wrap">{question.correctAnswer}</p>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Show explanation only in teacher version */}
                                {effectiveVersion === 'teacher' && question.explanation && (
                                  <div className="ml-6 mt-3 p-3 bg-blue-50 rounded-lg">
                                    <span className="text-sm font-semibold text-blue-900">Explanation: </span>
                                    <span className="text-sm text-blue-800">{question.explanation}</span>
                                  </div>
                                )}
                                
                                {effectiveVersion === 'teacher' && (question.cognitiveLevel || question.points) && (
                                  <div className="ml-6 mt-2 flex gap-4 text-xs text-theme-hint">
                                    {question.cognitiveLevel && (
                                      <span>Cognitive Level: {question.cognitiveLevel}</span>
                                    )}
                                    {question.points && (
                                      <span>Points: {question.points}</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        // Fallback to text rendering for streaming or non-parsed content
                        <>
                          {formatQuizText(streamingQuiz || generatedQuiz, tabColor)}
                          {loading && streamingQuiz && (
                            <span className="inline-flex items-center ml-1">
                              <span className="w-0.5 h-5 animate-pulse rounded-full" style={{ backgroundColor: tabColor }}></span>
                            </span>
                          )}
                        </>
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
              <div className="border-b border-theme p-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-theme-heading">Quiz Configuration</h2>
                  <p className="text-sm text-theme-hint">Configure your quiz parameters</p>
                </div>
                <div className="flex items-center gap-2">
                  {lockedLessonPlan ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border" style={{ borderColor: `${tabColor}44`, color: tabColor, backgroundColor: `${tabColor}10` }}>
                      <BookOpen className="w-4 h-4 shrink-0" />
                      <span className="max-w-[160px] truncate">{lockedLessonPlan.title}</span>
                      <button onClick={() => setLockedLessonPlan(null)} className="ml-1 hover:opacity-60 transition shrink-0" title="Remove lesson plan">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setLessonPickerOpen(true); loadLessonPlans(); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-theme-hover transition text-sm font-medium"
                      style={{ color: tabColor }}
                      title="Generate quiz from a saved lesson plan"
                    >
                      <BookOpen className="w-4 h-4" />
                      From Lesson Plan
                    </button>
                  )}
                  <button
                    onClick={() => setIsGrading(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition text-sm font-medium text-emerald-600 border border-emerald-200"
                    title="Grade an existing quiz"
                  >
                    <ClipboardCheck className="w-4 h-4" />
                    Grade Quiz
                  </button>
                  <button
                    onClick={() => setHistoryOpen(!historyOpen)}
                    className="p-2 rounded-lg hover:bg-theme-hover transition"
                    title="Quiz History"
                    data-tutorial="quiz-generator-history"
                  >
                    <History className="w-5 h-5 text-theme-muted" />
                  </button>
                </div>
              </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                {lockedLessonPlan ? (
                  /* ── Lesson Plan Summary Card ── */
                  <div className="rounded-xl border overflow-hidden" style={{ borderColor: `${tabColor}33` }}>
                    <div className="px-5 py-4" style={{ background: `linear-gradient(135deg, ${tabColor}12, ${tabColor}08)` }}>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: `${tabColor}18` }}>
                          <BookOpen className="w-5 h-5" style={{ color: tabColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium uppercase tracking-wider text-theme-hint mb-1">Generating quiz from</p>
                          <h4 className="font-semibold text-theme-heading text-base truncate">{lockedLessonPlan.title}</h4>
                          <div className="flex items-center gap-3 mt-1.5 text-sm text-theme-muted">
                            {lockedLessonPlan.formData.subject && (
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tabColor }} />
                                {lockedLessonPlan.formData.subject}
                              </span>
                            )}
                            {lockedLessonPlan.formData.gradeLevel && (
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tabColor }} />
                                Grade {lockedLessonPlan.formData.gradeLevel}
                              </span>
                            )}
                            {lockedLessonPlan.formData.topic && (
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tabColor }} />
                                <span className="truncate max-w-[200px]">{lockedLessonPlan.formData.topic}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setLockedLessonPlan(null)}
                          className="p-1.5 rounded-lg hover:bg-theme-hover transition shrink-0"
                          title="Remove lesson plan"
                        >
                          <X className="w-4 h-4 text-theme-muted" />
                        </button>
                      </div>

                      {/* Learning objectives preview */}
                      {lockedLessonPlan.parsedLesson?.learningObjectives && lockedLessonPlan.parsedLesson.learningObjectives.length > 0 && (
                        <div className="mt-3 pt-3 border-t" style={{ borderColor: `${tabColor}20` }}>
                          <p className="text-xs font-medium text-theme-hint mb-1.5">Learning Objectives</p>
                          <ul className="space-y-1">
                            {lockedLessonPlan.parsedLesson.learningObjectives.slice(0, 3).map((obj, i) => (
                              <li key={i} className="text-sm text-theme-label flex items-start gap-2">
                                <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ backgroundColor: `${tabColor}88` }} />
                                <span className="line-clamp-1">{obj}</span>
                              </li>
                            ))}
                            {lockedLessonPlan.parsedLesson.learningObjectives.length > 3 && (
                              <li className="text-xs text-theme-hint ml-3">
                                +{lockedLessonPlan.parsedLesson.learningObjectives.length - 3} more objectives
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Curriculum outcomes preview */}
                      {!lockedLessonPlan.parsedLesson?.learningObjectives?.length && (lockedLessonPlan.formData.essentialOutcomes || lockedLessonPlan.formData.specificOutcomes) && (
                        <div className="mt-3 pt-3 border-t" style={{ borderColor: `${tabColor}20` }}>
                          <p className="text-xs font-medium text-theme-hint mb-1.5">Curriculum Outcomes</p>
                          <p className="text-sm text-theme-label line-clamp-2">
                            {lockedLessonPlan.formData.essentialOutcomes || lockedLessonPlan.formData.specificOutcomes}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="px-5 py-2.5 bg-theme-secondary border-t border-theme text-xs text-theme-hint flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3" />
                      The generated quiz will be based on this lesson plan.
                    </div>
                  </div>
                ) : (
                  /* ── Standard curriculum fields ── */
                  <>
                    <div data-tutorial="quiz-generator-subject">
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => {
                          handleInputChange('subject', e.target.value);
                          handleInputChange('strand', '');
                          handleInputChange('essentialOutcomes', '');
                          handleInputChange('specificOutcomes', '');
                        }}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                      >
                        <option value="">Select a subject</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div data-tutorial="quiz-generator-grade">
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        Grade Level <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.gradeLevel}
                        onChange={(e) => {
                          handleInputChange('gradeLevel', e.target.value);
                          handleInputChange('strand', '');
                          handleInputChange('essentialOutcomes', '');
                          handleInputChange('specificOutcomes', '');
                        }}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                      >
                        <option value="">Select a grade</option>
                        {grades.map(g => <option key={g} value={g}>Grade {g}</option>)}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4" data-tutorial="quiz-generator-topic">
                      <CurriculumAlignmentFields
                        subject={formData.subject}
                        gradeLevel={formData.gradeLevel}
                        strand={formData.strand}
                        essentialOutcomes={formData.essentialOutcomes}
                        specificOutcomes={formData.specificOutcomes}
                        useCurriculum={useCurriculum}
                        onStrandChange={(v) => handleInputChange('strand', v)}
                        onELOChange={(v) => handleInputChange('essentialOutcomes', v)}
                        onSCOsChange={(v) => handleInputChange('specificOutcomes', v)}
                        onToggleCurriculum={() => setUseCurriculum(!useCurriculum)}
                        accentColor={tabColor}
                      />
                      <RelatedCurriculumBox
                        subject={formData.subject}
                        gradeLevel={formData.gradeLevel}
                        strand={formData.strand}
                        useCurriculum={useCurriculum}
                        essentialOutcomes={formData.essentialOutcomes}
                      />
                    </div>
                  </>
                )}

                <div data-tutorial="quiz-generator-question-count">
                  <label className="block text-sm font-medium text-theme-label mb-2">
                    Number of Questions <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.numberOfQuestions}
                    onChange={(e) => handleInputChange('numberOfQuestions', e.target.value)}
                    className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                    min="1"
                    max="50"
                  />
                </div>


                <div data-tutorial="quiz-generator-question-types">
                  <label className="block text-sm font-medium text-theme-label mb-3">
                    Question Types <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {questionTypesOptions.map(type => (
                      <label key={type} className="flex items-center space-x-2 p-2 rounded hover:bg-theme-subtle cursor-pointer">
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
                  <label className="block text-sm font-medium text-theme-label mb-3">
                    Cognitive Levels <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {cognitiveLevelsOptions.map(level => (
                      <label key={level} className="flex items-center space-x-2 p-2 rounded hover:bg-theme-subtle cursor-pointer">
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
                  <label className="block text-sm font-medium text-theme-label mb-2">
                    Time Limit per Question (in seconds, optional)
                  </label>
                  <input
                    type="number"
                    value={formData.timeLimitPerQuestion}
                    onChange={(e) => handleInputChange('timeLimitPerQuestion', e.target.value)}
                    className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                    placeholder="e.g., 60"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={classQuizMode}
                      onChange={(e) => {
                        setClassQuizMode(e.target.checked);
                        if (!e.target.checked) {
                          setSelectedClassName('');
                          setClassStudents([]);
                          setRandomizeClassQuestions(false);
                        }
                      }}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: tabColor }}
                    />
                    <span className="text-sm font-medium text-theme-label">Generate for Class</span>
                  </label>

                  {classQuizMode && (
                    <div className="ml-6 space-y-3 p-3 rounded-lg border border-theme bg-theme-subtle">
                      <div>
                        <label className="block text-xs font-medium text-theme-hint mb-1">Select Class</label>
                        <select
                          value={selectedClassName}
                          onChange={(e) => setSelectedClassName(e.target.value)}
                          className="w-full px-3 py-2 border border-theme-strong rounded-lg text-sm focus:ring-2"
                          style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                        >
                          <option value="">Choose a class...</option>
                          {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      {classStudents.length > 0 && (
                        <div className="flex items-center gap-2 text-xs" style={{ color: tabColor }}>
                          <Users className="w-3.5 h-3.5" />
                          <span className="font-medium">{classStudents.length} student{classStudents.length !== 1 ? 's' : ''} in class</span>
                        </div>
                      )}

                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={randomizeClassQuestions}
                          onChange={(e) => setRandomizeClassQuestions(e.target.checked)}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: tabColor }}
                        />
                        <span className="text-sm text-theme-label">Randomize Question Order</span>
                      </label>
                      {randomizeClassQuestions && (
                        <p className="text-xs text-theme-hint ml-6">Each student will receive questions in a different random order.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-theme p-4 bg-theme-secondary">
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
                  className="flex items-center px-6 py-2 text-white rounded-lg disabled:opacity-50 transition"
                  data-tutorial="quiz-generator-generate"
                  style={!validateForm() || loading ? {} : { backgroundColor: tabColor }}
                  onMouseEnter={(e) => !loading && !(!validateForm()) && (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={(e) => !loading && !(!validateForm()) && (e.currentTarget.style.opacity = '1')}
                >
                  {loading ? (
                    <>
                      <HeartbeatLoader className="w-5 h-5 mr-2" />
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

          {/* BACK FACE — Quiz Grader */}
          <div
            className="flex-1 flex flex-col tab-content-bg"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              position: isGrading ? 'relative' : 'absolute',
              inset: 0,
              minHeight: 0,
              pointerEvents: isGrading ? 'auto' : 'none',
            }}
          >
            {isGrading && (
              <QuizGrader
                quiz={parsedQuiz}
                onClose={() => setIsGrading(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* History Panel */}
      <div
        className={`border-l border-theme bg-theme-secondary transition-all duration-300 overflow-hidden ${
          historyOpen ? 'w-80' : 'w-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-theme-heading">Saved Quizzes</h3>
            <button
              onClick={() => setHistoryOpen(false)}
              className="p-1 rounded hover:bg-theme-hover transition"
            >
              <X className="w-5 h-5 text-theme-muted" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
            {quizHistories.length === 0 ? (
              <div className="text-center text-theme-hint mt-8">
                <ListChecks className="w-12 h-12 mx-auto mb-2 text-theme-hint" />
                <p className="text-sm">No saved quizzes yet</p>
              </div>
            ) : (
              quizHistories.map((history) => (
                <div
                  key={history.id}
                  onClick={() => loadQuizHistory(history)}
                  className={`p-3 rounded-lg cursor-pointer transition group hover:bg-theme-subtle ${
                    currentQuizId === history.id ? 'bg-theme-surface shadow-sm' : 'bg-theme-tertiary'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-theme-heading line-clamp-2">
                        {history.title}
                      </p>
                      <p className="text-xs text-theme-hint mt-1">
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

      {/* Lesson Plan Picker Modal */}
      {lessonPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-xl w-full max-w-lg mx-4 flex flex-col max-h-[80vh] widget-glass">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-theme">
              <div>
                <h3 className="text-lg font-semibold text-theme-heading">Generate from Lesson Plan</h3>
                <p className="text-sm text-theme-hint mt-0.5">Select a saved lesson plan to pre-fill the quiz form</p>
              </div>
              <button onClick={() => setLessonPickerOpen(false)}
                className="p-1.5 rounded-lg hover:bg-theme-hover transition">
                <X className="w-5 h-5 text-theme-muted" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {lessonPickerLoading ? (
                <div className="flex items-center justify-center py-12 text-theme-hint">
                  <HeartbeatLoader className="w-5 h-5 mr-3" />
                  Loading lesson plans...
                </div>
              ) : lessonPlanOptions.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-theme-hint opacity-40" />
                  <p className="font-medium text-theme-heading">No saved lesson plans found</p>
                  <p className="text-sm text-theme-hint mt-1">Create and save a lesson plan first, then return here.</p>
                </div>
              ) : (
                lessonPlanOptions.map(lesson => (
                  <button
                    key={lesson.id}
                    onClick={() => handleSelectLessonPlan(lesson)}
                    className="w-full text-left p-3 rounded-lg border border-theme hover:bg-theme-subtle transition group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-theme-heading text-sm truncate">{lesson.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-theme-hint flex-wrap">
                          {lesson.formData.subject && <span>{lesson.formData.subject}</span>}
                          {lesson.formData.gradeLevel && <span>Grade {lesson.formData.gradeLevel}</span>}
                          {lesson.formData.topic && <span className="truncate">{lesson.formData.topic}</span>}
                        </div>
                        <p className="text-xs text-theme-hint mt-1">
                          {new Date(lesson.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className="text-xs px-2 py-1 rounded-full shrink-0 opacity-0 group-hover:opacity-100 transition font-medium whitespace-nowrap"
                        style={{ backgroundColor: `${tabColor}20`, color: tabColor }}
                      >
                        Use this
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-theme">
              <p className="text-xs text-theme-hint text-center">
                The full lesson plan will be sent to the AI. You can still adjust question types and other settings.
              </p>
            </div>
          </div>
        </div>
      )}

      <TutorialOverlay
        steps={tutorials[TUTORIAL_IDS.QUIZ_GENERATOR].steps}
        onComplete={handleTutorialComplete}
        autoStart={showTutorial}
        showFloatingButton={false}
      />
    </div>
  );
};

export default QuizGenerator; 
