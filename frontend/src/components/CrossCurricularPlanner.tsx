import React, { useState, useEffect, useRef } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import ArrowRight01Icon from '@hugeicons/core-free-icons/ArrowRight01Icon';
import ArrowLeft01Icon from '@hugeicons/core-free-icons/ArrowLeft01Icon';
import { useAchievementTrigger } from '../contexts/AchievementContext';
import Loading02Icon from '@hugeicons/core-free-icons/Loading02Icon';
import SchoolIcon from '@hugeicons/core-free-icons/SchoolIcon';
import Delete02Icon from '@hugeicons/core-free-icons/Delete02Icon';
import SaveIcon from '@hugeicons/core-free-icons/SaveIcon';
import Download01Icon from '@hugeicons/core-free-icons/Download01Icon';
import Clock01Icon from '@hugeicons/core-free-icons/Clock01Icon';
import Cancel01Icon from '@hugeicons/core-free-icons/Cancel01Icon';
import PencilEdit01Icon from '@hugeicons/core-free-icons/PencilEdit01Icon';
import Message01Icon from '@hugeicons/core-free-icons/Message01Icon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const ChevronRight: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowRight01Icon} {...p} />;
const ChevronLeft: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowLeft01Icon} {...p} />;
const Loader2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Loading02Icon} {...p} />;
const School: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={SchoolIcon} {...p} />;
const Trash2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Delete02Icon} {...p} />;
const Save: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={SaveIcon} {...p} />;
const Download: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Download01Icon} {...p} />;
const History: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Clock01Icon} {...p} />;
const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Cancel01Icon} {...p} />;
const Edit: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PencilEdit01Icon} {...p} />;
const MessageSquare: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Message01Icon} {...p} />;
import ExportButton from './ExportButton';
import AIAssistantPanel from './AIAssistantPanel';
import CrossCurricularEditor from './CrossCurricularEditor';
import type { ParsedCrossCurricularPlan } from './CrossCurricularEditor';
import axios from 'axios';
import { buildCrossCurricularPrompt } from '../utils/crossCurricularPromptBuilder';
import { useSettings } from '../contexts/SettingsContext';
import { filterSubjects, filterGrades } from '../data/teacherConstants';
import { TutorialOverlay } from './TutorialOverlay';
import StepProgressBar from './ui/StepProgressBar';
import CurriculumAlignmentFields from './ui/CurriculumAlignmentFields';
import RelatedCurriculumBox from './ui/RelatedCurriculumBox';
import { TutorialButton } from './TutorialButton';
import { tutorials, TUTORIAL_IDS } from '../data/tutorialSteps';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useQueue } from '../contexts/QueueContext';
import { GeneratorSkeleton } from './ui/GeneratorSkeleton';
import { HeartbeatLoader } from './ui/HeartbeatLoader';
import SmartTextArea from './SmartTextArea';
import SmartInput from './SmartInput';
import { useQueueCancellation } from '../hooks/useQueueCancellation';
// Curriculum data is loaded on demand by CurriculumAlignmentFields

interface CrossCurricularPlannerProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
}

interface CrossCurricularHistory {
  id: string;
  title: string;
  timestamp: string;
  formData: FormData;
  generatedPlan: string;
  parsedPlan?: ParsedCrossCurricularPlan;
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
  strand: string;
  essentialOutcomes: string;
  specificOutcomes: string;
}

