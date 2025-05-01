import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { CashInModal } from "@/components/CashInModal";
import { type TStackParamsList } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/store/user.store";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "PROFILE_SCREEN">;
};

const iconList = [
  { label: "To Pay", icon: "card" },
  { label: "To Ship", icon: "cube" },
  { label: "To Receive", icon: "car" },
  { label: "To Review", icon: "chatbubble-ellipses" },
  { label: "Returns/Cancels", icon: "refresh" },
];

const menuList = [
  { label: "Voucher", icon: "pricetag" },
  // { label: "Recently Viewed", icon: "time" },
  // { label: "My Ratings", icon: "star" },
  { label: "Account Settings", icon: "settings" },
  { label: "Help Center", icon: "help-circle" },
  { label: "Chat Assistant AI", icon: "chatbubbles" },
];

export const ProfileScreen: React.FC<TScreenProps> = ({ navigation }) => {
  const logout = useUserStore((state) => state.logout);
  const user = useUserStore((state) => state.user);
  const [isCashInModalVisible, setIsCashInModalVisible] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigation.replace("LOGIN_SCREEN");
  };

  const handleCashIn = (amount: number) => {
    // Handle the cash in logic here
    navigation.navigate("CHECKOUT_WEBVIEW", {
      url: `your-payment-gateway-url?amount=${amount}`,
    });
  };

  return (
    <GradientLayout>
      <ScrollView className="flex-1 px-4 py-6">
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate("USERHOME_SCREEN")}
          className="absolute left-4 top-6 z-10"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        {/* Header Title */}
        <View className="w-full pt-6 mb-4">
          <Text className="text-white font-bold text-xl text-center">
            My Profile
          </Text>
        </View>

        {/* User Info */}
        <View className="items-center">
          <Image
            source={{ uri: "https://via.placeholder.com/80" }}
            className="w-20 h-20 rounded-full"
          />
          <Text className="text-white font-bold text-xl mt-2">
            {user?.name || "Guest"}
          </Text>
          <Text className="text-white text-xs mt-1">
            0 Wishlist | 0 Followers | 0 Following
          </Text>
        </View>

        {/* Orders */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white font-semibold text-lg">My Orders</Text>
            <Text
              className="text-pink-200"
              onPress={() =>
                navigation.navigate("ORDERS_SCREEN", {
                  selectedOrderId: "status:All Orders",
                  showDetails: false,
                })
              }
            >
              View All Orders &gt;
            </Text>
          </View>
          <View className="flex-row justify-between">
            {iconList.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                className="items-center"
                onPress={() => {
                  navigation.navigate("ORDERS_SCREEN", {
                    selectedOrderId: `status:${item.label}`,
                    showDetails: false,
                  });
                }}
              >
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
              <TouchableOpacity
                className="mt-1 bg-pink-500 px-3 py-1 rounded-full"
                onPress={() => setIsCashInModalVisible(true)}
              >
                <Text className="text-white text-xs">Cash In</Text>
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
              onPress={() => {
                if (item.label === "Account Settings") {
                  navigation.navigate("ACCOUNT_SETTINGS_SCREEN");
                } else if (item.label === "Help Center") {
                  navigation.navigate("HELPCENTER_SCREEN");
                } else if (item.label === "Chat Assistant AI") {
                  navigation.navigate("CHATASSISTANT_SCREEN");
                }
              }}
            >
              <Ionicons name={item.icon as any} size={20} color="#fff" />
              <Text className="text-white ml-3 text-sm">{item.label}</Text>
            </TouchableOpacity>
          ))}

          {/* Logout Button */}
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center p-3 bg-red-500/80 rounded-xl"
          >
            <Ionicons name="log-out" size={20} color="#fff" />
            <Text className="text-white ml-3 text-sm">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Cash In Modal */}
      <CashInModal
        visible={isCashInModalVisible}
        onClose={() => setIsCashInModalVisible(false)}
        onCashIn={handleCashIn}
      />
    </GradientLayout>
  );
};
