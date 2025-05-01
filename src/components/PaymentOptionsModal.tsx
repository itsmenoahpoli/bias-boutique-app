import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  GCASH,
  MAYA,
  GRABPAY,
  SHOPEEPAY,
  BPI,
  CHINABANK,
  RCBC,
  UNIONBANK,
  SEVEN_ELEVEN,
  CEBUANA,
  LBC,
  QRPH,
} from "@/images";

type PaymentOption = {
  id: string;
  name: string;
  icon: string | React.ReactNode;
  description?: string;
};

type PaymentCategory = {
  title: string;
  options: PaymentOption[];
};

type PaymentOptionsModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelectPaymentOption: (option: PaymentOption) => void;
};

export const PaymentOptionsModal: React.FC<PaymentOptionsModalProps> = ({
  visible,
  onClose,
  onSelectPaymentOption,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("e-wallet");

  const paymentCategories: PaymentCategory[] = [
    {
      title: "e-wallet",
      options: [
        {
          id: "gcash",
          name: "GCash",
          icon: GCASH,
          description: "Pay with your GCash account",
        },
        {
          id: "maya",
          name: "Maya",
          icon: MAYA,
          description: "Pay with your Maya account",
        },
        {
          id: "grabpay",
          name: "GrabPay",
          icon: GRABPAY,
          description: "Pay with your GrabPay account",
        },
        {
          id: "shopeepay",
          name: "ShopeePay",
          icon: SHOPEEPAY,
          description: "Pay with your ShopeePay account",
        },
      ],
    },
    {
      title: "bank",
      options: [
        {
          id: "bpi",
          name: "BPI",
          icon: BPI,
          description: "Pay via BPI online banking",
        },
        {
          id: "chinabank",
          name: "China Bank",
          icon: CHINABANK,
          description: "Pay via China Bank online banking",
        },
        {
          id: "rcbc",
          name: "RCBC",
          icon: RCBC,
          description: "Pay via RCBC online banking",
        },
        {
          id: "unionbank",
          name: "UnionBank",
          icon: UNIONBANK,
          description: "Pay via UnionBank online banking",
        },
      ],
    },
    {
      title: "over-the-counter",
      options: [
        {
          id: "7-11",
          name: "7-Eleven",
          icon: SEVEN_ELEVEN,
          description: "Pay at any 7-Eleven branch",
        },
        {
          id: "cebuana",
          name: "Cebuana Lhuillier",
          icon: CEBUANA,
          description: "Pay at any Cebuana Lhuillier branch",
        },
        {
          id: "lbc",
          name: "LBC",
          icon: LBC,
          description: "Pay at any LBC branch",
        },
      ],
    },
    {
      title: "qr",
      options: [
        {
          id: "qrph",
          name: "QR PH",
          icon: QRPH,
          description: "Pay using QR PH code",
        },
      ],
    },
  ];

  const getCategoryTitle = (key: string): string => {
    switch (key) {
      case "e-wallet":
        return "E-Wallet";
      case "bank":
        return "Online Banking";
      case "over-the-counter":
        return "Over the Counter";
      case "qr":
        return "QR Payment";
      default:
        return key;
    }
  };

  const activeOptions =
    paymentCategories.find((category) => category.title === activeCategory)
      ?.options || [];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Pressable
          className="flex-1 justify-end items-center bg-black/50"
          onPress={onClose}
        >
          <Pressable
            className="w-full bg-white rounded-t-2xl p-4 pb-8"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Payment Options</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-500 mb-4">
              Supported available payment options
            </Text>

            {/* Category Tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              {paymentCategories.map((category) => (
                <TouchableOpacity
                  key={category.title}
                  className={`px-4 py-2 mr-2 rounded-full ${
                    activeCategory === category.title
                      ? "bg-blue-500"
                      : "bg-gray-200"
                  }`}
                  onPress={() => setActiveCategory(category.title)}
                >
                  <Text
                    className={`font-medium ${
                      activeCategory === category.title
                        ? "text-white"
                        : "text-gray-700"
                    }`}
                  >
                    {getCategoryTitle(category.title)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Category Title */}
            <Text className="font-semibold text-lg mb-2">
              {getCategoryTitle(activeCategory)}
            </Text>

            {/* Payment Options */}
            <ScrollView className="max-h-80">
              <View className="space-y-3">
                {activeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    className="flex-row items-center p-4 border border-gray-200 rounded-xl"
                    onPress={() => {
                      onSelectPaymentOption(option);
                      // onClose();
                    }}
                  >
                    <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                      {typeof option.icon === "string" ? (
                        <Image
                          source={{ uri: option.icon }}
                          style={{ width: 24, height: 24 }}
                        />
                      ) : (
                        <Image
                          source={option.icon as any}
                          style={{ width: 24, height: 24 }}
                          resizeMode="contain"
                        />
                      )}
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="font-semibold">{option.name}</Text>
                      {option.description && (
                        <Text className="text-gray-500 text-xs">
                          {option.description}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};
