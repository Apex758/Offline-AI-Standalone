import React, { useState, useEffect, useRef, useReducer } from 'react';
import { useStreamingRenderer } from '../hooks/useStreamingRenderer';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import Loading02Icon from '@hugeicons/core-free-icons/Loading02Icon';
import GraduationScrollIcon from '@hugeicons/core-free-icons/GraduationScrollIcon';
import { useAchievementTrigger } from '../contexts/AchievementContext';
import Delete02Icon from '@hugeicons/core-free-icons/Delete02Icon';
import SaveIcon from '@hugeicons/core-free-icons/SaveIcon';
import Download01Icon from '@hugeicons/core-free-icons/Download01Icon';
import Clock01Icon from '@hugeicons/core-free-icons/Clock01Icon';
import Cancel01Icon from '@hugeicons/core-free-icons/Cancel01Icon';
import PencilEdit01Icon from '@hugeicons/core-free-icons/PencilEdit01Icon';
import Message01Icon from '@hugeicons/core-free-icons/Message01Icon';
import Baby01Icon from '@hugeicons/core-free-icons/Baby01Icon';
import { fetchClasses, fetchClassConfig, ClassSummary, ClassConfig } from '../lib/classConfig';
import { applyClassDefaults, listFilledLabels, kindergartenPlannerFieldMap } from '../lib/applyClassDefaults';
import { useActiveClass, buildSelection } from '../contexts/ActiveClassContext';
import ClassDefaultsBanner from './ClassDefaultsBanner';
import GenerateForSelector from './GenerateForSelector';
import type { UpcomingOccurrence } from '../lib/upcomingSlots';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const Loader2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Loading02Icon} {...p} />;
const GraduationCap: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={GraduationScrollIcon} {...p} />;
const Trash2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Delete02Icon} {...p} />;
const Save: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={SaveIcon} {...p} />;
const Download: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Download01Icon} {...p} />;
const History: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Clock01Icon} {...p} />;
const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Cancel01Icon} {...p} />;
const Edit: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PencilEdit01Icon} {...p} />;
const MessageSquare: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Message01Icon} {...p} />;
const Baby: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Baby01Icon} {...p} />;
import ExportButton from './ExportButton';
import AIAssistantPanel from './AIAssistantPanel';
import KindergartenTable from './kindergarten/KindergartenTable';
import { GeneratorShell } from './shared/GeneratorShell';
import { StreamingTextView } from './shared/StreamingTextView';
import type { ParsedKindergartenPlan } from '../types/kindergarten';
import axios from 'axios';
import { buildKindergartenPrompt } from '../utils/kindergartenPromptBuilder';
import CurriculumAlignmentFields from './ui/CurriculumAlignmentFields';
import AIDisclaimer from './AIDisclaimer';
import RelatedCurriculumBox from './ui/RelatedCurriculumBox';
import { useSettings } from '../contexts/SettingsContext';
import { filterLearningDomains } from '../data/teacherConstants';
import { TutorialOverlay } from './TutorialOverlay';
import { TutorialButton } from './TutorialButton';
import { tutorials, TUTORIAL_IDS } from '../data/tutorialSteps';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useQueue } from '../contexts/QueueContext';
import { GeneratorSkeleton } from './ui/GeneratorSkeleton';
import { HeartbeatLoader } from './ui/HeartbeatLoader';
import DurationPicker from './ui/DurationPicker';
import SmartTextArea from './SmartTextArea';
import SmartInput from './SmartInput';
import { useQueueCancellation } from '../hooks/useQueueCancellation';
import { useOfflineGuard } from '../hooks/useOfflineGuard';
import { useHistoryMatching } from '../hooks/useHistoryMatching';
import { useTimetableAutofill } from '../hooks/useTimetableAutofill';
// Curriculum data is loaded on demand by CurriculumAlignmentFields

interface KindergartenPlannerProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
  isActive?: boolean;
}

