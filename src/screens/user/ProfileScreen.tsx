import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { CashInModal } from "@/components/CashInModal";
import { PaymentOptionsModal } from "@/components/PaymentOptionsModal";
import { type TStackParamsList } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/store/user.store";
import { useWalletStore } from "@/store/wallet.store";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

const voucherList = [
  {
    code: "WELCOME20",
    discount: "20%",
    validity: "2024-12-31",
    minSpend: 1000,
  },
  {
    code: "SUMMER50",
    discount: "₱500",
    validity: "2024-08-31",
    minSpend: 2000,
  },
  { code: "FLASH25", discount: "25%", validity: "2024-06-30", minSpend: 1500 },
];

export const ProfileScreen: React.FC<TScreenProps> = ({ navigation }) => {
  const logout = useUserStore((state) => state.logout);
  const user = useUserStore((state) => state.user);
  const [isCashInModalVisible, setIsCashInModalVisible] = useState(false);
  const [isPaymentOptionsVisible, setIsPaymentOptionsVisible] = useState(false);
  const [isPaymentInputVisible, setIsPaymentInputVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isPhotoOptionsVisible, setIsPhotoOptionsVisible] = useState(false);
  const [isVoucherModalVisible, setIsVoucherModalVisible] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [cashInAmount, setCashInAmount] = useState(0);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<any>(null);
  const [paymentInput, setPaymentInput] = useState("");
  const { balance, addBalance, loadBalance } = useWalletStore();

  useEffect(() => {
    loadBalance();
    loadProfilePhoto();
  }, []);

  const loadProfilePhoto = async () => {
    try {
      const savedPhoto = await AsyncStorage.getItem("profilePhoto");
      if (savedPhoto) {
        setProfilePhoto(savedPhoto);
      }
    } catch (error) {
      console.error("Error loading profile photo:", error);
    }
  };

  const handlePhotoUpload = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert("Permission to access camera roll is required!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        await AsyncStorage.setItem("profilePhoto", base64Image);
        setProfilePhoto(base64Image);
        setIsPhotoOptionsVisible(false);
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
    }
  };

  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        alert("Permission to access camera is required!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        await AsyncStorage.setItem("profilePhoto", base64Image);
        setProfilePhoto(base64Image);
        setIsPhotoOptionsVisible(false);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      await AsyncStorage.removeItem("profilePhoto");
      setProfilePhoto(null);
      setIsPhotoOptionsVisible(false);
    } catch (error) {
      console.error("Error removing photo:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigation.replace("LOGIN_SCREEN");
  };

  const handleCashIn = (amount: number) => {
    setCashInAmount(amount);
    setIsCashInModalVisible(false);
    setIsPaymentOptionsVisible(true);
  };

  const handleSelectPaymentOption = (option: any) => {
    setSelectedPaymentOption(option);
    setIsPaymentOptionsVisible(false);
    setIsPaymentInputVisible(true);
  };

  const handlePaymentSubmit = async () => {
    setIsPaymentInputVisible(false);
    await addBalance(cashInAmount);
    setPaymentInput("");
    setSelectedPaymentOption(null);
    setIsSuccessModalVisible(true);
  };

  const getInputPlaceholder = () => {
    if (!selectedPaymentOption) return "Enter payment details";

    switch (selectedPaymentOption.id) {
      case "gcash":
      case "maya":
        return "Enter mobile number";
      case "bpi":
      case "chinabank":
      case "rcbc":
      case "unionbank":
        return "Enter account number";
      case "qrph":
        return "Enter reference number";
      default:
        return "Enter payment details";
    }
  };

  const getUserInitials = () => {
    if (!user?.name) return "G";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderPaymentInputModal = () => {
    if (!selectedPaymentOption) return null;

    return (
      <Modal
        visible={isPaymentInputVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPaymentInputVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-xl w-11/12 max-w-md">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold">
                {selectedPaymentOption.name}
              </Text>
              <Pressable onPress={() => setIsPaymentInputVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </Pressable>
            </View>

            <Text className="text-gray-700 mb-2">Payment Details</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-3 mb-6"
              placeholder={getInputPlaceholder()}
              value={paymentInput}
              onChangeText={setPaymentInput}
              keyboardType={
                selectedPaymentOption.id.includes("bank")
                  ? "number-pad"
                  : "default"
              }
            />

            <View className="flex-row justify-end space-x-3">
              <Pressable
                onPress={() => setIsPaymentInputVisible(false)}
                className="bg-gray-200 py-3 px-5 rounded-md"
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handlePaymentSubmit}
                className="bg-blue-500 py-3 px-5 rounded-md"
              >
                <Text className="text-white font-medium">Submit Payment</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderSuccessModal = () => {
    return (
      <Modal
        visible={isSuccessModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSuccessModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-xl w-11/12 max-w-md items-center">
            <View className="w-16 h-16 bg-green-100 rounded-full justify-center items-center mb-4">
              <Ionicons name="checkmark" size={32} color="#22c55e" />
            </View>
            <Text className="text-green-600 text-xl font-bold mb-2">
              Payment Successful!
            </Text>
            <Text className="text-gray-700 mb-6 text-center">
              Your wallet has been credited with ₱
              {cashInAmount.toLocaleString()}.00
            </Text>
            <TouchableOpacity
              onPress={() => setIsSuccessModalVisible(false)}
              className="bg-blue-500 py-3 px-8 rounded-md"
            >
              <Text className="text-white font-medium">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderPhotoOptionsModal = () => {
    return (
      <Modal
        visible={isPhotoOptionsVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPhotoOptionsVisible(false)}
      >
        <View className="flex-1 justify-end items-center bg-black/50">
          <View className="bg-white w-full rounded-t-xl p-6">
            <Text className="text-xl font-bold mb-4">Profile Photo</Text>
            <TouchableOpacity
              onPress={handleTakePhoto}
              className="flex-row items-center py-3 border-b border-gray-200"
            >
              <Ionicons name="camera" size={24} color="#000" />
              <Text className="ml-3 text-base">Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePhotoUpload}
              className="flex-row items-center py-3 border-b border-gray-200"
            >
              <Ionicons name="images" size={24} color="#000" />
              <Text className="ml-3 text-base">Choose from Library</Text>
            </TouchableOpacity>
            {profilePhoto && (
              <TouchableOpacity
                onPress={handleRemovePhoto}
                className="flex-row items-center py-3"
              >
                <Ionicons name="trash" size={24} color="#ff4444" />
                <Text className="ml-3 text-base text-red-500">
                  Remove Photo
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => setIsPhotoOptionsVisible(false)}
              className="mt-4 bg-gray-200 py-3 rounded-md"
            >
              <Text className="text-center font-medium">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderVoucherModal = () => {
    return (
      <Modal
        visible={isVoucherModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsVoucherModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <View
            style={{
              backgroundColor: "#1F2937",
              width: "90%",
              height: "80%",
              borderRadius: 12,
              padding: 16,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                My Vouchers
              </Text>
              <TouchableOpacity onPress={() => setIsVoucherModalVisible(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ flex: 1, height: "100%" }}
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              {voucherList.map((voucher, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 16,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 18,
                      }}
                    >
                      {voucher.code}
                    </Text>
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 9999,
                        backgroundColor: "rgba(34,197,94,0.5)",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 14,
                          fontWeight: "bold",
                        }}
                      >
                        {voucher.discount}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                      Valid until:
                    </Text>
                    <Text style={{ color: "white" }}>{voucher.validity}</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                      Minimum spend:
                    </Text>
                    <Text style={{ color: "white" }}>
                      ₱{voucher.minSpend.toLocaleString()}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={{
                backgroundColor: "#9333EA",
                paddingVertical: 12,
                borderRadius: 12,
                marginTop: 12,
              }}
              onPress={() => setIsVoucherModalVisible(false)}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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

        {/* Header Title */}
        <View className="w-full pt-6 mb-4">
          <Text className="text-white font-bold text-xl text-center">
            My Profile
          </Text>
        </View>

        {/* User Info */}
        <View className="items-center">
          <TouchableOpacity onPress={() => setIsPhotoOptionsVisible(true)}>
            {profilePhoto ? (
              <Image
                source={{ uri: profilePhoto }}
                className="w-20 h-20 rounded-full"
              />
            ) : (
              <View className="w-20 h-20 rounded-full bg-pink-500 justify-center items-center">
                <Text className="text-white text-2xl font-bold">
                  {getUserInitials()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <Text className="text-white font-bold text-xl mt-2">
            {user?.name || "Guest"}
          </Text>
          <View className="flex-row mt-1">
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("CART_SCREEN", { activeTab: "wishlist" })
              }
            >
              <Text className="text-white text-xs">0 Wishlist</Text>
            </TouchableOpacity>
            <Text className="text-white text-xs"> | </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("SOCIAL_SCREEN", { activeTab: "followers" })
              }
            >
              <Text className="text-white text-xs">0 Followers</Text>
            </TouchableOpacity>
            <Text className="text-white text-xs"> | </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("SOCIAL_SCREEN", { activeTab: "following" })
              }
            >
              <Text className="text-white text-xs">0 Following</Text>
            </TouchableOpacity>
          </View>
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
              <Text className="text-white text-2xl font-bold">
                {balance.toFixed(2)}
              </Text>
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
                if (item.label === "Voucher") {
                  setIsVoucherModalVisible(true);
                } else if (item.label === "Account Settings") {
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

      {/* Payment Options Modal */}
      <PaymentOptionsModal
        visible={isPaymentOptionsVisible}
        onClose={() => setIsPaymentOptionsVisible(false)}
        onSelectPaymentOption={handleSelectPaymentOption}
      />

      {/* Payment Input Modal */}
      {renderPaymentInputModal()}

      {/* Success Modal */}
      {renderSuccessModal()}

      {/* Photo Options Modal */}
      {renderPhotoOptionsModal()}

      {/* Voucher Modal */}
      {renderVoucherModal()}
    </GradientLayout>
  );
};
