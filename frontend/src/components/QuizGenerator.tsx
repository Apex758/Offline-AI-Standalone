import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AIDisclaimer from './AIDisclaimer';
import { HugeiconsIcon } from '@hugeicons/react';
import Loading03IconData from '@hugeicons/core-free-icons/Loading03Icon';
import CheckListIconData from '@hugeicons/core-free-icons/CheckListIcon';
import { useAchievementTrigger } from '../contexts/AchievementContext';
import Delete02IconData from '@hugeicons/core-free-icons/Delete02Icon';
import SaveIconData from '@hugeicons/core-free-icons/SaveIcon';
import Download01IconData from '@hugeicons/core-free-icons/Download01Icon';
import Clock01IconData from '@hugeicons/core-free-icons/Clock01Icon';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import PencilEdit01IconData from '@hugeicons/core-free-icons/PencilEdit01Icon';
import Tick01IconData from '@hugeicons/core-free-icons/Tick01Icon';
import Message01IconData from '@hugeicons/core-free-icons/Message01Icon';
import File01IconData from '@hugeicons/core-free-icons/File01Icon';
import UserGroupIconData from '@hugeicons/core-free-icons/UserGroupIcon';
import GraduationScrollIconData from '@hugeicons/core-free-icons/GraduationScrollIcon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import ArrowLeft01IconData from '@hugeicons/core-free-icons/ArrowLeft01Icon';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import BookOpen01IconData from '@hugeicons/core-free-icons/BookOpen01Icon';
import PanelRightCloseIconData from '@hugeicons/core-free-icons/PanelRightCloseIcon';
import PanelRightOpenIconData from '@hugeicons/core-free-icons/PanelRightOpenIcon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const Loader2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Loading03IconData} {...p} />;
const ListChecks: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CheckListIconData} {...p} />;
const Trash2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Delete02IconData} {...p} />;
const Save: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={SaveIconData} {...p} />;
const Download: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Download01IconData} {...p} />;
const History: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Clock01IconData} {...p} />;
const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Cancel01IconData} {...p} />;
const Edit: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PencilEdit01IconData} {...p} />;
const Check: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Tick01IconData} {...p} />;
const MessageSquare: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Message01IconData} {...p} />;
const FileText: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={File01IconData} {...p} />;
const Users: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={UserGroupIconData} {...p} />;
const GraduationCap: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={GraduationScrollIconData} {...p} />;
const ChevronDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowDown01IconData} {...p} />;
const ChevronLeft: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowLeft01IconData} {...p} />;
const ChevronRight: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowRight01IconData} {...p} />;
const ClipboardCheck: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CheckListIconData} {...p} />;
const BookOpen: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BookOpen01IconData} {...p} />;
const PanelRightClose: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PanelRightCloseIconData} {...p} />;
const PanelRightOpen: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PanelRightOpenIconData} {...p} />;
import ExportButton from './ExportButton';
import AIAssistantPanel from './AIAssistantPanel';
import QuizEditor from './QuizEditor';
import QuizGrader from './QuizGrader';
import ScheduleTestModal from './ScheduleTestModal';
import axios from 'axios';
import { ParsedQuiz, parseQuizFromAI, quizToDisplayText, displayTextToQuiz } from '../types/quiz';
import { buildQuizPrompt } from '../utils/quizPromptBuilder';
import CurriculumAlignmentFields from './ui/CurriculumAlignmentFields';
import RelatedCurriculumBox from './ui/RelatedCurriculumBox';
import { useSettings } from '../contexts/SettingsContext';
import { filterSubjects, filterGrades } from '../data/teacherConstants';
import { TutorialOverlay } from './TutorialOverlay';
import { TutorialButton } from './TutorialButton';
import { tutorials, TUTORIAL_IDS } from '../data/tutorialSteps';
import { getWebSocketUrl, isElectronEnvironment } from '../config/api.config';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useQueue } from '../contexts/QueueContext';
import { GeneratorSkeleton } from './ui/GeneratorSkeleton';
import { HeartbeatLoader } from './ui/HeartbeatLoader';
import { useQueueCancellation } from '../hooks/useQueueCancellation';
import { useOfflineGuard } from '../hooks/useOfflineGuard';
import { useHistoryMatching } from '../hooks/useHistoryMatching';
// Curriculum data is loaded on demand by CurriculumAlignmentFields

interface QuizGeneratorProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
  isActive?: boolean;
}

interface QuizHistory {
  id: string;
  title: string;
  timestamp: string;
  formData: FormData;
  generatedQuiz: string;
  parsedQuiz?: ParsedQuiz;
  classQuizData?: Array<{id: string, name: string, questionOrder: number[]}>;
  selectedClassName?: string;
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

interface Draft {
  id: string;
  title: string;
  timestamp: string;
  plannerType: string;
  formData: any;
  step?: number;
  curriculumMatches?: any[];
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

