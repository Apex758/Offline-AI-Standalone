import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Loader2, School, Trash2, Save, Download, History, X, Edit, Sparkles } from 'lucide-react';
import AIAssistantPanel from './AIAssistantPanel';
import CrossCurricularEditor from './CrossCurricularEditor';
import type { ParsedCrossCurricularPlan } from './CrossCurricularEditor';
import axios from 'axios';
import { buildCrossCurricularPrompt } from '../utils/crossCurricularPromptBuilder';
import { useSettings } from '../contexts/SettingsContext';
import { TutorialOverlay } from './TutorialOverlay';
import { TutorialButton } from './TutorialButton';
import { tutorials, TUTORIAL_IDS } from '../data/tutorialSteps';
import { getWebSocketUrl, isElectronEnvironment } from '../config/api.config';

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
  const { settings, markTutorialComplete, isTutorialCompleted } = useSettings();
  const tabColor = settings.tabColors['cross-curricular-planner'];
  const [showTutorial, setShowTutorial] = useState(false);
  const [loading, setLoading] = useState(false);
  const shouldReconnectRef = useRef(true);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [crossCurricularHistories, setCrossCurricularHistories] = useState<CrossCurricularHistory[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // State for structured editing
  const [isEditing, setIsEditing] = useState(false);
  const [parsedPlan, setParsedPlan] = useState<ParsedCrossCurricularPlan | null>(null);

  // Track initialization per tab to prevent state loss on tab switches
  const hasInitializedRef = useRef(false);
  const currentTabIdRef = useRef(tabId);

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
    crossCurricularConnections: ''
  });

  const [step, setStep] = useState(() => savedData?.step || 1);
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = savedData?.formData;
    // Robust validation: check if saved data exists AND has meaningful content
    if (saved && typeof saved === 'object' && saved.lessonTitle?.trim()) {
      return saved;
    }
    return getDefaultFormData();
  });

  const [generatedPlan, setGeneratedPlan] = useState<string>(savedData?.generatedPlan || '');
  const [streamingPlan, setStreamingPlan] = useState<string>(savedData?.streamingPlan || '');
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

  // Auto-enable editing mode if startInEditMode flag is set
  useEffect(() => {
    if (savedData?.startInEditMode && parsedPlan && !isEditing) {
      console.log('Auto-enabling edit mode for cross-curricular plan');
      setIsEditing(true);
    }
  }, [savedData?.startInEditMode, parsedPlan, isEditing]);

  const grades = ['Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 
                  'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
  
  const subjects = ['Mathematics', 'Language Arts', 'Science', 'Social Studies', 'Arts', 
                    'Physical Education', 'Technology'];
  
  const integrationModels = ['Multidisciplinary', 'Interdisciplinary', 'Transdisciplinary'];

  const teachingStrategiesOptions = [
    'Inquiry-Based Learning', 'Project-Based Learning', 'Direct Instruction',
    'Cooperative Learning', 'Differentiated Instruction', 'Flipped Classroom',
    'Gamification', 'Problem-Based Learning', 'Socratic Method',
    'Experiential Learning', 'Culturally Responsive Teaching', 'Universal Design for Learning'
  ];

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

  // FIXED: Properly handle tab switches without losing state
  useEffect(() => {
    const isNewTab = currentTabIdRef.current !== tabId;
    currentTabIdRef.current = tabId;
    
    // Only update state when switching tabs OR on first initialization
    if (isNewTab || !hasInitializedRef.current) {
      const saved = savedData?.formData;
      
      // Robust validation: check if saved data has meaningful content
      if (saved && typeof saved === 'object' && saved.lessonTitle?.trim()) {
        // Restore all state for this tab
        setFormData(saved);
        setGeneratedPlan(savedData?.generatedPlan || '');
        setStreamingPlan(savedData?.streamingPlan || '');
        setStep(savedData?.step || 1);
        setParsedPlan(savedData?.parsedPlan || null);
      } else {
        // New tab or empty tab - set to default state
        setFormData(getDefaultFormData());
        setGeneratedPlan('');
        setStreamingPlan('');
        setStep(1);
        setParsedPlan(null);
      }
      
      hasInitializedRef.current = true;
    }
  }, [tabId, savedData]);

  useEffect(() => {
    onDataChange({ formData, generatedPlan, streamingPlan, step, parsedPlan });
  }, [formData, generatedPlan, streamingPlan, step, parsedPlan]);

  useEffect(() => {
    shouldReconnectRef.current = true;

    const connectWebSocket = () => {
      if (!shouldReconnectRef.current) return;

      try {
        const wsUrl = getWebSocketUrl('/ws/cross-curricular', isElectronEnvironment());
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('Cross-curricular WebSocket connected');
        };
        
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === 'token') {
            setStreamingPlan(prev => prev + data.content);
          } else if (data.type === 'done') {
            setStreamingPlan(current => {
              const finalMessage = current || data.full_response;
              setGeneratedPlan(finalMessage);
              
              console.log('Cross-curricular plan generation complete, parsing...');
              
              // Try to parse immediately
              const parsed = parseCrossCurricularContent(finalMessage, formData);
              if (parsed) {
                console.log('Cross-curricular plan parsed successfully');
                setParsedPlan(parsed);
              } else {
                console.warn('Cross-curricular plan parsing failed');
              }
              
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
    const contentToSave = parsedPlan ? crossCurricularPlanToDisplayText(parsedPlan) : generatedPlan;
    if (!contentToSave) {
      alert('No plan to save');
      return;
    }

    setSaveStatus('saving');
    try {
      const planData = {
        id: currentPlanId || `cross_curricular_${Date.now()}`,
        title: `${formData.lessonTitle} - ${formData.primarySubject} (${formData.gradeLevel})`,
        timestamp: new Date().toISOString(),
        formData: formData,
        generatedPlan: contentToSave,
        parsedPlan: parsedPlan || undefined
      };

      if (!currentPlanId) {
        setCurrentPlanId(planData.id);
      }

      await axios.post('http://localhost:8000/api/cross-curricular-history', planData);
      await loadCrossCurricularHistories();
      setSaveStatus('saved');
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

  const exportPlan = () => {
    const contentToExport = parsedPlan ? crossCurricularPlanToDisplayText(parsedPlan) : generatedPlan;
    if (!contentToExport) return;

    const content = `CROSS-CURRICULAR LESSON PLAN
${formData.lessonTitle}
${formData.primarySubject} - ${formData.gradeLevel}
Integration Model: ${formData.integrationModel}
Generated: ${new Date().toLocaleDateString()}

${contentToExport}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cross-curricular-${formData.lessonTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadCrossCurricularHistories();
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
    if (step === 1) return formData.lessonTitle && formData.gradeLevel && formData.duration && formData.bigIdea && formData.integrationModel;
    if (step === 2) return formData.primarySubject && formData.learningStandards;
    if (step === 3) return formData.primaryObjective;
    if (step === 4) return formData.introduction && formData.coreActivities;
    if (step === 5) return formData.assessmentMethods && formData.mostChildren;
    if (step === 6) return formData.teachingStrategies.length > 0 && formData.learningStyles.length > 0;
    return true;
  };

  const generatePlan = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      alert('Connection not established. Please wait and try again.');
      return;
    }

    setLoading(true);
    setStreamingPlan('');

    // Map formData to match the prompt builder's expected interface
    const mappedData = {
      ...formData,
      theme: formData.bigIdea,
      integrationSubjects: formData.supportingSubjects.split(',').map(s => s.trim()).filter(s => s)
    };

    const prompt = buildCrossCurricularPrompt(mappedData);

    try {
      wsRef.current.send(JSON.stringify({ prompt }));
    } catch (error) {
      console.error('Failed to send cross-curricular plan request:', error);
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      lessonTitle: '', gradeLevel: '', duration: '', bigIdea: '', integrationModel: '',
      primarySubject: '', supportingSubjects: '', learningStandards: '',
      primaryObjective: '', secondaryObjectives: '', studentsWillKnow: '', studentsWillBeSkilled: '', keyVocabulary: '',
      introduction: '', coreActivities: '', closureActivities: '', differentiationStrategies: '',
      assessmentMethods: '', mostChildren: '', someNotProgressed: '', someProgressedFurther: '', reflectionPrompts: '',
      teachingStrategies: [], learningStyles: [], learningPreferences: [], multipleIntelligences: [],
      customLearningStyles: '', materials: '', crossCurricularConnections: ''
    });
    setGeneratedPlan('');
    setStreamingPlan('');
    setStep(1);
    setCurrentPlanId(null);
    setIsEditing(false);
    setParsedPlan(null);
  };

  const stepLabels = ['Basic Info', 'Subjects', 'Objectives', 'Activities', 'Assessment', 'Teaching & Learning', 'Resources'];

  return (
    <div className="flex h-full bg-white relative" data-tutorial="cross-curricular-planner-welcome">
      <div className="flex-1 flex flex-col bg-white">
        {(generatedPlan || streamingPlan) ? (
          <>
            {isEditing && parsedPlan ? (
              // Show Structured Editor
              <CrossCurricularEditor
                plan={parsedPlan}
                onSave={saveCrossCurricularEdit}
                onCancel={cancelEditing}
              />
            ) : (
              // Show generated plan (existing display code)
              <>
                <div className="border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {loading ? 'Generating Cross-Curricular Plan...' : 'Generated Cross-Curricular Plan'}
                    </h2>
                    <p className="text-sm text-gray-500">{formData.lessonTitle} - {formData.primarySubject}</p>
                  </div>
                  {!loading && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={enableEditing}
                        disabled={!parsedPlan}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        title={!parsedPlan ? "Cross-curricular plan format not recognized" : "Edit plan"}
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
                        data-tutorial="cross-curricular-planner-export"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </button>
                      <button
                        onClick={() => setHistoryOpen(!historyOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                        title="Cross-Curricular Plan History"
                      >
                        <History className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => {
                          setGeneratedPlan('');
                          setStreamingPlan('');
                          setParsedPlan(null);
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
                  {(streamingPlan || generatedPlan) && (
                <div className="mb-8">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg">
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${tabColor}, ${tabColor}dd, ${tabColor}bb)` }}></div>
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${tabColor}e6, ${tabColor}cc)` }}></div>
                    
                    <div className="relative px-8 py-8">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                            <span className="text-white text-sm font-medium">{formData.integrationModel}</span>
                          </div>
                          
                          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
                            {formData.lessonTitle}
                          </h1>
                          
                          <div className="flex flex-wrap items-center gap-4 text-teal-100">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-teal-200 rounded-full mr-2"></div>
                              <span className="text-sm">{formData.gradeLevel}</span>
                            </div>
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
                          </div>
                        </div>
                        
                        {loading && (
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                            <div className="flex items-center text-white">
                              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                              <div>
                                <div className="text-sm font-medium">Generating...</div>
                                <div className="text-xs text-teal-100">AI-powered cross-curricular plan</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-white/20">
                        <div className="flex items-center justify-between">
                          <div className="text-teal-100 text-sm">
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
                    <div className="space-y-1 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
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
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Cross-Curricular Lesson Planner</h2>
                <p className="text-sm text-gray-500">Create integrated subject lesson plans</p>
              </div>
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                title="Cross-Curricular Plan History"
              >
                <History className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="border-b border-gray-200 px-6 py-3 overflow-x-auto">
              <div className="flex items-center space-x-2 min-w-max">
                {stepLabels.map((label, idx) => (
                  <React.Fragment key={idx}>
                    <div className={`flex items-center ${step === idx + 1 ? 'text-teal-600' : 'text-gray-400'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        step > idx + 1 ? 'bg-green-500 text-white' : step === idx + 1 ? 'bg-teal-600 text-white' : 'bg-gray-300'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className="ml-2 text-xs font-medium whitespace-nowrap">{label}</span>
                    </div>
                    {idx < stepLabels.length - 1 && <ChevronRight className="w-4 h-4 text-gray-300" />}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title *</label>
                      <input type="text" value={formData.lessonTitle} onChange={(e) => handleInputChange('lessonTitle', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500" placeholder="Enter lesson title" />
                    </div>
                    <div data-tutorial="cross-curricular-planner-grade">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Grade Level *</label>
                      <select value={formData.gradeLevel} onChange={(e) => handleInputChange('gradeLevel', e.target.value)} 
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}>
                        <option value="">Select grade level</option>
                        {grades.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Duration *</label>
                      <input type="text" value={formData.duration} onChange={(e) => handleInputChange('duration', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="e.g., 60 minutes, 2 class periods" />
                    </div>
                    <div data-tutorial="cross-curricular-planner-theme">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Big Idea / Driving Concept *</label>
                      <textarea value={formData.bigIdea} onChange={(e) => handleInputChange('bigIdea', e.target.value)} rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="The central concept that connects all subjects" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Integration Model *</label>
                      <select value={formData.integrationModel} onChange={(e) => handleInputChange('integrationModel', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}>
                        <option value="">Select integration model</option>
                        {integrationModels.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {/* Step 2: Subjects */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div data-tutorial="cross-curricular-planner-subjects">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Subject *</label>
                      <select value={formData.primarySubject} onChange={(e) => handleInputChange('primarySubject', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}>
                        <option value="">Select primary subject</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div data-tutorial="cross-curricular-planner-connections">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Subjects</label>
                      <input type="text" value={formData.supportingSubjects} onChange={(e) => handleInputChange('supportingSubjects', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Other subjects integrated (comma-separated)" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Learning Standards *</label>
                      <textarea value={formData.learningStandards} onChange={(e) => handleInputChange('learningStandards', e.target.value)} rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Curriculum standards from all integrated subjects" />
                    </div>
                  </div>
                )}

                {/* Step 3: Objectives */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div data-tutorial="cross-curricular-planner-objectives">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Primary Learning Objective *</label>
                      <textarea value={formData.primaryObjective} onChange={(e) => handleInputChange('primaryObjective', e.target.value)} rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="The main learning goal for this lesson" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Learning Objectives</label>
                      <textarea value={formData.secondaryObjectives} onChange={(e) => handleInputChange('secondaryObjectives', e.target.value)} rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Additional learning goals from integrated subjects" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Students Will Know (Facts)</label>
                      <textarea value={formData.studentsWillKnow} onChange={(e) => handleInputChange('studentsWillKnow', e.target.value)} rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Key knowledge and facts students will learn" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Students Will Be Skilled At (Actions)</label>
                      <textarea value={formData.studentsWillBeSkilled} onChange={(e) => handleInputChange('studentsWillBeSkilled', e.target.value)} rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Skills and abilities students will develop" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Key Vocabulary</label>
                      <input type="text" value={formData.keyVocabulary} onChange={(e) => handleInputChange('keyVocabulary', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Important terms from all subjects (comma-separated)" />
                    </div>
                  </div>
                )}

                {/* Step 4: Activities */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div data-tutorial="cross-curricular-planner-activities">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Introduction/Hook *</label>
                      <textarea value={formData.introduction} onChange={(e) => handleInputChange('introduction', e.target.value)} rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Engaging opening activity that introduces the big idea" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Core Learning Activities *</label>
                      <textarea value={formData.coreActivities} onChange={(e) => handleInputChange('coreActivities', e.target.value)} rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Main activities that integrate multiple subjects" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Closure Activities</label>
                      <textarea value={formData.closureActivities} onChange={(e) => handleInputChange('closureActivities', e.target.value)} rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Activities to summarize and reflect on learning" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Differentiation Strategies</label>
                      <textarea value={formData.differentiationStrategies} onChange={(e) => handleInputChange('differentiationStrategies', e.target.value)} rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="How you'll support diverse learners" />
                    </div>
                  </div>
                )}

                {/* Step 5: Assessment */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div data-tutorial="cross-curricular-planner-assessment">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assessment Methods *</label>
                      <textarea value={formData.assessmentMethods} onChange={(e) => handleInputChange('assessmentMethods', e.target.value)} rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="How you'll assess learning across subjects" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Most children will *</label>
                      <textarea value={formData.mostChildren} onChange={(e) => handleInputChange('mostChildren', e.target.value)} rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Expected learning outcomes for most students" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Some will not have made so much progress</label>
                      <textarea value={formData.someNotProgressed} onChange={(e) => handleInputChange('someNotProgressed', e.target.value)} rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Support for students who need additional help" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Some will have progressed further</label>
                      <textarea value={formData.someProgressedFurther} onChange={(e) => handleInputChange('someProgressedFurther', e.target.value)} rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Extensions for students who need more challenge" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reflection Prompts</label>
                      <textarea value={formData.reflectionPrompts} onChange={(e) => handleInputChange('reflectionPrompts', e.target.value)} rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Questions to help students reflect on their learning" />
                    </div>
                  </div>
                )}

                {/* Step 6: Teaching & Learning */}
                {step === 6 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Teaching Strategies *</label>
                      <div className="grid grid-cols-2 gap-2">
                        {teachingStrategiesOptions.map(s => (
                          <label key={s} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                            <input type="checkbox" checked={formData.teachingStrategies.includes(s)}
                              onChange={() => handleCheckboxChange('teachingStrategies', s)} className="w-4 h-4 rounded"
                              style={{ accentColor: tabColor }} />
                            <span className="text-sm">{s}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Learning Styles *</label>
                      <div className="grid grid-cols-3 gap-2">
                        {learningStylesOptions.map(s => (
                          <label key={s} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
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
                {step === 7 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Materials and Resources</label>
                      <textarea value={formData.materials} onChange={(e) => handleInputChange('materials', e.target.value)} rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="All materials needed across subjects" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Suggested Cross-Curricular Connections</label>
                      <textarea value={formData.crossCurricularConnections} onChange={(e) => handleInputChange('crossCurricularConnections', e.target.value)} rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties} placeholder="Additional ideas for connecting subjects" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="max-w-3xl mx-auto flex justify-between">
                <div>
                  {step > 1 && (
                    <button onClick={() => setStep(step - 1)} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg">
                      <ChevronLeft className="w-5 h-5 mr-1" />Previous
                    </button>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={clearForm} className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-5 h-5 mr-2" />Clear Form
                  </button>
                  {step < 7 ? (
                    <button onClick={() => setStep(step + 1)} disabled={!validateStep()}
                      className="flex items-center px-6 py-2 text-white rounded-lg disabled:bg-gray-300 transition"
                      style={!validateStep() ? {} : { backgroundColor: tabColor }}
                      onMouseEnter={(e) => validateStep() && (e.currentTarget.style.opacity = '0.9')}
                      onMouseLeave={(e) => validateStep() && (e.currentTarget.style.opacity = '1')}>
                      Next<ChevronRight className="w-5 h-5 ml-1" />
                    </button>
                  ) : (
                    <button onClick={generatePlan} disabled={loading || !validateStep()}
                      className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition"
                      style={loading || !validateStep() ? {} : { backgroundColor: 'rgb(22 163 74)' }}
                      data-tutorial="cross-curricular-planner-generate">
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
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
        className={`border-l border-gray-200 bg-gray-50 transition-all duration-300 overflow-hidden ${
          historyOpen ? 'w-80' : 'w-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Saved Cross-Curricular Plans</h3>
            <button
              onClick={() => setHistoryOpen(false)}
              className="p-1 rounded hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
            {crossCurricularHistories.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <School className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No saved cross-curricular plans yet</p>
              </div>
            ) : (
              crossCurricularHistories.map((history) => (
                <div
                  key={history.id}
                  onClick={() => loadCrossCurricularHistory(history)}
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