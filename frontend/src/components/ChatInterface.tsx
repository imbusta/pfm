import { useState } from 'react';
import { agentApi } from '../api/client';
import type { ChatMessage } from '../types';

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await agentApi.chat(input, true);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow-md flex flex-col border border-gray-200" style={{ height: '600px' }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-text-secondary mt-8 p-6">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg mb-2 text-text-primary font-semibold">Ask me anything about your finances!</p>
            <p className="text-sm">
              Try: "What's my biggest spending category?" or "Help me create a budget"
            </p>
            <div className="mt-6 grid grid-cols-1 gap-2 text-sm">
              <button
                onClick={() => setInput("What's my biggest spending category?")}
                className="p-3 bg-primary/5 hover:bg-primary/10 text-primary rounded-lg transition-colors text-left"
              >
                💰 What's my biggest spending category?
              </button>
              <button
                onClick={() => setInput("Help me create a budget")}
                className="p-3 bg-secondary/5 hover:bg-secondary/10 text-secondary rounded-lg transition-colors text-left"
              >
                📊 Help me create a budget
              </button>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-background text-text-primary border border-gray-200'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-background border border-primary/30 rounded-lg px-4 py-2">
              <p className="text-primary animate-pulse">Thinking...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t-2 border-gray-200 p-4 bg-background">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me about your finances..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark disabled:bg-text-secondary/50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
