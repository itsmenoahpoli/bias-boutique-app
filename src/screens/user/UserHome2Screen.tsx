import React from "react";
import { View, Text } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { type TStackParamsList } from "@/types/navigation";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "USERHOME2_SCREEN">;
};

export const UserHome2Screen: React.FC<TScreenProps> = (props) => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text>User home screen 2 test</Text>
    </View>
  );
};
