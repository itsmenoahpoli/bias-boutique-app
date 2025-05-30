import React from "react";
import { View } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "ORDERS_SCREEN">;
};

export const OrdersScreen: React.FC<TScreenProps> = (props) => {
  return (
    <GradientLayout>
      <View className="flex-1"></View>
    </GradientLayout>
  );
};
