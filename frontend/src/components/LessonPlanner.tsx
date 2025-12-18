import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { ChevronRight, ChevronLeft, Loader2, FileText, Trash2, Save, Download, History, X, Edit, Sparkles } from 'lucide-react';
import ExportButton from './ExportButton';
import AIAssistantPanel from './AIAssistantPanel';
import curriculumIndex from '../data/curriculumIndex.json';
import CurriculumReferences from './CurriculumReferences';
import LessonEditor from './LessonEditor';
import type { ParsedLesson } from './LessonEditor';
import axios from 'axios';
import { buildLessonPrompt } from '../utils/lessonPromptBuilder';
import { useSettings } from '../contexts/SettingsContext';
import { TutorialOverlay } from './TutorialOverlay';
import { TutorialButton } from './TutorialButton';
import { tutorials, TUTORIAL_IDS } from '../data/tutorialSteps';

interface LessonPlannerProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
  onOpenCurriculumTab?: (route: string) => void;
}

interface LessonPlanHistory {
  id: string;
  title: string;
  timestamp: string;
  formData: FormData;
  generatedPlan: string;
  parsedLesson?: ParsedLesson;
}

// Add this new interface near the top of the file with other interfaces
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
        <div key={`numbered-${currentIndex++}`} className="mb-3 flex items-start">
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

// Parse lesson plan text content into structured ParsedLesson format
const parseLessonContent = (text: string, formData: FormData, curriculumRefs: CurriculumReference[]): ParsedLesson | null => {
  if (!text) return null;

  try {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Extract metadata from form data and generated content
    const metadata = {
      title: formData.topic || 'Lesson Plan',
      subject: formData.subject,
      gradeLevel: formData.gradeLevel,
      strand: formData.strand,
      topic: formData.topic,
      duration: formData.duration,
      studentCount: formData.studentCount,
      date: new Date().toLocaleDateString()
    };

    // Parse learning objectives
    const learningObjectives: string[] = [];
    const objectivesSection = text.match(/\*\*Learning Objectives:\*\*(.*?)(?=\*\*|$)/s);
    if (objectivesSection) {
      const objText = objectivesSection[1];
      const objMatches = objText.match(/(?:^|\n)\s*[\*\-•]\s+(.+)/g);
      if (objMatches) {
        objMatches.forEach(match => {
          const cleaned = match.replace(/^\s*[\*\-•]\s+/, '').trim();
          if (cleaned) learningObjectives.push(cleaned);
        });
      }
    }
    
    // Fallback: use specific outcomes from form if no objectives found
    if (learningObjectives.length === 0 && formData.specificOutcomes) {
      formData.specificOutcomes.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed) learningObjectives.push(trimmed);
      });
    }

    // Parse materials needed
    const materials: string[] = [];
    const materialsSection = text.match(/\*\*Materials(?:\s+Needed)?:\*\*(.*?)(?=\*\*|$)/s);
    if (materialsSection) {
      const matText = materialsSection[1];
      const matMatches = matText.match(/(?:^|\n)\s*[\*\-•]\s+(.+)/g);
      if (matMatches) {
        matMatches.forEach(match => {
          const cleaned = match.replace(/^\s*[\*\-•]\s+/, '').trim();
          if (cleaned) materials.push(cleaned);
        });
      }
    }
    
    // Fallback: use materials from form
    if (materials.length === 0 && formData.materials) {
      formData.materials.split('\n').forEach(line => {
        const trimmed = line.trim();
        if (trimmed) materials.push(trimmed);
      });
    }

    // Parse lesson sections
    const sections: Array<{ id: string; name: string; content: string }> = [];
    const sectionPatterns = [
      'Introduction',
      'Main Activity',
      'Guided Practice',
      'Independent Practice',
      'Conclusion',
      'Assessment',
      'Warm-up',
      'Development',
      'Closure',
      'Extension Activities',
      'Differentiation'
    ];

    sectionPatterns.forEach((sectionName, index) => {
      const regex = new RegExp(`\\*\\*${sectionName}:?\\*\\*([\\s\\S]*?)(?=\\*\\*(?:${sectionPatterns.join('|')})|$)`, 'i');
      const match = text.match(regex);
      if (match && match[1]) {
        const content = match[1].trim();
        if (content) {
          sections.push({
            id: `section_${index}`,
            name: sectionName,
            content: content
          });
        }
      }
    });

    // Parse assessment methods
    const assessmentMethods: string[] = [];
    const assessmentSection = text.match(/\*\*Assessment(?:\s+Methods)?:\*\*(.*?)(?=\*\*|$)/s);
    if (assessmentSection) {
      const assessText = assessmentSection[1];
      const assessMatches = assessText.match(/(?:^|\n)\s*[\*\-•]\s+(.+)/g);
      if (assessMatches) {
        assessMatches.forEach(match => {
          const cleaned = match.replace(/^\s*[\*\-•]\s+/, '').trim();
          if (cleaned) assessmentMethods.push(cleaned);
        });
      }
    }

    // Parse optional fields
    const pedagogicalStrategies = formData.pedagogicalStrategies.length > 0
      ? formData.pedagogicalStrategies
      : undefined;
    
    const learningStyles = formData.learningStyles.length > 0
      ? formData.learningStyles
      : undefined;

    const prerequisites = formData.prerequisiteSkills || undefined;
    const specialNeeds = formData.specialNeeds && formData.specialNeedsDetails
      ? formData.specialNeedsDetails
      : undefined;
    const additionalNotes = formData.additionalInstructions || undefined;

    return {
      metadata,
      learningObjectives: learningObjectives.length > 0 ? learningObjectives : ['No objectives found'],
      materials: materials.length > 0 ? materials : ['No materials specified'],
      sections: sections.length > 0 ? sections : [{
        id: 'section_0',
        name: 'Lesson Content',
        content: text.substring(0, 500) + '...'
      }],
      assessmentMethods: assessmentMethods.length > 0 ? assessmentMethods : ['Observation', 'Q&A'],
      pedagogicalStrategies,
      learningStyles,
      prerequisites,
      specialNeeds,
      additionalNotes,
      curriculumReferences: curriculumRefs.length > 0 ? curriculumRefs : undefined
    };
  } catch (error) {
    console.error('Failed to parse lesson plan:', error);
    return null;
  }
};

