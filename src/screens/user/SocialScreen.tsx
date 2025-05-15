import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { GradientLayout } from "@/components";
import { TStackParamsList } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "SOCIAL_SCREEN">;
  route: RouteProp<TStackParamsList, "SOCIAL_SCREEN">;
};

export const SocialScreen: React.FC<TScreenProps> = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    route.params?.activeTab || "followers"
  );

  const renderEmptyList = () => {
    return (
      <View className="items-center justify-center flex-1 mt-20">
        <Text className="text-white text-center text-lg">
          {activeTab === "followers"
            ? "No followers yet 👥"
            : "Not following anyone yet 👀"}
        </Text>
      </View>
    );
  };

  return (
    <GradientLayout>
      <SafeAreaView className="flex-1">
        <View
          className="flex-1"
          style={{
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          }}
        >
          {/* Fixed Header */}
          <View className="z-10 bg-transparent">
            <View className="flex-row items-center justify-between px-4 py-3">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="p-2"
              >
                <Ionicons name="arrow-back" size={20} color="white" />
              </TouchableOpacity>
              <Text className="text-white font-semibold text-lg">
                {activeTab === "followers" ? "Followers" : "Following"}
              </Text>
              <Text>&nbsp;</Text>
            </View>

            {/* Tabs */}
            <View className="flex-row px-4 mb-4">
              <TouchableOpacity
                onPress={() => setActiveTab("followers")}
                className={`flex-1 py-2 rounded-l-lg ${
                  activeTab === "followers" ? "bg-white/20" : "bg-white/10"
                }`}
              >
                <Text className="text-white text-center font-medium">
                  Followers (0)
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab("following")}
                className={`flex-1 py-2 rounded-r-lg ${
                  activeTab === "following" ? "bg-white/20" : "bg-white/10"
                }`}
              >
                <Text className="text-white text-center font-medium">
                  Following (0)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            className="flex-1 flex-col px-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 10,
              paddingBottom: 20,
            }}
          >
            {renderEmptyList()}
          </ScrollView>
        </View>
      </SafeAreaView>
    </GradientLayout>
  );
};
