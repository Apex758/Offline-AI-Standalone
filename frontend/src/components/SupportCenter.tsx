import React, { useState } from 'react';
import {
  Search, ChevronDown, ChevronRight, BookOpen, Monitor,
  FileText, PenTool, BarChart2, Settings, HelpCircle,
  Lightbulb, Users, Palette, FolderOpen, MessageSquare,
  ExternalLink, ThumbsUp, ThumbsDown
} from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

interface SupportCenterProps {
  tabId: string;
  savedData?: any;
  onDataChange?: (data: any) => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  description: string;
  items: FAQItem[];
}

const FAQ_DATA: FAQCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: Lightbulb,
    color: '#f59e0b',
    description: 'Learn the basics of navigating and using the Learning Hub',
    items: [
      {
        question: 'How do I navigate between different tools?',
        answer: 'Use the sidebar on the left side of the screen. Hover over it to expand and see all available tools. Click any tool to open it in a new tab. You can have multiple tabs open at once and switch between them using the tab bar at the top.'
      },
      {
        question: 'How do I use the command palette?',
        answer: 'Press Ctrl+K (or Cmd+K on Mac) to open the command palette. You can search for any tool, setting, or action. Just start typing and select from the results. This is the fastest way to navigate the app.'
      },
      {
        question: 'Can I have multiple tabs open at the same time?',
        answer: 'Yes! Most tools support up to 3 tabs open simultaneously. For example, you can have multiple lesson plans open side by side. Some tools like Settings and My Overview are single-instance, meaning only one tab can be open at a time.'
      },
      {
        question: 'How do I use split view?',
        answer: 'Right-click on any tab to access the split view option. This lets you view two tabs side by side, which is great for referencing curriculum content while writing a lesson plan.'
      },
      {
        question: 'Where can I find the tutorials?',
        answer: 'Look for the floating help button (?) in the bottom-right corner of the screen. Click it and select the graduation cap icon to start or replay the tutorial for your current tool. Each tool has its own guided walkthrough.'
      },
      {
        question: 'How do I customize the appearance?',
        answer: 'Go to Settings (gear icon in the sidebar) to change themes, colors, and other display preferences. You can switch between light and dark mode, customize tab colors, and adjust various visual preferences.'
      }
    ]
  },
  {
    id: 'lesson-planning',
    title: 'Lesson Planning',
    icon: BookOpen,
    color: '#8b5cf6',
    description: 'Creating and managing lesson plans',
    items: [
      {
        question: 'How do I create a new lesson plan?',
        answer: 'Click "Lesson Plan" in the sidebar under Lesson Planners. Fill in the subject, grade level, topic, and any other details. The AI will generate a comprehensive lesson plan based on the OECS curriculum standards. You can then edit and customize the generated plan.'
      },
      {
        question: 'What\'s the difference between the lesson planner types?',
        answer: 'There are 4 types: Regular Lesson Plan (standard single-grade), Early Childhood (designed for kindergarten with play-based activities), Multi-Level (for combined/multigrade classrooms), and Integrated Lesson (cross-curricular plans that blend multiple subjects).'
      },
      {
        question: 'Can I save and edit lesson plans later?',
        answer: 'Yes! All generated lesson plans are automatically saved to My Resources. You can access them anytime from the Resource Manager, edit them, export as PDF, or duplicate them as templates for future lessons.'
      },
      {
        question: 'How do I link lesson plans to curriculum standards?',
        answer: 'When creating a lesson plan, select your subject and grade level. The system automatically maps to relevant OECS curriculum standards. You can also click "Browse Curriculum" to manually select specific learning outcomes to target.'
      },
      {
        question: 'Can I generate lesson plans for multiple weeks?',
        answer: 'Each lesson plan covers a single lesson/session. For weekly or term planning, create individual lesson plans for each session. Use the Progress Tracker to monitor which curriculum areas you\'ve covered over time.'
      }
    ]
  },
  {
    id: 'quizzes-rubrics',
    title: 'Quizzes & Rubrics',
    icon: PenTool,
    color: '#ec4899',
    description: 'Building assessments and grading criteria',
    items: [
      {
        question: 'How do I create a quiz?',
        answer: 'Open the Quiz Builder from the sidebar. Select your subject, grade level, and topic. Choose question types (multiple choice, true/false, short answer, etc.), set the difficulty level, and the AI will generate questions aligned to curriculum standards.'
      },
      {
        question: 'Can I edit the generated quiz questions?',
        answer: 'Absolutely! After generation, you can edit any question, change answers, adjust difficulty, add or remove questions, and reorder them. You have full control over the final quiz before saving or exporting.'
      },
      {
        question: 'How do I create a grading rubric?',
        answer: 'Use the Rubric Builder in the sidebar. Specify the assignment type, subject, and criteria you want to assess. The AI generates a detailed rubric with performance levels and descriptors that you can customize.'
      },
      {
        question: 'Can I grade students using the quizzes?',
        answer: 'Yes! Go to My Classes to manage your students. After creating a quiz, you can assign grades to individual students. The system tracks quiz scores and calculates grade averages automatically.'
      },
      {
        question: 'How do I export quizzes for printing?',
        answer: 'After creating a quiz, look for the Export/PDF button. You can generate a print-ready version with or without answer keys. The formatting is optimized for standard paper sizes.'
      }
    ]
  },
  {
    id: 'curriculum',
    title: 'Curriculum & Standards',
    icon: FileText,
    color: '#06b6d4',
    description: 'Browsing and tracking curriculum coverage',
    items: [
      {
        question: 'How do I browse the OECS curriculum?',
        answer: 'Open the Curriculum Browser from the sidebar. Navigate by subject area, then grade level, then specific strands and topics. Each entry shows the learning outcomes and standards you need to cover.'
      },
      {
        question: 'How does the Progress Tracker work?',
        answer: 'The Progress Tracker automatically logs which curriculum standards you\'ve addressed through your lesson plans and assessments. It shows coverage percentages by subject, grade, and strand so you can identify gaps in your teaching.'
      },
      {
        question: 'Which subjects are covered in the curriculum?',
        answer: 'The OECS curriculum includes Language Arts, Mathematics, Science, Social Studies, Physical Education & Health, Visual & Performing Arts, and more. Coverage varies by grade level — check the Curriculum Browser for your specific subject and grade.'
      },
      {
        question: 'Can I search for specific learning outcomes?',
        answer: 'Yes! Use the search function within the Curriculum Browser or press Ctrl+K and type your search term. You can search by topic, keyword, standard code, or learning outcome text.'
      }
    ]
  },
  {
    id: 'resources',
    title: 'Resources & Files',
    icon: FolderOpen,
    color: '#10b981',
    description: 'Managing saved resources and exports',
    items: [
      {
        question: 'Where are my saved resources?',
        answer: 'All your generated content (lesson plans, quizzes, rubrics, worksheets) is saved in My Resources. Open it from the sidebar to browse, search, filter, and manage all your saved work.'
      },
      {
        question: 'How do I export resources as PDF?',
        answer: 'Open any resource and look for the PDF/Export button. Most resource types support PDF export with professional formatting. You can also print directly from the export view.'
      },
      {
        question: 'Can I organize resources into folders?',
        answer: 'Resources are automatically organized by type (Lesson Plans, Quizzes, Rubrics, etc.) and can be filtered by subject and grade level. Use the search and filter options in My Resources to find what you need quickly.'
      },
      {
        question: 'How do I delete a resource I no longer need?',
        answer: 'In My Resources, find the resource you want to remove. Click the delete icon (trash can) and confirm. Note: deleted resources cannot be recovered, so make sure you\'ve exported anything you want to keep.'
      }
    ]
  },
  {
    id: 'visual-tools',
    title: 'Visual Studio Tools',
    icon: Palette,
    color: '#f97316',
    description: 'Worksheets, images, and visual content',
    items: [
      {
        question: 'How do I create a worksheet?',
        answer: 'Open the Worksheet Builder from the Visual Studio section in the sidebar. Select your subject, grade, and activity type. The AI generates a formatted worksheet that you can customize before exporting.'
      },
      {
        question: 'What is the Image Studio?',
        answer: 'The Image Studio lets you create and edit educational images and visual aids. You can generate illustrations, edit existing images, and create visual content to enhance your lessons and worksheets.'
      },
      {
        question: 'Why can\'t I see the Visual Studio tools?',
        answer: 'Visual Studio tools may be disabled in your settings. Go to Settings and look for the Visual Studio toggle to enable Worksheet Builder and Image Studio. These tools require the image generation service to be running.'
      }
    ]
  },
  {
    id: 'class-management',
    title: 'Class Management',
    icon: Users,
    color: '#6366f1',
    description: 'Managing students, classes, and grades',
    items: [
      {
        question: 'How do I add students to a class?',
        answer: 'Open My Classes from the sidebar. Create a new class first, then add students individually or import them from a spreadsheet (Excel/CSV). Each student can have their name, date of birth, and contact information recorded.'
      },
      {
        question: 'Can I import students from a spreadsheet?',
        answer: 'Yes! In My Classes, click the Import button and upload an Excel (.xlsx) or CSV file. The system will match columns to student fields. Make sure your spreadsheet has headers like "Name", "Date of Birth", etc.'
      },
      {
        question: 'How do I track student grades?',
        answer: 'After creating quizzes and assigning them to students, grades are tracked automatically in My Classes. You can view individual student performance, class averages, and grade distributions.'
      }
    ]
  },
  {
    id: 'ask-pearl',
    title: 'Ask PEARL (AI Chat)',
    icon: MessageSquare,
    color: '#0ea5e9',
    description: 'Using the AI assistant effectively',
    items: [
      {
        question: 'What can I ask PEARL?',
        answer: 'PEARL can help with lesson planning ideas, explain curriculum concepts, suggest teaching strategies, help differentiate instruction, create activity ideas, and answer questions about pedagogy. Think of PEARL as a knowledgeable teaching assistant.'
      },
      {
        question: 'Does PEARL know the OECS curriculum?',
        answer: 'Yes! PEARL is trained on OECS curriculum standards and can reference specific learning outcomes, suggest aligned activities, and help you plan lessons that meet curriculum requirements for your subject and grade level.'
      },
      {
        question: 'Can I have multiple chat conversations?',
        answer: 'Yes, you can open up to 3 Ask PEARL tabs simultaneously. Each conversation is independent, so you can discuss different topics or subjects in parallel.'
      }
    ]
  },
  {
    id: 'technical',
    title: 'Technical & Account',
    icon: Settings,
    color: '#64748b',
    description: 'Settings, performance, and account issues',
    items: [
      {
        question: 'The app is running slowly. What can I do?',
        answer: 'Try closing unused tabs to free up resources. If using Visual Studio tools, they can be resource-intensive. Also check your internet connection as AI features require server communication. Clearing your browser cache can also help.'
      },
      {
        question: 'How do I change my display name or profile?',
        answer: 'Go to Settings from the sidebar. Under the Profile section, you can update your display name and profile picture. Changes are saved automatically.'
      },
      {
        question: 'Can I use this app offline?',
        answer: 'The app requires an internet connection for AI-powered features like lesson plan generation, quiz creation, and chat. However, you can browse previously saved resources and view cached curriculum content while offline.'
      },
      {
        question: 'How do I report a bug or problem?',
        answer: 'Use the Reporting tab in the sidebar to create a support ticket. You can also click the floating help button (?) and use the camera icon to take a screenshot and submit it as a ticket — this is the easiest way to report visual issues.'
      }
    ]
  }
];

