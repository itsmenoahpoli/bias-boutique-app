import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import Checkbox from "expo-checkbox";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "SIGNUP_SCREEN">;
};

export const SignupScreen: React.FC<TScreenProps> = (props) => {
  const [receiveUpdates, setReceiveUpdates] = React.useState(false);
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);

  return (
    <GradientLayout>
      <View className="flex-1 items-center justify-center bg-gradient-to-b from-indigo-500 to-cyan-400 p-4">
        <View className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
          <View className="flex-row justify-between mb-6">
            <TouchableOpacity
              className="flex-1 items-center rounded-full border border-blue-700 py-2"
              onPress={() => props.navigation.navigate("LOGIN_SCREEN")}
            >
              <Text className="text-blue-700 font-bold">LOG IN</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 items-center rounded-full bg-blue-700 py-2 ml-2">
              <Text className="text-white font-bold">SIGN UP</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-xs font-semibold text-gray-700 mb-1">
            FULL NAME
          </Text>
          <TextInput
            className="border-b border-gray-400 mb-4 text-sm text-black pb-1"
            placeholder="John Doe"
            placeholderTextColor="#999"
          />

          <Text className="text-xs font-semibold text-gray-700 mb-1">
            EMAIL
          </Text>
          <TextInput
            className="border-b border-gray-400 mb-4 text-sm text-black pb-1"
            placeholder="you@example.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text className="text-xs font-semibold text-gray-700 mb-1">
            USERNAME
          </Text>
          <TextInput
            className="border-b border-gray-400 mb-4 text-sm text-black pb-1"
            placeholder="johndoe123"
            placeholderTextColor="#999"
            autoCapitalize="none"
          />

          <Text className="text-xs font-semibold text-gray-700 mb-1">
            CONTACT NUMBER
          </Text>
          <TextInput
            className="border-b border-gray-400 mb-4 text-sm text-black pb-1"
            placeholder="+1234567890"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />

          <Text className="text-xs font-semibold text-gray-700 mb-1">
            PASSWORD
          </Text>
          <TextInput
            className="border-b border-gray-400 mb-4 text-sm text-black pb-1"
            placeholder="••••••••"
            placeholderTextColor="#999"
            secureTextEntry
          />

          <Text className="text-xs font-semibold text-gray-700 mb-1">
            CONFIRM PASSWORD
          </Text>
          <TextInput
            className="border-b border-gray-400 mb-6 text-sm text-black pb-1"
            placeholder="••••••••"
            placeholderTextColor="#999"
            secureTextEntry
          />

          <View className="flex-row items-start mb-4">
            <Checkbox
              value={receiveUpdates}
              onValueChange={setReceiveUpdates}
              color={receiveUpdates ? "#1d4ed8" : undefined}
            />
            <Text className="text-xs text-gray-600 ml-2 flex-1">
              I want to receive news, feature updates, discounts and offers
            </Text>
          </View>

          <View className="flex-row items-start mb-6">
            <Checkbox
              value={agreeToTerms}
              onValueChange={setAgreeToTerms}
              color={agreeToTerms ? "#1d4ed8" : undefined}
            />
            <Text className="text-xs text-gray-600 ml-2 flex-1">
              I acknowledge that I agree to the{" "}
              <Text className="text-blue-600">Terms of Use</Text> and have read
              the <Text className="text-blue-600">Privacy Policy</Text>
            </Text>
          </View>

          <TouchableOpacity
            className="w-full bg-blue-700 py-3 rounded-full mb-4"
            disabled={!agreeToTerms}
            style={{ opacity: agreeToTerms ? 1 : 0.5 }}
          >
            <Text className="text-white text-center font-bold">
              CREATE ACCOUNT
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </GradientLayout>
  );
};
