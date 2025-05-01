import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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
  { label: "Recently Viewed", icon: "time" },
  { label: "My Ratings", icon: "star" },
  { label: "Account Settings", icon: "settings" },
  { label: "Help Center", icon: "help-circle" },
  { label: "Chat Assistant", icon: "chatbubbles" },
];

export const ProfileScreen: React.FC<TScreenProps> = ({ navigation }) => {
  const logout = useUserStore((state) => state.logout);
  const user = useUserStore((state) => state.user);

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

  const [isCashInModalVisible, setIsCashInModalVisible] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [isCustomAmount, setIsCustomAmount] = useState(false);

  const CashInModal = () => {
    const amounts = [100, 200, 300, 400, 500, 1000];

    const handleAmountSelect = (amount: number) => {
      setIsCashInModalVisible(false);
      setIsCustomAmount(false);
      setCustomAmount("");
      handleCashIn(amount);
    };

    const handleCustomAmountSubmit = () => {
      const amount = Number(customAmount);
      if (!isNaN(amount) && amount > 0) {
        setIsCashInModalVisible(false);
        setIsCustomAmount(false);
        setCustomAmount("");
        handleCashIn(amount);
      } else {
        Alert.alert("Invalid Amount", "Please enter a valid amount");
      }
    };

    return (
      <Modal
        visible={isCashInModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCashInModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <Pressable
            className="flex-1 justify-center items-center bg-black/50"
            onPress={() => setIsCashInModalVisible(false)}
          >
            <Pressable
              className="w-[80%] bg-white rounded-2xl p-4"
              onPress={(e) => e.stopPropagation()}
            >
              <Text className="text-xl font-bold text-center mb-4">
                WALLET CASH-IN
              </Text>
              <Text className="font-medium text-center mb-4">
                Select Amount
              </Text>

              {!isCustomAmount ? (
                <>
                  <View className="flex-row flex-wrap justify-between">
                    {amounts.map((amount) => (
                      <TouchableOpacity
                        key={amount}
                        className="w-[30%] bg-purple-100 rounded-xl p-3 mb-3"
                        onPress={() => handleAmountSelect(amount)}
                      >
                        <Text className="text-purple-900 text-center font-semibold">
                          ₱{amount}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity
                    className="mt-2"
                    onPress={() => setIsCustomAmount(true)}
                  >
                    <Text className="text-purple-700 text-center">
                      Enter Custom Amount
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View>
                  <TextInput
                    className="border border-gray-300 rounded-xl p-3 mb-4"
                    placeholder="Enter amount"
                    keyboardType="numeric"
                    value={customAmount}
                    onChangeText={setCustomAmount}
                    autoFocus
                  />
                  <View className="flex-row justify-end space-x-3">
                    <TouchableOpacity
                      className="px-4 py-2"
                      onPress={() => {
                        setIsCustomAmount(false);
                        setCustomAmount("");
                      }}
                    >
                      <Text className="text-gray-600">Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-purple-700 px-4 py-2 rounded-xl"
                      onPress={handleCustomAmountSubmit}
                    >
                      <Text className="text-white">Confirm</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <TouchableOpacity
                className="mt-4"
                onPress={() => setIsCashInModalVisible(false)}
              >
                <Text className="text-gray-500 text-center">Cancel</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    );
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
      <CashInModal />
    </GradientLayout>
  );
};
