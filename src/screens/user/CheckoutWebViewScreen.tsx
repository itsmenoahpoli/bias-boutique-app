import React, { useState } from "react";
import {
  SafeAreaView,
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import WebView from "react-native-webview";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { type TStackParamsList } from "@/types/navigation";
import { ArrowLeft, X } from "lucide-react-native";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "CHECKOUT_WEBVIEW">;
  route: RouteProp<TStackParamsList, "CHECKOUT_WEBVIEW">;
};

export const CheckoutWebViewScreen: React.FC<TScreenProps> = ({
  route,
  navigation,
}) => {
  const { url } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Get screen dimensions
  const screenHeight = Dimensions.get("window").height;
  const webViewHeight = screenHeight * 0.75; // 75% of screen height

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-gray-100">
      {/* Header */}
      <View className="bg-purple-900 px-4 pb-4 pt-10 flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold ml-4">Checkout</Text>
      </View>

      {/* Main Content Container */}
      <View className="flex-1 p-4">
        {/* WebView Container with shadow and rounded corners */}
        <View
          className="rounded-xl overflow-hidden bg-white"
          style={{
            height: webViewHeight,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <WebView
            source={{ uri: url }}
            style={{ flex: 1 }}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={true}
            mixedContentMode="compatibility"
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
          />

          {/* Loading Indicator */}
          {isLoading && (
            <View className="absolute inset-0 bg-black/50 items-center justify-center">
              <ActivityIndicator size="large" color="#8B5CF6" />
              <Text className="text-white mt-2">Loading payment page...</Text>
            </View>
          )}

          {/* Error State */}
          {hasError && (
            <View className="absolute inset-0 bg-white items-center justify-center p-4">
              <Text className="text-red-600 text-lg font-semibold mb-2">
                Failed to load payment page
              </Text>
              <Text className="text-gray-600 text-center mb-4">
                There was a problem loading the checkout page. Please try again.
              </Text>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="bg-purple-900 px-6 py-3 rounded-lg"
              >
                <Text className="text-white font-semibold">Return to Cart</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Cancel Button */}
        <View className="mt-6">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-white border border-gray-300 rounded-xl py-4 flex-row items-center justify-center"
          >
            <X size={20} color="#EF4444" className="mr-2" />
            <Text className="text-red-500 font-semibold text-lg">
              Cancel Payment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
