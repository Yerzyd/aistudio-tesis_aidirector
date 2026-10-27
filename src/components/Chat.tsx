import { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import Markdown from 'react-markdown';
import { clsx } from 'clsx';
import { Thesis } from '../types';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface ChatProps {
  thesis: Thesis;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function Chat({ thesis }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `¡Hola! Soy tu Director de Tesis IA. He revisado tu tema: **"${thesis.topic}"**. ¿En qué fase de la investigación te encuentras o qué dudas metodológicas tienes hoy?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset chat if thesis changes
  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: `¡Hola! Soy tu Director de Tesis IA. He revisado tu tema: **"${thesis.topic}"**. ¿En qué fase de la investigación te encuentras o qué dudas metodológicas tienes hoy?`
      }
    ]);
  }, [thesis.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInput('');
    setIsLoading(true);

    try {
      const contents = currentMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));

      // Add context to the last user message
      const lastMessageIndex = contents.length - 1;
      contents[lastMessageIndex].parts[0].text = `Contexto del tema de tesis: ${thesis.topic}\n\nPregunta del alumno: ${input}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: contents as any,
        config: {
          systemInstruction: "Eres un Director de Tesis IA experto. Tu objetivo es guiar a estudiantes de maestría y doctorado en su investigación.\nOfreces asesoría metodológica, revisión científica y sugerencias académicas.\nResponde de manera formal, académica, pero accesible y motivadora.",
        }
      });

      if (response.text) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: response.text! }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto p-6">
      <header className="bg-white dark:bg-slate-900 rounded-t-2xl border border-slate-200 dark:border-slate-800 p-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Director de Tesis IA</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Asesoría metodológica y revisión científica</p>
          </div>
        </div>
      </header>

      <div className="flex-1 bg-slate-50 dark:bg-slate-950 border-x border-slate-200 dark:border-slate-800 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={clsx(
              "flex gap-4 max-w-[80%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={clsx(
              "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1",
              msg.role === 'user' ? "bg-slate-200 dark:bg-slate-700" : "bg-indigo-100 dark:bg-indigo-900/50"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4 text-slate-600 dark:text-slate-300" /> : <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
            </div>
            <div className={clsx(
              "p-4 rounded-2xl shadow-sm",
              msg.role === 'user' 
                ? "bg-indigo-600 text-white rounded-tr-none" 
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none prose prose-sm dark:prose-invert max-w-none"
            )}>
              {msg.role === 'user' ? (
                <p>{msg.content}</p>
              ) : (
                <Markdown>{msg.content}</Markdown>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0 mt-1">
              <Bot className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="p-4 rounded-2xl shadow-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-tl-none flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Analizando...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-b-2xl border border-t-0 border-slate-200 dark:border-slate-800 p-4 shrink-0 shadow-sm">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pregunta sobre metodología, marco teórico..."
            className="flex-1 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
