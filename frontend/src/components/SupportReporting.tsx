import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Search01IconData from '@hugeicons/core-free-icons/Search01Icon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import BookOpen01IconData from '@hugeicons/core-free-icons/BookOpen01Icon';
import File01IconData from '@hugeicons/core-free-icons/File01Icon';
import PenTool01IconData from '@hugeicons/core-free-icons/PenTool01Icon';
import Settings01IconData from '@hugeicons/core-free-icons/Settings01Icon';
import HelpCircleIconData from '@hugeicons/core-free-icons/HelpCircleIcon';
import BulbIconData from '@hugeicons/core-free-icons/BulbIcon';
import UserGroupIconData from '@hugeicons/core-free-icons/UserGroupIcon';
import ColorsIconData from '@hugeicons/core-free-icons/ColorsIcon';
import FolderOpenIconData from '@hugeicons/core-free-icons/FolderOpenIcon';
import Message01IconData from '@hugeicons/core-free-icons/Message01Icon';
import ThumbsUpIconData from '@hugeicons/core-free-icons/ThumbsUpIcon';
import ThumbsDownIconData from '@hugeicons/core-free-icons/ThumbsDownIcon';
import AlertCircleIconData from '@hugeicons/core-free-icons/AlertCircleIcon';
import SentIconData from '@hugeicons/core-free-icons/SentIcon';
import Loading02IconData from '@hugeicons/core-free-icons/Loading02Icon';
import CheckmarkCircle01IconData from '@hugeicons/core-free-icons/CheckmarkCircle01Icon';
import Clock01IconData from '@hugeicons/core-free-icons/Clock01Icon';
import Image01IconData from '@hugeicons/core-free-icons/Image01Icon';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import FilterIconData from '@hugeicons/core-free-icons/FilterIcon';
import ArrowUpDownIconData from '@hugeicons/core-free-icons/ArrowUpDownIcon';
import Bug01IconData from '@hugeicons/core-free-icons/Bug01Icon';
import FlashIconData from '@hugeicons/core-free-icons/FlashIcon';
import Camera01IconData from '@hugeicons/core-free-icons/Camera01Icon';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const Search: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Search01IconData} {...p} />;
const ChevronDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowDown01IconData} {...p} />;
const ChevronRight: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowRight01IconData} {...p} />;
const BookOpen: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BookOpen01IconData} {...p} />;
const FileText: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={File01IconData} {...p} />;
const PenTool: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={PenTool01IconData} {...p} />;
const Settings: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Settings01IconData} {...p} />;
const HelpCircle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={HelpCircleIconData} {...p} />;
const Lightbulb: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={BulbIconData} {...p} />;
const Users: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={UserGroupIconData} {...p} />;
const Palette: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ColorsIconData} {...p} />;
const FolderOpen: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={FolderOpenIconData} {...p} />;
const MessageSquare: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Message01IconData} {...p} />;
const ThumbsUp: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ThumbsUpIconData} {...p} />;
const ThumbsDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ThumbsDownIconData} {...p} />;
const AlertTriangle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={AlertCircleIconData} {...p} />;
const Send: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={SentIconData} {...p} />;
const Loader2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Loading02IconData} {...p} />;
const CheckCircle: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={CheckmarkCircle01IconData} {...p} />;
const Clock: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Clock01IconData} {...p} />;
const Image: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Image01IconData} {...p} />;
const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Cancel01IconData} {...p} />;
const Filter: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={FilterIconData} {...p} />;
const ArrowUpDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={ArrowUpDownIconData} {...p} />;
const Bug: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Bug01IconData} {...p} />;
const Zap: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={FlashIconData} {...p} />;
const Camera: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <Icon icon={Camera01IconData} {...p} />;
import { useSettings } from '../contexts/SettingsContext';
import SmartTextArea from './SmartTextArea';
import SmartInput from './SmartInput';
import axios from 'axios';

const METRICS_API = 'http://localhost:8000/api';

async function fetchSystemSnapshot(): Promise<SystemSnapshot | undefined> {
  try {
    const [specsRes, liveRes, histRes, modelRes] = await Promise.all([
      axios.get(`${METRICS_API}/metrics/system-specs`).catch(() => null),
      axios.get(`${METRICS_API}/metrics/live-stats`).catch(() => null),
      axios.get(`${METRICS_API}/metrics/history?type=text&limit=5`).catch(() => null),
      axios.get(`${METRICS_API}/models/active`).catch(() => null),
    ]);

    return {
      system_specs: specsRes?.data || {},
      live: liveRes?.data || {},
      recent_generations: (histRes?.data?.metrics || []).map((m: any) => ({
        model_name: m.model_name,
        task_type: m.task_type,
        tokens_per_second: m.tokens_per_second,
        ttft_ms: m.ttft_ms,
        total_time_ms: m.total_time_ms,
        timestamp: m.timestamp,
      })),
      active_model: modelRes?.data?.modelName || 'unknown',
    };
  } catch {
    return undefined;
  }
}

// ─── Types ──────────────────────────────────────────────────────────────

interface SupportReportingProps {
  tabId: string;
  savedData?: any;
  onDataChange?: (data: any) => void;
  initialScreenshot?: string | null;
}

interface FAQItem { question: string; answer: string; }
interface FAQCategory {
  id: string; title: string; icon: React.ElementType;
  color: string; description: string; items: FAQItem[];
}

