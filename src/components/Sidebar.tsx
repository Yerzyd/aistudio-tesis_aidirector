import { LayoutDashboard, FileText, Wand2, MessageSquare, Briefcase, Moon, Sun } from 'lucide-react';
import { View } from '../App';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  hasActiveThesis: boolean;
}

export function Sidebar({ currentView, setCurrentView, theme, toggleTheme, hasActiveThesis }: SidebarProps) {
  const navItems = [
    { id: 'portfolio', label: 'Portafolio', icon: Briefcase, alwaysVisible: true },
    { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard, alwaysVisible: false },
    { id: 'editor', label: 'Editor de Capítulos', icon: FileText, alwaysVisible: false },
    { id: 'generator', label: 'Generador de Tesis', icon: Wand2, alwaysVisible: false },
    { id: 'chat', label: 'Director IA', icon: MessageSquare, alwaysVisible: false },
  ] as const;

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-colors duration-200">
      <div className="p-6">
        <h1 className="text-xl font-bold text-indigo-900 dark:text-indigo-400 flex items-center gap-2">
          <Wand2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          ThesisAI
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Director de Tesis Inteligente</p>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          if (!item.alwaysVisible && !hasActiveThesis) return null;
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={twMerge(
                clsx(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                )
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-1">
        <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
        </button>
      </div>
    </aside>
  );
}
