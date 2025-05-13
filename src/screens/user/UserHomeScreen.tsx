import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Modal,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ShoppingCart, ClipboardList, Wallet, User } from "lucide-react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { TStackParamsList } from "@/types/navigation";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useUserStore } from "@/store/user.store";
import {
  Disc,
  Image as ImageIcon,
  Wand2,
  Shirt,
  Watch,
  PenTool,
  Sparkles,
  Home,
  Grid,
} from "lucide-react-native";
import { BRAND_LOGO } from "@/images";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "USERHOME_SCREEN">;
};

const categories = [
  { label: "Albums", icon: Disc },
  { label: "Photocards", icon: ImageIcon },
  { label: "Lightsticks", icon: Wand2 },
  { label: "Clothing", icon: Shirt },
  { label: "Accessories", icon: Watch },
  { label: "Stationary", icon: PenTool },
  { label: "Beauty Products", icon: Sparkles },
  { label: "Home Goods", icon: Home },
  { label: "View All", icon: Grid },
];

const specialOffers = [
  {
    id: 1,
    title: "11.11 Free Shipping Special",
    description:
      "Enjoy free shipping on all your orders during our special 11.11 promotion!",
    validUntil: "November 15th",
    details: [
      "Valid for all products",
      "No minimum purchase required",
      "Limited time offer",
    ],
  },
  {
    id: 2,
    title: "Black Friday Sale",
    description:
      "Get up to 50% off on selected items during our Black Friday event!",
    validUntil: "November 24th",
    details: [
      "Up to 50% off on selected items",
      "Early bird specials available",
      "Limited stock",
    ],
  },
  {
    id: 3,
    title: "New User Discount",
    description: "First-time shoppers get 15% off on their first purchase!",
    validUntil: "December 31st",
    details: [
      "15% off first purchase",
      "No minimum spend",
      "One-time use only",
    ],
  },
  {
    id: 4,
    title: "Bundle Deals",
    description: "Buy 2 or more items and get additional discounts!",
    validUntil: "Ongoing",
    details: [
      "Buy 2 get 10% off",
      "Buy 3 get 15% off",
      "Buy 4 or more get 20% off",
    ],
  },
];

