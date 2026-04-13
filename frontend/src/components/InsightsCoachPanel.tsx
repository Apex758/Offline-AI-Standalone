import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react';
import SentIconData from '@hugeicons/core-free-icons/SentIcon';
import Clock01IconData from '@hugeicons/core-free-icons/Clock01Icon';
import axios from 'axios';
import type { TeacherMetrics, ConsultantConversation } from '../types/insights';
import type { DimensionClickContext } from './InsightsGraphRow';
import { API_CONFIG, getWebSocketUrl, isElectronEnvironment } from '../config/api.config';
import { useSettings } from '../contexts/SettingsContext';

// ── Bubble Rise + Fade Wrapper ──
const COACH_RISE_CSS = `
  @keyframes coachBubbleRise {
    0%   { transform: translateY(48px); opacity: 0; }
    100% { transform: translateY(0px);  opacity: 1; }
  }
  .coach-bubble-hidden { opacity: 0; pointer-events: none; }
  .coach-bubble-rise   { animation: coachBubbleRise 0.48s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
`;
let _coachRiseInjected = false;

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!_coachRiseInjected) {
      const s = document.createElement('style');
      s.textContent = COACH_RISE_CSS;
      document.head.appendChild(s);
      _coachRiseInjected = true;
    }
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div className={visible ? 'coach-bubble-rise' : 'coach-bubble-hidden'}>{children}</div>
  );
}

