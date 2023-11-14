// 3rd party libraries
import { QueryClient } from '@tanstack/react-query';
import { create } from 'zustand';



// initial token, fetched from local storage
const initalDate = null;

type ISaveDateStore = {
  date: Date | null;
  setDate: (date: Date) => void;
  resetDate: (queryClient: QueryClient) => void;
};

export const useSaveDateStore = create<ISaveDateStore>((set) => ({
  date: initalDate,

  setDate: (date: Date) => {
    set({ date });
  },

  resetDate: (queryClient: QueryClient) => {
    queryClient.clear();
    set({ date: null });
  },
}));

export const useSaveDate = () => useSaveDateStore((x) => x.date);