interface SystemSnapshot {
  system_specs: {
    os: string;
    processor: string;
    cpu_count_logical: number;
    ram_total_gb?: number;
    ram_available_gb?: number;
  };
  live: {
    cpu_percent_system: number;
    ram_percent: number;
    ram_used_gb: number;
    ram_total_gb: number;
    app_cpu_percent: number;
    app_ram_mb: number;
  };
  recent_generations: {
    model_name: string;
    task_type: string;
    tokens_per_second: number;
    ttft_ms: number;
    total_time_ms: number;
    timestamp: string;
  }[];
  active_model: string;
}

interface Ticket {
  id: string; category: string; subject: string; description: string;
  priority: 'low' | 'medium' | 'high'; status: 'open' | 'in-review' | 'resolved';
  createdAt: string; screenshot?: string; systemSnapshot?: SystemSnapshot;
}

// ─── FAQ Data ───────────────────────────────────────────────────────────

const FAQ_DATA: FAQCategory[] = [
  {
    id: 'getting-started', title: 'Getting Started', icon: Lightbulb, color: '#f59e0b',
    description: 'Learn the basics of navigating and using the Learning Hub',
    items: [
      { question: 'How do I navigate between different tools?', answer: 'Use the sidebar on the left side of the screen. Hover over it to expand and see all available tools. Click any tool to open it in a new tab. You can have multiple tabs open at once and switch between them using the tab bar at the top.' },
      { question: 'How do I use the command palette?', answer: 'Press Ctrl+K (or Cmd+K on Mac) to open the command palette. You can search for any tool, setting, or action. Just start typing and select from the results. This is the fastest way to navigate the app.' },
      { question: 'Can I have multiple tabs open at the same time?', answer: 'Yes! Most tools support up to 3 tabs open simultaneously. For example, you can have multiple lesson plans open side by side. Some tools like Settings and My Overview are single-instance, meaning only one tab can be open at a time.' },
      { question: 'How do I use split view?', answer: 'Right-click on any tab to access the split view option. This lets you view two tabs side by side, which is great for referencing curriculum content while writing a lesson plan.' },
      { question: 'Where can I find the tutorials?', answer: 'Look for the floating help button (?) in the bottom-right corner of the screen. Click it and select the graduation cap icon to start or replay the tutorial for your current tool. Each tool has its own guided walkthrough.' },
      { question: 'How do I customize the appearance?', answer: 'Go to Settings (gear icon in the sidebar) to change themes, colors, and other display preferences. You can switch between light and dark mode, customize tab colors, and adjust various visual preferences.' },
    ]
  },
  {
    id: 'lesson-planning', title: 'Lesson Planning', icon: BookOpen, color: '#8b5cf6',
    description: 'Creating and managing lesson plans',
    items: [
      { question: 'How do I create a new lesson plan?', answer: 'Click "Lesson Plan" in the sidebar under Lesson Planners. Fill in the subject, grade level, topic, and any other details. A comprehensive lesson plan will be generated based on the OECS curriculum standards. You can then edit and customize the generated plan.' },
      { question: 'What\'s the difference between the lesson planner types?', answer: 'There are 4 types: Regular Lesson Plan (standard single-grade), Early Childhood (designed for kindergarten with play-based activities), Multi-Level (for combined/multigrade classrooms), and Integrated Lesson (cross-curricular plans that blend multiple subjects).' },
      { question: 'Can I save and edit lesson plans later?', answer: 'Yes! All generated lesson plans are automatically saved to My Resources. You can access them anytime from the Resource Manager, edit them, export as PDF, or duplicate them as templates for future lessons.' },
      { question: 'How do I link lesson plans to curriculum standards?', answer: 'When creating a lesson plan, select your subject and grade level. The system automatically maps to relevant OECS curriculum standards. You can also click "Browse Curriculum" to manually select specific learning outcomes to target.' },
      { question: 'Can I generate lesson plans for multiple weeks?', answer: 'Each lesson plan covers a single lesson/session. For weekly or term planning, create individual lesson plans for each session. Use the Progress Tracker to monitor which curriculum areas you\'ve covered over time.' },
    ]
  },
  {
    id: 'quizzes-rubrics', title: 'Quizzes & Rubrics', icon: PenTool, color: '#ec4899',
    description: 'Building assessments and grading criteria',
    items: [
      { question: 'How do I create a quiz?', answer: 'Open the Quiz Builder from the sidebar. Select your subject, grade level, and topic. Choose question types (multiple choice, true/false, short answer, etc.), set the difficulty level, and questions will be generated aligned to curriculum standards.' },
      { question: 'Can I edit the generated quiz questions?', answer: 'Absolutely! After generation, you can edit any question, change answers, adjust difficulty, add or remove questions, and reorder them. You have full control over the final quiz before saving or exporting.' },
      { question: 'How do I create a grading rubric?', answer: 'Use the Rubric Builder in the sidebar. Specify the assignment type, subject, and criteria you want to assess. A detailed rubric with performance levels and descriptors will be generated that you can customize.' },
      { question: 'Can I grade students using the quizzes?', answer: 'Yes! Go to My Classes to manage your students. After creating a quiz, you can assign grades to individual students. The system tracks quiz scores and calculates grade averages automatically.' },
      { question: 'How do I export quizzes for printing?', answer: 'After creating a quiz, look for the Export/PDF button. You can generate a print-ready version with or without answer keys. The formatting is optimized for standard paper sizes.' },
    ]
  },
  {
    id: 'curriculum', title: 'Curriculum & Standards', icon: FileText, color: '#06b6d4',
    description: 'Browsing and tracking curriculum coverage',
    items: [
      { question: 'How do I browse the OECS curriculum?', answer: 'Open the Curriculum Browser from the sidebar. Navigate by subject area, then grade level, then specific strands and topics. Each entry shows the learning outcomes and standards you need to cover.' },
      { question: 'How does the Progress Tracker work?', answer: 'The Progress Tracker automatically logs which curriculum standards you\'ve addressed through your lesson plans and assessments. It shows coverage percentages by subject, grade, and strand so you can identify gaps in your teaching.' },
      { question: 'Which subjects are covered in the curriculum?', answer: 'The OECS curriculum includes Language Arts, Mathematics, Science, Social Studies, Physical Education & Health, Visual & Performing Arts, and more. Coverage varies by grade level — check the Curriculum Browser for your specific subject and grade.' },
      { question: 'Can I search for specific learning outcomes?', answer: 'Yes! Use the search function within the Curriculum Browser or press Ctrl+K and type your search term. You can search by topic, keyword, standard code, or learning outcome text.' },
    ]
  },
  {
    id: 'resources', title: 'Resources & Files', icon: FolderOpen, color: '#10b981',
    description: 'Managing saved resources and exports',
    items: [
      { question: 'Where are my saved resources?', answer: 'All your generated content (lesson plans, quizzes, rubrics, worksheets) is saved in My Resources. Open it from the sidebar to browse, search, filter, and manage all your saved work.' },
      { question: 'How do I export resources as PDF?', answer: 'Open any resource and look for the PDF/Export button. Most resource types support PDF export with professional formatting. You can also print directly from the export view.' },
      { question: 'Can I organize resources into folders?', answer: 'Resources are automatically organized by type (Lesson Plans, Quizzes, Rubrics, etc.) and can be filtered by subject and grade level. Use the search and filter options in My Resources to find what you need quickly.' },
      { question: 'How do I delete a resource I no longer need?', answer: 'In My Resources, find the resource you want to remove. Click the delete icon (trash can) and confirm. Note: deleted resources cannot be recovered, so make sure you\'ve exported anything you want to keep.' },
    ]
  },
  {
    id: 'visual-tools', title: 'Visual Studio Tools', icon: Palette, color: '#f97316',
    description: 'Worksheets, images, and visual content',
    items: [
      { question: 'How do I create a worksheet?', answer: 'Open the Worksheet Builder from the Visual Studio section in the sidebar. Select your subject, grade, and activity type. A formatted worksheet will be generated that you can customize before exporting.' },
      { question: 'What is the Image Studio?', answer: 'The Image Studio lets you create and edit educational images and visual aids. You can generate illustrations, edit existing images, and create visual content to enhance your lessons and worksheets.' },
      { question: 'Why can\'t I see the Visual Studio tools?', answer: 'Visual Studio tools may be disabled in your settings. Go to Settings and look for the Visual Studio toggle to enable Worksheet Builder and Image Studio. These tools require the image generation service to be running.' },
    ]
  },
  {
    id: 'class-management', title: 'Class Management', icon: Users, color: '#6366f1',
    description: 'Managing students, classes, and grades',
    items: [
      { question: 'How do I add students to a class?', answer: 'Open My Classes from the sidebar. Create a new class first, then add students individually or import them from a spreadsheet (Excel/CSV). Each student can have their name, date of birth, and contact information recorded.' },
      { question: 'Can I import students from a spreadsheet?', answer: 'Yes! In My Classes, click the Import button and upload an Excel (.xlsx) or CSV file. The system will match columns to student fields. Make sure your spreadsheet has headers like "Name", "Date of Birth", etc.' },
      { question: 'How do I track student grades?', answer: 'After creating quizzes and assigning them to students, grades are tracked automatically in My Classes. You can view individual student performance, class averages, and grade distributions.' },
    ]
  },
  {
    id: 'ask-pearl', title: 'Ask PEARL', icon: MessageSquare, color: '#0ea5e9',
    description: 'Getting the most out of PEARL',
    items: [
      { question: 'What can I ask PEARL?', answer: 'PEARL can help with lesson planning ideas, explain curriculum concepts, suggest teaching strategies, help differentiate instruction, create activity ideas, and answer questions about pedagogy. Think of PEARL as a knowledgeable teaching assistant.' },
      { question: 'Does PEARL know the OECS curriculum?', answer: 'Yes! PEARL is trained on OECS curriculum standards and can reference specific learning outcomes, suggest aligned activities, and help you plan lessons that meet curriculum requirements for your subject and grade level.' },
      { question: 'Can I have multiple chat conversations?', answer: 'Yes, you can open up to 3 Ask PEARL tabs simultaneously. Each conversation is independent, so you can discuss different topics or subjects in parallel.' },
    ]
  },
  {
    id: 'technical', title: 'Technical & Account', icon: Settings, color: '#64748b',
    description: 'Settings, performance, and account issues',
    items: [
      { question: 'The app is running slowly. What can I do?', answer: 'Try closing unused tabs to free up resources. If using Visual Studio tools, they can be resource-intensive. Also check your internet connection as generation features require server communication. Clearing your browser cache can also help.' },
      { question: 'How do I change my display name or profile?', answer: 'Go to Settings from the sidebar. Under the Profile section, you can update your display name and profile picture. Changes are saved automatically.' },
      { question: 'Can I use this app offline?', answer: 'The app requires a connection to the server for features like lesson plan generation, quiz creation, and chat. However, you can browse previously saved resources and view cached curriculum content while offline.' },
      { question: 'How do I report a bug or problem?', answer: 'Use the Report Issue side of this tab to create a support ticket. You can also click the floating help button (?) and use the camera icon to take a screenshot and submit it as a ticket — this is the easiest way to report visual issues.' },
    ]
  }
];

