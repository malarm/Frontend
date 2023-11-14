// 3rd party libraries
import { QueryClient } from '@tanstack/react-query';
import { create } from 'zustand';



// initial token, fetched from local storage
const initalMLNSection = '';

type IActiveMLNSectionStore = {
  mlnSection: string;
  activeSections: string[];
  setMLNSection: (mlnSection: string) => void;
  setActiveSections: (activeSections: string[]) => void;
  resetMLNSection: (queryClient: QueryClient) => void;
};

export const useActiveMLNSectionStore = create<IActiveMLNSectionStore>(
  (set) => ({
    mlnSection: initalMLNSection,
    activeSections: [],

    setMLNSection: (mlnSection: string) => {
      set({ mlnSection });
    },

    setActiveSections: (activeSections: string[]) => {
      set({ activeSections });
    },

    resetMLNSection: (queryClient: QueryClient) => {
      queryClient.clear();
      set({ mlnSection: '', activeSections: [] });
    },
  })
);

export const useActiveMLVSection = () =>
  useActiveMLNSectionStore((x) => x.mlnSection);
