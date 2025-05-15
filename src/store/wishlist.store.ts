import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type WishlistItem = {
  id: string;
  name: string;
  price: string;
  image: any;
};

type WishlistStore = {
  items: WishlistItem[];
  addToWishlist: (product: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  loadWishlist: () => Promise<void>;
  clearWishlist: () => Promise<void>;
};

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],

  addToWishlist: async (product) => {
    const currentItems = get().items;
    const existingItem = currentItems.find((item) => item.id === product.id);

    if (!existingItem) {
      const newItems = [...currentItems, product];
      set({ items: newItems });
      await AsyncStorage.setItem("wishlist", JSON.stringify(newItems));
    }
  },

  removeFromWishlist: async (productId) => {
    const newItems = get().items.filter((item) => item.id !== productId);
    set({ items: newItems });
    await AsyncStorage.setItem("wishlist", JSON.stringify(newItems));
  },

  loadWishlist: async () => {
    try {
      const savedWishlist = await AsyncStorage.getItem("wishlist");
      if (savedWishlist) {
        set({ items: JSON.parse(savedWishlist) });
      }
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  },

  clearWishlist: async () => {
    set({ items: [] });
    await AsyncStorage.removeItem("wishlist");
  },
}));
