import { useState, useEffect } from 'react';
import { Sparkles, Save, Download } from 'lucide-react';
import { Thesis } from '../types';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface EditorProps {
  thesis: Thesis;
  updateChapter: (thesisId: string, chapterId: string, content: string) => void;
}

export function Editor({ thesis, updateChapter }: EditorProps) {
  const [selectedChapterId, setSelectedChapterId] = useState(thesis.chapters[0]?.id || '');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const activeChapter = thesis.chapters.find(c => c.id === selectedChapterId);

  useEffect(() => {
    if (activeChapter) {
      setContent(activeChapter.content);
    }
  }, [selectedChapterId]);

  const handleSave = () => {
    if (activeChapter) {
      updateChapter(thesis.id, activeChapter.id, content);
    }
  };

  const handleAskAI = async () => {
    if (!aiPrompt.trim() || !activeChapter) return;
    
    setIsGenerating(true);
    try {
      const prompt = `Ayúdame a mejorar o escribir la siguiente sección de mi tesis sobre "${thesis.topic}". 
      Capítulo: ${activeChapter.title}
      Instrucción: ${aiPrompt}
      
      Contenido actual:
      ${content}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
      });
      
      if (response.text) {
        const newContent = content + (content ? '\n\n' : '') + response.text;
        setContent(newContent);
        updateChapter(thesis.id, activeChapter.id, newContent);
      }
      setAiPrompt('');
    } catch (error) {
      console.error('Error asking AI:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Editor de Capítulos</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-md">{thesis.title}</p>
          </div>
          <select
            value={selectedChapterId}
            onChange={(e) => setSelectedChapterId(e.target.value)}
            className="ml-4 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {thesis.chapters.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Save className="w-4 h-4" />
            Guardar
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleSave}
            className="w-full h-full min-h-[500px] p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-indigo-500 resize-none font-serif text-lg leading-relaxed text-slate-800 dark:text-slate-200"
            placeholder={`Comienza a escribir ${activeChapter?.title || 'tu capítulo'} aquí...`}
          />
        </div>

        <div className="w-80 bg-slate-50 dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              Asistente de Redacción
            </h3>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Pide a la IA que expanda una idea, mejore la redacción o agregue citas.
              </p>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ej: Mejora la redacción del último párrafo..."
                className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
                rows={4}
              />
              <button
                onClick={handleAskAI}
                disabled={isGenerating || !aiPrompt.trim()}
                className="w-full py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? 'Generando...' : 'Aplicar con IA'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
