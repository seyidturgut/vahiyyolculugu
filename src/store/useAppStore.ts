import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
    language: 'TR' | 'EN';
    currentNode: number;
    lastViewedNode: number;
    toggleLanguage: () => void;
    setLanguage: (lang: 'TR' | 'EN') => void;
    setCurrentNode: (id: number) => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            language: 'TR',
            currentNode: 0,
            lastViewedNode: 0,

            toggleLanguage: () =>
                set((state) => ({ language: state.language === 'TR' ? 'EN' : 'TR' })),

            setLanguage: (lang) => set({ language: lang }),

            setCurrentNode: (id) =>
                set({ currentNode: id, lastViewedNode: id > 0 ? id : undefined as any }),
        }),
        {
            name: 'vahiy-yolculugu',
            partialState: (state: AppState) => ({
                language: state.language,
                lastViewedNode: state.lastViewedNode,
            }),
        } as any
    )
);
