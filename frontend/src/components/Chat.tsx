import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Message } from '../types';

interface ChatProps {
  tabId: string;
  savedData?: {
    messages?: Message[];
  };
  onDataChange: (data: any) => void;
}

const Chat: React.FC<ChatProps> = ({ tabId, savedData, onDataChange }) => {
  const [messages, setMessages] = useState<Message[]>(savedData?.messages || []);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  useEffect(() => {
    onDataChange({ messages });
  }, [messages]);

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket('ws://localhost:8000/ws/chat');
      
      ws.onopen = () => {
        console.log('WebSocket connected');
      };
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        if (data.type === 'token') {
          // Append character to streaming message
          setStreamingMessage(prev => prev + data.content);
        } else if (data.type === 'done') {
          // Finalize the message
          const finalMessage: Message = {
            id: Date.now().toString(),
            role: 'assistant',
            content: streamingMessage,
            timestamp: new Date().toISOString()
          };
          setMessages(prev => [...prev, finalMessage]);
          setStreamingMessage('');
          setLoading(false);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setLoading(false);
      };
      
      ws.onclose = () => {
        console.log('WebSocket closed, reconnecting...');
        setTimeout(connectWebSocket, 1000);
      };
      
      wsRef.current = ws;
    };
    
    connectWebSocket();
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleSend = () => {
    if (!input.trim() || loading || !wsRef.current) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setStreamingMessage('');

    // Send message via WebSocket
    wsRef.current.send(JSON.stringify({
      message: input
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessage = (content: string) => {
    return content.split('\n\n').map((paragraph, idx) => (
      <p key={idx} className="mb-2 last:mb-0">
        {paragraph.split('\n').map((line, lineIdx) => (
          <React.Fragment key={lineIdx}>
            {line.startsWith('**') && line.endsWith('**') ? (
              <strong className="font-bold block mt-3 mb-1">
                {line.replace(/\*\*/g, '')}
              </strong>
            ) : line.startsWith('*') && line.length > 1 ? (
              <span className="block ml-4">• {line.substring(1)}</span>
            ) : (
              line
            )}
            {lineIdx < paragraph.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    ));
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Chat Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-xl font-semibold text-gray-800">Chat with AI Teaching Assistant</h2>
        <p className="text-sm text-gray-500">Real-time streaming powered by Llama 3.2 1B</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !streamingMessage ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-md">
              <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Start Learning!</h3>
              <p className="text-gray-600">
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
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="text-sm prose prose-sm max-w-none">
                    {formatMessage(msg.content)}
                  </div>
                  <p
                    className={`text-xs mt-2 ${
                      msg.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Streaming message */}
            {streamingMessage && (
              <div className="flex justify-start">
                <div className="max-w-3xl px-4 py-3 rounded-2xl bg-gray-100 text-gray-800">
                  <div className="text-sm prose prose-sm max-w-none">
                    {formatMessage(streamingMessage)}
                    <span className="inline-block w-2 h-4 bg-blue-600 ml-1 animate-pulse"></span>
                  </div>
                </div>
              </div>
            )}
            
            {loading && !streamingMessage && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            rows={1}
            style={{ minHeight: '48px', maxHeight: '120px' }}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
      </div>
    </div>
  );
};

export default Chat;