// Convert ParsedLesson back to display text format
const lessonToDisplayText = (lesson: ParsedLesson): string => {
  let output = '';
  
  // Add metadata header
  output += `**Lesson Plan: ${lesson.metadata.title}**\n\n`;
  output += `**Grade Level:** ${lesson.metadata.gradeLevel}\n`;
  output += `**Subject:** ${lesson.metadata.subject}\n`;
  output += `**Strand:** ${lesson.metadata.strand}\n`;
  output += `**Topic:** ${lesson.metadata.topic}\n`;
  output += `**Duration:** ${lesson.metadata.duration} minutes\n`;
  output += `**Date:** ${lesson.metadata.date}\n\n`;
  
  // Learning Objectives
  output += `**Learning Objectives:**\n`;
  lesson.learningObjectives.forEach(obj => {
    output += `* ${obj}\n`;
  });
  output += '\n';
  
  // Materials
  output += `**Materials Needed:**\n`;
  lesson.materials.forEach(mat => {
    output += `* ${mat}\n`;
  });
  output += '\n';
  
  // Prerequisites if present
  if (lesson.prerequisites) {
    output += `**Prerequisites:**\n${lesson.prerequisites}\n\n`;
  }
  
  // Lesson Sections
  lesson.sections.forEach(section => {
    output += `**${section.name}:**\n`;
    output += `${section.content}\n\n`;
  });
  
  // Assessment Methods
  if (lesson.assessmentMethods.length > 0) {
    output += `**Assessment:**\n`;
    lesson.assessmentMethods.forEach(method => {
      output += `* ${method}\n`;
    });
    output += '\n';
  }
  
  // Pedagogical Strategies if present
  if (lesson.pedagogicalStrategies && lesson.pedagogicalStrategies.length > 0) {
    output += `**Pedagogical Strategies:**\n`;
    output += lesson.pedagogicalStrategies.join(', ') + '\n\n';
  }
  
  // Learning Styles if present
  if (lesson.learningStyles && lesson.learningStyles.length > 0) {
    output += `**Learning Styles:**\n`;
    output += lesson.learningStyles.join(', ') + '\n\n';
  }
  
  // Special Needs if present
  if (lesson.specialNeeds) {
    output += `**Special Needs Accommodations:**\n${lesson.specialNeeds}\n\n`;
  }
  
  // Additional Notes if present
  if (lesson.additionalNotes) {
    output += `**Additional Notes:**\n${lesson.additionalNotes}\n`;
  }
  
  return output;
};

