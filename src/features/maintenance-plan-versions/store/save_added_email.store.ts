import { create } from 'zustand';

// initial token, fetched from local storage
const initalValue = '';

type ISaveAddedEmailStore = {
  email: string | null;
  setEmail: (value: string) => void;
};

export const useSaveAddedEmailStore = create<ISaveAddedEmailStore>((set) => ({
  email: initalValue,

  setEmail: (value: string) => {
    set({ email: value });
  }
}));
