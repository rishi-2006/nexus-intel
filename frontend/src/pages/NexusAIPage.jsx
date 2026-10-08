import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { aiService } from '../services/aiService';
import { useToast } from '../context/ToastContext';
import {
  Bot,
  User,
  Send,
  Sparkles,
  ShieldAlert,
  FileText,
  RotateCcw,
  Info,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Button from '../components/Button';

export const NexusAIPage = () => {
  const location = useLocation();
  const { showToast } = useToast();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `### Welcome to NEXUS AI Investigation Assistant\n\nI am your investigative decision-support copilot. I analyze relational topologies, transaction velocity, cross-border shipping manifestations, and forensic evidence seized across ongoing cases.\n\nAsk me specific questions about subjects, organizational networks, or evidentiary corroboration.\n\n> **Compliance Notice:** AI-generated analytical findings require human verification and should not be treated as proof of wrongdoing.`,
      sources: [],
      timestamp: new Date(),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sampleQuestions = [
    'Show connections of P102',
    'Which organizations are connected to P102?',
    'Show evidence related to P102',
    'What relationships exist between P101 and P102?',
    'Summarize this investigation',
    'Show unusual activity',
    'Which entities have the highest connectivity?',
  ];

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Check URL query parameters (e.g. ?query=Show connections of P102)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('query');
    if (q) {
      handleSend(q);
    }
  }, [location.search]);

  const handleSend = async (queryToSend = null) => {
    const query = (queryToSend || inputQuery).trim();
    if (!query || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await aiService.chat(query);
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.answer,
        sources: response.sources || [],
        confidenceScore: response.confidenceScore,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error('AI chat failed:', err);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: 'An error occurred while communicating with the AI intelligence backend. Please verify that the backend is active.',
        sources: [],
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
      showToast('AI analysis service error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: Date.now(),
        sender: 'ai',
        text: 'Investigation session cleared. Ready for new query context.',
        sources: [],
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-950/60">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
              <span>NEXUS AI</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                RAG RETRIEVAL ENGINE
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Grounded intelligence querying over relational database graph records
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" icon={RotateCcw} onClick={handleClearHistory}>
          Reset Session
        </Button>
      </div>

      {/* Mandatory Decision Support Compliance Banner */}
      <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 flex items-start space-x-3">
        <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-300">
          <strong>Decision-Support Notice:</strong> Findings generated by NEXUS AI cite records stored in the intelligence repository. They provide analytical recommendations for human investigators and do not constitute independent proof of wrongdoing.
        </p>
      </div>

      {/* Chat Messages Log Area */}
      <div className="flex-1 overflow-y-auto nexus-card rounded-2xl p-5 border border-slate-800 space-y-5">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800 text-cyan-400 border border-slate-700'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs ${
                  isUser
                    ? 'bg-cyan-700/80 text-white shadow-lg'
                    : 'bg-slate-900 border border-slate-800 text-slate-200'
                }`}
              >
                {/* Message Body with Markdown */}
                <div className="prose prose-invert prose-xs max-w-none leading-relaxed">
                  <ReactMarkdown>{m.text}</ReactMarkdown>
                </div>

                {/* Sources & Citations if present */}
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1">
                    <p className="font-mono text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">
                      Cited Evidentiary Sources:
                    </p>
                    {m.sources.map((src, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-300"
                      >
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{src}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-2 text-right text-[10px] font-mono text-slate-500">
                  {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center space-x-3 text-xs font-mono text-cyan-400">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-2 p-3 bg-slate-900 rounded-xl border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-[11px] text-slate-400 pl-1">
                Querying database records & computing RAG synthesis...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Sample Query Suggestions Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <span className="text-[11px] font-mono text-slate-400 flex-shrink-0">Prompts:</span>
        {sampleQuestions.map((q) => (
          <button
            key={q}
            onClick={() => handleSend(q)}
            className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-white transition-colors"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Message Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-3 p-2 bg-slate-900 rounded-2xl border border-slate-800 focus-within:border-cyan-400 transition-colors"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask NEXUS AI (e.g. Show connections of P102, Which organizations are connected to P102?)..."
          className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
        />
        <Button
          type="submit"
          variant="primary"
          icon={Send}
          disabled={!inputQuery.trim() || loading}
          loading={loading}
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default NexusAIPage;
