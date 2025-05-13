import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type WalletStore = {
  balance: number;
  setBalance: (amount: number) => Promise<void>;
  addBalance: (amount: number) => Promise<void>;
  loadBalance: () => Promise<void>;
};

export const useWalletStore = create<WalletStore>((set, get) => ({
  balance: 0,

  setBalance: async (amount: number) => {
    try {
      await AsyncStorage.setItem("wallet_balance", amount.toString());
      set({ balance: amount });
    } catch (error) {
      console.error("Error saving wallet balance:", error);
    }
  },

  addBalance: async (amount: number) => {
    try {
      const currentBalance = get().balance;
      const newBalance = currentBalance + amount;
      await AsyncStorage.setItem("wallet_balance", newBalance.toString());
      set({ balance: newBalance });
    } catch (error) {
      console.error("Error updating wallet balance:", error);
    }
  },

  loadBalance: async () => {
    try {
      const savedBalance = await AsyncStorage.getItem("wallet_balance");
      if (savedBalance) {
        set({ balance: parseFloat(savedBalance) });
      }
    } catch (error) {
      console.error("Error loading wallet balance:", error);
    }
  },
}));
