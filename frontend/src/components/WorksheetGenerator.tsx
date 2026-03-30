import React, { useState, useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import File01IconData from '@hugeicons/core-free-icons/File01Icon';
import Loading02IconData from '@hugeicons/core-free-icons/Loading02Icon';
import { useAchievementTrigger } from '../contexts/AchievementContext';
import ViewIconData from '@hugeicons/core-free-icons/ViewIcon';
import Delete02IconData from '@hugeicons/core-free-icons/Delete02Icon';
import MagicWand01IconData from '@hugeicons/core-free-icons/MagicWand01Icon';
import SaveIconData from '@hugeicons/core-free-icons/SaveIcon';
import Clock01IconData from '@hugeicons/core-free-icons/Clock01Icon';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import Download01IconData from '@hugeicons/core-free-icons/Download01Icon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import UserGroupIconData from '@hugeicons/core-free-icons/UserGroupIcon';
import GraduationScrollIconData from '@hugeicons/core-free-icons/GraduationScrollIcon';
import Tick01IconData from '@hugeicons/core-free-icons/Tick01Icon';
import UndoIconData from '@hugeicons/core-free-icons/UndoIcon';
import ShuffleIconData from '@hugeicons/core-free-icons/ShuffleIcon';
import PrinterIconData from '@hugeicons/core-free-icons/PrinterIcon';
import PaintBrush01IconData from '@hugeicons/core-free-icons/PaintBrush01Icon';
import Search01IconData from '@hugeicons/core-free-icons/Search01Icon';
import Upload01IconData from '@hugeicons/core-free-icons/Upload01Icon';
import ImageNotFound01IconData from '@hugeicons/core-free-icons/ImageNotFound01Icon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const FileText: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={File01IconData} {...p} />;
const Loader2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Loading02IconData} {...p} />;
const Eye: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ViewIconData} {...p} />;
const Trash2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Delete02IconData} {...p} />;
const Wand2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={MagicWand01IconData} {...p} />;
const Save: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={SaveIconData} {...p} />;
const History: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Clock01IconData} {...p} />;
const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Cancel01IconData} {...p} />;
const Download: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Download01IconData} {...p} />;
const ChevronDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowDown01IconData} {...p} />;
const Users: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={UserGroupIconData} {...p} />;
const GraduationCap: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={GraduationScrollIconData} {...p} />;
const Check: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Tick01IconData} {...p} />;
const Undo2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={UndoIconData} {...p} />;
const Shuffle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ShuffleIconData} {...p} />;
const Printer: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PrinterIconData} {...p} />;
const PaintBrush: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PaintBrush01IconData} {...p} />;
const Search: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Search01IconData} {...p} />;
const Upload: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Upload01IconData} {...p} />;
const ImageOff: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ImageNotFound01IconData} {...p} />;
import { useCurriculumIndex } from '../data/curriculumLoader';
import {
  MultipleChoiceTemplate,
  ComprehensionTemplate,
  MatchingTemplate,
  ListBasedTemplate,
  MathTemplate
} from './templates';

import { imageApi } from '../lib/imageApi';
import { useWebSocket } from '../contexts/WebSocketContext';
import { useQueue } from '../contexts/QueueContext';
import { buildWorksheetPrompt } from '../utils/worksheetPromptBuilder';
import { parseWorksheetFromAI, ParsedWorksheet, worksheetToDisplayText, StudentWorksheetVersion, WorksheetPackage } from '../types/worksheet';
import { generateStudentVersions } from '../utils/worksheetRandomizer';
import { deriveWorksheetPalette } from '../utils/worksheetColorUtils';
import { GeneratorSkeleton } from './ui/GeneratorSkeleton';
import { HeartbeatLoader } from './ui/HeartbeatLoader';
import { SceneSpec, ImagePreset, StyleProfile } from '../types/scene';
import ExportButton from './ExportButton';
import WorksheetStructuredEditor from './WorksheetStructuredEditor';
import CurriculumAlignmentFields from './ui/CurriculumAlignmentFields';
import RelatedCurriculumBox from './ui/RelatedCurriculumBox';
import axios from 'axios';
import WorksheetGrader from './WorksheetGrader';
import ScheduleTestModal from './ScheduleTestModal';
import SmartTextArea from './SmartTextArea';
import { useQueueCancellation } from '../hooks/useQueueCancellation';
import SmartInput from './SmartInput';
import { useSettings } from '../contexts/SettingsContext';
import { filterSubjects, filterGrades } from '../data/teacherConstants';


interface CurriculumPage {
  subject: string;
  grade: string;
  strand: string;
  [key: string]: unknown;
}

interface CurriculumIndex {
  indexedPages: CurriculumPage[];
}

interface WorksheetGeneratorProps {
  tabId?: string;
  savedData?: Record<string, unknown>;
  onDataChange?: (data: Record<string, unknown>) => void;
  onOpenCurriculumTab?: (route: string) => void;
}