const LessonPlanner: React.FC<LessonPlannerProps> = ({ tabId, savedData, onDataChange, onOpenCurriculumTab }) => {
  // Per-tab localStorage key
  const LOCAL_STORAGE_KEY = `lesson_state_${tabId}`;

  const { settings, markTutorialComplete, isTutorialCompleted } = useSettings();
  const tabColor = settings.tabColors['lesson-planner'];
  const [showTutorial, setShowTutorial] = useState(false);

  // WebSocketContext API and streaming state logic
  const ENDPOINT = '/ws/lesson-plan';
  const { getConnection, getStreamingContent, getIsStreaming, clearStreaming, subscribe } = useWebSocket();

  const streamingPlan = getStreamingContent(tabId, ENDPOINT);
  const [localLoading, setLocalLoading] = useState(false);
  const loading = localLoading || getIsStreaming(tabId, ENDPOINT);

  const [historyOpen, setHistoryOpen] = useState(false);
  const [lessonPlanHistories, setLessonPlanHistories] = useState<LessonPlanHistory[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isEditing, setIsEditing] = useState(false);
  const [parsedLesson, setParsedLesson] = useState<ParsedLesson | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [curriculumMatches, setCurriculumMatches] = useState<CurriculumReference[]>([]);
  const [loadingCurriculum, setLoadingCurriculum] = useState(false);
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

  // Start with defaults - will be restored from localStorage
  const [formData, setFormData] = useState<FormData>(getDefaultFormData());
  const [generatedPlan, setGeneratedPlan] = useState<string>('');
  const [step, setStep] = useState<number>(1);

  // Try to parse lesson when generated (for restored/loaded lessons)
  useEffect(() => {
    if (generatedPlan && !parsedLesson) {
      console.log('Attempting to parse loaded/restored lesson...');
      const parsed = parseLessonContent(generatedPlan, formData, curriculumReferences || []);
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
      // Only search if we have subject, grade, and strand
      if (!formData.subject || !formData.gradeLevel || !formData.strand) {
        setCurriculumMatches([]);
        return;
      }

      setLoadingCurriculum(true);
      try {
        // Use the curriculum index to find matches
        const pages = (curriculumIndex as any).indexedPages || [];
        const matches = pages.filter((page: any) => {
          return (
            page.subject?.toLowerCase() === formData.subject.toLowerCase() &&
            page.grade === formData.gradeLevel &&
            page.strand?.toLowerCase().includes(formData.strand.toLowerCase())
          );
        });

        setCurriculumMatches(matches.slice(0, 10)); // Limit to 10 results
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


  // Restore state from localStorage on tab change
  useEffect(() => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setFormData(parsed.formData || getDefaultFormData());
        setGeneratedPlan(parsed.generatedPlan || '');
        setParsedLesson(parsed.parsedLesson || null);
        setCurrentPlanId(parsed.currentPlanId || null);
        setStep(parsed.step || 1);
        setCurriculumReferences(parsed.curriculumReferences || []);
      } catch (e) {
        console.error('Failed to parse saved state:', e);
        // Reset to defaults on parse error
        setFormData(getDefaultFormData());
        setGeneratedPlan('');
        setParsedLesson(null);
        setCurrentPlanId(null);
        setStep(1);
        setCurriculumReferences([]);
      }
    } else {
      // No saved state - use defaults
      setFormData(getDefaultFormData());
      setGeneratedPlan('');
      setParsedLesson(null);
      setCurrentPlanId(null);
      setStep(1);
      setCurriculumReferences([]);
    }
  }, [tabId]);

  const subjects = [
    'Mathematics',
    'Language Arts',
    'Science',
    'Social Studies'
  ];

  const grades = ['K', '1', '2', '3', '4', '5', '6'];

  // Dynamically generate strands based on subject and grade using curriculumIndex
  const getStrands = (subject: string, grade: string): string[] => {
    if (!subject || !grade) return [];
    const pages = (curriculumIndex as any).indexedPages || [];
    const strandsSet = new Set<string>();
    pages.forEach((page: any) => {
      if (
        page.subject &&
        page.grade &&
        page.strand &&
        page.subject.toLowerCase() === subject.toLowerCase() &&
        page.grade.toString() === grade.toString()
      ) {
        strandsSet.add(page.strand);
      }
    });
    return Array.from(strandsSet);
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

  // Handler for opening a curriculum card
  const handleOpenCurriculum = (route: string) => {
    if (onOpenCurriculumTab) {
      onOpenCurriculumTab(route);
    } else {
      window.open(route, '_blank', 'noopener,noreferrer');
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
  useEffect(() => {
    if (streamingPlan && !getIsStreaming(tabId, ENDPOINT)) {
      setGeneratedPlan(streamingPlan);
      const parsed = parseLessonContent(streamingPlan, formData, curriculumReferences);
      if (parsed) setParsedLesson(parsed);
      clearStreaming(tabId, ENDPOINT);
      setLocalLoading(false);
    }
  }, [streamingPlan, curriculumReferences]);

  const generateLessonPlan = () => {
    const ws = getConnection(tabId, ENDPOINT);
    if (ws.readyState !== WebSocket.OPEN) {
      alert('Connection not established. Please wait and try again.');
      return;
    }

    setLocalLoading(true);
    setCurriculumReferences(curriculumMatches);

    const prompt = buildLessonPrompt(formData, curriculumMatches);

    try {
      ws.send(JSON.stringify({
        prompt,
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

  // Update saveLessonPlan to use parsed lesson if available
  const saveLessonPlan = async () => {
    const contentToSave = parsedLesson ? lessonToDisplayText(parsedLesson) : generatedPlan;
    if (!contentToSave) {
      alert('No lesson plan to save');
      return;
    }

    setSaveStatus('saving');
    try {
      const planData = {
        id: currentPlanId || `plan_${Date.now()}`,
        title: `${formData.subject} - ${formData.topic} (Grade ${formData.gradeLevel})`,
        timestamp: new Date().toISOString(),
        formData: formData,
        generatedPlan: contentToSave,
        parsedLesson: parsedLesson || undefined
      };

      if (!currentPlanId) {
        setCurrentPlanId(planData.id);
      }

      await axios.post('http://localhost:8000/api/lesson-plan-history', planData);
      await loadLessonPlanHistories();
      setSaveStatus('saved');
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

  useEffect(() => {
    loadLessonPlanHistories();
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
    <div className="flex h-full bg-white relative" data-tutorial="lesson-planner-welcome">
      <div className="flex-1 flex flex-col bg-white">
        {(generatedPlan || streamingPlan) ? (
          <>
            {isEditing && parsedLesson ? (
              // Show Structured Editor
              <LessonEditor
                lesson={parsedLesson}
                onSave={saveLessonEdit}
                onCancel={cancelEditing}
              />
            ) : (
              // Show generated lesson plan (existing display code)
              <>
                <div className="border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {loading ? 'Generating Lesson Plan...' : 'Generated Lesson Plan'}
                    </h2>
                    <p className="text-sm text-gray-500">{formData.subject} - Grade {formData.gradeLevel}</p>
                  </div>
                  {!loading && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={enableEditing}
                        disabled={!parsedLesson}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        title={!parsedLesson ? "Lesson format not recognized" : "Edit lesson"}
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
                        onClick={saveLessonPlan}
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
                      {/* --- HTML Export Enhancement Start --- */}
                      <ExportButton
                        dataType="plan"
                        data={{
                          content: parsedLesson ? lessonToDisplayText(parsedLesson) : generatedPlan,
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
                        className="ml-2"
                      />
                      {/* --- HTML Export Enhancement End --- */}
                      <button
                        onClick={() => setHistoryOpen(!historyOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                        title="Lesson Plan History"
                      >
                        <History className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => {
                          setGeneratedPlan('');
                          setStreamingPlan('');
                          setParsedLesson(null);
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
              {/* Modern Header Card */}
              {(streamingPlan || generatedPlan) && !isEditing && (
                <div className="mb-8">
                  <div className="relative overflow-hidden">
                    {/* Background gradient */}
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${tabColor}, ${tabColor}dd, ${tabColor}bb)` }}></div>
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${tabColor}e6, ${tabColor}cc)` }}></div>
                    
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
                  {parsedLesson?.curriculumReferences && (
                    <CurriculumReferences
                      references={parsedLesson.curriculumReferences}
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
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">AI Lesson Plan Generator</h2>
                <p className="text-sm text-gray-500">Fill in the details to generate a personalized D-OHPC lesson plan</p>
              </div>
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                title="Lesson Plan History"
              >
                <History className="w-5 h-5 text-gray-600" />
              </button>
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

                    {/* Two-column layout for dropdowns and curriculum box */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Left column - Form fields */}
                      <div className="space-y-4">
                        <div data-tutorial="lesson-planner-basic-info">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.subject}
                            onChange={(e) => {
                              handleInputChange('subject', e.target.value);
                              handleInputChange('strand', '');
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                            style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                          >
                            <option value="">Select a subject</option>
                            {subjects.map(subject => (
                              <option key={subject} value={subject}>{subject}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Grade Level <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.gradeLevel}
                            onChange={(e) => {
                              handleInputChange('gradeLevel', e.target.value);
                            }}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                            style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                          >
                            <option value="">Select a grade</option>
                            {grades.map(grade => (
                              <option key={grade} value={grade}>Grade {grade}</option>
                            ))}
                          </select>
                        </div>

                        {formData.subject && formData.gradeLevel && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Strand <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={formData.strand}
                              onChange={(e) => {
                                handleInputChange('strand', e.target.value);
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                              style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                            >
                              <option value="">Select a strand</option>
                              {getStrands(formData.subject, formData.gradeLevel).map(strand => (
                                <option key={strand} value={strand}>{strand}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>

                      {/* Right column - Related Curriculum Box */}
                      <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Related Curriculum
                        </h4>
                        
                        <div className="max-h-96 overflow-y-auto space-y-2">
                          {!formData.subject || !formData.gradeLevel || !formData.strand ? (
                            <p className="text-sm text-gray-500 italic">
                              Select subject, grade level, and strand to see related curriculum
                            </p>
                          ) : loadingCurriculum ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            </div>
                          ) : curriculumMatches.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">
                              No matching curriculum found
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 gap-2">
                              {curriculumMatches.map((curriculum) => (
                                <div
                                  key={curriculum.id}
                                  className="flex flex-col p-3 rounded-lg border border-gray-200 bg-white hover:shadow-md cursor-pointer transition group"
                                  tabIndex={0}
                                  role="button"
                                  onClick={() => handleOpenCurriculum(curriculum.route)}
                                  onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') handleOpenCurriculum(curriculum.route);
                                  }}
                                  style={{ outline: 'none' }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {curriculum.displayName}
                                      </p>
                                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                        {curriculum.essentialOutcomes?.[0] || 'No description available'}
                                      </p>
                                    </div>
                                    <button
                                      className="ml-4 px-3 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                                      onClick={e => {
                                        e.stopPropagation();
                                        handleOpenCurriculum(curriculum.route);
                                      }}
                                    >
                                      Open
                                    </button>
                                  </div>
                                  <div className="mt-2">
                                    <span className="inline-block text-xs text-gray-500">
                                      Grade: {curriculum.grade} | Strand: {curriculum.strand}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Selection count removed */}
                      </div>
                    </div>

                    {/* Rest of the form fields below (full width) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Topic <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.topic}
                        onChange={(e) => handleInputChange('topic', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                        placeholder="The broad, overarching curriculum outcomes from curriculum standards"
                      />
                    </div>

                    <div data-tutorial="lesson-planner-objectives">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specific Curriculum Outcomes <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.specificOutcomes}
                        onChange={(e) => handleInputChange('specificOutcomes', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                          style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                          placeholder="e.g., 20"
                        />
                      </div>

                      <div data-tutorial="lesson-planner-duration">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration (minutes) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.duration}
                          onChange={(e) => handleInputChange('duration', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                          style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
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

                    <div data-tutorial="lesson-planner-activities">
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
                              className="w-4 h-4 rounded focus:ring-2"
                              style={{ accentColor: tabColor, '--tw-ring-color': tabColor } as React.CSSProperties}
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
                              className="w-4 h-4 rounded focus:ring-2"
                              style={{ accentColor: tabColor, '--tw-ring-color': tabColor } as React.CSSProperties}
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
                              className="w-4 h-4 rounded focus:ring-2"
                              style={{ accentColor: tabColor, '--tw-ring-color': tabColor } as React.CSSProperties}
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
                              className="w-4 h-4 rounded focus:ring-2"
                              style={{ accentColor: tabColor, '--tw-ring-color': tabColor } as React.CSSProperties}
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                        placeholder="Add any specific learning styles or preferences not covered above"
                      />
                    </div>

                    <div data-tutorial="lesson-planner-materials">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Materials <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.materials}
                        onChange={(e) => handleInputChange('materials', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
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
                          className="w-4 h-4 rounded focus:ring-2"
                          style={{ accentColor: tabColor, '--tw-ring-color': tabColor } as React.CSSProperties}
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                          style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
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
                      className="flex items-center px-6 py-2 text-white rounded-lg transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                      style={!validateStep() ? {} : { backgroundColor: tabColor }}
                      onMouseEnter={(e) => validateStep() && (e.currentTarget.style.opacity = '0.9')}
                      onMouseLeave={(e) => validateStep() && (e.currentTarget.style.opacity = '1')}
                    >
                      Next
                      <ChevronRight className="w-5 h-5 ml-1" />
                    </button>
                  ) : (
                    <button
                      onClick={generateLessonPlan}
                      disabled={loading}
                      className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
                      data-tutorial="lesson-planner-generate"
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
          </>
        )}
      </div>

      {/* History Panel - Always available */}
      <div
        className={`border-l border-gray-200 bg-gray-50 transition-all duration-300 overflow-hidden ${
          historyOpen ? 'w-80' : 'w-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Saved Plans</h3>
            <button
              onClick={() => setHistoryOpen(false)}
              className="p-1 rounded hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
            {lessonPlanHistories.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No saved plans yet</p>
              </div>
            ) : (
              lessonPlanHistories.map((history) => (
                <div
                  key={history.id}
                  onClick={() => loadLessonPlanHistory(history)}
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
                      onClick={(e) => deleteLessonPlanHistory(history.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition"
                      title="Delete plan"
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
        contentType="lesson"
        onContentUpdate={(newContent) => {
          setGeneratedPlan(newContent);
          const parsed = parseLessonContent(newContent, formData);
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