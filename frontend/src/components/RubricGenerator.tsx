import React, { useState, useEffect, useRef } from 'react';
import { Loader2, FileText, Trash2, Save, Download, History, X, Edit, Sparkles } from 'lucide-react';
import ExportButton from './ExportButton';
import AIAssistantPanel from './AIAssistantPanel';
import RubricEditor from './RubricEditor';
import type { ParsedRubric, CriteriaRow } from './RubricEditor';
import axios from 'axios';
import { buildRubricPrompt } from '../utils/rubricPromptBuilder';
import { useSettings } from '../contexts/SettingsContext';
import { TutorialOverlay } from './TutorialOverlay';
import { TutorialButton } from './TutorialButton';
import { tutorials, TUTORIAL_IDS } from '../data/tutorialSteps';
import { useWebSocket } from '../contexts/WebSocketContext';
import { getWebSocketUrl, isElectronEnvironment } from '../config/api.config';

interface RubricGeneratorProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
}

interface RubricHistory {
  id: string;
  title: string;
  timestamp: string;
  formData: FormData;
  generatedRubric: string;
  parsedRubric?: ParsedRubric;
}

interface FormData {
  assignmentTitle: string;
  assignmentType: string;
  subject: string;
  gradeLevel: string;
  learningObjectives: string;
  specificRequirements: string;
  performanceLevels: string;
  includePointValues: boolean;
  focusAreas: string[];
}

