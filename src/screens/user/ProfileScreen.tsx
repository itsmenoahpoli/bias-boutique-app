import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "PROFILE_SCREEN">;
};

const iconList = [
  { label: "To Pay", icon: "card" },
  { label: "To Ship", icon: "cube" },
  { label: "To Receive", icon: "car" },
  { label: "To Review", icon: "chatbubble-ellipses" },
  { label: "Returns & Cancellations", icon: "refresh" },
];

const menuList = [
  { label: "Voucher", icon: "pricetag" },
  { label: "Recently Viewed", icon: "time" },
  { label: "My Ratings", icon: "star" },
  { label: "Account Settings", icon: "settings" },
  { label: "Help Center", icon: "help-circle" },
  { label: "Chat Assistant", icon: "chatbubbles" },
];

export const ProfileScreen: React.FC<TScreenProps> = () => {
  return (
    <GradientLayout>
      <ScrollView className="flex-1 px-4 py-6">
        {/* User Info */}
        <View className="items-center">
          <Image
            source={{ uri: "https://via.placeholder.com/80" }}
            className="w-20 h-20 rounded-full"
          />
          <Text className="text-white font-bold text-xl mt-2">
            Juan Dela Cruz
          </Text>
          <Text className="text-white text-xs mt-1">
            0 Wishlist | 0 Followers | 0 Following
          </Text>
        </View>

        {/* Orders */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white font-semibold text-lg">My Orders</Text>
            <Text className="text-pink-400">View All Orders &gt;</Text>
          </View>
          <View className="flex-row justify-between">
            {iconList.map((item, idx) => (
              <TouchableOpacity key={idx} className="items-center">
                <View className="w-12 h-12 bg-pink-500/20 rounded-full justify-center items-center mb-1">
                  <Ionicons name={item.icon as any} size={24} color="#fff" />
                </View>
                <Text className="text-xs text-white text-center">
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Wallet */}
        <View className="mt-6">
          <Text className="text-white font-semibold text-lg mb-2">
            My Wallet
          </Text>
          <View className="flex-row justify-between bg-white/10 rounded-xl p-4 mb-4">
            <View>
              <Text className="text-white text-xs">PHP</Text>
              <Text className="text-white text-2xl font-bold">0.00</Text>
              <TouchableOpacity className="mt-1 bg-pink-500 px-3 py-1 rounded-full">
                <Text className="text-white text-xs">Cash In</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text className="text-white text-xs mb-1">Payment Options</Text>
              <TouchableOpacity className="bg-pink-500 px-3 py-1 rounded-full mb-1">
                <Text className="text-white text-xs">Link Cards</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-white/20 px-3 py-1 rounded-full">
                <Text className="text-white text-xs">View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Menu List */}
        <View className="mt-4 space-y-3">
          {menuList.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              className="flex-row items-center p-3 bg-white/10 rounded-xl"
            >
              <Ionicons name={item.icon as any} size={20} color="#fff" />
              <Text className="text-white ml-3 text-sm">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </GradientLayout>
  );
};
