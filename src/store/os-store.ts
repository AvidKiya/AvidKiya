import { create } from 'zustand';

type AppId = 'terminal' | 'photoshop' | 'camera' | 'projects' | 'about' | 'contact';

interface WindowState {
  id: AppId;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

interface OSStore {
  windows: Record<AppId, WindowState>;
  focusedWindow: AppId | null;
  theme: 'dark' | 'light';
  language: 'en' | 'fa';
  
  openApp: (id: AppId) => void;
  closeApp: (id: AppId) => void;
  minimizeApp: (id: AppId) => void;
  focusApp: (id: AppId) => void;
  toggleTheme: () => void;
  setLanguage: (lang: 'en' | 'fa') => void;
}

const initialWindows: Record<AppId, WindowState> = {
  terminal: { id: 'terminal', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10 },
  photoshop: { id: 'photoshop', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10 },
  camera: { id: 'camera', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10 },
  projects: { id: 'projects', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10 },
  about: { id: 'about', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10 },
  contact: { id: 'contact', isOpen: false, isMinimized: false, isMaximized: false, zIndex: 10 },
};

export const useOSStore = create<OSStore>((set) => ({
  windows: initialWindows,
  focusedWindow: null,
  theme: 'dark',
  language: 'en',

  openApp: (id) => set((state) => {
    const maxZ = Math.max(...Object.values(state.windows).map(w => w.zIndex), 10);
    return {
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isOpen: true, isMinimized: false, zIndex: maxZ + 1 }
      },
      focusedWindow: id
    };
  }),

  closeApp: (id) => set((state) => ({
    windows: {
      ...state.windows,
      [id]: { ...state.windows[id], isOpen: false }
    },
    focusedWindow: state.focusedWindow === id ? null : state.focusedWindow
  })),

  minimizeApp: (id) => set((state) => ({
    windows: {
      ...state.windows,
      [id]: { ...state.windows[id], isMinimized: true }
    },
    focusedWindow: state.focusedWindow === id ? null : state.focusedWindow
  })),

  focusApp: (id) => set((state) => {
    const maxZ = Math.max(...Object.values(state.windows).map(w => w.zIndex), 10);
    return {
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isMinimized: false, zIndex: maxZ + 1 }
      },
      focusedWindow: id
    };
  }),

  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
  setLanguage: (lang) => set({ language: lang }),
}));
