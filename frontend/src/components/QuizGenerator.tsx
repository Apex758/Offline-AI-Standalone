import React, { useState, useEffect, useRef } from 'react';
import { Loader2, ListChecks, Trash2, Save, Download, History, X, Edit, Check, Copy, Sparkles } from 'lucide-react';
import AIAssistantPanel from './AIAssistantPanel';
import axios from 'axios';

interface QuizGeneratorProps {
  tabId: string;
  savedData?: any;
  onDataChange: (data: any) => void;
}

interface QuizHistory {
  id: string;
  title: string;
  timestamp: string;
  formData: FormData;
  generatedQuiz: string;
}

interface FormData {
  subject: string;
  gradeLevel: string;
  learningOutcomes: string;
  questionTypes: string[];
  cognitiveLevels: string[];
  timeLimitPerQuestion: string;
  randomizeQuestions: boolean;
  numberOfQuestions: string;
}

const formatQuizText = (text: string) => {
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
        <h2 key={`section-${currentIndex++}`} className="text-xl font-bold text-cyan-900 mt-8 mb-4 pb-2 border-b border-cyan-200">
          {title}
        </h2>
      );
      return;
    }

    // Question numbers
    if (trimmed.match(/^Question \d+:/)) {
      elements.push(
        <h3 key={`question-${currentIndex++}`} className="text-lg font-semibold text-cyan-700 mt-6 mb-3 bg-cyan-50 p-3 rounded-lg">
          {trimmed}
        </h3>
      );
      return;
    }

    // Answer options (A), B), C), D))
    if (trimmed.match(/^[A-D]\)/)) {
      elements.push(
        <div key={`option-${currentIndex++}`} className="ml-6 mb-2 flex items-start">
          <span className="text-cyan-600 mr-3 font-semibold">{trimmed.substring(0, 2)}</span>
          <span className="text-gray-700">{trimmed.substring(2).trim()}</span>
        </div>
      );
      return;
    }

    // Bullet points
    if (trimmed.match(/^\s*\*\s+/) && !trimmed.startsWith('**')) {
      const content = trimmed.replace(/^\s*\*\s+/, '');
      elements.push(
        <div key={`bullet-${currentIndex++}`} className="mb-2 flex items-start ml-4">
          <span className="text-cyan-500 mr-3 mt-1.5 font-bold text-sm">•</span>
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
          <span className="text-cyan-600 mr-3 font-semibold min-w-[2rem] bg-cyan-50 rounded px-2 py-1 text-sm">
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

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ tabId, savedData, onDataChange }) => {
  const [loading, setLoading] = useState(false);
  const shouldReconnectRef = useRef(true);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [quizHistories, setQuizHistories] = useState<QuizHistory[]>([]);
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Add new states for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const [assistantOpen, setAssistantOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>(() => {
    const saved = savedData?.formData;
    if (saved && Object.keys(saved).length > 0 && saved.subject) {
      return saved;
    }
    return {
      subject: '',
      gradeLevel: '',
      learningOutcomes: '',
      questionTypes: [],
      cognitiveLevels: [],
      timeLimitPerQuestion: '',
      randomizeQuestions: false,
      numberOfQuestions: '10'
    };
  });

  const [generatedQuiz, setGeneratedQuiz] = useState<string>(savedData?.generatedQuiz || '');
  const [streamingQuiz, setStreamingQuiz] = useState<string>(savedData?.streamingQuiz || '');

  const subjects = ['Mathematics', 'Science', 'Language Arts', 'Social Studies', 'Music', 'Physical Education'];
  const grades = ['K', '1', '2', '3', '4', '5', '6'];
  const questionTypesOptions = ['Multiple Choice', 'True/False', 'Open-Ended', 'Fill-in-the-Blank'];
  const cognitiveLevelsOptions = ['Knowledge', 'Comprehension', 'Application', 'Analysis', 'Synthesis', 'Evaluation'];

  // Initialize edited content when quiz is generated
  useEffect(() => {
    if (generatedQuiz && !editedContent) {
      setEditedContent(generatedQuiz);
    }
  }, [generatedQuiz]);

  useEffect(() => {
    const saved = savedData?.formData;
    if (!saved || Object.keys(saved).length === 0 || !saved.subject) {
      setFormData({
        subject: '',
        gradeLevel: '',
        learningOutcomes: '',
        questionTypes: [],
        cognitiveLevels: [],
        timeLimitPerQuestion: '',
        randomizeQuestions: false,
        numberOfQuestions: '10'
      });
      setGeneratedQuiz('');
      setStreamingQuiz('');
    } else {
      setFormData(saved);
      setGeneratedQuiz(savedData?.generatedQuiz || '');
      setStreamingQuiz(savedData?.streamingQuiz || '');
    }
  }, [tabId]);

  useEffect(() => {
    onDataChange({ formData, generatedQuiz, streamingQuiz });
  }, [formData, generatedQuiz, streamingQuiz]);

  useEffect(() => {
    shouldReconnectRef.current = true;

    const connectWebSocket = () => {
      if (!shouldReconnectRef.current) return;

      try {
        const ws = new WebSocket('ws://localhost:8000/ws/quiz');
        
        ws.onopen = () => console.log('Quiz WebSocket connected');
        
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          
          if (data.type === 'token') {
            setStreamingQuiz(prev => prev + data.content);
          } else if (data.type === 'done') {
            setStreamingQuiz(current => {
              const finalMessage = current || data.full_response;
              setGeneratedQuiz(finalMessage);
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
          if (shouldReconnectRef.current) {
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

  // Enable editing mode
  const enableEditing = () => {
    setEditedContent(generatedQuiz);
    setIsEditing(true);
  };

  // Save edited content
  const saveEditedContent = () => {
    setGeneratedQuiz(editedContent);
    setIsEditing(false);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditedContent(generatedQuiz);
    setIsEditing(false);
  };

  // Copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(editedContent || generatedQuiz);
      setCopyStatus('copied');
      setTimeout(() => setCopyStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const loadQuizHistories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/quiz-history');
      setQuizHistories(response.data);
    } catch (error) {
      console.error('Failed to load quiz histories:', error);
    }
  };

  // Update saveQuiz to use edited content
  const saveQuiz = async () => {
    const contentToSave = isEditing ? editedContent : generatedQuiz;
    if (!contentToSave) {
      alert('No quiz to save');
      return;
    }

    setSaveStatus('saving');
    try {
      const quizData = {
        id: currentQuizId || `quiz_${Date.now()}`,
        title: `${formData.subject} Quiz - Grade ${formData.gradeLevel} (${formData.numberOfQuestions} questions)`,
        timestamp: new Date().toISOString(),
        formData: formData,
        generatedQuiz: contentToSave
      };

      if (!currentQuizId) {
        setCurrentQuizId(quizData.id);
      }

      await axios.post('http://localhost:8000/api/quiz-history', quizData);
      await loadQuizHistories();
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
      
      // If we were editing, exit editing mode after save
      if (isEditing) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to save quiz:', error);
      alert('Failed to save quiz');
      setSaveStatus('idle');
    }
  };

  // Update exportQuiz to use edited content
  const exportQuiz = () => {
    const contentToExport = isEditing ? editedContent : generatedQuiz;
    if (!contentToExport) return;

    const content = `QUIZ
${formData.subject} - Grade ${formData.gradeLevel}
${formData.numberOfQuestions} Questions
Generated: ${new Date().toLocaleDateString()}

${contentToExport}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-${formData.subject.toLowerCase()}-grade${formData.gradeLevel}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    loadQuizHistories();
  }, []);

  const loadQuizHistory = (history: QuizHistory) => {
    setFormData(history.formData);
    setGeneratedQuiz(history.generatedQuiz);
    setCurrentQuizId(history.id);
    setHistoryOpen(false);
  };

  const deleteQuizHistory = async (quizId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this quiz?')) return;
    
    try {
      await axios.delete(`http://localhost:8000/api/quiz-history/${quizId}`);
      await loadQuizHistories();
      if (currentQuizId === quizId) {
        clearForm();
      }
    } catch (error) {
      console.error('Failed to delete quiz:', error);
    }
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

  const generateQuiz = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      alert('Connection not established. Please wait and try again.');
      return;
    }

    setLoading(true);
    setStreamingQuiz('');

    // Grade-specific guidance
    const gradeGuidance: { [key: string]: string } = {
      'K': 'Kindergarten level: Use very simple vocabulary, concrete concepts, visual/tactile learning references. Focus on basic observation skills. Questions should be about things children can see, touch, or experience directly.',
      '1': 'Grade 1 level: Use simple sentences and basic vocabulary. Focus on concrete, observable concepts. Include familiar everyday examples from home and school.',
      '2': 'Grade 2 level: Use age-appropriate vocabulary with some descriptive words. Introduce basic scientific terms. Focus on observable patterns and simple cause-and-effect relationships.',
      '3': 'Grade 3 level: Introduce more complex vocabulary and concepts. Students can handle multi-step thinking. Include more abstract concepts but still relate to concrete examples.',
      '4': 'Grade 4 level: Use grade-level academic vocabulary. Students can analyze patterns and make predictions. Include more complex scientific processes and relationships.',
      '5': 'Grade 5 level: Use subject-specific terminology. Students can handle abstract concepts and complex systems. Include questions requiring analysis and synthesis.',
      '6': 'Grade 6 level: Use advanced academic vocabulary. Students can engage in critical thinking, analyze complex systems, and make evidence-based conclusions.'
    };

    // Subject-specific guidance
    const subjectGuidance: { [key: string]: string } = {
      'Mathematics': 'Focus on number sense, operations, patterns, geometry, measurement, and problem-solving appropriate for the grade level. Use real-world math scenarios.',
      'Science': 'Focus on life science, physical science, earth science, and scientific inquiry. Use age-appropriate scientific vocabulary and observable phenomena.',
      'Language Arts': 'Focus on reading comprehension, grammar, vocabulary, writing conventions, and literary elements appropriate for the grade level.',
      'Social Studies': 'Focus on communities, geography, history, culture, and citizenship. Use examples from students\' local community and expand outward.',
      'Music': 'Focus on rhythm, melody, musical instruments, composers, musical notation, and listening skills appropriate for the grade level.',
      'Physical Education': 'Focus on movement skills, fitness concepts, healthy habits, sportsmanship, and age-appropriate physical activities.'
    };

    const currentGradeGuidance = gradeGuidance[formData.gradeLevel] || 'Use age-appropriate language and concepts.';
    const currentSubjectGuidance = subjectGuidance[formData.subject] || 'Focus on core concepts for this subject area.';

    // Build question type specific instructions
    let questionTypeInstructions = '';
    const types = formData.questionTypes;
    
    if (types.length === 1) {
      const type = types[0];
      
      if (type === 'True/False') {
        questionTypeInstructions = `
  FORMAT REQUIREMENTS - CRITICAL:
  ALL ${formData.numberOfQuestions} questions MUST be True/False format.
  Each question must be a STATEMENT (not a question) that can be answered with True or False.

  GRADE ${formData.gradeLevel} TRUE/FALSE RULES:
  - Use vocabulary appropriate for ${formData.gradeLevel} students
  - Make statements about ${formData.subject} concepts from the learning outcomes
  - Ensure statements are clear and unambiguous for this age group
  - Mix true and false statements (not all true, not all false)

  Format each question EXACTLY like this:
  Question 1: [Clear statement about ${formData.subject} that is either true or false]
  A) True
  B) False

  ${formData.gradeLevel === 'K' || formData.gradeLevel === '1' || formData.gradeLevel === '2' 
    ? 'Example for young learners:\nQuestion 1: Plants need water to grow.\nA) True\nB) False' 
    : `Example:\nQuestion 1: ${formData.subject === 'Science' ? 'Photosynthesis occurs in the chloroplasts of plant cells.' : 'The water cycle includes evaporation, condensation, and precipitation.'}\nA) True\nB) False`}

  DO NOT create multiple choice questions with A, B, C, D options.
  DO NOT ask "Which of the following..." style questions.
  DO NOT use question format - use statement format.
  ONLY create clear statements that are definitively True or False for Grade ${formData.gradeLevel}.`;
      } else if (type === 'Multiple Choice') {
        questionTypeInstructions = `
  FORMAT REQUIREMENTS:
  ALL ${formData.numberOfQuestions} questions MUST be Multiple Choice format with 4 options (A, B, C, D).
  Each question should have exactly one correct answer.

  GRADE ${formData.gradeLevel} MULTIPLE CHOICE RULES:
  - Use ${formData.gradeLevel} level vocabulary and concepts
  - All options should be plausible to avoid obvious wrong answers
  - Wrong answers (distractors) should be based on common misconceptions at this grade level
  - Focus on ${formData.subject} concepts from the learning outcomes

  Format each question like this:
  Question 1: [Question about ${formData.subject} appropriate for Grade ${formData.gradeLevel}]
  A) [Option 1]
  B) [Option 2]
  C) [Option 3]
  D) [Option 4]`;
      } else if (type === 'Fill-in-the-Blank') {
        questionTypeInstructions = `
  FORMAT REQUIREMENTS:
  ALL ${formData.numberOfQuestions} questions MUST be Fill-in-the-Blank format.
  Use _____ to indicate where students should fill in the answer.

  GRADE ${formData.gradeLevel} FILL-IN-THE-BLANK RULES:
  - Sentences should use Grade ${formData.gradeLevel} appropriate vocabulary
  - The blank should test key ${formData.subject} terms from the learning outcomes
  - Provide enough context so students at this grade can determine the answer
  - One-word or short phrase answers work best

  Format each question like this:
  Question 1: [Sentence with _____ about ${formData.subject} for Grade ${formData.gradeLevel}]`;
      } else if (type === 'Open-Ended') {
        questionTypeInstructions = `
  FORMAT REQUIREMENTS:
  ALL ${formData.numberOfQuestions} questions MUST be Open-Ended format.
  These questions require detailed written responses based on what Grade ${formData.gradeLevel} students can express.

  GRADE ${formData.gradeLevel} OPEN-ENDED RULES:
  - Questions should match the writing ability of Grade ${formData.gradeLevel} students
  - Focus on ${formData.subject} concepts that can be explained at this level
  - ${formData.gradeLevel === 'K' || formData.gradeLevel === '1' 
      ? 'Keep responses short - students may draw or write 1-2 sentences' 
      : formData.gradeLevel === '2' || formData.gradeLevel === '3'
      ? 'Expect 2-4 sentence responses'
      : 'Expect paragraph-length responses with details and examples'}

  Format each question like this:
  Question 1: [Question about ${formData.subject} requiring Grade ${formData.gradeLevel} appropriate explanation]`;
      }
    } else {
      questionTypeInstructions = `
  FORMAT REQUIREMENTS:
  Create a mix of the following question types: ${types.join(', ')}
  Distribute questions evenly across these types.
  All questions must be appropriate for Grade ${formData.gradeLevel} ${formData.subject}.

  For True/False questions, format as:
  Question X: [Grade ${formData.gradeLevel} appropriate statement about ${formData.subject}]
  A) True
  B) False

  For Multiple Choice questions, format as:
  Question X: [Grade ${formData.gradeLevel} level question]
  A) [Option 1]
  B) [Option 2]
  C) [Option 3]
  D) [Option 4]

  For Fill-in-the-Blank, use _____:
  Question X: [Grade ${formData.gradeLevel} sentence with _____ for blank]

  For Open-Ended:
  Question X: [Question requiring explanation at Grade ${formData.gradeLevel} writing level]`;
    }

    const prompt = `Generate a comprehensive quiz with the following specifications.
  IMPORTANT: Do NOT include any introduction, preface, or explanatory text like "Here is a quiz" or "Below is...".
  Start directly with the quiz title and questions.

  QUIZ INFORMATION:
  - Subject: ${formData.subject}
  - Grade Level: Grade ${formData.gradeLevel}
  - Number of Questions: ${formData.numberOfQuestions}
  - Date: ${new Date().toLocaleDateString()}

  GRADE & SUBJECT CONTEXT:
  ${currentGradeGuidance}
  ${currentSubjectGuidance}

  LEARNING OUTCOMES TO ASSESS:
  ${formData.learningOutcomes}

  ${questionTypeInstructions}

  COGNITIVE LEVELS:
  Create questions at these cognitive levels: ${formData.cognitiveLevels.join(', ')}
  Ensure cognitive complexity is appropriate for Grade ${formData.gradeLevel}.
  ${formData.timeLimitPerQuestion ? `\nTIME LIMIT: ${formData.timeLimitPerQuestion} seconds per question` : ''}
  ${formData.randomizeQuestions ? '\nDesign questions suitable for randomization.' : ''}

  CRITICAL INSTRUCTIONS:
  1. Create EXACTLY ${formData.numberOfQuestions} questions
  2. EVERY question must be appropriate for Grade ${formData.gradeLevel} students studying ${formData.subject}
  3. Use vocabulary, concepts, and complexity suitable for ${formData.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${formData.gradeLevel}`} students
  4. All content must relate to the subject of ${formData.subject}
  5. Questions must assess the learning outcomes: ${formData.learningOutcomes}
  6. Follow the format requirements EXACTLY as specified above
  7. End with a clear "Answer Key:" section listing answers 1-${formData.numberOfQuestions}
  8. For True/False questions, create STATEMENTS not questions

  Generate the quiz now:`;

    try {
      wsRef.current.send(JSON.stringify({ prompt }));
    } catch (error) {
      console.error('Failed to send quiz request:', error);
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      subject: '',
      gradeLevel: '',
      learningOutcomes: '',
      questionTypes: [],
      cognitiveLevels: [],
      timeLimitPerQuestion: '',
      randomizeQuestions: false,
      numberOfQuestions: '10'
    });
    setGeneratedQuiz('');
    setStreamingQuiz('');
    setCurrentQuizId(null);
    setIsEditing(false);
    setEditedContent('');
  };

  const validateForm = () => {
    return formData.subject && formData.gradeLevel && formData.learningOutcomes && 
           formData.questionTypes.length > 0 && formData.cognitiveLevels.length > 0;
  };

  return (
    <div className="flex h-full bg-white relative">
      <div className="flex-1 flex flex-col bg-white">
        {(generatedQuiz || streamingQuiz || isEditing) ? (
          <>
            <div className="border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  {loading ? 'Generating Quiz...' : 
                   isEditing ? 'Editing Quiz' : 'Generated Quiz'}
                </h2>
                <p className="text-sm text-gray-500">{formData.subject} - Grade {formData.gradeLevel}</p>
              </div>
              {!loading && (
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={cancelEditing}
                        className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                      <button
                        onClick={saveEditedContent}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Save Edits
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={enableEditing}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
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
                        onClick={saveQuiz}
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
                            Save Quiz
                          </>
                        )}
                      </button>
                      <button
                        onClick={exportQuiz}
                        className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setHistoryOpen(!historyOpen)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                    title="Quiz History"
                  >
                    <History className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => {
                      setGeneratedQuiz('');
                      setStreamingQuiz('');
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
                  >
                    Create New Quiz
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto bg-white p-6">
              {(streamingQuiz || generatedQuiz) && !isEditing && (
                <div className="mb-8">
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-700"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/90 to-blue-600/90"></div>
                    
                    <div className="relative px-8 py-8">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
                            <span className="text-white text-sm font-medium">{formData.subject}</span>
                          </div>
                          
                          <h1 className="text-3xl font-bold text-white mb-2 leading-tight">
                            {formData.numberOfQuestions}-Question Assessment
                          </h1>
                          
                          <div className="flex flex-wrap items-center gap-4 text-cyan-100">
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-cyan-200 rounded-full mr-2"></div>
                              <span className="text-sm">Grade {formData.gradeLevel}</span>
                            </div>
                            <div className="flex items-center">
                              <div className="w-2 h-2 bg-cyan-200 rounded-full mr-2"></div>
                              <span className="text-sm">{formData.questionTypes.join(', ')}</span>
                            </div>
                          </div>
                        </div>
                        
                        {loading && (
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                            <div className="flex items-center text-white">
                              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                              <div>
                                <div className="text-sm font-medium">Generating...</div>
                                <div className="text-xs text-cyan-100">AI-powered quiz</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-white/20">
                        <div className="flex items-center justify-between">
                          <div className="text-cyan-100 text-sm">
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
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-gray-700">
                        Edit your quiz:
                      </label>
                      <div className="text-sm text-gray-500">
                        {editedContent.length} characters
                      </div>
                    </div>
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-vertical"
                      placeholder="Edit your quiz content here..."
                    />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>You can format using markdown-style **bold** and *italic*</span>
                      <span>Lines will be preserved in the final output</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {formatQuizText(streamingQuiz || generatedQuiz)}
                    {loading && streamingQuiz && (
                      <span className="inline-flex items-center ml-1">
                        <span className="w-0.5 h-5 bg-cyan-500 animate-pulse rounded-full"></span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {loading && (
                <div className="mt-8 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-cyan-900 font-medium">Creating your quiz</div>
                      <div className="text-cyan-600 text-sm mt-1">Tailored for your learning outcomes</div>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-3 h-3 bg-cyan-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          // ... (keep the existing form JSX exactly as it is)
          <>
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Quiz Configuration</h2>
                <p className="text-sm text-gray-500">Configure your quiz parameters</p>
              </div>
              <button
                onClick={() => setHistoryOpen(!historyOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
                title="Quiz History"
              >
                <History className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select a subject</option>
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
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                  >
                    <option value="">Select a grade</option>
                    {grades.map(g => <option key={g} value={g}>Grade {g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Questions <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.numberOfQuestions}
                    onChange={(e) => handleInputChange('numberOfQuestions', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    min="1"
                    max="50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Learning Outcomes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.learningOutcomes}
                    onChange={(e) => handleInputChange('learningOutcomes', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="What should students know or be able to demonstrate?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Question Types <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {questionTypesOptions.map(type => (
                      <label key={type} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.questionTypes.includes(type)}
                          onChange={() => handleCheckboxChange('questionTypes', type)}
                          className="w-4 h-4 text-cyan-600 rounded"
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Cognitive Levels <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {cognitiveLevelsOptions.map(level => (
                      <label key={level} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.cognitiveLevels.includes(level)}
                          onChange={() => handleCheckboxChange('cognitiveLevels', level)}
                          className="w-4 h-4 text-cyan-600 rounded"
                        />
                        <span className="text-sm">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit per Question (in seconds, optional)
                  </label>
                  <input
                    type="number"
                    value={formData.timeLimitPerQuestion}
                    onChange={(e) => handleInputChange('timeLimitPerQuestion', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
                    placeholder="e.g., 60"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.randomizeQuestions}
                      onChange={(e) => handleInputChange('randomizeQuestions', e.target.checked)}
                      className="w-4 h-4 text-cyan-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Randomize Questions</span>
                  </label>
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
                  onClick={generateQuiz}
                  disabled={!validateForm() || loading}
                  className="flex items-center px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 disabled:bg-gray-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ListChecks className="w-5 h-5 mr-2" />
                      Generate Quiz
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
            <h3 className="text-lg font-semibold text-gray-800">Saved Quizzes</h3>
            <button
              onClick={() => setHistoryOpen(false)}
              className="p-1 rounded hover:bg-gray-200 transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
            {quizHistories.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <ListChecks className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No saved quizzes yet</p>
              </div>
            ) : (
              quizHistories.map((history) => (
                <div
                  key={history.id}
                  onClick={() => loadQuizHistory(history)}
                  className={`p-3 rounded-lg cursor-pointer transition group hover:bg-white ${
                    currentQuizId === history.id ? 'bg-white shadow-sm' : 'bg-gray-100'
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
                      onClick={(e) => deleteQuizHistory(history.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition"
                      title="Delete quiz"
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
        content={generatedQuiz}
        contentType="quiz"
        onContentUpdate={(newContent) => {
          setGeneratedQuiz(newContent);
          setEditedContent(newContent);
        }}
      />
    </div>
  );
};

export default QuizGenerator;