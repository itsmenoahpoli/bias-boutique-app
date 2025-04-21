import React from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ShoppingCart, ClipboardList, Wallet, User } from "lucide-react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { TStackParamsList } from "@/types/navigation";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
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

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "USERHOME_SCREEN">;
};

export const UserHomeScreen: React.FC<TScreenProps> = ({ navigation }) => {
  const handleRedirect = (page: string) => {
    switch (page) {
      case "shopping-cart":
        navigation.navigate("CART_SCREEN");
        break;
      case "orders":
      case "mainhome":
      case "wallet":
      case "profile":
        console.log(page); // Keep the console.log for non-implemented routes
        break;
      default:
        break;
    }
  };

  const handleCategoryPress = (category: string) => {
    switch (category) {
      case "Albums":
        navigation.navigate("ALBUMS_SCREEN");
        break;
      case "Photocards":
        navigation.navigate("PHOTOCARDS_SCREEN");
        break;
      case "Lightsticks":
        navigation.navigate("LIGHTSTICKS_SCREEN");
        break;
      case "Clothing":
        navigation.navigate("CLOTHING_SCREEN");
        break;
      case "Accessories":
        navigation.navigate("ACCESSORIES_SCREEN");
        break;
      case "Stationary":
        navigation.navigate("STATIONARIES_SCREEN");
        break;
      case "Beauty Products":
        navigation.navigate("BEAUTY_PRODUCTS_SCREEN");
        break;
      case "Home Goods":
        navigation.navigate("HOME_GOODS_SCREEN");
        break;
      default:
        break;
    }
  };

  return (
    <GradientLayout>
      <View className="px-4 pt-10 pb-4 relative">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-white text-lg">Good Morning 👋</Text>
            <Text className="text-white font-bold text-xl">Juan Dela Cruz</Text>
          </View>
          <View className="flex-row space-x-3">
            <Ionicons name="notifications-outline" size={24} color="white" />
            <MaterialIcons name="favorite-border" size={24} color="white" />
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
            <Text className="text-white font-bold text-lg">Special Offers</Text>
            <Text className="text-blue-300">See All</Text>
          </View>
          <View className="bg-purple-500 rounded-2xl p-4 flex-row items-center justify-between">
            <View>
              <Text className="text-white font-bold text-xl">11.11</Text>
              <Text className="text-white text-sm">Free Shipping Special</Text>
              <Text className="text-white text-xs mt-1">
                Get a free shipping for every checkout. Only valid until 11-15
              </Text>
            </View>
          </View>
        </View>

        {/* Categories */}
        <View>
          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              paddingVertical: 20,
            }}
            showsVerticalScrollIndicator={false}
          >
            {categories.map((item, index) => {
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
                  <Text className="text-white text-xs text-center">
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Bottom Navigation (Placeholder) */}
      <View className="absolute bottom-5 left-0 right-0 flex-row justify-around items-center bg-white/60 py-1 rounded-full mx-4">
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
              className="w-16 h-16"
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
    </GradientLayout>
  );
};
