import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "LOGIN_SCREEN">;
};

export const LoginScreen: React.FC<TScreenProps> = (props) => {
  const handleLogin = () => {
    props.navigation.navigate("PRICINGPLAN_SCREEN");
  };

  return (
    <GradientLayout>
      <View className="flex-1 items-center justify-center bg-gradient-to-b from-indigo-500 to-cyan-400 p-4">
        <View className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
          <View className="flex-row justify-between mb-6">
            <TouchableOpacity className="flex-1 items-center rounded-full bg-blue-700 py-2">
              <Text className="text-white font-bold">LOG IN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 items-center rounded-full border border-blue-700 py-2 ml-2"
              onPress={() => props.navigation.navigate("SIGNUP_SCREEN")}
            >
              <Text className="text-blue-700 font-bold">SIGN UP</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-xs font-semibold text-gray-700 mb-1">
            ENTER EMAIL OR USERNAME
          </Text>
          <TextInput
            className="border-b border-gray-400 mb-4 text-sm text-black pb-1"
            placeholder="you@example.com"
            placeholderTextColor="#999"
          />

          <View className="flex-row justify-between items-center">
            <Text className="text-xs font-semibold text-gray-700 mb-1">
              PASSWORD
            </Text>
            <TouchableOpacity>
              <Text className="text-xs font-semibold text-blue-600">
                FORGOT PASSWORD
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            className="border-b border-gray-400 mb-6 text-sm text-black pb-1"
            placeholder="••••••••"
            placeholderTextColor="#999"
            secureTextEntry
          />

          <TouchableOpacity
            className="w-full bg-blue-700 py-3 rounded-full mb-4"
            onPress={handleLogin}
          >
            <Text className="text-white text-center font-bold">LOG IN</Text>
          </TouchableOpacity>

          <View className="flex-row items-center my-2">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="mx-2 text-gray-500 text-xs">OR</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>

          <View className="flex-row justify-center space-x-4 mt-2">
            <TouchableOpacity className="bg-white p-3 rounded-full border border-gray-300">
              <Text>via Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity className="bg-white p-3 rounded-full border border-gray-300">
              <Text>via Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </GradientLayout>
  );
};