interface KindergartenHistory {
  id: string;
  title: string;
  timestamp: string;
  formData: FormData;
  generatedPlan: string;
  parsedPlan?: ParsedKindergartenPlan;
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
  curriculumSubject: string;
  strand: string;
  essentialOutcomes: string;
  specificOutcomes: string;
  learningStyles: string[];
  pedagogicalStrategies: string[];
  materials: string;
  prerequisiteSkills: string;
  specialNeeds: boolean;
  specialNeedsDetails: string;
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

// Parse kindergarten plan text content into structured ParsedKindergartenPlan format
const parseKindergartenContent = (text: string, formData: FormData): ParsedKindergartenPlan | null => {
  if (!text) return null;

  try {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Extract metadata from form data
    const metadata = {
      title: formData.lessonTopic || 'Kindergarten Plan',
      theme: formData.lessonTopic,
      curriculumUnit: formData.curriculumUnit,
      week: formData.week,
      dayOfWeek: formData.dayOfWeek,
      date: formData.date,
      ageGroup: formData.ageGroup,
      students: formData.students,
      duration: formData.duration
    };

    // Parse learning objectives
    const learningObjectives: string[] = [];
    const objectivesSection = text.match(/\*\*(?:Learning )?Objectives.*?\*\*(.*?)(?=\*\*|$)/s);
    if (objectivesSection) {
      const objMatches = objectivesSection[1].match(/(?:^|\n)\s*[\*\-•]\s+(.+)/g);
      if (objMatches) {
        objMatches.forEach(match => {
          const cleaned = match.replace(/^\s*[\*\-•]\s+/, '').trim();
          if (cleaned) learningObjectives.push(cleaned);
        });
      }
    }

    // Parse developmental domains from learning domains field
    const developmentalDomains = formData.learningDomains || [];

    // Parse activities with activity types
    const activities: Array<{
      id: string;
      type: string;
      name: string;
      description: string;
      duration?: string;
      learningGoals?: string;
    }> = [];
    
    const activitiesSection = text.match(/\*\*Activities.*?\*\*(.*?)(?=\*\*(?:Materials|Assessment)|$)/s);
    if (activitiesSection) {
      const activityBlocks = activitiesSection[1].split(/(?=Circle Time|Art Activity|Story Time|Music|Outdoor Play|Learning Centers|Small Group|Snack Time)/i);
      activityBlocks.forEach((block, idx) => {
        const trimmed = block.trim();
        if (trimmed) {
          // Detect activity type
          let activityType = 'circle-time';
          if (trimmed.match(/^Circle Time/i)) activityType = 'circle-time';
          else if (trimmed.match(/^Learning Centers/i)) activityType = 'centers';
          else if (trimmed.match(/^Art Activity/i)) activityType = 'art';
          else if (trimmed.match(/^Music/i)) activityType = 'music';
          else if (trimmed.match(/^Story Time/i)) activityType = 'story';
          else if (trimmed.match(/^Outdoor Play/i)) activityType = 'outdoor';
          else if (trimmed.match(/^Snack Time/i)) activityType = 'snack';

          const nameMatch = trimmed.match(/^([^:\n]+):/);
          const activityName = nameMatch ? nameMatch[1].trim() : `Activity ${idx + 1}`;
          const description = trimmed.replace(/^[^:\n]+:\s*/, '').trim();
          
          activities.push({
            id: `activity_${idx}`,
            type: activityType,
            name: activityName,
            description,
            duration: '',
            learningGoals: ''
          });
        }
      });
    }

    // Parse materials
    const materials: Array<{ id: string; name: string; ageAppropriate: boolean; safetyNotes?: string }> = [];
    const materialsSection = text.match(/\*\*Materials.*?\*\*(.*?)(?=\*\*|$)/s);
    if (materialsSection) {
      const matMatches = materialsSection[1].match(/(?:^|\n)\s*[\*\-•]\s+(.+)/g);
      if (matMatches) {
        matMatches.forEach((match, idx) => {
          const cleaned = match.replace(/^\s*[\*\-•]\s+/, '').trim();
          if (cleaned) {
            materials.push({
              id: `material_${idx}`,
              name: cleaned,
              ageAppropriate: true,
              safetyNotes: ''
            });
          }
        });
      }
    }

    // Parse assessment observations
    const assessmentObservations: string[] = [];
    const assessSection = text.match(/\*\*Assessment.*?\*\*(.*?)(?=\*\*|$)/s);
    if (assessSection) {
      const assessMatches = assessSection[1].match(/(?:^|\n)\s*[\*\-•]\s+(.+)/g);
      if (assessMatches) {
        assessMatches.forEach(match => {
          const cleaned = match.replace(/^\s*[\*\-•]\s+/, '').trim();
          if (cleaned) assessmentObservations.push(cleaned);
        });
      }
    }

    // Parse optional fields
    const differentiationMatch = text.match(/\*\*Differentiation.*?\*\*(.*?)(?=\*\*|$)/s);
    const differentiationNotes = differentiationMatch ? differentiationMatch[1].trim() : undefined;

    const prerequisitesMatch = text.match(/\*\*Prerequisites.*?\*\*(.*?)(?=\*\*|$)/s);
    const prerequisites = prerequisitesMatch ? prerequisitesMatch[1].trim() : undefined;

    return {
      metadata,
      learningObjectives: learningObjectives.length > 0 ? learningObjectives : ['No objectives found'],
      developmentalDomains,
      activities: activities.length > 0 ? activities : [],
      materials: materials.length > 0 ? materials : [],
      assessmentObservations: assessmentObservations.length > 0 ? assessmentObservations : ['Observation'],
      differentiationNotes,
      prerequisites
    };
  } catch (error) {
    console.error('Failed to parse kindergarten plan:', error);
    return null;
  }
};

// Convert ParsedKindergartenPlan back to display text format
const kindergartenPlanToDisplayText = (plan: ParsedKindergartenPlan): string => {
  let output = '';
  
  // Add metadata header
  output += `**KINDERGARTEN LESSON PLAN**\n\n`;
  output += `**Topic:** ${plan.metadata.title}\n`;
  output += `**Curriculum Unit:** ${plan.metadata.curriculumUnit}\n`;
  output += `**Week ${plan.metadata.week}, ${plan.metadata.dayOfWeek}**\n`;
  output += `**Date:** ${plan.metadata.date}\n`;
  output += `**Age Group:** ${plan.metadata.ageGroup}\n`;
  output += `**Students:** ${plan.metadata.students}\n`;
  output += `**Duration:** ${plan.metadata.duration} minutes\n\n`;
  
  // Learning Objectives
  output += `**Learning Objectives:**\n`;
  plan.learningObjectives.forEach(obj => {
    output += `* ${obj}\n`;
  });
  output += '\n';
  
  // Developmental Domains
  if (plan.developmentalDomains.length > 0) {
    output += `**Developmental Domains:**\n`;
    plan.developmentalDomains.forEach(domain => {
      output += `* ${domain}\n`;
    });
    output += '\n';
  }
  
  // Activities
  if (plan.activities.length > 0) {
    output += `**Activities:**\n\n`;
    plan.activities.forEach(activity => {
      output += `${activity.name}:\n`;
      output += `${activity.description}\n`;
      if (activity.duration) {
        output += `Duration: ${activity.duration}\n`;
      }
      if (activity.learningGoals) {
        output += `Learning Goals: ${activity.learningGoals}\n`;
      }
      output += '\n';
    });
  }
  
  // Materials
  output += `**Materials Needed:**\n`;
  plan.materials.forEach(material => {
    let materialLine = `* ${material.name}`;
    if (material.ageAppropriate) {
      materialLine += ' (age-appropriate)';
    }
    output += `${materialLine}\n`;
    if (material.safetyNotes) {
      output += `  Safety: ${material.safetyNotes}\n`;
    }
  });
  output += '\n';
  
  // Assessment
  output += `**Assessment & Observations:**\n`;
  plan.assessmentObservations.forEach(assessment => {
    output += `* ${assessment}\n`;
  });
  output += '\n';
  
  // Optional fields
  if (plan.differentiationNotes) {
    output += `**Differentiation Notes:**\n${plan.differentiationNotes}\n\n`;
  }
  
  if (plan.prerequisites) {
    output += `**Prerequisites:**\n${plan.prerequisites}\n`;
  }
  
  return output;
};

const KindergartenPlanner: React.FC<KindergartenPlannerProps> = ({ tabId, savedData, onDataChange }) => {
  const { t } = useTranslation();
  const triggerCheck = useAchievementTrigger();
  // ✅ Per-tab localStorage key
  const LOCAL_STORAGE_KEY = `kindergarten_state_${tabId}`;
  
  // ✅ WebSocket endpoint
  const ENDPOINT = '/ws/kindergarten';
  
  const { settings, markTutorialComplete, isTutorialCompleted } = useSettings();
  const tabColor = settings.tabColors['kindergarten-planner'];
  const [showTutorial, setShowTutorial] = useState(false);

  // ✅ WebSocketContext integration
  const { getConnection, getStreamingContent, getIsStreaming, clearStreaming, subscribe } = useWebSocket();
  const { enqueue, queueEnabled } = useQueue();

  // ✅ Get streaming state from context
  const streamingPlan = getStreamingContent(tabId, ENDPOINT);
  // Per-tab local loading state
  const [localLoadingMap, setLocalLoadingMap] = useState<{ [tabId: string]: boolean }>({});
  useQueueCancellation(tabId, ENDPOINT, setLocalLoadingMap);
  const { guardOffline } = useOfflineGuard();
  const loading = !!localLoadingMap[tabId] || getIsStreaming(tabId, ENDPOINT);

  // ✅ Moved generatedPlan before streamingContent to fix TDZ error
  const [generatedPlan, setGeneratedPlan] = useState<string>(savedData?.generatedPlan || '');

  const streamingContent = useStreamingRenderer({
    text: streamingPlan || generatedPlan,
    isStreaming: !!(loading && streamingPlan),
    fullFormatter: () => formatKindergartenText(streamingPlan || generatedPlan, tabColor),
    accentColor: tabColor,
  });

  const [historyOpen, setHistoryOpen] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draftsExpanded, setDraftsExpanded] = useState(true);
  const [kindergartenHistories, setKindergartenHistories] = useState<KindergartenHistory[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // State for structured editing
  const [parsedPlan, setParsedPlan] = useState<ParsedKindergartenPlan | null>(() => {
    // First check savedData (for resource manager view/edit)
    if (savedData?.parsedPlan && typeof savedData.parsedPlan === 'object') {
      return savedData.parsedPlan;
    }
    return null;
  });
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [useCurriculum, setUseCurriculum] = useState(true);

  const { activeClass, setActiveClass, config: activeConfig, hasConfig } = useActiveClass();
  const [availableClasses, setAvailableClasses] = useState<ClassSummary[]>([]);
  const [selectedClassName, setSelectedClassName] = useState<string>(activeClass?.key || '');
  const [classContextApplied, setClassContextApplied] = useState<string | null>(null);
  useEffect(() => { fetchClasses().then(setAvailableClasses).catch(() => {}); }, []);

  const applyClassConfig = (cfg: ClassConfig, label: string) => {
    setFormData(prev => applyClassDefaults(prev, cfg, kindergartenPlannerFieldMap));
    setClassContextApplied(label);
  };

  const handleSelectClass = async (value: string) => {
    setSelectedClassName(value);
    if (!value) { setClassContextApplied(null); setActiveClass(null); return; }
    const [gl, cls] = value.split('::');
    try {
      const cfg = await fetchClassConfig(cls, gl || undefined);
      applyClassConfig(cfg || {}, `Class ${cls}${gl ? ` (Grade ${gl})` : ''}`);
      setActiveClass(buildSelection(cls, gl || undefined));
    } catch (e) {
      console.error('Failed to load class config', e);
    }
  };

  // On mount: hydrate from global active class if present
  useEffect(() => {
    if (activeClass && !classContextApplied) {
      handleSelectClass(activeClass.key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Class defaults banner + Phase-4 target selector ─────────────────
  const [overrideOpen, setOverrideOpen] = useState(false);
  const filledLabels = React.useMemo(
    () => listFilledLabels(activeConfig, kindergartenPlannerFieldMap),
    [activeConfig]
  );
  const showBanner = hasConfig && filledLabels.length > 0;

  const [targetOccurrence, setTargetOccurrence] = useState<UpcomingOccurrence | null>(null);
  const targetValue = targetOccurrence ? `${targetOccurrence.slotId}::${targetOccurrence.dateISO}` : null;
  const handlePickOccurrence = (occ: UpcomingOccurrence | null) => {
    setTargetOccurrence(occ);
    if (!occ) return;
    setFormData(prev => ({
      ...prev,
      curriculumSubject: occ.subject || prev.curriculumSubject,
      duration: occ.durationMinutes > 0 ? `${occ.durationMinutes} minutes` : prev.duration,
      date: occ.dateISO || prev.date,
      dayOfWeek: occ.dayOfWeek || prev.dayOfWeek,
    }));
  };

  // Phase 5: consume pendingLessonTarget handoff from the dashboard widget.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('pendingLessonTarget');
      if (!raw) return;
      sessionStorage.removeItem('pendingLessonTarget');
      const target = JSON.parse(raw);
      if (!target || !target.slotId) return;

      if (target.className) {
        const sel = buildSelection(target.className, target.gradeLevel || undefined);
        setActiveClass(sel);
        handleSelectClass(sel.key);
      }

      handlePickOccurrence({
        slotId: target.slotId,
        date: new Date((target.dateISO || '') + 'T00:00:00'),
        dateISO: target.dateISO || '',
        dayOfWeek: target.dayOfWeek || '',
        startTime: target.startTime || '',
        endTime: target.endTime || '',
        durationMinutes: target.durationMinutes || 0,
        subject: target.subject || '',
        gradeLevel: target.gradeLevel || '',
        className: target.className || null,
      });
    } catch (e) {
      console.error('Failed to apply pendingLessonTarget:', e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // (Removed manual refs for initialization tracking)

  // Helper function to get default empty form data
  const getDefaultFormData = (): FormData => ({
    lessonTopic: '',
    curriculumUnit: '',
    week: '',
    dayOfWeek: '',
    date: new Date().toISOString().split('T')[0],
    ageGroup: '',
    students: '',
    creativityLevel: 50,
    learningDomains: [],
    duration: '60',
    additionalRequirements: '',
    includeAssessments: true,
    includeMaterials: true,
    curriculumSubject: '',
    strand: '',
    essentialOutcomes: '',
    specificOutcomes: '',
    learningStyles: [],
    pedagogicalStrategies: [],
    materials: '',
    prerequisiteSkills: '',
    specialNeeds: false,
    specialNeedsDetails: '',
  });

  const [formData, setFormData] = useState<FormData>(() => {
    const saved = savedData?.formData;
    // Robust validation: check if saved data exists AND has meaningful content
    if (saved && typeof saved === 'object' && saved.lessonTopic?.trim()) {
      return saved;
    }
    return getDefaultFormData();
  });

  const timetableAutofill = useTimetableAutofill(formData.ageGroup, formData.curriculumSubject);

  const { matchCount, matchedHistories, sortedHistories: sortedKindergartenHistories } = useHistoryMatching(formData, kindergartenHistories, { subject: 'curriculumSubject', gradeLevel: null });


  // ✅ ADDED: Restore state from localStorage when switching tabs
  useEffect(() => {
    const LOCAL_STORAGE_KEY = `kindergarten_state_${tabId}`;
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setFormData(parsed.formData || getDefaultFormData());
        setGeneratedPlan(parsed.generatedPlan || '');
        setParsedPlan(parsed.parsedPlan || null);
        setCurrentPlanId(parsed.currentPlanId || null);
        // localLoadingMap intentionally NOT restored — runtime-only state
        console.log('[KindergartenPlanner] State restored from localStorage for tab:', tabId);
      } catch (e) {
        console.error('[KindergartenPlanner] Failed to restore state:', e);
        setFormData(getDefaultFormData());
        setGeneratedPlan('');
        setParsedPlan(null);
        setCurrentPlanId(null);
        setLocalLoadingMap({});
      }
    }
  }, [tabId]);

  // ✅ ADDED: Save state to localStorage whenever it changes
  useEffect(() => {
    const LOCAL_STORAGE_KEY = `kindergarten_state_${tabId}`;
    const stateToSave = {
      formData,
      generatedPlan,
      parsedPlan,
      currentPlanId,
      // localLoadingMap intentionally NOT persisted — runtime-only state
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [tabId, formData, generatedPlan, parsedPlan, currentPlanId]);

  const curriculumUnits = ['Belonging', 'Weather', 'Celebrations', 'Plants and animals', 'Games'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const ageGroups = ['3-4 years', '4-5 years', '5-6 years'];
  
  const allLearningDomainsOptions = [
    'Social-Emotional Development',
    'Language & Literacy',
    'Mathematics',
    'Science & Discovery',
    'Creative Arts',
    'Physical Development',
    'Social Studies'
  ];

  // Map profile subjects to kindergarten learning domains
  const subjectToDomain: Record<string, string[]> = {
    'Mathematics': ['Mathematics'],
    'Language Arts': ['Language & Literacy'],
    'Science': ['Science & Discovery'],
    'Social Studies': ['Social Studies'],
    'Art': ['Creative Arts'],
    'Music': ['Creative Arts'],
    'Physical Education': ['Physical Development'],
    'Health & Family Life': ['Social-Emotional Development'],
  };

  const learningDomainsOptions = filterLearningDomains(
    allLearningDomainsOptions,
    settings.profile.gradeSubjects || {},
    settings.profile.filterContentByProfile,
  );

  // Try to parse plan when generated (for restored/loaded plans)
  useEffect(() => {
    if (generatedPlan && !parsedPlan) {
      console.log('Attempting to parse loaded/restored kindergarten plan...');
      const parsed = parseKindergartenContent(generatedPlan, formData);
      if (parsed) {
        console.log('Loaded kindergarten plan parsed successfully');
        setParsedPlan(parsed);
      } else {
        console.log('Loaded kindergarten plan parsing failed');
      }
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

  // ✅ Simple localStorage restoration on tab change
  useEffect(() => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setFormData(parsed.formData || getDefaultFormData());
        setGeneratedPlan(parsed.generatedPlan || '');
        setParsedPlan(parsed.parsedPlan || null);
        setCurrentPlanId(parsed.currentPlanId || null);
      } catch (e) {
        console.error('Failed to parse saved state:', e);
        // Reset to defaults on parse error
        setFormData(getDefaultFormData());
        setGeneratedPlan('');
        setParsedPlan(null);
        setCurrentPlanId(null);
      }
    } else {
      // No saved state - use defaults
      setFormData(getDefaultFormData());
      setGeneratedPlan('');
      setParsedPlan(null);
      setCurrentPlanId(null);
    }
  }, [tabId]);

  // ✅ Persist to localStorage on every change
  useEffect(() => {
    const stateToSave = {
      formData,
      generatedPlan,
      parsedPlan,
      currentPlanId
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [formData, generatedPlan, parsedPlan, currentPlanId]);

  // ✅ Also notify parent (for backward compatibility)
  useEffect(() => {
    onDataChange({ formData, generatedPlan, streamingPlan, parsedPlan });
  }, [formData, generatedPlan, streamingPlan, parsedPlan]);

  // ✅ Establish connection when tab mounts
  useEffect(() => {
    getConnection(tabId, ENDPOINT);
  }, [tabId]);

  // ✅ Subscribe to streaming updates — listener MUST force a re-render
  // or per-token streaming will be invisible (see feedback memory).
  const [, forceStreamRerender] = useReducer((x: number) => x + 1, 0);
  useEffect(() => {
    const unsubscribe = subscribe(tabId, ENDPOINT, () => {
      forceStreamRerender();
    });
    return unsubscribe;
  }, [tabId, subscribe]);

  // ✅ Finalization effect - runs when streaming completes
  useEffect(() => {
    if (streamingPlan && !getIsStreaming(tabId, ENDPOINT)) {
      setGeneratedPlan(streamingPlan);
      const parsed = parseKindergartenContent(streamingPlan, formData);
      if (parsed) setParsedPlan(parsed);
      clearStreaming(tabId, ENDPOINT);
      setLocalLoadingMap(prev => {
        const newMap = { ...prev };
        delete newMap[tabId];
        return newMap;
      });
    }
  }, [streamingPlan]);

  // Handle inline edits from KindergartenTable
  const handleKindergartenInlineChange = (updated: ParsedKindergartenPlan) => {
    setParsedPlan(updated);
    setGeneratedPlan(kindergartenPlanToDisplayText(updated));
  };

  const loadKindergartenHistories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/kindergarten-history');
      setKindergartenHistories(response.data);
    } catch (error) {
      console.error('Failed to load kindergarten histories:', error);
    }
  };

  const savePlan = async () => {
    if (!generatedPlan && !parsedPlan) {
      alert('No plan to save');
      return;
    }

    setSaveStatus('saving');
    try {
      // Build a proper title with fallbacks
      const title = formData.lessonTopic?.trim()
        ? `${formData.lessonTopic} - ${formData.curriculumUnit || 'General'} (${formData.ageGroup || 'All Ages'})`
        : `Kindergarten Plan - ${formData.curriculumUnit || 'General'} (${formData.ageGroup || 'All Ages'})`;
      
      const planData = {
        id: currentPlanId || `kindergarten_${Date.now()}`,
        title: title,
        timestamp: new Date().toISOString(),
        formData: formData,
        generatedPlan: generatedPlan,  // ✅ Save original clean text
        parsedPlan: parsedPlan || undefined,
        // Phase 5: link to a specific upcoming timetable occurrence so the
        // "Lessons Needing Plans" widget can drop it off the unplanned list.
        timetable_slot_id: targetOccurrence?.slotId,
        scheduled_for: targetOccurrence?.dateISO,
      };

      if (!currentPlanId) {
        setCurrentPlanId(planData.id);
      }

      await axios.post('http://localhost:8000/api/kindergarten-history', planData);
      await loadKindergartenHistories();
      setSaveStatus('saved');
      triggerCheck();
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save kindergarten plan:', error);
      alert('Failed to save kindergarten plan');
      setSaveStatus('idle');
    }
  };

  const loadKindergartenHistory = (history: KindergartenHistory) => {
    setFormData(history.formData);
    setGeneratedPlan(history.generatedPlan);
    setParsedPlan(history.parsedPlan || null);
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

  // Removed old exportPlan logic; now handled by ExportButton

  const loadDrafts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/lesson-drafts?plannerType=kindergarten');
      setDrafts(response.data);
    } catch (error) {
      console.error('Failed to load drafts:', error);
    }
  };

  const loadDraft = (draft: Draft) => {
    setFormData(draft.formData);
    setGeneratedPlan('');
    setParsedPlan(null);
    setCurrentPlanId(null);
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
    loadKindergartenHistories();
    loadDrafts();
  }, []);

  useEffect(() => {
    if (timetableAutofill.isLoading) return;
    setFormData(prev => {
      if (!prev.duration && timetableAutofill.duration) {
        return { ...prev, duration: timetableAutofill.duration };
      }
      return prev;
    });
  }, [timetableAutofill.duration, timetableAutofill.isLoading]);

  // Helper function to calculate ISO week number
  const getISOWeek = (date: Date): number => {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  };

  // Helper function to get day of week name
  const getDayOfWeek = (date: Date): string => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  };

  // Helper function to get date from ISO week and day of week
  const getDateFromWeekAndDay = (week: number, dayOfWeek: string, year?: number): string => {
    const targetYear = year || new Date().getFullYear();
    // Find the first Thursday of the year (ISO week 1)
    const jan4 = new Date(targetYear, 0, 4);
    const dayOfWeekJan4 = jan4.getDay() || 7; // 1=Monday, 7=Sunday
    const firstThursday = new Date(jan4);
    firstThursday.setDate(jan4.getDate() - dayOfWeekJan4 + 4); // Thursday is 4
    // First Monday of ISO week 1
    const firstMonday = new Date(firstThursday);
    firstMonday.setDate(firstThursday.getDate() - 3); // Monday is 3 days before Thursday
    // Start of the target week
    const weekStart = new Date(firstMonday);
    weekStart.setDate(firstMonday.getDate() + (week - 1) * 7);
    // Add days for the specific day
    const dayIndex = daysOfWeek.indexOf(dayOfWeek);
    if (dayIndex === -1) return '';
    const targetDate = new Date(weekStart);
    targetDate.setDate(weekStart.getDate() + dayIndex);
    return targetDate.toISOString().split('T')[0];
  };

  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      if (field === 'week' || field === 'dayOfWeek') {
        if (newData.week && newData.dayOfWeek) {
          const year = newData.date ? new Date(newData.date).getFullYear() : new Date().getFullYear();
          const calculatedDate = getDateFromWeekAndDay(parseInt(newData.week), newData.dayOfWeek, year);
          if (calculatedDate) {
            newData.date = calculatedDate;
          }
        }
      }
      return newData;
    });
    if (validationErrors[field]) {
      setValidationErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  // Handler for date change with automatic week/day calculation
  const handleDateChange = (dateString: string) => {
    handleInputChange('date', dateString);
    
    // Try to parse the date and calculate week/day
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const weekNumber = getISOWeek(date);
      const dayName = getDayOfWeek(date);
      
      handleInputChange('week', weekNumber.toString());
      handleInputChange('dayOfWeek', dayName);
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

  const generatePlan = () => {
    if (guardOffline()) return;
    if (!validateForm()) {
      return;
    }

    // Map formData to match the prompt builder's expected interface
    const mappedData = {
      ...formData,
      theme: formData.lessonTopic,
      day: formData.dayOfWeek
    };

    const prompt = buildKindergartenPrompt(mappedData, settings.language);

    const [pickedGrade, pickedClass] = (selectedClassName || '').split('::');
    const formDataWithClass = {
      ...formData,
      className: pickedClass || (formData as any).className || '',
      gradeLevel: (formData as any).gradeLevel || pickedGrade || '',
    };

    if (queueEnabled) {
      enqueue({
        label: `Kindergarten Plan - ${formData.lessonTopic || 'Untitled'}`,
        toolType: 'Kindergarten Plan',
        tabId,
        endpoint: ENDPOINT,
        prompt,
        generationMode: settings.generationMode,
        extraMessageData: { formData: formDataWithClass },
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
        formData: formDataWithClass,
        generationMode: settings.generationMode,
      }));
    } catch (error) {
      console.error('Failed to send kindergarten plan request:', error);
    }
  };

  const clearForm = () => {
    setFormData(getDefaultFormData());
    setGeneratedPlan('');
    setCurrentPlanId(null);
    setParsedPlan(null);
    
    // ✅ Clear localStorage for this tab
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  };

  const validateForm = (): boolean => {
    const errors: Record<string, boolean> = {};
    if (!formData.curriculumUnit) errors.curriculumUnit = true;
    if (!formData.week) errors.week = true;
    if (!formData.dayOfWeek) errors.dayOfWeek = true;
    if (!formData.ageGroup) errors.ageGroup = true;
    if (!formData.students) errors.students = true;
    if (formData.learningDomains.length === 0) errors.learningDomains = true;
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      setTimeout(() => {
        const firstError = document.querySelector('[data-validation-error="true"]');
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
    return Object.keys(errors).length === 0;
  };

  return (
    <div className="flex h-full tab-content-bg relative" data-tutorial="kinder-planner-welcome">
      <div className="flex-1 flex flex-col tab-content-bg">
        {(generatedPlan || streamingPlan || loading) ? (
          <>
            {loading && !streamingPlan && !generatedPlan ? (
              <GeneratorSkeleton accentColor={tabColor} type="plan" />
            ) : (
              // Show generated plan (existing display code)
              <>
                <div className="border-b border-theme p-4 flex items-center justify-between flex-shrink-0">
                  <div>
                    <h2 className="text-xl font-semibold text-theme-heading">
                      {loading ? 'Generating Kindergarten Plan...' : 'Generated Kindergarten Plan'}
                    </h2>
                    <p className="text-sm text-theme-hint">{formData.lessonTopic} - {formData.curriculumUnit}</p>
                  </div>
                  {!loading && (
                    <div className="flex items-center gap-2">
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
                        dataType="kindergarten"
                        data={{
                          content: parsedPlan ? kindergartenPlanToDisplayText(parsedPlan) : generatedPlan,
                          parsedKindergartenPlan: parsedPlan,
                          formData: formData,
                          accentColor: tabColor
                        }}
                        filename={`kindergarten-${formData.lessonTopic.toLowerCase().replace(/\s+/g, '-')}`}
                        className="ml-2 !px-3.5 !py-1.5 !text-[13.5px]"
                      />
                      <button
                        onClick={() => setHistoryOpen(!historyOpen)}
                        className="relative p-2 rounded-lg hover:bg-theme-hover transition"
                        title={t('planners.kindergartenHistory')}
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
                          setParsedPlan(null);
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
                              <span className="text-white text-sm font-medium">{formData.curriculumUnit}</span>
                            </div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                              <span className="text-white text-sm font-medium">{formData.ageGroup}</span>
                            </div>
                          </div>

                          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
                            {formData.lessonTopic}
                          </h1>

                          <div className="flex flex-wrap items-center gap-4 text-pink-100">
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
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-pink-200 rounded-full mr-2"></div>
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
                                <div className="text-xs text-pink-100">Early childhood plan</div>
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

                  <div className="max-w-none">
                    {parsedPlan && !loading ? (
                      <GeneratorShell accentColor={tabColor}>
                        <KindergartenTable
                          plan={parsedPlan}
                          accentColor={tabColor}
                          editable
                          onChange={handleKindergartenInlineChange}
                        />
                      </GeneratorShell>
                    ) : (
                      <GeneratorShell accentColor={tabColor} isStreaming={!!(loading && streamingPlan)}>
                        <StreamingTextView
                          text={streamingPlan || generatedPlan}
                          isStreaming={!!(loading && streamingPlan)}
                          accentColor={tabColor}
                          renderFormatted={() => streamingContent}
                        />
                      </GeneratorShell>
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
            )}
          </>
        ) : (
          <>
            <div className="border-b border-theme p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-theme-heading">Early Childhood Planner</h2>
                <p className="text-sm text-theme-hint">Generate engaging, developmentally appropriate lesson plans tailored to your kindergarten students</p>
              </div>
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="relative p-2 rounded-lg hover:bg-theme-hover transition"
                title={t('planners.kindergartenHistory')}
              >
                <History className="w-5 h-5 text-theme-muted" />
                {matchCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold leading-none px-1">{matchCount}</span>
                )}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto space-y-6">

                {showBanner && (
                  <ClassDefaultsBanner
                    classLabel={activeClass?.label || classContextApplied || 'selected class'}
                    filledFieldLabels={filledLabels}
                    overrideOpen={overrideOpen}
                    onToggleOverride={() => setOverrideOpen(v => !v)}
                    accentColor={tabColor}
                  />
                )}

                <GenerateForSelector
                  value={targetValue}
                  onPick={handlePickOccurrence}
                  accentColor={tabColor}
                />

                {/* Class picker -- auto-fills all class-level fields from Class Manager */}
                <div className="rounded-xl p-4 border border-dashed" style={{ borderColor: tabColor, backgroundColor: `${tabColor}10` }}>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: tabColor }}>
                    Class (auto-fills from Class Manager settings)
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedClassName}
                      onChange={(e) => handleSelectClass(e.target.value)}
                      className="flex-1 px-3 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent text-sm"
                      style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                    >
                      <option value="">-- Select a class (optional) --</option>
                      {availableClasses.map(c => {
                        const key = `${c.grade_level || ''}::${c.class_name}`;
                        const hasCfg = c.config && Object.keys(c.config).length > 0;
                        return (
                          <option key={key} value={key}>
                            {c.grade_level ? `Grade ${c.grade_level} -- ` : ''}Class {c.class_name}
                            {hasCfg ? '  [configured]' : '  [no settings]'}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  {classContextApplied && (
                    <p className="text-xs mt-2 text-theme-muted">
                      Auto-filled from <strong>{classContextApplied}</strong>. You can still override any field below.
                    </p>
                  )}
                </div>

                <div data-tutorial="kinder-planner-theme">
                  <label className="block text-sm font-medium text-theme-label mb-2">
                    {t('forms.topic')} <span className="text-xs" style={{ color: 'var(--text-muted)' }}>(optional)</span>
                  </label>
                  <SmartInput
                    value={formData.lessonTopic}
                    onChange={(val) => handleInputChange('lessonTopic', val)}
                    data-validation-error={validationErrors.lessonTopic ? 'true' : undefined}
                    className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 ${validationErrors.lessonTopic ? 'validation-error' : ''}`}
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                    placeholder="e.g., Exploring Colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-theme-label mb-2">
                    Curriculum Unit <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.curriculumUnit}
                    onChange={(e) => handleInputChange('curriculumUnit', e.target.value)}
                    data-validation-error={validationErrors.curriculumUnit ? 'true' : undefined}
                    className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 ${validationErrors.curriculumUnit ? 'validation-error' : ''}`}
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                  >
                    <option value="">Select unit</option>
                    {curriculumUnits.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-theme-label mb-2">
                      Week <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.week}
                      onChange={(e) => handleInputChange('week', e.target.value)}
                      data-validation-error={validationErrors.week ? 'true' : undefined}
                      className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 ${validationErrors.week ? 'validation-error' : ''}`}
                      style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-theme-label mb-2">
                      Day of Week <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.dayOfWeek}
                      onChange={(e) => handleInputChange('dayOfWeek', e.target.value)}
                      data-validation-error={validationErrors.dayOfWeek ? 'true' : undefined}
                      className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 ${validationErrors.dayOfWeek ? 'validation-error' : ''}`}
                      style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                    >
                      <option value="">Select day</option>
                      {daysOfWeek.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-theme-label mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                      style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-theme-label mb-2">
                      Age Group <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.ageGroup}
                      onChange={(e) => handleInputChange('ageGroup', e.target.value)}
                      data-validation-error={validationErrors.ageGroup ? 'true' : undefined}
                      className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-pink-500 ${validationErrors.ageGroup ? 'validation-error' : ''}`}
                    >
                      <option value="">Select age group</option>
                      {ageGroups.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-theme-label mb-2">
                      Students <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.students}
                      onChange={(e) => handleInputChange('students', e.target.value)}
                      data-validation-error={validationErrors.students ? 'true' : undefined}
                      className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 ${validationErrors.students ? 'validation-error' : ''}`}
                      style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                    />
                  </div>
                </div>

                <div data-tutorial="kinder-planner-centers">
                  <label className="block text-sm font-medium text-theme-label mb-2">
                    Creativity Level <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-theme-muted">Structured</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.creativityLevel}
                      onChange={(e) => handleInputChange('creativityLevel', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm text-theme-muted">Highly Creative</span>
                  </div>
                  <p className="text-xs text-theme-hint mt-2 text-center">
                    {formData.creativityLevel < 33 ? 'Structured' : formData.creativityLevel < 67 ? 'Balanced' : 'Highly Creative'}
                  </p>
                </div>

                <div data-tutorial="kinder-planner-learning-areas">
                  <label className="block text-sm font-medium text-theme-label mb-3">
                    Learning Domains <span className="text-red-500">*</span>
                  </label>
                  <div
                    data-validation-error={validationErrors.learningDomains ? 'true' : undefined}
                    className={`grid grid-cols-2 gap-2 ${validationErrors.learningDomains ? 'validation-error rounded-lg' : ''}`}
                  >
                    {learningDomainsOptions.map(domain => (
                      <label key={domain} className="flex items-center space-x-2 p-2 rounded hover:bg-theme-subtle cursor-pointer">
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

                <div>
                  <label className="block text-sm font-medium text-theme-label mb-2">
                    {t('forms.subject')}
                  </label>
                  <select
                    value={formData.curriculumSubject}
                    onChange={(e) => {
                      handleInputChange('curriculumSubject', e.target.value);
                      handleInputChange('strand', '');
                      handleInputChange('essentialOutcomes', '');
                      handleInputChange('specificOutcomes', '');
                    }}
                    className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                  >
                    <option value="">Select a subject</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Language Arts">Language Arts</option>
                    <option value="Science">Science</option>
                    <option value="Social Studies">Social Studies</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <CurriculumAlignmentFields
                    subject={formData.curriculumSubject}
                    gradeLevel="K"
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
                    subject={formData.curriculumSubject}
                    gradeLevel="K"
                    strand={formData.strand}
                    useCurriculum={useCurriculum}
                    essentialOutcomes={formData.essentialOutcomes}
                    specificOutcomes={formData.specificOutcomes}
                  />
                </div>

                <div data-tutorial="kinder-planner-circle-time">
                  <label className="block text-sm font-medium text-theme-label mb-2">
                    {t('forms.duration')} <span className="text-red-500">*</span>
                  </label>
                  <DurationPicker
                    value={formData.duration}
                    onChange={(val) => handleInputChange('duration', val)}
                    accentColor={tabColor}
                    placeholder="15 minutes to 8 hours"
                  />
                </div>

                <div data-tutorial="kinder-planner-play-activities">
                  <label className="block text-sm font-medium text-theme-label mb-2">
                    Additional Requirements
                  </label>
                  <SmartTextArea
                    value={formData.additionalRequirements}
                    onChange={(val) => handleInputChange('additionalRequirements', val)}
                    rows={3}
                    className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                  />
                </div>

                {/* Class Context & Accommodations */}
                <div className="border border-theme rounded-xl p-4 space-y-5">
                  <h3 className="text-sm font-semibold text-theme-heading">Class Context &amp; Accommodations</h3>

                  {/* Learning Styles */}
                  <div>
                    <label className="block text-sm font-medium text-theme-label mb-2">Learning Styles</label>
                    <div className="grid grid-cols-2 gap-2 p-2 rounded-lg">
                      {['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic'].map(style => (
                        <label key={style} className="flex items-center space-x-2 p-2 rounded hover:bg-theme-subtle cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.learningStyles.includes(style)}
                            onChange={() => {
                              const next = formData.learningStyles.includes(style)
                                ? formData.learningStyles.filter(s => s !== style)
                                : [...formData.learningStyles, style];
                              handleInputChange('learningStyles', next);
                            }}
                            className="w-4 h-4 rounded focus:ring-2"
                            style={{ accentColor: tabColor, '--tw-ring-color': tabColor } as React.CSSProperties}
                          />
                          <span className="text-sm text-theme-label">{style}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Pedagogical Strategies */}
                  <div>
                    <label className="block text-sm font-medium text-theme-label mb-2">Pedagogical Strategies</label>
                    <div className="grid grid-cols-2 gap-2 p-2 rounded-lg">
                      {['Direct instruction', 'Inquiry-based', 'Play-based', 'Differentiated', 'Collaborative', 'Scaffolded', 'Gamified'].map(strategy => (
                        <label key={strategy} className="flex items-center space-x-2 p-2 rounded hover:bg-theme-subtle cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.pedagogicalStrategies.includes(strategy)}
                            onChange={() => {
                              const next = formData.pedagogicalStrategies.includes(strategy)
                                ? formData.pedagogicalStrategies.filter(s => s !== strategy)
                                : [...formData.pedagogicalStrategies, strategy];
                              handleInputChange('pedagogicalStrategies', next);
                            }}
                            className="w-4 h-4 rounded focus:ring-2"
                            style={{ accentColor: tabColor, '--tw-ring-color': tabColor } as React.CSSProperties}
                          />
                          <span className="text-sm text-theme-label">{strategy}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Materials */}
                  <div>
                    <label className="block text-sm font-medium text-theme-label mb-2">Available Materials</label>
                    <SmartTextArea
                      value={formData.materials}
                      onChange={(val) => handleInputChange('materials', val)}
                      rows={2}
                      className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                      style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                      placeholder="Materials available for this lesson"
                    />
                  </div>

                  {/* Prerequisite Skills */}
                  <div>
                    <label className="block text-sm font-medium text-theme-label mb-2">Prerequisite Skills</label>
                    <SmartTextArea
                      value={formData.prerequisiteSkills}
                      onChange={(val) => handleInputChange('prerequisiteSkills', val)}
                      rows={2}
                      className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                      style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                      placeholder="Skills students should already have"
                    />
                  </div>

                  {/* Special Needs */}
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
                      <label className="block text-sm font-medium text-theme-label mb-2">Special Needs Details</label>
                      <SmartTextArea
                        value={formData.specialNeedsDetails}
                        onChange={(val) => handleInputChange('specialNeedsDetails', val)}
                        rows={2}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                        placeholder="Describe specific accommodations or modifications needed"
                      />
                    </div>
                  )}
                </div>

                <div data-tutorial="kinder-planner-assessment">
                  <label className="block text-sm font-medium text-theme-label mb-3">
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

            <div className="border-t border-theme p-4 bg-theme-secondary">
              <div className="max-w-3xl mx-auto flex items-center justify-between">
                <AIDisclaimer inline />
                <div className="flex gap-2">
                  <button
                    onClick={clearForm}
                    className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5 mr-2" />
                    Clear Form
                  </button>
                  <button
                    onClick={generatePlan}
                    disabled={loading}
                    className="flex items-center px-6 py-2 text-white rounded-lg disabled:bg-theme-tertiary transition"
                    style={loading ? {} : { backgroundColor: tabColor }}
                    onMouseEnter={(e) => !loading && (e.currentTarget.style.opacity = '0.9')}
                    onMouseLeave={(e) => !loading && (e.currentTarget.style.opacity = '1')}
                    data-tutorial="kinder-planner-generate"
                  >
                    {loading ? (
                      <>
                        <HeartbeatLoader className="w-5 h-5 mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Baby className="w-5 h-5 mr-2" />
                        Generate Lesson Plan
                      </>
                    )}
                  </button>
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
            <h3 className="text-lg font-semibold text-theme-heading">Saved Kindergarten Plans</h3>
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
            {kindergartenHistories.length === 0 && drafts.length === 0 ? (
              <div className="text-center text-theme-hint mt-8">
                <GraduationCap className="w-12 h-12 mx-auto mb-2 text-theme-hint" />
                <p className="text-sm">No saved kindergarten plans yet</p>
              </div>
            ) : (
              <>
                {matchCount > 0 && <div className="mb-2"><span className="text-xs font-medium text-blue-400">Matching ({matchCount})</span></div>}
                {(matchCount > 0 ? sortedKindergartenHistories : kindergartenHistories).map((history, idx) => (
                  <React.Fragment key={history.id}>
                    {matchCount > 0 && idx === matchedHistories.length && (
                      <div className="my-3 border-b border-theme">
                        <span className="text-xs font-medium text-theme-hint">Other</span>
                      </div>
                    )}
                    <div
                      onClick={() => loadKindergartenHistory(history)}
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
                          onClick={(e) => deleteKindergartenHistory(history.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition"
                          title="Delete kindergarten plan"
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
        contentType="kindergarten"
        onContentUpdate={(newContent) => {
          setGeneratedPlan(newContent);
          const parsed = parseKindergartenContent(newContent, formData);
          if (parsed) setParsedPlan(parsed);
        }}
      />

      {/* Tutorial Components */}
      <TutorialOverlay
        steps={tutorials[TUTORIAL_IDS.KINDERGARTEN_PLANNER].steps}
        onComplete={handleTutorialComplete}
        autoStart={showTutorial}
        showFloatingButton={false}
      />


      {/* Disable local TutorialButton (handled globally in Dashboard) */}
      
    </div>
  );
};

export default KindergartenPlanner;