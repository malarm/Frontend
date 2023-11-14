// 3rd party libraries
import { create } from 'zustand';



const initalValue = '';

type IAddedEmailStore = {
  email: string | null;
  setEmail: (value: string) => void;
};

export const useAddedEmailStore = create<IAddedEmailStore>((set) => ({
  email: initalValue,

  setEmail: (value: string) => {
    set({ email: value });
  }
}));
