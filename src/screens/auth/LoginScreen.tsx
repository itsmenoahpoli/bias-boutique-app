import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import { useAuthService } from "@/services/auth.service";
import { BRAND_LOGO } from "@/images";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "LOGIN_SCREEN">;
};

export const LoginScreen: React.FC<TScreenProps> = (props) => {
  const { loginUser } = useAuthService();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      await loginUser({
        email,
        password,
      });
      props.navigation.replace("PRICINGPLAN_SCREEN");
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error instanceof Error
          ? error.message
          : "An error occurred during login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientLayout>
      <View className="flex-1 items-center justify-center bg-gradient-to-b from-indigo-500 to-cyan-400 p-4">
        <Image
          source={BRAND_LOGO}
          className="w-24 h-24 mb-6"
          resizeMethod="scale"
          resizeMode="contain"
        />
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
            EMAIL
          </Text>
          <TextInput
            className="border-b border-gray-400 mb-4 text-sm text-black pb-1"
            placeholder="you@example.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text className="text-xs font-semibold text-gray-700 mb-1">
            PASSWORD
          </Text>
          <TextInput
            className="border-b border-gray-400 mb-6 text-sm text-black pb-1"
            placeholder="••••••••"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            className="w-full bg-blue-700 py-3 rounded-full mb-4"
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text className="text-white text-center font-bold">
              {isLoading ? "LOGGING IN..." : "LOG IN"}
            </Text>
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
