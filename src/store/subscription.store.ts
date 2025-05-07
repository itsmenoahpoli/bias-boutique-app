import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Subscription = {
  planId: string;
  planTitle: string;
  amount: number;
  purchaseDate: string;
  expiryDate?: string;
  paymentMethod: {
    type: string;
    channel: string;
  };
};

type SubscriptionStore = {
  subscription: Subscription | null;
  setSubscription: (subscription: Subscription) => Promise<void>;
  loadSubscription: () => Promise<Subscription | null>;
  hasActiveSubscription: () => Promise<boolean>;
  clearSubscription: () => Promise<void>;
};

export const useSubscriptionStore = create<SubscriptionStore>((set, get) => ({
  subscription: null,

  setSubscription: async (subscription) => {
    try {
      await AsyncStorage.setItem(
        "user_subscription",
        JSON.stringify(subscription)
      );
      set({ subscription });
      return;
    } catch (error) {
      console.error("Error saving subscription:", error);
    }
  },

  loadSubscription: async () => {
    try {
      const savedSubscription = await AsyncStorage.getItem("user_subscription");
      if (savedSubscription) {
        const parsedSubscription = JSON.parse(savedSubscription);
        set({ subscription: parsedSubscription });
        return parsedSubscription;
      }
      return null;
    } catch (error) {
      console.error("Error loading subscription:", error);
      return null;
    }
  },

  hasActiveSubscription: async () => {
    try {
      const subscription = await get().loadSubscription();
      return subscription !== null;
    } catch (error) {
      console.error("Error checking subscription status:", error);
      return false;
    }
  },

  clearSubscription: async () => {
    try {
      await AsyncStorage.removeItem("user_subscription");
      set({ subscription: null });
    } catch (error) {
      console.error("Error clearing subscription:", error);
    }
  },
}));
