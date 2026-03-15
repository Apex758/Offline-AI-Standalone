import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Loader2, Users, Trash2, Save, Download, History, X, Edit, Sparkles } from 'lucide-react';
import ExportButton from './ExportButton';
import AIAssistantPanel from './AIAssistantPanel';
import MultigradeEditor from './MultigradeEditor';
import axios from 'axios';
import { buildMultigradePrompt } from '../utils/multigradePromptBuilder';
import {parseMultigradeFromAI, multigradeToDisplayText, type ParsedMultigrade} from '../types/multigrade'; 
import { useSettings } from '../contexts/SettingsContext';
import { TutorialOverlay } from './TutorialOverlay';
import StepProgressBar from './ui/StepProgressBar';
import MultigradeAlignmentFields from './ui/MultigradeAlignmentFields';
import RelatedCurriculumBox from './ui/RelatedCurriculumBox';
import { TutorialButton } from './TutorialButton';
import { tutorials, TUTORIAL_IDS } from '../data/tutorialSteps';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useQueue } from '../contexts/QueueContext';
import { GeneratorSkeleton } from './ui/GeneratorSkeleton';
import { HeartbeatLoader } from './ui/HeartbeatLoader';
import SmartTextArea from './SmartTextArea';
import SmartInput from './SmartInput';

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
  parsedPlan?: ParsedMultigrade;  
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
  strand: string;
  essentialOutcomes: string;
  specificOutcomes: string;
}

const formatMultigradeText = (text: string, accentColor: string, isStreaming: boolean = false) => {
  if (!text) return null;

  let cleanText = text;
  
  // ✅ ONLY clean init messages - NEVER remove numbered sections!
  if (cleanText.includes("To change it, set a different value via -sys PROMPT")) {
    cleanText = cleanText.split("To change it, set a different value via -sys PROMPT")[1] || cleanText;
  }

  // Remove initialization noise
  cleanText = cleanText.replace(/llama_model_loader[^\n]*/g, '');
  cleanText = cleanText.replace(/llm_load_print_meta[^\n]*/g, '');
  cleanText = cleanText.replace(/system_info[^\n]*/g, '');
  // Remove AI-generated metadata at the top (before section 1)
  cleanText = cleanText.replace(/^Lesson Plan:.*$/m, '');
  cleanText = cleanText.replace(/^\*\*Grade Levels?:\*\*.*$/gm, '');
  cleanText = cleanText.replace(/^\*\*Topic:\*\*.*$/gm, '');
  cleanText = cleanText.replace(/^\*\*Duration:\*\*.*$/gm, '');
  cleanText = cleanText.replace(/^\*\*Total Students:\*\*.*$/gm, '');
  cleanText = cleanText.replace(/^\*\*Subject:\*\*.*$/gm, '');

  const lines = cleanText.split('\n');
  const elements: JSX.Element[] = [];
  let currentIndex = 0;

  lines.forEach((line) => {
    const trimmed = line.trim();
    
    if (!trimmed) {
      elements.push(<div key={`space-${currentIndex++}`} className="h-3"></div>);
      return;
    }

    // Main numbered sections (e.g., "1. SHARED LEARNING OBJECTIVES")
    if (trimmed.match(/^\d+\.\s+[A-Z\s]+$/)) {
      const title = trimmed.replace(/^\d+\.\s+/, '');
      elements.push(
        <h2 key={`section-${currentIndex++}`} 
            className="text-2xl font-bold mt-10 mb-6 p-4 rounded-lg text-white"
            style={{ 
              background: `linear-gradient(135deg, ${accentColor}dd, ${accentColor}bb)` 
            }}>
          {trimmed}
        </h2>
      );
      return;
    }

    // Subsection headings (e.g., "A. Opening - WHOLE CLASS (10 minutes)")
    if (trimmed.match(/^[A-Z]\.\s+(.+?)(\s*-\s*[A-Z\s]+)?(\s*\(\d+.*?\))?$/)) {
      elements.push(
        <h3 key={`subsection-${currentIndex++}`}
            className="text-xl font-semibold mt-6 mb-4 p-3 rounded-lg border-l-4"
            style={{ 
              color: `${accentColor}dd`,
              backgroundColor: `${accentColor}0d`,
              borderColor: accentColor
            }}>
          {trimmed}
        </h3>
      );
      return;
    }

    // Grade-specific sections (e.g., "Grade 1:", "Grade K:")
    if (trimmed.match(/^Grade\s+[K0-9]:/i)) {
      elements.push(
        <div key={`grade-${currentIndex++}`}
             className="mt-4 mb-4 p-3 rounded-lg border-l-3"
             style={{ 
               backgroundColor: `${accentColor}08`,
               borderLeft: `3px solid ${accentColor}99`
             }}>
          <h4 className="font-semibold text-lg" style={{ color: `${accentColor}dd` }}>
            {trimmed}
          </h4>
        </div>
      );
      return;
    }

    // Nested bullets (+ or - prefix)
    if (trimmed.match(/^\s*[\+\-]\s+/)) {
      const content = trimmed.replace(/^\s*[\+\-]\s+/, '');
      elements.push(
        <div key={`sub-bullet-${currentIndex++}`} className="flex items-start mb-2 ml-10">
          <span className="mr-3 mt-1.5 font-bold text-sm" style={{ color: `${accentColor}77` }}>▸</span>
          <span className="text-theme-muted leading-relaxed text-[0.95rem]">{content}</span>
        </div>
      );
      return;
    }

    // Bullet points (* prefix)
    if (trimmed.match(/^\s*\*\s+/) && !trimmed.startsWith('**')) {
      const content = trimmed.replace(/^\s*\*\s+/, '');
      elements.push(
        <div key={`bullet-${currentIndex++}`} className="flex items-start mb-2 ml-4">
          <span className="mr-3 mt-1.5 font-bold text-sm" style={{ color: `${accentColor}99` }}>•</span>
          <span className="text-theme-label leading-relaxed">{content}</span>
        </div>
      );
      return;
    }

    // Bold section labels (e.g., "**Materials:**")
    if (trimmed.match(/^\*\*[^*]+:\*\*/) || trimmed.match(/^\*\*[^*]+:$/)) {
      const title = trimmed.replace(/^\*\*/, '').replace(/\*\*$/, '').replace(/:$/, '');
      elements.push(
        <h4 key={`label-${currentIndex++}`} 
            className="text-lg font-semibold mt-5 mb-3"
            style={{ color: `${accentColor}cc` }}>
          {title}:
        </h4>
      );
      return;
    }

    // Bold inline text
    if (trimmed.includes('**')) {
      const parts = trimmed.split(/(\*\*[^*]+\*\*)/g);
      elements.push(
        <p key={`para-${currentIndex++}`} className="text-theme-label leading-relaxed mb-3">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} style={{ color: `${accentColor}cc` }}>{part.slice(2, -2)}</strong>;
            }
            return <span key={i}>{part}</span>;
          })}
        </p>
      );
      return;
    }

    // Regular paragraphs
    if (trimmed.length > 0) {
      elements.push(
        <p key={`text-${currentIndex++}`} className="text-theme-label leading-relaxed mb-3">
          {trimmed}
        </p>
      );
    }
  });

  return <div className="multigrade-content">{elements}</div>;
};

