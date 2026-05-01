import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'fr' | 'ewe' | 'kabye';

interface LanguageState {
  lang: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      lang: 'fr',
      setLanguage: (lang) => set({ lang }),
    }),
    { name: 'chaincacao-lang' }
  )
);