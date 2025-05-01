import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "ORDERS_SCREEN">;
};

const orderStatuses = [
  "All Orders",
  "To Pay",
  "To Ship",
  "To Receive",
  "To Review",
  "Returns/Cancels",
];

export const OrdersScreen: React.FC<TScreenProps> = ({ navigation }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All Orders");

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setIsDropdownOpen(false);
  };

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

        {/* Dropdown Filter */}
        <View className="mb-4">
          <TouchableOpacity
            onPress={toggleDropdown}
            className="flex-row items-center justify-between bg-white/10 p-3 rounded-xl"
          >
            <Text className="text-white">{selectedStatus}</Text>
            <Ionicons
              name={isDropdownOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>

          {isDropdownOpen && (
            <View className="absolute top-14 left-0 right-0 bg-white/10 rounded-xl z-10 mt-1">
              {orderStatuses.map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => handleStatusSelect(status)}
                  className={`p-3 border-b border-white/5 ${
                    status === selectedStatus ? "bg-white/20" : ""
                  }`}
                >
                  <Text className="text-white">{status}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Empty Orders Illustration */}
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-base">No orders Yet</Text>
        </View>
      </View>
    </GradientLayout>
  );
};
