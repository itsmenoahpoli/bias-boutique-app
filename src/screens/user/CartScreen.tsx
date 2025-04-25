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
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { TStackParamsList } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useCartStore } from "@/store/cart.store";
import { useNavigation } from "@react-navigation/native";
import { useOrdersService } from "@/services";
import { useUserStore } from "@/store/user.store";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "CART_SCREEN">;
};

export const CartScreen: React.FC<TScreenProps> = ({ navigation }) => {
  const {
    items,
    loadCart,
    updateQuantity: updateCartQuantity,
    removeFromCart,
  } = useCartStore();
  const ordersService = useOrdersService();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set()); // Changed from number to string
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const { user } = useUserStore();

  useEffect(() => {
    loadCart();
  }, []);

  const toggleSelect = (id: string) => {
    // Changed from number to string
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
    // Changed from number to string
    const item = items.find((item) => item.id === id);
    if (item) {
      const newQuantity = Math.max(1, item.quantity + delta);
      await updateCartQuantity(id, newQuantity);
    }
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map((item) => item.id)));
    }
  };

  const calculateTotal = (): number => {
    return items
      .filter((item) => selectedItems.has(item.id))
      .reduce((sum, item) => {
        let numericPrice: number;
        if (typeof item.price === "string") {
          // Remove '₱' and ',' then convert to number
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
      // Get selected items from the cart
      const selectedCartItems = items.filter((item) =>
        selectedItems.has(item.id)
      );

      if (selectedCartItems.length === 0) {
        Alert.alert("Error", "Please select items to checkout");
        return;
      }

      const orderResponse = await ordersService.createOrder(
        user?.email || "",
        selectedCartItems
      );

      navigation.navigate("CHECKOUT_WEBVIEW", {
        url: orderResponse.payment_link,
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
                Shopping Cart ({items.length})
              </Text>
              <Text className="text-white text-sm p-2">Edit</Text>
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
            {items.length === 0 ? (
              <View className="items-center justify-center flex-1 mt-20">
                <Text className="text-white text-center text-lg">
                  Your cart is empty 🛒
                </Text>
              </View>
            ) : (
              items.map((item, index) => (
                <View
                  key={`${item.id}-${index}`} // Added index as fallback
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
                    source={item.image}
                    className="w-16 h-16 rounded-lg"
                    resizeMode="contain"
                  />

                  <View className="ml-4 flex-1">
                    <Text className="font-semibold text-sm">{item.name}</Text>
                    <Text className="text-black font-medium">
                      {typeof item.price === "number"
                        ? // @ts-ignore
                          item.price.toLocaleString()
                        : item.price}
                    </Text>
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

                  <Pressable
                    onPress={() => removeFromCart(item.id)}
                    className="ml-2"
                  >
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </Pressable>
                </View>
              ))
            )}
          </ScrollView>

          {/* Footer */}
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
                  {items.length > 0 && selectedItems.size === items.length && (
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
        </View>
      </SafeAreaView>
    </GradientLayout>
  );
};
