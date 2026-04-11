import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import Cancel01IconData from '@hugeicons/core-free-icons/Cancel01Icon';
import Message01IconData from '@hugeicons/core-free-icons/Message01Icon';
import MagicWand01IconData from '@hugeicons/core-free-icons/MagicWand01Icon';
import SentIconData from '@hugeicons/core-free-icons/SentIcon';
import AnalysisIconData from '@hugeicons/core-free-icons/AnalysisTextLinkIcon';
import ArrowLeft02IconData from '@hugeicons/core-free-icons/ArrowLeft02Icon';


const IconW: React.FC<{ icon: any; className?: string; style?: React.CSSProperties }> = ({ icon, className = '', style }) => {
  const sizeMatch = className.match(/w-(\d+(?:\.\d+)?)/);
  const size = sizeMatch ? parseFloat(sizeMatch[1]) * 4 : 20;
  return <HugeiconsIcon icon={icon} size={size} className={className} style={style} />;
};

const X: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Cancel01IconData} {...p} />;
const MessageSquare: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={Message01IconData} {...p} />;
const Wand2: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={MagicWand01IconData} {...p} />;
const Send: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={SentIconData} {...p} />;
const Analyse: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={AnalysisIconData} {...p} />;
const Undo: React.FC<{ className?: string; style?: React.CSSProperties }> = (p) => <IconW icon={ArrowLeft02IconData} {...p} />;

import { HeartbeatLoader } from './ui/HeartbeatLoader';
import { getWebSocketUrl, isElectronEnvironment } from '../config/api.config';
import SmartTextArea from './SmartTextArea';
import { NeuroSegment } from './ui/NeuroSegment';

type PanelMode = 'chat' | 'modify' | 'analyse';
type ContentType = 'lesson' | 'quiz' | 'rubric' | 'kindergarten' | 'multigrade'
  | 'cross-curricular' | 'worksheet' | 'presentation' | 'storybook';

