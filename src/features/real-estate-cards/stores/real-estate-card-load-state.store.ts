// 3rd party libraries
import { create } from "zustand"



type IStore = {
  isLoading: boolean
  setIsLoading: (value: boolean) => void
}


export const useRealEstateCardLoadStateStore = create<IStore>((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({
    isLoading
  })
}))

export const useRealEstateCardIsLoading = () => useRealEstateCardLoadStateStore().isLoading

export const useSetRealEstateCardIsLoading = () => useRealEstateCardLoadStateStore().setIsLoading
