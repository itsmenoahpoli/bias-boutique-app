import React from "react";
import { View, Text } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { type TStackParamsList } from "@/types/navigation";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "BEAUTY_PRODUCTS_SCREEN">;
};

export const BeautyProductsScreen: React.FC<TScreenProps> = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-gray-500 font-bold">Beauty Products Screen</Text>
    </View>
  );
};