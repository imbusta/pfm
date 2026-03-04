import { useState, useRef, useEffect } from 'react';
import { agentApi } from '../api/client';
import type { ChatMessage } from '../types';
import MarkdownMessage from './MarkdownMessage';

interface ActivityEntry {
  type: 'agent' | 'tool_start' | 'tool_done';
  label: string;
}

const TOOL_LABELS: Record<string, string> = {
  analyticsExpert: 'Analytics Expert',
  budgetsExpert: 'Budgets Expert',
};

function AgentActivityPanel({ activity }: { activity: ActivityEntry[] }) {
  if (activity.length === 0) return null;
  return (
    <div className="flex flex-col gap-1 mb-2 text-xs text-text-secondary px-1">
      {activity.map((a, i) => {
        if (a.type === 'agent') {
          return (
            <span key={i} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse inline-block" />
              {a.label}
            </span>
          );
        }
        if (a.type === 'tool_start') {
          return (
            <span key={i} className="flex items-center gap-1.5 pl-3">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse inline-block" />
              Calling {a.label}…
            </span>
          );
        }
        if (a.type === 'tool_done') {
          return (
            <span key={i} className="flex items-center gap-1.5 pl-3 opacity-60">
              <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
              {a.label} done
            </span>
          );
        }
        return null;
      })}
    </div>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText, activity]);

  const handleSend = async () => {
    if (!input.trim() || streaming) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setStreaming(true);
    setStreamingText('');
    setActivity([]);
    setSuggestions([]);

    let builtText = '';

    try {
      for await (const chunk of agentApi.streamChat(input)) {
        if (chunk.type === 'agent') {
          setActivity((prev) => [...prev, { type: 'agent', label: chunk.name }]);
        } else if (chunk.type === 'tool_start') {
          const label = TOOL_LABELS[chunk.name] ?? chunk.name;
          setActivity((prev) => [...prev, { type: 'tool_start', label }]);
        } else if (chunk.type === 'tool_done') {
          const label = TOOL_LABELS[chunk.name] ?? chunk.name;
          setActivity((prev) => (
            prev.map((a) =>
              a.type === 'tool_start' && a.label === label
                ? { type: 'tool_done', label }
                : a
            )
          ));
        } else if (chunk.type === 'token') {
          builtText += chunk.text;
          setStreamingText(builtText);
        } else if (chunk.type === 'done') {
          setSuggestions(chunk.suggestions);
          const assistantMessage: ChatMessage = {
            role: 'assistant',
            content: builtText.trim(),
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, assistantMessage]);
          setStreamingText('');
          setActivity([]);
        } else if (chunk.type === 'error') {
          const errorMessage: ChatMessage = {
            role: 'assistant',
            content: 'Sorry, I encountered an error. Please try again.',
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, errorMessage]);
          setStreamingText('');
          setActivity([]);
        }
      }
    } catch {
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setStreamingText('');
      setActivity([]);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="bg-surface rounded-lg shadow-md flex flex-col border border-gray-200" style={{ height: '600px' }}>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !streaming ? (
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
          <>
            {messages.map((msg, index) => (
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
                  {msg.role === 'assistant' ? (
                    <MarkdownMessage content={msg.content} />
                  ) : (
                    <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                  )}
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {/* Suggestions from last response */}
            {suggestions.length > 0 && !streaming && (
              <div className="flex flex-wrap gap-2 pl-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(s)}
                    className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/5 transition-colors text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Streaming in-progress bubble */}
            {streaming && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-4 py-3 shadow-sm bg-background text-text-primary border border-gray-200">
                  <AgentActivityPanel activity={activity} />
                  {streamingText ? (
                    <MarkdownMessage content={streamingText} streaming />
                  ) : (
                    <p className="text-text-secondary animate-pulse text-sm">Thinking…</p>
                  )}
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t-2 border-gray-200 p-4 bg-background">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me about your finances..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
            disabled={streaming}
          />
          <button
            onClick={handleSend}
            disabled={streaming || !input.trim()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark disabled:bg-text-secondary/50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
