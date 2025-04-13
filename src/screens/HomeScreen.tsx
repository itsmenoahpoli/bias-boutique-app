import React from "react";
import { View, Text, Pressable } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import type { TStackParamsList } from "@/types/navigation";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "HOME_SCREEN">;
};

export const HomeScreen: React.FC<TScreenProps> = (props) => {
  const handleGoBack = () => {
    props.navigation.goBack()
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text>Home Screen</Text>    
  
      <Pressable className="mt-5" onPress={handleGoBack}>
        <Text className="text-blue-700 underline">Go back</Text>
      </Pressable>
    </View>
  );
};