const formatCrossCurricularText = (text: string, accentColor: string) => {
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

    // Integration model with special highlighting
    if (trimmed.match(/^(Multidisciplinary|Interdisciplinary|Transdisciplinary).*:/i)) {
      elements.push(
        <div key={`integration-${currentIndex++}`} className="mt-4 mb-3">
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

// Parse cross-curricular plan text content into structured ParsedCrossCurricularPlan format
const parseCrossCurricularContent = (text: string, formData: FormData): ParsedCrossCurricularPlan | null => {
  if (!text) return null;

  try {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Extract metadata from form data
    const integrationSubjectsArray = formData.supportingSubjects
      ? formData.supportingSubjects.split(',').map(s => s.trim()).filter(s => s)
      : [];
    
    const metadata = {
      title: formData.lessonTitle || 'Cross-Curricular Plan',
      theme: formData.bigIdea,
      primarySubject: formData.primarySubject,
      integrationSubjects: integrationSubjectsArray,
      gradeLevel: formData.gradeLevel,
      duration: formData.duration,
      integrationModel: formData.integrationModel,
      date: new Date().toLocaleDateString()
    };

    // Parse learning standards
    const standardsMatch = text.match(/\*\*Learning Standards.*?\*\*(.*?)(?=\*\*|$)/s);
    const learningStandards = standardsMatch ? standardsMatch[1].trim() : formData.learningStandards;

    // Parse subject-specific objectives
    const subjectObjectives: Array<{ id: string; subject: string; objective: string }> = [];
    const allSubjects = [formData.primarySubject, ...integrationSubjectsArray];
    
    allSubjects.forEach((subject, subjectIdx) => {
      const subjectObjRegex = new RegExp(`\\*\\*${subject}.*?Objectives.*?\\*\\*([\\s\\S]*?)(?=\\*\\*(?:[A-Z])|$)`, 'i');
      const match = text.match(subjectObjRegex);
      if (match && match[1]) {
        const objMatches = match[1].match(/(?:^|\n)\s*[\*\-•]\s+(.+)/g);
        if (objMatches) {
          objMatches.forEach((m, idx) => {
            const cleaned = m.replace(/^\s*[\*\-•]\s+/, '').trim();
            if (cleaned) {
              subjectObjectives.push({
                id: `obj_${subjectIdx}_${idx}`,
                subject,
                objective: cleaned
              });
            }
          });
        }
      }
    });

    // If no subject-specific objectives found, try to parse from primary/secondary objectives
    if (subjectObjectives.length === 0) {
      if (formData.primaryObjective) {
        subjectObjectives.push({
          id: 'obj_primary_0',
          subject: formData.primarySubject,
          objective: formData.primaryObjective
        });
      }
      if (formData.secondaryObjectives) {
        const secondaryObjs = formData.secondaryObjectives.split('\n').filter(o => o.trim());
        secondaryObjs.forEach((obj, idx) => {
          subjectObjectives.push({
            id: `obj_secondary_${idx}`,
            subject: integrationSubjectsArray[0] || 'Supporting Subject',
            objective: obj.trim()
          });
        });
      }
    }

    // Parse cross-curricular activities
    const crossCurricularActivities: Array<{
      id: string;
      name: string;
      description: string;
      subjects: string[];
      duration?: string;
    }> = [];
    
    const activitiesSection = text.match(/\*\*(?:Cross-Curricular )?Activities.*?\*\*(.*?)(?=\*\*(?:Materials|Assessment)|$)/s);
    if (activitiesSection) {
      const activityBlocks = activitiesSection[1].split(/(?=\d+\.)/);
      activityBlocks.forEach((block, idx) => {
        const trimmed = block.trim();
        if (trimmed) {
          const nameMatch = trimmed.match(/^\d+\.\s*(.+?)(?:\n|$)/);
          const activityName = nameMatch ? nameMatch[1].trim() : `Activity ${idx + 1}`;
          const description = trimmed.replace(/^\d+\.\s*.+?\n/, '').trim();
          
          // Try to determine which subjects are involved
          const involvedSubjects = allSubjects.filter(subject =>
            description.toLowerCase().includes(subject.toLowerCase())
          );
          
          crossCurricularActivities.push({
            id: `activity_${idx}`,
            name: activityName,
            description,
            subjects: involvedSubjects.length > 0 ? involvedSubjects : [formData.primarySubject],
            duration: ''
          });
        }
      });
    }

    // If no activities parsed, try to get from form data
    if (crossCurricularActivities.length === 0 && formData.coreActivities) {
      crossCurricularActivities.push({
        id: 'activity_0',
        name: 'Core Learning Activity',
        description: formData.coreActivities,
        subjects: [formData.primarySubject],
        duration: ''
      });
    }

    // Parse materials
    const materials: Array<{ id: string; name: string; subjects?: string[] }> = [];
    const materialsSection = text.match(/\*\*Materials.*?\*\*(.*?)(?=\*\*|$)/s);
    if (materialsSection) {
      const matMatches = materialsSection[1].match(/(?:^|\n)\s*[\*\-•]\s+(.+)/g);
      if (matMatches) {
        matMatches.forEach((match, idx) => {
          const cleaned = match.replace(/^\s*[\*\-•]\s+/, '').trim();
          if (cleaned) {
            // Check for subject tags in materials
            const subjectMatch = cleaned.match(/\(((?:[A-Za-z\s]+)(?:,\s*[A-Za-z\s]+)*)\)/);
            let name = cleaned;
            let subjectTags: string[] = [];
            
            if (subjectMatch) {
              name = cleaned.replace(subjectMatch[0], '').trim();
              subjectTags = subjectMatch[1].split(',').map(s => s.trim());
            }
            
            materials.push({
              id: `material_${idx}`,
              name,
              subjects: subjectTags.length > 0 ? subjectTags : []
            });
          }
        });
      }
    }

    // If no materials parsed, try from form data
    if (materials.length === 0 && formData.materials) {
      const matList = formData.materials.split('\n').filter(m => m.trim());
      matList.forEach((mat, idx) => {
        materials.push({
          id: `material_${idx}`,
          name: mat.trim(),
          subjects: []
        });
      });
    }

    // Parse assessment strategies
    const assessmentStrategies: string[] = [];
    const assessSection = text.match(/\*\*Assessment.*?\*\*(.*?)(?=\*\*|$)/s);
    if (assessSection) {
      const assessMatches = assessSection[1].match(/(?:^|\n)\s*[\*\-•]\s+(.+)/g);
      if (assessMatches) {
        assessMatches.forEach(match => {
          const cleaned = match.replace(/^\s*[\*\-•]\s+/, '').trim();
          if (cleaned) assessmentStrategies.push(cleaned);
        });
      }
    }

    // If no assessment strategies parsed, use from form data
    if (assessmentStrategies.length === 0 && formData.assessmentMethods) {
      assessmentStrategies.push(formData.assessmentMethods);
    }

    // Parse optional fields
    const differentiationMatch = text.match(/\*\*Differentiation.*?\*\*(.*?)(?=\*\*|$)/s);
    const differentiationNotes = differentiationMatch
      ? differentiationMatch[1].trim()
      : formData.differentiationStrategies || undefined;

    const reflectionMatch = text.match(/\*\*Reflection.*?\*\*(.*?)(?=\*\*|$)/s);
    const reflectionPrompts = reflectionMatch
      ? reflectionMatch[1].trim()
      : formData.reflectionPrompts || undefined;

    const vocabMatch = text.match(/\*\*(?:Key )?Vocabulary.*?\*\*(.*?)(?=\*\*|$)/s);
    const keyVocabulary = vocabMatch
      ? vocabMatch[1].trim()
      : formData.keyVocabulary || undefined;

    return {
      metadata,
      learningStandards,
      subjectObjectives: subjectObjectives.length > 0 ? subjectObjectives : [
        { id: 'obj_0', subject: formData.primarySubject, objective: 'No objectives found' }
      ],
      crossCurricularActivities: crossCurricularActivities.length > 0 ? crossCurricularActivities : [],
      materials: materials.length > 0 ? materials : [
        { id: 'mat_0', name: 'No materials specified', subjects: [] }
      ],
      assessmentStrategies: assessmentStrategies.length > 0 ? assessmentStrategies : ['Observation'],
      differentiationNotes,
      reflectionPrompts,
      keyVocabulary
    };
  } catch (error) {
    console.error('Failed to parse cross-curricular plan:', error);
    return null;
  }
};

// Convert ParsedCrossCurricularPlan back to display text format
const crossCurricularPlanToDisplayText = (plan: ParsedCrossCurricularPlan): string => {
  let output = '';
  
  // Add metadata header
  output += `**CROSS-CURRICULAR LESSON PLAN**\n\n`;
  output += `**Title:** ${plan.metadata.title}\n`;
  output += `**Big Idea/Theme:** ${plan.metadata.theme}\n`;
  output += `**Primary Subject:** ${plan.metadata.primarySubject}\n`;
  output += `**Integration Model:** ${plan.metadata.integrationModel}\n`;
  if (plan.metadata.integrationSubjects.length > 0) {
    output += `**Supporting Subjects:** ${plan.metadata.integrationSubjects.join(', ')}\n`;
  }
  output += `**Grade Level:** ${plan.metadata.gradeLevel}\n`;
  output += `**Duration:** ${plan.metadata.duration}\n`;
  output += `**Date:** ${plan.metadata.date}\n\n`;
  
  // Learning Standards
  output += `**Learning Standards**\n${plan.learningStandards}\n\n`;
  
  // Subject-Specific Objectives
  output += `**Subject-Specific Learning Objectives**\n\n`;
  const subjectGroups: { [key: string]: string[] } = {};
  plan.subjectObjectives.forEach(obj => {
    if (!subjectGroups[obj.subject]) {
      subjectGroups[obj.subject] = [];
    }
    subjectGroups[obj.subject].push(obj.objective);
  });
  
  Object.keys(subjectGroups).forEach(subject => {
    output += `**${subject} Objectives:**\n`;
    subjectGroups[subject].forEach(obj => {
      output += `* ${obj}\n`;
    });
    output += '\n';
  });
  
  // Cross-Curricular Activities
  if (plan.crossCurricularActivities.length > 0) {
    output += `**Cross-Curricular Activities**\n\n`;
    plan.crossCurricularActivities.forEach((activity, idx) => {
      output += `${idx + 1}. **${activity.name}**\n`;
      output += `   Subjects: ${activity.subjects.join(', ')}\n`;
      output += `   ${activity.description}\n`;
      if (activity.duration) {
        output += `   Duration: ${activity.duration}\n`;
      }
      output += '\n';
    });
  }
  
  // Materials
  output += `**Materials Needed:**\n`;
  plan.materials.forEach(material => {
    let materialLine = `* ${material.name}`;
    if (material.subjects && material.subjects.length > 0) {
      materialLine += ` (${material.subjects.join(', ')})`;
    }
    output += `${materialLine}\n`;
  });
  output += '\n';
  
  // Assessment Strategies
  output += `**Assessment Strategies:**\n`;
  plan.assessmentStrategies.forEach(strategy => {
    output += `* ${strategy}\n`;
  });
  output += '\n';
  
  // Optional fields
  if (plan.keyVocabulary) {
    output += `**Key Vocabulary:**\n${plan.keyVocabulary}\n\n`;
  }
  
  if (plan.differentiationNotes) {
    output += `**Differentiation Strategies:**\n${plan.differentiationNotes}\n\n`;
  }
  
  if (plan.reflectionPrompts) {
    output += `**Reflection Prompts:**\n${plan.reflectionPrompts}\n`;
  }
  
  return output;
};

const CrossCurricularPlanner: React.FC<CrossCurricularPlannerProps> = ({ tabId, savedData, onDataChange }) => {
  const triggerCheck = useAchievementTrigger();
  // Per-tab localStorage key
  const LOCAL_STORAGE_KEY = `cross_curricular_state_${tabId}`;
  const ENDPOINT = '/ws/cross-curricular';

  const { settings, markTutorialComplete, isTutorialCompleted } = useSettings();
  const tabColor = settings.tabColors['cross-curricular-planner'];
  const [showTutorial, setShowTutorial] = useState(false);

  // WebSocketContext integration
  const { getConnection, getStreamingContent, getIsStreaming, clearStreaming, subscribe } = useWebSocket();
  const { enqueue, queueEnabled } = useQueue();

  // Get streaming state from context
  const streamingPlan = getStreamingContent(tabId, ENDPOINT);
  // Per-tab local loading state
  const [localLoadingMap, setLocalLoadingMap] = useState<{ [tabId: string]: boolean }>({});
  useQueueCancellation(tabId, ENDPOINT, setLocalLoadingMap);
  const loading = !!localLoadingMap[tabId] || getIsStreaming(tabId, ENDPOINT);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draftsExpanded, setDraftsExpanded] = useState(true);
  const [crossCurricularHistories, setCrossCurricularHistories] = useState<CrossCurricularHistory[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // State for structured editing
  const [isEditing, setIsEditing] = useState(false);
  const [parsedPlan, setParsedPlan] = useState<ParsedCrossCurricularPlan | null>(() => {
    // First check savedData (for resource manager view/edit)
    if (savedData?.parsedPlan && typeof savedData.parsedPlan === 'object') {
      return savedData.parsedPlan;
    }
    return null;
  });

  // Helper function to get default empty form data
  const getDefaultFormData = (): FormData => ({
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
    crossCurricularConnections: '',
    strand: '',
    essentialOutcomes: '',
    specificOutcomes: ''
  });

  // Start with defaults - will be restored from localStorage or savedData
  const [step, setStep] = useState<number>(1);
  const [useCurriculum, setUseCurriculum] = useState(true);
  const [flipPhase, setFlipPhase] = useState<'idle' | 'out' | 'in'>('idle');
  const [displayStep, setDisplayStep] = useState(step);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward');
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
  const [assistantOpen, setAssistantOpen] = useState(false);

  // Try to parse plan when generated (for restored/loaded plans)
  useEffect(() => {
    if (generatedPlan && !parsedPlan) {
      console.log('Attempting to parse loaded/restored cross-curricular plan...');
      const parsed = parseCrossCurricularContent(generatedPlan, formData);
      if (parsed) {
        console.log('Loaded cross-curricular plan parsed successfully');
        setParsedPlan(parsed);
      } else {
        console.log('Loaded cross-curricular plan parsing failed');
      }
    }
  }, [generatedPlan]);

  // Finalization effect - runs when streaming completes
  useEffect(() => {
    if (streamingPlan && !getIsStreaming(tabId, ENDPOINT)) {
      setGeneratedPlan(streamingPlan);
      const parsed = parseCrossCurricularContent(streamingPlan, formData);
      if (parsed) setParsedPlan(parsed);
      clearStreaming(tabId, ENDPOINT);
      setLocalLoadingMap(prev => ({ ...prev, [tabId]: false }));
    }
  }, [streamingPlan]);

  // Auto-enable editing mode if startInEditMode flag is set
  useEffect(() => {
    if (savedData?.startInEditMode && parsedPlan && !isEditing) {
      console.log('Auto-enabling edit mode for cross-curricular plan');
      setIsEditing(true);
    }
  }, [savedData?.startInEditMode, parsedPlan, isEditing]);

  // Card flip animation
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

  const allGrades = ['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
                  'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

  const allSubjects = ['Mathematics', 'Language Arts', 'Science', 'Social Studies', 'Arts',
                    'Physical Education', 'Technology'];

  const gradeMapping = settings.profile.gradeSubjects || {};
  const filterOn = settings.profile.filterContentByProfile;

  const grades = filterGrades(allGrades, gradeMapping, filterOn);
  const selectedGradeKey = formData.gradeLevel?.toLowerCase().replace('grade ', '').replace('kindergarten', 'k') || '';
  const subjects = filterSubjects(allSubjects, gradeMapping, filterOn, selectedGradeKey || undefined);

  const integrationModels = ['Multidisciplinary', 'Interdisciplinary', 'Transdisciplinary'];

  const teachingStrategiesOptions = [
    'Inquiry-Based Learning', 'Project-Based Learning', 'Direct Instruction',
    'Cooperative Learning', 'Differentiated Instruction', 'Flipped Classroom',
    'Gamification', 'Problem-Based Learning', 'Socratic Method',
    'Experiential Learning', 'Culturally Responsive Teaching', 'Universal Design for Learning'
  ];

  // Auto-select when only one option from profile filtering
  useEffect(() => {
    if (!filterOn) return;
    const updates: Partial<FormData> = {};
    if (grades.length === 1 && !formData.gradeLevel) updates.gradeLevel = grades[0];
    if (subjects.length === 1 && !formData.primarySubject) updates.primarySubject = subjects[0];
    if (Object.keys(updates).length > 0) setFormData(prev => ({ ...prev, ...updates }));
  }, [subjects, grades, filterOn]);

  const learningStylesOptions = ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic', 'Social', 'Solitary'];
  const learningPreferencesOptions = ['Individual Work', 'Group Work', 'Pair Work', 'Whole Class', 'Independent Study'];
  const multipleIntelligencesOptions = ['Linguistic', 'Logical-Mathematical', 'Spatial', 'Musical',
                                        'Bodily-Kinesthetic', 'Interpersonal', 'Intrapersonal', 'Naturalistic'];


  // Tutorial auto-show logic
  useEffect(() => {
    if (
      settings.tutorials.tutorialPreferences.autoShowOnFirstUse &&
      !isTutorialCompleted(TUTORIAL_IDS.CROSS_CURRICULAR_PLANNER)
    ) {
      setShowTutorial(true);
    }
  }, [settings, isTutorialCompleted]);

  const handleTutorialComplete = () => {
    markTutorialComplete(TUTORIAL_IDS.CROSS_CURRICULAR_PLANNER);
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

  const loadCrossCurricularHistories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/cross-curricular-history');
      setCrossCurricularHistories(response.data);
    } catch (error) {
      console.error('Failed to load cross-curricular histories:', error);
    }
  };

  // Enable structured editing mode
  const enableEditing = () => {
    if (parsedPlan) {
      setIsEditing(true);
    } else {
      alert('Cannot edit: Cross-curricular plan format not recognized. Try regenerating the plan.');
    }
  };

  // Save edited cross-curricular plan
  const saveCrossCurricularEdit = (editedPlan: ParsedCrossCurricularPlan) => {
    setParsedPlan(editedPlan);
    const displayText = crossCurricularPlanToDisplayText(editedPlan);
    setGeneratedPlan(displayText);
    setIsEditing(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
  };

  const savePlan = async () => {
    if (!generatedPlan && !parsedPlan) {
      alert('No plan to save');
      return;
    }

    setSaveStatus('saving');
    try {
      // Build a proper title with fallbacks
      const title = formData.lessonTitle?.trim()
        ? `${formData.lessonTitle} - ${formData.primarySubject || 'General'} (${formData.gradeLevel || 'All Grades'})`
        : `Cross-Curricular Plan - ${formData.primarySubject || 'General'} (${formData.gradeLevel || 'All Grades'})`;
      
      const planData = {
        id: currentPlanId || `cross_curricular_${Date.now()}`,
        title: title,
        timestamp: new Date().toISOString(),
        formData: formData,
        generatedPlan: generatedPlan,  // ✅ Save original clean text
        parsedPlan: parsedPlan || undefined
      };

      if (!currentPlanId) {
        setCurrentPlanId(planData.id);
      }

      await axios.post('http://localhost:8000/api/cross-curricular-history', planData);
      await loadCrossCurricularHistories();
      setSaveStatus('saved');
      triggerCheck();
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save cross-curricular plan:', error);
      alert('Failed to save cross-curricular plan');
      setSaveStatus('idle');
    }
  };

  const loadCrossCurricularHistory = (history: CrossCurricularHistory) => {
    setFormData(history.formData);
    setGeneratedPlan(history.generatedPlan);
    setParsedPlan(history.parsedPlan || null);
    setCurrentPlanId(history.id);
    setHistoryOpen(false);
  };

  const deleteCrossCurricularHistory = async (planId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this cross-curricular plan?')) return;
    
    try {
      await axios.delete(`http://localhost:8000/api/cross-curricular-history/${planId}`);
      await loadCrossCurricularHistories();
      if (currentPlanId === planId) {
        clearForm();
      }
    } catch (error) {
      console.error('Failed to delete cross-curricular plan:', error);
    }
  };

  // Removed old exportPlan logic; now handled by ExportButton

  const loadDrafts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/lesson-drafts?plannerType=cross-curricular');
      setDrafts(response.data);
    } catch (error) {
      console.error('Failed to load drafts:', error);
    }
  };

  const loadDraft = async (draft: Draft) => {
    setFormData(draft.formData);
    setGeneratedPlan('');
    setParsedPlan(null);
    setCurrentPlanId(null);
    if (draft.step) setStep(draft.step);
    setHistoryOpen(false);

    try {
      await axios.delete(`http://localhost:8000/api/lesson-drafts/${draft.id}`);
      await loadDrafts();
    } catch (error) {
      console.error('Failed to delete draft after loading:', error);
    }
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
    loadCrossCurricularHistories();
    loadDrafts();
  }, []);

  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'primarySubject' || field === 'gradeLevel') {
        updated.strand = '';
        updated.essentialOutcomes = '';
        updated.specificOutcomes = '';
      }
      return updated;
    });
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

  const validateStep = (): boolean => {
    const errors: Record<string, boolean> = {};
    if (step === 1) {
      if (!formData.lessonTitle) errors.lessonTitle = true;
      if (!formData.gradeLevel) errors.gradeLevel = true;
      if (!formData.duration) errors.duration = true;
      if (!formData.bigIdea) errors.bigIdea = true;
      if (!formData.integrationModel) errors.integrationModel = true;
    }
    if (step === 2) {
      if (!formData.primarySubject) errors.primarySubject = true;
      if (!formData.strand) errors.strand = true;
      if (!formData.essentialOutcomes) errors.essentialOutcomes = true;
      if (!formData.specificOutcomes) errors.specificOutcomes = true;
    }
    if (step === 3) {
      if (!formData.primaryObjective) errors.primaryObjective = true;
    }
    if (step === 4) {
      if (!formData.introduction) errors.introduction = true;
      if (!formData.coreActivities) errors.coreActivities = true;
    }
    if (step === 5) {
      if (!formData.assessmentMethods) errors.assessmentMethods = true;
      if (!formData.mostChildren) errors.mostChildren = true;
    }
    if (step === 6) {
      if (formData.teachingStrategies.length === 0) errors.teachingStrategies = true;
      if (formData.learningStyles.length === 0) errors.learningStyles = true;
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

  const generatePlan = () => {
    if (!validateStep()) return;
    // Map formData to match the prompt builder's expected interface
    const mappedData = {
      ...formData,
      theme: formData.bigIdea,
      integrationSubjects: formData.supportingSubjects.split(',').map(s => s.trim()).filter(s => s)
    };

    const prompt = buildCrossCurricularPrompt(mappedData);

    if (queueEnabled) {
      enqueue({
        label: `Cross-Curricular Plan - ${formData.bigIdea || formData.primarySubject}`,
        toolType: 'Cross-Curricular Plan',
        tabId,
        endpoint: ENDPOINT,
        prompt,
        generationMode: settings.generationMode,
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
        generationMode: settings.generationMode,
      }));
    } catch (error) {
      console.error('Failed to send cross-curricular plan request:', error);
    }
  };

  const clearForm = () => {
    setFormData(getDefaultFormData());
    setGeneratedPlan('');
    setStep(1);
    setCurrentPlanId(null);
    setIsEditing(false);
    setParsedPlan(null);

    // Clear localStorage for this tab
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const stepLabels = ['Basic Info', 'Subjects', 'Objectives', 'Activities', 'Assessment', 'Teaching & Learning', 'Resources'];

  return (
    <div className="flex h-full tab-content-bg relative" data-tutorial="cross-curricular-planner-welcome">
      <div className="flex-1 flex flex-col tab-content-bg">
        {(generatedPlan || streamingPlan || loading) ? (
          <>
            {isEditing && parsedPlan ? (
              // Show Structured Editor
              <CrossCurricularEditor
                plan={parsedPlan}
                onSave={saveCrossCurricularEdit}
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
                      {loading ? 'Generating Cross-Curricular Plan...' : 'Generated Cross-Curricular Plan'}
                    </h2>
                    <p className="text-sm text-theme-hint">{formData.lessonTitle} - {formData.primarySubject}</p>
                  </div>
                  {!loading && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={enableEditing}
                        disabled={!parsedPlan}
                        className="flex items-center px-3.5 py-1.5 text-[13.5px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-theme-tertiary disabled:cursor-not-allowed"
                        title={!parsedPlan ? "Cross-curricular plan format not recognized" : "Edit plan"}
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
                        onClick={savePlan}
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
                      <ExportButton
                        dataType="cross-curricular"
                        data={{
                          content: parsedPlan ? crossCurricularPlanToDisplayText(parsedPlan) : generatedPlan,
                          parsedPlan: parsedPlan,
                          formData: formData,
                          accentColor: tabColor
                        }}
                        filename={`cross-curricular-${formData.lessonTitle.toLowerCase().replace(/\s+/g, '-')}`}
                        className="ml-2 !px-3.5 !py-1.5 !text-[13.5px]"
                      />
                      <button
                        onClick={() => setHistoryOpen(!historyOpen)}
                        className="p-2 rounded-lg hover:bg-theme-hover transition"
                        title="Cross-Curricular Plan History"
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
                        className="px-3.5 py-1.5 text-[13.5px] bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                      >
                        Create New Plan
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 overflow-y-auto bg-theme-surface p-6">
                  {(streamingPlan || generatedPlan) && (
                <div className="mb-8">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg">
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${tabColor}, ${tabColor}dd, ${tabColor}bb)` }}></div>
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${tabColor}e6, ${tabColor}cc)` }}></div>
                    
                    <div className="relative px-8 py-8">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                              <span className="text-white text-sm font-medium">{formData.integrationModel}</span>
                            </div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                              <span className="text-white text-sm font-medium">{formData.gradeLevel}</span>
                            </div>
                          </div>

                          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
                            {formData.lessonTitle}
                          </h1>

                          <div className="flex flex-wrap items-center gap-4 text-teal-100">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-teal-200 rounded-full mr-2"></div>
                              <span className="text-sm">{formData.primarySubject}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-teal-200 rounded-full mr-2"></div>
                              <span className="text-sm">{formData.duration}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-teal-200 rounded-full mr-2"></div>
                              <span className="text-sm">Integrated Learning</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-teal-200 rounded-full mr-2"></div>
                              <span className="text-sm">Generated on {new Date().toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        
                        {loading && (
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                            <div className="flex items-center text-white">
                              <HeartbeatLoader className="w-5 h-5 mr-3" />
                              <div>
                                <div className="text-sm font-medium">Generating...</div>
                                <div className="text-xs text-teal-100">Cross-curricular plan</div>
                              </div>
                            </div>
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
                    <div className="space-y-1 rounded-xl p-6 widget-glass">
                      {formatCrossCurricularText(streamingPlan || generatedPlan, tabColor)}
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
                          <div className="font-medium" style={{ color: `${tabColor}dd` }}>Creating your cross-curricular plan</div>
                          <div className="text-sm mt-1" style={{ color: `${tabColor}99` }}>Integrating multiple subject areas for meaningful learning</div>
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
                <h2 className="text-xl font-semibold text-theme-heading">Cross-Curricular Lesson Planner</h2>
                <p className="text-sm text-theme-hint">Create integrated subject lesson plans</p>
              </div>
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="p-2 rounded-lg hover:bg-theme-hover transition"
                title="Cross-Curricular Plan History"
              >
                <History className="w-5 h-5 text-theme-muted" />
              </button>
            </div>

            {/* Progress Indicator */}
            <StepProgressBar steps={stepLabels} currentStep={step} />

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
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Step 1: Basic Info */}
                {displayStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">Lesson Title *</label>
                      <SmartInput value={formData.lessonTitle} onChange={(val) => handleInputChange('lessonTitle', val)}
                        data-validation-error={validationErrors.lessonTitle ? 'true' : undefined}
                        className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-teal-500 ${validationErrors.lessonTitle ? 'validation-error' : ''}`} placeholder="Enter lesson title" />
                    </div>
                    <div data-tutorial="cross-curricular-planner-grade">
                      <label className="block text-sm font-medium text-theme-label mb-2">Grade Level *</label>
                      <select value={formData.gradeLevel} onChange={(e) => {
                          const newGrade = e.target.value;
                          handleInputChange('gradeLevel', newGrade);
                          const newKey = newGrade.toLowerCase().replace('grade ', '').replace('kindergarten', 'k');
                          const available = filterSubjects(allSubjects, gradeMapping, filterOn, newKey || undefined);
                          if (formData.primarySubject && !available.includes(formData.primarySubject)) {
                            handleInputChange('primarySubject', '');
                          }
                        }}
                        data-validation-error={validationErrors.gradeLevel ? 'true' : undefined}
                        className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 ${validationErrors.gradeLevel ? 'validation-error' : ''}`}
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}>
                        <option value="">Select grade level</option>
                        {grades.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">Duration *</label>
                      <SmartInput value={formData.duration} onChange={(val) => handleInputChange('duration', val)}
                        data-validation-error={validationErrors.duration ? 'true' : undefined}
                        className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 ${validationErrors.duration ? 'validation-error' : ''}`}
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="e.g., 60 minutes, 2 class periods" />
                    </div>
                    <div data-tutorial="cross-curricular-planner-theme">
                      <label className="block text-sm font-medium text-theme-label mb-2">Big Idea / Driving Concept *</label>
                      <SmartTextArea value={formData.bigIdea} onChange={(val) => handleInputChange('bigIdea', val)} rows={3}
                        data-validation-error={validationErrors.bigIdea ? 'true' : undefined}
                        className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 ${validationErrors.bigIdea ? 'validation-error' : ''}`}
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="The central concept that connects all subjects" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">Integration Model *</label>
                      <select value={formData.integrationModel} onChange={(e) => handleInputChange('integrationModel', e.target.value)}
                        data-validation-error={validationErrors.integrationModel ? 'true' : undefined}
                        className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 ${validationErrors.integrationModel ? 'validation-error' : ''}`}
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}>
                        <option value="">Select integration model</option>
                        {integrationModels.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 2: Subjects */}
                {displayStep === 2 && (
                  <div className="space-y-6">
                    <div data-tutorial="cross-curricular-planner-subjects">
                      <label className="block text-sm font-medium text-theme-label mb-2">Primary Subject *</label>
                      <select value={formData.primarySubject} onChange={(e) => handleInputChange('primarySubject', e.target.value)}
                        data-validation-error={validationErrors.primarySubject ? 'true' : undefined}
                        className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 ${validationErrors.primarySubject ? 'validation-error' : ''}`}
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}>
                        <option value="">Select primary subject</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <CurriculumAlignmentFields
                        subject={formData.primarySubject}
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
                        subject={formData.primarySubject}
                        gradeLevel={formData.gradeLevel}
                        strand={formData.strand}
                        useCurriculum={useCurriculum}
                        essentialOutcomes={formData.essentialOutcomes}
                        specificOutcomes={formData.specificOutcomes}
                      />
                    </div>
                    <div data-tutorial="cross-curricular-planner-connections">
                      <label className="block text-sm font-medium text-theme-label mb-2">Supporting Subjects</label>
                      <SmartInput value={formData.supportingSubjects} onChange={(val) => handleInputChange('supportingSubjects', val)}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Other subjects integrated (comma-separated)" />
                    </div>
                  </div>
                )}

                {/* Step 3: Objectives */}
                {displayStep === 3 && (
                  <div className="space-y-6">
                    <div data-tutorial="cross-curricular-planner-objectives">
                      <label className="block text-sm font-medium text-theme-label mb-2">Primary Learning Objective *</label>
                      <SmartTextArea value={formData.primaryObjective} onChange={(val) => handleInputChange('primaryObjective', val)} rows={2}
                        data-validation-error={validationErrors.primaryObjective ? 'true' : undefined}
                        className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 ${validationErrors.primaryObjective ? 'validation-error' : ''}`}
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="The main learning goal for this lesson" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">Secondary Learning Objectives</label>
                      <SmartTextArea value={formData.secondaryObjectives} onChange={(val) => handleInputChange('secondaryObjectives', val)} rows={3}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Additional learning goals from integrated subjects" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">Students Will Know (Facts)</label>
                      <SmartTextArea value={formData.studentsWillKnow} onChange={(val) => handleInputChange('studentsWillKnow', val)} rows={2}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Key knowledge and facts students will learn" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">Students Will Be Skilled At (Actions)</label>
                      <SmartTextArea value={formData.studentsWillBeSkilled} onChange={(val) => handleInputChange('studentsWillBeSkilled', val)} rows={2}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Skills and abilities students will develop" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">Key Vocabulary</label>
                      <SmartInput value={formData.keyVocabulary} onChange={(val) => handleInputChange('keyVocabulary', val)}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Important terms from all subjects (comma-separated)" />
                    </div>
                  </div>
                )}

                {/* Step 4: Activities */}
                {displayStep === 4 && (
                  <div className="space-y-6">
                    <div data-tutorial="cross-curricular-planner-activities">
                      <label className="block text-sm font-medium text-theme-label mb-2">Introduction/Hook *</label>
                      <SmartTextArea value={formData.introduction} onChange={(val) => handleInputChange('introduction', val)} rows={3}
                        data-validation-error={validationErrors.introduction ? 'true' : undefined}
                        className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 ${validationErrors.introduction ? 'validation-error' : ''}`}
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Engaging opening activity that introduces the big idea" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">Core Learning Activities *</label>
                      <SmartTextArea value={formData.coreActivities} onChange={(val) => handleInputChange('coreActivities', val)} rows={4}
                        data-validation-error={validationErrors.coreActivities ? 'true' : undefined}
                        className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 ${validationErrors.coreActivities ? 'validation-error' : ''}`}
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Main activities that integrate multiple subjects" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">Closure Activities</label>
                      <SmartTextArea value={formData.closureActivities} onChange={(val) => handleInputChange('closureActivities', val)} rows={3}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Activities to summarize and reflect on learning" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">Differentiation Strategies</label>
                      <SmartTextArea value={formData.differentiationStrategies} onChange={(val) => handleInputChange('differentiationStrategies', val)} rows={3}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="How you'll support diverse learners" />
                    </div>
                  </div>
                )}

                {/* Step 5: Assessment */}
                {displayStep === 5 && (
                  <div className="space-y-6">
                    <div data-tutorial="cross-curricular-planner-assessment">
                      <label className="block text-sm font-medium text-theme-label mb-2">Assessment Methods *</label>
                      <SmartTextArea value={formData.assessmentMethods} onChange={(val) => handleInputChange('assessmentMethods', val)} rows={3}
                        data-validation-error={validationErrors.assessmentMethods ? 'true' : undefined}
                        className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 ${validationErrors.assessmentMethods ? 'validation-error' : ''}`}
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="How you'll assess learning across subjects" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">Most children will *</label>
                      <SmartTextArea value={formData.mostChildren} onChange={(val) => handleInputChange('mostChildren', val)} rows={2}
                        data-validation-error={validationErrors.mostChildren ? 'true' : undefined}
                        className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 ${validationErrors.mostChildren ? 'validation-error' : ''}`}
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Expected learning outcomes for most students" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">Some will not have made so much progress</label>
                      <SmartTextArea value={formData.someNotProgressed} onChange={(val) => handleInputChange('someNotProgressed', val)} rows={2}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Support for students who need additional help" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">Some will have progressed further</label>
                      <SmartTextArea value={formData.someProgressedFurther} onChange={(val) => handleInputChange('someProgressedFurther', val)} rows={2}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Extensions for students who need more challenge" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">Reflection Prompts</label>
                      <SmartTextArea value={formData.reflectionPrompts} onChange={(val) => handleInputChange('reflectionPrompts', val)} rows={2}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Questions to help students reflect on their learning" />
                    </div>
                  </div>
                )}

                {/* Step 6: Teaching & Learning */}
                {displayStep === 6 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-3">Teaching Strategies *</label>
                      <div data-validation-error={validationErrors.teachingStrategies ? 'true' : undefined}
                        className={`grid grid-cols-2 gap-2 ${validationErrors.teachingStrategies ? 'validation-error rounded-lg p-2' : ''}`}>
                        {teachingStrategiesOptions.map(s => (
                          <label key={s} className="flex items-center space-x-2 p-2 hover:bg-theme-subtle rounded cursor-pointer">
                            <input type="checkbox" checked={formData.teachingStrategies.includes(s)}
                              onChange={() => handleCheckboxChange('teachingStrategies', s)} className="w-4 h-4 rounded"
                              style={{ accentColor: tabColor }} />
                            <span className="text-sm">{s}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-3">Learning Styles *</label>
                      <div data-validation-error={validationErrors.learningStyles ? 'true' : undefined}
                        className={`grid grid-cols-3 gap-2 ${validationErrors.learningStyles ? 'validation-error rounded-lg p-2' : ''}`}>
                        {learningStylesOptions.map(s => (
                          <label key={s} className="flex items-center space-x-2 p-2 hover:bg-theme-subtle rounded cursor-pointer">
                            <input type="checkbox" checked={formData.learningStyles.includes(s)}
                              onChange={() => handleCheckboxChange('learningStyles', s)} className="w-4 h-4 rounded"
                              style={{ accentColor: tabColor }} />
                            <span className="text-sm">{s}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 7: Resources */}
                {displayStep === 7 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">Materials and Resources</label>
                      <SmartTextArea value={formData.materials} onChange={(val) => handleInputChange('materials', val)} rows={3}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="All materials needed across subjects" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">Suggested Cross-Curricular Connections</label>
                      <SmartTextArea value={formData.crossCurricularConnections} onChange={(val) => handleInputChange('crossCurricularConnections', val)} rows={4}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Additional ideas for connecting subjects" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>
            </div>

            <div className="border-t border-theme p-4 bg-theme-secondary">
              <div className="max-w-3xl mx-auto flex justify-between">
                <div>
                  {step > 1 && (
                    <button onClick={() => handleStepChange(step - 1)} className="flex items-center px-4 py-2 text-theme-label hover:bg-theme-hover rounded-lg">
                      <ChevronLeft className="w-5 h-5 mr-1" />Previous
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={clearForm} className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-5 h-5 mr-2" />Clear Form
                  </button>
                  {step < 7 ? (
                    <button onClick={() => { if (validateStep()) handleStepChange(step + 1); }}
                      className="flex items-center px-6 py-2 text-white rounded-lg transition"
                      style={{ backgroundColor: tabColor }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}>
                      Next<ChevronRight className="w-5 h-5 ml-1" />
                    </button>
                  ) : (
                    <button onClick={generatePlan} disabled={loading}
                      className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-theme-tertiary transition"
                      style={loading ? {} : { backgroundColor: 'rgb(22 163 74)' }}
                      data-tutorial="cross-curricular-planner-generate">
                      {loading ? (
                        <>
                          <HeartbeatLoader className="w-5 h-5 mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <School className="w-5 h-5 mr-2" />
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

      {/* History Panel */}
      <div
        className={`border-l border-theme bg-theme-secondary transition-all duration-300 overflow-hidden ${
          historyOpen ? 'w-80' : 'w-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-theme-heading">Saved Cross-Curricular Plans</h3>
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
                  onClick={() => setDraftsExpanded(!draftsExpanded)}
                  className="flex items-center gap-2 cursor-pointer select-none py-1"
                >
                  <span
                    className="text-xs text-theme-muted transition-transform duration-200"
                    style={{ display: 'inline-block', transform: draftsExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
                  >
                    &#9654;
                  </span>
                  <span className="text-sm font-semibold text-amber-600">Drafts ({drafts.length})</span>
                </div>
                {draftsExpanded && (
                  <div className="space-y-2">
                    {drafts.map((draft) => (
                      <div
                        key={draft.id}
                        onClick={() => loadDraft(draft)}
                        className="p-3 rounded-lg cursor-pointer transition group hover:bg-amber-50 dark:hover:bg-amber-900/20 bg-theme-tertiary"
                        style={{ border: '1.5px dashed #d97706' }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                                Draft
                              </span>
                            </div>
                            <p className="text-sm font-medium text-theme-heading line-clamp-2">
                              {draft.title}
                            </p>
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
                <div className="border-b border-theme my-2"></div>
              </>
            )}
            {drafts.length === 0 && crossCurricularHistories.length === 0 ? (
              <div className="text-center text-theme-hint mt-8">
                <School className="w-12 h-12 mx-auto mb-2 text-theme-hint" />
                <p className="text-sm">No saved cross-curricular plans yet</p>
              </div>
            ) : (
              crossCurricularHistories.map((history) => (
                <div
                  key={history.id}
                  onClick={() => loadCrossCurricularHistory(history)}
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
                      onClick={(e) => deleteCrossCurricularHistory(history.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition"
                      title="Delete cross-curricular plan"
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
        contentType="cross-curricular"
        onContentUpdate={(newContent) => {
          setGeneratedPlan(newContent);
          const parsed = parseCrossCurricularContent(newContent, formData);
          if (parsed) setParsedPlan(parsed);
        }}
      />

      {/* Tutorial Components */}
      <TutorialOverlay
        steps={tutorials[TUTORIAL_IDS.CROSS_CURRICULAR_PLANNER].steps}
        onComplete={handleTutorialComplete}
        autoStart={showTutorial}
        showFloatingButton={false}
      />


      <TutorialButton
        tutorialId={TUTORIAL_IDS.CROSS_CURRICULAR_PLANNER}
        onStartTutorial={() => setShowTutorial(true)}
        position="bottom-right"
      />

    </div>
  );
};

export default CrossCurricularPlanner;