// Parse multigrade plan text content into structured ParsedMultigradePlan format
const parseMultigradeContent = (text: string, formData: FormData): ParsedMultigrade | null => {
  // Transform FormData to match what parseMultigradeFromAI expects
  const multigradeFormData = {
    topic: formData.topic,
    subject: formData.subject,
    gradeLevels: formData.gradeRange.split(/[-,]/).map(g => g.trim()),
    duration: formData.duration,
    totalStudents: formData.totalStudents
  };
  
  return parseMultigradeFromAI(text, multigradeFormData);
};

// Parse grade range string into individual grade level codes (e.g., "Grade 3 - Grade 5" -> ["3", "4", "5"])
function parseGradeLevels(gradeRange: string): string[] {
  if (!gradeRange) return [];
  const parts = gradeRange.split('-').map(p => p.trim());
  if (parts.length !== 2) return [];
  const normalize = (s: string) => s.replace(/^Kindergarten$/i, 'K').replace(/^Grade\s+/i, '');
  const start = normalize(parts[0]);
  const end = normalize(parts[1]);
  const all = ['K', '1', '2', '3', '4', '5', '6'];
  const startIdx = all.indexOf(start);
  const endIdx = all.indexOf(end);
  if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) return [start, end].filter(Boolean);
  return all.slice(startIdx, endIdx + 1);
}