// ─── Ticket Constants ───────────────────────────────────────────────────

const TICKET_CATEGORIES = [
  { id: 'bug', label: 'Bug Report', icon: Bug, color: '#ef4444', description: 'Something isn\'t working correctly' },
  { id: 'feature', label: 'Feature Request', icon: Lightbulb, color: '#f59e0b', description: 'Suggest a new feature or improvement' },
  { id: 'content', label: 'Content Issue', icon: FileText, color: '#8b5cf6', description: 'Incorrect or missing curriculum content' },
  { id: 'performance', label: 'Performance Issue', icon: Zap, color: '#f97316', description: 'App is slow or unresponsive' },
  { id: 'question', label: 'General Question', icon: HelpCircle, color: '#06b6d4', description: 'Need help with something' },
  { id: 'other', label: 'Other', icon: MessageSquare, color: '#64748b', description: 'Anything else' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: '#64748b', description: 'Minor issue, no rush' },
  { value: 'medium', label: 'Medium', color: '#f59e0b', description: 'Affecting my work' },
  { value: 'high', label: 'High', color: '#ef4444', description: 'Blocking my work' },
];

const STATUS_LABELS: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  'open': { label: 'Open', color: '#3b82f6', icon: Clock },
  'in-review': { label: 'In Review', color: '#f59e0b', icon: Search },
  'resolved': { label: 'Resolved', color: '#10b981', icon: CheckCircle },
};