const SupportCenter: React.FC<SupportCenterProps> = ({ tabId, savedData, onDataChange }) => {
  const { settings } = useSettings();
  const [searchQuery, setSearchQuery] = useState(savedData?.searchQuery || '');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(savedData?.expandedCategories || [])
  );
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set(savedData?.expandedQuestions || [])
  );
  const [helpfulRatings, setHelpfulRatings] = useState<Record<string, boolean>>(
    savedData?.helpfulRatings || {}
  );

  const saveState = (updates: Record<string, any>) => {
    const newData = {
      searchQuery,
      expandedCategories: Array.from(expandedCategories),
      expandedQuestions: Array.from(expandedQuestions),
      helpfulRatings,
      ...updates
    };
    onDataChange?.(newData);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      saveState({ expandedCategories: Array.from(next) });
      return next;
    });
  };

  const toggleQuestion = (questionKey: string) => {
    setExpandedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(questionKey)) next.delete(questionKey);
      else next.add(questionKey);
      saveState({ expandedQuestions: Array.from(next) });
      return next;
    });
  };

  const rateHelpful = (questionKey: string, helpful: boolean) => {
    setHelpfulRatings(prev => {
      const next = { ...prev, [questionKey]: helpful };
      saveState({ helpfulRatings: next });
      return next;
    });
  };

  // Filter FAQ items based on search
  const filteredCategories = searchQuery.trim()
    ? FAQ_DATA.map(cat => ({
        ...cat,
        items: cat.items.filter(
          item =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.items.length > 0)
    : FAQ_DATA;

  const totalResults = filteredCategories.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div
        className="px-6 py-5 flex-shrink-0"
        style={{
          borderBottom: '1px solid var(--border-primary)',
          background: 'var(--bg-secondary)'
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))',
                border: '1px solid rgba(59,130,246,0.2)'
              }}
            >
              <HelpCircle className="w-5 h-5" style={{ color: 'rgb(59,130,246)' }} />
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Support Center
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Find answers to common questions about using the Learning Hub
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                saveState({ searchQuery: e.target.value });
                // Auto-expand matching categories when searching
                if (e.target.value.trim()) {
                  const matching = FAQ_DATA.filter(cat =>
                    cat.items.some(
                      item =>
                        item.question.toLowerCase().includes(e.target.value.toLowerCase()) ||
                        item.answer.toLowerCase().includes(e.target.value.toLowerCase())
                    )
                  ).map(c => c.id);
                  setExpandedCategories(new Set(matching));
                }
              }}
              placeholder="Search for help... (e.g. 'lesson plan', 'export PDF', 'curriculum')"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  saveState({ searchQuery: '' });
                  setExpandedCategories(new Set());
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-black/10"
              >
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Clear</span>
              </button>
            )}
          </div>
          {searchQuery && (
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              {totalResults} result{totalResults !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
      </div>

      {/* FAQ Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-3">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-16">
              <HelpCircle className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                No results found for "{searchQuery}"
              </p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Try different keywords or browse the categories below
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  saveState({ searchQuery: '' });
                  setExpandedCategories(new Set());
                }}
                className="mt-3 text-xs font-medium px-4 py-1.5 rounded-lg"
                style={{
                  color: 'rgb(59,130,246)',
                  background: 'rgba(59,130,246,0.1)',
                  border: '1px solid rgba(59,130,246,0.2)'
                }}
              >
                Clear search
              </button>
            </div>
          ) : (
            filteredCategories.map(category => {
              const Icon = category.icon;
              const isExpanded = expandedCategories.has(category.id);

              return (
                <div
                  key={category.id}
                  className="rounded-xl overflow-hidden"
                  style={{
                    border: '1px solid var(--border-primary)',
                    background: 'var(--bg-secondary)'
                  }}
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-left group transition-colors"
                    style={{ background: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover, rgba(0,0,0,0.03))')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${category.color}18`,
                        border: `1px solid ${category.color}30`
                      }}
                    >
                      <Icon className="w-4 h-4" style={{ color: category.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {category.title}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {category.description} · {category.items.length} question{category.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                    ) : (
                      <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                    )}
                  </button>

                  {/* Questions */}
                  {isExpanded && (
                    <div
                      className="px-4 pb-3 space-y-1"
                      style={{ borderTop: '1px solid var(--border-primary)' }}
                    >
                      {category.items.map((item, idx) => {
                        const qKey = `${category.id}-${idx}`;
                        const isOpen = expandedQuestions.has(qKey);
                        const rating = helpfulRatings[qKey];

                        return (
                          <div key={idx} className="mt-1">
                            <button
                              onClick={() => toggleQuestion(qKey)}
                              className="w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors"
                              style={{ background: isOpen ? 'rgba(59,130,246,0.06)' : 'transparent' }}
                              onMouseEnter={e => {
                                if (!isOpen) e.currentTarget.style.background = 'var(--bg-hover, rgba(0,0,0,0.03))';
                              }}
                              onMouseLeave={e => {
                                if (!isOpen) e.currentTarget.style.background = 'transparent';
                              }}
                            >
                              <HelpCircle
                                className="w-4 h-4 flex-shrink-0 mt-0.5"
                                style={{ color: isOpen ? category.color : 'var(--text-muted)' }}
                              />
                              <span
                                className="text-sm font-medium flex-1"
                                style={{ color: 'var(--text-primary)' }}
                              >
                                {item.question}
                              </span>
                              {isOpen ? (
                                <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                              ) : (
                                <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                              )}
                            </button>

                            {isOpen && (
                              <div className="ml-9 mr-3 mt-1 mb-2">
                                <p
                                  className="text-sm leading-relaxed"
                                  style={{ color: 'var(--text-secondary)' }}
                                >
                                  {item.answer}
                                </p>
                                {/* Helpful rating */}
                                <div className="flex items-center gap-3 mt-3">
                                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                    Was this helpful?
                                  </span>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); rateHelpful(qKey, true); }}
                                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors"
                                    style={{
                                      background: rating === true ? 'rgba(16,185,129,0.15)' : 'transparent',
                                      color: rating === true ? '#10b981' : 'var(--text-muted)',
                                      border: `1px solid ${rating === true ? 'rgba(16,185,129,0.3)' : 'var(--border-primary)'}`,
                                    }}
                                  >
                                    <ThumbsUp className="w-3 h-3" /> Yes
                                  </button>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); rateHelpful(qKey, false); }}
                                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors"
                                    style={{
                                      background: rating === false ? 'rgba(239,68,68,0.15)' : 'transparent',
                                      color: rating === false ? '#ef4444' : 'var(--text-muted)',
                                      border: `1px solid ${rating === false ? 'rgba(239,68,68,0.3)' : 'var(--border-primary)'}`,
                                    }}
                                  >
                                    <ThumbsDown className="w-3 h-3" /> No
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Still need help callout */}
          <div
            className="rounded-xl p-5 mt-6 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))',
              border: '1px solid rgba(59,130,246,0.15)'
            }}
          >
            <MessageSquare className="w-8 h-8 mx-auto mb-2" style={{ color: 'rgb(59,130,246)', opacity: 0.7 }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Still need help?
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
              If you can't find your answer here, create a support ticket in the Reporting tab
              or use the screenshot button in the floating help menu to report an issue.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportCenter;
