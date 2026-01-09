import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Eye, Trash2, RotateCcw } from 'lucide-react';
import curriculumIndex from '../data/curriculumIndex.json';
import {
  MultipleChoiceTemplate,
  ComprehensionTemplate,
  MatchingTemplate,
  ListBasedTemplate
} from './templates';

import { imageApi } from '../lib/imageApi';
import { Wand2, Download } from 'lucide-react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { buildWorksheetPrompt } from '../utils/worksheetPromptBuilder';
import { parseWorksheetFromAI, ParsedWorksheet, worksheetToDisplayText } from '../types/worksheet';

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
  imageMode: string;
  imagePlacement: string;
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
    id: 'comprehension',
    name: 'Reading Comprehension Template',
    description: 'Passage-based comprehension questions layout',
    compatibleTypes: ['Comprehension', 'Short Answer', 'True / False', 'Multiple Choice'],
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
    compatibleTypes: ['Short Answer', 'Fill in the Blank', 'Word Bank', 'True / False'],
    preview: 'List-Based Layout Preview'
  }
];

const subjects = [
  'Mathematics',
  'Language Arts',
  'Science',
  'Social Studies'
];

const grades = ['K', '1', '2', '3', '4', '5', '6'];

const ENDPOINT = '/ws/worksheet';