export const UserHomeScreen: React.FC<TScreenProps> = ({ navigation }) => {
  const [hasError, setHasError] = useState(false);
  const [isSpecialOffersModalVisible, setIsSpecialOffersModalVisible] =
    useState(false);
  const user = useUserStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (hasError) {
      // Reset error state after a delay
      const timer = setTimeout(() => setHasError(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [hasError]);

  if (hasError) {
    return (
      <GradientLayout>
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-lg">Something went wrong</Text>
          <TouchableOpacity
            onPress={() => setHasError(false)}
            className="mt-4 bg-white/20 px-4 py-2 rounded-lg"
          >
            <Text className="text-white">Try Again</Text>
          </TouchableOpacity>
        </View>
      </GradientLayout>
    );
  }

  const handleRedirect = useCallback(
    (page: string) => {
      try {
        switch (page) {
          case "shopping-cart":
            navigation.navigate("CART_SCREEN", {});
            break;
          case "orders":
            navigation.navigate("PRODUCT_COMPARE_SCREEN");
            break;
          case "mainhome":
            // For now, do nothing until Main Home is implemented
            break;
          case "wallet":
            navigation.navigate("WALLET_SCREEN");
            break;
          case "profile":
            navigation.navigate("PROFILE_SCREEN");
            break;
        }
      } catch (error) {
        console.warn("Navigation error:", error);
      }
    },
    [navigation]
  );

  const handleCategoryPress = useCallback(
    (category: string) => {
      try {
        navigation.navigate("PRODUCTS_SCREEN", { category });
      } catch (error) {
        console.warn("Category navigation error:", error);
      }
    },
    [navigation]
  );

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      navigation.navigate("PRODUCTS_SCREEN", {
        category: "View All",
        searchQuery: searchQuery.trim(),
      });
    }
  }, [searchQuery, navigation]);

  const renderCategories = useMemo(() => {
    return categories.map((item, index) => {
      const IconComponent = item.icon;
      return (
        <TouchableOpacity
          key={index}
          className="w-[22%] items-center my-8"
          onPress={() => handleCategoryPress(item.label)}
        >
          <LinearGradient
            colors={["#4c1d95", "#2e1065"]}
            className="w-12 h-12 rounded-full items-center justify-center mb-2"
          >
            <IconComponent size={24} color="white" />
          </LinearGradient>
          <Text className="text-white text-xs text-center">{item.label}</Text>
        </TouchableOpacity>
      );
    });
  }, [handleCategoryPress]);

  return (
    <GradientLayout>
      <SafeAreaView style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: 16,
            paddingTop: Platform.OS === "android" ? 40 : 10,
            paddingBottom: 16,
            position: "relative",
          }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-white text-lg">Good Morning 👋</Text>
              <Text className="text-white font-bold text-xl">
                {user?.name || "Guest"}
              </Text>
            </View>
            <View className="flex-row space-x-3">
              <Ionicons name="settings-outline" size={24} color="white" />
            </View>
          </View>

          {/* Search */}
          <View className="bg-white/20 rounded-xl p-3 flex-row items-center mb-4">
            <Ionicons name="search" size={20} color="white" className="mr-2" />
            <TextInput
              placeholder="Search"
              placeholderTextColor="white"
              className="flex-1 text-white pl-3"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity onPress={handleSearch}>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Product Compare Button */}
          <TouchableOpacity
            className="bg-purple-500/40 rounded-xl p-3 items-center mb-4"
            onPress={() => navigation.navigate("PRODUCT_COMPARE_SCREEN")}
          >
            <Text className="text-white font-semibold">Product Compare</Text>
          </TouchableOpacity>

          {/* Special Offers */}
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-white font-bold text-lg">
                Special Offers
              </Text>
              <TouchableOpacity
                onPress={() => setIsSpecialOffersModalVisible(true)}
              >
                <Text className="text-blue-300">See All</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className="bg-purple-500 rounded-2xl p-4"
              onPress={() => setIsSpecialOffersModalVisible(true)}
            >
              <View>
                <Text className="text-white font-bold text-xl">11.11</Text>
                <Text className="text-white text-sm">
                  Free Shipping Special
                </Text>
                <Text className="text-white text-xs mt-1">
                  Get a free shipping for every checkout. Only valid until 11-15
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Special Offers Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={isSpecialOffersModalVisible}
            onRequestClose={() => setIsSpecialOffersModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-purple-900 m-4 rounded-2xl p-6 w-[90%] max-h-[80%]">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-white font-bold text-xl">
                    Special Offers
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIsSpecialOffersModalVisible(false)}
                  >
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {specialOffers.map((offer) => (
                    <View
                      key={offer.id}
                      className="bg-purple-500 rounded-xl p-4 mb-4"
                    >
                      <Text className="text-white font-bold text-xl">
                        {offer.title}
                      </Text>
                      <Text className="text-white mt-2">
                        {offer.description}
                      </Text>
                      <View className="mt-2">
                        {offer.details.map((detail, index) => (
                          <Text key={index} className="text-white">
                            • {detail}
                          </Text>
                        ))}
                      </View>
                      <Text className="text-white mt-4 text-sm">
                        Valid until: {offer.validUntil}
                      </Text>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  className="bg-purple-500 rounded-xl p-4 items-center mt-4"
                  onPress={() => setIsSpecialOffersModalVisible(false)}
                >
                  <Text className="text-white font-semibold">Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Categories */}
          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              paddingVertical: 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            {renderCategories}
          </ScrollView>
        </View>

        {/* Bottom Navigation */}
        <View
          style={{
            position: "absolute",
            bottom: Platform.OS === "android" ? 20 : 5,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.6)",
            paddingVertical: 4,
            borderRadius: 9999,
            marginHorizontal: 16,
          }}
        >
          <TouchableOpacity
            className="items-center"
            onPress={() => handleRedirect("shopping-cart")}
          >
            <ShoppingCart color="white" size={24} />
            <Text className="text-white text-sm">Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center"
            onPress={() => handleRedirect("orders")}
          >
            <ClipboardList color="white" size={24} />
            <Text className="text-white text-sm">Orders</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center"
            onPress={() => handleRedirect("mainhome")}
          >
            <View className="items-center justify-center">
              <Image
                style={{ width: 64, height: 64 }}
                source={BRAND_LOGO}
                resizeMethod="resize"
                resizeMode="contain"
                defaultSource={BRAND_LOGO}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center"
            onPress={() => handleRedirect("wallet")}
          >
            <Wallet color="white" size={24} />
            <Text className="text-white text-sm">Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="items-center"
            onPress={() => handleRedirect("profile")}
          >
            <User color="white" size={24} />
            <Text className="text-white text-sm">Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientLayout>
  );
};