// ─── Component ──────────────────────────────────────────────────────────

const SupportReporting: React.FC<SupportReportingProps> = ({ tabId, savedData, onDataChange, initialScreenshot }) => {
  const { settings } = useSettings();

  // Which face is showing: false = Support (front), true = Reporting (back)
  const [flipped, setFlipped] = useState<boolean>(savedData?.flipped || false);

  // ── Support state ──
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

  // ── Reporting state ──
  const [reportView, setReportView] = useState<'list' | 'create'>(savedData?.reportView || 'list');
  const [tickets, setTickets] = useState<Ticket[]>(savedData?.tickets || []);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [category, setCategory] = useState('bug');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If initialScreenshot is provided, flip to reporting and open create view
  useEffect(() => {
    if (initialScreenshot) {
      setScreenshot(initialScreenshot);
      setFlipped(true);
      setReportView('create');
      setCategory('bug');
      setDescription('(Screenshot attached — please describe what you see or what went wrong)');
    }
  }, [initialScreenshot]);

  // Persist state via useEffect instead of during render
  const persistTimer = useRef<ReturnType<typeof setTimeout>>();
  const persistState = useCallback(() => {
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(() => {
      onDataChange?.({
        flipped,
        searchQuery,
        expandedCategories: Array.from(expandedCategories),
        expandedQuestions: Array.from(expandedQuestions),
        helpfulRatings,
        reportView,
        tickets,
      });
    }, 0);
  }, [flipped, searchQuery, expandedCategories, expandedQuestions, helpfulRatings, reportView, tickets, onDataChange]);

  useEffect(() => {
    persistState();
    return () => { if (persistTimer.current) clearTimeout(persistTimer.current); };
  }, [persistState]);

  // ── Support handlers ──
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  const toggleQuestion = (questionKey: string) => {
    setExpandedQuestions(prev => {
      const next = new Set(prev);
      if (next.has(questionKey)) next.delete(questionKey);
      else next.add(questionKey);
      return next;
    });
  };

  const rateHelpful = (questionKey: string, helpful: boolean) => {
    setHelpfulRatings(prev => ({ ...prev, [questionKey]: helpful }));
  };

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

  // ── Reporting handlers ──
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setScreenshot(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!subject.trim() || !description.trim()) return;
    setSubmitting(true);

    // Fetch system snapshot in parallel with the submit delay
    const [snapshot] = await Promise.all([
      fetchSystemSnapshot(),
      new Promise(resolve => setTimeout(resolve, 800)),
    ]);

    const newTicket: Ticket = {
      id: `TK-${String(tickets.length + 1).padStart(4, '0')}`,
      category, subject: subject.trim(), description: description.trim(),
      priority, status: 'open', createdAt: new Date().toISOString(),
      screenshot: screenshot || undefined,
      systemSnapshot: snapshot,
    };
    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);
    setSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setSubject(''); setDescription(''); setPriority('medium');
      setCategory('bug'); setScreenshot(null); setReportView('list');
    }, 2000);
  };

  const handleExportTicket = (ticket: Ticket) => {
    const exportData = {
      ...ticket,
      screenshot: ticket.screenshot ? '(screenshot attached as base64)' : undefined,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${ticket.id}-${new Date(ticket.createdAt).toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredTickets = tickets
    .filter(t => filterStatus === 'all' || t.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      const order = { high: 0, medium: 1, low: 2 };
      return order[a.priority] - order[b.priority];
    });

  // ── Render ──
  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      {/* Flip Toggle Header */}
      <div
        className="px-6 py-3 flex-shrink-0 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: flipped
                ? 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(249,115,22,0.15))'
                : 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.15))',
              border: `1px solid ${flipped ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)'}`,
              transition: 'all 0.3s ease',
            }}
          >
            {flipped
              ? <AlertTriangle className="w-4.5 h-4.5" style={{ color: 'rgb(239,68,68)' }} />
              : <HelpCircle className="w-4.5 h-4.5" style={{ color: 'rgb(59,130,246)' }} />
            }
          </div>
          <div>
            <h1 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              {flipped ? 'Report Issue' : 'Support Center'}
            </h1>
            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              {flipped ? 'Submit and track support tickets' : 'Find answers to common questions'}
            </p>
          </div>
        </div>

        {/* Flip Toggle */}
        <div
          className="flex items-center rounded-xl overflow-hidden"
          style={{ border: '1px solid var(--border-primary)', background: 'var(--bg-primary)' }}
        >
          <button
            onClick={() => setFlipped(false)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all"
            style={{
              background: !flipped ? 'rgba(59,130,246,0.12)' : 'transparent',
              color: !flipped ? 'rgb(59,130,246)' : 'var(--text-muted)',
            }}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Support
          </button>
          <div style={{ width: 1, height: 20, background: 'var(--border-primary)' }} />
          <button
            onClick={() => setFlipped(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-all"
            style={{
              background: flipped ? 'rgba(239,68,68,0.12)' : 'transparent',
              color: flipped ? 'rgb(239,68,68)' : 'var(--text-muted)',
            }}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Report
          </button>
        </div>
      </div>

      {/* Card Flip Container */}
      <div className="flex-1 overflow-hidden" style={{ perspective: '2000px' }}>
        <div
          className="h-full"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.7s cubic-bezier(0.4, 0.0, 0.2, 1)',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            position: 'relative',
          }}
        >
          {/* ═══ FRONT FACE — Support ═══ */}
          <div
            className="h-full flex flex-col"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              position: flipped ? 'absolute' : 'relative',
              inset: 0,
              pointerEvents: flipped ? 'none' : 'auto',
            }}
          >
            {/* Search Bar */}
            <div className="px-6 pt-4 pb-2 flex-shrink-0">
              <div className="max-w-4xl mx-auto relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    if (e.target.value.trim()) {
                      const matching = FAQ_DATA.filter(cat =>
                        cat.items.some(item =>
                          item.question.toLowerCase().includes(e.target.value.toLowerCase()) ||
                          item.answer.toLowerCase().includes(e.target.value.toLowerCase())
                        )
                      ).map(c => c.id);
                      setExpandedCategories(new Set(matching));
                    }
                  }}
                  placeholder="Search for help... (e.g. 'lesson plan', 'export PDF', 'curriculum')"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                />
                {searchQuery && (
                  <button
                    onClick={() => { setSearchQuery(''); setExpandedCategories(new Set()); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md hover:bg-black/10"
                  >
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Clear</span>
                  </button>
                )}
              </div>
              {searchQuery && (
                <p className="text-xs mt-2 max-w-4xl mx-auto" style={{ color: 'var(--text-muted)' }}>
                  {totalResults} result{totalResults !== 1 ? 's' : ''} found
                </p>
              )}
            </div>

            {/* FAQ Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <div className="max-w-4xl mx-auto space-y-3 mt-2">
                {filteredCategories.length === 0 ? (
                  <div className="text-center py-16">
                    <HelpCircle className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                    <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>No results found for "{searchQuery}"</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Try different keywords or browse the categories</p>
                    <button
                      onClick={() => { setSearchQuery(''); setExpandedCategories(new Set()); }}
                      className="mt-3 text-xs font-medium px-4 py-1.5 rounded-lg"
                      style={{ color: 'rgb(59,130,246)', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  filteredCategories.map(cat => {
                    const Icon = cat.icon;
                    const isExp = expandedCategories.has(cat.id);
                    return (
                      <div key={cat.id} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-primary)', background: 'var(--bg-secondary)' }}>
                        <button
                          onClick={() => toggleCategory(cat.id)}
                          className="w-full flex items-center gap-3 px-4 py-3.5 text-left group transition-colors"
                          style={{ background: 'transparent' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover, rgba(0,0,0,0.03))')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${cat.color}18`, border: `1px solid ${cat.color}30` }}>
                            <Icon className="w-4 h-4" style={{ color: cat.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{cat.title}</p>
                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{cat.description} · {cat.items.length} question{cat.items.length !== 1 ? 's' : ''}</p>
                          </div>
                          {isExp
                            ? <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                            : <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                          }
                        </button>
                        {isExp && (
                          <div className="px-4 pb-3 space-y-1" style={{ borderTop: '1px solid var(--border-primary)' }}>
                            {cat.items.map((item, idx) => {
                              const qKey = `${cat.id}-${idx}`;
                              const isOpen = expandedQuestions.has(qKey);
                              const rating = helpfulRatings[qKey];
                              return (
                                <div key={idx} className="mt-1">
                                  <button
                                    onClick={() => toggleQuestion(qKey)}
                                    className="w-full flex items-start gap-2.5 px-3 py-2.5 rounded-lg text-left transition-colors"
                                    style={{ background: isOpen ? 'rgba(59,130,246,0.06)' : 'transparent' }}
                                    onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = 'var(--bg-hover, rgba(0,0,0,0.03))'; }}
                                    onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = 'transparent'; }}
                                  >
                                    <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: isOpen ? cat.color : 'var(--text-muted)' }} />
                                    <span className="text-sm font-medium flex-1" style={{ color: 'var(--text-primary)' }}>{item.question}</span>
                                    {isOpen
                                      ? <ChevronDown className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                                      : <ChevronRight className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--text-muted)' }} />
                                    }
                                  </button>
                                  {isOpen && (
                                    <div className="ml-9 mr-3 mt-1 mb-2">
                                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.answer}</p>
                                      <div className="flex items-center gap-3 mt-3">
                                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Was this helpful?</span>
                                        <button
                                          onClick={e => { e.stopPropagation(); rateHelpful(qKey, true); }}
                                          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors"
                                          style={{ background: rating === true ? 'rgba(16,185,129,0.15)' : 'transparent', color: rating === true ? '#10b981' : 'var(--text-muted)', border: `1px solid ${rating === true ? 'rgba(16,185,129,0.3)' : 'var(--border-primary)'}` }}
                                        ><ThumbsUp className="w-3 h-3" /> Yes</button>
                                        <button
                                          onClick={e => { e.stopPropagation(); rateHelpful(qKey, false); }}
                                          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors"
                                          style={{ background: rating === false ? 'rgba(239,68,68,0.15)' : 'transparent', color: rating === false ? '#ef4444' : 'var(--text-muted)', border: `1px solid ${rating === false ? 'rgba(239,68,68,0.3)' : 'var(--border-primary)'}` }}
                                        ><ThumbsDown className="w-3 h-3" /> No</button>
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

                {/* Still need help → flip to Report */}
                <div
                  className="rounded-xl p-5 mt-6 text-center cursor-pointer transition-all hover:scale-[1.01]"
                  style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.08), rgba(249,115,22,0.08))', border: '1px solid rgba(239,68,68,0.15)' }}
                  onClick={() => setFlipped(true)}
                >
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2" style={{ color: 'rgb(239,68,68)', opacity: 0.7 }} />
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Still need help?</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                    Click here to flip to the Report side and create a support ticket.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ BACK FACE — Reporting ═══ */}
          <div
            className="h-full flex flex-col"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              position: flipped ? 'relative' : 'absolute',
              inset: 0,
              pointerEvents: flipped ? 'auto' : 'none',
            }}
          >
            {/* Report sub-header */}
            <div className="px-6 py-3 flex-shrink-0 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-primary)' }}>
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {tickets.length} ticket{tickets.length !== 1 ? 's' : ''} submitted
              </span>
              <button
                onClick={() => setReportView(reportView === 'list' ? 'create' : 'list')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors"
                style={{
                  background: reportView === 'list'
                    ? 'linear-gradient(135deg, rgb(59,130,246), rgb(37,99,235))' : 'var(--bg-primary)',
                  color: reportView === 'list' ? 'white' : 'var(--text-primary)',
                  border: reportView === 'list' ? 'none' : '1px solid var(--border-primary)',
                  boxShadow: reportView === 'list' ? '0 2px 8px rgba(59,130,246,0.3)' : 'none',
                }}
              >
                {reportView === 'list' ? <><Send className="w-3.5 h-3.5" /> New Ticket</> : <><FileText className="w-3.5 h-3.5" /> View Tickets</>}
              </button>
            </div>

            {/* Report content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto">
                {submitSuccess ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(16,185,129,0.15)' }}>
                      <CheckCircle className="w-8 h-8" style={{ color: '#10b981' }} />
                    </div>
                    <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Ticket Submitted!</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Thank you for your feedback. We'll review your ticket shortly.</p>
                  </div>
                ) : reportView === 'create' ? (
                  <div className="space-y-5">
                    {/* Category */}
                    <div>
                      <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-primary)' }}>Category</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {TICKET_CATEGORIES.map(cat => {
                          const CatIcon = cat.icon;
                          const isSel = category === cat.id;
                          return (
                            <button key={cat.id} onClick={() => setCategory(cat.id)}
                              className="flex items-center gap-2.5 p-3 rounded-xl text-left transition-all"
                              style={{ background: isSel ? `${cat.color}15` : 'var(--bg-secondary)', border: `1.5px solid ${isSel ? `${cat.color}50` : 'var(--border-primary)'}`, transform: isSel ? 'scale(1.02)' : 'scale(1)' }}
                            >
                              <CatIcon className="w-4 h-4 flex-shrink-0" style={{ color: isSel ? cat.color : 'var(--text-muted)' }} />
                              <div className="min-w-0">
                                <p className="text-xs font-semibold" style={{ color: isSel ? cat.color : 'var(--text-primary)' }}>{cat.label}</p>
                                <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>{cat.description}</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {/* Subject */}
                    <div>
                      <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-primary)' }}>Subject</label>
                      <SmartInput value={subject} onChange={val => setSubject(val)}
                        placeholder="Brief summary of the issue..."
                        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}
                        maxLength={120} />
                      <p className="text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>{subject.length}/120</p>
                    </div>
                    {/* Description */}
                    <div>
                      <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-primary)' }}>Description</label>
                      <SmartTextArea value={description} onChange={val => setDescription(val)}
                        placeholder="Please describe the issue in detail. What were you trying to do? What happened instead?"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)', minHeight: '120px' }}
                        rows={5} />
                    </div>
                    {/* Priority */}
                    <div>
                      <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-primary)' }}>Priority</label>
                      <div className="flex gap-2">
                        {PRIORITY_OPTIONS.map(opt => (
                          <button key={opt.value} onClick={() => setPriority(opt.value as 'low' | 'medium' | 'high')}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                            style={{ background: priority === opt.value ? `${opt.color}18` : 'var(--bg-secondary)', border: `1.5px solid ${priority === opt.value ? `${opt.color}50` : 'var(--border-primary)'}`, color: priority === opt.value ? opt.color : 'var(--text-secondary)' }}
                          >
                            <span className="w-2 h-2 rounded-full" style={{ background: opt.color }} />{opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Screenshot */}
                    <div>
                      <label className="text-sm font-medium block mb-2" style={{ color: 'var(--text-primary)' }}>Screenshot (optional)</label>
                      {screenshot ? (
                        <div className="relative rounded-xl overflow-hidden" style={{ border: '1px solid var(--border-primary)' }}>
                          <img src={screenshot} alt="Attached screenshot" className="w-full max-h-64 object-contain" style={{ background: 'var(--bg-secondary)' }} />
                          <button onClick={() => setScreenshot(null)} className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}>
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => fileInputRef.current?.click()}
                          className="w-full flex flex-col items-center gap-2 px-4 py-6 rounded-xl transition-colors"
                          style={{ background: 'var(--bg-secondary)', border: '2px dashed var(--border-primary)' }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgb(59,130,246)')}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-primary)')}
                        >
                          <Camera className="w-6 h-6" style={{ color: 'var(--text-muted)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Click to upload a screenshot, or use the floating help button's camera option</span>
                        </button>
                      )}
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleScreenshotUpload} />
                    </div>
                    {/* Submit */}
                    <button onClick={handleSubmit} disabled={!subject.trim() || !description.trim() || submitting}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                      style={{
                        background: (!subject.trim() || !description.trim()) ? 'var(--bg-secondary)' : 'linear-gradient(135deg, rgb(59,130,246), rgb(37,99,235))',
                        color: (!subject.trim() || !description.trim()) ? 'var(--text-muted)' : 'white',
                        opacity: submitting ? 0.7 : 1,
                        boxShadow: (!subject.trim() || !description.trim()) ? 'none' : '0 4px 16px rgba(59,130,246,0.3)',
                        cursor: (!subject.trim() || !description.trim()) ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Send className="w-4 h-4" /> Submit Ticket</>}
                    </button>
                  </div>
                ) : (
                  /* Ticket List */
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Filter className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                          className="text-xs px-2 py-1.5 rounded-lg outline-none"
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}>
                          <option value="all">All Status</option>
                          <option value="open">Open</option>
                          <option value="in-review">In Review</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <ArrowUpDown className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                        <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)}
                          className="text-xs px-2 py-1.5 rounded-lg outline-none"
                          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', color: 'var(--text-primary)' }}>
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                          <option value="priority">By Priority</option>
                        </select>
                      </div>
                      <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>{filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}</span>
                    </div>
                    {filteredTickets.length === 0 ? (
                      <div className="text-center py-16">
                        <FileText className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{tickets.length === 0 ? 'No tickets yet' : 'No matching tickets'}</p>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{tickets.length === 0 ? 'Create a ticket to report issues or request features' : 'Try changing your filter settings'}</p>
                        {tickets.length === 0 && (
                          <button onClick={() => setReportView('create')} className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 rounded-xl text-sm font-medium"
                            style={{ background: 'linear-gradient(135deg, rgb(59,130,246), rgb(37,99,235))', color: 'white', boxShadow: '0 2px 8px rgba(59,130,246,0.3)' }}>
                            <Send className="w-4 h-4" /> Create Your First Ticket
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredTickets.map(ticket => {
                          const catInfo = TICKET_CATEGORIES.find(c => c.id === ticket.category);
                          const CatIcon = catInfo?.icon || MessageSquare;
                          const statusInfo = STATUS_LABELS[ticket.status];
                          const StatusIcon = statusInfo.icon;
                          const isExp = expandedTicket === ticket.id;
                          const prioInfo = PRIORITY_OPTIONS.find(p => p.value === ticket.priority);
                          return (
                            <div key={ticket.id} className="rounded-xl overflow-hidden transition-all"
                              style={{ border: `1px solid ${isExp ? (catInfo?.color || 'var(--border-primary)') + '40' : 'var(--border-primary)'}`, background: 'var(--bg-secondary)' }}>
                              <button onClick={() => setExpandedTicket(isExp ? null : ticket.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                                <CatIcon className="w-4 h-4 flex-shrink-0" style={{ color: catInfo?.color || 'var(--text-muted)' }} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{ticket.id}</span>
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: `${statusInfo.color}18`, color: statusInfo.color }}>
                                      <StatusIcon className="w-2.5 h-2.5" />{statusInfo.label}
                                    </span>
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: `${prioInfo?.color}18`, color: prioInfo?.color }}>{ticket.priority}</span>
                                    {ticket.screenshot && <Image className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />}
                                  </div>
                                  <p className="text-sm font-medium mt-0.5 truncate" style={{ color: 'var(--text-primary)' }}>{ticket.subject}</p>
                                </div>
                                <span className="text-[10px] flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                {isExp ? <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} /> : <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />}
                              </button>
                              {isExp && (
                                <div className="px-4 pb-4" style={{ borderTop: '1px solid var(--border-primary)' }}>
                                  <p className="text-sm mt-3 leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{ticket.description}</p>
                                  {ticket.screenshot && (
                                    <div className="mt-3 rounded-lg overflow-hidden" style={{ border: '1px solid var(--border-primary)' }}>
                                      <img src={ticket.screenshot} alt="Ticket screenshot" className="w-full max-h-80 object-contain" style={{ background: 'var(--bg-primary)' }} />
                                    </div>
                                  )}

                                  {/* System Snapshot */}
                                  {ticket.systemSnapshot && (
                                    <div className="mt-3 rounded-lg p-3" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-primary)' }}>
                                      <p className="text-[10px] font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>System Diagnostics</p>
                                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                                        {ticket.systemSnapshot.system_specs?.os && (
                                          <div>
                                            <span style={{ color: 'var(--text-muted)' }}>OS: </span>
                                            <span style={{ color: 'var(--text-primary)' }}>{ticket.systemSnapshot.system_specs.os}</span>
                                          </div>
                                        )}
                                        {ticket.systemSnapshot.system_specs?.processor && (
                                          <div className="col-span-2 sm:col-span-1">
                                            <span style={{ color: 'var(--text-muted)' }}>CPU: </span>
                                            <span style={{ color: 'var(--text-primary)' }}>{ticket.systemSnapshot.system_specs.processor}</span>
                                          </div>
                                        )}
                                        {ticket.systemSnapshot.system_specs?.ram_total_gb && (
                                          <div>
                                            <span style={{ color: 'var(--text-muted)' }}>RAM: </span>
                                            <span style={{ color: 'var(--text-primary)' }}>{ticket.systemSnapshot.system_specs.ram_total_gb} GB</span>
                                          </div>
                                        )}
                                        {ticket.systemSnapshot.live && (
                                          <>
                                            <div>
                                              <span style={{ color: 'var(--text-muted)' }}>CPU Usage: </span>
                                              <span style={{ color: 'var(--text-primary)' }}>{ticket.systemSnapshot.live.cpu_percent_system?.toFixed(1)}%</span>
                                            </div>
                                            <div>
                                              <span style={{ color: 'var(--text-muted)' }}>RAM Usage: </span>
                                              <span style={{ color: 'var(--text-primary)' }}>{ticket.systemSnapshot.live.ram_used_gb?.toFixed(1)} / {ticket.systemSnapshot.live.ram_total_gb?.toFixed(1)} GB</span>
                                            </div>
                                            <div>
                                              <span style={{ color: 'var(--text-muted)' }}>App RAM: </span>
                                              <span style={{ color: 'var(--text-primary)' }}>{(ticket.systemSnapshot.live.app_ram_mb / 1024).toFixed(2)} GB</span>
                                            </div>
                                          </>
                                        )}
                                        {ticket.systemSnapshot.active_model && (
                                          <div className="col-span-2 sm:col-span-3">
                                            <span style={{ color: 'var(--text-muted)' }}>Model: </span>
                                            <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{ticket.systemSnapshot.active_model}</span>
                                          </div>
                                        )}
                                      </div>
                                      {ticket.systemSnapshot.recent_generations?.length > 0 && (
                                        <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--border-primary)' }}>
                                          <p className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Recent Performance</p>
                                          <div className="space-y-1">
                                            {ticket.systemSnapshot.recent_generations.map((gen, gi) => (
                                              <div key={gi} className="flex items-center gap-3 text-xs font-mono">
                                                <span style={{ color: 'var(--text-muted)' }}>{gen.task_type}</span>
                                                <span style={{ color: '#22c55e' }}>{gen.tokens_per_second} tok/s</span>
                                                <span style={{ color: 'var(--text-muted)' }}>TTFT {gen.ttft_ms < 1000 ? `${Math.round(gen.ttft_ms)}ms` : `${(gen.ttft_ms / 1000).toFixed(1)}s`}</span>
                                                <span style={{ color: 'var(--text-muted)' }}>Total {gen.total_time_ms < 1000 ? `${Math.round(gen.total_time_ms)}ms` : `${(gen.total_time_ms / 1000).toFixed(1)}s`}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                                    <span>Category: {catInfo?.label}</span>
                                    <span>Priority: {ticket.priority}</span>
                                    <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleExportTicket(ticket); }}
                                      className="ml-auto flex items-center gap-1 px-2 py-1 rounded-md transition-colors"
                                      style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-primary)', color: 'var(--text-secondary)' }}
                                    >
                                      <FileText className="w-3 h-3" /> Export
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
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportReporting;
