import { useState } from 'react';
import { Wand2, Loader2, FileText } from 'lucide-react';
import Markdown from 'react-markdown';
import { Thesis } from '../types';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface GeneratorProps {
  thesis: Thesis;
}

export function Generator({ thesis }: GeneratorProps) {
  const [selectedChapter, setSelectedChapter] = useState(thesis.chapters[0]?.title || '');
  const [context, setContext] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedContent('');
    
    try {
      const prompt = `Actúa como escritor académico experto en tesis de maestría.
      Debes generar el contenido para el capítulo "${selectedChapter}" de una tesis sobre el tema: "${thesis.topic}".
      
      Contexto adicional del proyecto:
      ${context}
      
      Instrucciones:
      - Redacción académica rigurosa.
      - Coherencia metodológica.
      - Sugiere citas bibliográficas relevantes (formato APA).
      - Estructura científica apropiada para este capítulo.
      - Extensión: Proporciona un borrador detallado y extenso (al menos 800 palabras) que sirva como base sólida para el estudiante.
      
      Genera el contenido en formato Markdown.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
      });
      
      if (response.text) {
        setGeneratedContent(response.text);
      }
    } catch (error) {
      console.error('Error generating chapter:', error);
      setGeneratedContent('Hubo un error al generar el capítulo. Por favor, intenta de nuevo.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 shrink-0">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          Generador Automático de Tesis
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Genera borradores completos de capítulos basados en tu tema.</p>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-1/3 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 overflow-y-auto flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Tema Principal
            </label>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300">
              {thesis.topic}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Capítulo a Generar
            </label>
            <select
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none"
            >
              {thesis.chapters.map(c => (
                <option key={c.id} value={c.title}>{c.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Contexto Adicional (Opcional)
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Añade detalles específicos, objetivos, o enfoques..."
              className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none resize-none h-32 text-sm"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mt-auto"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generando Capítulo...
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5" />
                Generar Borrador
              </>
            )}
          </button>
        </div>

        <div className="flex-1 bg-slate-50 dark:bg-slate-950 p-6 overflow-y-auto">
          {generatedContent ? (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 max-w-4xl mx-auto">
              <div className="prose prose-slate dark:prose-invert prose-indigo max-w-none">
                <Markdown>{generatedContent}</Markdown>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
              <FileText className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-lg font-medium">El contenido generado aparecerá aquí</p>
              <p className="text-sm mt-2 max-w-md text-center">
                Configura los parámetros a la izquierda y haz clic en "Generar Borrador" para comenzar.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