interface AIAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  contentType: ContentType;
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
  const { t } = useTranslation();
  const [mode, setMode] = useState<PanelMode>('chat');
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [modifyMessages, setModifyMessages] = useState<Message[]>([]);
  const [analyseMessages, setAnalyseMessages] = useState<Message[]>([]);
  const messages = mode === 'chat' ? chatMessages : mode === 'modify' ? modifyMessages : analyseMessages;
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

  // ── Feature 4: Analyse mode state ─────────────────────────────────
  // Ephemeral session id (server generates or echoes this)
  const analyseSessionIdRef = useRef<string>('');
  // Content snapshot stack for undo. Populated on every section/enhance commit.
  const [analyseHistory, setAnalyseHistory] = useState<string[]>([]);
  // Per-section streaming buffers keyed by section id
  const sectionBufsRef = useRef<Record<string, string>>({});
  // Current progress label (e.g. "Expanding objectives...")
  const [analyseProgress, setAnalyseProgress] = useState<string>('');
  // Per-message thinking mode for analyse (Feature 2: local toggle)
  const [analyseThinkingMode, setAnalyseThinkingMode] = useState<'quick' | 'deep'>('deep');
  const analyseThinkingRef = useRef(analyseThinkingMode);
  analyseThinkingRef.current = analyseThinkingMode;

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
        // Feature 4: analyse mode connects to /ws/analyse; chat/modify still use /ws/chat
        const endpoint = modeRef.current === 'analyse' ? '/ws/analyse' : '/ws/chat';
        const wsUrl = getWebSocketUrl(endpoint, isElectronEnvironment());
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
          console.log(`AI Assistant WebSocket connected (${endpoint})`);
          // On analyse mode: send init immediately so the server builds a session
          if (modeRef.current === 'analyse') {
            const sessionId = analyseSessionIdRef.current || crypto.randomUUID();
            analyseSessionIdRef.current = sessionId;
            try {
              ws.send(JSON.stringify({
                type: 'init',
                session_id: sessionId,
                content,
                content_type: contentType,
              }));
            } catch (e) {
              console.error('Failed to send analyse init:', e);
            }
          }
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);

          // ── Feature 4: analyse-mode message types ─────────────────
          if (modeRef.current === 'analyse') {
            if (data.type === 'greeting') {
              // Server's opening line
              setAnalyseMessages([{ role: 'assistant', content: data.content }]);
              setIsStreaming(false);
              return;
            }
            if (data.type === 'progress') {
              setAnalyseProgress(data.label || `Updating ${data.section}...`);
              sectionBufsRef.current[data.section] = '';
              return;
            }
            if (data.type === 'section_token') {
              sectionBufsRef.current[data.section] = (sectionBufsRef.current[data.section] || '') + (data.content || '');
              // Show the in-progress section buffer as the live streaming message
              streamingContentRef.current = `**${analyseProgress || data.section}**\n\n` + sectionBufsRef.current[data.section];
              setStreamingMessage(streamingContentRef.current);
              return;
            }
            if (data.type === 'section_done') {
              // A full section replacement finished. If the server sent full_content, push that.
              if (data.full_content) {
                // Snapshot previous content for undo
                setAnalyseHistory(prev => [...prev, content]);
                onContentUpdate(data.full_content);
                setAnalyseMessages(prev => [...prev, {
                  role: 'assistant',
                  content: `Updated the **${data.section}** section. Click undo to revert.`,
                }]);
              }
              sectionBufsRef.current[data.section] = '';
              streamingContentRef.current = '';
              setStreamingMessage('');
              setAnalyseProgress('');
              setIsStreaming(false);
              return;
            }
            if (data.type === 'enhance_complete') {
              // End of a whole-document enhance pass. Server has the rebuilt content.
              if (data.full_content) {
                setAnalyseHistory(prev => [...prev, content]);
                onContentUpdate(data.full_content);
                setAnalyseMessages(prev => [...prev, {
                  role: 'assistant',
                  content: 'Enhanced the full document. All sections were updated. Click undo to revert.',
                }]);
              }
              sectionBufsRef.current = {};
              streamingContentRef.current = '';
              setStreamingMessage('');
              setAnalyseProgress('');
              setIsStreaming(false);
              return;
            }
            if (data.type === 'token') {
              // Plain chat reply (no content modification)
              streamingContentRef.current += data.content;
              setStreamingMessage(streamingContentRef.current);
              return;
            }
            if (data.type === 'done') {
              const finalMessage = streamingContentRef.current;
              if (finalMessage.trim()) {
                setAnalyseMessages(prev => [...prev, { role: 'assistant', content: finalMessage }]);
              }
              streamingContentRef.current = '';
              setStreamingMessage('');
              setIsStreaming(false);
              return;
            }
            if (data.type === 'error') {
              console.error('Analyse error:', data.message);
              setAnalyseMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.message}` }]);
              streamingContentRef.current = '';
              setStreamingMessage('');
              setAnalyseProgress('');
              setIsStreaming(false);
              return;
            }
            return;
          }

          // ── Legacy chat/modify flow (unchanged) ───────────────────
          if (data.type === 'token') {
            streamingContentRef.current += data.content;
            setStreamingMessage(streamingContentRef.current);
          }
          else if (data.type === 'done') {
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
      // On analyse mode, tell the server to discard the ephemeral session before closing
      if (modeRef.current === 'analyse' && wsRef.current && wsRef.current.readyState === WebSocket.OPEN && analyseSessionIdRef.current) {
        try {
          wsRef.current.send(JSON.stringify({ type: 'close', session_id: analyseSessionIdRef.current }));
        } catch {/* ignore */}
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close();
      }
      wsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, mode, contentType]);

  const getContentTypeLabel = () => {
    const labels: Record<string, string> = {
      'lesson': 'Lesson Plan',
      'quiz': 'Quiz',
      'rubric': 'Rubric',
      'kindergarten': 'Early Childhood Plan',
      'multigrade': 'Multi-Level Plan',
      'cross-curricular': 'Integrated Lesson Plan',
      'worksheet': 'Worksheet',
      'presentation': 'Presentation',
      'storybook': 'Storybook',
    };
    return labels[contentType] || 'Content';
  };

  const buildSystemPrompt = useCallback(() => {
    if (mode === 'chat') {
      return `You are a teaching assistant helping a Caribbean primary school teacher review their generated ${getContentTypeLabel()}.

CONTENT:
${content}

### Instructions
- Answer questions about this content directly. Reference specific sections when useful.
- Offer concrete suggestions, not general praise.
- Keep responses concise. Match depth to the question.
- No filler. No "Great question!" openers.
- Offline-first: no internet-dependent suggestions.`;
    } else {
      return `You are an AI assistant that edits educational content for Caribbean primary school teachers.

CURRENT ${getContentTypeLabel()}:
${content}

### Instructions
- Apply the teacher's requested changes precisely and completely.
- Return ONLY the full updated content -- no commentary, no explanation, no preamble.
- Preserve original structure and formatting.
- Do not add sections the teacher did not request.
- Offline-first: no internet-dependent content.`;
    }
  }, [mode, content, contentType]);

  // Feature 4: Fire a whole-document enhance pass
  const handleAnalyseEnhance = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    if (!analyseSessionIdRef.current) return;
    setAnalyseMessages(prev => [...prev, { role: 'user', content: '[Enhance the full document]' }]);
    setIsStreaming(true);
    streamingContentRef.current = '';
    setStreamingMessage('');
    setAnalyseProgress('Starting enhancement...');
    try {
      wsRef.current.send(JSON.stringify({
        type: 'enhance',
        session_id: analyseSessionIdRef.current,
        thinking_mode: analyseThinkingRef.current,
      }));
    } catch (e) {
      console.error('Failed to send enhance:', e);
      setIsStreaming(false);
      setAnalyseProgress('');
    }
  };

  // Feature 4: Undo the most recent analyse-driven content change
  const handleAnalyseUndo = () => {
    if (analyseHistory.length === 0) return;
    const previous = analyseHistory[analyseHistory.length - 1];
    onContentUpdate(previous);
    setAnalyseHistory(prev => prev.slice(0, -1));
    // Tell the server the content has changed so future section edits use the reverted version.
    // Simplest path: re-init the session with the reverted content.
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({
          type: 'init',
          session_id: analyseSessionIdRef.current,
          content: previous,
          content_type: contentType,
        }));
      } catch {/* ignore */}
    }
    setAnalyseMessages(prev => [...prev, { role: 'assistant', content: 'Reverted the last change.' }]);
  };

  const handleSend = () => {
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const userMessage: Message = { role: 'user', content: input };

    // ── Feature 4: Analyse mode ────────────────────────────────────
    if (mode === 'analyse') {
      setAnalyseMessages(prev => [...prev, userMessage]);
      setIsStreaming(true);
      streamingContentRef.current = '';
      setStreamingMessage('');

      // Simple intent detection:
      //   - "edit the <section> section" / "expand the <section>" -> edit_section
      //   - otherwise -> chat (server uses it as a plain question about the content)
      const lower = input.toLowerCase();
      const editMatch = lower.match(/\b(?:edit|expand|rewrite|improve|update|revise|fix)\s+(?:the\s+)?([a-z_ -]+?)\s+section\b/);
      const sectionHint = editMatch ? editMatch[1].trim().replace(/\s+/g, '_') : null;

      try {
        if (sectionHint) {
          wsRef.current.send(JSON.stringify({
            type: 'edit_section',
            session_id: analyseSessionIdRef.current,
            target_section: sectionHint,
            instruction: input,
            thinking_mode: analyseThinkingRef.current,
          }));
        } else {
          wsRef.current.send(JSON.stringify({
            type: 'chat',
            session_id: analyseSessionIdRef.current,
            message: input,
            thinking_mode: analyseThinkingRef.current,
          }));
        }
        setInput('');
      } catch (error) {
        console.error('Failed to send analyse message:', error);
        setIsStreaming(false);
      }
      return;
    }

    // ── Legacy chat/modify flow ────────────────────────────────────
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
              <h2 className="text-2xl font-bold">{t('assistant.title')}</h2>
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
          <NeuroSegment
            options={[
              { value: 'chat',    label: 'Chat',    icon: <MessageSquare className="w-4 h-4" /> },
              { value: 'modify',  label: 'Modify',  icon: <Wand2 className="w-4 h-4" /> },
              { value: 'analyse', label: 'Analyse', icon: <Analyse className="w-4 h-4" /> },
            ]}
            value={mode}
            onChange={(v) => {
              if (wsRef.current) wsRef.current.close();
              setMode(v as PanelMode);
              streamingContentRef.current = '';
              setStreamingMessage('');
              setAnalyseProgress('');
              sectionBufsRef.current = {};
              // Keep analyseHistory across mode switches so undo still works
            }}
            size="md"
            variant="invert"
          />

          {/* Feature 4: Analyse-mode secondary controls */}
          {mode === 'analyse' && (
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <button
                onClick={handleAnalyseEnhance}
                disabled={isStreaming}
                className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5" />
                Enhance full document
              </button>
              <button
                onClick={handleAnalyseUndo}
                disabled={analyseHistory.length === 0 || isStreaming}
                className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-medium transition disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1.5"
                title={analyseHistory.length > 0 ? `Undo (${analyseHistory.length} step${analyseHistory.length === 1 ? '' : 's'})` : 'Nothing to undo'}
              >
                <Undo className="w-3.5 h-3.5" />
                Undo {analyseHistory.length > 0 ? `(${analyseHistory.length})` : ''}
              </button>
              <div className="ml-auto flex items-center gap-1.5 text-xs">
                <span className="text-white/70">Thinking:</span>
                <button
                  onClick={() => setAnalyseThinkingMode('quick')}
                  className={`px-2 py-1 rounded-md transition ${analyseThinkingMode === 'quick' ? 'bg-white text-purple-700 font-medium' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
                >Quick</button>
                <button
                  onClick={() => setAnalyseThinkingMode('deep')}
                  className={`px-2 py-1 rounded-md transition ${analyseThinkingMode === 'deep' ? 'bg-white text-purple-700 font-medium' : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
                >Deep</button>
              </div>
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className={`px-6 py-3 text-sm ${
          mode === 'chat'
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
            : mode === 'modify'
            ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
            : 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
        }`}>
          {mode === 'chat' && (
            <p>Ask questions about your {getContentTypeLabel().toLowerCase()} or request insights and suggestions.</p>
          )}
          {mode === 'modify' && (
            <p>Describe the changes you want and your {getContentTypeLabel().toLowerCase()} will be updated accordingly.</p>
          )}
          {mode === 'analyse' && (
            <p>Enhance the whole {getContentTypeLabel().toLowerCase()} or edit one section at a time. Say "expand the <em>assessment</em> section" to rewrite just one part.</p>
          )}
        </div>

        {/* Feature 4: section-streaming progress indicator */}
        {mode === 'analyse' && analyseProgress && (
          <div className="px-6 py-2 bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200 text-xs flex items-center gap-2 border-b border-purple-200 dark:border-purple-700">
            <HeartbeatLoader className="w-3 h-3" />
            <span>{analyseProgress}</span>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && !streamingMessage && (
            <div className="text-center text-theme-hint mt-12">
              <div className="text-6xl mb-4">
                {mode === 'chat' ? '\uD83D\uDCAD' : mode === 'modify' ? '\uD83E\uDE84' : '\uD83D\uDD0D'}
              </div>
              <p className="text-sm">
                {mode === 'chat' && 'Ask anything about your content'}
                {mode === 'modify' && "Describe the changes you'd like"}
                {mode === 'analyse' && 'Click Enhance full document or type a section instruction'}
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
                  : mode === 'modify'
                  ? 'Describe the modifications you want...'
                  : 'Ask or say "expand the assessment section"...'
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
