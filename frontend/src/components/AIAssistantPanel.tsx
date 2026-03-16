import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import Message01IconData from '@hugeicons/core-free-icons/Message01Icon';
import MagicWand01IconData from '@hugeicons/core-free-icons/MagicWand01Icon';
import SentIconData from '@hugeicons/core-free-icons/SentIcon';


const IconW: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Cancel01IconData} {...p} />;
const MessageSquare: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Message01IconData} {...p} />;
const Wand2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={MagicWand01IconData} {...p} />;
const Send: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={SentIconData} {...p} />;

import { HeartbeatLoader } from './ui/HeartbeatLoader';
import { getWebSocketUrl, isElectronEnvironment } from '../config/api.config';
import SmartTextArea from './SmartTextArea';

interface AIAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  contentType: 'lesson' | 'quiz' | 'rubric' | 'kindergarten' | 'multigrade' | 'cross-curricular';
  onContentUpdate: (newContent: string) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  isOpen,
  onClose,
  content,
  contentType,
  onContentUpdate
}) => {
  const [mode, setMode] = useState<'chat' | 'modify'>('chat');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [modifyMessages, setModifyMessages] = useState<Message[]>([]);
  const messages = mode === 'chat' ? chatMessages : modifyMessages;
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const shouldReconnectRef = useRef(true);
  // Use a ref to track accumulated streaming content (fixes stale closure bug)
  const streamingContentRef = useRef('');
  // Track current mode in a ref for use in callbacks
  const modeRef = useRef(mode);
  modeRef.current = mode;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  useEffect(() => {
    if (!isOpen) return;

    shouldReconnectRef.current = true;

    const connectWebSocket = () => {
      if (!shouldReconnectRef.current) return;

      try {
        // Always use /ws/chat for both chat and modify modes
        const endpoint = '/ws/chat';
        const wsUrl = getWebSocketUrl(endpoint, isElectronEnvironment());
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log('AI Assistant WebSocket connected');
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.type === 'token') {
            // Accumulate in ref (always current) and sync to state
            streamingContentRef.current += data.content;
            setStreamingMessage(streamingContentRef.current);
          }
          else if (data.type === 'done') {
            // Read from ref — always has the full accumulated content
            const finalMessage = streamingContentRef.current;

            if (finalMessage.trim()) {
              if (modeRef.current === 'modify') {
                onContentUpdate(finalMessage);
              }

              const assistantMsg: Message = { role: 'assistant', content: finalMessage };
              if (modeRef.current === 'chat') {
                setChatMessages(prev => [...prev, assistantMsg]);
              } else {
                setModifyMessages(prev => [...prev, assistantMsg]);
              }
            }

            // Reset streaming state
            streamingContentRef.current = '';
            setStreamingMessage('');
            setIsStreaming(false);
          }
          else if (data.type === 'error') {
            console.error('AI Assistant error:', data.message);
            streamingContentRef.current = '';
            setStreamingMessage('');
            setIsStreaming(false);
          }
        };

        ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsStreaming(false);
        };

        ws.onclose = () => {
          console.log('WebSocket closed');
          wsRef.current = null;
          if (shouldReconnectRef.current && isOpen) {
            setTimeout(connectWebSocket, 2000);
          }
        };

        wsRef.current = ws;
      } catch (error) {
        console.error('Failed to create WebSocket:', error);
        if (shouldReconnectRef.current) {
          setTimeout(connectWebSocket, 2000);
        }
      }
    };

    connectWebSocket();

    return () => {
      shouldReconnectRef.current = false;
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      wsRef.current = null;
    };
  }, [isOpen, mode, contentType]);

  const getContentTypeLabel = () => {
    const labels: Record<string, string> = {
      'lesson': 'Lesson Plan',
      'quiz': 'Quiz',
      'rubric': 'Rubric',
      'kindergarten': 'Early Childhood Plan',
      'multigrade': 'Multi-Level Plan',
      'cross-curricular': 'Integrated Lesson Plan'
    };
    return labels[contentType];
  };

  const buildSystemPrompt = useCallback(() => {
    if (mode === 'chat') {
      return `You are a helpful AI assistant for educators. The user has generated the following ${getContentTypeLabel()} and wants to discuss it with you. Answer their questions about the content, provide insights, or offer suggestions.

GENERATED CONTENT:
${content}

Provide clear, helpful responses about this content. Be specific and reference parts of the content when relevant.`;
    } else {
      return `You are an AI assistant that helps modify educational content. The user has generated the following ${getContentTypeLabel()} and wants you to make specific modifications to it.

CURRENT CONTENT:
${content}

IMPORTANT INSTRUCTIONS:
- When the user requests modifications, generate the COMPLETE UPDATED VERSION of the entire content with their requested changes applied.
- Return ONLY the modified content, not explanations or commentary.
- Preserve the overall structure and formatting of the original content.
- Apply the requested changes precisely and thoroughly.`;
    }
  }, [mode, content, contentType]);

  const handleSend = () => {
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const userMessage: Message = { role: 'user', content: input };
    const currentMessages = mode === 'chat' ? chatMessages : modifyMessages;

    if (mode === 'chat') {
      setChatMessages(prev => [...prev, userMessage]);
    } else {
      setModifyMessages(prev => [...prev, userMessage]);
    }

    setIsStreaming(true);
    streamingContentRef.current = '';
    setStreamingMessage('');

    // Build conversation history for multi-turn context (last 6 messages)
    const recentHistory = currentMessages.slice(-6).map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    try {
      wsRef.current.send(JSON.stringify({
        message: input,
        system_prompt: buildSystemPrompt(),
        history: recentHistory,
      }));
      setInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl h-full bg-theme-surface shadow-2xl flex flex-col animate-slideInRight">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Assistant</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <p className="text-purple-100 text-sm mb-4">
            Working with: {getContentTypeLabel()}
          </p>

          {/* Mode Toggle */}
          <div className="flex gap-2 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => {
                if (wsRef.current) wsRef.current.close();
                setMode('chat');
                streamingContentRef.current = '';
                setStreamingMessage('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition ${
                mode === 'chat'
                  ? 'bg-white text-purple-600 font-semibold'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              Chat
            </button>
            <button
              onClick={() => {
                if (wsRef.current) wsRef.current.close();
                setMode('modify');
                streamingContentRef.current = '';
                setStreamingMessage('');
              }}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition ${
                mode === 'modify'
                  ? 'bg-white text-purple-600 font-semibold'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              Modify
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className={`px-6 py-3 text-sm ${
          mode === 'chat'
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
            : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
        }`}>
          {mode === 'chat' ? (
            <p>Ask questions about your {getContentTypeLabel().toLowerCase()} or request insights and suggestions.</p>
          ) : (
            <p>Describe the changes you want and your {getContentTypeLabel().toLowerCase()} will be updated accordingly.</p>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && !streamingMessage && (
            <div className="text-center text-theme-hint mt-12">
              <div className="text-6xl mb-4">
                {mode === 'chat' ? '\uD83D\uDCAD' : '\uD83E\uDE84'}
              </div>
              <p className="text-sm">
                {mode === 'chat'
                  ? 'Ask anything about your content'
                  : 'Describe the changes you\'d like'
                }
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-purple-600 text-white'
                    : 'bg-theme-tertiary text-theme-heading'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {streamingMessage && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-theme-tertiary text-theme-heading">
                <p className="whitespace-pre-wrap">{streamingMessage}</p>
                <span className="inline-flex items-center ml-1">
                  <span className="w-0.5 h-5 bg-purple-500 animate-pulse rounded-full"></span>
                </span>
              </div>
            </div>
          )}

          {isStreaming && !streamingMessage && (
            <div className="flex justify-start">
              <div className="rounded-2xl px-4 py-3 bg-theme-tertiary">
                <HeartbeatLoader className="w-5 h-5 text-theme-muted" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-theme p-4 bg-theme-secondary">
          <div className="flex gap-2">
            <SmartTextArea
              value={input}
              onChange={setInput}
              onKeyPress={handleKeyPress}
              placeholder={
                mode === 'chat'
                  ? 'Ask a question about your content...'
                  : 'Describe the modifications you want...'
              }
              className="flex-1 px-4 py-3 border border-theme-strong rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              disabled={isStreaming}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="px-6 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isStreaming ? (
                <HeartbeatLoader className="w-5 h-5" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
