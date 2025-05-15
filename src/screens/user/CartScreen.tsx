import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
  Alert,
  Modal,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { GradientLayout } from "@/components";
import { TStackParamsList } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { useNavigation } from "@react-navigation/native";
import { useOrdersService } from "@/services";
import { useUserStore } from "@/store/user.store";
import { useWalletStore } from "@/store/wallet.store";
import { PaymentOptionsModal } from "@/components";
import { PRODUCT_PLACEHOLDER } from "@/images";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "CART_SCREEN">;
  route: RouteProp<TStackParamsList, "CART_SCREEN">;
};

export const CartScreen: React.FC<TScreenProps> = ({ navigation, route }) => {
  const {
    items: cartItems,
    loadCart,
    updateQuantity: updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useCartStore();
  const {
    items: wishlistItems,
    loadWishlist,
    removeFromWishlist,
  } = useWishlistStore();
  const ordersService = useOrdersService();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const { user } = useUserStore();
  const { balance, setBalance } = useWalletStore();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showPaymentInput, setShowPaymentInput] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<any>(null);
  const [paymentInput, setPaymentInput] = useState("");
  const [activeTab, setActiveTab] = useState<"cart" | "wishlist">(
    route.params?.activeTab || "cart"
  );

  useEffect(() => {
    loadCart();
    loadWishlist();
  }, []);

  useEffect(() => {
    if (route.params?.autoCheckout && cartItems.length > 0) {
      setSelectedItems(new Set(cartItems.map((item) => item.id)));
    }
  }, [route.params?.autoCheckout, cartItems]);

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const updateQuantity = async (id: string, delta: number) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      await updateCartQuantity(id, newQuantity);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map((item) => item.id)));
    }
  };

  const calculateTotal = (): number => {
    return cartItems
      .filter((item) => selectedItems.has(item.id))
      .reduce((sum, item) => {
        let numericPrice: number;
        if (typeof item.price === "string") {
          numericPrice = parseFloat(item.price.replace(/[₱,]/g, ""));
        } else {
          numericPrice = item.price;
        }
        return sum + numericPrice * item.quantity;
      }, 0);
  };

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const selectedCartItems = cartItems.filter((item) =>
        selectedItems.has(item.id)
      );

      if (selectedCartItems.length === 0) {
        Alert.alert("Error", "Please select items to checkout");
        return;
      }

      setShowPaymentOptions(true);
    } catch (error) {
      Alert.alert(
        "Checkout Error",
        error instanceof Error ? error.message : "Failed to process checkout"
      );
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handleSelectPaymentOption = async (option: any) => {
    setSelectedPaymentOption(option);
    setShowPaymentOptions(false);

    if (option.id === "wallet") {
      // Process wallet payment directly
      setIsCheckoutLoading(true);
      try {
        const selectedCartItems = cartItems.filter((item) =>
          selectedItems.has(item.id)
        );

        const orderResponse = await ordersService.createOrder(
          user?.email || "",
          selectedCartItems
        );

        // Deduct from wallet balance
        const newBalance = balance - calculateTotal();
        await setBalance(newBalance);

        setShowSuccessModal(true);
        clearCart();

        navigation.navigate("ORDERS_SCREEN", {
          selectedOrderId: orderResponse.id,
          showDetails: true,
        });
      } catch (error) {
        Alert.alert(
          "Checkout Error",
          error instanceof Error ? error.message : "Failed to process checkout"
        );
      } finally {
        setIsCheckoutLoading(false);
      }
    } else {
      setShowPaymentInput(true);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!paymentInput.trim()) {
      Alert.alert("Error", "Please enter payment details");
      return;
    }

    setIsCheckoutLoading(true);
    try {
      const selectedCartItems = cartItems.filter((item) =>
        selectedItems.has(item.id)
      );

      const orderResponse = await ordersService.createOrder(
        user?.email || "",
        selectedCartItems
      );

      setShowPaymentInput(false);
      setShowSuccessModal(true);
      clearCart();

      navigation.navigate("ORDERS_SCREEN", {
        selectedOrderId: orderResponse.id,
        showDetails: true,
      });
    } catch (error) {
      Alert.alert(
        "Checkout Error",
        error instanceof Error ? error.message : "Failed to process checkout"
      );
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const getAssetUrl = (image: string | null) => {
    if (!image) return PRODUCT_PLACEHOLDER;
    return "https://bias-boutique-backend-production.up.railway.app" + image;
  };

  const renderPaymentInputModal = () => {
    if (!selectedPaymentOption) return null;

    const getInputPlaceholder = () => {
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

    return (
      <Modal
        visible={showPaymentInput}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentInput(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-xl w-11/12 max-w-md">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold">
                {selectedPaymentOption.name}
              </Text>
              <Pressable onPress={() => setShowPaymentInput(false)}>
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
                onPress={() => setShowPaymentInput(false)}
                className="bg-gray-200 py-3 px-5 rounded-md"
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handlePaymentSubmit}
                disabled={isCheckoutLoading}
                className="bg-blue-500 py-3 px-5 rounded-md"
              >
                <Text className="text-white font-medium">
                  {isCheckoutLoading ? "Processing..." : "Submit Payment"}
                </Text>
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
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setShowSuccessModal(false);
          navigation.goBack();
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-xl w-11/12 max-w-md items-center">
            <View className="w-16 h-16 bg-green-100 rounded-full justify-center items-center mb-4">
              <Ionicons name="checkmark" size={32} color="#22C55E" />
            </View>
            <Text className="text-green-600 text-xl font-bold mb-4">
              Payment Successful!
            </Text>
            <Text className="text-gray-700 mb-6 text-center">
              Your order has been placed successfully. Thank you for shopping
              with us!
            </Text>
            <Pressable
              onPress={() => {
                setShowSuccessModal(false);
                navigation.goBack();
              }}
              className="bg-blue-500 py-3 px-8 rounded-md"
            >
              <Text className="text-white font-medium">Done</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCartItems = () => {
    if (cartItems.length === 0) {
      return (
        <View className="items-center justify-center flex-1 mt-20">
          <Text className="text-white text-center text-lg">
            Your cart is empty 🛒
          </Text>
        </View>
      );
    }

    return cartItems.map((item, index) => (
      <View
        key={`${item.id}-${index}`}
        className="flex-row bg-white/90 rounded-xl p-3 items-center"
      >
        <Pressable
          onPress={() => toggleSelect(item.id)}
          className="w-5 h-5 border border-gray-400 rounded mr-2 items-center justify-center"
        >
          {selectedItems.has(item.id) && (
            <View className="w-3 h-3 bg-blue-600 rounded" />
          )}
        </Pressable>

        <Image
          source={{
            uri: getAssetUrl(item.image) || PRODUCT_PLACEHOLDER,
          }}
          className="w-16 h-16 rounded-lg"
          resizeMode="contain"
        />

        <View className="ml-4 flex-1">
          <Text className="font-semibold text-sm">{item.name}</Text>
          <Text className="text-black font-medium">{item.price}</Text>
          <View className="flex-row items-center mt-1">
            <Pressable
              onPress={() => updateQuantity(item.id, -1)}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              <Text className="font-bold">−</Text>
            </Pressable>
            <Text className="mx-2">{item.quantity}</Text>
            <Pressable
              onPress={() => updateQuantity(item.id, 1)}
              className="px-2 py-1 bg-gray-200 rounded"
            >
              <Text className="font-bold">+</Text>
            </Pressable>
          </View>
        </View>

        <Pressable onPress={() => removeFromCart(item.id)} className="ml-2">
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
        </Pressable>
      </View>
    ));
  };

  const renderWishlistItems = () => {
    if (wishlistItems.length === 0) {
      return (
        <View className="items-center justify-center flex-1 mt-20">
          <Text className="text-white text-center text-lg">
            Your wishlist is empty 💫
          </Text>
        </View>
      );
    }

    return wishlistItems.map((item, index) => (
      <View
        key={`${item.id}-${index}`}
        className="flex-row bg-white/90 rounded-xl p-3 items-center"
      >
        <Image
          source={{
            uri: getAssetUrl(item.image) || PRODUCT_PLACEHOLDER,
          }}
          className="w-16 h-16 rounded-lg"
          resizeMode="contain"
        />

        <View className="ml-4 flex-1">
          <Text className="font-semibold text-sm">{item.name}</Text>
          <Text className="text-black font-medium">{item.price}</Text>
        </View>

        <Pressable onPress={() => removeFromWishlist(item.id)} className="ml-2">
          <Ionicons name="close" size={20} color="#EF4444" />
        </Pressable>
      </View>
    ));
  };

  return (
    <GradientLayout>
      <SafeAreaView className="flex-1">
        <View
          className="flex-1"
          style={{
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          }}
        >
          {/* Fixed Header */}
          <View className="z-10 bg-transparent">
            <View className="flex-row items-center justify-between px-4 py-3">
              <Pressable onPress={() => navigation.goBack()} className="p-2">
                <Ionicons name="arrow-back" size={20} color="white" />
              </Pressable>
              <Text className="text-white font-semibold text-lg">
                {activeTab === "cart" ? "Shopping Cart" : "Wishlist"}
              </Text>
              <Text>&nbsp;</Text>
            </View>

            {/* Tabs */}
            <View className="flex-row px-4 mb-4">
              <Pressable
                onPress={() => setActiveTab("cart")}
                className={`flex-1 py-2 rounded-l-lg ${
                  activeTab === "cart" ? "bg-white/20" : "bg-white/10"
                }`}
              >
                <Text className="text-white text-center font-medium">
                  Cart ({cartItems.length})
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setActiveTab("wishlist")}
                className={`flex-1 py-2 rounded-r-lg ${
                  activeTab === "wishlist" ? "bg-white/20" : "bg-white/10"
                }`}
              >
                <Text className="text-white text-center font-medium">
                  Wishlist ({wishlistItems.length})
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            className="flex-1 flex-col px-4 space-y-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 10,
              paddingBottom: 20,
            }}
          >
            {activeTab === "cart" ? renderCartItems() : renderWishlistItems()}
          </ScrollView>

          {/* Footer */}
          {activeTab === "cart" && (
            <View className="p-2 bg-white/10 backdrop-blur-lg border-t border-white/20">
              {/* Voucher Section */}
              <View className="flex-row items-center mb-2 bg-white/5 px-3 py-1 rounded-lg">
                <View className="flex-row items-center flex-1">
                  <Ionicons name="ticket-outline" size={16} color="white" />
                  <Text className="text-white text-sm ml-2">
                    Platform Voucher
                  </Text>
                </View>
                <TextInput
                  placeholder="Enter code"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  className="bg-white/10 px-3 py-1 rounded-lg w-28 text-sm text-white"
                />
              </View>

              {/* Select All and Checkout Section */}
              <View className="flex-row items-center justify-between bg-white/5 px-3 py-2 rounded-xl">
                <View className="flex-row items-center">
                  <Pressable
                    onPress={toggleSelectAll}
                    className="w-5 h-5 border-2 border-white/30 rounded mr-2 items-center justify-center"
                  >
                    {cartItems.length > 0 &&
                      selectedItems.size === cartItems.length && (
                        <View className="w-3 h-3 bg-purple-500 rounded" />
                      )}
                  </Pressable>
                  <View>
                    <Text className="text-white text-sm">Select All</Text>
                    <Text className="text-white font-bold text-base">
                      ₱{calculateTotal().toLocaleString("en-PH")}
                    </Text>
                  </View>
                </View>

                <Pressable
                  onPress={handleCheckout}
                  disabled={isCheckoutLoading}
                  className="bg-gradient-to-r from-purple-900 to-blue-900 px-6 py-3 rounded-lg transform scale-105"
                  style={{
                    shadowColor: "#8B5CF6",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 4,
                    opacity: isCheckoutLoading ? 0.7 : 1,
                  }}
                >
                  <Text className="bg-white text-purple-900 font-bold text-base tracking-wide rounded-lg p-2">
                    {isCheckoutLoading
                      ? "Processing..."
                      : `Checkout (${selectedItems.size})`}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </SafeAreaView>

      <PaymentOptionsModal
        visible={showPaymentOptions}
        onClose={() => setShowPaymentOptions(false)}
        onSelectPaymentOption={handleSelectPaymentOption}
        totalAmount={calculateTotal()}
      />
      {renderPaymentInputModal()}
      {renderSuccessModal()}
    </GradientLayout>
  );
};