const formatRubricText = (text: string, accentColor: string, isStreaming: boolean = false) => {
  if (!text) return null;

  let cleanText = text;
  
  // ONLY do aggressive cleaning when streaming is complete
  if (!isStreaming) {
    // Remove everything before the actual content starts
    const contentMarkers = [
      'GRADING RUBRIC',
      'Rubric',
      'Assignment:',
      'Performance Level',
      'Criteria',
      '**'
    ];
    
    let startIndex = 0;
    for (const marker of contentMarkers) {
      const idx = cleanText.indexOf(marker);
      if (idx !== -1 && (startIndex === 0 || idx < startIndex)) {
        const beforeMarker = cleanText.substring(Math.max(0, idx - 500), idx);
        if (beforeMarker.includes('llama') || beforeMarker.includes('build:') || beforeMarker.includes('main:')) {
          startIndex = idx;
        }
      }
    }
    
    if (startIndex > 0) {
      cleanText = cleanText.substring(startIndex);
    }
    
    // Do the line-by-line filtering only when not streaming
    const lines = cleanText.split('\n');
    let contentStartLine = 0;
    for (let i = 0; i < Math.min(20, lines.length); i++) {
      const line = lines[i].toLowerCase();
      if (line.includes('llama') || line.includes('build') || line.includes('main:') || 
          line.includes('loader') || line.includes('backend') || line.includes('gguf')) {
        contentStartLine = i + 1;
      } else if (lines[i].trim().length > 0) {
        break;
      }
    }
    cleanText = lines.slice(contentStartLine).join('\n');
  }
  
  // Light cleaning for both streaming and final (just remove obvious metadata)
  cleanText = cleanText
    .replace(/build: \d+ \([a-f0-9]+\).*/gi, '')
    .replace(/main: .*/gi, '')
    .replace(/llama_.*/gi, '')
    .replace(/.*GGUF.*/gi, '')
    .replace(/.*backend.*/gi, '')
    .replace(/.*loader:.*/gi, '')
    .replace(/.*kv \d+:.*/gi, '')
    .replace(/.*metadata.*/gi, '')
    .replace(/.*dumping.*/gi, '')
    .replace(/.*overrides.*/gi, '')
    .trim();

  const filteredLines = cleanText.split('\n');
  const elements: JSX.Element[] = [];
  let currentIndex = 0;

  filteredLines.forEach((line) => {
    const trimmed = line.trim();
    
    if (!trimmed) {
      elements.push(<div key={`space-${currentIndex++}`} className="h-3"></div>);
      return;
    }

    // Skip any remaining metadata lines
    if (trimmed.toLowerCase().includes('llama') || 
        trimmed.toLowerCase().includes('build:') ||
        trimmed.toLowerCase().includes('backend') ||
        trimmed.includes('kv ')) {
      return;
    }

    // Main section headings (bold, standalone)
    if (trimmed.match(/^\*\*(.+)\*\*$/) && !trimmed.includes(':')) {
      const title = trimmed.replace(/\*\*/g, '');
      elements.push(
        <h2 key={`section-${currentIndex++}`} className="text-xl font-bold mt-8 mb-4 pb-2 border-b-2" style={{ color: `${accentColor}dd`, borderColor: `${accentColor}4d` }}>
          {title}
        </h2>
      );
      return;
    }

    // Subsection headings (with colon)
    if (trimmed.match(/^\*\*[^*]+:\*\*/) || trimmed.match(/^\*\*[^*]+:$/)) {
      const title = trimmed.replace(/^\*\*/, '').replace(/\*\*$/, '').replace(/:$/, '');
      elements.push(
        <h3 key={`subsection-${currentIndex++}`} className="text-lg font-semibold mt-6 mb-3 px-3 py-2 rounded-lg border-l-4" style={{ color: `${accentColor}cc`, backgroundColor: `${accentColor}0d`, borderColor: accentColor }}>
          {title}:
        </h3>
      );
      return;
    }

    // Criteria levels with special highlighting
    if (trimmed.match(/^(Excellent|Proficient|Developing|Beginning|Outstanding|Good|Satisfactory|Fair|Needs Improvement|Advanced|Basic).*:/i)) {
      elements.push(
        <div key={`criteria-${currentIndex++}`} className="mt-4 mb-3">
          <div className="border-l-4 p-4 rounded-r-lg shadow-sm" style={{ background: `linear-gradient(to right, ${accentColor}1a, ${accentColor}0d)`, borderColor: `${accentColor}cc` }}>
            <h4 className="font-bold text-lg" style={{ color: `${accentColor}dd` }}>{trimmed}</h4>
          </div>
        </div>
      );
      return;
    }

    // Table detection (contains | characters)
    if (trimmed.includes('|')) {
      const cells = trimmed.split('|').map(cell => cell.trim()).filter(cell => cell.length > 0);
      
      // Skip separator rows
      if (trimmed.includes('---')) {
        return;
      }
      
      if (cells.length > 0) {
        const isHeaderRow = currentIndex < 3;
        elements.push(
          <div key={`table-row-${currentIndex++}`}
               className="grid gap-2 py-3 px-2"
               style={{
                 gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))`,
                 borderBottom: `1px solid ${accentColor}33`,
                 backgroundColor: isHeaderRow ? `${accentColor}1a` : 'transparent',
                 fontWeight: isHeaderRow ? 600 : 400
               }}
               onMouseEnter={(e) => !isHeaderRow && (e.currentTarget.style.backgroundColor = `${accentColor}0d`)}
               onMouseLeave={(e) => !isHeaderRow && (e.currentTarget.style.backgroundColor = 'transparent')}>
            {cells.map((cell, idx) => (
              <div key={idx} className={`px-2 ${idx === 0 ? 'font-semibold' : 'text-gray-700'}`} style={idx === 0 ? { color: `${accentColor}dd` } : {}}>
                {cell}
              </div>
            ))}
          </div>
        );
      }
      return;
    }

    // Bullet points
    if (trimmed.match(/^\s*[\*\-•]\s+/) && !trimmed.startsWith('**')) {
      const content = trimmed.replace(/^\s*[\*\-•]\s+/, '');
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

// Parse rubric text content into structured ParsedRubric format
const parseRubricContent = (text: string, formData: FormData): ParsedRubric | null => {
  if (!text) return null;

  try {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Extract metadata from form data
    const metadata = {
      title: formData.assignmentTitle,
      assignmentType: formData.assignmentType,
      subject: formData.subject,
      gradeLevel: formData.gradeLevel,
      learningObjectives: formData.learningObjectives,
      specificRequirements: formData.specificRequirements,
      includePointValues: formData.includePointValues
    };

    // Try to detect performance levels from table headers or text
    const performanceLevels: string[] = [];
    const criteria: CriteriaRow[] = [];
    
    // Look for table structure (lines with | characters)
    const tableLines = lines.filter(line => line.includes('|'));
    
    if (tableLines.length > 0) {
      // Extract header row (first table line)
      const headerLine = tableLines[0];
      const headerCells = headerLine.split('|')
        .map(cell => cell.trim())
        .filter(cell => cell.length > 0 && !cell.match(/^-+$/));
      
      if (headerCells.length > 1) {
        // First cell is usually "Criteria" or criterion name, rest are performance levels
        performanceLevels.push(...headerCells.slice(1));
      }
      
      // Parse data rows (skip separator rows with ---)
      const dataRows = tableLines.slice(1).filter(line => !line.includes('---'));
      
      dataRows.forEach((row, index) => {
        const cells = row.split('|')
          .map(cell => cell.trim())
          .filter(cell => cell.length > 0);
        
        if (cells.length > 1) {
          const criterionName = cells[0];
          const levels: { [key: string]: string } = {};
          const points: { [key: string]: number } = {};
          
          cells.slice(1).forEach((cell, i) => {
            if (i < performanceLevels.length) {
              const levelName = performanceLevels[i];
              
              // Try to extract points if present (e.g., "Description (5 pts)")
              const pointsMatch = cell.match(/\((\d+)\s*pts?\)/i);
              if (pointsMatch) {
                points[levelName] = parseInt(pointsMatch[1]);
                levels[levelName] = cell.replace(/\s*\(\d+\s*pts?\)/i, '').trim();
              } else {
                levels[levelName] = cell;
              }
            }
          });
          
          criteria.push({
            id: `criterion_${index}`,
            criterion: criterionName,
            levels,
            points: metadata.includePointValues && Object.keys(points).length > 0 ? points : undefined
          });
        }
      });
    }
    
    // Fallback: if no table detected, try to parse from structured text
    if (performanceLevels.length === 0) {
      // Default performance levels based on form data
      const numLevels = parseInt(formData.performanceLevels) || 4;
      const defaultLevels = ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement', 'Beginning', 'Advanced'];
      performanceLevels.push(...defaultLevels.slice(0, numLevels));
    }
    
    // If no criteria were found, create a default structure
    if (criteria.length === 0) {
      // Look for common criterion patterns in text
      const criterionPatterns = [
        /\*\*([^:]+):\*\*/g,
        /^([^:]+):/gm
      ];
      
      let foundCriteria: string[] = [];
      for (const pattern of criterionPatterns) {
        const matches = Array.from(text.matchAll(pattern));
        if (matches.length > 0) {
          foundCriteria = matches.map(m => m[1].trim());
          break;
        }
      }
      
      if (foundCriteria.length > 0) {
        foundCriteria.forEach((criterionName, index) => {
          const levels: { [key: string]: string } = {};
          performanceLevels.forEach(level => {
            levels[level] = '';
          });
          
          criteria.push({
            id: `criterion_${index}`,
            criterion: criterionName,
            levels,
            points: metadata.includePointValues ?
              performanceLevels.reduce((acc, level) => ({ ...acc, [level]: 0 }), {} as { [key: string]: number })
              : undefined
          });
        });
      }
    }
    
    // Final fallback: create at least one empty criterion
    if (criteria.length === 0) {
      const levels: { [key: string]: string } = {};
      performanceLevels.forEach(level => {
        levels[level] = '';
      });
      
      criteria.push({
        id: 'criterion_0',
        criterion: 'Criterion 1',
        levels,
        points: metadata.includePointValues ?
          performanceLevels.reduce((acc, level) => ({ ...acc, [level]: 0 }), {} as { [key: string]: number })
          : undefined
      });
    }
    
    return {
      metadata,
      performanceLevels,
      criteria
    };
  } catch (error) {
    console.error('Failed to parse rubric:', error);
    return null;
  }
};

// Convert ParsedRubric back to display text format
const rubricToDisplayText = (rubric: ParsedRubric): string => {
  let output = '';
  
  // Add metadata header
  output += `**GRADING RUBRIC**\n\n`;
  output += `**Assignment:** ${rubric.metadata.title}\n`;
  output += `**Type:** ${rubric.metadata.assignmentType}\n`;
  output += `**Subject:** ${rubric.metadata.subject}\n`;
  output += `**Grade Level:** ${rubric.metadata.gradeLevel}\n\n`;
  
  if (rubric.metadata.learningObjectives) {
    output += `**Learning Objectives:**\n${rubric.metadata.learningObjectives}\n\n`;
  }
  
  if (rubric.metadata.specificRequirements) {
    output += `**Specific Requirements:**\n${rubric.metadata.specificRequirements}\n\n`;
  }
  
  // Create table header
  output += `**Rubric Table**\n\n`;
  const headerRow = ['Criteria', ...rubric.performanceLevels];
  output += `| ${headerRow.join(' | ')} |\n`;
  output += `| ${headerRow.map(() => '---').join(' | ')} |\n`;
  
  // Add criteria rows
  rubric.criteria.forEach(criterion => {
    const cells = [criterion.criterion];
    
    rubric.performanceLevels.forEach(level => {
      let cellContent = criterion.levels[level] || '';
      
      // Add points if included
      if (rubric.metadata.includePointValues && criterion.points && criterion.points[level]) {
        cellContent += ` (${criterion.points[level]} pts)`;
      }
      
      cells.push(cellContent);
    });
    
    output += `| ${cells.join(' | ')} |\n`;
  });
  
  return output;
};

const RubricGenerator: React.FC<RubricGeneratorProps> = ({ tabId, savedData, onDataChange }) => {
  const { settings, markTutorialComplete, isTutorialCompleted } = useSettings();
  const tabColor = settings.tabColors['rubric-generator'];
  // Per-tab local loading state
  const [localLoadingMap, setLocalLoadingMap] = useState<{ [tabId: string]: boolean }>({});
  const loading = !!localLoadingMap[tabId];
  const [showTutorial, setShowTutorial] = useState(false);
  const shouldReconnectRef = useRef(true);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [rubricHistories, setRubricHistories] = useState<RubricHistory[]>([]);
  const [currentRubricId, setCurrentRubricId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // State for structured editing
  const [isEditing, setIsEditing] = useState(false);
  const [parsedRubric, setParsedRubric] = useState<ParsedRubric | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);

  // Track initialization per tab to prevent state loss on tab switches
  const hasInitializedRef = useRef(false);
  const currentTabIdRef = useRef(tabId);

  // Helper function to get default empty form data
  const getDefaultFormData = (): FormData => ({
    assignmentTitle: '',
    assignmentType: '',
    subject: '',
    gradeLevel: '',
    learningObjectives: '',
    specificRequirements: '',
    performanceLevels: '4',
    includePointValues: false,
    focusAreas: []
  });

  const [formData, setFormData] = useState<FormData>(() => {
    const saved = savedData?.formData;
    // Robust validation: check if saved data exists AND has meaningful content
    if (saved && typeof saved === 'object' && saved.assignmentTitle?.trim()) {
      return saved;
    }
    return getDefaultFormData();
  });

  const [generatedRubric, setGeneratedRubric] = useState<string>(savedData?.generatedRubric || '');
  const [streamingRubric, setStreamingRubric] = useState<string>(savedData?.streamingRubric || '');

  const assignmentTypes = [
    'Essay', 'Presentation', 'Project', 'Lab Report', 'Creative Writing', 
    'Research Paper', 'Group Work', 'Portfolio', 'Performance', 'Other'
  ];

  const subjects = [
    'Language Arts', 'Mathematics', 'Science', 'Social Studies', 
    'Art', 'Music', 'Physical Education', 'Technology', 'Other'
  ];

  const grades = [
    'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 
    'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'
  ];

  const focusAreasOptions = [
    'Content Knowledge', 'Critical Thinking', 'Communication', 'Collaboration',
    'Creativity', 'Organization', 'Research Skills', 'Problem Solving',
    'Technical Skills', 'Presentation Skills'
  ];

  // Try to parse rubric when generated (for restored/loaded rubrics)
  useEffect(() => {
    if (generatedRubric && !parsedRubric) {
      console.log('Attempting to parse loaded/restored rubric...');
      const parsed = parseRubricContent(generatedRubric, formData);
      if (parsed) {
        console.log('Loaded rubric parsed successfully');
        setParsedRubric(parsed);
      } else {
        console.log('Loaded rubric parsing failed');
      }
    }
  }, [generatedRubric]);

  // Auto-enable editing mode if startInEditMode flag is set
  useEffect(() => {
    if (savedData?.startInEditMode && parsedRubric && !isEditing) {
      console.log('Auto-enabling edit mode for rubric');
      setIsEditing(true);
    }
  }, [savedData?.startInEditMode, parsedRubric, isEditing]);

  // FIXED: Properly handle tab switches without losing state
  useEffect(() => {
    const isNewTab = currentTabIdRef.current !== tabId;
    currentTabIdRef.current = tabId;
    
    // Only update state when switching tabs OR on first initialization
    if (isNewTab || !hasInitializedRef.current) {
      const saved = savedData?.formData;
      
      // Robust validation: check if saved data has meaningful content
      if (saved && typeof saved === 'object' && saved.assignmentTitle?.trim()) {
        // Restore all state for this tab
        setFormData(saved);
        setGeneratedRubric(savedData?.generatedRubric || '');
        setStreamingRubric(savedData?.streamingRubric || '');
        setParsedRubric(savedData?.parsedRubric || null);
      } else {
        // New tab or empty tab - set to default state
        setFormData(getDefaultFormData());
        setGeneratedRubric('');
        setStreamingRubric('');
        setParsedRubric(null);
      }
      
      hasInitializedRef.current = true;
    }
  }, [tabId, savedData]);

  // Auto-show tutorial on first use
  useEffect(() => {
    if (
      settings.tutorials.tutorialPreferences.autoShowOnFirstUse &&
      !isTutorialCompleted(TUTORIAL_IDS.RUBRIC_GENERATOR)
    ) {
      setShowTutorial(true);
    }
  }, [settings, isTutorialCompleted]);

  const handleTutorialComplete = () => {
    markTutorialComplete(TUTORIAL_IDS.RUBRIC_GENERATOR);
    setShowTutorial(false);
  };

  useEffect(() => {
    onDataChange({ formData, generatedRubric, streamingRubric, parsedRubric });
  }, [formData, generatedRubric, streamingRubric, parsedRubric]);

  useEffect(() => {
    shouldReconnectRef.current = true;

    const connectWebSocket = () => {
      if (!shouldReconnectRef.current) return;
      
      // Prevent multiple simultaneous connections
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        console.log('WebSocket already connected, skipping');
        return;
      }

      try {
        const wsUrl = getWebSocketUrl('/ws/rubric', isElectronEnvironment());
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          console.log('Rubric WebSocket connected');
          // Clear any pending reconnection attempts
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        };
        
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === 'token') {
            setStreamingRubric(prev => prev + data.content);
          } else if (data.type === 'done') {
            setStreamingRubric(current => {
              const finalMessage = current || data.full_response;
              setGeneratedRubric(finalMessage);
              setLocalLoadingMap(prev => ({ ...prev, [tabId]: false }));
              return '';
            });
          }
        };
        
        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setLocalLoadingMap(prev => ({ ...prev, [tabId]: false }));
        };
        
        ws.onclose = () => {
          console.log('WebSocket closed');
          wsRef.current = null;
          
          // Only reconnect if not intentional close and not already reconnecting
          if (shouldReconnectRef.current && !reconnectTimeoutRef.current) {
            console.log('Reconnecting in 2 seconds...');
            reconnectTimeoutRef.current = setTimeout(() => {
              reconnectTimeoutRef.current = null;
              connectWebSocket();
            }, 2000);
          }
        };
        
        wsRef.current = ws;
      } catch (error) {
        console.error('Failed to create WebSocket:', error);
        if (shouldReconnectRef.current && !reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connectWebSocket();
          }, 2000);
        }
      }
    };
    
    connectWebSocket();
    
    return () => {
      console.log('Cleaning up WebSocket connection');
      shouldReconnectRef.current = false;
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      if (wsRef.current) {
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.close();
        }
        wsRef.current = null;
      }
    };
  }, []);  

  // Enable structured editing mode
  const enableEditing = () => {
    if (parsedRubric) {
      setIsEditing(true);
    } else {
      alert('Cannot edit: Rubric format not recognized. Try regenerating the rubric.');
    }
  };

  // Save edited rubric
  const saveEditedRubric = (editedRubric: ParsedRubric) => {
    setParsedRubric(editedRubric);
    const displayText = rubricToDisplayText(editedRubric);
    setGeneratedRubric(displayText);
    setIsEditing(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
  };

  const loadRubricHistories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/rubric-history');
      setRubricHistories(response.data);
    } catch (error) {
      console.error('Failed to load rubric histories:', error);
    }
  };

  const saveRubric = async () => {
    const contentToSave = parsedRubric ? rubricToDisplayText(parsedRubric) : generatedRubric;
    if (!contentToSave) {
      alert('No rubric to save');
      return;
    }

    setSaveStatus('saving');
    try {
      const rubricData = {
        id: currentRubricId || `rubric_${Date.now()}`,
        title: `${formData.assignmentTitle} - ${formData.subject} (${formData.gradeLevel})`,
        timestamp: new Date().toISOString(),
        formData: formData,
        generatedRubric: contentToSave,
        parsedRubric: parsedRubric || undefined
      };

      if (!currentRubricId) {
        setCurrentRubricId(rubricData.id);
      }

      await axios.post('http://localhost:8000/api/rubric-history', rubricData);
      await loadRubricHistories();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save rubric:', error);
      alert('Failed to save rubric');
      setSaveStatus('idle');
    }
  };

  const loadRubricHistory = (history: RubricHistory) => {
    setFormData(history.formData);
    setGeneratedRubric(history.generatedRubric);
    setParsedRubric(history.parsedRubric || null);
    setCurrentRubricId(history.id);
    setHistoryOpen(false);
  };

  const deleteRubricHistory = async (rubricId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this rubric?')) return;
    
    try {
      await axios.delete(`http://localhost:8000/api/rubric-history/${rubricId}`);
      await loadRubricHistories();
      if (currentRubricId === rubricId) {
        clearForm();
      }
    } catch (error) {
      console.error('Failed to delete rubric:', error);
    }
  };

  // Removed old exportRubric logic; now handled by ExportButton

  useEffect(() => {
    loadRubricHistories();
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

  const generateRubric = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      alert('Connection not established. Please wait and try again.');
      return;
    }

    setLocalLoadingMap(prev => ({ ...prev, [tabId]: true }));
    setStreamingRubric('');

    const prompt = buildRubricPrompt(formData);

    try {
      wsRef.current.send(JSON.stringify({
        prompt,
        generationMode: settings.generationMode,
      }));
    } catch (error) {
      console.error('Failed to send rubric request:', error);
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      assignmentTitle: '',
      assignmentType: '',
      subject: '',
      gradeLevel: '',
      learningObjectives: '',
      specificRequirements: '',
      performanceLevels: '4',
      includePointValues: false,
      focusAreas: []
    });
    setGeneratedRubric('');
    setStreamingRubric('');
    setParsedRubric(null);
    setCurrentRubricId(null);
    setIsEditing(false);
  };

  const validateForm = () => {
    return formData.assignmentTitle && formData.assignmentType && formData.subject && 
           formData.gradeLevel && formData.learningObjectives;
  };

  return (
    <div className="flex h-full bg-white relative" data-tutorial="rubric-generator-welcome">
      <div className="flex-1 flex flex-col bg-white">
        {(generatedRubric || streamingRubric) ? (
          <>
            {isEditing && parsedRubric ? (
              // Show Structured Editor
              <RubricEditor
                rubric={parsedRubric}
                onSave={saveEditedRubric}
                onCancel={cancelEditing}
              />
            ) : (   
              <>
                <div className="border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {loading ? 'Generating Rubric...' : 'Generated Rubric'}
                    </h2>
                    <p className="text-sm text-gray-500">{formData.assignmentTitle} - {formData.subject}</p>
                  </div>
                  {!loading && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={enableEditing}
                        disabled={!parsedRubric}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        title={!parsedRubric ? "Rubric format not recognized" : "Edit rubric"}
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
                        onClick={saveRubric}
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
                            Save Rubric
                          </>
                        )}
                      </button>
                      <ExportButton
                        dataType="rubric"
                        data={{
                          content: parsedRubric ? rubricToDisplayText(parsedRubric) : generatedRubric,
                          formData: formData,
                          accentColor: tabColor
                        }}
                        filename={`rubric-${formData.assignmentTitle.toLowerCase().replace(/\s+/g, '-')}`}
                        className="ml-2"
                      />
                      <button
                        onClick={() => setHistoryOpen(!historyOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition"
                        title="Rubric History"
                      >
                        <History className="w-5 h-5 text-gray-600" />
                      </button>
                      <button
                        onClick={() => {
                          setGeneratedRubric('');
                          setStreamingRubric('');
                          setParsedRubric(null);
                          setIsEditing(false);
                        }}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                      >
                        Create New Rubric
                      </button>
                    </div>
                  )}
                </div>
            
                <div className="flex-1 overflow-y-auto bg-white p-6">
                  {(streamingRubric || generatedRubric) && (
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
                            {formData.assignmentTitle}
                          </h1>
                          
                          <div className="flex flex-wrap items-center gap-4 text-amber-100">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-amber-200 rounded-full mr-2"></div>
                              <span className="text-sm">{formData.gradeLevel}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-amber-200 rounded-full mr-2"></div>
                              <span className="text-sm">{formData.assignmentType}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-amber-200 rounded-full mr-2"></div>
                              <span className="text-sm">{formData.performanceLevels} Performance Levels</span>
                            </div>
                          </div>
                        </div>
                        
                        {loading && (
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                            <div className="flex items-center text-white">
                              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                              <div>
                                <div className="text-sm font-medium">Generating...</div>
                                <div className="text-xs text-amber-100">AI-powered rubric</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-white/20">
                        <div className="flex items-center justify-between">
                          <div className="text-amber-100 text-sm">
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
                      {formatRubricText(streamingRubric || generatedRubric, tabColor, !!streamingRubric)}
                      {loading && streamingRubric && (
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
                          <div className="font-medium" style={{ color: `${tabColor}dd` }}>Creating your rubric</div>
                          <div className="text-sm mt-1" style={{ color: `${tabColor}99` }}>Detailed grading criteria and performance levels</div>
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
                <h2 className="text-xl font-semibold text-gray-800">Rubric Details</h2>
                <p className="text-sm text-gray-500">Provide information about your assignment to generate a customized rubric</p>
              </div>
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                title="Rubric History"
              >
                <History className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                <div data-tutorial="rubric-generator-assignment">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.assignmentTitle}
                    onChange={(e) => handleInputChange('assignmentTitle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                    placeholder="e.g., Persuasive Essay on Climate Change"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignment Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.assignmentType}
                    onChange={(e) => handleInputChange('assignmentType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                  >
                    <option value="">Select type</option>
                    {assignmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                  >
                    <option value="">Select subject</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Grade Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => handleInputChange('gradeLevel', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                  >
                    <option value="">Select grade</option>
                    {grades.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div data-tutorial="rubric-generator-criteria">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Objectives <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.learningObjectives}
                    onChange={(e) => handleInputChange('learningObjectives', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                    placeholder="What should students demonstrate or achieve?"
                  />
                </div>

                <div data-tutorial="rubric-generator-descriptors">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specific Requirements
                  </label>
                  <textarea
                    value={formData.specificRequirements}
                    onChange={(e) => handleInputChange('specificRequirements', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2"
                    style={{ '--tw-ring-color': tabColor } as React.CSSProperties}
                    placeholder="Any specific requirements or criteria for the assignment"
                  />
                </div>

                <div data-tutorial="rubric-generator-levels">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Performance Levels
                  </label>
                  <div className="flex gap-4">
                    {['3', '4', '5', '6'].map(level => (
                      <label key={level} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="performanceLevels"
                          value={level}
                          checked={formData.performanceLevels === level}
                          onChange={(e) => handleInputChange('performanceLevels', e.target.value)}
                          className="w-4 h-4"
                          style={{ accentColor: tabColor }}
                        />
                        <span className="text-sm">{level} Levels</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div data-tutorial="rubric-generator-points">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Options</label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.includePointValues}
                      onChange={(e) => handleInputChange('includePointValues', e.target.checked)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: tabColor }}
                    />
                    <span className="text-sm">Include point values</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Focus Areas (Optional)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {focusAreasOptions.map(area => (
                      <label key={area} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.focusAreas.includes(area)}
                          onChange={() => handleCheckboxChange('focusAreas', area)}
                          className="w-4 h-4 rounded"
                          style={{ accentColor: tabColor }}
                        />
                        <span className="text-sm">{area}</span>
                      </label>
                    ))}
                  </div>
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
                  onClick={generateRubric}
                  disabled={!validateForm() || loading}
                  className="flex items-center px-6 py-2 text-white rounded-lg disabled:bg-gray-300 transition"
                  data-tutorial="rubric-generator-generate"
                  style={!validateForm() || loading ? {} : { backgroundColor: tabColor }}
                  onMouseEnter={(e) => !loading && validateForm() && (e.currentTarget.style.opacity = '0.9')}
                  onMouseLeave={(e) => !loading && validateForm() && (e.currentTarget.style.opacity = '1')}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Generate Rubric
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
            <h3 className="text-lg font-semibold text-gray-800">Saved Rubrics</h3>
            <button
              onClick={() => setHistoryOpen(false)}
              className="p-1 rounded hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
            {rubricHistories.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No saved rubrics yet</p>
              </div>
            ) : (
              rubricHistories.map((history) => (
                <div
                  key={history.id}
                  onClick={() => loadRubricHistory(history)}
                  className={`p-3 rounded-lg cursor-pointer transition group hover:bg-white ${
                    currentRubricId === history.id ? 'bg-white shadow-sm' : 'bg-gray-100'
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
                      onClick={(e) => deleteRubricHistory(history.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition"
                      title="Delete rubric"
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
        content={generatedRubric}
        contentType="rubric"
        onContentUpdate={(newContent) => {
          setGeneratedRubric(newContent);
          const parsed = parseRubricContent(newContent, formData);
          if (parsed) setParsedRubric(parsed);
        }}
      />

      <TutorialOverlay
        steps={tutorials[TUTORIAL_IDS.RUBRIC_GENERATOR].steps}
        onComplete={handleTutorialComplete}
        autoStart={showTutorial}
        showFloatingButton={false}
      />
 
      {/* Disable local TutorialButton (handled globally in Dashboard) */}
      
    </div>
  );
};

export default RubricGenerator;