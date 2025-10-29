import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, Loader2, Users, Trash2, Save, Download, History, X, Edit, Sparkles } from 'lucide-react';
import AIAssistantPanel from './AIAssistantPanel';
import MultigradeEditor from './MultigradeEditor';
import type { ParsedMultigradePlan } from './MultigradeEditor';
import axios from 'axios';
import { buildMultigradePrompt } from '../utils/multigradePromptBuilder';
import { useSettings } from '../contexts/SettingsContext';
import { TutorialOverlay } from './TutorialOverlay';
import { TutorialButton } from './TutorialButton';
import { tutorials, TUTORIAL_IDS } from '../data/tutorialSteps';

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
  parsedPlan?: ParsedMultigradePlan;
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
}

const formatMultigradeText = (text: string, accentColor: string) => {
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

    // Grade level sections with special highlighting
    if (trimmed.match(/^(Grade|Kindergarten|Differentiated Activities|Extension Activities).*:/i)) {
      elements.push(
        <div key={`grade-${currentIndex++}`} className="mt-4 mb-3">
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

// Parse multigrade plan text content into structured ParsedMultigradePlan format
const parseMultigradeContent = (text: string, formData: FormData): ParsedMultigradePlan | null => {
  if (!text) return null;

  try {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Extract metadata from form data
    const gradeLevelsArray = formData.gradeRange.split(/[-,]/).map(g => g.trim());
    const metadata = {
      title: formData.topic || 'Multigrade Plan',
      subject: formData.subject,
      gradeLevels: gradeLevelsArray,
      gradeRange: formData.gradeRange,
      duration: formData.duration,
      totalStudents: formData.totalStudents,
      date: new Date().toLocaleDateString()
    };

    // Parse common objectives
    const commonObjectives: string[] = [];
    const commonObjSection = text.match(/\*\*Common (?:Learning )?Objectives.*?\*\*(.*?)(?=\*\*|$)/s);
    if (commonObjSection) {
      const objMatches = commonObjSection[1].match(/(?:^|\n)\s*[\*\-•]\s+(.+)/g);
      if (objMatches) {
        objMatches.forEach(match => {
          const cleaned = match.replace(/^\s*[\*\-•]\s+/, '').trim();
          if (cleaned) commonObjectives.push(cleaned);
        });
      }
    }

    // Parse grade-specific objectives
    const gradeSpecificObjectives: { [gradeLevel: string]: string[] } = {};
    gradeLevelsArray.forEach(grade => {
      const gradeObjRegex = new RegExp(`\\*\\*${grade}.*?Objectives.*?\\*\\*([\\s\\S]*?)(?=\\*\\*(?:Grade|Kindergarten)|$)`, 'i');
      const match = text.match(gradeObjRegex);
      if (match && match[1]) {
        const objectives: string[] = [];
        const objMatches = match[1].match(/(?:^|\n)\s*[\*\-•]\s+(.+)/g);
        if (objMatches) {
          objMatches.forEach(m => {
            const cleaned = m.replace(/^\s*[\*\-•]\s+/, '').trim();
            if (cleaned) objectives.push(cleaned);
          });
        }
        if (objectives.length > 0) {
          gradeSpecificObjectives[grade] = objectives;
        }
      }
    });

    // Parse materials
    const materials: Array<{ id: string; name: string; gradeLevels?: string[] }> = [];
    const materialsSection = text.match(/\*\*Materials.*?\*\*(.*?)(?=\*\*|$)/s);
    if (materialsSection) {
      const matMatches = materialsSection[1].match(/(?:^|\n)\s*[\*\-•]\s+(.+)/g);
      if (matMatches) {
        matMatches.forEach((match, idx) => {
          const cleaned = match.replace(/^\s*[\*\-•]\s+/, '').trim();
          if (cleaned) {
            // Check for grade-level tags in materials (e.g., "Item (Grade 1, Grade 2)")
            const gradeMatch = cleaned.match(/\(((?:Grade \d+|Kindergarten)(?:,\s*(?:Grade \d+|Kindergarten))*)\)/);
            let name = cleaned;
            let gradeLevels: string[] = [];
            
            if (gradeMatch) {
              name = cleaned.replace(gradeMatch[0], '').trim();
              gradeLevels = gradeMatch[1].split(',').map(g => g.trim());
            }
            
            materials.push({
              id: `material_${idx}`,
              name,
              gradeLevels: gradeLevels.length > 0 ? gradeLevels : []
            });
          }
        });
      }
    }

    // Parse grade-specific activities
    const gradeActivities: Array<{
      id: string;
      gradeLevel: string;
      activityName: string;
      description: string;
      duration?: string;
    }> = [];
    
    gradeLevelsArray.forEach(grade => {
      const gradeActRegex = new RegExp(`\\*\\*${grade}.*?Activities.*?\\*\\*([\\s\\S]*?)(?=\\*\\*(?:Grade|Kindergarten|Assessment)|$)`, 'i');
      const match = text.match(gradeActRegex);
      if (match && match[1]) {
        const activityBlocks = match[1].split(/(?=\d+\.)/);
        activityBlocks.forEach((block, idx) => {
          const trimmed = block.trim();
          if (trimmed) {
            const nameMatch = trimmed.match(/^\d+\.\s*(.+?)(?:\n|$)/);
            const activityName = nameMatch ? nameMatch[1].trim() : `Activity ${idx + 1}`;
            const description = trimmed.replace(/^\d+\.\s*.+?\n/, '').trim();
            
            gradeActivities.push({
              id: `activity_${grade}_${idx}`,
              gradeLevel: grade,
              activityName,
              description,
              duration: ''
            });
          }
        });
      }
    });

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

    // Parse optional fields
    const differentiationMatch = text.match(/\*\*Differentiation.*?\*\*(.*?)(?=\*\*|$)/s);
    const differentiationNotes = differentiationMatch ? differentiationMatch[1].trim() : undefined;

    const prerequisitesMatch = text.match(/\*\*Prerequisites.*?\*\*(.*?)(?=\*\*|$)/s);
    const prerequisites = prerequisitesMatch ? prerequisitesMatch[1].trim() : undefined;

    const strategiesMatch = text.match(/\*\*Multigrade Strategies.*?\*\*(.*?)(?=\*\*|$)/s);
    const multigradeStrategies = strategiesMatch
      ? strategiesMatch[1].match(/(?:^|\n)\s*[\*\-•]\s+(.+)/g)?.map(m => m.replace(/^\s*[\*\-•]\s+/, '').trim())
      : undefined;

    return {
      metadata,
      commonObjectives: commonObjectives.length > 0 ? commonObjectives : ['No common objectives found'],
      gradeSpecificObjectives,
      materials: materials.length > 0 ? materials : [{ id: 'mat_0', name: 'No materials specified', gradeLevels: [] }],
      gradeActivities: gradeActivities.length > 0 ? gradeActivities : [],
      assessmentStrategies: assessmentStrategies.length > 0 ? assessmentStrategies : ['Observation'],
      differentiationNotes,
      multigradeStrategies,
      prerequisites
    };
  } catch (error) {
    console.error('Failed to parse multigrade plan:', error);
    return null;
  }
};

// Convert ParsedMultigradePlan back to display text format
const multigradePlanToDisplayText = (plan: ParsedMultigradePlan): string => {
  let output = '';
  
  // Add metadata header
  output += `**MULTIGRADE LESSON PLAN**\n\n`;
  output += `**Title:** ${plan.metadata.title}\n`;
  output += `**Subject:** ${plan.metadata.subject}\n`;
  output += `**Grade Range:** ${plan.metadata.gradeRange}\n`;
  output += `**Duration:** ${plan.metadata.duration} minutes\n`;
  output += `**Total Students:** ${plan.metadata.totalStudents}\n`;
  output += `**Date:** ${plan.metadata.date}\n\n`;
  
  // Common Learning Objectives
  output += `**Common Learning Objectives (All Grades)**\n`;
  plan.commonObjectives.forEach(obj => {
    output += `* ${obj}\n`;
  });
  output += '\n';
  
  // Grade-Specific Objectives
  if (Object.keys(plan.gradeSpecificObjectives).length > 0) {
    output += `**Grade-Specific Learning Objectives**\n\n`;
    plan.metadata.gradeLevels.forEach(grade => {
      if (plan.gradeSpecificObjectives[grade]) {
        output += `**${grade} Objectives:**\n`;
        plan.gradeSpecificObjectives[grade].forEach(obj => {
          output += `* ${obj}\n`;
        });
        output += '\n';
      }
    });
  }
  
  // Materials
  output += `**Materials Needed:**\n`;
  plan.materials.forEach(material => {
    let materialLine = `* ${material.name}`;
    if (material.gradeLevels && material.gradeLevels.length > 0) {
      materialLine += ` (${material.gradeLevels.join(', ')})`;
    }
    output += `${materialLine}\n`;
  });
  output += '\n';
  
  // Grade-Specific Activities
  if (plan.gradeActivities.length > 0) {
    output += `**Grade-Specific Activities**\n\n`;
    plan.metadata.gradeLevels.forEach(grade => {
      const gradeActs = plan.gradeActivities.filter(a => a.gradeLevel === grade);
      if (gradeActs.length > 0) {
        output += `**${grade} Activities:**\n`;
        gradeActs.forEach((activity, idx) => {
          output += `${idx + 1}. **${activity.activityName}**\n`;
          output += `${activity.description}\n`;
          if (activity.duration) {
            output += `Duration: ${activity.duration}\n`;
          }
          output += '\n';
        });
      }
    });
  }
  
  // Assessment Strategies
  output += `**Assessment Strategies:**\n`;
  plan.assessmentStrategies.forEach(strategy => {
    output += `* ${strategy}\n`;
  });
  output += '\n';
  
  // Optional fields
  if (plan.differentiationNotes) {
    output += `**Differentiation Notes:**\n${plan.differentiationNotes}\n\n`;
  }
  
  if (plan.multigradeStrategies && plan.multigradeStrategies.length > 0) {
    output += `**Multigrade Strategies:**\n`;
    plan.multigradeStrategies.forEach(strategy => {
      output += `* ${strategy}\n`;
    });
    output += '\n';
  }
  
  if (plan.prerequisites) {
    output += `**Prerequisites:**\n${plan.prerequisites}\n`;
  }
  
  return output;
};

const MultigradePlanner: React.FC<MultigradePlannerProps> = ({ tabId, savedData, onDataChange }) => {
  const { settings, markTutorialComplete, isTutorialCompleted } = useSettings();
  const tabColor = settings.tabColors['multigrade-planner'];
  const [showTutorial, setShowTutorial] = useState(false);
  const [loading, setLoading] = useState(false);
  const shouldReconnectRef = useRef(true);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [multigradeHistories, setMultigradeHistories] = useState<MultigradeHistory[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [step, setStep] = useState(savedData?.step || 1);

  // State for structured editing
  const [isEditing, setIsEditing] = useState(false);
  const [parsedPlan, setParsedPlan] = useState<ParsedMultigradePlan | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);

  // Track initialization per tab to prevent state loss on tab switches
  const hasInitializedRef = useRef(false);
  const currentTabIdRef = useRef(tabId);

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
    differentiationNotes: ''
  });

  const [formData, setFormData] = useState<FormData>(() => {
    const saved = savedData?.formData;
    // Robust validation: check if saved data exists AND has meaningful content
    if (saved && typeof saved === 'object' && saved.subject?.trim()) {
      return saved;
    }
    return getDefaultFormData();
  });

  const [generatedPlan, setGeneratedPlan] = useState<string>(savedData?.generatedPlan || '');
  const [streamingPlan, setStreamingPlan] = useState<string>(savedData?.streamingPlan || '');

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

  const subjects = ['Mathematics', 'Science', 'Language Arts', 'Social Studies', 'Art', 'Music', 'Physical Education'];
  
  const gradeRanges = [
    'Kindergarten - Grade 1', 'Grade 1 - Grade 2', 'Grade 2 - Grade 3',
    'Grade 3 - Grade 4', 'Grade 4 - Grade 5', 'Grade 5 - Grade 6',
    'Grade 1 - Grade 3', 'Grade 2 - Grade 4', 'Grade 3 - Grade 5',
    'Grade 4 - Grade 6', 'Grade 1 - Grade 6'
  ];

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
        // Detect if running in Electron
        const isElectron = typeof window !== 'undefined' && window.electronAPI;

        let wsUrl: string;
        if (isElectron) {
          // Electron/Production: direct connection to backend
          wsUrl = 'ws://127.0.0.1:8000/ws/multigrade';
        } else {
          // Vite/Development: use proxy through dev server
          const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
          const host = window.location.host;
          wsUrl = `${protocol}//${host}/ws/multigrade`;
        }

        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('Multigrade WebSocket connected');
        };
        
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === 'token') {
            setStreamingPlan(prev => prev + data.content);
          } else if (data.type === 'done') {
            setStreamingPlan(current => {
              const finalMessage = current || data.full_response;
              setGeneratedPlan(finalMessage);
              
              console.log('Multigrade plan generation complete, parsing...');
              
              // Try to parse immediately
              const parsed = parseMultigradeContent(finalMessage, formData);
              if (parsed) {
                console.log('Multigrade plan parsed successfully');
                setParsedPlan(parsed);
              } else {
                console.warn('Multigrade plan parsing failed');
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

  // Enable structured editing mode
  const enableEditing = () => {
    if (parsedPlan) {
      setIsEditing(true);
    } else {
      alert('Cannot edit: Multigrade plan format not recognized. Try regenerating the plan.');
    }
  };

  // Save edited multigrade plan
  const saveMultigradeEdit = (editedPlan: ParsedMultigradePlan) => {
    setParsedPlan(editedPlan);
    const displayText = multigradePlanToDisplayText(editedPlan);
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
    const contentToSave = parsedPlan ? multigradePlanToDisplayText(parsedPlan) : generatedPlan;
    if (!contentToSave) {
      alert('No plan to save');
      return;
    }

    setSaveStatus('saving');
    try {
      const planData = {
        id: currentPlanId || `multigrade_${Date.now()}`,
        title: `${formData.subject} - ${formData.topic} (${formData.gradeRange})`,
        timestamp: new Date().toISOString(),
        formData: formData,
        generatedPlan: contentToSave,
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

  const exportPlan = () => {
    const contentToExport = parsedPlan ? multigradePlanToDisplayText(parsedPlan) : generatedPlan;
    if (!contentToExport) return;

    const content = `MULTIGRADE LESSON PLAN
${formData.subject} - ${formData.gradeRange}
${formData.topic}
Generated: ${new Date().toLocaleDateString()}

${contentToExport}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `multigrade-${formData.topic.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadMultigradeHistories();
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
    if (step === 1) {
      return formData.subject && formData.gradeRange && formData.topic && 
             formData.essentialLearningOutcomes && formData.specificLearningObjectives &&
             formData.totalStudents && formData.duration && formData.materials;
    }
    if (step === 2) {
      return formData.learningStyles.length > 0 && formData.pedagogicalStrategies.length > 0 &&
             formData.multigradeStrategies.length > 0;
    }
    return true;
  };

  const generatePlan = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      alert('Connection not established. Please wait and try again.');
      return;
    }

    setLoading(true);
    setStreamingPlan('');

    const prompt = buildMultigradePrompt(formData);

    try {
      wsRef.current.send(JSON.stringify({ prompt }));
    } catch (error) {
      console.error('Failed to send multigrade plan request:', error);
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
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
      differentiationNotes: ''
    });
    setGeneratedPlan('');
    setStreamingPlan('');
    setParsedPlan(null);
    setCurrentPlanId(null);
    setStep(1);
    setIsEditing(false);
  };

  return (
    <div className="flex h-full bg-white relative" data-tutorial="multigrade-planner-welcome">
      <div className="flex-1 flex flex-col bg-white">
        {(generatedPlan || streamingPlan) ? (
          <>
            {isEditing && parsedPlan ? (
              // Show Structured Editor
              <MultigradeEditor
                plan={parsedPlan}
                onSave={saveMultigradeEdit}
                onCancel={cancelEditing}
              />
            ) : (
              // Show generated plan (existing display code)
              <>
                <div className="border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {loading ? 'Generating Multigrade Plan...' : 'Generated Multigrade Plan'}
                    </h2>
                    <p className="text-sm text-gray-500">{formData.subject} - {formData.gradeRange}</p>
                  </div>
                  {!loading && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={enableEditing}
                        disabled={!parsedPlan}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
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
                        data-tutorial="multigrade-planner-export"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </button>
                      <button
                        onClick={() => setHistoryOpen(!historyOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                        title="Multigrade Plan History"
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
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
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
                            <span className="text-white text-sm font-medium">{formData.subject}</span>
                          </div>
                          
                          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
                            {formData.topic ? `${formData.topic} - Multigrade` : 'Multigrade Lesson Plan'}
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
                              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
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
                    <div className="space-y-1 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      {formatMultigradeText(streamingPlan || generatedPlan, tabColor)}
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
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Create Multigrade Lesson Plan</h2>
                <p className="text-sm text-gray-500">Design a lesson that addresses multiple grade levels simultaneously</p>
              </div>
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                title="Multigrade Plan History"
              >
                <History className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between max-w-2xl">
                {['Basic Info', 'Learning & Strategies', 'Additional Details'].map((label, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      step > idx + 1 ? 'bg-green-600' : step === idx + 1 ? 'bg-indigo-600' : 'bg-gray-300'
                    } text-white font-semibold text-sm`}>
                      {idx + 1}
                    </div>
                    <span className={`ml-2 text-sm font-medium ${
                      step === idx + 1 ? 'text-indigo-600' : 'text-gray-500'
                    }`}>
                      {label}
                    </span>
                    {idx < 2 && <ChevronRight className="w-5 h-5 text-gray-400 mx-4" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-800">Basic Information</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div data-tutorial="multigrade-planner-subject">
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

                      <div data-tutorial="multigrade-planner-grades">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Grade Range <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.gradeRange}
                          onChange={(e) => handleInputChange('gradeRange', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                          style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                        >
                          <option value="">Select grade range</option>
                          {gradeRanges.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    </div>

                    <div data-tutorial="multigrade-planner-theme">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Topic <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.topic}
                        onChange={(e) => handleInputChange('topic', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Essential Learning Outcomes <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.essentialLearningOutcomes}
                        onChange={(e) => handleInputChange('essentialLearningOutcomes', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                        placeholder="Include outcomes for each grade level in your range"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specific Learning Objectives <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.specificLearningObjectives}
                        onChange={(e) => handleInputChange('specificLearningObjectives', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Total Number of Students <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.totalStudents}
                          onChange={(e) => handleInputChange('totalStudents', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duration (minutes) <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          value={formData.duration}
                          onChange={(e) => handleInputChange('duration', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                          style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prerequisite Skills
                      </label>
                      <textarea
                        value={formData.prerequisiteSkills}
                        onChange={(e) => handleInputChange('prerequisiteSkills', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                      />
                    </div>

                    <div data-tutorial="multigrade-planner-resources">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Materials <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.materials}
                        onChange={(e) => handleInputChange('materials', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Learning & Strategies */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-800">Learning Styles & Preferences</h3>

                    <div data-tutorial="multigrade-planner-grouping">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Learning Styles <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {learningStylesOptions.map(style => (
                          <label key={style} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
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
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Learning Preferences
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {learningPreferencesOptions.map(pref => (
                          <label key={pref} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
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
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Multiple Intelligences
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {multipleIntelligencesOptions.map(intel => (
                          <label key={intel} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Learning Styles (Optional)
                      </label>
                      <textarea
                        value={formData.customLearningStyles}
                        onChange={(e) => handleInputChange('customLearningStyles', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                      />
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mt-8">Teaching Strategies</h3>

                    <div data-tutorial="multigrade-planner-common-activities">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Pedagogical Strategies <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {pedagogicalStrategiesOptions.map(strategy => (
                          <label key={strategy} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
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
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Multigrade Teaching Strategies <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {multigradeStrategiesOptions.map(strategy => (
                          <label key={strategy} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
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
                {step === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-800">Special Needs Accommodations</h3>

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
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Special Needs Details
                        </label>
                        <textarea
                          value={formData.specialNeedsDetails}
                          onChange={(e) => handleInputChange('specialNeedsDetails', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                          style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Differentiation Notes
                      </label>
                      <textarea
                        value={formData.differentiationNotes}
                        onChange={(e) => handleInputChange('differentiationNotes', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                        style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                        placeholder="How will you differentiate for different grade levels?"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="max-w-3xl mx-auto flex items-center justify-between">
                <div>
                  {step > 1 && (
                    <button
                      onClick={() => setStep(step - 1)}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg"
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
                      onClick={() => setStep(step + 1)}
                      disabled={!validateStep()}
                      className="flex items-center px-6 py-2 text-white rounded-lg disabled:bg-gray-300 transition"
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
                      className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition"
                      style={loading || !validateStep() ? {} : { backgroundColor: 'rgb(22 163 74)' }}
                      data-tutorial="multigrade-planner-generate"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
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
        className={`border-l border-gray-200 bg-gray-50 transition-all duration-300 overflow-hidden ${
          historyOpen ? 'w-80' : 'w-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Saved Multigrade Plans</h3>
            <button
              onClick={() => setHistoryOpen(false)}
              className="p-1 rounded hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
            {multigradeHistories.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No saved multigrade plans yet</p>
              </div>
            ) : (
              multigradeHistories.map((history) => (
                <div
                  key={history.id}
                  onClick={() => loadMultigradeHistory(history)}
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