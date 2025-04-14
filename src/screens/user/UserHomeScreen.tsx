import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "USERHOME_SCREEN">;
};

export const UserHomeScreen: React.FC<TScreenProps> = (props) => {
  return (
    <GradientLayout>
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-gray-500 font-bold">User Home Screen</Text>
      </View>
    </GradientLayout>
  );
};