interface WorksheetHistory {
  id: string;
  title: string;
  timestamp: string;
  formData: WorksheetFormData;
  generatedWorksheet: string;
  parsedWorksheet: ParsedWorksheet | null;
  generatedImages?: string[];
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

interface WorksheetFormData {
  subject: string;
  gradeLevel: string;
  strand: string;
  topic: string;
  studentCount: string;
  questionCount: string;
  questionType: string;
  selectedTemplate: string;
  worksheetTitle: string;
  includeImages: boolean;
  imageStyle: string;
  imagePlacement: string;
  essentialOutcomes: string;
  specificOutcomes: string;
}

interface WorksheetTemplate {
  id: string;
  name: string;
  description: string;
  compatibleTypes: string[];
  preview: string; // Simple text representation for now
}

const questionTypeOptions = [
  'Multiple Choice',
  'Calculations',
  'True / False',
  'Word Bank',
  'Fill in the Blank',
  'Short Answer',
  'Matching',
  'Comprehension'
];


const worksheetTemplates: WorksheetTemplate[] = [
  {
    id: 'multiple-choice',
    name: 'Multiple Choice Template',
    description: 'Layout for multiple-choice questions with A-D options',
    compatibleTypes: ['Multiple Choice'],
    preview: 'Multiple Choice Layout Preview'
  },
  {
    id: 'math',
    name: 'Math Calculation Template',
    description: 'Vertical layout for arithmetic problems',
    compatibleTypes: ['Calculations'],
    preview: 'Vertical Math Layout'
  },
  {
    id: 'comprehension',
    name: 'Reading Comprehension Template',
    description: 'Passage-based comprehension questions layout',
    compatibleTypes: ['Comprehension', 'Short Answer', 'Multiple Choice'],
    preview: 'Comprehension Layout Preview'
  },
  {
    id: 'matching',
    name: 'Matching Template',
    description: 'Two-column matching layout for prompts and answers',
    compatibleTypes: ['Matching'],
    preview: 'Matching Layout Preview'
  },
  {
    id: 'list-based',
    name: 'List-Based Template',
    description: 'Simple vertical list for various question types',
    compatibleTypes: ['Short Answer', 'Fill in the Blank', 'Word Bank', 'True / False', 'Comprehension'],
    preview: 'List-Based Layout Preview'
  }
];

const allSubjectsWS = [
  'Mathematics',
  'Language Arts',
  'Science',
  'Social Studies'
];

const allGradesWS = ['K', '1', '2', '3', '4', '5', '6'];

const ENDPOINT = '/ws/worksheet';

const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = ({ tabId, savedData, onDataChange, onOpenCurriculumTab }) => {
  const triggerCheck = useAchievementTrigger();
  const { getConnection, getStreamingContent, getIsStreaming, clearStreaming } = useWebSocket();
  const { enqueue, queueEnabled } = useQueue();
  const { curriculumIndex } = useCurriculumIndex();
  const { settings } = useSettings();
  const LOCAL_STORAGE_KEY = `worksheet_state_${tabId}`;

  // Profile-based filtering for subject/grade dropdowns
  const gradeMapping = settings.profile.gradeSubjects || {};
  const filterOn = settings.profile.filterContentByProfile;
  const subjects = filterSubjects(allSubjectsWS, gradeMapping, filterOn);
  const grades = filterGrades(allGradesWS, gradeMapping, filterOn);

  const getDefaultFormData = (): WorksheetFormData => ({
    subject: '',
    gradeLevel: '',
    strand: '',
    topic: '',
    studentCount: '',
    questionCount: '',
    questionType: '',
    selectedTemplate: '',
    worksheetTitle: '',
    includeImages: false,
    imageStyle: 'cartoon_3d',
    imagePlacement: 'large-centered',
    essentialOutcomes: '',
    specificOutcomes: ''
  });

  const [formData, setFormData] = useState<WorksheetFormData>(() => {
    const validStyles = ['cartoon_3d', 'line_art_bw', 'illustrated_painting', 'realistic'];
    
    if (savedData?.formData && typeof savedData.formData === 'object') {
      // Normalize invalid imageStyle values
      const data = savedData.formData as WorksheetFormData;
      if (data.imageStyle && !validStyles.includes(data.imageStyle)) {
        data.imageStyle = 'cartoon_3d'; // Default to valid style
      }
      return data;
    }
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.formData && typeof parsed.formData === 'object') {
          // Normalize invalid imageStyle values
          if (parsed.formData.imageStyle && !validStyles.includes(parsed.formData.imageStyle)) {
            parsed.formData.imageStyle = 'cartoon_3d';
          }
          return parsed.formData;
        }
      }
    } catch (e) {
      console.error('Failed to restore formData:', e);
    }
    return getDefaultFormData();
  });

  const [generatedWorksheet, setGeneratedWorksheet] = useState<string>(() => {
    if (savedData?.generatedWorksheet) {
      return savedData.generatedWorksheet as string;
    }
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        return parsed.generatedWorksheet || '';
      }
    } catch (e) {
      console.error('Failed to restore generatedWorksheet:', e);
    }
    return '';
  });

  const [parsedWorksheet, setParsedWorksheet] = useState<ParsedWorksheet | null>(() => {
    if (savedData?.parsedWorksheet) {
      return savedData.parsedWorksheet as ParsedWorksheet;
    }
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        return parsed.parsedWorksheet || null;
      }
    } catch (e) {
      console.error('Failed to restore parsedWorksheet:', e);
    }
    return null;
  });

  const [curriculumMatches, setCurriculumMatches] = useState<CurriculumPage[]>([]);
  const [loadingCurriculum, setLoadingCurriculum] = useState(false);
  const [useCurriculum, setUseCurriculum] = useState(true);

  // ✅ Read streaming content from context (read-only, no setter!)
  const streamingWorksheet = getStreamingContent(tabId || '', ENDPOINT);
  const contextLoading = getIsStreaming(tabId || '', ENDPOINT);
  // Per-tab local loading state
  const [localLoadingMap, setLocalLoadingMap] = useState<{ [tabId: string]: boolean }>({});
  useQueueCancellation(tabId || '', ENDPOINT, setLocalLoadingMap);
  const loading = !!localLoadingMap[tabId || ''] || contextLoading;

  // ✅ Finalization logic - when streaming completes, update generatedWorksheet
  useEffect(() => {
    if (streamingWorksheet && !contextLoading) {
      console.log('Raw AI response:', streamingWorksheet);
      setGeneratedWorksheet(streamingWorksheet);
      const parsed = parseWorksheetFromAI(streamingWorksheet);
      if (parsed) {
        setParsedWorksheet(parsed);
      } else {
        setParsedWorksheet(null); // Fallback to raw text
      }
      clearStreaming(tabId || '', ENDPOINT);
      setLocalLoadingMap(prev => {
        const newMap = { ...prev };
        delete newMap[tabId || ''];
        return newMap;
      });
    }
  }, [streamingWorksheet, contextLoading, tabId, clearStreaming]);

  // Image generation state
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatingImages, setGeneratingImages] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  // Image source: 'generate' (scene preset) or 'upload' (user image)
  const [imageSource, setImageSource] = useState<'generate' | 'upload'>('generate');
  const [userUploadedImage, setUserUploadedImage] = useState<string | null>(null);
  const [userImageDescription, setUserImageDescription] = useState('');
  
  // Scene-based image generation state
  const [topicPresets, setTopicPresets] = useState<ImagePreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [sceneSpec, setSceneSpec] = useState<SceneSpec | null>(null);
  const [assetId, setAssetId] = useState<string | null>(null);
  const [styleProfiles, setStyleProfiles] = useState<Record<string, StyleProfile>>({});
  const [loadingPresets, setLoadingPresets] = useState(false);

  // Auto-select template when only one compatible option exists
  useEffect(() => {
    const compatible = getCompatibleTemplates();
    if (compatible.length === 1 && formData.selectedTemplate !== compatible[0].id) {
      handleInputChange('selectedTemplate', compatible[0].id);
    } else if (compatible.length > 1 && !compatible.find(t => t.id === formData.selectedTemplate)) {
      // Clear selection if current template is no longer compatible
      handleInputChange('selectedTemplate', '');
    }
  }, [formData.questionType, formData.subject]);

  // Generation error state
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Clear/Restore state
  const [clearedWorksheet, setClearedWorksheet] = useState<string | null>(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        return parsed.clearedWorksheet || null;
      }
    } catch (e) {
      console.error('Failed to restore clearedWorksheet:', e);
    }
    return null;
  });
  const [clearedParsedWorksheet, setClearedParsedWorksheet] = useState<ParsedWorksheet | null>(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        return parsed.clearedParsedWorksheet || null;
      }
    } catch (e) {
      console.error('Failed to restore clearedParsedWorksheet:', e);
    }
    return null;
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [currentWorksheetId, setCurrentWorksheetId] = useState<string | null>(null);
  const [worksheetHistories, setWorksheetHistories] = useState<WorksheetHistory[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [draftsExpanded, setDraftsExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<'student' | 'teacher'>(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (parsed.viewMode === 'teacher' || parsed.viewMode === 'student') {
          return parsed.viewMode;
        }
      }
    } catch (e) {
      console.error('Failed to restore viewMode:', e);
    }
    if (savedData && typeof savedData === 'object' && (savedData as Record<string, unknown>).viewMode === 'teacher') {
      return 'teacher';
    }
    return 'student';
  });
  const [showVersionMenu, setShowVersionMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingStructured, setIsEditingStructured] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [editBuffer, setEditBuffer] = useState('');

  // ── Class Mode State ──
  const [classMode, setClassMode] = useState(false);
  const [availableClasses, setAvailableClasses] = useState<Array<{ class_name: string; grade_level: string }>>([]);
  const [selectedClassName, setSelectedClassName] = useState('');
  const [classStudents, setClassStudents] = useState<Array<{ id: string; full_name: string; class_name?: string; grade_level?: string }>>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set());
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);
  const [randomizeOptions, setRandomizeOptions] = useState(false);
  const [accentColor, setAccentColor] = useState<string>('');
  const [worksheetPackage, setWorksheetPackage] = useState<WorksheetPackage | null>(null);
  const [selectedStudentIndex, setSelectedStudentIndex] = useState(-1); // -1 = answer key
  const [printedStudents, setPrintedStudents] = useState<Set<string>>(new Set());
  const [studentSearch, setStudentSearch] = useState('');

  const COLOR_PRESETS = ['#2563eb', '#0d9488', '#ea580c', '#7c3aed', '#0891b2', '#dc2626', '#16a34a', '#db2777', '#d97706', '#475569'];

  // Load classes when class mode is toggled
  useEffect(() => {
    if (classMode) {
      axios.get('http://localhost:8000/api/classes').then(res => {
        setAvailableClasses(res.data);
      }).catch(err => console.error('Failed to load classes:', err));
    }
  }, [classMode]);

  // Load students when a class is selected
  useEffect(() => {
    if (selectedClassName) {
      axios.get(`http://localhost:8000/api/students?class_name=${encodeURIComponent(selectedClassName)}`).then(res => {
        const students = res.data;
        setClassStudents(students);
        setSelectedStudentIds(new Set(students.map((s: any) => s.id)));
      }).catch(err => console.error('Failed to load students:', err));
    } else {
      setClassStudents([]);
      setSelectedStudentIds(new Set());
    }
  }, [selectedClassName]);

  // Generate student versions when worksheet is parsed and class mode is on
  useEffect(() => {
    if (classMode && parsedWorksheet && classStudents.length > 0 && selectedStudentIds.size > 0) {
      const selectedStudents = classStudents.filter(s => selectedStudentIds.has(s.id));
      const versions = generateStudentVersions(
        parsedWorksheet,
        selectedStudents,
        randomizeQuestions,
        randomizeOptions,
        formData.selectedTemplate
      );
      const pkg: WorksheetPackage = {
        baseWorksheet: parsedWorksheet,
        studentVersions: versions,
        randomized: randomizeQuestions || randomizeOptions,
        templateId: formData.selectedTemplate,
        formData: {
          ...formData,
          accentColor: accentColor || undefined,
          classMode,
          selectedClassName,
          randomizeQuestions,
          randomizeOptions,
        },
        createdAt: new Date().toISOString(),
      };
      setWorksheetPackage(pkg);
      setSelectedStudentIndex(-1); // Start on answer key

      // Persist package for scan-to-grade
      const packageId = `pkg_${Date.now()}`;
      axios.post('http://localhost:8000/api/worksheet-packages', {
        id: packageId,
        worksheet_title: formData.worksheetTitle || `${formData.subject} - Grade ${formData.gradeLevel} Worksheet`,
        subject: formData.subject,
        grade_level: formData.gradeLevel,
        class_name: selectedClassName,
        base_worksheet: parsedWorksheet,
        student_versions: versions,
        form_data: pkg.formData,
        randomized: pkg.randomized,
      }).catch(err => console.error('Failed to save worksheet package:', err));
    } else if (!classMode) {
      setWorksheetPackage(null);
    }
  }, [classMode, parsedWorksheet, classStudents, selectedStudentIds, randomizeQuestions, randomizeOptions]);

  // ✅ Connect WebSocket on mount
  useEffect(() => {
    getConnection(tabId || '', ENDPOINT);
  }, [tabId]);

  useEffect(() => {
    loadWorksheetHistory();
    loadDrafts();
  }, []);

  // Auto-disable images for Mathematics
  useEffect(() => {
    if (formData.subject === 'Mathematics' && formData.includeImages) {
      handleInputChange('includeImages', false);
    }
  }, [formData.subject]);

  // Load topic presets when subject/grade/strand changes
  useEffect(() => {
    const loadTopicPresets = async () => {
      if (!formData.subject || !formData.gradeLevel || !formData.strand) {
        setTopicPresets([]);
        setSelectedPreset('');
        return;
      }
      
      // Build topic ID from form data (matches backend format)
      const topicId = `${formData.subject.toLowerCase().replace(/\s+/g, '_')}.grade${formData.gradeLevel}.${formData.strand}`;
      
      setLoadingPresets(true);
      try {
        const response = await axios.get(`http://localhost:8000/api/topic-presets/${topicId}`);
        setTopicPresets(response.data.image_presets || []);
        console.log(`✅ Loaded ${response.data.image_presets?.length || 0} presets for ${topicId}`);
      } catch (error) {
        console.log(`⚠️ No presets for ${topicId}, trying without topic`);
        setTopicPresets([]);
      } finally {
        setLoadingPresets(false);
      }
    };
    
    loadTopicPresets();
  }, [formData.subject, formData.gradeLevel, formData.strand]);

  // Load style profiles once on mount
  useEffect(() => {
    const loadStyleProfiles = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/style-profiles');
        setStyleProfiles(response.data.profiles || {});
        console.log('✅ Style profiles loaded');
      } catch (error) {
        console.error('Error loading style profiles:', error);
      }
    };
    
    loadStyleProfiles();
  }, []);


  // Get available topics (keywords) based on subject, grade, and strand
  const getTopics = (subject: string, grade: string, strand: string): string[] => {
    if (!subject || !grade || !strand) return [];
    const curriculumData = curriculumIndex as CurriculumIndex;
    const pages = curriculumData.indexedPages || [];
    const topicsSet = new Set<string>();
    
    pages.forEach((page: CurriculumPage) => {
      if (
        page.subject &&
        page.grade &&
        page.strand &&
        page.subject.toLowerCase() === subject.toLowerCase() &&
        page.grade.toString() === grade.toString() &&
        page.strand.toLowerCase() === strand.toLowerCase()
      ) {
        // Add keywords as available topics
        if (page.keywords && Array.isArray(page.keywords)) {
          page.keywords.forEach((keyword: string) => {
            topicsSet.add(keyword);
          });
        }
      }
    });
    
    return Array.from(topicsSet).sort();
  };
 
  const getAvailableQuestionTypes = (): string[] => {
    if (formData.subject === 'Mathematics') {
      return ['Multiple Choice', 'Calculations'];
    }
    // Default options for other subjects (excluding Calculations if you wish)
    return questionTypeOptions.filter(t => t !== 'Calculations');
  };

  // UPDATED: Filter Templates based on Subject AND Question Type 
  const getCompatibleTemplates = (): WorksheetTemplate[] => {
    // 1. Strict filtering for Mathematics
    if (formData.subject === 'Mathematics') {
      if (formData.questionType === 'Multiple Choice') {
        return worksheetTemplates.filter(t => t.id === 'multiple-choice');
      }
      if (formData.questionType === 'Calculations') {
        return worksheetTemplates.filter(t => t.id === 'math');
      }
      // If no type selected yet, show both relevant templates
      return worksheetTemplates.filter(t => t.id === 'multiple-choice' || t.id === 'math');
    }

    // 2. Default behavior for other subjects
    if (!formData.questionType) return worksheetTemplates.filter(t => t.id !== 'math');
    
    return worksheetTemplates.filter(template =>
      template.compatibleTypes.includes(formData.questionType)
    );
  };

  const [validationErrors, setValidationErrors] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: keyof WorksheetFormData, value: WorksheetFormData[keyof WorksheetFormData]) => {
    // Reset topic when strand changes since topics are dependent on strand
    if (field === 'strand') {
      setFormData(prev => ({ ...prev, [field]: value, topic: '' }) as WorksheetFormData);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }) as WorksheetFormData);
    }
    if (validationErrors[field]) {
      setValidationErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
    }
  };

  // Handler for opening a curriculum card
  const handleOpenCurriculum = (route: string) => {
    // Process the route to remove the last segment (strand name) to match the actual page structure
    const parts = route.split('/');
    parts.pop(); // Remove the last segment
    const processedRoute = parts.join('/');
    if (onOpenCurriculumTab) {
      onOpenCurriculumTab(processedRoute);
    } else {
      window.open(processedRoute, '_blank', 'noopener,noreferrer');
    }
  };


  const validateForm = (): boolean => {
    const errors: Record<string, boolean> = {};
    if (!formData.subject) errors.subject = true;
    if (!formData.gradeLevel) errors.gradeLevel = true;
    if (!formData.strand) errors.strand = true;
    if (!formData.essentialOutcomes) errors.essentialOutcomes = true;
    if (!formData.specificOutcomes) errors.specificOutcomes = true;
    if (!formData.questionCount) errors.questionCount = true;
    if (!formData.questionType) errors.questionType = true;
    if (!formData.selectedTemplate) errors.selectedTemplate = true;
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGenerate = async () => {
    console.log('handleGenerate called');

    if (!validateForm()) {
      const firstError = document.querySelector('[data-validation-error="true"]');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // ✅ VALIDATION: Image settings required when images are included
    if (formData.includeImages) {
      if (imageSource === 'generate' && !selectedPreset) {
        setGenerationError('Please select an Image Intent before generating the worksheet.');
        return;
      }
      if (imageSource === 'upload' && !userUploadedImage) {
        setGenerationError('Please upload an image before generating the worksheet.');
        return;
      }
      if (imageSource === 'upload' && !userImageDescription.trim()) {
        setGenerationError('Please describe what is in the uploaded image so the AI can generate relevant questions.');
        return;
      }
    }

    // Variables to track scene data (either from state or newly generated)
    let currentSceneSpec = sceneSpec;
    let currentAssetId = assetId;
    let imageWasGenerated = false;
    let currentUserImageDescription: string | undefined;

    // ✅ HANDLE IMAGE BASED ON SOURCE
    if (formData.includeImages) {
      if (imageSource === 'upload' && userUploadedImage) {
        // User-uploaded image: use directly, pass description as context
        setGeneratedImages([userUploadedImage]);
        currentUserImageDescription = userImageDescription;
        imageWasGenerated = true;
        console.log('📷 Using user-uploaded image with description:', userImageDescription.slice(0, 80));
      } else if (imageSource === 'generate' && selectedPreset) {
        // Auto-generate scene image from preset
        console.log('🎨 Auto-generating image before worksheet...');
        setLocalLoadingMap(prev => ({ ...prev, [tabId || '']: true }));

        try {
          const generatedScene = await handleGenerateSceneImage();
          if (generatedScene) {
            console.log('✅ Image generated, proceeding with worksheet generation');
            currentSceneSpec = generatedScene.sceneSpec;
            currentAssetId = generatedScene.assetId;
            imageWasGenerated = true;
          }
        } catch (error) {
          console.error('Failed to auto-generate image:', error);
          setGenerationError('Failed to generate image. Please try again.');
          setLocalLoadingMap(prev => {
            const newMap = { ...prev };
            delete newMap[tabId || ''];
            return newMap;
          });
          return;
        }
      }
    }
    
    const ws = getConnection(tabId || '', ENDPOINT);
    console.log('WebSocket readyState:', ws.readyState);
    if (ws.readyState !== WebSocket.OPEN) {
      setGenerationError('Connection not established. Please wait and try again.');
      setLocalLoadingMap(prev => {
        const newMap = { ...prev };
        delete newMap[tabId || ''];
        return newMap;
      });
      return;
    }
    
    // ✅ CLEAR PREVIOUS WORKSHEET BEFORE GENERATING NEW ONE
    setGeneratedWorksheet('');
    setParsedWorksheet(null);
    // Only clear images if we're not using images AND we didn't just auto-generate them
    if (!formData.includeImages && !imageWasGenerated) {
      console.log('Clearing old images (not using images in this worksheet)');
      setGeneratedImages([]);
    } else {
      console.log('Keeping generated images - includeImages:', formData.includeImages, 'imageWasGenerated:', imageWasGenerated, 'current count:', generatedImages.length);
    }
    setGenerationError(null);
    setIsEditing(false);
    
    // Clear any previous errors and streaming content
    clearStreaming(tabId || '', ENDPOINT);
    console.log('Setting loading state');
    setLocalLoadingMap(prev => ({ ...prev, [tabId || '']: true }));

    // Build prompt for worksheet generation (will include sceneSpec if available)
    const prompt = buildWorksheetPrompt(formData, currentSceneSpec, currentUserImageDescription);

    const jobId = `worksheet-${Date.now()}`;
    console.log('Built prompt, jobId:', jobId);
    console.log('Using sceneSpec:', currentSceneSpec ? currentSceneSpec.scene_id : 'none');

    if (queueEnabled) {
      enqueue({
        label: `Worksheet - ${formData.topic || formData.subject || 'Untitled'}`,
        toolType: 'Worksheet',
        tabId: tabId || '',
        endpoint: ENDPOINT,
        prompt,
        generationMode: 'queued',
        extraMessageData: {
          formData: {
            ...formData,
            sceneSpec: currentSceneSpec,
            assetId: currentAssetId,
          },
          jobId,
        },
      });
      setLocalLoadingMap(prev => ({ ...prev, [tabId || '']: true }));
      return;
    }

    const message = {
      prompt,
      formData: {
        ...formData,
        sceneSpec: currentSceneSpec,
        assetId: currentAssetId,
      },
      jobId,
      generationMode: "queued",
    };
    console.log('Sending message:', message);

    try {
      ws.send(JSON.stringify(message));
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Failed to send worksheet request:', error);
      setGenerationError('Failed to send worksheet request. Please try again.');
      setLocalLoadingMap(prev => {
        const newMap = { ...prev };
        delete newMap[tabId || ''];
        return newMap;
      });
    }
  };

  const handleRetry = () => {
    setGenerationError(null);
    handleGenerate();
  };

  const handleClearWorksheet = () => {
    // Only clear if there's actually content to clear
    if (!generatedWorksheet && !parsedWorksheet) {
      return;
    }
    
    setClearedWorksheet(generatedWorksheet);
    setClearedParsedWorksheet(parsedWorksheet);
    setGeneratedWorksheet('');
    setParsedWorksheet(null);
    setGenerationError(null);
    setIsEditing(false);
  };

  const handleRestoreWorksheet = () => {
    if (clearedWorksheet) {
      setGeneratedWorksheet(clearedWorksheet);
      setParsedWorksheet(clearedParsedWorksheet);
      setClearedWorksheet(null);
      setClearedParsedWorksheet(null);
    }
  };

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ formData, generatedWorksheet, parsedWorksheet, clearedWorksheet, clearedParsedWorksheet, viewMode }));
  }, [formData, generatedWorksheet, parsedWorksheet, clearedWorksheet, clearedParsedWorksheet, viewMode]);

  // Notify parent
  useEffect(() => {
    onDataChange?.({ formData, generatedWorksheet, parsedWorksheet, clearedWorksheet, clearedParsedWorksheet, viewMode });
  }, [formData, generatedWorksheet, parsedWorksheet, clearedWorksheet, clearedParsedWorksheet, viewMode]);

  // Auto-select template when only one is compatible
  useEffect(() => {
    const compatibleTemplates = getCompatibleTemplates();
    if (compatibleTemplates.length === 1 && !formData.selectedTemplate) {
      handleInputChange('selectedTemplate', compatibleTemplates[0].id);
    }
  }, [formData.questionType, formData.subject]);

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
        const curriculumData = curriculumIndex as CurriculumIndex;
        const pages = curriculumData.indexedPages || [];
        const matches = pages.filter((page: CurriculumPage) => {
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

  const compatibleTemplates = getCompatibleTemplates();
  const selectedTemplate = worksheetTemplates.find(t => t.id === formData.selectedTemplate);

  const generatedImage = generatedImages.length > 0 ? generatedImages[0] : null;

  const renderTemplatePreview = () => {
    if (!selectedTemplate) return null;

    // ✅ ROBUST PARSING with validation
    const getValidQuestionCount = (value: string): number => {
      const trimmed = value.trim();
      if (!trimmed) return 10; // Default if empty
      
      const parsed = parseInt(trimmed, 10);
      
      // Validate range
      if (isNaN(parsed)) return 10;
      if (parsed < 1) return 1;
      if (parsed > 50) return 50;
      
      return parsed;
    };

    const questionCount = getValidQuestionCount(formData.questionCount);
    
    // 🔍 Optional: Remove this console.log after debugging
    console.log('Preview questionCount:', questionCount, 'from input:', formData.questionCount);

    const commonProps = {
      subject: formData.subject,
      gradeLevel: formData.gradeLevel,
      topic: formData.topic,
      strand: formData.strand,
      questionCount: questionCount,  // ✅ Use validated count
      questionType: formData.questionType,
      worksheetTitle: formData.worksheetTitle || selectedTemplate.name,
      includeImages: formData.includeImages,
      imagePlacement: formData.imagePlacement,
      generatedImage: generatedImages.length > 0 ? generatedImages[0] : null,
      showAnswers: viewMode === 'teacher',
      accentColor: accentColor || undefined,
    };

    switch (selectedTemplate.id) {
      case 'multiple-choice':
        return <MultipleChoiceTemplate {...commonProps} />;
      case 'comprehension':
        return <ComprehensionTemplate {...commonProps} />;
      case 'matching':
        return <MatchingTemplate {...commonProps} />;
      case 'list-based':
        return <ListBasedTemplate {...commonProps} />;
      case 'math':
        return <MathTemplate {...commonProps} showAnswers={viewMode === 'teacher'} />;
      default:
        return null;
    }
  };

  // Render a specific student version or answer key using the template
  const renderStudentVersion = (version: StudentWorksheetVersion | null, isAnswer: boolean) => {
    if (!parsedWorksheet) return null;
    const baseProps = {
      subject: formData.subject,
      gradeLevel: formData.gradeLevel,
      topic: formData.topic,
      strand: formData.strand,
      questionType: formData.questionType,
      worksheetTitle: formData.worksheetTitle || parsedWorksheet.metadata.title,
      includeImages: formData.includeImages,
      imagePlacement: formData.imagePlacement,
      generatedImage: generatedImages.length > 0 ? generatedImages[0] : null,
      accentColor: accentColor || undefined,
      showAnswers: isAnswer,
      isAnswerKey: isAnswer,
      studentName: version?.student.full_name,
      studentId: version?.student.id,
      className: version?.student.class_name,
    };

    const questions = version ? version.questions : parsedWorksheet.questions;

    switch (formData.selectedTemplate) {
      case 'multiple-choice':
        return <MultipleChoiceTemplate {...baseProps} questionCount={questions.length} questions={questions.map(q => ({ id: q.id, question: q.question, options: q.options, correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : undefined }))} />;
      case 'comprehension':
        return <ComprehensionTemplate {...baseProps} questionCount={questions.length} passage={parsedWorksheet.passage} questions={questions} />;
      case 'matching':
        return <MatchingTemplate {...baseProps} questionCount={questions.length} columnA={parsedWorksheet.matchingItems?.columnA} columnB={parsedWorksheet.matchingItems?.columnB} shuffledColumnB={version?.shuffledColumnB} matchingAnswerMap={version?.matchingAnswerMap} />;
      case 'list-based':
        return <ListBasedTemplate {...baseProps} questionCount={questions.length} questions={questions} wordBank={version?.shuffledWordBank || parsedWorksheet.wordBank} />;
      case 'math':
        return <MathTemplate {...baseProps} questionCount={questions.length} questions={questions} />;
      default:
        return null;
    }
  };

  const handlePrintAll = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !worksheetPackage) return;
    const palette = deriveWorksheetPalette(accentColor || '#2563eb');
    printWindow.document.write('<html><head><title>Print All Worksheets</title><style>@media print { .page-break { page-break-after: always; } } body { margin: 0; }</style></head><body>');
    printWindow.document.write('<div id="print-root"></div></body></html>');
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  const renderTemplateWithLoading = () => {
    const template = selectedTemplate?.id || formData.selectedTemplate;
    if (!template) return <GeneratorSkeleton accentColor="#3b82f6" type="worksheet" />;

    const getValidQuestionCount = (value: string): number => {
      const trimmed = value.trim();
      if (!trimmed) return 10;
      const parsed = parseInt(trimmed, 10);
      if (isNaN(parsed)) return 10;
      if (parsed < 1) return 1;
      if (parsed > 50) return 50;
      return parsed;
    };

    const qCount = getValidQuestionCount(formData.questionCount);

    const commonProps = {
      subject: formData.subject,
      gradeLevel: formData.gradeLevel,
      topic: formData.topic,
      strand: formData.strand,
      questionCount: qCount,
      questionType: formData.questionType,
      worksheetTitle: formData.worksheetTitle || 'Worksheet',
      includeImages: formData.includeImages,
      imagePlacement: formData.imagePlacement,
      generatedImage: generatedImages.length > 0 ? generatedImages[0] : null,
      showAnswers: viewMode === 'teacher',
      loading: true,
      accentColor: accentColor || undefined,
    };

    switch (template) {
      case 'multiple-choice':
        return <MultipleChoiceTemplate {...commonProps} />;
      case 'comprehension':
        return <ComprehensionTemplate {...commonProps} />;
      case 'matching':
        return <MatchingTemplate {...commonProps} />;
      case 'list-based':
        return <ListBasedTemplate {...commonProps} />;
      case 'math':
        return <MathTemplate {...commonProps} />;
      default:
        return <GeneratorSkeleton accentColor="#3b82f6" type="worksheet" />;
    }
  };

  const saveWorksheet = async () => {
    if (!generatedWorksheet) return;
    
    setSaveStatus('saving');
    try {
      const worksheetData = {
        id: currentWorksheetId || `worksheet_${Date.now()}`,
        title: formData.worksheetTitle || `${formData.subject} - Grade ${formData.gradeLevel} Worksheet`,
        timestamp: new Date().toISOString(),
        formData,
        generatedWorksheet,
        parsedWorksheet,
        generatedImages
      };
      
      await axios.post('http://localhost:8000/api/worksheet-history', worksheetData);
      setCurrentWorksheetId(worksheetData.id);
      setSaveStatus('saved');
      triggerCheck();
      setShowScheduleModal(true);
      loadWorksheetHistory();
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to save worksheet:', error);
      setSaveStatus('idle');
    }
  };

  const loadWorksheetHistory = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/worksheet-history');
      setWorksheetHistories(response.data as WorksheetHistory[]);
    } catch (error) {
      console.error('Failed to load worksheet history:', error);
    }
  };

  const loadWorksheetFromHistory = (history: WorksheetHistory) => {
    setFormData(history.formData as WorksheetFormData);
    setGeneratedWorksheet(history.generatedWorksheet);
    setParsedWorksheet(history.parsedWorksheet);
    setGeneratedImages(history.generatedImages || []);
    setCurrentWorksheetId(history.id);
    setHistoryOpen(false);
  };

  const deleteWorksheetHistory = async (worksheetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this worksheet from history?')) return;
    
    try {
      await axios.delete(`http://localhost:8000/api/worksheet-history/${worksheetId}`);
      loadWorksheetHistory();
      if (currentWorksheetId === worksheetId) {
        setCurrentWorksheetId(null);
      }
    } catch (error) {
      console.error('Failed to delete worksheet:', error);
    }
  };

  const loadDrafts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/lesson-drafts?plannerType=worksheet');
      setDrafts(response.data as Draft[]);
    } catch (error) {
      console.error('Failed to load drafts:', error);
    }
  };

  const loadDraft = (draft: Draft) => {
    setFormData(draft.formData as WorksheetFormData);
    setGeneratedWorksheet('');
    setParsedWorksheet(null);
    setCurrentWorksheetId(null);
    setHistoryOpen(false);
    deleteDraft(draft.id);
  };

  const deleteDraft = async (draftId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await axios.delete(`http://localhost:8000/api/lesson-drafts/${draftId}`);
      loadDrafts();
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  // Image generation handlers
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      setImageError('Please enter a prompt');
      return;
    }

    setGeneratingImages(true);
    setImageError(null);

    try {
      const response = await imageApi.generateImageBase64({
        prompt: imagePrompt,
        negativePrompt: 'multiple people, group, crowd, deformed, distorted, blurry',
        width: 512,
        height: 512,
      });

      if (response.success && response.imageData) {
        setGeneratedImages([response.imageData]);
      } else {
        throw new Error('Image generation failed');
      }
    } catch (err: unknown) {
      console.error('Generation error:', err);
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      setImageError(error.response?.data?.error || error.message || 'Failed to generate image');
    } finally {
      setGeneratingImages(false);
    }
  };

  const handleDownloadImage = (imageData: string) => {
    const slug = imagePrompt
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 6)
      .join('-');
    const ts = new Date().toISOString().slice(0, 10);
    const filename = slug ? `image-${slug}-${ts}.png` : `image-${ts}-${Date.now()}.png`;
    const link = document.createElement('a');
    link.href = imageData;
    link.download = filename;
    link.click();
  };

  const handleSaveImageToResources = async (imageData: string) => {
    try {
      const response = await axios.post('http://localhost:8000/api/images-history', {
        title: `${formData.topic || 'Scene'} - ${formData.subject} Grade ${formData.gradeLevel}`,
        timestamp: new Date().toISOString(),
        type: 'images',
        imageUrl: imageData,
        formData: {
          subject: formData.subject,
          gradeLevel: formData.gradeLevel,
          strand: formData.strand,
          topic: formData.topic,
          sceneSpec: sceneSpec,
          assetId: assetId
        }
      });
      
      if (response.status === 200) {
        console.log('✅ Image saved to resources successfully');
        // Could add a toast notification here
      }
    } catch (error) {
      console.error('Failed to save image to resources:', error);
      setImageError('Failed to save image to resources');
    }
  };

  // Scene-based image generation handler
  const handleGenerateSceneImage = async () => {
    if (!selectedPreset) {
      setImageError("Please select an image preset");
      return null;
    }

    setGeneratingImages(true);
    setImageError(null);

    try {
      // Build topic ID from STRAND, not topic field
      const topicId = `${formData.subject.toLowerCase().replace(/\s+/g, '_')}.grade${formData.gradeLevel}.${formData.strand}`;

      console.log("🎨 Generating scene image:", {
        topicId,
        selectedPreset,
        style: formData.imageStyle,
      });

      const response = await axios.post(
        "http://localhost:8000/api/generate-scene-image",
        {
          topic_id: topicId,
          preset_id: selectedPreset,
          style_profile_id: formData.imageStyle || "cartoon_3d",
        },
      );

      if (response.data.success) {
        setGeneratedImages([response.data.imageData]);
        setSceneSpec(response.data.sceneSpec);
        setAssetId(response.data.assetId);
        console.log(
          "✅ Scene image generated:",
          response.data.sceneSpec.scene_id,
        );
        console.log(
          "   Objects:",
          response.data.sceneSpec.objects.map((o: { name: string }) => o.name).join(", "),
        );
        console.log("   Asset ID:", response.data.assetId);
        
        // Return the scene data for immediate use
        return {
          sceneSpec: response.data.sceneSpec,
          assetId: response.data.assetId,
          imageData: response.data.imageData
        };
      } else {
        throw new Error("Image generation failed");
      }
    } catch (error: unknown) {
      console.error("Scene image generation error:", error);
      const errorMessage = error instanceof Error && 'response' in error
        ? (error as { response?: { data?: { detail?: string } } }).response?.data?.detail
        : "Failed to generate image from scene";
      setImageError(errorMessage || "Failed to generate image from scene");
      throw error;
    } finally {
      setGeneratingImages(false);
    }
  };

  return (
    <div className="h-full tab-content-bg grid grid-cols-2" data-tutorial="worksheet-generator-welcome">
      {/* Left Panel - Configuration (50%) */}
      <div className="flex flex-col border-r border-theme overflow-y-auto">
        <div className="border-b border-theme p-4 flex items-center justify-between" data-tutorial="worksheet-generator-header">
          <div>
            <h2 className="text-xl font-semibold text-theme-heading">Worksheet Generator</h2>
            <p className="text-sm text-theme-hint">Create customized worksheets with curriculum alignment</p>
          </div>
          <button
            onClick={() => setIsGrading(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition text-sm font-medium text-emerald-600 border border-emerald-200 shrink-0"
            title="Grade scanned worksheets"
          >
            <Check className="w-4 h-4" />
            Grade Worksheets
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Curriculum Section */}
            <div className="space-y-4" data-tutorial="worksheet-generator-curriculum">
              <h3 className="text-lg font-semibold text-theme-heading">Curriculum Alignment</h3>

              {/* Two-column layout for dropdowns and curriculum box */}
              <div className="grid grid-cols-2 gap-6">
                {/* Left column - Form fields */}
                <div className="space-y-4">
                  <div data-tutorial="worksheet-generator-subject">
                    <label className="block text-sm font-medium text-theme-label mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => {
                        handleInputChange('subject', e.target.value);
                        handleInputChange('strand', '');
                      }}
                      data-validation-error={validationErrors.subject ? 'true' : undefined}
                      className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.subject ? 'validation-error' : ''}`}
                    >
                      <option value="">Select a subject</option>
                      {subjects.map(subject => (
                        <option key={subject} value={subject}>{subject}</option>
                      ))}
                    </select>
                  </div>

                  <div data-tutorial="worksheet-generator-grade">
                    <label className="block text-sm font-medium text-theme-label mb-2">
                      Grade Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.gradeLevel}
                      onChange={(e) => {
                        handleInputChange('gradeLevel', e.target.value);
                        handleInputChange('strand', '');
                      }}
                      data-validation-error={validationErrors.gradeLevel ? 'true' : undefined}
                      className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.gradeLevel ? 'validation-error' : ''}`}
                    >
                      <option value="">Select a grade</option>
                      {grades.map(grade => (
                        <option key={grade} value={grade}>Grade {grade}</option>
                      ))}
                    </select>
                  </div>

                  <div data-tutorial="worksheet-generator-strand">
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
                      accentColor="#3b82f6"
                      validationErrors={validationErrors}
                    />
                  </div>

                  <div data-tutorial="worksheet-generator-topic">
                    <label className="block text-sm font-medium text-theme-label mb-2">
                      Topic
                    </label>
                    {formData.subject && formData.gradeLevel && formData.strand ? (
                      <select
                        value={formData.topic}
                        onChange={(e) => handleInputChange('topic', e.target.value)}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">-- Select a Topic --</option>
                        {getTopics(formData.subject, formData.gradeLevel, formData.strand).map(topic => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </select>
                    ) : (
                      <p className="text-sm text-theme-hint italic">Select subject, grade level, and strand to choose a topic.</p>
                    )}
                  </div>

                  <div data-tutorial="worksheet-generator-title">
                    <label className="block text-sm font-medium text-theme-label mb-2">
                      Worksheet Title <span className="text-theme-hint">(optional)</span>
                    </label>
                    <SmartInput
                      value={formData.worksheetTitle}
                      onChange={(val) => handleInputChange('worksheetTitle', val)}
                      className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Leave blank to use template name"
                    />
                  </div>
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
            </div>

            {/* Worksheet Scope */}
            <div className="space-y-4" data-tutorial="worksheet-generator-scope">
              <h3 className="text-lg font-semibold text-theme-heading">Worksheet Scope</h3>

              <div className="grid grid-cols-2 gap-4">
                 <div data-tutorial="worksheet-generator-student-count">
                   <label className="block text-sm font-medium text-theme-label mb-2">
                     Number of Students
                   </label>
                  <input
                    type="number"
                    value={formData.studentCount}
                    onChange={(e) => handleInputChange('studentCount', e.target.value)}
                    className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 25"
                  />
                </div>

                 <div data-tutorial="worksheet-generator-question-count">
                   <label className="block text-sm font-medium text-theme-label mb-2">
                     Number of Questions <span className="text-red-500">*</span>
                   </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.questionCount}
                    onChange={(e) => handleInputChange('questionCount', e.target.value)}
                    data-validation-error={validationErrors.questionCount ? 'true' : undefined}
                    className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.questionCount ? 'validation-error' : ''}`}
                    placeholder="e.g., 10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Question Type */}
            <div className="space-y-4" data-tutorial="worksheet-generator-question-type">
              <h3 className="text-lg font-semibold text-theme-heading">Question Type</h3>
              <p className="text-sm text-theme-hint">Select the type of questions to include in your worksheet</p>

              <div>
                <select
                  value={formData.questionType}
                  onChange={(e) => {
                    handleInputChange('questionType', e.target.value);
                    handleInputChange('selectedTemplate', getCompatibleTemplates().find(t => t.id === formData.selectedTemplate) ? formData.selectedTemplate : '');
                  }}
                  data-validation-error={validationErrors.questionType ? 'true' : undefined}
                  className={`w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${validationErrors.questionType ? 'validation-error' : ''}`}
                >
                  <option value="">Select a question type</option>
                  {getAvailableQuestionTypes().map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                </select>
              </div>
            </div>

            {/* Include Images */}
            <div className="space-y-4" data-tutorial="worksheet-generator-include-images">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.includeImages}
                    onChange={(e) => handleInputChange('includeImages', e.target.checked)}
                    disabled={formData.subject === 'Mathematics'}  // ✅ ADD THIS
                    className="rounded border-theme-strong text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <span className={`text-sm font-medium ${formData.subject === 'Mathematics' ? 'text-theme-hint' : 'text-theme-label'}`}>
                    Include Images
                  </span>
                </label>
                <p className="text-xs text-theme-hint mt-1">
                  {formData.subject === 'Mathematics' 
                    ? 'Images are not available for Mathematics worksheets'
                    : 'Add relevant images to enhance the worksheet'}
                </p>
              </div>
            </div>

            {/* Image Source Selection */}
            {formData.includeImages && formData.subject !== 'Mathematics' && (
              <div className="space-y-4" data-tutorial="worksheet-generator-image-prompt">
                {/* Image Source Toggle */}
                <div>
                  <label className="block text-sm font-medium text-theme-label mb-2">Image Source</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setImageSource('generate')}
                      className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2
                        ${imageSource === 'generate'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-600'
                          : 'border-theme hover:border-blue-300 text-theme-label'
                        }`}
                    >
                      <Wand2 className="w-4 h-4" />
                      Generate from Preset
                    </button>
                    <button
                      onClick={() => setImageSource('upload')}
                      className={`py-2.5 px-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-center gap-2
                        ${imageSource === 'upload'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-600'
                          : 'border-theme hover:border-blue-300 text-theme-label'
                        }`}
                    >
                      <Upload className="w-4 h-4" />
                      Upload My Own
                    </button>
                  </div>
                </div>

                {/* Generate from Preset */}
                {imageSource === 'generate' && (
                <>
                <h3 className="text-lg font-semibold text-theme-heading">Scene-Based Image Generation</h3>

                {loadingPresets ? (
                  <div className="p-4 text-center">
                    <HeartbeatLoader className="w-8 h-8 mx-auto" />
                    <p className="text-sm text-theme-hint mt-2">Loading presets...</p>
                  </div>
                ) : topicPresets.length > 0 ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        Image Intent <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedPreset}
                        onChange={(e) => setSelectedPreset(e.target.value)}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select what you want to show...</option>
                        {topicPresets.map(preset => (
                          <option key={preset.id} value={preset.id}>
                            {preset.name} - {preset.description}
                          </option>
                        ))}
                      </select>
                      {selectedPreset && topicPresets.find(p => p.id === selectedPreset) && (
                        <p className="text-xs text-theme-hint mt-1">
                          Objects: {topicPresets.find(p => p.id === selectedPreset)?.objects.join(', ')}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        Visual Style <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.imageStyle}
                        onChange={(e) => handleInputChange('imageStyle', e.target.value)}
                        className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="cartoon_3d">3D Cartoon (Colorful, Pixar-like)</option>
                        <option value="line_art_bw">Black & White Line Art (Coloring)</option>
                        <option value="illustrated_painting">Illustrated Painting</option>
                        <option value="realistic">Photorealistic</option>
                      </select>
                      {styleProfiles[formData.imageStyle || 'cartoon_3d'] && (
                        <p className="text-xs text-theme-hint mt-1">
                          {styleProfiles[formData.imageStyle || 'cartoon_3d'].description}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={handleGenerateSceneImage}
                      disabled={!selectedPreset || generatingImages}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {generatingImages ? (
                        <>
                          <HeartbeatLoader className="w-5 h-5 mr-2" />
                          Generating Scene Image...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5 mr-2" />
                          Generate Image from Preset
                        </>
                      )}
                    </button>

                    {imageError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        ❌ {imageError}
                      </div>
                    )}

                    {generatedImages.length > 0 && sceneSpec && (
                      <div className="space-y-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="text-sm font-semibold text-green-800 flex items-center">
                          <Check className="w-4 h-4 mr-1" />
                          Scene Image Generated
                        </h4>
                        <img loading="lazy"
                          src={generatedImages[0]}
                          alt="Generated scene"
                          className="w-full max-h-64 object-contain rounded-lg mt-2 border border-green-300"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDownloadImage(generatedImages[0])}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center text-sm"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Image
                          </button>
                          <button
                            onClick={() => handleSaveImageToResources(generatedImages[0])}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center text-sm"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save to Resources
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : formData.strand ? (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>⚠️ No presets loaded for this strand</strong><br/>
                      Selected: {formData.subject} &gt; Grade {formData.gradeLevel} &gt; {formData.strand}<br/>
                      <span className="text-xs">This may indicate a backend connection issue or the strand isn't in the preset database yet.</span>
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-theme-secondary border border-theme rounded-lg">
                    <p className="text-sm text-theme-muted">
                      Select subject, grade, and strand above to see available image presets
                    </p>
                  </div>
                )}
                </>
                )}

                {/* Upload My Own Image */}
                {imageSource === 'upload' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-theme-heading">Upload Your Own Image</h3>
                    <p className="text-sm text-theme-hint">
                      Upload an image and describe it so the AI can generate questions based on its content.
                    </p>

                    {/* File Upload */}
                    {userUploadedImage ? (
                      <div className="relative">
                        <img
                          loading="lazy"
                          src={userUploadedImage}
                          alt="Uploaded"
                          className="w-full max-h-64 object-contain rounded-lg border border-theme"
                        />
                        <button
                          onClick={() => {
                            setUserUploadedImage(null);
                            setGeneratedImages([]);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-theme rounded-lg cursor-pointer hover:bg-theme-subtle transition">
                        <Upload className="w-8 h-8 text-theme-hint mb-2" />
                        <span className="text-sm text-theme-hint">Click to upload an image</span>
                        <span className="text-xs text-theme-hint mt-1">PNG, JPG, or GIF</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              const result = ev.target?.result as string;
                              setUserUploadedImage(result);
                              setGeneratedImages([result]);
                            };
                            reader.readAsDataURL(file);
                            e.target.value = '';
                          }}
                        />
                      </label>
                    )}

                    {/* Image Description */}
                    <div>
                      <label className="block text-sm font-medium text-theme-label mb-2">
                        Describe what is in this image <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={userImageDescription}
                        onChange={(e) => setUserImageDescription(e.target.value)}
                        className="w-full p-3 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="E.g., A diagram of the water cycle showing evaporation from the ocean, condensation forming clouds, and precipitation as rain falling on mountains"
                      />
                      <p className="text-xs text-theme-hint mt-1">
                        Be specific about objects, labels, and relationships visible in the image. The AI uses this description to create relevant questions.
                      </p>
                    </div>

                    {imageError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        {imageError}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Templates */}
            <div className="space-y-4" data-tutorial="worksheet-generator-templates">
              <h3 className="text-lg font-semibold text-theme-heading">Worksheet Template</h3>
              <p className="text-sm text-theme-hint">Choose a layout that works with your selected question types</p>

              <div data-validation-error={validationErrors.selectedTemplate ? 'true' : undefined} className={`grid grid-cols-1 gap-3 p-2 rounded-lg ${validationErrors.selectedTemplate ? 'validation-error' : ''}`}>
                {compatibleTemplates.map(template => (
                  <label key={template.id} className="flex items-center space-x-3 p-3 border border-theme rounded-lg hover:bg-theme-subtle cursor-pointer">
                    <input
                      type="radio"
                      name="template"
                      value={template.id}
                      checked={formData.selectedTemplate === template.id}
                      onChange={(e) => handleInputChange('selectedTemplate', e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-theme-title">{template.name}</div>
                      <div className="text-sm text-theme-hint">{template.description}</div>
                    </div>
                  </label>
                ))}
              </div>

              {formData.questionType && compatibleTemplates.length === 0 && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  No templates are compatible with your selected question types. Please adjust your selection.
                </div>
              )}
            </div>

            {/* Template Options */}
            {formData.selectedTemplate === 'comprehension' && formData.includeImages && (
              <div className="space-y-4" data-tutorial="worksheet-generator-template-options">
                <h3 className="text-lg font-semibold text-theme-heading">Template-Specific Options</h3>
                <div>
                  <label className="block text-sm font-medium text-theme-label mb-2">
                    Image Placement
                  </label>
                  <select
                    value={formData.imagePlacement}
                    onChange={(e) => handleInputChange('imagePlacement', e.target.value)}
                    className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="large-centered">Large centered image above or within the passage</option>
                    <option value="small-corner">Small image in a corner with text wrapping around it</option>
                  </select>
                </div>
              </div>
            )}

            {/* ── Worksheet Color ── */}
            {formData.selectedTemplate && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-theme-heading flex items-center">
                  <PaintBrush className="w-5 h-5 mr-2" />
                  Worksheet Color
                </h3>
                <p className="text-sm text-theme-hint">Choose an accent color for the worksheet</p>
                <div className="flex flex-wrap gap-2 items-center">
                  {COLOR_PRESETS.map(color => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(accentColor === color ? '' : color)}
                      className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        background: color,
                        borderColor: accentColor === color ? '#0f172a' : 'transparent',
                        transform: accentColor === color ? 'scale(1.15)' : undefined,
                        boxShadow: accentColor === color ? '0 0 0 2px white, 0 0 0 4px ' + color : undefined,
                      }}
                      title={color}
                    />
                  ))}
                  <div className="flex items-center gap-2 ml-2">
                    <input
                      type="color"
                      value={accentColor || '#2563eb'}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer border border-theme-strong"
                      title="Custom color"
                    />
                    {accentColor && (
                      <button
                        onClick={() => setAccentColor('')}
                        className="text-xs text-theme-hint hover:text-theme-label transition"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ── Generate for Class ── */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-theme-heading flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Generate for Class
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={classMode}
                    onChange={(e) => {
                      setClassMode(e.target.checked);
                      if (!e.target.checked) {
                        setWorksheetPackage(null);
                        setSelectedClassName('');
                      }
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                </label>
              </div>
              <p className="text-sm text-theme-hint">Generate personalized copies with student names and IDs</p>

              {classMode && (
                <div className="space-y-4 p-4 bg-theme-secondary border border-theme rounded-lg">
                  {/* Class Selection */}
                  <div>
                    <label className="block text-sm font-medium text-theme-label mb-2">Select Class</label>
                    <select
                      value={selectedClassName}
                      onChange={(e) => setSelectedClassName(e.target.value)}
                      className="w-full px-4 py-2 border border-theme-strong rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Choose a class...</option>
                      {availableClasses.map(c => (
                        <option key={c.class_name} value={c.class_name}>
                          {c.grade_level && `Grade ${c.grade_level} - `}{c.class_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Student List */}
                  {classStudents.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-theme-label">
                          Students ({selectedStudentIds.size} of {classStudents.length} selected)
                        </label>
                        <button
                          onClick={() => {
                            if (selectedStudentIds.size === classStudents.length) {
                              setSelectedStudentIds(new Set());
                            } else {
                              setSelectedStudentIds(new Set(classStudents.map(s => s.id)));
                            }
                          }}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {selectedStudentIds.size === classStudents.length ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>
                      <div className="max-h-40 overflow-y-auto border border-theme rounded-lg divide-y divide-theme">
                        {classStudents.map(student => (
                          <label key={student.id} className="flex items-center gap-3 px-3 py-2 hover:bg-theme-subtle cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedStudentIds.has(student.id)}
                              onChange={(e) => {
                                const next = new Set(selectedStudentIds);
                                if (e.target.checked) next.add(student.id);
                                else next.delete(student.id);
                                setSelectedStudentIds(next);
                              }}
                              className="rounded border-theme-strong text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-theme-heading flex-1">{student.full_name}</span>
                            <span className="text-xs text-theme-hint font-mono">{student.id}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Randomize Options */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={randomizeQuestions}
                        onChange={(e) => setRandomizeQuestions(e.target.checked)}
                        className="rounded border-theme-strong text-blue-600 focus:ring-blue-500"
                      />
                      <Shuffle className="w-4 h-4 text-theme-muted" />
                      <span className="text-sm text-theme-label">Randomize question order per student</span>
                    </label>
                    {randomizeQuestions && (
                      <label className="flex items-center gap-2 cursor-pointer ml-6">
                        <input
                          type="checkbox"
                          checked={randomizeOptions}
                          onChange={(e) => setRandomizeOptions(e.target.checked)}
                          className="rounded border-theme-strong text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-theme-label">Also randomize answer options (MC/Matching)</span>
                      </label>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="border-t border-theme p-4 bg-theme-secondary" data-tutorial="worksheet-generator-generate">
          <div className="max-w-4xl mx-auto">
            {generationError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
                <span>{generationError}</span>
                <button
                  onClick={handleRetry}
                  className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                >
                  Retry
                </button>
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <HeartbeatLoader className="w-5 h-5 mr-2" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 mr-2" />
                    {classMode && selectedStudentIds.size > 0
                      ? `Generate for ${selectedStudentIds.size} Students`
                      : 'Generate Worksheet'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Preview (50%) with flip animation */}
      <div className="bg-theme-secondary border-l border-theme flex flex-col overflow-hidden relative" style={{ perspective: '2000px' }} data-tutorial="worksheet-generator-preview">
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
          {/* FRONT FACE — Worksheet Preview */}
          <div
            className="flex-1 flex flex-col bg-theme-secondary overflow-y-auto"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              position: isGrading ? 'absolute' : 'relative',
              inset: 0,
              minHeight: 0,
              pointerEvents: isGrading ? 'none' : 'auto',
            }}
          >
        <div className="p-4 border-b border-theme">
          <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-theme-heading flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Preview
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistoryOpen(!historyOpen)}
              className="p-2 rounded-lg hover:bg-theme-hover transition"
              title="Worksheet History"
              data-tutorial="worksheet-generator-history-toggle"
            >
              <History className="w-5 h-5 text-theme-muted" />
            </button>
            {(generatedWorksheet || parsedWorksheet) && (
              <>
                <button
                  onClick={() => {
                    if (parsedWorksheet) {
                      setIsEditingStructured(true);
                    } else {
                      setEditBuffer(generatedWorksheet);
                      setIsEditing(true);
                    }
                  }}
                  className="flex items-center px-3.5 py-1.5 text-[13.5px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  title="Edit generated worksheet"
                  disabled={!generatedWorksheet && !parsedWorksheet}
                  data-tutorial="worksheet-generator-edit"
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                  Edit {parsedWorksheet ? '' : '(Text Mode)'}
                </button>

                <button
                  onClick={saveWorksheet}
                  disabled={saveStatus === 'saving'}
                  className="flex items-center px-3.5 py-1.5 text-[13.5px] bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  data-tutorial="worksheet-generator-save"
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
                      Save
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsGrading(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-[13.5px] rounded-lg hover:bg-emerald-50 transition font-medium text-emerald-600 border border-emerald-200"
                  title="Grade scanned worksheets"
                >
                  <Check className="w-3.5 h-3.5" />
                  Grade
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowVersionMenu(!showVersionMenu)}
                    className="flex items-center px-3.5 py-1.5 text-[13.5px] bg-theme-tertiary text-theme-label rounded-lg hover:bg-theme-hover transition border border-theme-strong"
                    data-tutorial="worksheet-generator-view-toggle"
                  >
                    <FileText className="w-3.5 h-3.5 mr-1.5" />
                    {viewMode === 'teacher' ? 'Teacher Version' : 'Student Version'}
                    <ChevronDown className="w-3.5 h-3.5 ml-1.5" />
                  </button>

                  {showVersionMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowVersionMenu(false)}
                      />

                      <div className="absolute left-0 mt-2 w-56 rounded-lg z-20 overflow-hidden widget-glass">
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setViewMode('student');
                              setShowVersionMenu(false);
                            }}
                            className={`w-full text-left px-4 py-2 hover:bg-theme-subtle flex items-center justify-between transition ${
                              viewMode === 'student' ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-3 text-blue-600" />
                              <div>
                                <div className="text-sm font-medium text-theme-title">Student Version</div>
                                <div className="text-xs text-theme-hint">Hide answers</div>
                              </div>
                            </div>
                            {viewMode === 'student' && (
                              <Check className="w-4 h-4 text-blue-600" />
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setViewMode('teacher');
                              setShowVersionMenu(false);
                            }}
                            className={`w-full text-left px-4 py-2 hover:bg-theme-subtle flex items-center justify-between transition ${
                              viewMode === 'teacher' ? 'bg-blue-50' : ''
                            }`}
                          >
                            <div className="flex items-center">
                              <GraduationCap className="w-4 h-4 mr-3 text-green-600" />
                              <div>
                                <div className="text-sm font-medium text-theme-title">Teacher Version</div>
                                <div className="text-xs text-theme-hint">Show answers</div>
                              </div>
                            </div>
                            {viewMode === 'teacher' && (
                              <Check className="w-4 h-4 text-green-600" />
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <ExportButton
                  dataType="worksheet"
                  data={{
                    content: generatedWorksheet,
                    parsedWorksheet: parsedWorksheet,
                    formData: {
                      ...formData,
                      viewMode
                    },
                    accentColor: '#3b82f6',
                    generatedImages: generatedImages,
                    worksheetId: viewMode === 'teacher' ? (currentWorksheetId || `worksheet_${Date.now()}`) : undefined
                  }}
                  filename={`worksheet-${formData.subject.toLowerCase()}-grade${formData.gradeLevel}`}
                  className="!px-3.5 !py-1.5 !text-[13.5px]"
                  data-tutorial="worksheet-generator-export"
                />

                <button
                  onClick={handleClearWorksheet}
                  className="px-3.5 py-1.5 text-[13.5px] bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                  title="Create a new worksheet"
                >
                  Create New
                </button>

              </>
            )}
          </div>
        </div>
        </div>

        {/* Template Preview Content */}
                <div className="flex-1 p-4" data-tutorial="worksheet-generator-preview-pane">
          {isEditingStructured && parsedWorksheet ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
              <WorksheetStructuredEditor
                worksheet={{
                  ...parsedWorksheet,
                  metadata: {
                    ...parsedWorksheet.metadata,
                    subject: formData.subject || parsedWorksheet.metadata.subject,
                    gradeLevel: formData.gradeLevel || parsedWorksheet.metadata.gradeLevel,
                    title: formData.worksheetTitle || parsedWorksheet.metadata.title
                  }
                }}
                onSave={(editedWorksheet) => {
                  setParsedWorksheet(editedWorksheet);
                  setGeneratedWorksheet(worksheetToDisplayText(editedWorksheet));
                  setIsEditingStructured(false);
                  // Auto-save
                  setTimeout(() => {
                    saveWorksheet();
                  }, 100);
                }}
                onCancel={() => setIsEditingStructured(false)}
                accentColor="#3b82f6"
              />
            </div>
          ) : null}
          {isEditing ? (
            <div className="rounded-lg h-full overflow-y-auto p-4 space-y-4 widget-glass">
              <h4 className="text-lg font-semibold text-theme-heading">Edit Worksheet Text</h4>
              <SmartTextArea
                value={editBuffer}
                onChange={(val) => setEditBuffer(val)}
                className="w-full h-96 border border-theme-strong rounded-lg p-3 font-mono text-sm"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded bg-theme-tertiary text-theme-label hover:bg-theme-hover"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const parsed = parseWorksheetFromAI(editBuffer);
                    setGeneratedWorksheet(editBuffer);
                    setParsedWorksheet(parsed || null);
                    setIsEditing(false);
                  }}
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : generationError ? (
            <div className="rounded-lg p-4 h-full flex items-center justify-center widget-glass">
              <div className="text-center text-red-600">
                <FileText className="w-12 h-12 mx-auto mb-2 text-red-300" />
                <p className="text-sm mb-4">{generationError}</p>
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Retry Generation
                </button>
              </div>
            </div>
          ) : (generatedWorksheet || streamingWorksheet || loading) ? (
            <div className="rounded-lg h-full overflow-y-auto widget-glass">
              {loading && !streamingWorksheet && !generatedWorksheet ? (
                <div className="transform scale-90 origin-top">
                  {renderTemplateWithLoading()}
                </div>
              ) : loading ? (
                <div className="transform scale-90 origin-top">
                  {renderTemplateWithLoading()}
                </div>
              ) : parsedWorksheet ? (
                <div className="transform scale-90 origin-top">
                   {formData.selectedTemplate === 'multiple-choice' && (
                     <MultipleChoiceTemplate
                       subject={formData.subject}
                       gradeLevel={formData.gradeLevel}
                       topic={formData.topic}
                       questionCount={parsedWorksheet.questions.length}
                       questionType={formData.questionType}
                       worksheetTitle={formData.worksheetTitle || parsedWorksheet.metadata.title}
                       includeImages={formData.includeImages}
                       generatedImage={generatedImages.length > 0 ? generatedImages[0] : null}
                       questions={parsedWorksheet.questions.map((q) => ({
                         id: q.id,
                         question: q.question,
                         options: q.options,
                         correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : undefined
                       }))}
                       showAnswers={viewMode === 'teacher'}
                       accentColor={accentColor || undefined}
                     />
                   )}
                  {formData.selectedTemplate === 'comprehension' && (
                    <ComprehensionTemplate
                      subject={formData.subject}
                      gradeLevel={formData.gradeLevel}
                      topic={formData.topic}
                      questionCount={parsedWorksheet.questions.length}
                      questionType={formData.questionType}
                      worksheetTitle={formData.worksheetTitle || parsedWorksheet.metadata.title}
                      includeImages={formData.includeImages}
                      imagePlacement={formData.imagePlacement}
                      generatedImage={generatedImages.length > 0 ? generatedImages[0] : null}
                      passage={parsedWorksheet.passage}
                      questions={parsedWorksheet.questions}
                      showAnswers={viewMode === 'teacher'}
                      accentColor={accentColor || undefined}
                    />
                  )}
                  {formData.selectedTemplate === 'matching' && (
                    <MatchingTemplate
                      subject={formData.subject}
                      gradeLevel={formData.gradeLevel}
                      topic={formData.topic}
                      questionCount={parsedWorksheet.questions.length}
                      questionType={formData.questionType}
                      worksheetTitle={formData.worksheetTitle || parsedWorksheet.metadata.title}
                      includeImages={formData.includeImages}
                      generatedImage={generatedImages.length > 0 ? generatedImages[0] : null}
                      columnA={parsedWorksheet.matchingItems?.columnA}
                      columnB={parsedWorksheet.matchingItems?.columnB}
                      showAnswers={viewMode === 'teacher'}
                      accentColor={accentColor || undefined}
                    />
                  )}
                  {formData.selectedTemplate === 'list-based' && (
                    <ListBasedTemplate
                      subject={formData.subject}
                      gradeLevel={formData.gradeLevel}
                      topic={formData.topic}
                      questionCount={parsedWorksheet.questions.length}
                      questionType={formData.questionType}
                      worksheetTitle={formData.worksheetTitle || parsedWorksheet.metadata.title}
                      includeImages={formData.includeImages}
                      generatedImage={generatedImage}
                      questions={parsedWorksheet.questions}
                      wordBank={parsedWorksheet.wordBank}
                      showAnswers={viewMode === 'teacher'}
                      accentColor={accentColor || undefined}
                    />
                  )}
                  {formData.selectedTemplate === 'math' && (
                    <MathTemplate
                      subject={formData.subject}
                      gradeLevel={formData.gradeLevel}
                      topic={formData.topic}
                      strand={formData.strand}
                      worksheetTitle={formData.worksheetTitle || parsedWorksheet.metadata.title}
                      questions={parsedWorksheet.questions}
                      showAnswers={viewMode === 'teacher'}
                      questionCount={parsedWorksheet.questions.length}
                      accentColor={accentColor || undefined}
                    />
                  )}
                </div>
              ) : (
                <div className="p-4">
                  <pre className="whitespace-pre-wrap text-sm text-theme-heading">
                    {generatedWorksheet || streamingWorksheet}
                  </pre>
                </div>
              )}
            </div>
          ) : selectedTemplate ? (
            <div className="rounded-lg h-full overflow-y-auto widget-glass">
              <div className="transform scale-90 origin-top">
                {renderTemplatePreview()}
              </div>
            </div>
          ) : (
            <div className="rounded-lg p-4 h-full flex items-center justify-center widget-glass">
              <div className="text-center text-theme-hint">
                <FileText className="w-12 h-12 mx-auto mb-2 text-theme-hint" />
                <p className="text-sm">Select a template to preview</p>
              </div>
            </div>
          )}
        </div>
 
        {/* ── Student Versions Panel ── */}
        {worksheetPackage && parsedWorksheet && (
          <div className="absolute inset-0 z-30 flex flex-col bg-theme-surface">
            {/* Top bar */}
            <div className="p-3 border-b border-theme flex items-center justify-between bg-theme-secondary">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-theme-heading">
                  {selectedStudentIndex === -1
                    ? 'Answer Key'
                    : `${worksheetPackage.studentVersions[selectedStudentIndex]?.student.full_name} — ${worksheetPackage.studentVersions[selectedStudentIndex]?.student.id}`
                  }
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-theme-hint">
                  {worksheetPackage.studentVersions.length} versions
                  {worksheetPackage.randomized && ' • Randomized'}
                </span>
                <button
                  onClick={() => {
                    const el = document.getElementById('student-versions-preview');
                    if (el) {
                      const pw = window.open('', '_blank');
                      if (pw) {
                        pw.document.write('<html><head><title>Print</title></head><body>' + el.innerHTML + '</body></html>');
                        pw.document.close();
                        setTimeout(() => pw.print(), 300);
                      }
                    }
                  }}
                  className="flex items-center px-3 py-1.5 text-xs bg-theme-tertiary text-theme-label rounded-lg hover:bg-theme-hover border border-theme-strong"
                >
                  <Printer className="w-3.5 h-3.5 mr-1.5" />
                  Print This
                </button>
                <ExportButton
                  dataType="worksheet"
                  data={{
                    content: generatedWorksheet,
                    parsedWorksheet: parsedWorksheet,
                    formData: { ...formData, viewMode },
                    accentColor: accentColor || '#3b82f6',
                    generatedImages: generatedImages,
                    worksheetId: viewMode === 'teacher' ? (currentWorksheetId || `worksheet_${Date.now()}`) : undefined
                  }}
                  filename={`worksheet-${selectedStudentIndex === -1 ? 'answer-key' : worksheetPackage.studentVersions[selectedStudentIndex]?.student.id}`}
                  className="!px-3 !py-1.5 !text-xs"
                />
                <button
                  onClick={() => setWorksheetPackage(null)}
                  className="p-1.5 rounded hover:bg-theme-hover transition"
                  title="Close student versions"
                >
                  <X className="w-4 h-4 text-theme-muted" />
                </button>
              </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Left sidebar — student list */}
              <div className="w-64 border-r border-theme flex flex-col bg-theme-secondary overflow-hidden">
                {/* Search */}
                <div className="p-2 border-b border-theme">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-theme-hint" />
                    <input
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      placeholder="Search students..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs border border-theme-strong rounded-lg focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Answer Key button */}
                <button
                  onClick={() => setSelectedStudentIndex(-1)}
                  className={`flex items-center gap-2 px-3 py-2.5 text-left border-b border-theme transition ${
                    selectedStudentIndex === -1
                      ? 'bg-red-50 border-l-4 border-l-red-500'
                      : 'hover:bg-theme-subtle border-l-4 border-l-transparent'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-red-600" />
                  <div>
                    <div className="text-sm font-semibold text-red-700">Answer Key</div>
                    <div className="text-xs text-red-500">Teacher version</div>
                  </div>
                </button>

                {/* Student list */}
                <div className="flex-1 overflow-y-auto">
                  {worksheetPackage.studentVersions
                    .filter(v => !studentSearch || v.student.full_name.toLowerCase().includes(studentSearch.toLowerCase()) || v.student.id.toLowerCase().includes(studentSearch.toLowerCase()))
                    .map((version, idx) => {
                      const realIdx = worksheetPackage.studentVersions.indexOf(version);
                      return (
                        <button
                          key={version.student.id}
                          onClick={() => setSelectedStudentIndex(realIdx)}
                          className={`w-full flex items-center gap-2 px-3 py-2 text-left border-b border-theme transition ${
                            selectedStudentIndex === realIdx
                              ? 'bg-blue-50 border-l-4 border-l-blue-500'
                              : 'hover:bg-theme-subtle border-l-4 border-l-transparent'
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-theme-heading truncate">{version.student.full_name}</div>
                            <div className="text-xs text-theme-hint font-mono">{version.student.id}</div>
                          </div>
                          {printedStudents.has(version.student.id) && (
                            <Check className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* Right side — preview */}
              <div className="flex-1 overflow-y-auto p-4" id="student-versions-preview">
                <div className="transform scale-[0.85] origin-top">
                  {selectedStudentIndex === -1
                    ? renderStudentVersion(null, true)
                    : renderStudentVersion(worksheetPackage.studentVersions[selectedStudentIndex], false)
                  }
                </div>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="p-3 border-t border-theme bg-theme-secondary flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintAll}
                  className="flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print All Student Worksheets
                </button>
                <button
                  onClick={() => {
                    setSelectedStudentIndex(-1);
                    const el = document.getElementById('student-versions-preview');
                    if (el) {
                      const pw = window.open('', '_blank');
                      if (pw) {
                        pw.document.write('<html><head><title>Answer Key</title></head><body>' + el.innerHTML + '</body></html>');
                        pw.document.close();
                        setTimeout(() => pw.print(), 300);
                      }
                    }
                  }}
                  className="flex items-center px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Print Answer Key
                </button>
              </div>
              <div className="text-xs text-theme-hint">
                {worksheetPackage.studentVersions.length} versions
                {worksheetPackage.randomized && ' • Questions randomized'}
                {' • '}{formData.selectedTemplate} template
              </div>
            </div>
          </div>
        )}

        {/* History Panel - Slides in from right as overlay */}
        {historyOpen && (
          <>
            {/* Backdrop to close on outside click */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setHistoryOpen(false)}
            />
            
            <div
              className="absolute top-0 right-0 h-full bg-theme-surface border-l border-theme shadow-xl transition-transform duration-300 ease-in-out z-50 w-80"
              onClick={(e) => e.stopPropagation()}
            >
          <div className="h-full flex flex-col p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-theme-heading">Saved Worksheets</h3>
              <button
                onClick={() => setHistoryOpen(false)}
                className="p-1 rounded hover:bg-theme-hover transition"
              >
                <X className="w-5 h-5 text-theme-muted" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {/* Drafts Section */}
              {drafts.length > 0 && (
                <div className="mb-2">
                  <button
                    onClick={() => setDraftsExpanded(!draftsExpanded)}
                    className="flex items-center gap-1 text-sm font-medium text-amber-700 dark:text-amber-400 mb-2 hover:opacity-80 transition"
                  >
                    <span className="text-xs" style={{ display: 'inline-block', transform: draftsExpanded ? 'rotate(180deg)' : 'rotate(90deg)', transition: 'transform 0.2s' }}>&#9660;</span>
                    Drafts ({drafts.length})
                  </button>
                  {draftsExpanded && (
                    <div className="space-y-2">
                      {drafts.map((draft) => (
                        <div
                          key={draft.id}
                          onClick={() => loadDraft(draft)}
                          className="p-3 rounded-lg cursor-pointer transition group hover:bg-amber-50 dark:hover:bg-amber-900/20 bg-theme-secondary border border-dashed border-amber-400"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">Draft</span>
                                <p className="text-sm font-medium text-theme-heading line-clamp-2">{draft.title}</p>
                              </div>
                              <p className="text-xs text-theme-hint mt-1">
                                {new Date(draft.timestamp).toLocaleDateString()}{' '}
                                {new Date(draft.timestamp).toLocaleTimeString()}
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

              {/* Saved Worksheets */}
              {drafts.length === 0 && worksheetHistories.length === 0 ? (
                <div className="text-center text-theme-hint mt-8">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-theme-hint" />
                  <p className="text-sm">No saved worksheets yet</p>
                </div>
              ) : (
                worksheetHistories.map((history) => (
                  <div
                    key={history.id}
                    onClick={() => loadWorksheetFromHistory(history)}
                    className={`p-3 rounded-lg cursor-pointer transition group hover:bg-theme-subtle ${
                      currentWorksheetId === history.id ? 'bg-blue-50 border border-blue-200' : 'bg-theme-secondary border border-theme'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-theme-heading line-clamp-2">
                          {history.title}
                        </p>
                        <p className="text-xs text-theme-hint mt-1">
                          {new Date(history.timestamp).toLocaleDateString()}{' '}
                          {new Date(history.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => deleteWorksheetHistory(history.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition"
                        title="Delete worksheet"
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
      </>
    )}
          </div>

          {/* BACK FACE — Worksheet Grader */}
          <div
            className="flex-1 flex flex-col bg-theme-surface"
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
              <WorksheetGrader
                worksheet={parsedWorksheet}
                onClose={() => setIsGrading(false)}
              />
            )}
          </div>
        </div>
      </div>

      <ScheduleTestModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        testInfo={{
          title: formData.worksheetTitle || `${formData.subject} - Grade ${formData.gradeLevel} Worksheet`,
          type: 'worksheet',
          referenceId: currentWorksheetId || '',
          subject: formData.subject || '',
          gradeLevel: formData.gradeLevel || '',
        }}
        accentColor={settings.tabColors['worksheet-generator'] ?? '#3b82f6'}
      />
    </div>
  );
};

export default WorksheetGenerator;