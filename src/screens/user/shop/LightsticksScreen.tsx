import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import { ArrowLeft } from "lucide-react-native";
import { PRODUCT_PLACEHOLDER } from "@/images";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "LIGHTSTICKS_SCREEN">;
};

const products = [
  {
    id: 1,
    name: "BTS Army Bomb",
    price: "₱2,500",
    image: PRODUCT_PLACEHOLDER,
  },
  {
    id: 2,
    name: "Blackpink Lightstick",
    price: "₱2,300",
    image: PRODUCT_PLACEHOLDER,
  },
  {
    id: 3,
    name: "EXO Lightstick",
    price: "₱2,200",
    image: PRODUCT_PLACEHOLDER,
  },
  {
    id: 4,
    name: "TWICE Candybong",
    price: "₱2,400",
    image: PRODUCT_PLACEHOLDER,
  },
  {
    id: 5,
    name: "Red Velvet Lightstick",
    price: "₱2,300",
    image: PRODUCT_PLACEHOLDER,
  },
  {
    id: 6,
    name: "NCT Lightstick",
    price: "₱2,400",
    image: PRODUCT_PLACEHOLDER,
  },
];

export const LightsticksScreen: React.FC<TScreenProps> = ({ navigation }) => {
  return (
    <GradientLayout>
      <View className="px-4 pt-12 pb-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-white text-xl font-bold mr-9">
            Lightsticks
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between">
          {products.map((product) => (
            <TouchableOpacity
              key={product.id}
              className="w-[48%] bg-white/10 rounded-xl mb-4 overflow-hidden"
              onPress={() => {}}
            >
              <Image
                source={product.image}
                className="w-full h-40"
                resizeMode="cover"
              />
              <View className="p-3">
                <Text className="text-white font-semibold">{product.name}</Text>
                <Text className="text-white/80">{product.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View className="h-20" />
      </ScrollView>
    </GradientLayout>
  );
};
