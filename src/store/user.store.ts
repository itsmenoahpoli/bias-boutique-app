import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  contact_no: string;
  account_type: string;
};

type UserStore = {
  user: User | null;
  setUser: (user: User | null) => Promise<void>;
  loadUser: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  setUser: async (user) => {
    try {
      if (user) {
        await AsyncStorage.setItem("user", JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem("user");
      }
      set({ user });
    } catch (error) {
      console.error("Error saving user:", error);
    }
  },

  loadUser: async () => {
    try {
      const savedUser = await AsyncStorage.getItem("user");
      if (savedUser) {
        set({ user: JSON.parse(savedUser) });
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem("user");
      set({ user: null });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  },
}));
