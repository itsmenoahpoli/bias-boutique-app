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
];

export const UserHomeScreen: React.FC<TScreenProps> = ({ navigation }) => {
  // Add error handling for rendering
  const [hasError, setHasError] = useState(false);
  const user = useUserStore((state) => state.user);

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
            navigation.navigate("CART_SCREEN");
            break;
          case "orders":
            navigation.navigate("ORDERS_SCREEN");
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
              className="flex-1 text-white"
            />
            <Ionicons name="options-outline" size={20} color="white" />
          </View>

          {/* Special Offers */}
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-white font-bold text-lg">
                Special Offers
              </Text>
              <Text className="text-blue-300">See All</Text>
            </View>
            <View className="bg-purple-500 rounded-2xl p-4">
              <View>
                <Text className="text-white font-bold text-xl">11.11</Text>
                <Text className="text-white text-sm">
                  Free Shipping Special
                </Text>
                <Text className="text-white text-xs mt-1">
                  Get a free shipping for every checkout. Only valid until 11-15
                </Text>
              </View>
            </View>
          </View>

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
