import React, { useState, useEffect, useRef } from 'react';
import { useHistoryMatching } from '../hooks/useHistoryMatching';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useQueue } from '../contexts/QueueContext';
import { useAchievementTrigger } from '../contexts/AchievementContext';
import { HugeiconsIcon } from '@hugeicons/react';
import ArrowRight01Icon from '@hugeicons/core-free-icons/ArrowRight01Icon';
import ArrowLeft01Icon from '@hugeicons/core-free-icons/ArrowLeft01Icon';
import Loading02Icon from '@hugeicons/core-free-icons/Loading02Icon';
import File01Icon from '@hugeicons/core-free-icons/File01Icon';
import Delete02Icon from '@hugeicons/core-free-icons/Delete02Icon';
import SaveIcon from '@hugeicons/core-free-icons/SaveIcon';
import Download01Icon from '@hugeicons/core-free-icons/Download01Icon';
import Clock01Icon from '@hugeicons/core-free-icons/Clock01Icon';
import Cancel01Icon from '@hugeicons/core-free-icons/Cancel01Icon';
import PencilEdit01Icon from '@hugeicons/core-free-icons/PencilEdit01Icon';
import Message01Icon from '@hugeicons/core-free-icons/Message01Icon';
import VolumeHighIcon from '@hugeicons/core-free-icons/VolumeHighIcon';
import VolumeOffIcon from '@hugeicons/core-free-icons/VolumeOffIcon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const ChevronRight: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowRight01Icon} {...p} />;
const ChevronLeft: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowLeft01Icon} {...p} />;
const Loader2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Loading02Icon} {...p} />;
const FileText: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={File01Icon} {...p} />;
const Trash2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Delete02Icon} {...p} />;
const Save: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={SaveIcon} {...p} />;
const Download: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Download01Icon} {...p} />;
const History: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Clock01Icon} {...p} />;
const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Cancel01Icon} {...p} />;
const Edit: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PencilEdit01Icon} {...p} />;
const MessageSquare: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Message01Icon} {...p} />;
const Volume2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={VolumeHighIcon} {...p} />;
const VolumeX: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={VolumeOffIcon} {...p} />;
import ExportButton from './ExportButton';
import AIAssistantPanel from './AIAssistantPanel';
// Curriculum data is loaded on demand by CurriculumAlignmentFields
import CurriculumReferences from './CurriculumReferences';
import CurriculumAlignmentFields from './ui/CurriculumAlignmentFields';
import RelatedCurriculumBox from './ui/RelatedCurriculumBox';
import LessonEditor from './LessonEditor';
import { ParsedLesson, parseLessonFromAI, lessonToDisplayText } from '../types/lesson';
import { GeneratorSkeleton } from './ui/GeneratorSkeleton';
import StepProgressBar from './ui/StepProgressBar';
import { HeartbeatLoader } from './ui/HeartbeatLoader';
import { useTTS } from '../hooks/useVoice';
import axios from 'axios';
import { buildLessonPrompt } from '../utils/lessonPromptBuilder';
import { useSettings } from '../contexts/SettingsContext';
import { filterSubjects, filterGrades } from '../data/teacherConstants';
import { TutorialOverlay } from './TutorialOverlay';
import { TutorialButton } from './TutorialButton';
import { tutorials, TUTORIAL_IDS } from '../data/tutorialSteps';
import SmartTextArea from './SmartTextArea';
import SmartInput from './SmartInput';
import { useQueueCancellation } from '../hooks/useQueueCancellation';
import { useOfflineGuard } from '../hooks/useOfflineGuard';

interface LessonPlannerProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
  onOpenCurriculumTab?: (route: string) => void;
  isActive?: boolean;
}

interface LessonPlanHistory {
  id: string;
  title: string;
  timestamp: string;
  formData: FormData;
  generatedPlan: string;
  parsedLesson?: ParsedLesson;
  curriculumMatches?: CurriculumReference[]; // ✅ Related curriculum section
  edit_count?: number;
}

interface Draft {
  id: string;
  title: string;
  timestamp: string;
  plannerType: string;
  formData: FormData;
  step?: number;
  curriculumMatches?: CurriculumReference[];
}

interface CurriculumReference {
  id: string;
  displayName: string;
  grade: string;
  subject: string;
  strand: string;
  route: string;
  keywords: string[];
  essentialOutcomes: string[];
  specificOutcomes: string[];
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
  // selectedCurriculum removed
}

