import { BookOpen, CheckCircle, Clock, FileText } from 'lucide-react';
import { Thesis } from '../types';

interface DashboardProps {
  thesis: Thesis;
  updateThesis: (id: string, updates: Partial<Thesis>) => void;
}

export function Dashboard({ thesis, updateThesis }: DashboardProps) {
  const completedChapters = thesis.chapters.filter(c => c.progress === 100).length;
  const totalChapters = thesis.chapters.length;
  const totalWords = thesis.chapters.reduce((acc, c) => acc + c.content.split(/\s+/).filter(w => w.length > 0).length, 0);
  const estimatedPages = Math.max(1, Math.ceil(totalWords / 250));

  const stats = [
    { label: 'Capítulos Completados', value: `${completedChapters}/${totalChapters}`, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/50' },
    { label: 'Páginas Escritas', value: estimatedPages.toString(), icon: FileText, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/50' },
    { label: 'Palabras Totales', value: totalWords.toString(), icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/50' },
    { label: 'Citas Bibliográficas', value: 'N/A', icon: BookOpen, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-100 dark:bg-indigo-900/50' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{thesis.title}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Panel de Proyecto</p>
      </header>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <label htmlFor="topic" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          Tema de Tesis
        </label>
        <textarea
          id="topic"
          value={thesis.topic}
          onChange={(e) => updateThesis(thesis.id, { topic: e.target.value })}
          className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all resize-none text-slate-900 dark:text-white font-medium"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Progreso de Capítulos</h3>
        <div className="space-y-4">
          {thesis.chapters.map((chapter) => (
            <div key={chapter.id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">{chapter.title}</span>
                <span className="text-slate-500 dark:text-slate-400">{chapter.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${chapter.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
