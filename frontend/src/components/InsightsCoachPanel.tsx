import React, { useState, useRef, useEffect, useCallback } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import SentIconData from '@hugeicons/core-free-icons/SentIcon';
import Clock01IconData from '@hugeicons/core-free-icons/Clock01Icon';
import axios from 'axios';
import type { TeacherMetrics, ConsultantConversation } from '../types/insights';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 16;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface InsightsCoachPanelProps {
  metrics: TeacherMetrics | null;
  triggerDimension?: string;
  teacherId: string;
  currentChatId?: string | null;
  onChatIdChange?: (chatId: string) => void;
  /** Controlled collapsed state — parent can force-expand by passing false */
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const InsightsCoachPanel: React.FC<InsightsCoachPanelProps> = ({
  metrics,
  triggerDimension,
  teacherId,
  currentChatId,
  onChatIdChange,
  collapsed: controlledCollapsed,
  onCollapsedChange,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const setCollapsed = (val: boolean) => {
    if (onCollapsedChange) onCollapsedChange(val);
    else setInternalCollapsed(val);
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [conversations, setConversations] = useState<ConsultantConversation[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const chatIdRef = useRef<string | null>(currentChatId || null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Focus input when expanded
  useEffect(() => {
    if (!collapsed) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [collapsed]);

  // Load conversations list when expanded
  useEffect(() => {
    if (!collapsed) {
      axios.get(`/api/consultant/conversations?teacher_id=${encodeURIComponent(teacherId)}`)
        .then(res => setConversations(res.data?.conversations || []))
        .catch(() => {});
    }
  }, [collapsed, teacherId]);

  // Load existing conversation messages
  useEffect(() => {
    if (currentChatId) {
      chatIdRef.current = currentChatId;
      axios.get(`/api/consultant/conversation/${currentChatId}`)
        .then(res => {
          const conv = res.data?.conversation;
          if (conv?.messages) {
            setMessages(conv.messages.map((m: any) => ({
              id: m.msg_id || String(Math.random()),
              role: m.role,
              content: m.content,
            })));
          }
        })
        .catch(() => {});
    }
  }, [currentChatId]);

  const sendMessage = useCallback(() => {
    if (!input.trim() || isStreaming) return;

    const userMsg: Message = {
      id: String(Date.now()),
      role: 'user',
      content: input.trim(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);
    setStreamingContent('');

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//localhost:8000/ws/consultant`);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        message: userMsg.content,
        chat_id: chatIdRef.current,
        metrics_context: metrics,
        trigger_dimension: triggerDimension,
        teacher_id: teacherId,
      }));
    };

    let accumulated = '';

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === 'chat_id') {
          chatIdRef.current = msg.chat_id;
          onChatIdChange?.(msg.chat_id);
        }

        if (msg.type === 'token') {
          accumulated += msg.content;
          setStreamingContent(accumulated);
        }

        if (msg.type === 'done') {
          setIsStreaming(false);
          if (accumulated) {
            setMessages(prev => [...prev, {
              id: String(Date.now()) + '_assistant',
              role: 'assistant',
              content: accumulated,
            }]);
          }
          setStreamingContent('');
          ws.close();
        }

        if (msg.type === 'error') {
          setIsStreaming(false);
          setStreamingContent('');
          ws.close();
        }
      } catch {}
    };

    ws.onerror = () => {
      setIsStreaming(false);
      setStreamingContent('');
    };

    ws.onclose = () => {
      wsRef.current = null;
    };
  }, [input, isStreaming, metrics, triggerDimension, teacherId, onChatIdChange]);

  const loadConversation = (convId: string) => {
    onChatIdChange?.(convId);
    chatIdRef.current = convId;
    setShowHistory(false);
    axios.get(`/api/consultant/conversation/${convId}`)
      .then(res => {
        const conv = res.data?.conversation;
        if (conv?.messages) {
          setMessages(conv.messages.map((m: any) => ({
            id: m.msg_id || String(Math.random()),
            role: m.role,
            content: m.content,
          })));
        }
      })
      .catch(() => {});
  };

  const startNewConversation = () => {
    chatIdRef.current = null;
    onChatIdChange?.('');
    setMessages([]);
    setShowHistory(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Collapsed strip ──
  if (collapsed) {
    return (
      <div
        className="w-8 flex-shrink-0 border-l border-theme-border bg-theme-bg-secondary cursor-pointer hover:bg-theme-bg-tertiary transition-colors flex items-center justify-center"
        onClick={() => setCollapsed(false)}
        title="Talk to Coach"
      >
        <span
          className="text-[10px] font-semibold text-theme-secondary select-none whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '0.06em' }}
        >
          Talk to Coach
        </span>
      </div>
    );
  }

  // ── Expanded panel ──
  return (
    <div className="flex-[1] min-w-0 border-l border-theme-border flex flex-col bg-theme-bg-secondary" style={{ minWidth: 180 }}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-theme-border flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-6 h-6 rounded-md bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-500 text-[10px] font-bold">EC</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-theme-primary truncate">Educator Coach</p>
            {triggerDimension && (
              <p className="text-[10px] text-theme-secondary truncate">Focus: {triggerDimension}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="p-1 rounded hover:bg-theme-bg-tertiary transition-colors"
            title="Conversation history"
          >
            <Icon icon={Clock01IconData} className="w-3.5 text-theme-muted" />
          </button>
          {/* Collapse button */}
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 rounded hover:bg-theme-bg-tertiary transition-colors"
            title="Collapse panel"
          >
            <svg className="w-3.5 h-3.5 text-theme-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* History dropdown */}
      {showHistory && (
        <div className="border-b border-theme-border bg-theme-bg-secondary px-3 py-2 max-h-40 overflow-y-auto flex-shrink-0">
          <button
            onClick={startNewConversation}
            className="w-full text-left px-2 py-1.5 text-xs text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md mb-1"
          >
            + New conversation
          </button>
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => loadConversation(conv.id)}
              className={`w-full text-left px-2 py-1.5 text-xs rounded-md hover:bg-theme-bg-tertiary ${
                chatIdRef.current === conv.id ? 'bg-theme-bg-tertiary font-medium' : ''
              }`}
            >
              <span className="text-theme-primary truncate block">{conv.title || 'Untitled'}</span>
              {conv.dimension_focus && (
                <span className="text-[10px] text-theme-muted">({conv.dimension_focus})</span>
              )}
            </button>
          ))}
          {conversations.length === 0 && (
            <p className="text-[10px] text-theme-muted px-2 py-1">No previous conversations</p>
          )}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 min-h-0">
        {messages.length === 0 && !isStreaming && (
          <div className="text-center py-6 px-2">
            <p className="text-xs text-theme-secondary mb-1">
              {triggerDimension
                ? `Let's work on improving your ${triggerDimension} score.`
                : 'Ask me about your teaching metrics or how to improve.'}
            </p>
            <p className="text-[10px] text-theme-muted">
              I have context about your performance and can suggest concrete steps.
            </p>
          </div>
        )}

        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-xl px-2.5 py-1.5 text-xs ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-theme-bg text-theme-primary border border-theme-border'
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}

        {/* Streaming message */}
        {isStreaming && streamingContent && (
          <div className="flex justify-start">
            <div className="max-w-[90%] rounded-xl px-2.5 py-1.5 text-xs bg-theme-bg text-theme-primary border border-theme-border">
              <p className="whitespace-pre-wrap leading-relaxed">{streamingContent}</p>
            </div>
          </div>
        )}

        {/* Thinking indicator */}
        {isStreaming && !streamingContent && (
          <div className="flex justify-start">
            <div className="rounded-xl px-2.5 py-1.5 text-xs bg-theme-bg border border-theme-border">
              <span className="text-theme-muted animate-pulse">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-2 border-t border-theme-border flex-shrink-0">
        <div className="flex items-end gap-1.5">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask the Educator Coach..."
            className="flex-1 resize-none rounded-lg px-2.5 py-1.5 text-xs bg-theme-bg border border-theme-border text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            rows={1}
            style={{ maxHeight: 100 }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            className="p-1.5 rounded-lg bg-blue-500 text-white disabled:opacity-40 hover:bg-blue-600 transition-colors flex-shrink-0"
          >
            <Icon icon={SentIconData} className="w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsightsCoachPanel;
