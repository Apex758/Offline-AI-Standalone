import React, { useState, useEffect } from 'react';
import { FileText, Loader2, Eye } from 'lucide-react';
import curriculumIndex from '../data/curriculumIndex.json';

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
  includeImages: boolean;
  imageStyle: string;
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

const imageStyleOptions = [
  'Cartoon',
  'Black & White',
  'Realistic'
];

const worksheetTemplates: WorksheetTemplate[] = [
  {
    id: 'standard',
    name: 'Standard Worksheet',
    description: 'Traditional worksheet layout with questions and answer spaces',
    compatibleTypes: questionTypeOptions,
    preview: 'Standard Layout Preview'
  },
  {
    id: 'multiple-choice',
    name: 'Multiple Choice Focus',
    description: 'Optimized for multiple choice questions with clear options',
    compatibleTypes: ['Multiple Choice'],
    preview: 'Multiple Choice Layout Preview'
  },
  {
    id: 'comprehension',
    name: 'Reading Comprehension',
    description: 'Includes passage area with comprehension questions',
    compatibleTypes: ['Comprehension', 'Short Answer', 'True / False'],
    preview: 'Comprehension Layout Preview'
  },
  {
    id: 'interactive',
    name: 'Interactive Worksheet',
    description: 'Includes spaces for drawing and interactive elements',
    compatibleTypes: ['Fill in the Blank', 'Short Answer', 'Word Bank'],
    preview: 'Interactive Layout Preview'
  }
];

const subjects = [
  'Mathematics',
  'Language Arts',
  'Science',
  'Social Studies'
];

const grades = ['K', '1', '2', '3', '4', '5', '6'];

const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = ({ tabId, savedData, onDataChange, onOpenCurriculumTab }) => {
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
    includeImages: false,
    imageStyle: 'Cartoon'
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

  const [loading, setLoading] = useState(false);
  const [curriculumMatches, setCurriculumMatches] = useState<CurriculumPage[]>([]);
  const [loadingCurriculum, setLoadingCurriculum] = useState(false);

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
    setLoading(true);
    // TODO: Implement generation logic
    setTimeout(() => setLoading(false), 2000); // Mock loading
  };

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ formData }));
  }, [formData]);

  // Notify parent
  useEffect(() => {
    onDataChange?.({ formData });
  }, [formData]);

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

  return (
    <div className="h-full bg-white flex">
      {/* Left Panel - Configuration (~80%) */}
      <div className="flex-1 flex flex-col border-r border-gray-200">
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
                    Number of Questions
                  </label>
                  <input
                    type="number"
                    value={formData.questionCount}
                    onChange={(e) => handleInputChange('questionCount', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 10"
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

            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Image Integration</h3>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.includeImages}
                  onChange={(e) => handleInputChange('includeImages', e.target.checked)}
                  className="w-4 h-4 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">Include Images</label>
              </div>

              {formData.includeImages && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Style
                  </label>
                  <select
                    value={formData.imageStyle}
                    onChange={(e) => handleInputChange('imageStyle', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {imageStyleOptions.map(style => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="max-w-4xl mx-auto flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={loading || !formData.subject || !formData.gradeLevel || !formData.strand || !formData.questionType || !formData.selectedTemplate}
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

      {/* Right Panel - Preview (~20%) */}
      <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Template Preview
          </h3>
          <p className="text-sm text-gray-500">Live layout preview</p>
        </div>

        <div className="flex-1 p-4">
          {selectedTemplate ? (
            <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
              <div className="text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">{selectedTemplate.preview}</p>
                <p className="text-xs mt-2 text-gray-400">
                  Template: {selectedTemplate.name}
                </p>
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