function buildDimensionAutoMessage(dimension: string, ctx: DimensionClickContext): string {
  const gradeChar = ctx.grade.charAt(0);
  const phasePart = ctx.phaseLabel ? ` We're in ${ctx.phaseLabel} phase right now.` : '';
  const weightPart = `It carries ${Math.round(ctx.weight * 100)}% of my composite score.`;
  const keyFacts = ctx.breakdown.slice(0, 2).map(b => `${b.label}: ${b.value}`).join(', ');

  if (gradeChar === 'A') {
    return `My ${dimension} score is ${ctx.grade} (${ctx.score}/100) — I'm happy with it!${phasePart} ${weightPart} I want to understand what's keeping it strong and how to maintain it. Here's where things stand: ${keyFacts}.`;
  } else if (gradeChar === 'B' || gradeChar === 'C') {
    return `I want to improve my ${dimension} score — it's ${ctx.grade} (${ctx.score}/100) right now.${phasePart} ${weightPart} What's holding it back? Here's the data: ${keyFacts}.`;
  } else {
    return `I need help with my ${dimension} score — it's ${ctx.grade} (${ctx.score}/100) and I want to understand why and fix it.${phasePart} ${weightPart} Here's where things stand: ${keyFacts}.`;
  }
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const TOPIC_BUBBLES = [
  { label: 'Curriculum', message: "Let's review my curriculum coverage. How am I doing and what gaps should I focus on?" },
  { label: 'Performance', message: "I'd like to go over my students' performance data. What trends or concerns stand out?" },
  { label: 'Content Creation', message: "Can you review my content creation? I want to know if I'm creating enough variety and volume." },
  { label: 'Attendance', message: "Help me understand my attendance and student engagement data." },
  { label: 'Achievements', message: "Let's talk about my achievement and engagement score — how can I improve it?" },
  { label: 'Overall', message: "Give me a general overview of my teaching effectiveness and the best area to focus on first." },
];

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
  dimensionContext?: DimensionClickContext;
  autoTriggerKey?: number;
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
  dimensionContext,
  autoTriggerKey,
  teacherId,
  currentChatId,
  onChatIdChange,
  collapsed: controlledCollapsed,
  onCollapsedChange,
}) => {
  const { t } = useTranslation();
  const { settings } = useSettings();
  const tabColor = settings.tabColors['educator-insights'] ?? '#d97706';

  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const setCollapsed = (val: boolean) => {
    if (onCollapsedChange) onCollapsedChange(val);
    else setInternalCollapsed(val);
  };

  // Delayed state: background color only applies after the width animation finishes
  const [fullyCollapsed, setFullyCollapsed] = useState(false);
  useEffect(() => {
    if (collapsed) {
      const t = setTimeout(() => setFullyCollapsed(true), 310);
      return () => clearTimeout(t);
    } else {
      setFullyCollapsed(false);
    }
  }, [collapsed]);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [conversations, setConversations] = useState<ConsultantConversation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showTopicPicker, setShowTopicPicker] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [topicDismissing, setTopicDismissing] = useState(false);

  // Topic is required unless this is a dimension coaching session
  const isTopicRequired = !triggerDimension;

  const wsRef = useRef<WebSocket | null>(null);
  const chatIdRef = useRef<string | null>(currentChatId || null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // Always holds latest sendMessage so the auto-trigger effect can call it without stale closure
  const sendMessageRef = useRef<(override?: string) => void>(() => {});

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  useEffect(() => {
    if (!collapsed) {
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [collapsed]);

  useEffect(() => {
    if (!collapsed) {
      axios.get(`${API_CONFIG.BASE_URL}/api/consultant/conversations?teacher_id=${encodeURIComponent(teacherId)}`)
        .then(res => setConversations(res.data?.conversations || []))
        .catch(() => {});
    }
  }, [collapsed, teacherId]);

  useEffect(() => {
    if (currentChatId) {
      chatIdRef.current = currentChatId;
      axios.get(`${API_CONFIG.BASE_URL}/api/consultant/conversation/${currentChatId}`)
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

  // Auto-send when a dimension coaching session is triggered
  useEffect(() => {
    if (!autoTriggerKey || !triggerDimension || !dimensionContext) return;
    // Reset conversation for a clean focused session
    chatIdRef.current = null;
    onChatIdChange?.('');
    setMessages([]);
    setShowHistory(false);
    setShowTopicPicker(false);
    setSelectedTopic(null);
    // Wait for panel open animation then auto-send
    const t = setTimeout(() => {
      const msg = buildDimensionAutoMessage(triggerDimension, dimensionContext);
      sendMessageRef.current(msg);
    }, 450);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoTriggerKey]);

  const sendMessage = useCallback((overrideText?: string) => {
    const content = overrideText !== undefined ? overrideText : input.trim();
    if (!content || isStreaming) return;
    // Block send if topic is required and not selected (auto-trigger passes overrideText so it bypasses)
    if (overrideText === undefined && isTopicRequired && selectedTopic === null) return;

    const userMsg: Message = {
      id: String(Date.now()),
      role: 'user',
      content,
    };
    setMessages(prev => [...prev, userMsg]);
    if (overrideText === undefined) setInput('');
    setIsStreaming(true);
    setStreamingContent('');

    const ws = new WebSocket(getWebSocketUrl('/ws/consultant', isElectronEnvironment()));
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({
        message: userMsg.content,
        chat_id: chatIdRef.current,
        metrics_context: metrics,
        trigger_dimension: triggerDimension,
        dimension_context: dimensionContext ?? null,
        topic_context: selectedTopic,
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

    ws.onerror = () => { setIsStreaming(false); setStreamingContent(''); };
    ws.onclose = () => { wsRef.current = null; };
  }, [input, isStreaming, isTopicRequired, selectedTopic, metrics, triggerDimension, dimensionContext, teacherId, onChatIdChange]);

  // Keep ref current so auto-trigger effect always calls the latest version
  useEffect(() => { sendMessageRef.current = sendMessage; }, [sendMessage]);

  const loadConversation = (convId: string) => {
    onChatIdChange?.(convId);
    chatIdRef.current = convId;
    setShowHistory(false);
    axios.get(`${API_CONFIG.BASE_URL}/api/consultant/conversation/${convId}`)
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
    setShowTopicPicker(true);
    setSelectedTopic(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isTopicRequired || selectedTopic !== null) sendMessage();
    }
  };

  return (
    <div
      data-tutorial="ei-coach-panel"
      className="relative flex-shrink-0 border-l border-theme-border flex flex-col"
      style={{
        width: collapsed ? '3.5rem' : '40%',
        minWidth: '3.5rem',
        transition: 'width 300ms ease-in-out, background 400ms ease-in-out',
        background: fullyCollapsed
          ? `linear-gradient(160deg, ${hexToRgba(tabColor, 0.13)}, ${hexToRgba(tabColor, 0.06)})`
          : 'var(--bg-secondary, #f9fafb)',
        backdropFilter: fullyCollapsed ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: fullyCollapsed ? 'blur(10px)' : 'none',
        overflow: 'hidden',
      }}
    >
      {/* ── Collapsed overlay ── */}
      <div
        className="absolute inset-0 flex items-center justify-center cursor-pointer z-10"
        style={{
          opacity: collapsed ? 1 : 0,
          pointerEvents: collapsed ? 'auto' : 'none',
          transition: 'opacity 150ms ease-in-out',
        }}
        onClick={() => setCollapsed(false)}
        title="Talk to Coach"
      >
        <span
          className="text-xs font-semibold select-none whitespace-nowrap"
          style={{
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
            letterSpacing: '0.08em',
            color: tabColor,
          }}
        >
          Talk to Coach
        </span>
      </div>

      {/* ── Expanded content ── */}
      <div
        className="flex flex-col h-full min-w-0 pt-5"
        style={{
          opacity: collapsed ? 0 : 1,
          pointerEvents: collapsed ? 'none' : 'auto',
          transition: 'opacity 200ms ease-in-out 80ms',
        }}
      >
        {/* Header — EC badge + title + actions on one row */}
        <div
          className="flex items-center gap-2 px-3 py-2.5 border-b border-theme-border flex-shrink-0"
          style={{ background: `linear-gradient(to right, ${hexToRgba(tabColor, 0.06)}, transparent)` }}
        >
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: hexToRgba(tabColor, 0.12), border: `1px solid ${hexToRgba(tabColor, 0.25)}` }}
          >
            <span className="text-xs font-bold" style={{ color: tabColor }}>EC</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-theme-primary leading-tight">{t('educator.educatorCoach')}</p>
            {triggerDimension && (
              <p className="text-xs text-theme-secondary truncate leading-tight">Focus: {triggerDimension}</p>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded hover:bg-theme-bg-tertiary transition-colors"
              title="Conversation history"
            >
              <Icon icon={Clock01IconData} className="w-5 text-theme-muted" />
            </button>
            <button
              onClick={() => setCollapsed(true)}
              className="ng-chevron-btn ng-chevron-md"
              title="Collapse panel"
              aria-label="Collapse panel"
            >
              <svg
                className="ng-chevron-icon"
                style={{ transform: 'rotate(-90deg)' }}
                width={16} height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── Chat zone — history overlay lives here ── */}
        <div className="relative flex-1 flex flex-col min-h-0">

          {/* History backdrop */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background: 'rgba(0,0,0,0.25)',
              opacity: showHistory ? 1 : 0,
              pointerEvents: showHistory ? 'auto' : 'none',
              transition: 'opacity 200ms ease',
            }}
            onClick={() => setShowHistory(false)}
          />

          {/* History slide-in panel (from right) */}
          <div
            className="absolute top-0 right-0 bottom-0 z-20 flex flex-col border-l border-theme-border shadow-2xl"
            style={{
              width: '85%',
              background: 'var(--bg-secondary, #f9fafb)',
              transform: showHistory ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 260ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-theme-border flex-shrink-0">
              <span className="text-sm font-semibold text-theme-primary">{t('educator.conversationHistory')}</span>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 rounded hover:bg-theme-bg-tertiary transition-colors text-theme-muted text-lg leading-none"
                title="Close history"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2">
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
                <p className="text-[10px] text-theme-muted px-2 py-1">{t('educator.noPreviousConversations')}</p>
              )}
            </div>
          </div>

          {/* Sticky selected-topic chip — sits above scroll area */}
          {selectedTopic && (
            <div
              className="flex-shrink-0 flex items-center justify-center py-2 px-3 border-b border-theme-border"
              style={{ background: 'var(--bg-secondary, #f9fafb)' }}
            >
              <button
                onClick={() => { setSelectedTopic(null); setShowTopicPicker(true); }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-opacity hover:opacity-70"
                style={{
                  color: tabColor,
                  borderColor: hexToRgba(tabColor, 0.35),
                  background: hexToRgba(tabColor, 0.08),
                }}
                title={t('educator.changeTopic')}
              >
                ← {selectedTopic}
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2 min-h-0">
            {messages.length === 0 && !isStreaming && (
              <div className="py-4 px-1">
                {showTopicPicker ? (
                  <>
                    <p className="text-xs text-theme-secondary mb-3 font-medium text-center">{t('educator.whatToDiscuss')}</p>
                    <div className="flex flex-wrap gap-1.5 justify-center">
                      {TOPIC_BUBBLES.map(t => (
                        <button
                          key={t.label}
                          onClick={() => {
                            setTopicDismissing(true);
                            setTimeout(() => {
                              setSelectedTopic(t.label);
                              setShowTopicPicker(false);
                              setTopicDismissing(false);
                            }, 200);
                          }}
                          className="px-3 py-1.5 rounded-full text-xs border border-theme-border bg-theme-bg hover:bg-theme-bg-secondary text-theme-primary"
                          style={{
                            opacity: topicDismissing ? 0 : 1,
                            transform: topicDismissing ? 'scale(0.85)' : 'scale(1)',
                            transition: 'opacity 200ms ease, transform 200ms ease',
                          }}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-2">
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
              </div>
            )}

            {messages.map(msg => (
              <FadeIn key={msg.id} delay={msg.role === 'assistant' ? 700 : 0}>
                <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
              </FadeIn>
            ))}

            {isStreaming && streamingContent && (
              <FadeIn delay={700}>
                <div className="flex justify-start">
                  <div className="max-w-[90%] rounded-xl px-2.5 py-1.5 text-xs bg-theme-bg text-theme-primary border border-theme-border">
                    <p className="whitespace-pre-wrap leading-relaxed">{streamingContent}</p>
                  </div>
                </div>
              </FadeIn>
            )}

            {isStreaming && !streamingContent && (
              <FadeIn delay={700}>
                <div className="flex justify-start">
                  <div className="rounded-xl px-2.5 py-1.5 text-xs bg-theme-bg border border-theme-border">
                    <span className="text-theme-muted animate-pulse">{t('chat.thinking')}</span>
                  </div>
                </div>
              </FadeIn>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-2 border-t border-theme-border flex-shrink-0">
            <div className="flex items-end gap-1.5">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 132) + 'px';
                }}
                onKeyDown={handleKeyDown}
                placeholder={isTopicRequired && selectedTopic === null ? 'Select a topic above to start chatting…' : 'Ask the Educator Coach…'}
                className="flex-1 resize-none rounded-lg px-2.5 py-1.5 text-xs bg-theme-bg border border-theme-border text-theme-primary placeholder-theme-muted focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                rows={2}
                style={{ maxHeight: 132, minHeight: '2.5rem', overflowY: 'auto' }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isStreaming || (isTopicRequired && selectedTopic === null)}
                className="w-10 h-10 rounded-lg bg-blue-500 text-white disabled:opacity-40 hover:bg-blue-600 transition-colors flex-shrink-0 flex items-center justify-center"
              >
                <Icon icon={SentIconData} className="w-4" />
              </button>
            </div>
          </div>

        </div>{/* end chat-zone */}
      </div>
    </div>
  );
};

export default InsightsCoachPanel;