const MultigradePlanner: React.FC<MultigradePlannerProps> = ({ tabId, savedData, onDataChange }) => {
  // Per-tab localStorage key
  const LOCAL_STORAGE_KEY = `multigrade_state_${tabId}`;
  const ENDPOINT = '/ws/multigrade';

  const { settings, markTutorialComplete, isTutorialCompleted } = useSettings();
  const tabColor = settings.tabColors['multigrade-planner'];
  const [showTutorial, setShowTutorial] = useState(false);

  // WebSocketContext integration
  const { getConnection, getStreamingContent, getIsStreaming, clearStreaming, subscribe } = useWebSocket();
  const { enqueue, queueEnabled } = useQueue();

  // Get streaming state from context
  const streamingPlan = getStreamingContent(tabId, ENDPOINT);
  // Per-tab local loading state
  const [localLoadingMap, setLocalLoadingMap] = useState<{ [tabId: string]: boolean }>({});
  const loading = !!localLoadingMap[tabId] || getIsStreaming(tabId, ENDPOINT);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [multigradeHistories, setMultigradeHistories] = useState<MultigradeHistory[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [step, setStep] = useState<number>(1);
  const [useCurriculum, setUseCurriculum] = useState(true);
  const [flipPhase, setFlipPhase] = useState<'idle' | 'out' | 'in'>('idle');
  const [displayStep, setDisplayStep] = useState(step);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward');

  useEffect(() => {
    if (flipPhase === 'idle') setDisplayStep(step);
  }, [step, flipPhase]);

  const handleStepChange = (newStep: number) => {
    if (newStep === step || flipPhase !== 'idle') return;
    setFlipDirection(newStep > step ? 'forward' : 'backward');
    setFlipPhase('out');
    setTimeout(() => {
      setStep(newStep);
      setDisplayStep(newStep);
      setFlipPhase('in');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlipPhase('idle');
        });
      });
    }, 300);
  };

  // State for structured editing
  const [isEditing, setIsEditing] = useState(false);
  const [parsedPlan, setParsedPlan] = useState<ParsedMultigrade | null>(() => {
    // First check savedData (for resource manager view/edit)
    if (savedData?.parsedPlan && typeof savedData.parsedPlan === 'object') {
      return savedData.parsedPlan;
    }
    return null;
  });
  const [assistantOpen, setAssistantOpen] = useState(false);

  // Add timeout handling for stuck generations
  const [generationTimeout, setGenerationTimeout] = useState<NodeJS.Timeout | null>(null);

  // Helper function to get default empty form data
  const getDefaultFormData = (): FormData => ({
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
    differentiationNotes: '',
    strand: '',
    essentialOutcomes: '',
    specificOutcomes: ''
  });

  // Start with defaults - will be restored from localStorage or savedData
  const [formData, setFormData] = useState<FormData>(() => {
    // First check savedData (for resource manager view/edit)
    if (savedData?.formData && typeof savedData.formData === 'object') {
      return savedData.formData;
    }
    return getDefaultFormData();
  });
  const [generatedPlan, setGeneratedPlan] = useState<string>(() => {
    // First check savedData (for resource manager view/edit)
    if (savedData?.generatedPlan && typeof savedData.generatedPlan === 'string') {
      return savedData.generatedPlan;
    }
    return '';
  });

  // Try to parse plan when generated (for restored/loaded plans)
  useEffect(() => {
    if (generatedPlan && !parsedPlan) {
      console.log('Attempting to parse loaded/restored multigrade plan...');
      const parsed = parseMultigradeContent(generatedPlan, formData);
      if (parsed) {
        console.log('Loaded multigrade plan parsed successfully');
        setParsedPlan(parsed);
      } else {
        console.log('Loaded multigrade plan parsing failed');
      }
    }
  }, [generatedPlan]);

  // Finalization effect - runs when streaming completes
  useEffect(() => {
    if (streamingPlan && !getIsStreaming(tabId, ENDPOINT)) {
      console.log('Multigrade streaming completed, setting generated plan');
      
      // ✅ Save RAW content without cleaning
      setGeneratedPlan(streamingPlan);
      
      // ✅ Parse with new parser
      const parsed = parseMultigradeContent(streamingPlan, formData);
      if (parsed) {
        setParsedPlan(parsed);
        console.log('✅ Successfully parsed multigrade plan:', parsed);
      } else {
        console.warn('⚠️ Failed to parse multigrade plan');
      }
      
      clearStreaming(tabId, ENDPOINT);
      setLocalLoadingMap(prev => ({ ...prev, [tabId]: false }));

      // Clear any pending timeout
      if (generationTimeout) {
        clearTimeout(generationTimeout);
        setGenerationTimeout(null);
      }
    }
  }, [streamingPlan, tabId, ENDPOINT, formData, getIsStreaming, clearStreaming, generationTimeout]);

  // Auto-enable editing mode if startInEditMode flag is set
  useEffect(() => {
    if (savedData?.startInEditMode && parsedPlan && !isEditing) {
      console.log('Auto-enabling edit mode for multigrade plan');
      setIsEditing(true);
    }
  }, [savedData?.startInEditMode, parsedPlan, isEditing]);

  // Clear timeout when streaming completes or component unmounts
  useEffect(() => {
    return () => {
      if (generationTimeout) {
        clearTimeout(generationTimeout);
      }
    };
  }, [generationTimeout]);

  const allSubjects = ['Mathematics', 'Science', 'Language Arts', 'Social Studies', 'Art', 'Music', 'Physical Education'];

  const allGradeRanges = [
    'Kindergarten - Grade 1', 'Grade 1 - Grade 2', 'Grade 2 - Grade 3',
    'Grade 3 - Grade 4', 'Grade 4 - Grade 5', 'Grade 5 - Grade 6',
    'Grade 1 - Grade 3', 'Grade 2 - Grade 4', 'Grade 3 - Grade 5',
    'Grade 4 - Grade 6', 'Grade 1 - Grade 6'
  ];

  const subjects = settings.profile.filterContentByProfile && settings.profile.subjects.length > 0
    ? allSubjects.filter(s => settings.profile.subjects.includes(s))
    : allSubjects;

  const gradeNameToProfile: Record<string, string> = {
    'Kindergarten': 'k', 'Grade 1': '1', 'Grade 2': '2', 'Grade 3': '3',
    'Grade 4': '4', 'Grade 5': '5', 'Grade 6': '6'
  };

  const gradeRanges = settings.profile.filterContentByProfile && settings.profile.gradeLevels.length > 0
    ? allGradeRanges.filter(range => {
        const parts = range.split(' - ');
        return parts.some(part => {
          const profileKey = gradeNameToProfile[part];
          return profileKey && settings.profile.gradeLevels.includes(profileKey);
        });
      })
    : allGradeRanges;

  // Auto-select when only one option from profile filtering
  useEffect(() => {
    if (!settings.profile.filterContentByProfile) return;
    const updates: Partial<FormData> = {};
    if (subjects.length === 1 && !formData.subject) updates.subject = subjects[0];
    if (gradeRanges.length === 1 && !formData.gradeRange) updates.gradeRange = gradeRanges[0];
    if (Object.keys(updates).length > 0) setFormData(prev => ({ ...prev, ...updates }));
  }, [subjects, gradeRanges, settings.profile.filterContentByProfile]);

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

  // Tutorial auto-show logic
  useEffect(() => {
    if (
      settings.tutorials.tutorialPreferences.autoShowOnFirstUse &&
      !isTutorialCompleted(TUTORIAL_IDS.MULTIGRADE_PLANNER)
    ) {
      setShowTutorial(true);
    }
  }, [settings, isTutorialCompleted]);

  const handleTutorialComplete = () => {
    markTutorialComplete(TUTORIAL_IDS.MULTIGRADE_PLANNER);
    setShowTutorial(false);
  };

  // Restore state from localStorage on tab change
  useEffect(() => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setFormData(parsed.formData || getDefaultFormData());
        setGeneratedPlan(parsed.generatedPlan || '');
        setParsedPlan(parsed.parsedPlan || null);
        setCurrentPlanId(parsed.currentPlanId || null);
        setStep(parsed.step || 1);
      } catch (e) {
        console.error('Failed to parse saved state:', e);
        // Reset to defaults on parse error
        setFormData(getDefaultFormData());
        setGeneratedPlan('');
        setParsedPlan(null);
        setCurrentPlanId(null);
        setStep(1);
      }
    } else {
      // No saved state - use defaults
      setFormData(getDefaultFormData());
      setGeneratedPlan('');
      setParsedPlan(null);
      setCurrentPlanId(null);
      setStep(1);
    }
  }, [tabId]);

  // Persist to localStorage on every change
  useEffect(() => {
    const stateToSave = {
      formData,
      generatedPlan,
      parsedPlan,
      currentPlanId,
      step
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [formData, generatedPlan, parsedPlan, currentPlanId, step]);

  // Also notify parent (for backward compatibility)
  useEffect(() => {
    onDataChange({ formData, generatedPlan, streamingPlan, step, parsedPlan });
  }, [formData, generatedPlan, streamingPlan, step, parsedPlan]);

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

  // Enable structured editing mode
  const enableEditing = () => {
    if (parsedPlan) {
      setIsEditing(true);
    } else {
      alert('Cannot edit: Multigrade plan format not recognized. Try regenerating the plan.');
    }
  };

  // Save edited multigrade plan
  const saveMultigradeEdit = (editedPlan: ParsedMultigrade) => {
    setParsedPlan(editedPlan);
    const displayText = multigradeToDisplayText(editedPlan);
    setGeneratedPlan(displayText);
    setIsEditing(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
  };

  const loadMultigradeHistories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/multigrade-history');
      setMultigradeHistories(response.data);
    } catch (error) {
      console.error('Failed to load multigrade histories:', error);
    }
  };

  const savePlan = async () => {
    if (!generatedPlan && !parsedPlan) {
      alert('No plan to save');
      return;
    }

    setSaveStatus('saving');
    try {
      // ✅ DON'T clean the plan - save it as-is
      const title = formData.topic?.trim()
        ? `${formData.subject || 'General'} - ${formData.topic} (${formData.gradeRange || 'All Grades'})`
        : `Multigrade Plan - ${formData.subject || 'General'} (${formData.gradeRange || 'All Grades'})`;
      
      const planData = {
        id: currentPlanId || `multigrade_${Date.now()}`,
        title: title,
        timestamp: new Date().toISOString(),
        formData: formData,
        generatedPlan: generatedPlan,  // ✅ Save raw version
        parsedPlan: parsedPlan || undefined
      };

      if (!currentPlanId) {
        setCurrentPlanId(planData.id);
      }

      await axios.post('http://localhost:8000/api/multigrade-history', planData);
      await loadMultigradeHistories();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save multigrade plan:', error);
      alert('Failed to save multigrade plan');
      setSaveStatus('idle');
    }
  };

  const loadMultigradeHistory = (history: MultigradeHistory) => {
    setFormData(history.formData);
    setGeneratedPlan(history.generatedPlan);
    setParsedPlan(history.parsedPlan || null);
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

  // Removed old exportPlan logic; now handled by ExportButton

  useEffect(() => {
    loadMultigradeHistories();
  }, []);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Clear curriculum fields when subject or gradeRange changes
  const prevSubjectRef = useRef(formData.subject);
  const prevGradeRangeRef = useRef(formData.gradeRange);
  useEffect(() => {
    if (prevSubjectRef.current !== formData.subject || prevGradeRangeRef.current !== formData.gradeRange) {
      prevSubjectRef.current = formData.subject;
      prevGradeRangeRef.current = formData.gradeRange;
      setFormData(prev => ({ ...prev, strand: '', essentialOutcomes: '', specificOutcomes: '' }));
    }
  }, [formData.subject, formData.gradeRange]);

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
             formData.totalStudents && formData.duration && formData.materials &&
             formData.strand && formData.essentialOutcomes && formData.specificOutcomes;
    }
    if (step === 2) {
      return formData.learningStyles.length > 0 && formData.pedagogicalStrategies.length > 0 &&
             formData.multigradeStrategies.length > 0;
    }
    return true;
  };

  const generatePlan = () => {
    // Transform FormData to MultigradeFormData format
    const multigradeFormData = {
      topic: formData.topic,
      subject: formData.subject,
      gradeLevels: formData.gradeRange.split(/[-,]/).map(g => g.trim()),
      duration: formData.duration,
      totalStudents: formData.totalStudents,
      strand: formData.strand,
      essentialOutcomes: formData.essentialOutcomes,
      specificOutcomes: formData.specificOutcomes
    };

    const prompt = buildMultigradePrompt(multigradeFormData);

    if (queueEnabled) {
      enqueue({
        label: `Multigrade Plan - ${formData.topic || formData.subject}`,
        toolType: 'Multigrade Plan',
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

    // Set a timeout to force completion if stuck (2 minutes)
    const timeout = setTimeout(() => {
      console.log('Multigrade generation timeout, forcing completion');
      const currentStreaming = getStreamingContent(tabId, ENDPOINT);
      if (currentStreaming && getIsStreaming(tabId, ENDPOINT)) {
        setGeneratedPlan(currentStreaming);
        const parsed = parseMultigradeContent(currentStreaming, formData);
        if (parsed) setParsedPlan(parsed);
        clearStreaming(tabId, ENDPOINT);
        setLocalLoadingMap(prev => ({ ...prev, [tabId]: false }));
      }
      setGenerationTimeout(null);
    }, 120000);

    setGenerationTimeout(timeout);

    try {
      ws.send(JSON.stringify({
        prompt,
        generationMode: settings.generationMode,
      }));
    } catch (error) {
      console.error('Failed to send multigrade plan request:', error);
      clearTimeout(timeout);
      setGenerationTimeout(null);
    }
  };

  const clearForm = () => {
    setFormData(getDefaultFormData());
    setGeneratedPlan('');
    setParsedPlan(null);
    setCurrentPlanId(null);
    setStep(1);
    setIsEditing(false);

    // Clear localStorage for this tab
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  return (
    <div className="flex h-full tab-content-bg relative" data-tutorial="multigrade-planner-welcome">
      <div className="flex-1 flex flex-col tab-content-bg">
        {(generatedPlan || streamingPlan || loading) ? (
          <>
            {isEditing && parsedPlan ? (
              // Show Structured Editor
              <MultigradeEditor
                plan={parsedPlan}
                onSave={saveMultigradeEdit}
                onCancel={cancelEditing}
              />
            ) : loading && !streamingPlan && !generatedPlan ? (
              <GeneratorSkeleton accentColor={tabColor} type="plan" />
            ) : (
              // Show generated plan (existing display code)
              <>
                <div className="border-b border-theme p-4 flex items-center justify-between flex-shrink-0">
                  <div>
                    <h2 className="text-xl font-semibold text-theme-heading">
                      {loading ? 'Generating Multigrade Plan...' : 'Generated Multigrade Plan'}
                    </h2>
                    <p className="text-sm text-theme-hint">{formData.subject} - {formData.gradeRange}</p>
                  </div>
                  {!loading && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={enableEditing}
                        disabled={!parsedPlan}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-theme-tertiary disabled:cursor-not-allowed"
                        title={!parsedPlan ? "Multigrade plan format not recognized" : "Edit plan"}
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
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-theme-tertiary"
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
                            Save Plan
                          </>
                        )}
                      </button>
                      <ExportButton
                        dataType="multigrade"
                        data={{
                          content: generatedPlan,
                          formData: formData,
                          accentColor: tabColor
                        }}
                        filename={`multigrade-${formData.topic.replace(/\s+/g, '-').toLowerCase()}`}
                        className="ml-2"
                      />
                      <button
                        onClick={() => setHistoryOpen(!historyOpen)}
                        className="p-2 rounded-lg hover:bg-theme-hover transition"
                        title="Multigrade Plan History"
                      >
                        <History className="w-5 h-5 text-theme-muted" />
                      </button>
                      <button
                        onClick={() => {
                          setGeneratedPlan('');
                          clearStreaming(tabId, ENDPOINT);
                          setParsedPlan(null);
                          setIsEditing(false);
                        }}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                      >
                        Create New Plan
                      </button>
                    </div>
                  )}
                </div>
            
                <div className="flex-1 overflow-y-auto bg-theme-surface p-6">
              {(streamingPlan || generatedPlan) && !isEditing && (
                <div className="mb-8">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg">
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${tabColor}, ${tabColor}dd, ${tabColor}bb)` }}></div>
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${tabColor}e6, ${tabColor}cc)` }}></div>
                    
                    <div className="relative px-8 py-8">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                            <span className="text-white text-sm font-medium">{formData.subject}</span>
                          </div>
                          
                          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
                            {parsedPlan?.metadata.title || (formData.topic ? `${formData.topic} - Multigrade` : 'Multigrade Lesson Plan')}
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
                              <HeartbeatLoader className="w-5 h-5 mr-3" />
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
                    <div className="space-y-1 rounded-xl p-6 widget-glass">
                      {formatMultigradeText(
                        streamingPlan || generatedPlan, 
                        tabColor,
                        !!streamingPlan  // ✅ TRUE when streaming, FALSE when complete
                      )}
                      {loading && streamingPlan && (
                        <span className="inline-flex items-center ml-1">
                          <span className="w-0.5 h-5 animate-pulse rounded-full" style={{ backgroundColor: tabColor }}></span>
                        </span>
                      )}
                    </div>
                  </div>

                  {loading && (
                    <div className="mt-8 rounded-xl p-6 border" style={{ background: `linear-gradient(to right, ${tabColor}0d, ${tabColor}1a)`, borderColor: `${tabColor}33` }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium" style={{ color: `${tabColor}dd` }}>Creating your multigrade plan</div>
                          <div className="text-sm mt-1" style={{ color: `${tabColor}99` }}>Differentiated activities for multiple grade levels</div>
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
          <>
            <div className="border-b border-theme p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-theme-heading">Create Multigrade Lesson Plan</h2>
                <p className="text-sm text-theme-hint">Design a lesson that addresses multiple grade levels simultaneously</p>
              </div>
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="p-2 rounded-lg hover:bg-theme-hover transition"
                title="Multigrade Plan History"
              >
                <History className="w-5 h-5 text-theme-muted" />
              </button>
            </div>

            {/* Progress Steps */}
            <StepProgressBar
              steps={['Basic Info', 'Learning & Strategies', 'Additional Details']}
              currentStep={step}
              onClick={(s) => handleStepChange(s)}
            />

            <div className="flex-1 overflow-y-auto p-6">
              <div style={{ perspective: '1200px' }}>
              <div style={{
                transformStyle: 'preserve-3d',
                transition: flipPhase === 'in' ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1), opacity 0.3s ease',
                transform: flipPhase === 'out'
                  ? `rotateY(${flipDirection === 'forward' ? '-90' : '90'}deg) scale(0.95)`
                  : flipPhase === 'in'
                  ? `rotateY(${flipDirection === 'forward' ? '90' : '-90'}deg) scale(0.95)`
                  : 'rotateY(0deg) scale(1)',
                opacity: flipPhase === 'out' || flipPhase === 'in' ? 0 : 1,
              }}>
              <div className="max-w-4xl mx-auto">
                {/* Step 1: Basic Info */}
                {displayStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-theme-heading">Basic Information</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div data-tutorial="multigrade-planner-subject">
                        <label className="block text-sm font-medium text-theme-label mb-2">
                          Subject <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                          style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                        >
                          <option value="">Select a subject</option>
                          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>

                      <div data-tutorial="multigrade-planner-grades">
                        <label className="block text-sm font-medium text-theme-label mb-2">
                          Grade Range <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.gradeRange}
                          onChange={(e) => handleInputChange('gradeRange', e.target.value)}
                          className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                          style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                        >
                          <option value="">Select grade range</option>
                          {gradeRanges.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <MultigradeAlignmentFields
                        subject={formData.subject}
                        gradeLevels={parseGradeLevels(formData.gradeRange)}
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
                        gradeLevel={parseGradeLevels(formData.gradeRange)[0] || ''}
                        strand={formData.strand}
                        useCurriculum={useCurriculum}
                        essentialOutcomes={formData.essentialOutcomes}
                      />
                    </div>

                    <div data-tutorial="multigrade-planner-theme">
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        Topic <span className="text-red-500">*</span>
                      </label>
                      <SmartInput
                        value={formData.topic}
                        onChange={(val) => handleInputChange('topic', val)}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-theme-label mb-2">
                          Total Number of Students <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.totalStudents}
                          onChange={(e) => handleInputChange('totalStudents', e.target.value)}
                          className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-theme-label mb-2">
                          Duration (minutes) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.duration}
                          onChange={(e) => handleInputChange('duration', e.target.value)}
                          className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                          style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        Prerequisite Skills
                      </label>
                      <SmartTextArea
                        value={formData.prerequisiteSkills}
                        onChange={(val) => handleInputChange('prerequisiteSkills', val)}
                        rows={2}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                      />
                    </div>

                    <div data-tutorial="multigrade-planner-resources">
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        Materials <span className="text-red-500">*</span>
                      </label>
                      <SmartTextArea
                        value={formData.materials}
                        onChange={(val) => handleInputChange('materials', val)}
                        rows={3}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Learning & Strategies */}
                {displayStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-theme-heading">Learning Styles & Preferences</h3>

                    <div data-tutorial="multigrade-planner-grouping">
                      <label className="block text-sm font-medium text-theme-label mb-3">
                        Learning Styles <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {learningStylesOptions.map(style => (
                          <label key={style} className="flex items-center space-x-2 p-2 rounded hover:bg-theme-subtle cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.learningStyles.includes(style)}
                              onChange={() => handleCheckboxChange('learningStyles', style)}
                              className="w-4 h-4 rounded"
                              style={{ accentColor: tabColor }}
                            />
                            <span className="text-sm">{style}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-3">
                        Learning Preferences
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {learningPreferencesOptions.map(pref => (
                          <label key={pref} className="flex items-center space-x-2 p-2 rounded hover:bg-theme-subtle cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.learningPreferences.includes(pref)}
                              onChange={() => handleCheckboxChange('learningPreferences', pref)}
                              className="w-4 h-4 rounded"
                              style={{ accentColor: tabColor }}
                            />
                            <span className="text-sm">{pref}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-3">
                        Multiple Intelligences
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {multipleIntelligencesOptions.map(intel => (
                          <label key={intel} className="flex items-center space-x-2 p-2 rounded hover:bg-theme-subtle cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.multipleIntelligences.includes(intel)}
                              onChange={() => handleCheckboxChange('multipleIntelligences', intel)}
                              className="w-4 h-4 rounded"
                              style={{ accentColor: tabColor }}
                            />
                            <span className="text-sm">{intel}</span>
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
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                      />
                    </div>

                    <h3 className="text-lg font-bold text-theme-heading mt-8">Teaching Strategies</h3>

                    <div data-tutorial="multigrade-planner-common-activities">
                      <label className="block text-sm font-medium text-theme-label mb-3">
                        Pedagogical Strategies <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {pedagogicalStrategiesOptions.map(strategy => (
                          <label key={strategy} className="flex items-center space-x-2 p-2 rounded hover:bg-theme-subtle cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.pedagogicalStrategies.includes(strategy)}
                              onChange={() => handleCheckboxChange('pedagogicalStrategies', strategy)}
                              className="w-4 h-4 rounded"
                              style={{ accentColor: tabColor }}
                            />
                            <span className="text-sm">{strategy}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div data-tutorial="multigrade-planner-differentiation">
                      <label className="block text-sm font-medium text-theme-label mb-3">
                        Multigrade Teaching Strategies <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {multigradeStrategiesOptions.map(strategy => (
                          <label key={strategy} className="flex items-center space-x-2 p-2 rounded hover:bg-theme-subtle cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.multigradeStrategies.includes(strategy)}
                              onChange={() => handleCheckboxChange('multigradeStrategies', strategy)}
                              className="w-4 h-4 rounded"
                              style={{ accentColor: tabColor }}
                            />
                            <span className="text-sm">{strategy}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Additional Details */}
                {displayStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-theme-heading">Special Needs Accommodations</h3>

                    <div>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.specialNeeds}
                          onChange={(e) => handleInputChange('specialNeeds', e.target.checked)}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: tabColor }}
                        />
                        <span className="text-sm font-medium">Check if there are students with special needs in any grade level</span>
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
                          className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                          style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        Differentiation Notes
                      </label>
                      <SmartTextArea
                        value={formData.differentiationNotes}
                        onChange={(val) => handleInputChange('differentiationNotes', val)}
                        rows={4}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                        placeholder="How will you differentiate for different grade levels?"
                      />
                    </div>
                  </div>
                )}
              </div>
              </div>
              </div>
            </div>

            <div className="border-t border-theme p-4 bg-theme-secondary">
              <div className="max-w-3xl mx-auto flex items-center justify-between">
                <div>
                  {step > 1 && (
                    <button
                      onClick={() => handleStepChange(step - 1)}
                      className="flex items-center px-4 py-2 text-theme-label hover:bg-theme-hover rounded-lg"
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
                      onClick={() => handleStepChange(step + 1)}
                      disabled={!validateStep()}
                      className="flex items-center px-6 py-2 text-white rounded-lg disabled:bg-theme-tertiary transition"
                      style={!validateStep() ? {} : { backgroundColor: tabColor }}
                      onMouseEnter={(e) => validateStep() && (e.currentTarget.style.opacity = '0.9')}
                      onMouseLeave={(e) => validateStep() && (e.currentTarget.style.opacity = '1')}
                    >
                      Next
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </button>
                  ) : (
                    <button
                      onClick={generatePlan}
                      disabled={loading || !validateStep()}
                      className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-theme-tertiary transition"
                      style={loading || !validateStep() ? {} : { backgroundColor: 'rgb(22 163 74)' }}
                      data-tutorial="multigrade-planner-generate"
                    >
                      {loading ? (
                        <>
                          <HeartbeatLoader className="w-5 h-5 mr-2" />
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
        className={`border-l border-theme bg-theme-secondary transition-all duration-300 overflow-hidden ${
          historyOpen ? 'w-80' : 'w-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-theme-heading">Saved Multigrade Plans</h3>
            <button
              onClick={() => setHistoryOpen(false)}
              className="p-1 rounded hover:bg-theme-hover transition"
            >
              <X className="w-5 h-5 text-theme-muted" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
            {multigradeHistories.length === 0 ? (
              <div className="text-center text-theme-hint mt-8">
                <Users className="w-12 h-12 mx-auto mb-2 text-theme-hint" />
                <p className="text-sm">No saved multigrade plans yet</p>
              </div>
            ) : (
              multigradeHistories.map((history) => (
                <div
                  key={history.id}
                  onClick={() => loadMultigradeHistory(history)}
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
          const parsed = parseMultigradeContent(newContent, formData);
          if (parsed) setParsedPlan(parsed);
        }}
      />

      {/* Tutorial Components */}
      <TutorialOverlay
        steps={tutorials[TUTORIAL_IDS.MULTIGRADE_PLANNER].steps}
        onComplete={handleTutorialComplete}
        autoStart={showTutorial}
        showFloatingButton={false}
      />

    
      <TutorialButton
        tutorialId={TUTORIAL_IDS.MULTIGRADE_PLANNER}
        onStartTutorial={() => setShowTutorial(true)}
        position="bottom-right"
      />
  
    </div>
  );
};

export default MultigradePlanner;