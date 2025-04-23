import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "WALLET_SCREEN">;
};

export const WalletScreen: React.FC<TScreenProps> = ({ navigation }) => {
  return (
    <GradientLayout>
      <View className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="flex-row items-center pt-8 mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold ml-4">Wallet</Text>
        </View>

        {/* Balance Card */}
        <View className="bg-white/10 rounded-2xl p-4 mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white text-sm">Available Balance (₱)</Text>
            <TouchableOpacity className="bg-pink-500 px-4 py-1 rounded-full">
              <Text className="text-white text-sm">Cash In</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-end justify-between">
            <Text className="text-white text-3xl font-bold">0.00</Text>
            <Text className="text-yellow-300 text-xs">
              Rebates (₱) 0.00 &gt;
            </Text>
          </View>
        </View>

        {/* Verify Account */}
        <TouchableOpacity className="bg-white/10 rounded-2xl p-4 mb-6 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="shield-checkmark" size={20} color="#fff" />
            <Text className="text-white ml-2 text-sm">
              Verify your account to secure your transactions
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {/* Action Buttons */}
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {[
            { label: "Transaction History", icon: "receipt" },
            { label: "Payment Options", icon: "card" },
            { label: "Cash-In", icon: "add-circle" },
            { label: "Voucher", icon: "pricetag" },
          ].map((item, index) => (
            <TouchableOpacity
              key={index}
              className="w-[48%] items-center bg-white/10 rounded-2xl p-4"
            >
              <View className="w-12 h-12 bg-pink-500/20 rounded-full justify-center items-center mb-2">
                <Ionicons name={item.icon as any} size={24} color="#fff" />
              </View>
              <Text className="text-white text-sm font-medium text-center">
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </GradientLayout>
  );
};
