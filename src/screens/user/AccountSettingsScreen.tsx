import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/store/user.store";
import { useAuthService } from "@/services/auth.service";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "ACCOUNT_SETTINGS_SCREEN">;
};

export const AccountSettingsScreen: React.FC<TScreenProps> = ({
  navigation,
}) => {
  const user = useUserStore((state) => state.user);
  const { updateUserAccount } = useAuthService();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    contact_no: user?.contact_no || "",
    // @ts-ignore
    address: user?.address || "",
  });

  const handleSave = async () => {
    if (!user?.id) {
      Alert.alert("Error", "User information not found");
      return;
    }

    setIsLoading(true);
    try {
      await updateUserAccount(user.id, formData);
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update profile";
      Alert.alert("Error", message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GradientLayout>
      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="flex-row items-center justify-between pt-8 mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold flex-1 text-center mr-9">
            Account Settings
          </Text>
        </View>

        {/* Form Fields */}
        <View className="space-y-4">
          <View>
            <Text className="text-white text-sm mb-1">Full Name</Text>
            <TextInput
              className="bg-white/10 rounded-xl p-3 text-white"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          </View>

          <View>
            <Text className="text-white text-sm mb-1">Email</Text>
            <TextInput
              className="bg-white/10 rounded-xl p-3 text-white"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          </View>

          <View>
            <Text className="text-white text-sm mb-1">Contact Number</Text>
            <TextInput
              className="bg-white/10 rounded-xl p-3 text-white"
              value={formData.contact_no}
              onChangeText={(text) =>
                setFormData({ ...formData, contact_no: text })
              }
              keyboardType="phone-pad"
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          </View>

          <View>
            <Text className="text-white text-sm mb-1">Address</Text>
            <TextInput
              className="bg-white/10 rounded-xl p-3 text-white"
              value={formData.address}
              onChangeText={(text) =>
                setFormData({ ...formData, address: text })
              }
              multiline
              numberOfLines={3}
              placeholderTextColor="rgba(255,255,255,0.5)"
            />
          </View>

          <TouchableOpacity
            onPress={handleSave}
            className="bg-pink-500 rounded-xl py-3 mt-6"
            disabled={isLoading}
          >
            <Text className="text-white text-center font-bold">
              {isLoading ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </GradientLayout>
  );
};
