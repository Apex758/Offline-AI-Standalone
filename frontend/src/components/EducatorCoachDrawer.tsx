import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import SentIconData from '@hugeicons/core-free-icons/SentIcon';
import Clock01IconData from '@hugeicons/core-free-icons/Clock01Icon';
import axios from 'axios';
import type { TeacherMetrics, ConsultantConversation } from '../types/insights';

const Icon: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface EducatorCoachDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: TeacherMetrics | null;
  triggerDimension?: string;
  teacherId: string;
  currentChatId?: string | null;
  onChatIdChange?: (chatId: string) => void;
}

const EducatorCoachDrawer: React.FC<EducatorCoachDrawerProps> = ({
  isOpen,
  onClose,
  metrics,
  triggerDimension,
  teacherId,
  currentChatId,
  onChatIdChange,
}) => {
  const { t } = useTranslation();
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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Load conversations list
  useEffect(() => {
    if (isOpen) {
      axios.get(`/api/consultant/conversations?teacher_id=${encodeURIComponent(teacherId)}`)
        .then(res => setConversations(res.data?.conversations || []))
        .catch(() => {});
    }
  }, [isOpen, teacherId]);

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

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full z-50 flex flex-col bg-theme-bg border-l border-theme-border shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: 'min(45vw, 600px)', minWidth: 360 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-theme-border bg-theme-bg-secondary">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <span className="text-blue-500 text-sm font-bold">EC</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-theme-primary">{t('educator.educatorCoach')}</h3>
              <p className="text-xs text-theme-secondary">
                {triggerDimension ? `Focus: ${triggerDimension}` : 'Teaching improvement advisor'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-1.5 rounded-lg hover:bg-theme-bg-tertiary transition-colors"
              title="Conversation history"
            >
              <Icon icon={Clock01IconData} className="w-4 text-theme-muted" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-theme-bg-tertiary transition-colors"
            >
              <Icon icon={Cancel01IconData} className="w-4 text-theme-muted" />
            </button>
          </div>
        </div>

        {/* History dropdown */}
        {showHistory && (
          <div className="border-b border-theme-border bg-theme-bg-secondary px-4 py-2 max-h-48 overflow-y-auto">
            <button
              onClick={startNewConversation}
              className="w-full text-left px-3 py-2 text-sm text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg mb-1"
            >
              + New conversation
            </button>
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => loadConversation(conv.id)}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-theme-bg-tertiary ${
                  chatIdRef.current === conv.id ? 'bg-theme-bg-tertiary font-medium' : ''
                }`}
              >
                <span className="text-theme-primary">{conv.title || 'Untitled'}</span>
                {conv.dimension_focus && (
                  <span className="text-xs text-theme-muted ml-2">({conv.dimension_focus})</span>
                )}
              </button>
            ))}
            {conversations.length === 0 && (
              <p className="text-xs text-theme-muted px-3 py-2">{t('educator.noPreviousConversations')}</p>
            )}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && !isStreaming && (
            <div className="text-center py-8">
              <p className="text-sm text-theme-secondary mb-2">
                {triggerDimension
                  ? `Let's work on improving your ${triggerDimension} score.`
                  : 'Ask me about your teaching metrics or how to improve.'}
              </p>
              <p className="text-xs text-theme-muted">
                I have context about your performance data and can suggest concrete steps.
              </p>
            </div>
          )}

          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-theme-bg-secondary text-theme-primary border border-theme-border'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {/* Streaming message */}
          {isStreaming && streamingContent && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-xl px-3 py-2 text-sm bg-theme-bg-secondary text-theme-primary border border-theme-border">
                <p className="whitespace-pre-wrap">{streamingContent}</p>
              </div>
            </div>
          )}

          {/* Thinking indicator */}
          {isStreaming && !streamingContent && (
            <div className="flex justify-start">
              <div className="rounded-xl px-3 py-2 text-sm bg-theme-bg-secondary border border-theme-border">
                <span className="text-theme-muted animate-pulse">{t('chat.thinking')}</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-theme-border bg-theme-bg-secondary">
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('educator.askCoach')}
              className="flex-1 resize-none rounded-xl px-3 py-2 text-sm bg-theme-bg border border-theme-border text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              rows={1}
              style={{ maxHeight: 120 }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isStreaming}
              className="p-2 rounded-xl bg-blue-500 text-white disabled:opacity-40 hover:bg-blue-600 transition-colors"
            >
              <Icon icon={SentIconData} className="w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EducatorCoachDrawer;
