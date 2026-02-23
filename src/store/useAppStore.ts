import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Badge {
    id: string;
    name: string;
    nameTr: string;
    earned: boolean;
    icon: string;
}

interface AppState {
    language: 'TR' | 'EN';
    currentNode: number;
    lastViewedNode: number;
    xp: number;
    streak: number;
    badges: Badge[];
    unlockedNodes: number[];
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
            xp: 0,
            streak: 0,
            badges: [],
            unlockedNodes: [],

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
                xp: state.xp,
                streak: state.streak,
                badges: state.badges,
                unlockedNodes: state.unlockedNodes,
            }),
        } as any
    )
);
