import React from "react";
import { View, Text, Pressable } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import type { TStackParamsList } from "@/types/navigation";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "WELCOME_SCREEN">;
};

export const WelcomeScreen: React.FC<TScreenProps> = (props) => {
  const handleNavigate = () => {
    props.navigation.navigate("HOME_SCREEN");
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-gray-500 font-bold">Welcome Screen</Text>
      <Pressable className="mt-5" onPress={handleNavigate}>
        <Text className="text-blue-700 underline">Go to home</Text>
      </Pressable>
    </View>
  );
};
