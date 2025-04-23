import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import { ArrowLeft, MessageCircle, Share2, Star } from "lucide-react-native";

type TScreenProps = {
  navigation: StackNavigationProp<
    TStackParamsList,
    "VIEW_PRODUCT_DETAIL_SCREEN"
  >;
  route: RouteProp<TStackParamsList, "VIEW_PRODUCT_DETAIL_SCREEN">;
};

export const ViewProductDetailScreen: React.FC<TScreenProps> = ({
  navigation,
  route,
}) => {
  const { product } = route.params;
  const [selectedVersion, setSelectedVersion] = useState("Peaches");

  return (
    <GradientLayout>
      <ScrollView className="flex-1 bg-white">
        {/* Header */}
        <View className="relative">
          <View className="absolute top-10 left-3 z-10">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-white/80 rounded-full p-2"
            >
              <ArrowLeft size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <View className="bg-orange-400 p-6 pt-16 items-center">
            <Text className="text-3xl font-bold text-black">
              {product.name}
            </Text>
            <View className="flex-row mt-4 w-full justify-center">
              <View className="w-32 h-32 bg-yellow-300 mr-4 shadow-md" />
              <View className="w-32 h-32 bg-orange-500 shadow-md" />
            </View>
          </View>
        </View>

        {/* Product purchase section */}
        <View className="bg-white p-4 flex-row justify-between items-center">
          <View className="flex-row">
            <TouchableOpacity className="bg-pink-600 rounded-full px-4 py-2 mr-2">
              <Text className="text-white font-semibold">Buy Now</Text>
            </TouchableOpacity>
            <TouchableOpacity className="border border-pink-600 rounded-full px-4 py-2">
              <Text className="text-pink-600 font-semibold">Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Price and rating section */}
        <View className="bg-purple-600 p-4">
          <Text className="text-white text-2xl font-bold">₱450.00</Text>
          <Text className="text-white font-bold mt-1">
            BTS Butter Sealed Album
          </Text>
          <View className="flex-row items-center mt-1">
            <Star size={16} color="#FCD34D" fill="#FCD34D" />
            <Text className="text-white ml-1">5.0</Text>
            <Text className="text-white text-opacity-80 ml-2">129 sold</Text>
            <View className="flex-1 flex-row justify-end">
              <TouchableOpacity className="mr-2">
                <MessageCircle size={18} color="white" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Share2 size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Description section */}
        <View className="bg-white p-4">
          <Text className="font-bold text-lg mb-2">Description</Text>
          <Text className="text-gray-600 text-sm mb-1">
            Release date: 07/09/2021
          </Text>
          <Text className="text-gray-600 text-sm mb-1">
            • Inner Single CD-2 / Cream / Peaches
          </Text>
          <Text className="text-gray-600 text-sm mb-1">
            • CD (each version 1p)
          </Text>
          <Text className="text-gray-600 text-sm mb-1">
            • Out box: (each version 1p, 148 X 142 X 9.80 mm)
          </Text>
          <Text className="text-gray-600 text-sm mb-1">
            • Photobook: (each version 1p, W 97 X H 127 mm / Cream 108Pages,
            Peaches 96Pages)
          </Text>
          <Text className="text-gray-600 text-sm mb-1">
            • Photo card: random 1p out of each version 8p
          </Text>
          <Text className="text-gray-600 text-sm mb-1">
            • Instant photo card: random 1p out of each version 8p
          </Text>
          <Text className="text-gray-600 text-sm mb-1">
            • Folded message card: random 1p out of 7p
          </Text>
          <Text className="text-gray-600 text-sm mb-1">
            • Graphic sticker: each version 1p
          </Text>
          <Text className="text-gray-600 text-sm mb-1">
            • Mini stand: each version 1p
          </Text>
          <Text className="text-gray-600 text-sm mb-1">
            • Poster: each version 1p / W 822 X H 548 (mm) / First press limited
          </Text>
        </View>

        {/* Reviews section */}
        <View className="bg-white p-4 mt-2">
          <View className="flex-row items-center justify-between">
            <Text className="font-bold text-lg">Review</Text>
            <Text className="text-gray-500 text-sm">(1128)</Text>
          </View>

          <View className="flex-row items-center mt-1">
            <Star size={16} color="#FCD34D" fill="#FCD34D" />
            <Star size={16} color="#FCD34D" fill="#FCD34D" />
            <Star size={16} color="#FCD34D" fill="#FCD34D" />
            <Star size={16} color="#FCD34D" fill="#FCD34D" />
            <Star size={16} color="#FCD34D" fill="#FCD34D" />
            <Text className="ml-2 font-semibold">5.0</Text>
          </View>

          <View className="mt-4 pb-4 border-b border-gray-200">
            <Text className="text-gray-600">
              Good quality and fast shipping
            </Text>
            <View className="mt-2 flex-row">
              <Image
                source={{ uri: "/api/placeholder/50/50" }}
                className="w-12 h-12 rounded mr-2"
              />
              <Image
                source={{ uri: "/api/placeholder/50/50" }}
                className="w-12 h-12 rounded"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </GradientLayout>
  );
};
