// 3rd party libraries
import { QueryClient } from '@tanstack/react-query';
import { create } from 'zustand';



// initial token, fetched from local storage
const initalBDKSection = '';

type IActiveBDKSectionStore = {
  bdkSection: string;
  activeSections: string[];
  setBDKSection: (bdkSection: string) => void;
  setActiveSections: (activeSections: string[]) => void;
  resetBDKSection: (queryClient: QueryClient) => void;
};

export const useActiveBDKSectionStore = create<IActiveBDKSectionStore>(
  (set) => ({
    bdkSection: initalBDKSection,
    activeSections: [],

    setBDKSection: (bdkSection: string) => {
      set({ bdkSection });
    },

    setActiveSections: (activeSections: string[]) => {
      set({ activeSections });
    },

    resetBDKSection: (queryClient: QueryClient) => {
      queryClient.clear();
      set({ bdkSection: '', activeSections: [] });
    },
  })
);

export const useActiveBDKSection = () =>
  useActiveBDKSectionStore((x) => x.bdkSection);
