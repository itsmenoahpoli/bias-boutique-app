import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "ORDERS_SCREEN">;
};

export const OrdersScreen: React.FC<TScreenProps> = ({ navigation }) => {
  return (
    <GradientLayout>
      <View className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="flex-row items-center pt-8 mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold ml-4">My Orders</Text>
        </View>

        {/* Empty Orders Illustration */}
        <View className="flex-1 justify-center items-center">
          {/* <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/5958/5958530.png",
            }}
            className="w-40 h-40 mb-4"
            resizeMode="contain"
          /> */}
          <Text className="text-white text-base">No orders Yet</Text>
        </View>
      </View>
    </GradientLayout>
  );
};
