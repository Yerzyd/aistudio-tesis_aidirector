import { useState, useEffect } from 'react';
import { AppState, Thesis } from '../types';

const defaultChapters = [
  { id: '1', title: '1. Introducción', content: '', progress: 0 },
  { id: '2', title: '2. Marco Teórico', content: '', progress: 0 },
  { id: '3', title: '3. Metodología', content: '', progress: 0 },
  { id: '4', title: '4. Resultados', content: '', progress: 0 },
  { id: '5', title: '5. Discusión', content: '', progress: 0 },
  { id: '6', title: '6. Conclusiones', content: '', progress: 0 },
  { id: '7', title: '7. Recomendaciones', content: '', progress: 0 },
];

const initialState: AppState = {
  theses: [],
  activeThesisId: null,
  theme: 'light',
};

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('thesis_app_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('thesis_app_state', JSON.stringify(state));
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const createThesis = (title: string, topic: string) => {
    const newThesis: Thesis = {
      id: Date.now().toString(),
      title,
      topic,
      chapters: JSON.parse(JSON.stringify(defaultChapters)),
      updatedAt: Date.now(),
    };
    setState(s => ({
      ...s,
      theses: [...s.theses, newThesis],
      activeThesisId: newThesis.id,
    }));
  };

  const updateThesis = (id: string, updates: Partial<Thesis>) => {
    setState(s => ({
      ...s,
      theses: s.theses.map(t => t.id === id ? { ...t, ...updates, updatedAt: Date.now() } : t)
    }));
  };

  const updateChapter = (thesisId: string, chapterId: string, content: string) => {
    setState(s => ({
      ...s,
      theses: s.theses.map(t => {
        if (t.id !== thesisId) return t;
        const progress = content.length > 500 ? 100 : Math.min(100, Math.floor((content.length / 500) * 100));
        return {
          ...t,
          updatedAt: Date.now(),
          chapters: t.chapters.map(c => c.id === chapterId ? { ...c, content, progress } : c)
        };
      })
    }));
  };

  const deleteThesis = (id: string) => {
    setState(s => ({
      ...s,
      theses: s.theses.filter(t => t.id !== id),
      activeThesisId: s.activeThesisId === id ? null : s.activeThesisId
    }));
  };

  const setActiveThesis = (id: string | null) => {
    setState(s => ({ ...s, activeThesisId: id }));
  };

  const toggleTheme = () => {
    setState(s => ({ ...s, theme: s.theme === 'light' ? 'dark' : 'light' }));
  };

  const importBackup = (backupData: AppState) => {
    setState(backupData);
  };

  return {
    state,
    createThesis,
    updateThesis,
    updateChapter,
    deleteThesis,
    setActiveThesis,
    toggleTheme,
    importBackup
  };
}
