                    import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import SentIconData from '@hugeicons/core-free-icons/SentIcon';
import Clock01IconData from '@hugeicons/core-free-icons/Clock01Icon';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import Delete02IconData from '@hugeicons/core-free-icons/Delete02Icon';
import PlusSignIconData from '@hugeicons/core-free-icons/PlusSignIcon';
import Mic01IconData from '@hugeicons/core-free-icons/Mic01Icon';
import MicOff01IconData from '@hugeicons/core-free-icons/MicOff01Icon';
import VolumeHighIconData from '@hugeicons/core-free-icons/VolumeHighIcon';
import VolumeOffIconData from '@hugeicons/core-free-icons/VolumeOffIcon';
import FolderOpenIconData from '@hugeicons/core-free-icons/FolderOpenIcon';
import Search01IconData from '@hugeicons/core-free-icons/Search01Icon';
import ArrowRight01IconData from '@hugeicons/core-free-icons/ArrowRight01Icon';
import ArrowDown01IconData from '@hugeicons/core-free-icons/ArrowDown01Icon';
import File01IconData from '@hugeicons/core-free-icons/File01Icon';
import Attachment01IconData from '@hugeicons/core-free-icons/Attachment01Icon';
import LinkSquare01IconData from '@hugeicons/core-free-icons/LinkSquare01Icon';
import ViewSidebarRightIconData from '@hugeicons/core-free-icons/ViewSidebarRightIcon';
import Tick02IconData from '@hugeicons/core-free-icons/Tick02Icon';
import Image01IconData from '@hugeicons/core-free-icons/Image01Icon';
import Upload01IconData from '@hugeicons/core-free-icons/Upload01Icon';
import ReloadIconData from '@hugeicons/core-free-icons/ReloadIcon';
import BrainIconData from '@hugeicons/core-free-icons/BrainIcon';
import ComputerIconData from '@hugeicons/core-free-icons/ComputerIcon';
import Layers01IconData from '@hugeicons/core-free-icons/Layers01Icon';
import BookBookmark01IconData from '@hugeicons/core-free-icons/BookBookmark01Icon';
import CheckListIconData from '@hugeicons/core-free-icons/CheckListIcon';
import FileSpreadsheetIconData from '@hugeicons/core-free-icons/FileSpreadsheetIcon';
import GraduationScrollIconData from '@hugeicons/core-free-icons/GraduationScrollIcon';
import EyeIconData from '@hugeicons/core-free-icons/EyeIcon';

const IconW: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const Send: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={SentIconData} {...p} />;
const History: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Clock01IconData} {...p} />;
const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Cancel01IconData} {...p} />;
const Trash2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Delete02IconData} {...p} />;
const Plus: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={PlusSignIconData} {...p} />;
const Mic: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Mic01IconData} {...p} />;
const MicOff: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={MicOff01IconData} {...p} />;
const Volume2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={VolumeHighIconData} {...p} />;
const VolumeX: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={VolumeOffIconData} {...p} />;
const FolderOpen: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={FolderOpenIconData} {...p} />;
const SearchIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Search01IconData} {...p} />;
const ChevronRight: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={ArrowRight01IconData} {...p} />;
const ChevronDown: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={ArrowDown01IconData} {...p} />;
const FileIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={File01IconData} {...p} />;
const AttachIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Attachment01IconData} {...p} />;
const LinkIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={LinkSquare01IconData} {...p} />;
const SidebarIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={ViewSidebarRightIconData} {...p} />;
const CheckIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Tick02IconData} {...p} />;
const ImageIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Image01IconData} {...p} />;
const UploadIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Upload01IconData} {...p} />;
const RefreshIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={ReloadIconData} {...p} />;
const BrainIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={BrainIconData} {...p} />;
const ComputerIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={ComputerIconData} {...p} />;
const LayersIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Layers01IconData} {...p} />;
const BookMarkIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={BookBookmark01IconData} {...p} />;
const CheckListIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={CheckListIconData} {...p} />;
const SpreadsheetIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={FileSpreadsheetIconData} {...p} />;
const GraduationIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={GraduationScrollIconData} {...p} />;
const EyeIcon: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={EyeIconData} {...p} />;
import { Message, FileOperationPlan } from '../types';
import axios from 'axios';
import { useWebSocket } from '../contexts/WebSocketContext';
import { HeartbeatLoader } from './ui/HeartbeatLoader';
import { useTTS, useSTT } from '../hooks/useVoice';
import SmartTextArea from './SmartTextArea';
import { useSettings } from '../contexts/SettingsContext';
import FilePreviewModal from './FilePreviewModal';
import { useCapabilities } from '../contexts/CapabilitiesContext';
import { getTeacherGrades, getTeacherSubjects, GRADE_LABEL_MAP, GRADE_LEVELS } from '../data/teacherConstants';
import curriculumIndex from '../data/curriculumIndex.json';

// ── File API abstraction (works in Electron & dev/browser) ──
const fileAPI = {
  isElectron: !!(window as any).electronAPI,
  async getAllowedFolders(): Promise<string[]> {
    const api = (window as any).electronAPI;
    if (api?.getAllowedFolders) return api.getAllowedFolders();
    const res = await axios.get('http://localhost:8000/api/file-explorer/allowed-folders');
    return res.data.folders || [];
  },
  async browseFolder(folderPath: string): Promise<{ items: FileEntry[] }> {
    const api = (window as any).electronAPI;
    if (api?.browseFolder) return api.browseFolder(folderPath);
    const res = await axios.get('http://localhost:8000/api/file-explorer/browse', { params: { folderPath } });
    return res.data;
  },
  async searchFiles(query: string): Promise<{ items: FileEntry[] }> {
    const api = (window as any).electronAPI;
    if (api?.searchFiles) return api.searchFiles(query);
    const res = await axios.get('http://localhost:8000/api/file-explorer/search', { params: { query } });
    return res.data;
  },
  async readFileContent(filePath: string): Promise<{ base64: string; error?: string }> {
    const api = (window as any).electronAPI;
    if (api?.readFileContent) return api.readFileContent(filePath);
    const res = await axios.get('http://localhost:8000/api/file-explorer/read-file', { params: { filePath } });
    return res.data;
  },
};

interface ChatProps {
  tabId: string;
  savedData?: {
    messages?: Message[];
  };
  onDataChange: (data: { messages: Message[]; streamingMessage: string }) => void;
  onTitleChange?: (title: string) => void;
  onPanelClick?: () => void;
  onOpenCurriculumTab?: (route: string) => void;
  isActive?: boolean;
}

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
}

interface AttachedFile {
  name: string;
  path: string;
  extension: string;
  previewText: string;
  fullContent: string;
  isImage?: boolean;
  base64Data?: string;
  isDirectory?: boolean;
  fileCount?: number;
  fileSummary?: string;
}

type RightPanel = 'none' | 'history' | 'files';
type FilesTab = 'on-pc' | 'in-app' | 'curriculum';

interface InAppResource {
  id: string;
  title: string;
  timestamp: string;
  type: string;
  generatedPlan?: string;
  generatedQuiz?: string;
  generatedRubric?: string;
}

// ── Thinking Block Component (collapsible reasoning display) ──
const ThinkingBlock: React.FC<{ content: string; isStreaming?: boolean }> = ({ content, isStreaming }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mb-3 border border-purple-200 dark:border-purple-800 rounded-lg overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition"
      >
        {isStreaming ? (
          <span className="w-3.5 h-3.5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
        ) : expanded ? (
          <ChevronDown className="w-3.5 h-3.5" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5" />
        )}
        <BrainIcon className="w-3.5 h-3.5" />
        {isStreaming ? 'Reasoning...' : expanded ? 'Hide reasoning' : 'View reasoning'}
      </button>
      {(expanded || isStreaming) && (
        <div className="px-3 py-2 text-xs text-theme-muted bg-purple-50/50 dark:bg-purple-900/20 border-t border-purple-200 dark:border-purple-800 whitespace-pre-wrap max-h-64 overflow-y-auto">
          {content}
          {isStreaming && <span className="inline-block w-1.5 h-3 bg-purple-500 ml-0.5 animate-pulse" />}
        </div>
      )}
    </div>
  );
};

// ── Smart thinking suggestion patterns ──
const THINKING_PATTERNS = [
  /\b(explain|analyze|compare|contrast|evaluate|prove|derive)\b/i,
  /\b(calculate|solve|compute|simplify)\b/i,
  /\b(debug|fix|refactor|optimize|review)\b.*\b(code|bug|error|issue)\b/i,
  /\b(why|how does|what if|step[- ]by[- ]step)\b/i,
  /\b(write|create|build|implement)\b.*\b(code|function|class|program|algorithm)\b/i,
  /\b(math|equation|algorithm|logic|theorem|proof)\b/i,
];

const shouldSuggestThinking = (message: string): boolean => {
  return THINKING_PATTERNS.some(pattern => pattern.test(message));
};

