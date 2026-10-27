export interface Chapter {
  id: string;
  title: string;
  content: string;
  progress: number;
}

export interface Thesis {
  id: string;
  title: string;
  topic: string;
  chapters: Chapter[];
  updatedAt: number;
}

export interface AppState {
  theses: Thesis[];
  activeThesisId: string | null;
  theme: 'light' | 'dark';
}
