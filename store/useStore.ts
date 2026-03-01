import { create } from "zustand";

interface BrandState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  uploadedImages: string[];
  addUploadedImage: (image: string) => void;
  selectedStickers: string[];
  addSticker: (sticker: string) => void;
}

export const useStore = create<BrandState>((set) => ({
  activeTab: "assets",
  setActiveTab: (tab) => set({ activeTab: tab }),
  uploadedImages: [],
  addUploadedImage: (image) =>
    set((state) => ({ uploadedImages: [...state.uploadedImages, image] })),
  selectedStickers: [],
  addSticker: (sticker) =>
    set((state) => ({
      selectedStickers: [...state.selectedStickers, sticker],
    })),
}));