const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = ({ tabId, savedData, onDataChange, onOpenCurriculumTab }) => {
  const { getConnection, getStreamingContent, getIsStreaming, clearStreaming } = useWebSocket();
  const LOCAL_STORAGE_KEY = `worksheet_state_${tabId}`;

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
    imageStyle: 'Cartoon',
    imageMode: 'one-per-question',
    imagePlacement: 'large-centered'
  });

  const [formData, setFormData] = useState<WorksheetFormData>(() => {
    if (savedData?.formData && typeof savedData.formData === 'object') {
      return savedData.formData as WorksheetFormData;
    }
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

  // ✅ Read streaming content from context (read-only, no setter!)
  const streamingWorksheet = getStreamingContent(tabId || '', ENDPOINT);
  const contextLoading = getIsStreaming(tabId || '', ENDPOINT);
  // Per-tab local loading state
  const [localLoadingMap, setLocalLoadingMap] = useState<{ [tabId: string]: boolean }>(() => {
    try {
      const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        return parsed.localLoadingMap || {};
      }
    } catch (e) {
      console.error('Failed to restore localLoadingMap:', e);
    }
    return {};
  });
  const loading = !!localLoadingMap[tabId || ''] || contextLoading;

  // ✅ Finalization logic - when streaming completes, update generatedWorksheet
  useEffect(() => {
    if (streamingWorksheet && !contextLoading) {
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


  // ✅ Connect WebSocket on mount
  useEffect(() => {
    getConnection(tabId || '', ENDPOINT);
  }, [tabId]);

  // Auto-fetch strands based on subject and grade
  const getStrands = (subject: string, grade: string): string[] => {
    if (!subject || !grade) return [];
    const curriculumData = curriculumIndex as CurriculumIndex;
    const pages = curriculumData.indexedPages || [];
    const strandsSet = new Set<string>();
    pages.forEach((page: CurriculumPage) => {
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

  // Get compatible templates based on selected question type
  const getCompatibleTemplates = (): WorksheetTemplate[] => {
    if (!formData.questionType) return worksheetTemplates;
    return worksheetTemplates.filter(template =>
      template.compatibleTypes.includes(formData.questionType)
    );
  };

  const handleInputChange = (field: keyof WorksheetFormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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


  const handleGenerate = () => {
    console.log('handleGenerate called');
    const ws = getConnection(tabId || '', ENDPOINT);
    console.log('WebSocket readyState:', ws.readyState);
    if (ws.readyState !== WebSocket.OPEN) {
      setGenerationError('Connection not established. Please wait and try again.');
      return;
    }
    // Clear any previous errors and streaming content
    setGenerationError(null);
    clearStreaming(tabId || '', ENDPOINT);
    console.log('Setting loading state');
    setLocalLoadingMap(prev => ({ ...prev, [tabId || '']: true }));

    // Build prompt for worksheet generation
    const prompt = buildWorksheetPrompt(formData);

    const jobId = `worksheet-${Date.now()}`;
    console.log('Built prompt, jobId:', jobId);

    const message = {
      prompt,
      formData,
      jobId,
      generationMode: 'queued',
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
    setClearedWorksheet(generatedWorksheet);
    setClearedParsedWorksheet(parsedWorksheet);
    setGeneratedWorksheet('');
    setParsedWorksheet(null);
    setGenerationError(null);
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
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ formData, generatedWorksheet, parsedWorksheet, localLoadingMap, clearedWorksheet, clearedParsedWorksheet }));
  }, [formData, generatedWorksheet, parsedWorksheet, localLoadingMap, clearedWorksheet, clearedParsedWorksheet]);

  // Notify parent
  useEffect(() => {
    onDataChange?.({ formData, generatedWorksheet, parsedWorksheet, clearedWorksheet, clearedParsedWorksheet });
  }, [formData, generatedWorksheet, parsedWorksheet, clearedWorksheet, clearedParsedWorksheet]);

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

  const renderTemplatePreview = () => {
    if (!selectedTemplate) return null;

    const commonProps = {
      subject: formData.subject,
      gradeLevel: formData.gradeLevel,
      topic: formData.topic,
      questionCount: parseInt(formData.questionCount) || 10,
      questionType: formData.questionType,
      worksheetTitle: formData.worksheetTitle || selectedTemplate.name,
      includeImages: formData.includeImages,
      imageMode: formData.imageMode,
      imagePlacement: formData.imagePlacement,
      generatedImage: generatedImages.length > 0 ? generatedImages[0] : null
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
      default:
        return null;
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
        numInferenceSteps: 2
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
    // Assuming downloadImage is imported, but since it's not, perhaps use a simple download
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `generated-image-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="h-full bg-white grid grid-cols-2">
      {/* Left Panel - Configuration (50%) */}
      <div className="flex flex-col border-r border-gray-200 overflow-y-auto">
        <div className="border-b border-gray-200 p-4">
          <h2 className="text-xl font-semibold text-gray-800">Worksheet Generator</h2>
          <p className="text-sm text-gray-500">Create customized worksheets with curriculum alignment</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Curriculum Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Curriculum Alignment</h3>

              {/* Two-column layout for dropdowns and curriculum box */}
              <div className="grid grid-cols-2 gap-6">
                {/* Left column - Form fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => {
                        handleInputChange('subject', e.target.value);
                        handleInputChange('strand', '');
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        handleInputChange('strand', '');
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        onChange={(e) => handleInputChange('strand', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select a strand</option>
                        {getStrands(formData.subject, formData.gradeLevel).map(strand => (
                          <option key={strand} value={strand}>{strand}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Topic
                    </label>
                    <input
                      type="text"
                      value={formData.topic}
                      onChange={(e) => handleInputChange('topic', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Water Cycle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Worksheet Title <span className="text-gray-500">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.worksheetTitle}
                      onChange={(e) => handleInputChange('worksheetTitle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Leave blank to use template name"
                    />
                  </div>
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
                        {curriculumMatches.map((curriculum: Record<string, unknown>) => (
                          <div
                            key={curriculum.id as string}
                            className="flex flex-col p-3 rounded-lg border border-gray-200 bg-white hover:shadow-md cursor-pointer transition group"
                            tabIndex={0}
                            role="button"
                            onClick={() => handleOpenCurriculum(curriculum.route as string)}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') handleOpenCurriculum(curriculum.route as string);
                            }}
                            style={{ outline: 'none' }}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {(curriculum.displayName as string) || (curriculum.strand as string)}
                                </p>
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {((curriculum.essentialOutcomes as string[])?.[0]) || 'No description available'}
                                </p>
                              </div>
                              <button
                                className="ml-4 px-3 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleOpenCurriculum(curriculum.route as string);
                                }}
                              >
                                Open
                              </button>
                            </div>
                            <div className="mt-2">
                              <span className="inline-block text-xs text-gray-500">
                                Grade: {curriculum.grade as string} | Strand: {curriculum.strand as string}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Worksheet Scope */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Worksheet Scope</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Students
                  </label>
                  <input
                    type="number"
                    value={formData.studentCount}
                    onChange={(e) => handleInputChange('studentCount', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.questionCount}
                    onChange={(e) => handleInputChange('questionCount', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 10"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Question Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Question Type</h3>
              <p className="text-sm text-gray-500">Select the type of questions to include in your worksheet</p>

              <div>
                <select
                  value={formData.questionType}
                  onChange={(e) => {
                    handleInputChange('questionType', e.target.value);
                    handleInputChange('selectedTemplate', getCompatibleTemplates().find(t => t.id === formData.selectedTemplate) ? formData.selectedTemplate : '');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a question type</option>
                  {questionTypeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Include Images */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.includeImages}
                    onChange={(e) => handleInputChange('includeImages', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Include Images</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">Add relevant images to enhance the worksheet</p>
              </div>
            </div>

            {/* AI Image Generation */}
            {formData.includeImages && (
              <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">AI Image Generation</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Prompt <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe the image you want to generate..."
                />
              </div>

              <button
                onClick={handleGenerateImage}
                disabled={generatingImages || !imagePrompt.trim()}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {generatingImages ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5 mr-2" />
                    Generate Image
                  </>
                )}
              </button>

              {imageError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center justify-between">
                  <span>{imageError}</span>
                  <button
                    onClick={() => {
                      setImageError(null);
                      handleGenerateImage();
                    }}
                    className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
                  >
                    Retry
                  </button>
                </div>
              )}

              {generatedImages.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Generated Images</h4>
                  {generatedImages.map((img, i) => (
                    <div key={i} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                      <img
                        src={img}
                        alt={`Generated ${i + 1}`}
                        className="w-full max-h-64 object-contain rounded-lg mb-4"
                      />
                      <button
                        onClick={() => handleDownloadImage(img)}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Image
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            )}

            {/* Templates */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Worksheet Template</h3>
              <p className="text-sm text-gray-500">Choose a layout that works with your selected question types</p>

              <div className="grid grid-cols-1 gap-3">
                {compatibleTemplates.map(template => (
                  <label key={template.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="template"
                      value={template.id}
                      checked={formData.selectedTemplate === template.id}
                      onChange={(e) => handleInputChange('selectedTemplate', e.target.value)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{template.name}</div>
                      <div className="text-sm text-gray-500">{template.description}</div>
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
            {formData.selectedTemplate && formData.includeImages && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Template-Specific Options</h3>
                {formData.selectedTemplate === 'multiple-choice' || formData.selectedTemplate === 'list-based' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Mode
                    </label>
                    <select
                      value={formData.imageMode}
                      onChange={(e) => handleInputChange('imageMode', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="one-per-question">One image per question</option>
                      <option value="shared">One shared image for the entire worksheet</option>
                    </select>
                  </div>
                ) : formData.selectedTemplate === 'comprehension' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Placement
                    </label>
                    <select
                      value={formData.imagePlacement}
                      onChange={(e) => handleInputChange('imagePlacement', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="large-centered">Large centered image above or within the passage</option>
                      <option value="small-corner">Small image in a corner with text wrapping around it</option>
                    </select>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
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
                disabled={loading || !formData.subject || !formData.gradeLevel || !formData.strand || !formData.questionCount || !formData.questionType || !formData.selectedTemplate}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5 mr-2" />
                    Generate Worksheet
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Preview (50%) */}
      <div className="bg-gray-50 border-l border-gray-200 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <Eye className="w-5 h-5 mr-2" />
                Template Preview
              </h3>
              <p className="text-sm text-gray-500">Live layout preview</p>
            </div>
            {(generatedWorksheet || parsedWorksheet) && (
              <div className="flex space-x-2">
                <button
                  onClick={handleClearWorksheet}
                  className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition text-sm"
                  title="Clear generated worksheet"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear
                </button>
                {clearedWorksheet && (
                  <button
                    onClick={handleRestoreWorksheet}
                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition text-sm"
                    title="Restore cleared worksheet"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Back
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-4">
           {generationError ? (
              <div className="bg-white rounded-lg border border-gray-200 p-4 h-full flex items-center justify-center">
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
            ) : (generatedWorksheet || streamingWorksheet) ? (
              <div className="bg-white rounded-lg border border-gray-200 h-full overflow-y-auto p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-800">
                  {parsedWorksheet ? worksheetToDisplayText(parsedWorksheet) : (generatedWorksheet || streamingWorksheet)}
                </pre>
              </div>
            ) : selectedTemplate ? (
              <div className="bg-white rounded-lg border border-gray-200 h-full overflow-y-auto">
                <div className="transform scale-90 origin-top">
                  {renderTemplatePreview()}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-4 h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Select a template to preview</p>
                </div>
              </div>
            )}
          </div>
      </div>
    </div>
  );
};

export default WorksheetGenerator;