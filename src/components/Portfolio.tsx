import { useState, useRef } from 'react';
import { AppState } from '../types';
import { Plus, Trash2, Download, Upload, Book, Clock } from 'lucide-react';

interface PortfolioProps {
  state: AppState;
  createThesis: (title: string, topic: string) => void;
  deleteThesis: (id: string) => void;
  setActiveThesis: (id: string) => void;
  importBackup: (state: AppState) => void;
  setCurrentView: (view: any) => void;
}

export function Portfolio({ state, createThesis, deleteThesis, setActiveThesis, importBackup, setCurrentView }: PortfolioProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim() && newTopic.trim()) {
      createThesis(newTitle, newTopic);
      setIsCreating(false);
      setNewTitle('');
      setNewTopic('');
      setCurrentView('dashboard');
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "thesis_ai_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedState = JSON.parse(event.target?.result as string);
        if (importedState && importedState.theses) {
          importBackup(importedState);
          alert('Backup restaurado con éxito');
        }
      } catch (err) {
        alert('Error al importar el archivo de backup');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Portafolio de Tesis</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Gestiona tus proyectos de investigación.</p>
        </div>
        <div className="flex gap-3">
          <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Upload className="w-4 h-4" /> Importar
          </button>
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Download className="w-4 h-4" /> Exportar Backup
          </button>
          <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" /> Nueva Tesis
          </button>
        </div>
      </header>

      {isCreating && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Crear Nuevo Proyecto</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título de la Tesis</label>
              <input autoFocus value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white" placeholder="Ej: Análisis de..." required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tema / Problema de Investigación</label>
              <textarea value={newTopic} onChange={e => setNewTopic(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none" rows={3} placeholder="Describe brevemente el tema..." required />
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">Cancelar</button>
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg">Crear Tesis</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.theses.map(thesis => (
          <div key={thesis.id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <Book className="w-6 h-6" />
              </div>
              <button onClick={() => deleteThesis(thesis.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{thesis.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-3 flex-1">{thesis.topic}</p>
            
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-4">
              <Clock className="w-4 h-4" />
              Actualizado: {new Date(thesis.updatedAt).toLocaleDateString()}
            </div>

            <button 
              onClick={() => {
                setActiveThesis(thesis.id);
                setCurrentView('dashboard');
              }}
              className="w-full py-2 bg-slate-50 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-medium rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-600 transition-colors"
            >
              Abrir Proyecto
            </button>
          </div>
        ))}
        {state.theses.length === 0 && !isCreating && (
          <div className="col-span-full text-center py-12 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-slate-500 dark:text-slate-400">No tienes proyectos de tesis. Crea uno nuevo para empezar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
