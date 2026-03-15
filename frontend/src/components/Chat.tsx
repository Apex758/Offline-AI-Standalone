                    import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, History, X, Trash2, Plus, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Message } from '../types';
import axios from 'axios';
import { useWebSocket } from '../contexts/WebSocketContext';
import { CurriculumReference } from './CurriculumReferences';
import { CurriculumReferences } from './CurriculumReferences';
import { HeartbeatLoader } from './ui/HeartbeatLoader';
import { useTTS, useSTT } from '../hooks/useVoice';
import SmartTextArea from './SmartTextArea';

interface ChatProps {
  tabId: string;
  savedData?: {
    messages?: Message[];
  };
  onDataChange: (data: { messages: Message[]; streamingMessage: string }) => void;
  onTitleChange?: (title: string) => void;
  onPanelClick?: () => void;
}

interface ChatHistory {
  id: string;
  title: string;
  timestamp: string;
  messages: Message[];
}

const Chat: React.FC<ChatProps> = ({ tabId, savedData, onDataChange, onTitleChange, onPanelClick }) => {
  // DEBUG: Log re-render and key state
  console.log('[Chat] Render', { tabId });
  // LocalStorage key for this chat tab
  const LOCAL_STORAGE_KEY = `chat_state_${tabId}`;
  const [messages, setMessages] = useState<Message[]>(savedData?.messages || []);
  const [input, setInput] = useState('');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [titleSet, setTitleSet] = useState(false);
  const [generatingTitle, setGeneratingTitle] = useState(false);
  const [curriculumSuggestions, setCurriculumSuggestions] = useState<CurriculumReference[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

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

  // WebSocketContext API
  const ENDPOINT = '/ws/chat';
  const { getConnection, getStreamingContent, getIsStreaming, clearStreaming, subscribe } = useWebSocket();

  // Streaming state from context
  const streamingMessage = getStreamingContent(tabId, ENDPOINT);
  const loading = getIsStreaming(tabId, ENDPOINT);

  // DEBUG: Log streaming and loading state
  useEffect(() => {
    console.log('[Chat] streamingMessage updated:', streamingMessage);
  }, [streamingMessage]);
  useEffect(() => {
    console.log('[Chat] loading state updated:', loading);
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
    setHistoryOpen(false);
    
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
    setHistoryOpen(false);
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
      // This triggers re-render when streaming updates
    });
    return unsubscribe;
  }, [tabId, subscribe]);

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

  const handleSend = () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Send via WebSocket
    const ws = getConnection(tabId, ENDPOINT);
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        message: input,
        chat_id: currentChatId,
      }));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (content: string) => {
    let cleaned = content
      .replace(/Hi there<\|eot_id\|><\|start_header_id\|>user<\|end_header_id\|>[\s\S]*?Not using system message\. To change it, set a different value via -sys PROMPT/g, '')
      .replace(/\bl[\s\n]+l?[\s\n]*e[\s\n]+r[\s\S]*?tokens per second\)/gi, '')
      .replace(/system_info:[\s\S]*?Not using system message\. To change it, set a different value via -sys PROMPT/g, '')
      .replace(/^\s*[a-z]{1,2}\s*$/gmi, '')
      .replace(/[\s\S]*?assistantassistant/gi, '')
      .replace(/l>a m.*/gi, '')
      .replace(/llama_perf.*/gi, '')
      .replace(/sampler_.*/gi, '')
      .trim();

    const renderInlineFormatting = (text: string) => {
      const parts = text.split(/(\*\*.*?\*\*)/g);
      return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-bold">{part.replace(/\*\*/g, '')}</strong>;
        }
        return <span key={i}>{part}</span>;
      });
    };

    return cleaned.split('\n\n').map((paragraph, idx) => {
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
  };

  return (
    <div className="flex h-full tab-content-bg relative" data-tutorial="chat-welcome">
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
            <button
              onClick={(e) => {
                e.stopPropagation();
                setHistoryOpen(!historyOpen);
              }}
              className="p-2 rounded-lg hover:bg-theme-hover transition"
              title="Chat History"
              data-tutorial="chat-conversations"
            >
              <History className="w-5 h-5 text-theme-muted" />
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
                  Ask me anything! I'm your AI teaching assistant, here to help explain concepts and answer your questions.
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
                    <div className="text-sm prose prose-sm max-w-none">
                      {formatMessage(msg.content)}
                    </div>
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
                      {formatMessage(streamingMessage)}
                      <span className="inline-block w-2 h-4 bg-blue-600 ml-1 animate-pulse"></span>
                    </div>
                  </div>
                </div>
              )}

              {loading && !streamingMessage && (
                <div className="flex justify-start">
                  <div className="bg-theme-tertiary px-4 py-3 rounded-2xl">
                    <HeartbeatLoader className="w-5 h-5 text-theme-muted" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Curriculum Suggestions Section */}
        {curriculumSuggestions && curriculumSuggestions.length > 0 && (
          <div className="px-4 pb-2">
            <CurriculumReferences
              references={curriculumSuggestions}
              heading="Curriculum Suggestions"
              description="These curriculum activities are suggested based on your conversation. Click to view more."
              className="mb-4"
            />
          </div>
        )}

        <div className="border-t border-theme p-4">
          <div className="flex space-x-2">
            <button
              onClick={stt.toggleListening}
              disabled={loading}
              className={`px-3 py-3 rounded-xl transition flex items-center justify-center ${
                stt.isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-theme-tertiary text-theme-label hover:bg-theme-hover border border-theme-strong'
              }`}
              title={stt.isListening ? 'Stop listening' : 'Voice input'}
            >
              {stt.isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <SmartTextArea
              value={input}
              onChange={setInput}
              onKeyPress={handleKeyPress}
              placeholder={stt.isListening ? 'Listening...' : 'Ask me anything...'}
              className={`flex-1 px-4 py-3 border rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-gray-800 dark:text-gray-100 ${
                stt.isListening ? 'border-red-400 bg-red-50 dark:bg-red-900/10' : 'border-theme-strong'
              }`}
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={loading}
              data-tutorial="chat-input"
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
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

      <div
        className={`border-l border-theme bg-theme-secondary transition-all duration-300 overflow-hidden ${
          historyOpen ? 'w-80' : 'w-0'
        }`}
        onClick={(e) => e.stopPropagation()}
        data-tutorial="chat-sidebar"
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-theme-heading">Chat History</h3>
            <button
              onClick={() => setHistoryOpen(false)}
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
      </div>

 
    </div>
  );
};

export default Chat;