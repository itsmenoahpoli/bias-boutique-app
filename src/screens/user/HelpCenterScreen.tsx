import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react-native";
import { contextData } from "@/libs/chatai/context";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "HELPCENTER_SCREEN">;
};

type FAQCategory = {
  title: string;
  items: Array<{
    question: string;
    answer: string;
  }>;
};

export const HelpCenterScreen: React.FC<TScreenProps> = ({ navigation }) => {
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({
    "General Information": true,
    Products: false,
    Payment: false,
    Ordering: false,
  });

  const [expandedQuestions, setExpandedQuestions] = useState<
    Record<string, boolean>
  >({});

  const faqCategories: FAQCategory[] = [
    {
      title: "General Information",
      items: [
        {
          question: "What is Bias Boutique Shop?",
          answer:
            "Bias Boutique Shop is an e-commerce platform designed for Filipino K-pop fans. It offers authentic, licensed Korean merchandise through a user-friendly mobile application. The shop aims to connect fans with their favorite idols by providing high-quality, fandom-related products.",
        },
      ],
    },
    {
      title: "Products",
      items: [
        {
          question: "What are the products available in Bias Boutique Shop?",
          answer:
            "Bias Boutique Shop offers a variety of K-pop merchandise, including:\n\n• Albums and photocards\n• Lightsticks\n• Apparel and accessories\n• Posters and banners\n• Stationery and collectibles\n\nAll products are sourced through trusted suppliers and official distributors.",
        },
      ],
    },
    {
      title: "Payment",
      items: [
        {
          question: "What are the available payment methods?",
          answer:
            "The shop supports multiple payment options for convenience, such as:\n\n• GCash\n• Maya\n• Credit/Debit card (via payment gateway)",
        },
      ],
    },
    {
      title: "Ordering",
      items: [
        {
          question: "How can I buy products in Bias Boutique Shop?",
          answer:
            "To buy products:\n\n1. Download and open the Bias Boutique mobile app.\n2. Create or log in to your account.\n3. Browse or search for your desired merchandise.\n4. Add items to your cart and proceed to checkout.\n5. Choose your preferred payment method and delivery option.\n6. Confirm your order and wait for delivery updates via the app.",
        },
      ],
    },
  ];

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleQuestion = (question: string) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [question]: !prev[question],
    }));
  };

  return (
    <GradientLayout>
      <View className="flex-1 px-4 py-6">
        <View className="flex-row items-center pt-8 mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold ml-4">Help Center</Text>
        </View>

        <ScrollView className="flex-1">
          <Text className="text-white text-xl font-bold mb-4">
            Frequently Asked Questions
          </Text>

          {faqCategories.map((category, categoryIndex) => (
            <View key={categoryIndex} className="mb-4">
              <TouchableOpacity
                className="flex-row items-center justify-between bg-white/20 p-4 rounded-t-xl"
                onPress={() => toggleCategory(category.title)}
              >
                <Text className="text-white font-bold text-lg">
                  {category.title}
                </Text>
                {expandedCategories[category.title] ? (
                  <ChevronUp size={20} color="#fff" />
                ) : (
                  <ChevronDown size={20} color="#fff" />
                )}
              </TouchableOpacity>

              {expandedCategories[category.title] && (
                <View className="bg-white/10 p-4 rounded-b-xl">
                  {category.items.map((item, itemIndex) => (
                    <View key={itemIndex} className="mb-3">
                      <TouchableOpacity
                        className="flex-row items-center justify-between py-2"
                        onPress={() => toggleQuestion(item.question)}
                      >
                        <Text className="text-white font-semibold flex-1 pr-2">
                          {item.question}
                        </Text>
                        {expandedQuestions[item.question] ? (
                          <ChevronUp size={16} color="#fff" />
                        ) : (
                          <ChevronDown size={16} color="#fff" />
                        )}
                      </TouchableOpacity>

                      {expandedQuestions[item.question] && (
                        <Text className="text-white/80 mt-2 ml-2">
                          {item.answer}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    </GradientLayout>
  );
};
