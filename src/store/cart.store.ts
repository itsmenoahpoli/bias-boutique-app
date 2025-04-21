import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type CartItem = {
  id: number;
  name: string;
  price: string;
  image: any;
  quantity: number;
};

type CartStore = {
  items: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  loadCart: () => Promise<void>;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addToCart: async (product) => {
    const currentItems = get().items;
    const existingItem = currentItems.find((item) => item.id === product.id);

    let newItems;
    if (existingItem) {
      newItems = currentItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newItems = [...currentItems, { ...product, quantity: 1 }];
    }

    set({ items: newItems });
    await AsyncStorage.setItem("cart", JSON.stringify(newItems));
  },

  removeFromCart: async (productId) => {
    const newItems = get().items.filter((item) => item.id !== productId);
    set({ items: newItems });
    await AsyncStorage.setItem("cart", JSON.stringify(newItems));
  },

  updateQuantity: async (productId, quantity) => {
    const newItems = get().items.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );
    set({ items: newItems });
    await AsyncStorage.setItem("cart", JSON.stringify(newItems));
  },

  loadCart: async () => {
    try {
      const savedCart = await AsyncStorage.getItem("cart");
      if (savedCart) {
        set({ items: JSON.parse(savedCart) });
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  },
}));