const Chat: React.FC<ChatProps> = ({ tabId, savedData, onDataChange, onTitleChange, onPanelClick, onOpenCurriculumTab }) => {
  // DEBUG logging removed to prevent render storm spam
  // LocalStorage key for this chat tab
  const LOCAL_STORAGE_KEY = `chat_state_${tabId}`;
  const [messages, setMessages] = useState<Message[]>(savedData?.messages || []);
  const [input, setInput] = useState('');
  const [rightPanel, setRightPanel] = useState<RightPanel>('none');
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [titleSet, setTitleSet] = useState(false);
  const [generatingTitle, setGeneratingTitle] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

  // Files panel state
  const [filesTab, setFilesTab] = useState<FilesTab>('on-pc');
  const { settings, updateSettings } = useSettings();
  const { hasVision, supportsThinking } = useCapabilities();
  const [allowedFolders, setAllowedFolders] = useState<string[]>([]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [folderContents, setFolderContents] = useState<Record<string, FileEntry[]>>({});
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [fileSearchResults, setFileSearchResults] = useState<FileEntry[] | null>(null);
  const [loadingFolder, setLoadingFolder] = useState<string | null>(null);
  const [refreshingFiles, setRefreshingFiles] = useState(false);
  const [attachingFile, setAttachingFile] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<{ path: string; name: string; extension: string } | null>(null);
  const fileSearchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Resizable right panel
  const [panelWidth, setPanelWidth] = useState(320);
  const isResizing = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      e.preventDefault();
      const containerRight = document.body.clientWidth;
      const newWidth = Math.min(Math.max(containerRight - e.clientX, 260), 700);
      setPanelWidth(newWidth);
    };
    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // In-App resources state
  const [inAppResources, setInAppResources] = useState<InAppResource[]>([]);
  const [inAppLoading, setInAppLoading] = useState(false);
  const [inAppSearch, setInAppSearch] = useState('');
  const [inAppFilter, setInAppFilter] = useState('all');

  // Curriculum tab state
  const [expandedCurriculumNodes, setExpandedCurriculumNodes] = useState<Set<string>>(new Set());

  // Drag-and-drop state
  const [isDragOver, setIsDragOver] = useState(false);
  const [pendingDropFiles, setPendingDropFiles] = useState<string[]>([]);
  const cancelledDropFiles = useRef<Set<string>>(new Set());
  const dragCounter = useRef(0);

  // Thinking indicator (shown between send and first token)
  const [waitingForResponse, setWaitingForResponse] = useState(false);

  // Smart thinking suggestion
  const [showThinkingSuggestion, setShowThinkingSuggestion] = useState(false);

  // Auto-resize textarea to fit content (up to 10 lines, ~220px)
  useEffect(() => {
    const ta = chatTextareaRef.current;
    if (!ta) {
      // Find the textarea via data attribute as fallback
      const el = document.querySelector('[data-tutorial="chat-input"]') as HTMLTextAreaElement | null;
      if (el) chatTextareaRef.current = el;
    }
    const textarea = chatTextareaRef.current;
    if (textarea) {
      textarea.style.height = '28px'; // reset to min
      textarea.style.height = Math.min(textarea.scrollHeight, 220) + 'px';
    }
  }, [input]);

  // File operation two-pass state
  const [pendingPlan, setPendingPlan] = useState<FileOperationPlan | null>(null);
  const [executingPlan, setExecutingPlan] = useState(false);
  const [undoLog, setUndoLog] = useState<Array<{ from: string; to: string; file: string }> | null>(null);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  // TTS & STT
  const tts = useTTS();
  const stt = useSTT(
    // onResult — final transcript replaces input and auto-sends
    (finalText) => {
      setInput(finalText);
    },
    // onInterim — live preview in input
    (interimText) => {
      setInput(interimText);
    }
  );

  // Track which message TTS is speaking
  const handleToggleTTS = (msgId: string, content: string) => {
    if (speakingMessageId === msgId && tts.isSpeaking) {
      tts.stop();
      setSpeakingMessageId(null);
    } else {
      tts.speak(content);
      setSpeakingMessageId(msgId);
    }
  };

  // Reset speaking state when TTS stops
  useEffect(() => {
    if (!tts.isSpeaking) {
      setSpeakingMessageId(null);
    }
  }, [tts.isSpeaking]);


  // Auto-dismiss thinking suggestion after 10 seconds
  useEffect(() => {
    if (showThinkingSuggestion) {
      const timer = setTimeout(() => setShowThinkingSuggestion(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [showThinkingSuggestion]);

  // WebSocketContext API
  const ENDPOINT = '/ws/chat';
  const { getConnection, getStreamingContent, getIsStreaming, getCustomData, clearStreaming, subscribe } = useWebSocket();

  // Streaming state from context
  const streamingMessage = getStreamingContent(tabId, ENDPOINT);
  const loading = getIsStreaming(tabId, ENDPOINT);

  // DEBUG: Log streaming and loading state
  useEffect(() => {
    console.log('[Chat] streamingMessage updated:', streamingMessage);
    // Clear thinking indicator when first token arrives
    if (streamingMessage) setWaitingForResponse(false);
  }, [streamingMessage]);
  useEffect(() => {
    console.log('[Chat] loading state updated:', loading);
    // Also clear if loading changes to false (error/done without tokens)
    if (!loading) setWaitingForResponse(false);
  }, [loading]);


  // Restore chat state from localStorage on mount or tabId change
  useEffect(() => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setMessages(parsed.messages || []);
        // setStreamingMessage(parsed.streamingMessage || '');
        setCurrentChatId(parsed.currentChatId || null);
        setTitleSet(parsed.titleSet || false);
        setInput(parsed.input || '');
        if (onTitleChange && parsed.title) {
          onTitleChange(parsed.title);
        }
      } catch (e) {
        // fallback to default if parse fails
        setMessages([]);
        // setStreamingMessage('');
        setCurrentChatId(null);
        setTitleSet(false);
        setInput('');
        if (onTitleChange) {
          onTitleChange('Ask PEARL');
        }
      }
    } else {
      setMessages([]);
      // setStreamingMessage('');
      setCurrentChatId(null);
      setTitleSet(false);
      setInput('');
      if (onTitleChange) {
        onTitleChange('Ask PEARL');
      }
    }
  }, [tabId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  // Save chat state to localStorage on every relevant state update
  useEffect(() => {
    const stateToSave = {
      messages,
      streamingMessage,
      currentChatId,
      titleSet,
      input,
      title: messages.length > 0 && messages[0].role === 'user'
        ? (messages[0].content.length > 30 ? messages[0].content.substring(0, 30) + '...' : messages[0].content)
        : 'Ask PEARL'
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [messages, streamingMessage, currentChatId, titleSet, input]);

  useEffect(() => {
    onDataChange({ messages, streamingMessage });
  }, [messages, streamingMessage]);

  useEffect(() => {
    loadChatHistories();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      autoSaveCurrentChat();
    }
  }, [messages]);

  const loadChatHistories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/chat-history');
      setChatHistories(response.data);
    } catch (error) {
      console.error('Failed to load chat histories:', error);
    }
  };

  const autoSaveCurrentChat = async () => {
    if (messages.length === 0) return;

    try {
      // Get the current title from the first user message for fallback
      const fallbackTitle = messages[0]?.content.substring(0, 50) || 'New Chat';
      
      const chatData = {
        id: currentChatId || `chat_${Date.now()}`,
        title: fallbackTitle,
        timestamp: new Date().toISOString(),
        messages: messages
      };

      if (!currentChatId) {
        setCurrentChatId(chatData.id);
      }

      await axios.post('http://localhost:8000/api/chat-history', chatData);
      await loadChatHistories();
    } catch (error) {
      console.error('Failed to save chat:', error);
    }
  };

  const loadChatHistory = (history: ChatHistory) => {
    setMessages(history.messages);
    setCurrentChatId(history.id);
    setRightPanel('none');

    if (onTitleChange) {
      const title = history.title.length > 30 ? history.title.substring(0, 30) + '...' : history.title;
      onTitleChange(title);
      setTitleSet(true);
    }
  };

  const createFallbackTitle = (message: string): string => {
    const cleaned = message.trim().replace(/\s+/g, ' ');
    if (cleaned.length <= 60) return cleaned;
    
    const truncated = cleaned.substring(0, 57);
    const lastSpace = truncated.lastIndexOf(' ');
    return (lastSpace > 30 ? truncated.substring(0, lastSpace) : truncated) + '...';
  };

  const generateAndSetTitle = async (userMessage: string, assistantMessage: string) => {
    if (!onTitleChange || titleSet) return;
    
    setGeneratingTitle(true);
    
    try {
      const response = await axios.post(
        'http://localhost:8000/api/generate-title',
        {
          user_message: userMessage,
          assistant_message: assistantMessage
        },
        { timeout: 6000 }
      );
      
      if (response.data && response.data.title) {
        onTitleChange(response.data.title);
        setTitleSet(true);
      } else {
        // Use fallback if response doesn't contain title
        const fallbackTitle = createFallbackTitle(userMessage);
        onTitleChange(fallbackTitle);
        setTitleSet(true);
      }
    } catch (error) {
      console.error('Failed to generate title:', error);
      // Use fallback title on error
      const fallbackTitle = createFallbackTitle(userMessage);
      onTitleChange(fallbackTitle);
      setTitleSet(true);
    } finally {
      setGeneratingTitle(false);
    }
  };

  const deleteHistory = async (historyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:8000/api/chat-history/${historyId}`);
      await loadChatHistories();
      
      if (currentChatId === historyId) {
        startNewChat();
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    // setStreamingMessage('');
    setRightPanel('none');
    setTitleSet(false);
    setInput('');
    // Clear localStorage for this chat tab
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    if (onTitleChange) {
      onTitleChange('Ask PEARL');
    }
  };

  // Setup WebSocket connection via context
  useEffect(() => {
    getConnection(tabId, ENDPOINT);
  }, [tabId]);

  // Subscribe to streaming updates for re-render
  useEffect(() => {
    const unsubscribe = subscribe(tabId, ENDPOINT, () => {
      // Re-render on streaming updates
    });
    return unsubscribe;
  }, [tabId, subscribe, getCustomData]);

  // Finalization logic for streaming message
  useEffect(() => {
    if (streamingMessage && !loading && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        const finalMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: streamingMessage,
          timestamp: new Date().toISOString()
        };
        console.log('[Chat] Finalizing streaming message:', finalMessage);
        setMessages(prev => [...prev, finalMessage]);
        clearStreaming(tabId, ENDPOINT);

        if (!titleSet && messages.length === 1) {
          generateAndSetTitle(messages[0].content, streamingMessage);
        }
      }
    }
  }, [streamingMessage, loading, messages]);

  // ── File Operation Two-Pass Helpers ──

  const FILE_OP_PATTERNS = [
    /\b(organize|clean\s*up|sort|tidy|arrange)\b.*\b(folder|directory|downloads|desktop|files)\b/i,
    /\b(folder|directory|downloads|desktop)\b.*\b(organize|clean\s*up|sort|tidy|arrange)\b/i,
    /\b(move|group|categorize|separate)\b.*\b(files|documents|folder)\b/i,
  ];

  const APPROVAL_PATTERNS = [
    /^(yes|yeah|yep|sure|ok|okay|go\s*ahead|do\s*it|proceed|approve|confirm|execute|looks?\s*good|perfect|that'?s?\s*(good|fine|great))/i,
  ];

  const UNDO_PATTERN = /\b(undo|revert|reverse|put\s*(them|it|files)?\s*back)\b/i;

  const detectFileOperationIntent = (text: string): boolean => {
    return FILE_OP_PATTERNS.some(p => p.test(text));
  };

  const detectApproval = (text: string): boolean => {
    return APPROVAL_PATTERNS.some(p => p.test(text.trim()));
  };

  const detectUndo = (text: string): boolean => {
    return UNDO_PATTERN.test(text);
  };

  const handleFileOrganize = async (userText: string) => {
    setGeneratingPlan(true);
    try {
      // Use attached folder first, then fall back to expanded folder
      const attachedFolder = attachedFiles.find(f => f.isDirectory);
      const targetFolder = attachedFolder?.path || [...expandedFolders][0] || allowedFolders[0];
      if (!targetFolder) {
        const errMsg: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'I don\'t have access to any folders yet. Please open the Files panel and make sure you have folders configured in Settings > File Access.',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errMsg]);
        return;
      }

      // Get file listing from the folder
      const result = await fileAPI.browseFolder(targetFolder);
      if (!result?.items || result.items.length === 0) {
        const errMsg: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: `The folder "${targetFolder.split(/[/\\]/).pop()}" appears to be empty. No files to organize.`,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, errMsg]);
        return;
      }

      // Filter to only files (not directories)
      const files = result.items.filter((item: FileEntry) => !item.isDirectory);
      const folderName = targetFolder.split(/[/\\]/).filter(Boolean).pop() || 'folder';

      // Call the organize endpoint
      const response = await axios.post('http://localhost:8000/api/file-explorer/organize', {
        files: files.map((f: FileEntry) => ({
          name: f.name,
          extension: f.extension,
          size: f.size,
          modifiedTime: f.modifiedTime,
        })),
        folder_name: folderName,
        instruction: userText,
      });

      const plan: FileOperationPlan = {
        ...response.data,
        folderPath: targetFolder,
        status: 'pending',
      };

      setPendingPlan(plan);

      // Build a readable plan message
      const folderSummary = plan.folders_to_create.map(folder => {
        const filesInFolder = plan.moves.filter(m => m.to === folder);
        return `**${folder}/** (${filesInFolder.length} file${filesInFolder.length !== 1 ? 's' : ''})\n${filesInFolder.map(f => `  - ${f.file}`).join('\n')}`;
      }).join('\n\n');

      const planMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Here's my plan to organize your **${folderName}** folder:\n\n${folderSummary}\n\nWould you like me to proceed? You can also ask me to change anything before I execute.`,
        timestamp: new Date().toISOString(),
        filePlan: plan,
      };
      setMessages(prev => [...prev, planMessage]);

    } catch (error: any) {
      const errMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Sorry, I couldn't generate an organization plan: ${error.response?.data?.error || error.message}`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setGeneratingPlan(false);
    }
  };

  const executePlan = async (plan: FileOperationPlan) => {
    setExecutingPlan(true);
    try {
      const basePath = plan.folderPath!;

      const response = await axios.post('http://localhost:8000/api/file-explorer/execute-organize', {
        folderPath: basePath,
        folders_to_create: plan.folders_to_create,
        moves: plan.moves,
      });

      const result = response.data;
      const successCount = result.summary?.success || 0;
      const failedCount = result.summary?.failed || 0;

      // Save undo log
      if (result.undoLog?.length > 0) {
        setUndoLog(result.undoLog);
      }

      // Update plan status
      setPendingPlan(null);

      // Build result summary
      const folderCounts = plan.folders_to_create.map(folder => {
        const count = plan.moves.filter(m => m.to === folder).length;
        return `**${folder}/** — ${count} file${count !== 1 ? 's' : ''}`;
      }).join('\n');

      const resultMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Done! Moved ${successCount} file${successCount !== 1 ? 's' : ''} into ${plan.folders_to_create.length} folder${plan.folders_to_create.length !== 1 ? 's' : ''}.${failedCount > 0 ? ` (${failedCount} failed)` : ''}\n\n${folderCounts}\n\nIf you want to undo this, just say "undo".`,
        timestamp: new Date().toISOString(),
        filePlan: { ...plan, status: 'executed', result: { success: successCount, failed: failedCount } },
      };
      setMessages(prev => [...prev, resultMessage]);

      // Refresh folder contents if the files panel is open
      if (expandedFolders.has(basePath)) {
        try {
          const refreshResult = await fileAPI.browseFolder(basePath);
          if (refreshResult?.items) {
            setFolderContents(prev => ({ ...prev, [basePath]: refreshResult.items }));
          }
        } catch {}
      }

    } catch (error: any) {
      const errMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Error executing the organization plan: ${error.response?.data?.error || error.message}. Your files have not been moved.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setExecutingPlan(false);
    }
  };

  const handleUndo = async () => {
    if (!undoLog || undoLog.length === 0) {
      const msg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'There\'s nothing to undo right now.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, msg]);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/file-explorer/undo-organize', {
        undoLog,
      });

      const successCount = response.data.results?.filter((r: any) => r.success).length || 0;

      setUndoLog(null);

      const msg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Undo complete! Moved ${successCount} file${successCount !== 1 ? 's' : ''} back to their original locations.`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, msg]);

    } catch (error: any) {
      const errMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Error undoing the operation: ${error.response?.data?.error || error.message}`,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errMsg]);
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading || generatingPlan || executingPlan) return;

    const text = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      ...(attachedFiles.length > 0 ? {
        attachments: attachedFiles.map(f => ({
          name: f.name,
          extension: f.extension,
          isImage: f.isImage,
        })),
      } : {}),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Smart thinking suggestion
    if (supportsThinking && !settings.thinkingEnabled && shouldSuggestThinking(text)) {
      setShowThinkingSuggestion(true);
    }

    // ── Two-pass file operation interception ──

    // 1. Check for undo request
    if (detectUndo(text) && undoLog && undoLog.length > 0) {
      handleUndo();
      return;
    }

    // 2. Check for approval of a pending plan
    if (pendingPlan && pendingPlan.status === 'pending' && detectApproval(text)) {
      executePlan(pendingPlan);
      return;
    }

    // 3. Check for rejection of a pending plan
    if (pendingPlan && pendingPlan.status === 'pending' && /^(no|nah|cancel|stop|don'?t|nevermind|never\s*mind)/i.test(text)) {
      setPendingPlan(null);
      const rejectMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'No problem! The organization plan has been cancelled. Your files remain unchanged.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, rejectMsg]);
      return;
    }

    // 4. Check for new file operation intent (when files panel is open, file access enabled, or folder attached)
    const hasFolderAttached = attachedFiles.some(f => f.isDirectory);
    if ((settings.fileAccessEnabled || hasFolderAttached) && detectFileOperationIntent(text)) {
      handleFileOrganize(text);
      // Clear folder attachment after triggering organize
      if (hasFolderAttached) {
        setAttachedFiles(prev => prev.filter(f => !f.isDirectory));
      }
      return;
    }

    // ── Normal chat flow ──

    // Build teacher profile context if filtering is enabled
    let profileContext = '';
    if (settings.profile.filterContentByProfile) {
      const mapping = settings.profile.gradeSubjects || {};
      const teacherGrades = getTeacherGrades(mapping);
      const teacherSubjects = getTeacherSubjects(mapping);
      if (teacherGrades.length > 0 || teacherSubjects.length > 0) {
        const gradeLabels = teacherGrades.map(g => GRADE_LABEL_MAP[g] || g).join(', ');
        const subjectList = teacherSubjects.join(', ');
        profileContext = `\n\nTeacher Profile: This teacher teaches ${gradeLabels}. Subjects: ${subjectList}. Tailor all responses to be grade-appropriate and relevant to these subjects.`;
      }
    }

    // Build payload with optional file references
    const mapping = settings.profile.gradeSubjects || {};
    const payload: any = {
      message: text,
      chat_id: currentChatId,
      thinking_enabled: settings.thinkingEnabled && supportsThinking,
      ...(profileContext ? {
        profile_context: profileContext,
        profile_grades: getTeacherGrades(mapping),
        profile_subjects: getTeacherSubjects(mapping),
      } : {}),
    };
    const fileAttachments = attachedFiles.filter(f => !f.isDirectory);
    if (fileAttachments.length > 0) {
      payload.reference_files = fileAttachments
        .filter(f => !f.path.startsWith('resource:') && !f.path.startsWith('curriculum:'))
        .map(f => ({
          name: f.name,
          content: f.fullContent,
          ...(f.isImage ? { is_image: true, base64: f.base64Data } : {}),
        }));
      // Include resource and curriculum attachments as additional context
      const contextAttachments = fileAttachments.filter(f => f.path.startsWith('resource:') || f.path.startsWith('curriculum:'));
      if (contextAttachments.length > 0) {
        payload.context_files = contextAttachments.map(f => ({
          name: f.name,
          content: f.fullContent,
          type: f.path.startsWith('resource:') ? 'resource' : 'curriculum',
        }));
      }
      // Clean up empty arrays
      if (payload.reference_files.length === 0) delete payload.reference_files;
    }

    // Show thinking indicator
    setWaitingForResponse(true);

    // Send via WebSocket (with auto-retry on closed connection)
    const sendMessage = (retriesLeft: number = 1) => {
      const ws = getConnection(tabId, ENDPOINT);
      const message = JSON.stringify(payload);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
      } else if (ws.readyState === WebSocket.CONNECTING) {
        const onOpen = () => {
          ws.send(message);
          ws.removeEventListener('open', onOpen);
          ws.removeEventListener('error', onError);
        };
        const onError = () => {
          ws.removeEventListener('open', onOpen);
          ws.removeEventListener('error', onError);
          if (retriesLeft > 0) {
            console.log('[Chat] WebSocket failed, retrying...');
            setTimeout(() => sendMessage(retriesLeft - 1), 500);
          } else {
            console.error('[Chat] WebSocket failed to connect, message not sent');
            setWaitingForResponse(false);
          }
        };
        ws.addEventListener('open', onOpen);
        ws.addEventListener('error', onError);
      } else {
        if (retriesLeft > 0) {
          console.log('[Chat] WebSocket closed, reconnecting...');
          setTimeout(() => sendMessage(retriesLeft - 1), 500);
        } else {
          console.error('[Chat] WebSocket is closed, message not sent');
          setWaitingForResponse(false);
        }
      }
    };
    sendMessage();

    // Clear attached files after sending
    if (attachedFiles.length > 0) {
      setAttachedFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── File Explorer helpers ──

  // Load allowed folders when files panel opens
  useEffect(() => {
    if (rightPanel === 'files') {
      fileAPI.getAllowedFolders().then((folders: string[]) => setAllowedFolders(folders)).catch(() => {});
    }
  }, [rightPanel]);

  const toggleFolder = async (folderPath: string) => {
    const next = new Set(expandedFolders);
    if (next.has(folderPath)) {
      next.delete(folderPath);
    } else {
      next.add(folderPath);
      // Lazy-load contents if not cached
      if (!folderContents[folderPath]) {
        setLoadingFolder(folderPath);
        try {
          const result = await fileAPI.browseFolder(folderPath);
          if (result?.items) {
            setFolderContents(prev => ({ ...prev, [folderPath]: result.items }));
          }
        } catch (err) {
          console.error('Error browsing folder:', err);
        }
        setLoadingFolder(null);
      }
    }
    setExpandedFolders(next);
  };

  const handleFileSearch = (query: string) => {
    setFileSearchQuery(query);
    if (fileSearchTimeout.current) clearTimeout(fileSearchTimeout.current);
    if (!query.trim()) {
      setFileSearchResults(null);
      return;
    }
    fileSearchTimeout.current = setTimeout(async () => {
      try {
        const result = await fileAPI.searchFiles(query);
        if (result?.items) setFileSearchResults(result.items);
      } catch (err) {
        console.error('Error searching files:', err);
      }
    }, 300);
  };

  // ── In-App resources loading ──
  const loadInAppResources = useCallback(async () => {
    setInAppLoading(true);
    try {
      const [lessonPlans, quizzes, worksheets, rubrics, kindergarten, multigrade, crossCurricular, images, presentations] = await Promise.all([
        axios.get('http://localhost:8000/api/lesson-plan-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/quiz-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/worksheet-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/rubric-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/kindergarten-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/multigrade-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/cross-curricular-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/images-history').catch(() => ({ data: [] })),
        axios.get('http://localhost:8000/api/presentation-history').catch(() => ({ data: [] }))
      ]);
      const all: InAppResource[] = [
        ...lessonPlans.data.map((r: any) => ({ ...r, type: 'lesson' })),
        ...quizzes.data.map((r: any) => ({ ...r, type: 'quiz' })),
        ...worksheets.data.map((r: any) => ({ ...r, type: 'worksheet' })),
        ...rubrics.data.map((r: any) => ({ ...r, type: 'rubric' })),
        ...kindergarten.data.map((r: any) => ({ ...r, type: 'kindergarten' })),
        ...multigrade.data.map((r: any) => ({ ...r, type: 'multigrade' })),
        ...crossCurricular.data.map((r: any) => ({ ...r, type: 'cross-curricular' })),
        ...images.data.map((r: any) => ({ ...r, type: 'images' })),
        ...presentations.data.map((r: any) => ({ ...r, type: 'presentation' }))
      ];
      setInAppResources(all);
    } catch (err) {
      console.error('Failed to load in-app resources:', err);
    } finally {
      setInAppLoading(false);
    }
  }, []);

  // Load resources when switching to in-app tab
  useEffect(() => {
    if (filesTab === 'in-app' && inAppResources.length === 0 && !inAppLoading) {
      loadInAppResources();
    }
  }, [filesTab]);

  // ── Curriculum tree helpers ──
  interface CurriculumStrandNode {
    id: string;
    displayName: string;
    route: string;
    strand: string;
    essentialOutcomes: { id: string; text: string }[];
    specificOutcomes: { id: string; text: string; eloRef?: string }[];
  }
  interface CurriculumSubjectNode {
    subjectKey: string;
    subjectLabel: string;
    strands: CurriculumStrandNode[];
  }
  interface CurriculumGradeNode {
    gradeValue: string;
    gradeLabel: string;
    subjects: CurriculumSubjectNode[];
  }

  const getFilteredCurriculumTree = useCallback((): CurriculumGradeNode[] => {
    const pages = (curriculumIndex as any).indexedPages as any[];
    if (!pages) return [];

    const mapping = settings.profile.gradeSubjects || {};
    const teacherGrades = getTeacherGrades(mapping);
    const teacherSubjects = getTeacherSubjects(mapping);
    const filterEnabled = settings.profile.filterContentByProfile;

    // Filter pages by teacher profile
    const filtered = pages.filter(page => {
      if (!page.grade || !page.subject) return false;
      if (filterEnabled && teacherGrades.length > 0 && !teacherGrades.includes(page.grade)) return false;
      if (filterEnabled && teacherSubjects.length > 0 && !teacherSubjects.includes(page.subject)) return false;
      return true;
    });

    // Group: grade -> subject -> strands
    const gradeMap = new Map<string, Map<string, CurriculumStrandNode[]>>();
    for (const page of filtered) {
      if (!gradeMap.has(page.grade)) gradeMap.set(page.grade, new Map());
      const subjectMap = gradeMap.get(page.grade)!;
      if (!subjectMap.has(page.subject)) subjectMap.set(page.subject, []);
      subjectMap.get(page.subject)!.push({
        id: page.id,
        displayName: page.displayName,
        route: page.route,
        strand: page.strand,
        essentialOutcomes: (page.essentialOutcomes || []).map((e: any) =>
          typeof e === 'string' ? { id: '', text: e } : { id: e.id || '', text: e.text || '' }
        ),
        specificOutcomes: (page.specificOutcomes || []).map((s: any) =>
          typeof s === 'string' ? { id: '', text: s } : { id: s.id || '', text: s.text || '', eloRef: s.eloRef }
        ),
      });
    }

    // Sort grades by GRADE_LEVELS order
    const gradeOrder = GRADE_LEVELS.map(g => g.value);
    const result: CurriculumGradeNode[] = [];
    for (const gradeValue of gradeOrder) {
      const subjectMap = gradeMap.get(gradeValue);
      if (!subjectMap) continue;
      const subjects: CurriculumSubjectNode[] = [];
      for (const [subjectLabel, strands] of subjectMap) {
        subjects.push({
          subjectKey: subjectLabel.toLowerCase().replace(/\s+/g, '-'),
          subjectLabel,
          strands: strands.sort((a, b) => a.displayName.localeCompare(b.displayName)),
        });
      }
      subjects.sort((a, b) => a.subjectLabel.localeCompare(b.subjectLabel));
      result.push({
        gradeValue,
        gradeLabel: GRADE_LABEL_MAP[gradeValue] || `Grade ${gradeValue}`,
        subjects,
      });
    }

    return result;
  }, [settings.profile.gradeSubjects, settings.profile.filterContentByProfile]);

  const buildCurriculumContext = (strand: CurriculumStrandNode, gradeLabel: string, subjectLabel: string): string => {
    let content = `Curriculum: ${strand.displayName}\nGrade: ${gradeLabel}\nSubject: ${subjectLabel}\nStrand: ${strand.strand}\n`;
    if (strand.essentialOutcomes.length > 0) {
      content += `\nEssential Learning Outcomes:\n`;
      for (const elo of strand.essentialOutcomes) {
        content += `- [${elo.id}] ${elo.text}\n`;
      }
    }
    if (strand.specificOutcomes.length > 0) {
      content += `\nSpecific Curriculum Outcomes:\n`;
      for (const sco of strand.specificOutcomes) {
        content += `- [${sco.id}] ${sco.text}${sco.eloRef ? ` (ELO: ${sco.eloRef})` : ''}\n`;
      }
    }
    return content;
  };

  const toggleCurriculumNode = (nodeId: string) => {
    setExpandedCurriculumNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  };

  // ── Resource type helpers for In App tab ──
  const RESOURCE_TYPE_MAP: Record<string, { label: string; color: string }> = {
    'lesson': { label: 'Lesson', color: 'text-blue-600' },
    'quiz': { label: 'Quiz', color: 'text-green-600' },
    'worksheet': { label: 'Worksheet', color: 'text-purple-600' },
    'rubric': { label: 'Rubric', color: 'text-orange-600' },
    'kindergarten': { label: 'Kindergarten', color: 'text-pink-600' },
    'multigrade': { label: 'Multigrade', color: 'text-teal-600' },
    'cross-curricular': { label: 'Cross-Curr.', color: 'text-indigo-600' },
    'images': { label: 'Image', color: 'text-rose-600' },
    'presentation': { label: 'Presentation', color: 'text-cyan-600' },
  };

  const getResourceContent = (r: InAppResource): string => {
    return r.generatedPlan || r.generatedQuiz || r.generatedRubric || r.title || '';
  };

  const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'];

  const toggleFileAttach = async (filePath: string, fileName: string, ext: string) => {
    // If already attached, detach it (toggle off)
    if (attachedFiles.some(f => f.path === filePath)) {
      setAttachedFiles(prev => prev.filter(f => f.path !== filePath));
      return;
    }
    // Otherwise attach (toggle on)
    setAttachingFile(filePath);
    try {
      const fileData = await fileAPI.readFileContent(filePath);
      if (fileData?.error) {
        console.error('Error reading file:', fileData.error);
        setAttachingFile(null);
        return;
      }

      const isImage = IMAGE_EXTENSIONS.includes(ext.toLowerCase());

      if (isImage && !hasVision) {
        // Vision not available — block image attachment
        setAttachingFile(null);
        return;
      }

      if (isImage) {
        // For images: keep raw base64 for vision model
        setAttachedFiles(prev => [...prev, {
          name: fileName,
          path: filePath,
          extension: ext,
          previewText: `[Image: ${fileName}]`,
          fullContent: '',
          isImage: true,
          base64Data: fileData.base64,
        }]);
      } else {
        // For documents: parse to text
        const formData = new FormData();
        const bytes = Uint8Array.from(atob(fileData.base64), c => c.charCodeAt(0));
        const blob = new Blob([bytes]);
        formData.append('file', blob, fileName);
        const response = await axios.post('http://localhost:8000/api/file-explorer/parse', formData);
        const parsed = response.data;
        setAttachedFiles(prev => [...prev, {
          name: fileName,
          path: filePath,
          extension: ext,
          previewText: (parsed.text || '').substring(0, 200) + ((parsed.text?.length || 0) > 200 ? '...' : ''),
          fullContent: parsed.text || '',
        }]);
      }
    } catch (err) {
      console.error('Error attaching file:', err);
    }
    setAttachingFile(null);
  };

  const detachFile = (filePath: string) => {
    setAttachedFiles(prev => prev.filter(f => f.path !== filePath));
  };

  // Drag-and-drop file handling
  const handleDroppedFiles = useCallback(async (files: FileList) => {
    const fileArr = Array.from(files);
    const names = fileArr.map(f => f.name).filter(
      name => !attachedFiles.some(a => a.path === `drop://${name}`)
    );
    if (names.length === 0) return;
    setPendingDropFiles(prev => [...prev, ...names]);

    for (const file of fileArr) {
      const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
      const syntheticPath = `drop://${file.name}`;

      if (attachedFiles.some(f => f.path === syntheticPath)) continue;
      if (cancelledDropFiles.current.has(file.name)) {
        cancelledDropFiles.current.delete(file.name);
        continue;
      }

      try {
        const isImage = IMAGE_EXTENSIONS.includes(ext);

        if (isImage && !hasVision) {
          // Vision not available — skip image attachment
          setPendingDropFiles(prev => prev.filter(n => n !== file.name));
          continue;
        }

        if (isImage) {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          if (cancelledDropFiles.current.has(file.name)) {
            cancelledDropFiles.current.delete(file.name);
            continue;
          }
          setAttachedFiles(prev => [...prev, {
            name: file.name,
            path: syntheticPath,
            extension: ext,
            previewText: `[Image: ${file.name}]`,
            fullContent: '',
            isImage: true,
            base64Data: base64,
          }]);
        } else {
          const formData = new FormData();
          formData.append('file', file, file.name);
          const response = await axios.post('http://localhost:8000/api/file-explorer/parse', formData);
          if (cancelledDropFiles.current.has(file.name)) {
            cancelledDropFiles.current.delete(file.name);
            continue;
          }
          const parsed = response.data;
          setAttachedFiles(prev => [...prev, {
            name: file.name,
            path: syntheticPath,
            extension: ext,
            previewText: (parsed.text || '').substring(0, 200) + ((parsed.text?.length || 0) > 200 ? '...' : ''),
            fullContent: parsed.text || '',
          }]);
        }
      } catch (err) {
        console.error('Error attaching dropped file:', err);
      }
      setPendingDropFiles(prev => prev.filter(n => n !== file.name));
    }
  }, [attachedFiles, hasVision]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    dragCounter.current++; setIsDragOver(true);
  }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragOver(false);
  }, []);
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setIsDragOver(false); dragCounter.current = 0;
    if (e.dataTransfer.files.length > 0) handleDroppedFiles(e.dataTransfer.files);
  }, [handleDroppedFiles]);

  // Toggle all files in a folder on/off
  const toggleFolderAttach = async (folderPath: string) => {
    // If already attached as folder, detach
    if (attachedFiles.some(f => f.path === folderPath && f.isDirectory)) {
      setAttachedFiles(prev => prev.filter(f => f.path !== folderPath));
      return;
    }

    // Ensure folder contents are loaded
    let items = folderContents[folderPath];
    if (!items) {
      try {
        const result = await fileAPI.browseFolder(folderPath);
        if (result?.items) {
          items = result.items;
          setFolderContents(prev => ({ ...prev, [folderPath]: items! }));
        }
      } catch (err) {
        console.error('Error browsing folder:', err);
        return;
      }
    }
    if (!items) return;

    const files = items.filter(i => !i.isDirectory);
    if (files.length === 0) return;

    // Build summary by extension
    const extCounts: Record<string, number> = {};
    for (const f of files) {
      const ext = (f.extension || 'other').replace('.', '').toLowerCase();
      extCounts[ext] = (extCounts[ext] || 0) + 1;
    }
    const summary = Object.entries(extCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([ext, count]) => `${count} .${ext}`)
      .join(', ');

    const folderName = folderPath.split(/[/\\]/).filter(Boolean).pop() || 'folder';

    // Attach as single folder item — no file reading or parsing
    setAttachedFiles(prev => [...prev, {
      name: folderName,
      path: folderPath,
      extension: '',
      previewText: `Folder: ${files.length} files (${summary})`,
      fullContent: '',
      isDirectory: true,
      fileCount: files.length,
      fileSummary: summary,
    }]);
  };

  const openFileExternally = async (filePath: string) => {
    const api = (window as any).electronAPI;
    if (api?.openFileExternal) {
      await api.openFileExternal(filePath);
    }
    // In dev mode, double-click to open is not supported
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileTypeColor = (ext: string): string => {
    const colors: Record<string, string> = {
      '.docx': 'text-blue-600', '.doc': 'text-blue-600',
      '.pptx': 'text-orange-500', '.ppt': 'text-orange-500',
      '.xlsx': 'text-green-600', '.xls': 'text-green-600', '.csv': 'text-green-600',
      '.pdf': 'text-red-500',
      '.txt': 'text-gray-500', '.md': 'text-gray-500',
      '.png': 'text-purple-500', '.jpg': 'text-purple-500', '.jpeg': 'text-purple-500',
    };
    return colors[ext] || 'text-gray-400';
  };

  const getFileTypeLabel = (ext: string): string => {
    const labels: Record<string, string> = {
      '.docx': 'Word', '.doc': 'Word',
      '.pptx': 'PPT', '.ppt': 'PPT',
      '.xlsx': 'Excel', '.xls': 'Excel', '.csv': 'CSV',
      '.pdf': 'PDF', '.txt': 'Text', '.md': 'Markdown',
    };
    return labels[ext] || ext.replace('.', '').toUpperCase();
  };

  const formatMessage = (content: string, role?: string, isStreaming?: boolean) => {
    let cleaned = content;
    let thinkingContent = '';

    // Extract <think>...</think> blocks from assistant messages
    if (role !== 'user') {
      const thinkMatch = cleaned.match(/<think>([\s\S]*?)<\/think>/);
      if (thinkMatch) {
        thinkingContent = thinkMatch[1].trim();
        cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/, '').trim();
      } else if (isStreaming && cleaned.includes('<think>') && !cleaned.includes('</think>')) {
        // Still streaming the thinking block — extract partial content
        const thinkStart = cleaned.indexOf('<think>');
        thinkingContent = cleaned.substring(thinkStart + 7).trim();
        cleaned = cleaned.substring(0, thinkStart).trim();
      }

      // Only apply artifact cleanup to assistant messages (not user messages)
      cleaned = cleaned
        .replace(/Hi there<\|eot_id\|><\|start_header_id\|>user<\|end_header_id\|>[\s\S]*?Not using system message\. To change it, set a different value via -sys PROMPT/g, '')
        .replace(/\bl[\s\n]+l?[\s\n]*e[\s\n]+r[\s\S]*?tokens per second\)/gi, '')
        .replace(/system_info:[\s\S]*?Not using system message\. To change it, set a different value via -sys PROMPT/g, '')
        .replace(/^\s*[a-z]{1,2}\s*$/gmi, '')
        .replace(/[\s\S]*?assistantassistant/gi, '')
        .replace(/l>a m.*/gi, '')
        .replace(/llama_perf.*/gi, '')
        .replace(/sampler_.*/gi, '');
    }
    cleaned = cleaned.trim();

    const renderInlineFormatting = (text: string) => {
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold">{part.replace(/\*\*/g, '')}</strong>;
        }
        return <span key={i}>{part}</span>;
      });
    };

    const paragraphs = cleaned.split('\n\n').map((paragraph, idx) => {
      const lines = paragraph.split('\n');

      return (
        <div key={idx} className="mb-3 last:mb-0">
          {lines.map((line, lineIdx) => {
            if (line.match(/^\*\*.*\*\*$/) && !line.includes(':')) {
              return (
                <h4 key={lineIdx} className="font-bold text-base mt-4 mb-2 first:mt-0">
                  {line.replace(/\*\*/g, '')}
                </h4>
              );
            }

            const numberedMatch = line.match(/^(\d+)\.\s+(.+)/);
            if (numberedMatch) {
              return (
                <div key={lineIdx} className="flex gap-2 mb-1">
                  <span className="font-semibold min-w-[1.5rem]">{numberedMatch[1]}.</span>
                  <span>{renderInlineFormatting(numberedMatch[2])}</span>
                </div>
              );
            }

            const bulletMatch = line.match(/^[•\*\-]\s+(.+)/);
            if (bulletMatch) {
              return (
                <div key={lineIdx} className="flex gap-2 mb-1 ml-4">
                  <span className="text-blue-600">•</span>
                  <span>{renderInlineFormatting(bulletMatch[1])}</span>
                </div>
              );
            }

            if (line.trim()) {
              return (
                <p key={lineIdx} className="mb-1">
                  {renderInlineFormatting(line)}
                </p>
              );
            }

            return null;
          })}
        </div>
      );
    });

    if (thinkingContent) {
      return (
        <>
          <ThinkingBlock
            content={thinkingContent}
            isStreaming={isStreaming && !content.includes('</think>')}
          />
          {paragraphs}
        </>
      );
    }
    return paragraphs;
  };

  return (
    <div className="flex h-full tab-content-bg relative" data-tutorial="chat-welcome"
      onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="flex-1 flex flex-col" onClick={(e) => {
        e.stopPropagation();
        onPanelClick?.();
      }}>
        <div className="border-b border-theme p-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-theme-heading">Chat with PEARL</h2>
            <p className="text-sm text-theme-hint">
              {/* WebSocket connection status is not available via context API, so this is omitted or needs a new prop */}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                startNewChat();
              }}
              className="p-2 rounded-lg hover:bg-theme-hover transition"
              title="New Chat"
              data-tutorial="chat-new"
            >
              <Plus className="w-5 h-5 text-theme-muted" />
            </button>
            {settings.fileAccessEnabled && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setRightPanel(rightPanel === 'files' ? 'none' : 'files');
                }}
                className={`p-2 rounded-lg hover:bg-theme-hover transition ${rightPanel === 'files' ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                title="Browse Files"
              >
                <FolderOpen className={`w-5 h-5 ${rightPanel === 'files' ? 'text-blue-600' : 'text-theme-muted'}`} />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setRightPanel(rightPanel === 'history' ? 'none' : 'history');
              }}
              className={`p-2 rounded-lg hover:bg-theme-hover transition ${rightPanel === 'history' ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
              title="Chat History"
              data-tutorial="chat-conversations"
            >
              <History className={`w-5 h-5 ${rightPanel === 'history' ? 'text-blue-600' : 'text-theme-muted'}`} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4" data-tutorial="chat-history">
          {messages.length === 0 && !streamingMessage ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-theme-heading mb-2">Start Learning!</h3>
                <p className="text-theme-muted">
                  Ask me anything about teaching, curriculum, or your lesson plans.
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-3xl px-4 py-3 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-theme-tertiary text-theme-heading'
                    }`}
                  >
                    {/* Attached file chips on user messages */}
                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {msg.attachments.map((att, i) => (
                          <div
                            key={i}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${
                              msg.role === 'user'
                                ? 'bg-blue-500/30 text-blue-100 border border-blue-400/30'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600'
                            }`}
                          >
                            {att.isImage ? (
                              <ImageIcon className="w-3.5 h-3.5" />
                            ) : (
                              <FileIcon className="w-3.5 h-3.5" />
                            )}
                            <span className="max-w-[120px] truncate">{att.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="text-sm prose prose-sm max-w-none">
                      {formatMessage(msg.content, msg.role)}
                    </div>
                    {/* File operation plan action buttons */}
                    {msg.filePlan && msg.filePlan.status === 'pending' && pendingPlan && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <button
                          onClick={() => executePlan(pendingPlan)}
                          disabled={executingPlan}
                          className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                        >
                          {executingPlan ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Executing...
                            </>
                          ) : (
                            'Approve & Execute'
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setPendingPlan(null);
                            const rejectMsg: Message = {
                              id: Date.now().toString(),
                              role: 'assistant',
                              content: 'Plan cancelled. Your files remain unchanged.',
                              timestamp: new Date().toISOString()
                            };
                            setMessages(prev => [...prev, rejectMsg]);
                          }}
                          disabled={executingPlan}
                          className="px-4 py-2 bg-theme-tertiary text-theme-label text-sm font-medium rounded-lg hover:bg-theme-hover disabled:opacity-50 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    {msg.filePlan && msg.filePlan.status === 'executed' && (
                      <div className="flex items-center gap-2 mt-2 text-green-600 dark:text-green-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span className="text-xs font-medium">Executed successfully</span>
                      </div>
                    )}
                    <div className={`flex items-center gap-2 mt-2 ${msg.role === 'user' ? 'text-blue-200' : 'text-theme-hint'}`}>
                      <p className="text-xs">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                      {msg.role === 'assistant' && (
                        <button
                          onClick={() => handleToggleTTS(msg.id, msg.content)}
                          className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition"
                          title={speakingMessageId === msg.id && tts.isSpeaking ? 'Stop reading' : 'Read aloud'}
                        >
                          {speakingMessageId === msg.id && tts.isSpeaking
                            ? <VolumeX className="w-3.5 h-3.5" />
                            : <Volume2 className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {streamingMessage && (
                <div className="flex justify-start">
                  <div className="max-w-3xl px-4 py-3 rounded-2xl bg-theme-tertiary text-theme-heading">
                    <div className="text-sm prose prose-sm max-w-none">
                      {formatMessage(streamingMessage, 'assistant', true)}
                      <span className="inline-block w-2 h-4 bg-blue-600 ml-1 animate-pulse"></span>
                    </div>
                  </div>
                </div>
              )}

              {(waitingForResponse || (loading && !streamingMessage)) && (
                <div className="flex justify-start">
                  <div className="bg-theme-tertiary px-4 py-3 rounded-2xl flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm text-theme-muted">Thinking...</span>
                  </div>
                </div>
              )}

              {generatingPlan && (
                <div className="flex justify-start">
                  <div className="bg-theme-tertiary px-4 py-3 rounded-2xl flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-theme-muted">Analyzing files and generating organization plan...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="border-t border-theme py-4 pr-4 pl-20">
          {/* Attached file chips */}
          {(attachedFiles.length > 0 || pendingDropFiles.length > 0 || attachingFile) && (
            <div className="flex flex-wrap gap-2 mb-3">
              {attachedFiles.map(file => {
                const isResource = file.path.startsWith('resource:');
                const isCurriculum = file.path.startsWith('curriculum:');
                const chipColor = isCurriculum
                  ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700'
                  : isResource
                  ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700'
                  : file.isDirectory
                  ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700'
                  : 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700';
                const textColor = isCurriculum
                  ? 'text-purple-800 dark:text-purple-200'
                  : isResource
                  ? 'text-green-800 dark:text-green-200'
                  : file.isDirectory
                  ? 'text-amber-800 dark:text-amber-200'
                  : 'text-blue-800 dark:text-blue-200';
                const iconColor = isCurriculum ? 'text-purple-500' : isResource ? 'text-green-500' : file.isDirectory ? 'text-amber-500' : '';
                const hoverBg = isCurriculum
                  ? 'hover:bg-purple-200 dark:hover:bg-purple-800'
                  : isResource
                  ? 'hover:bg-green-200 dark:hover:bg-green-800'
                  : file.isDirectory
                  ? 'hover:bg-amber-200 dark:hover:bg-amber-800'
                  : 'hover:bg-blue-200 dark:hover:bg-blue-800';
                return (
                  <div
                    key={file.path}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm group border ${chipColor}`}
                    title={file.previewText}
                  >
                    {isCurriculum ? (
                      <BookMarkIcon className={`w-3.5 h-3.5 ${iconColor}`} />
                    ) : isResource ? (
                      <LayersIcon className={`w-3.5 h-3.5 ${iconColor}`} />
                    ) : file.isDirectory ? (
                      <FolderOpen className={`w-3.5 h-3.5 ${iconColor}`} />
                    ) : (
                      <FileIcon className={`w-3.5 h-3.5 ${getFileTypeColor(file.extension)}`} />
                    )}
                    <span className={`max-w-[200px] truncate ${textColor}`}>
                      {file.name}{file.isDirectory ? ` (${file.fileCount} files)` : ''}
                    </span>
                    <button
                      onClick={() => detachFile(file.path)}
                      className={`ml-0.5 p-0.5 rounded transition ${hoverBg}`}
                      title="Remove"
                    >
                      <X className={`w-3 h-3 ${iconColor || 'text-blue-500'}`} />
                    </button>
                  </div>
                );
              })}
              {pendingDropFiles.map(name => (
                <div key={`pending-${name}`} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 border-dashed text-sm animate-pulse">
                  <span className="block w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <span className="text-blue-800 dark:text-blue-200 max-w-[150px] truncate">{name}</span>
                  <button
                    onClick={() => {
                      cancelledDropFiles.current.add(name);
                      setPendingDropFiles(prev => prev.filter(n => n !== name));
                    }}
                    className="ml-0.5 p-0.5 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                    title="Cancel"
                  >
                    <X className="w-3 h-3 text-blue-500" />
                  </button>
                </div>
              ))}
              {attachingFile && !attachingFile.startsWith('drop://') && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 border-dashed text-sm animate-pulse">
                  <span className="block w-3.5 h-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-blue-800 dark:text-blue-200 max-w-[150px] truncate">
                    {attachingFile.split('/').pop() || attachingFile}
                  </span>
                </div>
              )}
            </div>
          )}
          <div className="flex items-end space-x-2">
            {/* Input field with mic (left) and brain (right) inside */}
            <div className={`flex-1 flex items-center border rounded-xl px-3 py-2 transition ${
              stt.isListening ? 'border-red-400 bg-red-50 dark:bg-red-900/10' : 'border-theme-strong focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent'
            }`} style={{ minHeight: '48px' }}>
              {/* Mic button — left side, pinned to bottom */}
              <button
                onClick={stt.toggleListening}
                disabled={loading}
                className={`rounded-lg transition flex-shrink-0 flex items-center justify-center ${
                  stt.isListening
                    ? 'text-red-500 animate-pulse'
                    : 'text-theme-muted hover:text-theme-heading hover:bg-theme-hover'
                }`}
                style={{ width: '28px', height: '28px' }}
                title={stt.isListening ? 'Stop listening' : 'Voice input'}
              >
                {stt.isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
              </button>

              {/* Text area — grows up to 10 lines then scrolls */}
              <SmartTextArea
                value={input}
                onChange={setInput}
                onKeyDown={handleKeyDown}
                placeholder={stt.isListening ? 'Listening...' : 'Ask me anything...'}
                className="flex-1 resize-none outline-none bg-transparent dark:text-gray-100 overflow-y-auto leading-7"
                rows={1}
                style={{ minHeight: '28px', maxHeight: '220px', padding: '0 12px' }}
                disabled={loading}
                data-tutorial="chat-input"
              />

              {/* Brain / thinking toggle — right side */}
              {supportsThinking && (
                <div className="relative flex-shrink-0 group/brain">
                  <button
                    onClick={() => updateSettings({ thinkingEnabled: !settings.thinkingEnabled })}
                    className={`rounded-lg transition flex items-center justify-center ${
                      settings.thinkingEnabled
                        ? 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40'
                        : 'text-theme-muted hover:text-purple-600 hover:bg-theme-hover'
                    }`}
                    style={{ width: '28px', height: '28px' }}
                  >
                    <BrainIcon className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap opacity-0 group-hover/brain:opacity-100 pointer-events-none transition-opacity bg-gray-900 dark:bg-gray-700 text-white shadow-lg">
                    Thinking Mode {settings.thinkingEnabled ? '(ON)' : '(OFF)'}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
                  </div>
                </div>
              )}
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 self-stretch"
              data-tutorial="chat-send"
            >
              {loading ? (
                <HeartbeatLoader className="w-5 h-5" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-theme-hint mt-2">
            {stt.isListening ? 'Speak now — your words will appear above' : 'Press Enter to send, Shift+Enter for new line'}
          </p>
        </div>
      </div>

      {/* ── Right sidebar: History or Files ── */}
      <div
        ref={panelRef}
        className={`border-l border-theme bg-theme-secondary overflow-hidden relative ${
          rightPanel === 'none' ? 'w-0' : ''
        }`}
        style={rightPanel !== 'none' ? { width: panelWidth, transition: 'none' } : { width: 0, transition: 'width 0.3s' }}
        onClick={(e) => e.stopPropagation()}
        data-tutorial="chat-sidebar"
      >
        {/* Drag handle to resize panel */}
        {rightPanel !== 'none' && (
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              isResizing.current = true;
              document.body.style.cursor = 'col-resize';
              document.body.style.userSelect = 'none';
            }}
            className="absolute left-0 top-0 bottom-0 w-1.5 cursor-col-resize z-10 hover:bg-blue-400/40 active:bg-blue-500/50 transition-colors"
          />
        )}
        {/* Chat History Panel */}
        {rightPanel === 'history' && (
          <div className="h-full flex flex-col p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-theme-heading">Chat History</h3>
              <button
                onClick={() => setRightPanel('none')}
                className="p-1 rounded hover:bg-theme-hover transition"
              >
                <X className="w-5 h-5 text-theme-muted" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {chatHistories.length === 0 ? (
                <div className="text-center text-theme-hint mt-8">
                  <History className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No chat history yet</p>
                </div>
              ) : (
                chatHistories.map((history) => (
                  <div
                    key={history.id}
                    onClick={() => loadChatHistory(history)}
                    className={`p-3 rounded-lg cursor-pointer transition group hover:bg-theme-subtle ${
                      currentChatId === history.id ? 'bg-theme-surface shadow-sm' : 'bg-theme-tertiary'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-theme-heading truncate">
                          {history.title}
                        </p>
                        <p className="text-xs text-theme-hint mt-1">
                          {new Date(history.timestamp).toLocaleDateString()} {new Date(history.timestamp).toLocaleTimeString()}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {history.messages.length} messages
                        </p>
                      </div>
                      <button
                        onClick={(e) => deleteHistory(history.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 transition"
                        title="Delete chat"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Files Panel */}
        {rightPanel === 'files' && (
          <div className="h-full flex flex-col">
            {/* Panel header */}
            <div className="flex items-center justify-between p-4 pb-2">
              <h3 className="text-lg font-semibold text-theme-heading flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-blue-500" />
                My Files
              </h3>
              <div className="flex items-center gap-1">
                {filesTab === 'on-pc' && (
                  <button
                    disabled={refreshingFiles}
                    onClick={async () => {
                      setRefreshingFiles(true);
                      try {
                        const freshAllowed = await fileAPI.getAllowedFolders();
                        setAllowedFolders(freshAllowed);
                        const foldersToRefresh = new Set(expandedFolders);
                        freshAllowed.forEach(f => foldersToRefresh.add(f));
                        const results = await Promise.all(
                          [...foldersToRefresh].map(async (folder) => {
                            try {
                              const result = await fileAPI.browseFolder(folder);
                              if (result?.items) return { folder, items: result.items };
                            } catch {}
                            return null;
                          })
                        );
                        setFolderContents(prev => {
                          const next = { ...prev };
                          for (const key of Object.keys(next)) {
                            if (!freshAllowed.some(f => key.startsWith(f))) {
                              delete next[key];
                            }
                          }
                          for (const r of results) {
                            if (r) next[r.folder] = r.items;
                          }
                          return next;
                        });
                      } catch (err) {
                        console.error('Error refreshing files:', err);
                      }
                      setRefreshingFiles(false);
                    }}
                    className="p-1.5 rounded-lg hover:bg-theme-hover transition disabled:opacity-50"
                    title="Refresh files"
                  >
                    <RefreshIcon className={`w-4 h-4 text-theme-muted ${refreshingFiles ? 'animate-spin' : ''}`} />
                  </button>
                )}
                {filesTab === 'in-app' && (
                  <button
                    onClick={() => loadInAppResources()}
                    className="p-1.5 rounded-lg hover:bg-theme-hover transition"
                    title="Refresh resources"
                  >
                    <RefreshIcon className={`w-4 h-4 text-theme-muted ${inAppLoading ? 'animate-spin' : ''}`} />
                  </button>
                )}
                <button
                  onClick={() => setRightPanel('none')}
                  className="p-1.5 rounded-lg hover:bg-theme-hover transition"
                  title="Collapse panel"
                >
                  <SidebarIcon className="w-5 h-5 text-theme-muted" />
                </button>
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex border-b border-theme mx-4 mb-2">
              {([
                { key: 'on-pc' as FilesTab, label: 'On PC', icon: <ComputerIcon className="w-3.5 h-3.5" /> },
                { key: 'in-app' as FilesTab, label: 'In App', icon: <LayersIcon className="w-3.5 h-3.5" /> },
                { key: 'curriculum' as FilesTab, label: 'Curriculum', icon: <BookMarkIcon className="w-3.5 h-3.5" /> },
              ]).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilesTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition ${
                    filesTab === tab.key
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-theme-muted hover:text-theme-heading hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* ── On PC Tab ── */}
            {filesTab === 'on-pc' && (
              <>
                {/* Hint */}
                <div className="px-4 pb-2">
                  <p className="text-[11px] text-theme-hint">Toggle files to include them as context in your next message.</p>
                </div>

                {/* Search bar */}
                <div className="px-4 pb-3">
                  <div className="relative">
                    <SearchIcon className="w-4 h-4 text-theme-hint absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={fileSearchQuery}
                      onChange={(e) => handleFileSearch(e.target.value)}
                      placeholder="Search files..."
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-theme-strong bg-theme-surface text-theme-heading placeholder:text-theme-hint focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    {fileSearchQuery && (
                      <button
                        onClick={() => { setFileSearchQuery(''); setFileSearchResults(null); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-theme-hover"
                      >
                        <X className="w-3.5 h-3.5 text-theme-hint" />
                      </button>
                    )}
                  </div>
                </div>

                {/* File listing */}
                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
              {/* Search results mode */}
              {fileSearchResults !== null ? (
                <>
                  <p className="text-xs text-theme-hint mb-2">{fileSearchResults.length} result{fileSearchResults.length !== 1 ? 's' : ''}</p>
                  {fileSearchResults.map(file => {
                    const isAttached = attachedFiles.some(f => f.path === file.path);
                    const isLoading_ = attachingFile === file.path;
                    return (
                      <div
                        key={file.path}
                        onClick={() => !isLoading_ && toggleFileAttach(file.path, file.name, file.extension)}
                        className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${
                          isAttached ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' : 'hover:bg-theme-subtle'
                        }`}
                        title={file.path}
                      >
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition ${
                          isAttached ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {isLoading_ ? (
                            <span className="block w-2.5 h-2.5 border-[1.5px] border-white border-t-transparent rounded-full animate-spin" />
                          ) : isAttached ? (
                            <CheckIcon className="w-3 h-3 text-white" />
                          ) : null}
                        </div>
                        <FileIcon className={`w-4 h-4 flex-shrink-0 ${getFileTypeColor(file.extension)}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-theme-heading truncate">{file.name}</p>
                          <p className="text-xs text-theme-hint">{formatFileSize(file.size)}</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setPreviewFile({ path: file.path, name: file.name, extension: file.extension }); }}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition flex-shrink-0 opacity-0 group-hover:opacity-100"
                          title="Preview file"
                        >
                          <EyeIcon className="w-3.5 h-3.5 text-theme-muted" />
                        </button>
                      </div>
                    );
                  })}
                  {fileSearchResults.length === 0 && (
                    <p className="text-sm text-theme-hint text-center mt-4">No files found</p>
                  )}
                </>
              ) : (
                /* Folder tree mode */
                <>
                  {allowedFolders.length === 0 ? (
                    <div className="text-center text-theme-hint mt-8">
                      <FolderOpen className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No folders configured</p>
                      <p className="text-xs mt-1">Go to Settings &gt; File Access to add folders</p>
                    </div>
                  ) : (
                    allowedFolders.map(folder => {
                      const folderName = folder.split(/[/\\]/).filter(Boolean).pop() || folder;
                      const isExpanded = expandedFolders.has(folder);
                      const items = folderContents[folder] || [];
                      const isLoading = loadingFolder === folder;
                      const folderFiles = items.filter(i => !i.isDirectory);
                      const allFolderAttached = folderFiles.length > 0 && folderFiles.every(f => attachedFiles.some(a => a.path === f.path));
                      const someFolderAttached = folderFiles.some(f => attachedFiles.some(a => a.path === f.path));
                      return (
                        <div key={folder}>
                          {/* Folder root */}
                          <div className="flex items-center gap-1">
                            {isExpanded && folderFiles.length > 0 && (
                              <div
                                onClick={(e) => { e.stopPropagation(); toggleFolderAttach(folder); }}
                                className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center flex-shrink-0 cursor-pointer transition ${
                                  allFolderAttached ? 'bg-blue-600 border-blue-600' : someFolderAttached ? 'bg-blue-300 border-blue-400' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                                }`}
                                title={allFolderAttached ? 'Deselect all files in folder' : 'Select all files in folder'}
                              >
                                {allFolderAttached ? <CheckIcon className="w-2.5 h-2.5 text-white" /> : someFolderAttached ? <span className="block w-1.5 h-1.5 bg-white rounded-sm" /> : null}
                              </div>
                            )}
                            <button
                              onClick={() => toggleFolder(folder)}
                              className="flex-1 flex items-center gap-2 p-2 rounded-lg hover:bg-theme-subtle transition text-left"
                            >
                              {isExpanded
                                ? <ChevronDown className="w-3.5 h-3.5 text-theme-muted flex-shrink-0" />
                                : <ChevronRight className="w-3.5 h-3.5 text-theme-muted flex-shrink-0" />
                              }
                              <FolderOpen className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                              <span className="text-sm font-medium text-theme-heading truncate">{folderName}</span>
                              {folderFiles.length > 0 && isExpanded && (
                                <span className="text-[10px] text-theme-hint ml-auto flex-shrink-0">{folderFiles.length}</span>
                              )}
                            </button>
                          </div>

                          {/* Expanded folder contents */}
                          {isExpanded && (
                            <div className="ml-5 border-l border-theme-strong/20 pl-2 space-y-0.5">
                              {isLoading ? (
                                <p className="text-xs text-theme-hint p-2">Loading...</p>
                              ) : items.length === 0 ? (
                                <p className="text-xs text-theme-hint p-2">Empty folder</p>
                              ) : (
                                items.map(item => {
                                  if (item.isDirectory) {
                                    const subExpanded = expandedFolders.has(item.path);
                                    const subItems = folderContents[item.path] || [];
                                    const subLoading = loadingFolder === item.path;
                                    const subFiles = subItems.filter(si => !si.isDirectory);
                                    const allSubAttached = subFiles.length > 0 && subFiles.every(f => attachedFiles.some(a => a.path === f.path));
                                    const someSubAttached = subFiles.some(f => attachedFiles.some(a => a.path === f.path));
                                    return (
                                      <div key={item.path}>
                                        <div className="flex items-center gap-1">
                                          {subExpanded && subFiles.length > 0 && (
                                            <div
                                              onClick={(e) => { e.stopPropagation(); toggleFolderAttach(item.path); }}
                                              className={`w-3.5 h-3.5 rounded border-[1.5px] flex items-center justify-center flex-shrink-0 cursor-pointer transition ${
                                                allSubAttached ? 'bg-blue-600 border-blue-600' : someSubAttached ? 'bg-blue-300 border-blue-400' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                                              }`}
                                              title={allSubAttached ? 'Deselect all' : 'Select all'}
                                            >
                                              {allSubAttached ? <CheckIcon className="w-2 h-2 text-white" /> : someSubAttached ? <span className="block w-1 h-1 bg-white rounded-sm" /> : null}
                                            </div>
                                          )}
                                          <button
                                            onClick={() => toggleFolder(item.path)}
                                            className="flex-1 flex items-center gap-2 p-1.5 rounded-lg hover:bg-theme-subtle transition text-left"
                                          >
                                            {subExpanded
                                              ? <ChevronDown className="w-3 h-3 text-theme-muted flex-shrink-0" />
                                              : <ChevronRight className="w-3 h-3 text-theme-muted flex-shrink-0" />
                                            }
                                            <FolderOpen className="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" />
                                            <span className="text-xs text-theme-heading truncate">{item.name}</span>
                                          </button>
                                        </div>
                                        {subExpanded && (
                                          <div className="ml-4 border-l border-theme-strong/20 pl-2 space-y-0.5">
                                            {subLoading ? (
                                              <p className="text-xs text-theme-hint p-1.5">Loading...</p>
                                            ) : subItems.length === 0 ? (
                                              <p className="text-xs text-theme-hint p-1.5">Empty</p>
                                            ) : (
                                              subItems.filter(si => !si.isDirectory).map(subFile => {
                                                const isAttached = attachedFiles.some(f => f.path === subFile.path);
                                                const isLoading_ = attachingFile === subFile.path;
                                                return (
                                                  <div
                                                    key={subFile.path}
                                                    onClick={() => !isLoading_ && toggleFileAttach(subFile.path, subFile.name, subFile.extension)}
                                                    className={`group flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition ${
                                                      isAttached ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-theme-subtle'
                                                    }`}
                                                    title={`${subFile.name} — ${formatFileSize(subFile.size)}`}
                                                  >
                                                    <div className={`w-3.5 h-3.5 rounded border-[1.5px] flex items-center justify-center flex-shrink-0 transition ${
                                                      isAttached ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-gray-600'
                                                    }`}>
                                                      {isLoading_ ? (
                                                        <span className="block w-2 h-2 border border-white border-t-transparent rounded-full animate-spin" />
                                                      ) : isAttached ? (
                                                        <CheckIcon className="w-2.5 h-2.5 text-white" />
                                                      ) : null}
                                                    </div>
                                                    <FileIcon className={`w-3.5 h-3.5 flex-shrink-0 ${getFileTypeColor(subFile.extension)}`} />
                                                    <span className="text-xs text-theme-heading truncate flex-1">{subFile.name}</span>
                                                    <button
                                                      onClick={(e) => { e.stopPropagation(); setPreviewFile({ path: subFile.path, name: subFile.name, extension: subFile.extension }); }}
                                                      className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition flex-shrink-0 opacity-0 group-hover:opacity-100"
                                                      title="Preview file"
                                                    >
                                                      <EyeIcon className="w-3 h-3 text-theme-muted" />
                                                    </button>
                                                  </div>
                                                );
                                              })
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }
                                  // File item
                                  const isAttached = attachedFiles.some(f => f.path === item.path);
                                  const isLoading_ = attachingFile === item.path;
                                  return (
                                    <div
                                      key={item.path}
                                      onClick={() => !isLoading_ && toggleFileAttach(item.path, item.name, item.extension)}
                                      className={`group flex items-center gap-2 p-1.5 rounded-lg cursor-pointer transition ${
                                        isAttached ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-theme-subtle'
                                      }`}
                                      title={`${item.name} — ${formatFileSize(item.size)}`}
                                    >
                                      <div className={`w-3.5 h-3.5 rounded border-[1.5px] flex items-center justify-center flex-shrink-0 transition ${
                                        isAttached ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-gray-600'
                                      }`}>
                                        {isLoading_ ? (
                                          <span className="block w-2 h-2 border border-white border-t-transparent rounded-full animate-spin" />
                                        ) : isAttached ? (
                                          <CheckIcon className="w-2.5 h-2.5 text-white" />
                                        ) : null}
                                      </div>
                                      <FileIcon className={`w-3.5 h-3.5 flex-shrink-0 ${getFileTypeColor(item.extension)}`} />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs text-theme-heading truncate">{item.name}</p>
                                      </div>
                                      <span className="text-[10px] text-theme-hint flex-shrink-0">{getFileTypeLabel(item.extension)}</span>
                                      <button
                                        onClick={(e) => { e.stopPropagation(); setPreviewFile({ path: item.path, name: item.name, extension: item.extension }); }}
                                        className="p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition flex-shrink-0 opacity-0 group-hover:opacity-100"
                                        title="Preview file"
                                      >
                                        <EyeIcon className="w-3 h-3 text-theme-muted" />
                                      </button>
                                    </div>
                                  );
                                })
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </>
              )}
            </div>
              </>
            )}

            {/* ── In App Tab ── */}
            {filesTab === 'in-app' && (
              <>
                {/* Hint */}
                <div className="px-4 pb-2">
                  <p className="text-[11px] text-theme-hint">Select resources to include as context in your next message.</p>
                </div>

                {/* Search & filter bar */}
                <div className="px-4 pb-3 space-y-2">
                  <div className="relative">
                    <SearchIcon className="w-4 h-4 text-theme-hint absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={inAppSearch}
                      onChange={(e) => setInAppSearch(e.target.value)}
                      placeholder="Search resources..."
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-theme-strong bg-theme-surface text-theme-heading placeholder:text-theme-hint focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    />
                    {inAppSearch && (
                      <button
                        onClick={() => setInAppSearch('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-theme-hover"
                      >
                        <X className="w-3.5 h-3.5 text-theme-hint" />
                      </button>
                    )}
                  </div>
                  {/* Type filter pills */}
                  <div className="flex flex-wrap gap-1">
                    {['all', 'lesson', 'quiz', 'worksheet', 'rubric', 'kindergarten', 'multigrade', 'cross-curricular', 'images', 'presentation'].map(type => (
                      <button
                        key={type}
                        onClick={() => setInAppFilter(type)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium transition ${
                          inAppFilter === type
                            ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                            : 'bg-theme-subtle text-theme-muted hover:bg-theme-hover border border-transparent'
                        }`}
                      >
                        {type === 'all' ? 'All' : RESOURCE_TYPE_MAP[type]?.label || type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resource listing */}
                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
                  {inAppLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="ml-2 text-sm text-theme-muted">Loading resources...</span>
                    </div>
                  ) : (() => {
                    const filtered = inAppResources.filter(r => {
                      if (inAppFilter !== 'all' && r.type !== inAppFilter) return false;
                      if (inAppSearch && !r.title.toLowerCase().includes(inAppSearch.toLowerCase())) return false;
                      return true;
                    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

                    if (filtered.length === 0) {
                      return (
                        <div className="text-center text-theme-hint mt-8">
                          <LayersIcon className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">{inAppResources.length === 0 ? 'No resources yet' : 'No matching resources'}</p>
                          <p className="text-xs mt-1">Resources you create will appear here</p>
                        </div>
                      );
                    }

                    return filtered.map(resource => {
                      const isAttached = attachedFiles.some(f => f.path === `resource:${resource.id}`);
                      const typeInfo = RESOURCE_TYPE_MAP[resource.type] || { label: resource.type, color: 'text-gray-600' };
                      return (
                        <div
                          key={resource.id}
                          onClick={() => {
                            const resourcePath = `resource:${resource.id}`;
                            if (isAttached) {
                              setAttachedFiles(prev => prev.filter(f => f.path !== resourcePath));
                            } else {
                              const content = getResourceContent(resource);
                              setAttachedFiles(prev => [...prev, {
                                name: resource.title,
                                path: resourcePath,
                                extension: `.${resource.type}`,
                                previewText: content.slice(0, 200),
                                fullContent: content,
                              }]);
                            }
                          }}
                          className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition ${
                            isAttached ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'hover:bg-theme-subtle'
                          }`}
                          title={resource.title}
                        >
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition ${
                            isAttached ? 'bg-green-600 border-green-600' : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {isAttached && <CheckIcon className="w-3 h-3 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-theme-heading truncate">{resource.title}</p>
                            <p className="text-[10px] text-theme-hint">
                              {new Date(resource.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`text-[10px] font-medium flex-shrink-0 ${typeInfo.color}`}>
                            {typeInfo.label}
                          </span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </>
            )}

            {/* ── Curriculum Tab ── */}
            {filesTab === 'curriculum' && (
              <>
                {/* Hint */}
                <div className="px-4 pb-2">
                  <p className="text-[11px] text-theme-hint">Check a strand to attach its ELOs/SCOs as context. Click the name to open in curriculum browser.</p>
                </div>

                {/* Curriculum tree */}
                <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1">
                  {(() => {
                    const tree = getFilteredCurriculumTree();
                    const mapping = settings.profile.gradeSubjects || {};
                    const teacherGrades = getTeacherGrades(mapping);

                    if (teacherGrades.length === 0) {
                      return (
                        <div className="text-center text-theme-hint mt-8">
                          <GraduationIcon className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No grades configured</p>
                          <p className="text-xs mt-1">Set up your teacher profile in Settings to see curriculum here</p>
                        </div>
                      );
                    }

                    if (tree.length === 0) {
                      return (
                        <div className="text-center text-theme-hint mt-8">
                          <BookMarkIcon className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No curriculum found</p>
                          <p className="text-xs mt-1">No strands match your grade/subject profile</p>
                        </div>
                      );
                    }

                    return tree.map(grade => {
                      const gradeExpanded = expandedCurriculumNodes.has(grade.gradeValue);
                      return (
                        <div key={grade.gradeValue}>
                          {/* Grade level */}
                          <button
                            onClick={() => toggleCurriculumNode(grade.gradeValue)}
                            className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-theme-subtle transition text-left"
                          >
                            {gradeExpanded
                              ? <ChevronDown className="w-3.5 h-3.5 text-theme-muted flex-shrink-0" />
                              : <ChevronRight className="w-3.5 h-3.5 text-theme-muted flex-shrink-0" />
                            }
                            <GraduationIcon className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="text-sm font-medium text-theme-heading">{grade.gradeLabel}</span>
                            <span className="text-[10px] text-theme-hint ml-auto">{grade.subjects.reduce((n, s) => n + s.strands.length, 0)}</span>
                          </button>

                          {gradeExpanded && (
                            <div className="ml-5 border-l border-theme-strong/20 pl-2 space-y-0.5">
                              {grade.subjects.map(subject => {
                                const subjectNodeId = `${grade.gradeValue}:${subject.subjectKey}`;
                                const subjectExpanded = expandedCurriculumNodes.has(subjectNodeId);
                                return (
                                  <div key={subjectNodeId}>
                                    {/* Subject */}
                                    <button
                                      onClick={() => toggleCurriculumNode(subjectNodeId)}
                                      className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-theme-subtle transition text-left"
                                    >
                                      {subjectExpanded
                                        ? <ChevronDown className="w-3 h-3 text-theme-muted flex-shrink-0" />
                                        : <ChevronRight className="w-3 h-3 text-theme-muted flex-shrink-0" />
                                      }
                                      <BookMarkIcon className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                                      <span className="text-xs font-medium text-theme-heading">{subject.subjectLabel}</span>
                                      <span className="text-[10px] text-theme-hint ml-auto">{subject.strands.length}</span>
                                    </button>

                                    {subjectExpanded && (
                                      <div className="ml-4 border-l border-theme-strong/20 pl-2 space-y-0.5">
                                        {subject.strands.map(strand => {
                                          const strandPath = `curriculum:${strand.id}`;
                                          const isAttached = attachedFiles.some(f => f.path === strandPath);
                                          return (
                                            <div
                                              key={strand.id}
                                              className={`flex items-center gap-2 p-1.5 rounded-lg transition ${
                                                isAttached ? 'bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800' : 'hover:bg-theme-subtle'
                                              }`}
                                              title={`${grade.gradeLabel} > ${subject.subjectLabel} > ${strand.displayName}\n${strand.essentialOutcomes.length} ELO(s), ${strand.specificOutcomes.length} SCO(s)`}
                                            >
                                              {/* Checkbox — attach/detach curriculum context */}
                                              <div
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (isAttached) {
                                                    setAttachedFiles(prev => prev.filter(f => f.path !== strandPath));
                                                  } else {
                                                    setAttachedFiles(prev => [...prev, {
                                                      name: strand.displayName,
                                                      path: strandPath,
                                                      extension: '.curriculum',
                                                      previewText: `${grade.gradeLabel} > ${subject.subjectLabel} > ${strand.displayName}`,
                                                      fullContent: buildCurriculumContext(strand, grade.gradeLabel, subject.subjectLabel),
                                                    }]);
                                                  }
                                                }}
                                                className={`w-3.5 h-3.5 rounded border-[1.5px] flex items-center justify-center flex-shrink-0 cursor-pointer transition ${
                                                  isAttached ? 'bg-purple-600 border-purple-600' : 'border-gray-300 dark:border-gray-600 hover:border-purple-400'
                                                }`}
                                              >
                                                {isAttached && <CheckIcon className="w-2.5 h-2.5 text-white" />}
                                              </div>
                                              {/* Clickable name — navigate to curriculum browser */}
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  if (onOpenCurriculumTab) onOpenCurriculumTab(strand.route);
                                                }}
                                                className="flex items-center gap-1.5 flex-1 min-w-0 text-left group"
                                                title="Open in Curriculum Browser"
                                              >
                                                <FileIcon className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                                                <span className="text-xs text-theme-heading truncate flex-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:underline transition-colors">{strand.displayName}</span>
                                              </button>
                                              {/* ELO/SCO count badge */}
                                              <span className="text-[9px] text-theme-hint flex-shrink-0 whitespace-nowrap">
                                                {strand.essentialOutcomes.length}E {strand.specificOutcomes.length}S
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </>
            )}

            {/* Smart thinking suggestion */}
            {showThinkingSuggestion && supportsThinking && !settings.thinkingEnabled && (
              <div className="mx-4 mb-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 text-sm">
                <BrainIcon className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span className="text-purple-700 dark:text-purple-300 text-xs">
                  This looks like a reasoning task. Thinking mode may produce better results.
                </span>
                <button
                  onClick={() => {
                    updateSettings({ thinkingEnabled: true });
                    setShowThinkingSuggestion(false);
                  }}
                  className="ml-auto px-2 py-1 text-xs font-medium bg-purple-600 text-white rounded hover:bg-purple-700 transition flex-shrink-0"
                >
                  Enable
                </button>
                <button
                  onClick={() => setShowThinkingSuggestion(false)}
                  className="p-1 rounded hover:bg-purple-200 dark:hover:bg-purple-800 transition flex-shrink-0"
                >
                  <X className="w-3 h-3 text-purple-400" />
                </button>
              </div>
            )}

            {/* Attached files count indicator */}
            {attachedFiles.length > 0 && (
              <div className="px-4 py-2.5 border-t border-theme bg-blue-50/50 dark:bg-blue-950/20">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                    <AttachIcon className="w-3.5 h-3.5" />
                    {attachedFiles.length} file{attachedFiles.length !== 1 ? 's' : ''} selected
                  </p>
                  <button
                    onClick={() => setAttachedFiles([])}
                    className="text-[11px] text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* File preview modal */}
      {previewFile && (
        <FilePreviewModal
          filePath={previewFile.path}
          fileName={previewFile.name}
          extension={previewFile.extension}
          onClose={() => setPreviewFile(null)}
        />
      )}

      {/* Drag-and-drop overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 border-4 border-dashed border-blue-400 rounded-xl flex flex-col items-center justify-center pointer-events-none bg-blue-500/10 backdrop-blur-sm">
          <UploadIcon className="w-16 h-16 mb-4 text-blue-500" />
          <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">Drop files here to attach</p>
          <p className="text-sm text-theme-muted mt-2">{hasVision ? 'Images, documents, spreadsheets, and more' : 'Documents, spreadsheets, and more'}</p>
        </div>
      )}
    </div>
  );
};

export default Chat;