import React, { useState, useEffect, useRef } from 'react';
import { X, MessageSquare, Wand2, Send, Loader2, Sparkles } from 'lucide-react';

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
        // Determine WebSocket route depending on mode and content type
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        let route = '';
        if (mode === 'chat') {
          route = `${protocol}//${host}/ws/chat`;
        } else {
          switch (contentType) {
            case 'lesson':
              route = `${protocol}//${host}/ws/lesson-plan`;
              break;
            case 'quiz':
              route = `${protocol}//${host}/ws/quiz`;
              break;
            case 'rubric':
              route = `${protocol}//${host}/ws/rubric`;
              break;
            case 'kindergarten':
              route = `${protocol}//${host}/ws/kindergarten`;
              break;
            case 'multigrade':
              route = `${protocol}//${host}/ws/multigrade`;
              break;
            case 'cross-curricular':
              route = `${protocol}//${host}/ws/cross-curricular`;
              break;
            default:
              route = `${protocol}//${host}/ws/chat`;
          }
        }

        const ws = new WebSocket(route);
        
        ws.onopen = () => {
          console.log('AI Assistant WebSocket connected');
        };
        
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);

          // Stream each token in real time
          if (data.type === 'token') {
            setStreamingMessage(prev => prev + data.content);
          }
          // When generation completes, finalize message
          else if (data.type === 'done') {
            const finalMessage = streamingMessage || data.full_response;
            if (mode === 'modify') onContentUpdate(finalMessage);
            if (mode === 'chat') {
              setChatMessages(prev => [...prev, { role: 'assistant', content: finalMessage }]);
            } else {
              setModifyMessages(prev => [...prev, { role: 'assistant', content: finalMessage }]);
            }
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
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const userMessage: Message = { role: 'user', content: input };
    if (mode === 'chat') {
      setChatMessages(prev => [...prev, userMessage]);
    } else {
      setModifyMessages(prev => [...prev, userMessage]);
    }
    setIsStreaming(true);
    setStreamingMessage('');

    let systemPrompt = '';
    if (mode === 'chat') {
      systemPrompt = `You are a helpful AI assistant. The user has generated the following ${contentType} plan and wants to discuss it with you. Answer their questions about the content, provide insights, or offer suggestions.

GENERATED CONTENT:
${content}

Provide clear, helpful responses about this content.`;
    } else {
      systemPrompt = `You are an AI assistant that helps modify educational content. The user has generated the following ${contentType} plan and wants you to make specific modifications to it.

CURRENT CONTENT:
${content}

When the user requests modifications, generate the COMPLETE UPDATED VERSION of the entire content with their requested changes applied. Return ONLY the modified content, not explanations.`;
    }

    const prompt = `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n${systemPrompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n${input}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`;

    try {
      wsRef.current.send(JSON.stringify({ message: prompt }));
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

  const getContentTypeLabel = () => {
    const labels = {
      'lesson': 'Lesson Plan',
      'quiz': 'Quiz',
      'rubric': 'Rubric',
      'kindergarten': 'Kindergarten Plan',
      'multigrade': 'Multigrade Plan',
      'cross-curricular': 'Cross-Curricular Plan'
    };
    return labels[contentType];
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
      <div className="relative w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col animate-slideInRight">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              <h2 className="text-2xl font-bold">AI Assistant</h2>
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
          {/* Independent Chat/Modify Tabs with persistent state */}
          <div className="flex gap-2 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => {
                if (wsRef.current) wsRef.current.close();
                setMode('chat');
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
            ? 'bg-blue-50 text-blue-700' 
            : 'bg-amber-50 text-amber-700'
        }`}>
          {mode === 'chat' ? (
            <p>💬 Ask questions about your {getContentTypeLabel().toLowerCase()} or request insights and suggestions.</p>
          ) : (
            <p>✨ Describe the changes you want, and AI will update your {getContentTypeLabel().toLowerCase()} accordingly.</p>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-12">
              <div className="text-6xl mb-4">
                {mode === 'chat' ? '💭' : '🪄'}
              </div>
              <p className="text-lg font-medium mb-2">
                {mode === 'chat' ? 'Start a Conversation' : 'Request Modifications'}
              </p>
              <p className="text-sm">
                {mode === 'chat' 
                  ? 'Ask anything about your generated content'
                  : 'Tell me what changes you\'d like to make'
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
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {streamingMessage && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-gray-100 text-gray-800">
                <p className="whitespace-pre-wrap">{streamingMessage}</p>
                <span className="inline-flex items-center ml-1">
                  <span className="w-0.5 h-5 bg-purple-500 animate-pulse rounded-full"></span>
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                mode === 'chat' 
                  ? 'Ask a question about your content...'
                  : 'Describe the modifications you want...'
              }
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              disabled={isStreaming}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="px-6 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isStreaming ? (
                <Loader2 className="w-5 h-5 animate-spin" />
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
