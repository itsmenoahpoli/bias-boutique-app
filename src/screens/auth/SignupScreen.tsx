import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import Checkbox from "expo-checkbox";
import { useAuthService } from "@/services/auth.service";
import { useForm, Controller } from "react-hook-form";
import { ApiError } from "@/types/api.types";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "SIGNUP_SCREEN">;
};

type FormData = {
  name: string;
  email: string;
  username: string;
  contact_no: string;
  password: string;
  confirmPassword: string;
};

export const SignupScreen: React.FC<TScreenProps> = (props) => {
  const { registerUser } = useAuthService();
  const [receiveUpdates, setReceiveUpdates] = React.useState(false);
  const [agreeToTerms, setAgreeToTerms] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      email: "",
      username: "",
      contact_no: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const handleRegistration = async (data: FormData) => {
    setIsLoading(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        username: data.username,
        contact_no: data.contact_no,
        password: data.password,
        account_type: "customer",
      });

      Alert.alert("Success", "Your account has been successfully created!", [
        {
          text: "OK",
          onPress: () => props.navigation.navigate("LOGIN_SCREEN"),
        },
      ]);
    } catch (error) {
      const apiError = error as ApiError;
      let message = "Registration failed";

      if (apiError.status === 422) {
        if (apiError.errors?.email) {
          message = "This email address is already registered";
        } else if (apiError.errors?.username) {
          message = "This username is already taken";
        } else {
          message = "Email or username may already be in use";
        }
      } else {
        message =
          apiError instanceof Error ? apiError.message : "Registration failed";
      }

      Alert.alert("Registration Failed", message, [
        {
          text: "Try Again",
          onPress: () => {
            if (retryCount < 2) {
              setRetryCount((prev) => prev + 1);
              handleRegistration(data);
            } else {
              Alert.alert(
                "Error",
                "We're having trouble connecting to our servers. Please check your internet connection or try again later.",
                [{ text: "OK" }]
              );
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data: FormData) => {
    if (!agreeToTerms) {
      Alert.alert(
        "Error",
        "Please agree to the Terms of Use and Privacy Policy"
      );
      return;
    }

    setRetryCount(0);
    handleRegistration(data);
  };

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
          <Controller
            control={control}
            rules={{
              required: "Full name is required",
              minLength: {
                value: 2,
                message: "Full name must be at least 2 characters",
              },
            }}
            name="name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`border-b ${
                  errors.name ? "border-red-500" : "border-gray-400"
                } mb-1 text-sm text-black pb-1`}
                placeholder="John Doe"
                placeholderTextColor="#999"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.name && (
            <Text className="text-red-500 text-xs mb-3">
              {errors.name.message}
            </Text>
          )}

          <Text className="text-xs font-semibold text-gray-700 mb-1">
            EMAIL
          </Text>
          <Controller
            control={control}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`border-b ${
                  errors.email ? "border-red-500" : "border-gray-400"
                } mb-1 text-sm text-black pb-1`}
                placeholder="you@example.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.email && (
            <Text className="text-red-500 text-xs mb-3">
              {errors.email.message}
            </Text>
          )}

          <Text className="text-xs font-semibold text-gray-700 mb-1">
            USERNAME
          </Text>
          <Controller
            control={control}
            rules={{
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
            }}
            name="username"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`border-b ${
                  errors.username ? "border-red-500" : "border-gray-400"
                } mb-1 text-sm text-black pb-1`}
                placeholder="johndoe123"
                placeholderTextColor="#999"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.username && (
            <Text className="text-red-500 text-xs mb-3">
              {errors.username.message}
            </Text>
          )}

          <Text className="text-xs font-semibold text-gray-700 mb-1">
            CONTACT NUMBER
          </Text>
          <Controller
            control={control}
            rules={{
              required: "Contact number is required",
              pattern: {
                value: /^\+?[1-9]\d{1,14}$/,
                message: "Invalid phone number",
              },
            }}
            name="contact_no"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`border-b ${
                  errors.contact_no ? "border-red-500" : "border-gray-400"
                } mb-1 text-sm text-black pb-1`}
                placeholder="+1234567890"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.contact_no && (
            <Text className="text-red-500 text-xs mb-3">
              {errors.contact_no.message}
            </Text>
          )}

          <Text className="text-xs font-semibold text-gray-700 mb-1">
            PASSWORD
          </Text>
          <Controller
            control={control}
            rules={{
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            }}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`border-b ${
                  errors.password ? "border-red-500" : "border-gray-400"
                } mb-1 text-sm text-black pb-1`}
                placeholder="••••••••"
                placeholderTextColor="#999"
                secureTextEntry
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.password && (
            <Text className="text-red-500 text-xs mb-3">
              {errors.password.message}
            </Text>
          )}

          <Text className="text-xs font-semibold text-gray-700 mb-1">
            CONFIRM PASSWORD
          </Text>
          <Controller
            control={control}
            rules={{
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className={`border-b ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-400"
                } mb-1 text-sm text-black pb-1`}
                placeholder="••••••••"
                placeholderTextColor="#999"
                secureTextEntry
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text className="text-red-500 text-xs mb-3">
              {errors.confirmPassword.message}
            </Text>
          )}

          <View className="flex-row items-start mb-4 mt-4">
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
            disabled={!agreeToTerms || isLoading}
            style={{ opacity: agreeToTerms && !isLoading ? 1 : 0.5 }}
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-white text-center font-bold">
              {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </GradientLayout>
  );
};
