import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Editor } from './components/Editor';
import { Generator } from './components/Generator';
import { Chat } from './components/Chat';
import { Portfolio } from './components/Portfolio';
import { useAppState } from './hooks/useAppState';

export type View = 'portfolio' | 'dashboard' | 'editor' | 'generator' | 'chat';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('portfolio');
  const { state, createThesis, updateThesis, updateChapter, deleteThesis, setActiveThesis, toggleTheme, importBackup } = useAppState();

  const activeThesis = state.theses.find(t => t.id === state.activeThesisId);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        theme={state.theme}
        toggleTheme={toggleTheme}
        hasActiveThesis={!!activeThesis}
      />
      <main className="flex-1 overflow-y-auto">
        {currentView === 'portfolio' && (
          <Portfolio 
            state={state}
            createThesis={createThesis}
            deleteThesis={deleteThesis}
            setActiveThesis={setActiveThesis}
            importBackup={importBackup}
            setCurrentView={setCurrentView}
          />
        )}
        {activeThesis && (
          <>
            {currentView === 'dashboard' && <Dashboard thesis={activeThesis} updateThesis={updateThesis} />}
            {currentView === 'editor' && <Editor thesis={activeThesis} updateChapter={updateChapter} />}
            {currentView === 'generator' && <Generator thesis={activeThesis} />}
            {currentView === 'chat' && <Chat thesis={activeThesis} />}
          </>
        )}
        {!activeThesis && currentView !== 'portfolio' && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Ninguna tesis seleccionada</h2>
              <p className="text-slate-500 mb-4">Por favor selecciona o crea un proyecto en el portafolio.</p>
              <button onClick={() => setCurrentView('portfolio')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">Ir al Portafolio</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