  // Safety net: strip echoed prompt/instructional sections that the LLM may repeat
  cleanText = cleanText.replace(/\n*QUESTION TYPE[S]?:[\s\S]*?(?=\nQuestion \d+:|$)/gi, '');
  cleanText = cleanText.replace(/\n*SUBJECT:[\s\S]*?(?=\nQuestion \d+:|$)/gi, '');
  cleanText = cleanText.replace(/\n*STRAND:[\s\S]*?(?=\nQuestion \d+:|$)/gi, '');
  cleanText = cleanText.replace(/\n*CURRICULUM ALIGNMENT[\s\S]*?(?=\nQuestion \d+:|$)/gi, '');
  cleanText = cleanText.replace(/\n*GRADE LEVEL REQUIREMENTS:[\s\S]*?(?=\nQuestion \d+:|$)/gi, '');
  cleanText = cleanText.replace(/\n*SUBJECT-SPECIFIC ASSESSMENT GUIDANCE:[\s\S]*?(?=\nQuestion \d+:|$)/gi, '');
  cleanText = cleanText.replace(/\n*FORMAT EACH QUESTION[\s\S]*?(?=\nQuestion \d+:|$)/gi, '');
  cleanText = cleanText.replace(/\n*CRITICAL[\s\S]*?(?=\nQuestion \d+:|$)/gi, '');
  cleanText = cleanText.replace(/\n*RULES:[\s\S]*?(?=\nQuestion \d+:|$)/gi, '');
  cleanText = cleanText.replace(/\n*(?:MULTIPLE CHOICE|TRUE\/FALSE|FILL-IN-THE-BLANK|OPEN-ENDED) FORMAT:\n[\s\S]*?(?=\nQuestion \d+:|$)/gi, '');

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
  const { t } = useTranslation();
  const triggerCheck = useAchievementTrigger();
  const { settings, markTutorialComplete, isTutorialCompleted } = useSettings();
  const { getConnection, getStreamingContent, getIsStreaming, clearStreaming, subscribe } = useWebSocket();
  const { enqueue, queueEnabled } = useQueue();
  const tabColor = settings.tabColors['quiz-generator'];
  const [showTutorial, setShowTutorial] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draftsExpanded, setDraftsExpanded] = useState(true);
  const [quizHistories, setQuizHistories] = useState<QuizHistory[]>([]);
  const [lessonPickerOpen, setLessonPickerOpen] = useState(false);
  const [lessonPlanOptions, setLessonPlanOptions] = useState<LessonPlanHistoryItem[]>([]);
  const [lessonPickerLoading, setLessonPickerLoading] = useState(false);
  const [lockedLessonPlan, setLockedLessonPlan] = useState<LessonPlanHistoryItem | null>(null);
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

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
  const [classQuizMode, setClassQuizMode] = useState(!!savedData?.classQuizData);
  const [selectedClassName, setSelectedClassName] = useState(savedData?.selectedClassName || '');
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [classStudents, setClassStudents] = useState<Array<{id: string, full_name: string}>>([]);
  const [randomizeClassQuestions, setRandomizeClassQuestions] = useState(false);
  const [classQuizData, setClassQuizData] = useState<Array<{id: string, name: string, questionOrder: number[]}> | null>(savedData?.classQuizData || null);
  const [selectedStudentIdx, setSelectedStudentIdx] = useState<number | null>(null);
  const [studentPanelOpen, setStudentPanelOpen] = useState(!!savedData?.classQuizData);
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
      return { ...getDefaultFormData(), ...saved };
    }
    return getDefaultFormData();
  });

  const { matchCount, matchedHistories, sortedHistories: sortedQuizHistories } = useHistoryMatching(formData, quizHistories);

  const [generatedQuiz, setGeneratedQuiz] = useState<string>(savedData?.generatedQuiz || '');
  
  // ✅ Read streaming content from context (read-only, no setter!)
  const [, forceRender] = useState({});
  const streamingQuiz = getStreamingContent(tabId, ENDPOINT);
  const contextLoading = getIsStreaming(tabId, ENDPOINT);

  // Subscribe to streaming updates so component re-renders as tokens arrive
  useEffect(() => {
    const unsubscribe = subscribe(tabId, ENDPOINT, () => {
      forceRender({});
    });
    return unsubscribe;
  }, [tabId, subscribe]);

  // Per-tab local loading state
  const [localLoadingMap, setLocalLoadingMap] = useState<{ [tabId: string]: boolean }>({});
  useQueueCancellation(tabId, ENDPOINT, setLocalLoadingMap);
  const { guardOffline } = useOfflineGuard();
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

  const gradeMapping = settings.profile.gradeSubjects || {};
  const filterOn = settings.profile.filterContentByProfile;

  const grades = filterGrades(allGrades, gradeMapping, filterOn);
  const selectedGradeKey = formData.gradeLevel?.toLowerCase() || '';
  const subjects = filterSubjects(allSubjects, gradeMapping, filterOn, selectedGradeKey || undefined);

  // Auto-select when only one option from profile filtering
  useEffect(() => {
    if (!filterOn) return;
    const updates: Partial<FormData> = {};
    if (grades.length === 1 && !formData.gradeLevel) updates.gradeLevel = grades[0];
    if (subjects.length === 1 && !formData.subject) updates.subject = subjects[0];
    if (Object.keys(updates).length > 0) setFormData(prev => ({ ...prev, ...updates }));
  }, [subjects, grades, filterOn]);

  // Fetch available classes when class quiz mode is enabled, filtered by grade level
  useEffect(() => {
    if (classQuizMode) {
      const params = formData.gradeLevel ? `?grade_level=${encodeURIComponent(formData.gradeLevel)}` : '';
      axios.get(`http://localhost:8000/api/classes${params}`).then(r => {
        setAvailableClasses(r.data.map((c: any) => c.class_name));
      }).catch(() => {});
      // Reset selected class when grade level changes
      setSelectedClassName('');
      setClassStudents([]);
    }
  }, [classQuizMode, formData.gradeLevel]);

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

  const questionTypesOptions = [
    { key: 'Multiple Choice', label: t('quiz.multipleChoice') },
    { key: 'True/False', label: t('quiz.trueFalse') },
    { key: 'Open-Ended', label: t('quiz.openEnded') },
    { key: 'Fill-in-the-Blank', label: t('quiz.fillInBlank') },
  ];
  const cognitiveLevelsOptions = [
    { key: 'Knowledge', label: t('quiz.knowledge') },
    { key: 'Comprehension', label: t('quiz.comprehension') },
    { key: 'Application', label: t('quiz.application') },
    { key: 'Analysis', label: t('quiz.analysis') },
    { key: 'Synthesis', label: t('quiz.synthesis') },
    { key: 'Evaluation', label: t('quiz.evaluation') },
  ];

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
        // localLoadingMap intentionally NOT restored — runtime-only state
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
      // localLoadingMap intentionally NOT persisted — runtime-only state
    }));
  }, [formData, generatedQuiz, parsedQuiz, currentQuizId, isEditing]);


  // Enable structured editing mode
  const enableEditing = () => {
    if (parsedQuiz) {
      setIsEditing(true);
    } else {
      alert(t('quiz.cannotEditAlert'));
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
      alert(t('quiz.noQuizToSave'));
      return;
    }

    setSaveStatus('saving');
    try {
      // Build a proper title with fallbacks
      const title = formData.subject?.trim()
        ? `${formData.subject}${formData.strand?.trim() ? ` — ${formData.strand}` : ''} Quiz - Grade ${formData.gradeLevel || 'Unknown'}`
        : `Quiz - Grade ${formData.gradeLevel || 'Unknown'}`;
      
      const quizData = {
        id: currentQuizId || `quiz_${Date.now()}`,
        title: title,
        timestamp: new Date().toISOString(),
        formData: formData,
        generatedQuiz: generatedQuiz,  // ✅ Save original clean text
        parsedQuiz: parsedQuiz || undefined,
        classQuizData: classQuizData || undefined,
        selectedClassName: classQuizMode ? selectedClassName : undefined,
      };

      await axios.post('http://localhost:8000/api/quiz-history', quizData);
      setCurrentQuizId(quizData.id);
      await loadQuizHistories();
      setSaveStatus('saved');
      triggerCheck();
      setShowScheduleModal(true);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save quiz:', error);
      alert(t('quiz.failedToSave'));
      setSaveStatus('idle');
    }
  };

  useEffect(() => {
    loadQuizHistories();
    loadDrafts();
  }, []);

  const loadQuizHistory = (history: QuizHistory) => {
    setFormData(history.formData);
    setGeneratedQuiz(history.generatedQuiz);
    setParsedQuiz(history.parsedQuiz || null);
    setCurrentQuizId(history.id);
    setHistoryOpen(false);
    // Restore class quiz data if present
    if (history.classQuizData) {
      setClassQuizData(history.classQuizData);
      setClassQuizMode(true);
      setSelectedClassName(history.selectedClassName || '');
      setSelectedStudentIdx(null);
      setStudentPanelOpen(true);
    } else {
      setClassQuizData(null);
      setClassQuizMode(false);
      setSelectedClassName('');
      setSelectedStudentIdx(null);
    }
  };

  const deleteQuizHistory = async (quizId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(t('quiz.confirmDeleteQuiz'))) return;
    
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

  const loadDrafts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/lesson-drafts?plannerType=quiz');
      setDrafts(response.data);
    } catch (error) {
      console.error('Failed to load drafts:', error);
    }
  };

  const loadDraft = async (draft: Draft) => {
    setFormData(draft.formData);
    setGeneratedQuiz('');
    setParsedQuiz(null);
    setCurrentQuizId(null);
    setHistoryOpen(false);
    try {
      await axios.delete(`http://localhost:8000/api/lesson-drafts/${draft.id}`);
      await loadDrafts();
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  const deleteDraft = async (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(t('quiz.confirmDeleteDraft'))) return;
    try {
      await axios.delete(`http://localhost:8000/api/lesson-drafts/${draftId}`);
      await loadDrafts();
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
    }
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
    if (guardOffline()) return;
    if (!validateForm()) {
      const firstError = document.querySelector('[data-validation-error="true"]');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const { systemPrompt, userPrompt } = buildQuizPrompt(formData, lockedLessonPlan?.generatedPlan, settings.language);

    if (queueEnabled) {
      enqueue({
        label: `Quiz - ${formData.subject} (Grade ${formData.gradeLevel})`,
        toolType: 'Quiz',
        tabId,
        endpoint: ENDPOINT,
        prompt: userPrompt,
        generationMode: settings.generationMode,
        extraMessageData: { systemPrompt, formData },
      });
      setLocalLoadingMap(prev => ({ ...prev, [tabId]: true }));
      return;
    }

    const ws = getConnection(tabId, ENDPOINT);
    if (ws.readyState !== WebSocket.OPEN) {
      alert(t('quiz.connectionNotEstablished'));
      return;
    }
    setLocalLoadingMap(prev => ({ ...prev, [tabId]: true }));

    try {
      ws.send(JSON.stringify({
        prompt: userPrompt,
        systemPrompt,
        formData,
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

  const validateForm = (): boolean => {
    const errors: Record<string, boolean> = {};
    if (formData.questionTypes.length === 0) errors.questionTypes = true;
    if (formData.cognitiveLevels.length === 0) errors.cognitiveLevels = true;
    if (!lockedLessonPlan) {
      if (!formData.subject) errors.subject = true;
      if (!formData.gradeLevel) errors.gradeLevel = true;
      if (!formData.strand) errors.strand = true;
      if (!formData.essentialOutcomes) errors.essentialOutcomes = true;
      if (!formData.specificOutcomes) errors.specificOutcomes = true;
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
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
    onDataChange({ formData, generatedQuiz, parsedQuiz, classQuizData, selectedClassName: classQuizMode ? selectedClassName : undefined });
  }, [formData, generatedQuiz, parsedQuiz, classQuizData, classQuizMode, selectedClassName]);

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
        setStudentPanelOpen(true);

        // Persist quiz instances for QR-based scan grading
        // Must save answer key FIRST so the FK constraint in quiz_instances is satisfied
        const quizId = currentQuizId || `quiz_${Date.now()}`;
        const title = formData.subject?.trim()
          ? `${formData.subject}${formData.strand?.trim() ? ` — ${formData.strand}` : ''} Quiz - Grade ${formData.gradeLevel || 'Unknown'}`
          : `Quiz - Grade ${formData.gradeLevel || 'Unknown'}`;

        // Auto-save answer key first, then save instances
        axios.post('http://localhost:8000/api/quiz-history', {
          id: quizId,
          title,
          timestamp: new Date().toISOString(),
          formData,
          generatedQuiz: streamingQuiz,
          parsedQuiz: finalParsed,
          classQuizData: studentData,
          selectedClassName,
        }).then(() => {
          setCurrentQuizId(quizId);
          loadQuizHistories();
          return axios.post('http://localhost:8000/api/save-quiz-instances', {
            quiz_id: quizId,
            class_name: selectedClassName,
            students: studentData.map(s => ({
              student_id: s.id,
              name: s.name,
              question_order: s.questionOrder
            }))
          });
        }).catch(err => console.warn('Failed to save quiz instances:', err));
      }
    }
  }, [streamingQuiz, contextLoading]);

  return (
    <div className="flex h-full tab-content-bg relative" data-tutorial="quiz-generator-welcome">
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
                      {loading ? t('generators.generatingQuiz') : t('quiz.generatedQuiz')}
                    </h2>
                    <p className="text-sm text-theme-hint">{formData.subject} - {t('quiz.gradeLabel', { level: formData.gradeLevel })}</p>
                  </div>
                  {!loading && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={enableEditing}
                        disabled={!parsedQuiz}
                        className="flex items-center px-3.5 py-1.5 text-[13.5px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        title={!parsedQuiz ? t('quiz.quizFormatNotRecognized') : t('quiz.editQuiz')}
                      >
                        <Edit className="w-3.5 h-3.5 mr-1.5" />
                        {t('common.edit')}
                      </button>
                      <button
                        onClick={() => setAssistantOpen(true)}
                        className="flex items-center px-3.5 py-1.5 text-[13.5px] bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-lg"
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                        {t('common.assistant')}
                      </button>
                      <button
                        onClick={saveQuiz}
                        disabled={saveStatus === 'saving'}
                        className="flex items-center px-3.5 py-1.5 text-[13.5px] bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                      >
                        {saveStatus === 'saving' ? (
                          <>
                            <HeartbeatLoader className="w-3.5 h-3.5 mr-1.5" />
                            {t('quiz.saving')}
                          </>
                        ) : saveStatus === 'saved' ? (
                          <>
                            <Save className="w-3.5 h-3.5 mr-1.5" />
                            {t('quiz.saved')}
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5 mr-1.5" />
                            {t('quiz.saveQuiz')}
                          </>
                        )}
                      </button>
                      {/* Version Selector Dropdown */}
                      <div className="relative">
                        <button
                          onClick={() => setShowVersionMenu(!showVersionMenu)}
                          className="flex items-center px-3.5 py-1.5 text-[13.5px] bg-theme-tertiary text-theme-label rounded-lg hover:bg-theme-hover transition border border-theme-strong"
                        >
                          <FileText className="w-3.5 h-3.5 mr-1.5" />
                          {selectedVersion === 'teacher' ? t('quiz.teacherVersion') : t('quiz.studentVersion')}
                          <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
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
                                    if (classQuizData) setStudentPanelOpen(true);
                                  }}
                                  className={`w-full text-left px-4 py-2 hover:bg-theme-subtle flex items-center justify-between transition ${
                                    selectedVersion === 'student' ? 'bg-blue-50' : ''
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-3 text-blue-600" />
                                    <div>
                                      <div className="text-sm font-medium text-theme-title">{t('quiz.studentVersion')}</div>
                                      <div className="text-xs text-theme-hint">{t('quiz.cleanQuiz')}</div>
                                    </div>
                                  </div>
                                  {selectedVersion === 'student' && (
                                    <Check className="w-4 h-4 text-blue-600" />
                                  )}
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedVersion('teacher');
                                    setSelectedStudentIdx(null);
                                    setShowVersionMenu(false);
                                  }}
                                  className={`w-full text-left px-4 py-2 hover:bg-theme-subtle flex items-center justify-between transition ${
                                    selectedVersion === 'teacher' ? 'bg-blue-50' : ''
                                  }`}
                                >
                                  <div className="flex items-center">
                                    <GraduationCap className="w-4 h-4 mr-3 text-green-600" />
                                    <div>
                                      <div className="text-sm font-medium text-theme-title">{t('quiz.teacherVersion')}</div>
                                      <div className="text-xs text-theme-hint">{t('quiz.withAnswerKey')}</div>
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
                          },
                          studentInfo: viewingStudent ? { name: viewingStudent.name, id: viewingStudent.id } : undefined,
                          quizId: currentQuizId || `quiz_${Date.now()}`
                        }}
                        filename={`quiz-${formData.subject.toLowerCase()}-grade${formData.gradeLevel}-${viewingStudent ? viewingStudent.name.replace(/\s+/g, '-') : effectiveVersion}`}
                        className="ml-2 !px-3.5 !py-1.5 !text-[13.5px]"
                      />
                      <button
                        onClick={() => setHistoryOpen(!historyOpen)}
                        className="relative p-2 rounded-lg hover:bg-theme-hover transition"
                        title={t('quiz.quizHistory')}
                      >
                        <History className="w-5 h-5 text-theme-muted" />
                        {matchCount > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold leading-none px-1">{matchCount}</span>
                        )}
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
                        className="px-3.5 py-1.5 text-[13.5px] bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                      >
                        {t('quiz.createNewQuiz')}
                      </button>
                    </div>
                  )}
                </div>
            
                <div className="flex-1 overflow-y-auto bg-theme-surface p-6">
                  {(streamingQuiz || generatedQuiz) && (
                    <div className="mb-8">
                      <div className="relative overflow-hidden rounded-2xl shadow-lg">
                        <div className="absolute inset-0 bg-gradient-to-br" style={{
                          background: `linear-gradient(to bottom right, ${tabColor}, ${tabColor}dd, ${tabColor}bb)`
                        }}></div>
                        <div className="absolute inset-0" style={{
                          background: `linear-gradient(to bottom right, ${tabColor}e6, ${tabColor}cc)`
                        }}></div>
                        
                        <div className="relative px-8 py-8">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-4">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                                  <span className="text-white text-sm font-medium">{formData.subject}</span>
                                </div>
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                                  <span className="text-white text-sm font-medium">{t('quiz.gradeLabel', { level: formData.gradeLevel })}</span>
                                </div>
                              </div>

                              <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
                                {t('quiz.quizTitle', { subject: formData.subject, strand: formData.strand ? ` — ${formData.strand}` : '' })}
                              </h1>

                              <div className="flex flex-wrap items-center gap-4 text-cyan-100">
                                <div className="flex items-center">
                                  <div className="w-2 h-2 bg-cyan-200 rounded-full mr-2"></div>
                                  <span className="text-sm">{formData.questionTypes.join(', ')}</span>
                                </div>
                                {effectiveVersion !== 'student' && (
                                <div className="flex items-center">
                                  <div className="w-2 h-2 bg-cyan-200 rounded-full mr-2"></div>
                                  <span className="text-sm">{t('quiz.generatedOn', { date: new Date().toLocaleDateString() })}</span>
                                </div>
                                )}
                              </div>
                            </div>

                            {loading && (
                              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                                <div className="flex items-center text-white">
                                  <HeartbeatLoader className="w-5 h-5 mr-3" />
                                  <div>
                                    <div className="text-sm font-medium">{t('quiz.generatingDot')}</div>
                                    <div className="text-xs text-cyan-100">{t('generators.generatingQuiz')}</div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {viewingStudent && !loading && (
                              <div className="text-right">
                                <div className="text-3xl font-bold text-white leading-tight">{viewingStudent.name}</div>
                                <div className="text-sm text-cyan-100 mt-1">{t('quiz.idPrefix')}{viewingStudent.id}</div>
                              </div>
                            )}
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
                          {displayParsedQuiz.questions.map((question, qIndex) => {
                            const correctAnswerIndex = question.correctAnswer as number;
                            const correctLetter = question.type === 'multiple-choice' && typeof correctAnswerIndex === 'number'
                              ? String.fromCharCode(65 + correctAnswerIndex)
                              : null;

                            return (
                              <div key={question.id} className="space-y-3">
                                <h3 className="text-lg font-semibold p-3 rounded-lg" style={{ color: `${tabColor}cc`, backgroundColor: `${tabColor}0d` }}>
                                  {t('quiz.questionPrefix', { number: qIndex + 1 })}: {question.question}
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
                                          {t('quiz.correctAnswer')}: {correctLetter}
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
                                        {t('quiz.true')}
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
                                        {t('quiz.false')}
                                      </span>
                                    </div>

                                    {/* Show answer only in teacher version */}
                                    {effectiveVersion === 'teacher' && (
                                      <div className="mt-3 text-sm">
                                        <span className="font-semibold text-green-700">
                                          {t('quiz.correctAnswer')}: {question.correctAnswer === 'true' ? t('quiz.true') : t('quiz.false')}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                {question.type === 'fill-blank' && effectiveVersion === 'teacher' && (
                                  <div className="ml-6 space-y-2">
                                    <div className="text-sm">
                                      <span className="font-semibold text-green-700">
                                        {t('quiz.correctAnswer')}: {question.correctAnswer}
                                      </span>
                                    </div>
                                  </div>
                                )}
                                
                                {question.type === 'open-ended' && effectiveVersion === 'teacher' && (
                                  <div className="ml-6 space-y-2">
                                    <div className="text-sm">
                                      <span className="font-semibold text-theme-label">{t('quiz.sampleAnswer')}</span>
                                      <p className="text-theme-muted mt-1 whitespace-pre-wrap">{question.correctAnswer}</p>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Show explanation only in teacher version */}
                                {effectiveVersion === 'teacher' && question.explanation && (
                                  <div className="ml-6 mt-3 p-3 bg-blue-50 rounded-lg">
                                    <span className="text-sm font-semibold text-blue-900">{t('quiz.explanation')}: </span>
                                    <span className="text-sm text-blue-800">{question.explanation}</span>
                                  </div>
                                )}
                                
                                {effectiveVersion === 'teacher' && (question.cognitiveLevel || question.points) && (
                                  <div className="ml-6 mt-2 flex gap-4 text-xs text-theme-hint">
                                    {question.cognitiveLevel && (
                                      <span>{t('quiz.cognitiveLevel')} {question.cognitiveLevel}</span>
                                    )}
                                    {question.points && (
                                      <span>{t('quiz.points')} {question.points}</span>
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
                          <div className="font-medium" style={{ color: `${tabColor}dd` }}>{t('quiz.creatingYourQuiz')}</div>
                          <div className="text-sm mt-1" style={{ color: `${tabColor}99` }}>{t('quiz.tailoredForOutcomes')}</div>
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
                  <h2 className="text-xl font-semibold text-theme-heading">{t('quiz.quizConfiguration')}</h2>
                  <p className="text-sm text-theme-hint">{t('quiz.configureParams')}</p>
                </div>
                <div className="flex items-center gap-2">
                  {lockedLessonPlan ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border" style={{ borderColor: `${tabColor}44`, color: tabColor, backgroundColor: `${tabColor}10` }}>
                      <BookOpen className="w-4 h-4 shrink-0" />
                      <span className="max-w-[160px] truncate">{lockedLessonPlan.title}</span>
                      <button onClick={() => setLockedLessonPlan(null)} className="ml-1 hover:opacity-60 transition shrink-0" title={t('quiz.removeLessonPlan')}>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setLessonPickerOpen(true); loadLessonPlans(); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-theme-hover transition text-sm font-medium"
                      style={{ color: tabColor }}
                      title={t('quiz.generateFromLessonTitle')}
                    >
                      <BookOpen className="w-4 h-4" />
                      {t('quiz.fromLessonPlan')}
                    </button>
                  )}
                  <button
                    onClick={() => setIsGrading(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition text-sm font-medium text-emerald-600 border border-emerald-200"
                    title={t('quiz.gradeExistingQuiz')}
                  >
                    <ClipboardCheck className="w-4 h-4" />
                    {t('quiz.gradeQuiz')}
                  </button>
                  <button
                    onClick={() => setHistoryOpen(!historyOpen)}
                    className="relative p-2 rounded-lg hover:bg-theme-hover transition"
                    title={t('quiz.quizHistory')}
                    data-tutorial="quiz-generator-history"
                  >
                    <History className="w-5 h-5 text-theme-muted" />
                    {matchCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold leading-none px-1">{matchCount}</span>
                    )}
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
                          <p className="text-xs font-medium uppercase tracking-wider text-theme-hint mb-1">{t('quiz.generatingQuizFrom')}</p>
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
                                {t('quiz.gradeLabel', { level: lockedLessonPlan.formData.gradeLevel })}
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
                          title={t('quiz.removeLessonPlan')}
                        >
                          <X className="w-4 h-4 text-theme-muted" />
                        </button>
                      </div>

                      {/* Learning objectives preview */}
                      {lockedLessonPlan.parsedLesson?.learningObjectives && lockedLessonPlan.parsedLesson.learningObjectives.length > 0 && (
                        <div className="mt-3 pt-3 border-t" style={{ borderColor: `${tabColor}20` }}>
                          <p className="text-xs font-medium text-theme-hint mb-1.5">{t('quiz.learningObjectives')}</p>
                          <ul className="space-y-1">
                            {lockedLessonPlan.parsedLesson.learningObjectives.slice(0, 3).map((obj, i) => (
                              <li key={i} className="text-sm text-theme-label flex items-start gap-2">
                                <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ backgroundColor: `${tabColor}88` }} />
                                <span className="line-clamp-1">{obj}</span>
                              </li>
                            ))}
                            {lockedLessonPlan.parsedLesson.learningObjectives.length > 3 && (
                              <li className="text-xs text-theme-hint ml-3">
                                {t('quiz.moreObjectives', { count: lockedLessonPlan.parsedLesson.learningObjectives.length - 3 })}
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Curriculum outcomes preview */}
                      {!lockedLessonPlan.parsedLesson?.learningObjectives?.length && (lockedLessonPlan.formData.essentialOutcomes || lockedLessonPlan.formData.specificOutcomes) && (
                        <div className="mt-3 pt-3 border-t" style={{ borderColor: `${tabColor}20` }}>
                          <p className="text-xs font-medium text-theme-hint mb-1.5">{t('quiz.curriculumOutcomes')}</p>
                          <p className="text-sm text-theme-label line-clamp-2">
                            {lockedLessonPlan.formData.essentialOutcomes || lockedLessonPlan.formData.specificOutcomes}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="px-5 py-2.5 bg-theme-secondary border-t border-theme text-xs text-theme-hint flex items-center gap-1.5">
                      <MessageSquare className="w-3 h-3" />
                      {t('quiz.quizBasedOnLesson')}
                    </div>
                  </div>
                ) : (
                  /* ── Standard curriculum fields ── */
                  <>
                    <div data-tutorial="quiz-generator-grade">
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        {t('forms.gradeLevel')} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.gradeLevel}
                        onChange={(e) => {
                          const newGrade = e.target.value;
                          handleInputChange('gradeLevel', newGrade);
                          handleInputChange('strand', '');
                          handleInputChange('essentialOutcomes', '');
                          handleInputChange('specificOutcomes', '');
                          const available = filterSubjects(allSubjects, gradeMapping, filterOn, newGrade.toLowerCase() || undefined);
                          if (formData.subject && !available.includes(formData.subject)) {
                            handleInputChange('subject', '');
                          }
                        }}
                        data-validation-error={validationErrors.gradeLevel ? 'true' : undefined}
                        className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 ${validationErrors.gradeLevel ? 'validation-error' : ''}`}
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                      >
                        <option value="">{t('quiz.selectGrade')}</option>
                        {grades.map(g => <option key={g} value={g}>{t('quiz.gradeLabel', { level: g })}</option>)}
                      </select>
                    </div>

                    <div data-tutorial="quiz-generator-subject">
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        {t('forms.subject')} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => {
                          handleInputChange('subject', e.target.value);
                          handleInputChange('strand', '');
                          handleInputChange('essentialOutcomes', '');
                          handleInputChange('specificOutcomes', '');
                        }}
                        data-validation-error={validationErrors.subject ? 'true' : undefined}
                        className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 ${validationErrors.subject ? 'validation-error' : ''}`}
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                      >
                        <option value="">{t('quiz.selectSubject')}</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
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
                        validationErrors={validationErrors}
                      />
                      <RelatedCurriculumBox
                        subject={formData.subject}
                        gradeLevel={formData.gradeLevel}
                        strand={formData.strand}
                        useCurriculum={useCurriculum}
                        essentialOutcomes={formData.essentialOutcomes}
                        specificOutcomes={formData.specificOutcomes}
                      />
                    </div>
                  </>
                )}

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
                    <span className="text-sm font-medium text-theme-label">{t('quiz.generateForClass')}</span>
                  </label>

                  {classQuizMode && (
                    <div className="ml-6 space-y-3 p-3 rounded-lg border border-theme bg-theme-subtle">
                      <div>
                        <label className="block text-xs font-medium text-theme-hint mb-1">{t('quiz.selectClass')}</label>
                        <select
                          value={selectedClassName}
                          onChange={(e) => setSelectedClassName(e.target.value)}
                          className="w-full px-3 py-2 border border-theme-strong rounded-lg text-sm focus:ring-2"
                          style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                        >
                          <option value="">{t('quiz.chooseClass')}</option>
                          {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>

                      {classStudents.length > 0 && (
                        <div className="flex items-center gap-2 text-xs" style={{ color: tabColor }}>
                          <Users className="w-3.5 h-3.5" />
                          <span className="font-medium">{t('quiz.studentsInClass', { count: classStudents.length })}</span>
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
                        <span className="text-sm text-theme-label">{t('quiz.randomizeOrder')}</span>
                      </label>
                      {randomizeClassQuestions && (
                        <p className="text-xs text-theme-hint ml-6">{t('quiz.randomizeOrderHint')}</p>
                      )}
                    </div>
                  )}
                </div>

                <div data-tutorial="quiz-generator-question-count">
                  <label className="block text-sm font-medium text-theme-label mb-2">
                    {t('forms.questionCount')} <span className="text-red-500">*</span>
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
                    {t('quiz.questionTypes')} <span className="text-red-500">*</span>
                  </label>
                  <div data-validation-error={validationErrors.questionTypes ? 'true' : undefined} className={`grid grid-cols-2 gap-2 p-2 rounded-lg ${validationErrors.questionTypes ? 'validation-error' : ''}`}>
                    {questionTypesOptions.map(({ key, label }) => (
                      <label key={key} className="flex items-center space-x-2 p-2 rounded hover:bg-theme-subtle cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.questionTypes.includes(key)}
                          onChange={() => handleCheckboxChange('questionTypes', key)}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: tabColor }}
                        />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div data-tutorial="quiz-generator-cognitive-levels">
                  <label className="block text-sm font-medium text-theme-label mb-3">
                    {t('quiz.cognitiveLevels')} <span className="text-red-500">*</span>
                  </label>
                  <div data-validation-error={validationErrors.cognitiveLevels ? 'true' : undefined} className={`grid grid-cols-2 gap-2 p-2 rounded-lg ${validationErrors.cognitiveLevels ? 'validation-error' : ''}`}>
                    {cognitiveLevelsOptions.map(({ key, label }) => (
                      <label key={key} className="flex items-center space-x-2 p-2 rounded hover:bg-theme-subtle cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.cognitiveLevels.includes(key)}
                          onChange={() => handleCheckboxChange('cognitiveLevels', key)}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: tabColor }}
                        />
                        <span className="text-sm">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-theme-label mb-2">
                    {t('quiz.timeLimitPerQuestion')}
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

              </div>
            </div>

            <div className="border-t border-theme p-4 bg-theme-secondary">
              <div className="max-w-3xl mx-auto flex justify-between">
                <button
                  onClick={clearForm}
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  {t('quiz.clearForm')}
                </button>
                <button
                  onClick={generateQuiz}
                  disabled={loading}
                  className="flex items-center px-6 py-2 text-white rounded-lg disabled:opacity-50 transition"
                  data-tutorial="quiz-generator-generate"
                  style={loading ? {} : { backgroundColor: tabColor }}
                  onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={(e) => !loading && (e.currentTarget.style.opacity = '1')}
                >
                  {loading ? (
                    <>
                      <HeartbeatLoader className="w-5 h-5 mr-2" />
                      {t('generators.generatingQuiz')}
                    </>
                  ) : (
                    <>
                      <ListChecks className="w-5 h-5 mr-2" />
                      {t('generators.generateQuiz')}
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
        <AIDisclaimer />
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
            <h3 className="text-lg font-semibold text-theme-heading">{t('quiz.savedQuizzes')}</h3>
            <button
              onClick={() => setHistoryOpen(false)}
              className="p-1 rounded hover:bg-theme-hover transition"
            >
              <X className="w-5 h-5 text-theme-muted" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
            {drafts.length > 0 && (
              <>
                <div
                  className="flex items-center gap-1 cursor-pointer select-none py-1"
                  onClick={() => setDraftsExpanded(!draftsExpanded)}
                >
                  <span className="text-xs text-theme-muted transition-transform" style={{ display: 'inline-block', transform: draftsExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>&#9654;</span>
                  <span className="text-sm font-medium text-amber-500">{t('quiz.draftsCount', { count: drafts.length })}</span>
                </div>
                {draftsExpanded && (
                  <div className="space-y-2">
                    {drafts.map((draft) => (
                      <div
                        key={draft.id}
                        onClick={() => loadDraft(draft)}
                        className="p-3 rounded-lg cursor-pointer transition group hover:bg-theme-subtle bg-theme-tertiary"
                        style={{ border: '1px dashed rgb(217 119 6 / 0.5)' }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-500 uppercase tracking-wide">{t('quiz.draft')}</span>
                              <p className="text-sm font-medium text-theme-heading line-clamp-2">{draft.title}</p>
                            </div>
                            <p className="text-xs text-theme-hint mt-1">
                              {new Date(draft.timestamp).toLocaleDateString()} {new Date(draft.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => deleteDraft(draft.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition"
                            title={t('quiz.deleteDraft')}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-b border-theme my-2"></div>
              </>
            )}
            {drafts.length === 0 && quizHistories.length === 0 ? (
              <div className="text-center text-theme-hint mt-8">
                <ListChecks className="w-12 h-12 mx-auto mb-2 text-theme-hint" />
                <p className="text-sm">{t('quiz.noSavedQuizzes')}</p>
              </div>
            ) : (
              <>
                {matchCount > 0 && (
                  <div className="mb-2">
                    <span className="text-xs font-medium text-blue-400">{t('quiz.matchingCount', { count: matchCount })}</span>
                  </div>
                )}
                {(matchCount > 0 ? sortedQuizHistories : quizHistories).map((history, idx) => (
                  <React.Fragment key={history.id}>
                    {matchCount > 0 && idx === matchedHistories.length && matchedHistories.length > 0 && (
                      <div className="border-b border-theme my-3">
                        <span className="text-xs text-theme-muted">{t('dashboard.other')}</span>
                      </div>
                    )}
                    <div
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
                          title={t('quiz.deleteQuiz')}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Student Quiz Panel (right side) - only when class quiz is generated */}
      {classQuizData && (generatedQuiz || streamingQuiz) && !loading && (
        <div
          className={`relative border-l border-theme flex flex-col flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out ${
            studentPanelOpen ? 'bg-theme-secondary' : 'student-panel-collapsed cursor-pointer hover:opacity-80'
          }`}
          style={{ width: studentPanelOpen ? '280px' : '40px' }}
          onClick={!studentPanelOpen ? () => setStudentPanelOpen(true) : undefined}
          title={!studentPanelOpen ? t('quiz.showStudentList') : undefined}
        >
          {/* Collapsed content */}
          <div
            className={`flex flex-col items-center justify-center absolute inset-0 transition-opacity duration-200 ${
              studentPanelOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <div className="flex flex-col items-center gap-1">
              <PanelRightOpen className="w-4 h-4 text-theme-muted" />
              <Users className="w-4 h-4 text-theme-muted" />
              <span className="text-xs text-theme-hint font-semibold" style={{ writingMode: 'vertical-lr' }}>
                {t('quiz.nStudents', { count: classQuizData.length })}
              </span>
            </div>
          </div>

          {/* Expanded content */}
          <div
            className={`flex flex-col h-full transition-opacity duration-200 delay-100 ${
              studentPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            style={{ minWidth: '280px' }}
          >
            <div className="p-3 border-b border-theme flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-theme-heading">{t('quiz.studentQuizzes')}</h3>
                <p className="text-xs text-theme-hint mt-0.5">{t('quiz.nStudents', { count: classQuizData.length })}</p>
              </div>
              <button
                onClick={() => setStudentPanelOpen(false)}
                className="p-1 rounded-lg hover:bg-theme-hover transition"
                title={t('quiz.collapsePanel')}
              >
                <PanelRightClose className="w-4 h-4 text-theme-muted" />
              </button>
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
                  <span className="font-medium text-theme-heading text-xs">{t('quiz.teacherVersion')}</span>
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
        </div>
      )}

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
                <h3 className="text-lg font-semibold text-theme-heading">{t('quiz.generateFromLesson')}</h3>
                <p className="text-sm text-theme-hint mt-0.5">{t('quiz.selectLessonPlan')}</p>
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
                  {t('quiz.loadingLessons')}
                </div>
              ) : lessonPlanOptions.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 text-theme-hint opacity-40" />
                  <p className="font-medium text-theme-heading">{t('quiz.noLessonsFound')}</p>
                  <p className="text-sm text-theme-hint mt-1">{t('quiz.createLessonPlanFirst')}</p>
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
                        {t('quiz.useThis')}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-theme">
              <p className="text-xs text-theme-hint text-center">
                The full lesson plan will be used for context. You can still adjust question types and other settings.
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

      <ScheduleTestModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        testInfo={{
          title: formData.subject
            ? `${formData.subject}${formData.strand ? ` — ${formData.strand}` : ''} Quiz - Grade ${formData.gradeLevel || 'Unknown'}`
            : `Quiz - Grade ${formData.gradeLevel || 'Unknown'}`,
          type: 'quiz',
          referenceId: currentQuizId || '',
          subject: formData.subject || '',
          gradeLevel: formData.gradeLevel || '',
        }}
        accentColor={settings.tabColors['quiz-generator'] ?? '#8b5cf6'}
      />
    </div>
  );
};

export default QuizGenerator; 