const formatLessonText = (text: string, accentColor: string) => {
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
          <div key={`details-grid-${currentIndex++}`} className="grid grid-cols-3 gap-4 mb-6 bg-theme-secondary p-4 rounded-lg">
            {detailsCollected.map((detail, i) => {
              const [label, value] = detail.replace(/\*\*/g, '').split(': ');
              return (
                <div key={i} className="text-sm">
                  <span className="font-semibold text-theme-muted">{label}:</span>
                  <span className="ml-2 text-theme-heading">{value}</span>
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
        <h2 key={`section-${currentIndex++}`} className="text-xl font-bold mt-8 mb-4 pb-2" style={{ color: `${accentColor}dd`, borderBottom: `2px solid ${accentColor}33` }}>
          {title}
        </h2>
      );
      return;
    }

    // Field labels (start with ** but don't end with **)
    if (trimmed.match(/^\*\*[^*]+:\*\*/) || trimmed.match(/^\*\*[^*]+:$/)) {
      const title = trimmed.replace(/^\*\*/, '').replace(/\*\*$/, '').replace(/:$/, '');
      elements.push(
        <h3 key={`field-${currentIndex++}`} className="text-lg font-semibold mt-6 mb-2" style={{ color: `${accentColor}cc` }}>
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
          <span className="mr-2 mt-1.5 text-xs" style={{ color: `${accentColor}66` }}>▸</span>
          <span className="text-theme-muted leading-relaxed text-sm">{content}</span>
        </div>
      );
      return;
    }

    // Regular bullet points
    if (trimmed.match(/^\s*\*\s+/) && !trimmed.startsWith('**')) {
      const content = trimmed.replace(/^\s*\*\s+/, '');
      elements.push(
        <div key={`bullet-${currentIndex++}`} className="mb-2 flex items-start">
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
        <div key={`numbered-${currentIndex++}`} className="mb-3 flex items-start">
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

const LessonPlanner: React.FC<LessonPlannerProps> = ({ tabId, savedData, onDataChange, onOpenCurriculumTab }) => {
  // Per-tab localStorage key
  const LOCAL_STORAGE_KEY = `lesson_state_${tabId}`;
  const triggerCheck = useAchievementTrigger();

  // Curriculum data is loaded per grade+subject via CurriculumAlignmentFields
  const { settings, markTutorialComplete, isTutorialCompleted } = useSettings();
  const tabColor = settings.tabColors['lesson-planner'];
  const [showTutorial, setShowTutorial] = useState(false);

  // TTS for reading lesson plans aloud
  const tts = useTTS();


  // WebSocketContext API and streaming state logic
  const ENDPOINT = '/ws/lesson-plan';
  const { getConnection, getStreamingContent, getIsStreaming, clearStreaming, subscribe } = useWebSocket();
  const { enqueue, queueEnabled } = useQueue();

  const streamingPlan = getStreamingContent(tabId, ENDPOINT);
  // Per-tab local loading state
  const [localLoadingMap, setLocalLoadingMap] = useState<{ [tabId: string]: boolean }>({});
  useQueueCancellation(tabId, ENDPOINT, setLocalLoadingMap);
  const { guardOffline } = useOfflineGuard();
  const loading = !!localLoadingMap[tabId] || getIsStreaming(tabId, ENDPOINT);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [lessonPlanHistories, setLessonPlanHistories] = useState<LessonPlanHistory[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draftsExpanded, setDraftsExpanded] = useState(true);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isEditing, setIsEditing] = useState(false);
  const [parsedLesson, setParsedLesson] = useState<ParsedLesson | null>(() => {
    // First check savedData (for resource manager view/edit)
    if (savedData?.parsedLesson && typeof savedData.parsedLesson === 'object') {
      return savedData.parsedLesson;
    }
    return null;
  });
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [curriculumMatches, setCurriculumMatches] = useState<CurriculumReference[]>([]);
  const [loadingCurriculum, setLoadingCurriculum] = useState(false);
  const [useCurriculum, setUseCurriculum] = useState(true);
  const [curriculumReferences, setCurriculumReferences] = useState<CurriculumReference[]>([]);

  // Helper function to get default empty form data
  const getDefaultFormData = (): FormData => ({
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

  // Start with defaults - will be restored from localStorage or savedData
  const [formData, setFormData] = useState<FormData>(() => {
    // First check savedData (for resource manager view/edit)
    if (savedData?.formData && typeof savedData.formData === 'object') {
      return savedData.formData;
    }
    // Then check localStorage
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.formData && typeof parsed.formData === 'object') {
          return parsed.formData;
        }
      }
    } catch (e) {
      console.error('Failed to restore formData:', e);
    }
    return getDefaultFormData();
  });

  const { matchCount, matchedHistories, sortedHistories: sortedLessonHistories } = useHistoryMatching(formData, lessonPlanHistories);

  const [generatedPlan, setGeneratedPlan] = useState<string>(() => {
    // First check savedData (for resource manager view/edit)
    if (savedData?.generatedPlan && typeof savedData.generatedPlan === 'string') {
      return savedData.generatedPlan;
    }
    // Then check localStorage
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        return parsed.generatedPlan || '';
      }
    } catch (e) {
      console.error('Failed to restore plan:', e);
    }
    return '';
  });
  
  const [step, setStep] = useState<number>(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        return parsed.step || 1;
      }
    } catch (e) {
      console.error('Failed to restore step:', e);
    }
    return 1;
  });

  // ✅ ADDED: Restore state from localStorage when switching tabs
  useEffect(() => {
    const LOCAL_STORAGE_KEY = `lesson_state_${tabId}`;
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setFormData(parsed.formData || getDefaultFormData());
        setGeneratedPlan(parsed.generatedPlan || '');
        setParsedLesson(parsed.parsedLesson || null);
        setCurrentPlanId(parsed.currentPlanId || null);
        setIsEditing(parsed.isEditing || false);
        setCurriculumReferences(parsed.curriculumReferences || []);
        // localLoadingMap intentionally NOT restored — runtime-only state
        setStep(parsed.step || 1);  // ✅ RESTORE STEP STATE
        console.log('[LessonPlanner] State restored from localStorage for tab:', tabId);
      } catch (e) {
        console.error('[LessonPlanner] Failed to restore state:', e);
        setFormData(getDefaultFormData());
        setGeneratedPlan('');
        setParsedLesson(null);
        setCurrentPlanId(null);
        setIsEditing(false);
        setCurriculumReferences([]);
        setLocalLoadingMap({});
        setStep(1);
      }
    }
  }, [tabId]);

  // Step flip animation — two-phase: flip out, swap, flip in
  const [flipPhase, setFlipPhase] = useState<'idle' | 'out' | 'in'>('idle');
  const [displayStep, setDisplayStep] = useState(step);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward');

  // Sync displayStep when step changes directly (init, restore, clear)
  useEffect(() => {
    if (flipPhase === 'idle') setDisplayStep(step);
  }, [step, flipPhase]);

  const handleStepChange = (newStep: number) => {
    if (newStep === step || flipPhase !== 'idle') return;
    setFlipDirection(newStep > step ? 'forward' : 'backward');
    // Phase 1: flip out (animated)
    setFlipPhase('out');
    setTimeout(() => {
      // Swap content and jump to entry position (no transition)
      setStep(newStep);
      setDisplayStep(newStep);
      setFlipPhase('in');
      // Next frame: animate from entry position to idle
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlipPhase('idle');
        });
      });
    }, 300);
  };

  // ✅ ADDED: Save state to localStorage whenever it changes
  useEffect(() => {
    const LOCAL_STORAGE_KEY = `lesson_state_${tabId}`;
    const stateToSave = {
      formData,
      generatedPlan,
      parsedLesson,
      currentPlanId,
      isEditing,
      curriculumReferences,
      // localLoadingMap intentionally NOT persisted — runtime-only state
      step  // ✅ SAVE STEP STATE
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [tabId, formData, generatedPlan, parsedLesson, currentPlanId, isEditing, curriculumReferences, step]);

  // Try to parse lesson when generated (for restored/loaded lessons)
  useEffect(() => {
    if (generatedPlan && !parsedLesson) {
      console.log('Attempting to parse loaded/restored lesson...');
      const parsed = parseLessonFromAI(generatedPlan, formData, curriculumReferences || []);
      if (parsed) {
        console.log('Loaded lesson parsed successfully');
        setParsedLesson(parsed);
      } else {
        console.log('Loaded lesson parsing failed');
      }
    }
  }, [generatedPlan, curriculumReferences]);

  // Auto-fetch curriculum matches when subject, grade, or strand changes
  useEffect(() => {
    const fetchMatchingCurriculum = async () => {
      if (!formData.subject || !formData.gradeLevel || !formData.strand) {
        setCurriculumMatches([]);
        return;
      }

      setLoadingCurriculum(true);
      try {
        const { getCurriculumMatches } = await import('../utils/curriculumHelpers');
        const matches = getCurriculumMatches(formData.subject, formData.gradeLevel, formData.strand);
        setCurriculumMatches(matches.slice(0, 10));
      } catch (error) {
        console.error('Error fetching curriculum matches:', error);
        setCurriculumMatches([]);
      } finally {
        setLoadingCurriculum(false);
      }
    };

    fetchMatchingCurriculum();
  }, [formData.subject, formData.gradeLevel, formData.strand]);

  // Auto-enable editing mode if startInEditMode flag is set
  useEffect(() => {
    if (savedData?.startInEditMode && parsedLesson && !isEditing) {
      console.log('Auto-enabling edit mode for lesson plan');
      setIsEditing(true);
    }
  }, [savedData?.startInEditMode, parsedLesson, isEditing]);

  // Auto-fetch curriculum matches when subject, grade, or strand changes

  // Tutorial auto-show logic
  useEffect(() => {
    if (
      settings.tutorials.tutorialPreferences.autoShowOnFirstUse &&
      !isTutorialCompleted(TUTORIAL_IDS.LESSON_PLANNER)
    ) {
      setShowTutorial(true);
    }
  }, [settings, isTutorialCompleted]);

  const handleTutorialComplete = () => {
    markTutorialComplete(TUTORIAL_IDS.LESSON_PLANNER);
    setShowTutorial(false);
  };


  const allSubjects = [
    'Mathematics',
    'Language Arts',
    'Science',
    'Social Studies'
  ];

  const allGrades = ['K', '1', '2', '3', '4', '5', '6'];

  const gradeMapping = settings.profile.gradeSubjects || {};
  const filterOn = settings.profile.filterContentByProfile;

  const grades = filterGrades(allGrades, gradeMapping, filterOn);

  // When a grade is selected, narrow subjects to what the teacher teaches for that grade
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

  // Enable structured editing mode
  const enableEditing = () => {
    if (parsedLesson) {
      setIsEditing(true);
    } else {
      alert('Cannot edit: Lesson format not recognized. Try regenerating the lesson plan.');
    }
  };

  // Save edited lesson
  const saveLessonEdit = (editedLesson: ParsedLesson) => {
    setParsedLesson(editedLesson);
    const displayText = lessonToDisplayText(editedLesson);
    setGeneratedPlan(displayText);
    setIsEditing(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
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

  // Handler for opening a curriculum card
  const handleOpenCurriculum = (route: string) => {
    if (onOpenCurriculumTab) {
      onOpenCurriculumTab(route);
    } else {
      window.open(route, '_blank', 'noopener,noreferrer');
    }
  };

  const validateStep = (): boolean => {
    const errors: Record<string, boolean> = {};
    if (step === 1) {
      if (!formData.subject) errors.subject = true;
      if (!formData.gradeLevel) errors.gradeLevel = true;
      if (!formData.topic) errors.topic = true;
      if (!formData.strand) errors.strand = true;
      if (!formData.essentialOutcomes) errors.essentialOutcomes = true;
      if (!formData.specificOutcomes) errors.specificOutcomes = true;
      if (!formData.studentCount) errors.studentCount = true;
      if (!formData.duration) errors.duration = true;
    }
    if (step === 2) {
      if (formData.pedagogicalStrategies.length === 0) errors.pedagogicalStrategies = true;
      if (formData.learningStyles.length === 0) errors.learningStyles = true;
      if (!formData.materials) errors.materials = true;
      if (!formData.prerequisiteSkills) errors.prerequisiteSkills = true;
    }
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      setTimeout(() => {
        const firstError = document.querySelector('[data-validation-error="true"]');
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
    return Object.keys(errors).length === 0;
  };

  // Persist to localStorage on every change
  useEffect(() => {
    const stateToSave = {
      formData,
      generatedPlan,
      parsedLesson,
      currentPlanId,
      step,
      curriculumReferences
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [formData, generatedPlan, parsedLesson, currentPlanId, step, curriculumReferences]);

  // Also notify parent (for backward compatibility)
  useEffect(() => {
    onDataChange({
      formData,
      generatedPlan,
      streamingPlan,
      step,
      parsedLesson
    });
  }, [formData, generatedPlan, streamingPlan, step, parsedLesson]);

  // Establish WebSocket connection on mount
  useEffect(() => {
    getConnection(tabId, ENDPOINT);
  }, [tabId]);

  // Subscribe to streaming updates for re-renders
  useEffect(() => {
    const unsubscribe = subscribe(tabId, ENDPOINT, () => {
      // This triggers re-render when streaming updates
    });
    return unsubscribe;
  }, [tabId, subscribe]);

  // Finalization effect - runs when streaming completes
  const isStreaming = getIsStreaming(tabId, ENDPOINT);
  useEffect(() => {
    if (streamingPlan && !isStreaming) {
      setGeneratedPlan(streamingPlan);
      const parsed = parseLessonFromAI(streamingPlan, formData, curriculumReferences);
      if (parsed) setParsedLesson(parsed);
      clearStreaming(tabId, ENDPOINT);
      setLocalLoadingMap(prev => {
        const newMap = { ...prev };
        delete newMap[tabId];
        return newMap;
      });
    }
  }, [streamingPlan, curriculumReferences, isStreaming, tabId, ENDPOINT, clearStreaming, formData]);

  const generateLessonPlan = () => {
    if (guardOffline()) return;
    const refs = useCurriculum ? curriculumMatches : [];
    setCurriculumReferences(refs);
    const prompt = buildLessonPrompt(formData, refs);

    if (queueEnabled) {
      enqueue({
        label: `Lesson Plan - ${formData.topic || formData.subject}`,
        toolType: 'Lesson Plan',
        tabId,
        endpoint: ENDPOINT,
        prompt,
        generationMode: settings.generationMode,
        extraMessageData: { formData },
      });
      setLocalLoadingMap(prev => ({ ...prev, [tabId]: true }));
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
        formData,
        generationMode: settings.generationMode,
      }));
    } catch (error) {
      console.error('Failed to send lesson plan request:', error);
    }
  };

  const loadLessonPlanHistories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/lesson-plan-history');
      setLessonPlanHistories(response.data);
    } catch (error) {
      console.error('Failed to load lesson plan histories:', error);
    }
  };

  const saveLessonPlan = async () => {
    if (!generatedPlan && !parsedLesson) {
      alert('No lesson plan to save');
      return;
    }

    setSaveStatus('saving');
    try {
      // Build a proper title with fallbacks
      const title = formData.topic?.trim()
        ? `${formData.subject || 'General'} - ${formData.topic} (Grade ${formData.gradeLevel || 'Unknown'})`
        : `Lesson Plan - ${formData.subject || 'General'} (Grade ${formData.gradeLevel || 'Unknown'})`;
      
      // Track edit count: increment if re-saving an existing plan
      let editCount = 1;
      if (currentPlanId) {
        const existing = lessonPlanHistories.find(h => h.id === currentPlanId);
        editCount = (existing?.edit_count ?? 1) + 1;
      }

      const planData = {
        id: currentPlanId || `plan_${Date.now()}`,
        title: title,
        timestamp: new Date().toISOString(),
        formData: formData,
        generatedPlan: generatedPlan,  // ✅ Save original clean text
        parsedLesson: parsedLesson || undefined,
        curriculumMatches: curriculumMatches, // ✅ Save related curriculum section
        edit_count: editCount,
      };

      await axios.post('http://localhost:8000/api/lesson-plan-history', planData);
      await loadLessonPlanHistories();
      setSaveStatus('saved');
      triggerCheck();
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save lesson plan:', error);
      alert('Failed to save lesson plan');
      setSaveStatus('idle');
    }
  };

  const loadLessonPlanHistory = (history: LessonPlanHistory) => {
    setFormData(history.formData);
    setGeneratedPlan(history.generatedPlan);
    setParsedLesson(history.parsedLesson || null);
    setCurriculumMatches(history.curriculumMatches || []); // ✅ Restore related curriculum
    setCurrentPlanId(history.id);
    setHistoryOpen(false);
  };

  const deleteLessonPlanHistory = async (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this lesson plan?')) return;
    
    try {
      await axios.delete(`http://localhost:8000/api/lesson-plan-history/${planId}`);
      await loadLessonPlanHistories();
      
      if (currentPlanId === planId) {
        clearForm();
      }
    } catch (error) {
      console.error('Failed to delete lesson plan:', error);
    }
  };

  const loadDrafts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/lesson-drafts?plannerType=lesson');
      setDrafts(response.data);
    } catch (error) {
      console.error('Failed to load drafts:', error);
    }
  };

  const loadDraft = (draft: Draft) => {
    setFormData(draft.formData);
    setGeneratedPlan('');
    setParsedLesson(null);
    setCurrentPlanId(null);
    setCurriculumMatches(draft.curriculumMatches || []);
    setStep(draft.step || 1);
    setHistoryOpen(false);
    // Delete the draft since it's now loaded into the form
    axios.delete(`http://localhost:8000/api/lesson-drafts/${draft.id}`).then(() => loadDrafts());
  };

  const deleteDraft = async (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:8000/api/lesson-drafts/${draftId}`);
      await loadDrafts();
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  useEffect(() => {
    loadLessonPlanHistories();
    loadDrafts();
  }, []);

  const clearForm = () => {
    setFormData(getDefaultFormData());
    setGeneratedPlan('');
    setParsedLesson(null);
    setCurrentPlanId(null);
    setStep(1);
    setIsEditing(false);
    setCurriculumReferences([]);

    // Clear localStorage for this tab
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

 
  return (
    <div className="flex h-full tab-content-bg relative" data-tutorial="lesson-planner-welcome">
      <div className="flex-1 flex flex-col tab-content-bg">
        {(generatedPlan || streamingPlan || loading) ? (
          <>
            {isEditing && parsedLesson ? (
              // Show Structured Editor
              <LessonEditor
                lesson={parsedLesson}
                onSave={saveLessonEdit}
                onCancel={cancelEditing}
              />
            ) : loading && !streamingPlan && !generatedPlan ? (
              <GeneratorSkeleton accentColor={tabColor} type="lesson" />
            ) : (
              // Show generated lesson plan (existing display code)
              <>
                <div className="border-b border-theme p-4 flex items-center justify-between flex-shrink-0">
                  <div>
                    <h2 className="text-xl font-semibold text-theme-heading">
                      {loading ? 'Generating Lesson Plan...' : 'Generated Lesson Plan'}
                    </h2>
                    <p className="text-sm text-theme-hint">{formData.subject} - Grade {formData.gradeLevel}</p>
                  </div>
                  {!loading && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={enableEditing}
                        disabled={!parsedLesson}
                        className="flex items-center px-3.5 py-1.5 text-[13.5px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-theme-tertiary disabled:cursor-not-allowed"
                        title={!parsedLesson ? "Lesson format not recognized" : "Edit lesson"}
                      >
                        <Edit className="w-3.5 h-3.5 mr-1.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => setAssistantOpen(true)}
                        className="flex items-center px-3.5 py-1.5 text-[13.5px] bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition shadow-lg"
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                        Assistant
                      </button>
                      <button
                        onClick={saveLessonPlan}
                        disabled={saveStatus === 'saving'}
                        className="flex items-center px-3.5 py-1.5 text-[13.5px] bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-theme-tertiary"
                      >
                        {saveStatus === 'saving' ? (
                          <>
                            <HeartbeatLoader className="w-3.5 h-3.5 mr-1.5" />
                            Saving...
                          </>
                        ) : saveStatus === 'saved' ? (
                          <>
                            <Save className="w-3.5 h-3.5 mr-1.5" />
                            Saved!
                          </>
                        ) : (
                          <>
                            <Save className="w-3.5 h-3.5 mr-1.5" />
                            Save Plan
                          </>
                        )}
                      </button>
                      {/* --- HTML Export Enhancement Start --- */}
                      <ExportButton
                        dataType="plan"
                        data={{
                          content: generatedPlan,
                          formData: formData,
                          accentColor: tabColor,
                          curriculumReferences: parsedLesson?.curriculumReferences || [],
                          // Add rawHtml for PDF export
                          rawHtml: (() => {
                            // Try to get the lesson plan area HTML
                            const el = document.getElementById('lesson-plan-html-export');
                            if (!el) return '';
                            // Clone node to avoid React artifacts
                            const clone = el.cloneNode(true);
                            // Inline styles (optional: for more accurate rendering)
                            // For now, just outerHTML
                            return (clone as HTMLElement).outerHTML;
                          })()
                        }}
                        filename={`lesson-plan-${formData.topic.replace(/\s+/g, '-').toLowerCase()}`}
                        className="ml-2 !px-3.5 !py-1.5 !text-[13.5px]"
                      />
                      {/* --- HTML Export Enhancement End --- */}
                      <button
                        onClick={() => setHistoryOpen(!historyOpen)}
                        className="relative p-2 rounded-lg hover:bg-theme-hover transition"
                        title="Lesson Plan History"
                      >
                        <History className="w-5 h-5 text-theme-muted" />
                        {matchCount > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold leading-none px-1">{matchCount}</span>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setGeneratedPlan('');
                          clearStreaming(tabId, ENDPOINT);
                          setParsedLesson(null);
                          setIsEditing(false);
                        }}
                        className="px-3.5 py-1.5 text-[13.5px] bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                      >
                        Create New Plan
                      </button>
                    </div>
                  )}
                </div>
            
            <div className="flex-1 overflow-y-auto bg-theme-surface p-6">
              {/* Modern Header Card */}
              {(streamingPlan || generatedPlan) && !isEditing && (
                <div className="mb-8">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg">
                    {/* Background gradient */}
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${tabColor}, ${tabColor}dd, ${tabColor}bb)` }}></div>
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${tabColor}e6, ${tabColor}cc)` }}></div>
                    
                    {/* Content */}
                    <div className="relative px-8 py-8">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Subject & Grade badges */}
                          <div className="flex items-center gap-2 mb-4">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                              <span className="text-white text-sm font-medium">{formData.subject}</span>
                            </div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                              <span className="text-white text-sm font-medium">Grade {formData.gradeLevel}</span>
                            </div>
                          </div>
                          
                          {/* Main title */}
                          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
                            {formData.topic ? `Exploring ${formData.topic}` : 'Lesson Plan'}
                          </h1>
                          
                          {/* Subtitle details */}
                          <div className="flex flex-wrap items-center gap-4 text-blue-100">
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
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-blue-200 rounded-full mr-2"></div>
                              <span className="text-sm">Generated on {new Date().toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Loading indicator */}
                        {loading && (
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                            <div className="flex items-center text-white">
                              <HeartbeatLoader className="w-5 h-5 mr-3" />
                              <div>
                                <div className="text-sm font-medium">Generating...</div>
                                <div className="text-xs text-blue-100">Lesson plan</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  </div>
                </div>
              )}

                {/* Read Aloud Button */}
                {(generatedPlan || streamingPlan) && !loading && (
                  <div className="flex justify-end mb-2">
                    <button
                      onClick={() => tts.toggle(streamingPlan || generatedPlan)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        tts.isSpeaking
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
                          : 'bg-theme-tertiary text-theme-label hover:bg-theme-hover border border-theme'
                      }`}
                      title={tts.isSpeaking ? 'Stop reading' : 'Read lesson plan aloud'}
                    >
                      {tts.isSpeaking
                        ? <><VolumeX className="w-3.5 h-3.5" /> Stop Reading</>
                        : <><Volume2 className="w-3.5 h-3.5" /> Read Aloud</>}
                    </button>
                  </div>
                )}

                {/* Formatted content */}
                {/* Add an id for HTML export */}
                <div id="lesson-plan-html-export" className="prose prose-lg max-w-none">
                  <div className="space-y-1">
                    {formatLessonText(streamingPlan || generatedPlan, tabColor)}
                    {loading && streamingPlan && (
                      <span className="inline-flex items-center ml-1">
                        <span className="w-0.5 h-5 animate-pulse rounded-full" style={{ backgroundColor: tabColor }}></span>
                      </span>
                    )}
                  </div>
                  {/* Curriculum References */}
                  {(parsedLesson?.curriculumReferences || curriculumMatches.length > 0) && (
                    <CurriculumReferences
                      references={parsedLesson?.curriculumReferences || curriculumMatches}
                      onOpenCurriculum={handleOpenCurriculum}
                    />
                  )}
                </div>
                  


              {/* Loading progress at bottom */}
              {loading && (
                <div className="mt-8 rounded-xl p-6 border" style={{ background: `linear-gradient(to right, ${tabColor}0d, ${tabColor}1a)`, borderColor: `${tabColor}33` }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium" style={{ color: `${tabColor}dd` }}>Creating your lesson plan</div>
                      <div className="text-sm mt-1" style={{ color: `${tabColor}99` }}>Tailored for your specific requirements</div>
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
                <h2 className="text-xl font-semibold text-theme-heading">Lesson Plan Generator</h2>
                <p className="text-sm text-theme-hint">Fill in the details to generate a personalized D-OHPC lesson plan</p>
              </div>
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="relative p-2 rounded-lg hover:bg-theme-hover transition"
                title="Lesson Plan History"
              >
                <History className="w-5 h-5 text-theme-muted" />
                {matchCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold leading-none px-1">{matchCount}</span>
                )}
              </button>
            </div>

            {/* Progress Steps */}
            <StepProgressBar
              steps={['Basic Info', 'Teaching Strategy', 'Additional Details']}
              currentStep={step}
            />

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6" style={{ height: 'calc(100vh - 200px)', perspective: '1200px' }}>
              <div
                className="max-w-4xl mx-auto"
                style={{
                  transformStyle: 'preserve-3d',
                  transition: flipPhase === 'in'
                    ? 'none'
                    : 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.3s ease',
                  transform: flipPhase === 'out'
                    ? `rotateY(${flipDirection === 'forward' ? '-90' : '90'}deg) scale(0.95)`
                    : flipPhase === 'in'
                    ? `rotateY(${flipDirection === 'forward' ? '90' : '-90'}deg) scale(0.95)`
                    : 'rotateY(0deg) scale(1)',
                  opacity: flipPhase === 'out' || flipPhase === 'in' ? 0 : 1,
                }}
              >
                {/* Step 1: Basic Information */}
                {displayStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-theme-heading">Basic Information</h3>

                    {/* Two-column layout for dropdowns and curriculum box */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Left column - Form fields */}
                      <div className="space-y-4">
                        <div data-tutorial="lesson-planner-basic-info">
                          <label className="block text-sm font-medium text-theme-label mb-2">
                            Grade Level <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.gradeLevel}
                            onChange={(e) => {
                              const newGrade = e.target.value;
                              handleInputChange('gradeLevel', newGrade);
                              handleInputChange('essentialOutcomes', '');
                              handleInputChange('specificOutcomes', '');
                              const available = filterSubjects(allSubjects, gradeMapping, filterOn, newGrade.toLowerCase() || undefined);
                              if (formData.subject && !available.includes(formData.subject)) {
                                handleInputChange('subject', '');
                              }
                            }}
                            data-validation-error={validationErrors.gradeLevel ? 'true' : undefined}
                            className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent ${validationErrors.gradeLevel ? 'validation-error' : ''}`}
                            style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                          >
                            <option value="">Select a grade</option>
                            {grades.map(grade => (
                              <option key={grade} value={grade}>Grade {grade}</option>
                            ))}
                          </select>
                        </div>

                        <div>
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
                            data-validation-error={validationErrors.subject ? 'true' : undefined}
                            className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent ${validationErrors.subject ? 'validation-error' : ''}`}
                            style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                          >
                            <option value="">Select a subject</option>
                            {subjects.map(subject => (
                              <option key={subject} value={subject}>{subject}</option>
                            ))}
                          </select>
                        </div>

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
                      </div>

                      {/* Right column - Related Curriculum Box */}
                      <RelatedCurriculumBox
                        subject={formData.subject}
                        gradeLevel={formData.gradeLevel}
                        strand={formData.strand}
                        useCurriculum={useCurriculum}
                        essentialOutcomes={formData.essentialOutcomes}
                        specificOutcomes={formData.specificOutcomes}
                        onOpenCurriculum={handleOpenCurriculum}
                      />
                    </div>

                    {/* Rest of the form fields below (full width) */}
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        Topic <span className="text-red-500">*</span>
                      </label>
                      <SmartInput
                        value={formData.topic}
                        onChange={(val) => handleInputChange('topic', val)}
                        data-validation-error={validationErrors.topic ? 'true' : undefined}
                        className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent ${validationErrors.topic ? 'validation-error' : ''}`}
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                        placeholder="e.g., Water Cycle"
                      />
                    </div>
                    {/* ELO/SCO fields are now handled by CurriculumAlignmentFields above */}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-theme-label mb-2">
                          Student Count <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.studentCount}
                          onChange={(e) => handleInputChange('studentCount', e.target.value)}
                          data-validation-error={validationErrors.studentCount ? 'true' : undefined}
                          className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent ${validationErrors.studentCount ? 'validation-error' : ''}`}
                          style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                          placeholder="e.g., 20"
                        />
                      </div>

                      <div data-tutorial="lesson-planner-duration">
                        <label className="block text-sm font-medium text-theme-label mb-2">
                          Duration (minutes) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.duration}
                          onChange={(e) => handleInputChange('duration', e.target.value)}
                          data-validation-error={validationErrors.duration ? 'true' : undefined}
                          className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent ${validationErrors.duration ? 'validation-error' : ''}`}
                          style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                          placeholder="e.g., 50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Teaching Strategy */}
                {displayStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-theme-heading">Teaching Strategy</h3>

                    <div data-tutorial="lesson-planner-activities">
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        Pedagogical Strategies <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs text-theme-hint mb-3">
                        Select all teaching strategies that will guide the structure and activities of your lesson plan
                      </p>
                      <div data-validation-error={validationErrors.pedagogicalStrategies ? 'true' : undefined} className={`grid grid-cols-2 gap-2 p-2 rounded-lg ${validationErrors.pedagogicalStrategies ? 'validation-error' : ''}`}>
                        {pedagogicalStrategiesOptions.map(strategy => (
                          <label key={strategy} className="flex items-center space-x-2 p-2 rounded hover:bg-theme-subtle cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.pedagogicalStrategies.includes(strategy)}
                              onChange={() => handleCheckboxChange('pedagogicalStrategies', strategy)}
                              className="w-4 h-4 rounded focus:ring-2"
                              style={{ accentColor: tabColor, '--tw-ring-color': tabColor } as React.CSSProperties}
                            />
                            <span className="text-sm text-theme-label">{strategy}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        Learning Styles <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs text-theme-hint mb-3">
                        Select learning styles that best describe how your students prefer to learn
                      </p>
                      <div data-validation-error={validationErrors.learningStyles ? 'true' : undefined} className={`grid grid-cols-3 gap-2 p-2 rounded-lg ${validationErrors.learningStyles ? 'validation-error' : ''}`}>
                        {learningStylesOptions.map(style => (
                          <label key={style} className="flex items-center space-x-2 p-2 rounded hover:bg-theme-subtle cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.learningStyles.includes(style)}
                              onChange={() => handleCheckboxChange('learningStyles', style)}
                              className="w-4 h-4 rounded focus:ring-2"
                              style={{ accentColor: tabColor, '--tw-ring-color': tabColor } as React.CSSProperties}
                            />
                            <span className="text-sm text-theme-label">{style}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        Learning Preferences
                      </label>
                      <p className="text-xs text-theme-hint mb-3">
                        Select how your students prefer to work and learn
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {learningPreferencesOptions.map(pref => (
                          <label key={pref} className="flex items-center space-x-2 p-2 rounded hover:bg-theme-subtle cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.learningPreferences.includes(pref)}
                              onChange={() => handleCheckboxChange('learningPreferences', pref)}
                              className="w-4 h-4 rounded focus:ring-2"
                              style={{ accentColor: tabColor, '--tw-ring-color': tabColor } as React.CSSProperties}
                            />
                            <span className="text-sm text-theme-label">{pref}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        Multiple Intelligences
                      </label>
                      <p className="text-xs text-theme-hint mb-3">
                        Select the types of intelligence your students demonstrate
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {multipleIntelligencesOptions.map(intel => (
                          <label key={intel} className="flex items-center space-x-2 p-2 rounded hover:bg-theme-subtle cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.multipleIntelligences.includes(intel)}
                              onChange={() => handleCheckboxChange('multipleIntelligences', intel)}
                              className="w-4 h-4 rounded focus:ring-2"
                              style={{ accentColor: tabColor, '--tw-ring-color': tabColor } as React.CSSProperties}
                            />
                            <span className="text-sm text-theme-label">{intel}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        Custom Learning Styles (Optional)
                      </label>
                      <SmartTextArea
                        value={formData.customLearningStyles}
                        onChange={(val) => handleInputChange('customLearningStyles', val)}
                        rows={2}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                        placeholder="Add any specific learning styles or preferences not covered above"
                      />
                    </div>

                    <div data-tutorial="lesson-planner-materials">
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        Materials <span className="text-red-500">*</span>
                      </label>
                      <SmartTextArea
                        value={formData.materials}
                        onChange={(val) => handleInputChange('materials', val)}
                        rows={3}
                        data-validation-error={validationErrors.materials ? 'true' : undefined}
                        className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent ${validationErrors.materials ? 'validation-error' : ''}`}
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                        placeholder="Resources needed for the lesson (e.g., chart paper, colored markers, projector)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        Prerequisite Skills <span className="text-red-500">*</span>
                      </label>
                      <SmartTextArea
                        value={formData.prerequisiteSkills}
                        onChange={(val) => handleInputChange('prerequisiteSkills', val)}
                        rows={3}
                        data-validation-error={validationErrors.prerequisiteSkills ? 'true' : undefined}
                        className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent ${validationErrors.prerequisiteSkills ? 'validation-error' : ''}`}
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                        placeholder="Skills students should already have before this lesson"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Additional Details */}
                {displayStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-theme-heading">Additional Details</h3>

                    <div>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.specialNeeds}
                          onChange={(e) => handleInputChange('specialNeeds', e.target.checked)}
                          className="w-4 h-4 rounded focus:ring-2"
                          style={{ accentColor: tabColor, '--tw-ring-color': tabColor } as React.CSSProperties}
                        />
                        <span className="text-sm font-medium text-theme-label">Students with Special Needs</span>
                      </label>
                    </div>

                    {formData.specialNeeds && (
                      <div>
                        <label className="block text-sm font-medium text-theme-label mb-2">
                          Special Needs Details
                        </label>
                        <SmartTextArea
                          value={formData.specialNeedsDetails}
                          onChange={(val) => handleInputChange('specialNeedsDetails', val)}
                          rows={3}
                          className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent"
                          style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                          placeholder="Describe specific accommodations or modifications needed"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        Additional Instructions
                      </label>
                      <SmartTextArea
                        value={formData.additionalInstructions}
                        onChange={(val) => handleInputChange('additionalInstructions', val)}
                        rows={4}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Any additional context or specific requirements for the lesson plan"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        Reference URL
                      </label>
                      <input
                        type="url"
                        value={formData.referenceUrl}
                        onChange={(e) => handleInputChange('referenceUrl', e.target.value)}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                        placeholder="https://example.com/resource"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="border-t border-theme p-4 bg-theme-secondary">
              <div className="max-w-3xl mx-auto flex items-center justify-between">
                <div>
                  {step > 1 && (
                    <button
                      onClick={() => handleStepChange(step - 1)}
                      className="flex items-center px-4 py-2 text-theme-label hover:bg-theme-hover rounded-lg transition"
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
                      onClick={() => { if (validateStep()) handleStepChange(step + 1); }}
                      className="flex items-center px-6 py-2 text-white rounded-lg transition"
                      style={{ backgroundColor: tabColor }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                    >
                      Next
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </button>
                  ) : (
                    <button
                      onClick={generateLessonPlan}
                      disabled={loading}
                      className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-theme-tertiary disabled:cursor-not-allowed"
                      data-tutorial="lesson-planner-generate"
                    >
                      {loading ? (
                        <>
                          <HeartbeatLoader className="w-5 h-5 mr-2" />
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
          </>
        )}
      </div>

      {/* History Panel - Always available */}
      <div
        className={`border-l border-theme bg-theme-secondary transition-all duration-300 overflow-hidden ${
          historyOpen ? 'w-80' : 'w-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-theme-heading">Saved Plans</h3>
            <button
              onClick={() => setHistoryOpen(false)}
              className="p-1 rounded hover:bg-theme-hover transition"
            >
              <X className="w-5 h-5 text-theme-muted" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
            {/* Drafts Section */}
            {drafts.length > 0 && (
              <div className="mb-3">
                <button
                  onClick={() => setDraftsExpanded(!draftsExpanded)}
                  className="flex items-center gap-2 w-full text-left text-sm font-medium text-amber-400 mb-2 hover:text-amber-300 transition"
                >
                  <span className="text-xs">{draftsExpanded ? '\u25BC' : '\u25B6'}</span>
                  Drafts ({drafts.length})
                </button>
                {draftsExpanded && (
                  <div className="space-y-2">
                    {drafts.map((draft) => (
                      <div
                        key={draft.id}
                        onClick={() => loadDraft(draft)}
                        className="p-3 rounded-lg cursor-pointer transition group hover:bg-theme-subtle bg-theme-tertiary border border-amber-500/30 border-dashed"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 uppercase">Draft</span>
                              <p className="text-sm font-medium text-theme-heading line-clamp-1">
                                {draft.title}
                              </p>
                            </div>
                            <p className="text-xs text-theme-hint mt-1">
                              {new Date(draft.timestamp).toLocaleDateString()} {new Date(draft.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => deleteDraft(draft.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition"
                            title="Delete draft"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-b border-theme my-3" />
              </div>
            )}

            {/* Saved Plans */}
            {lessonPlanHistories.length === 0 && drafts.length === 0 ? (
              <div className="text-center text-theme-hint mt-8">
                <FileText className="w-12 h-12 mx-auto mb-2 text-theme-hint" />
                <p className="text-sm">No saved plans yet</p>
              </div>
            ) : (
              <>
                {matchCount > 0 && (
                  <div className="mb-2">
                    <span className="text-xs font-medium text-blue-400">Matching ({matchCount})</span>
                  </div>
                )}
                {(matchCount > 0 ? sortedLessonHistories : lessonPlanHistories).map((history, idx) => (
                  <React.Fragment key={history.id}>
                    {matchCount > 0 && idx === matchedHistories.length && matchedHistories.length > 0 && (
                      <div className="border-b border-theme my-3">
                        <span className="text-xs text-theme-muted">Other</span>
                      </div>
                    )}
                    <div
                      onClick={() => loadLessonPlanHistory(history)}
                      className={`p-3 rounded-lg cursor-pointer transition group hover:bg-theme-subtle ${
                        currentPlanId === history.id ? 'bg-theme-surface shadow-sm' : 'bg-theme-tertiary'
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
                          onClick={(e) => deleteLessonPlanHistory(history.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition"
                          title="Delete plan"
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

      {/* AI Assistant Panel */}
      <AIAssistantPanel
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        content={generatedPlan}
        contentType="lesson"
        onContentUpdate={(newContent) => {
          setGeneratedPlan(newContent);
          const parsed = parseLessonFromAI(newContent, formData, curriculumReferences || []);
          if (parsed) setParsedLesson(parsed);
        }}
      />

      {/* Tutorial Components */}
      <TutorialOverlay
        steps={tutorials[TUTORIAL_IDS.LESSON_PLANNER].steps}
        onComplete={handleTutorialComplete}
        autoStart={showTutorial}
        showFloatingButton={false}
      />

     
      {/* Disable local TutorialButton (handled globally in Dashboard) */}

    </div>
  );
};

export default LessonPlanner;

