import React from "react";
import { View, Text } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { type TStackParamsList } from "@/types/navigation";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "ALBUMS_SCREEN">;
};

export const AlbumsScreen: React.FC<TScreenProps> = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-gray-500 font-bold">Albums Screen</Text>
    </View>
  );
};