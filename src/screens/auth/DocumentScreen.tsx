import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import { ArrowLeft } from "lucide-react-native";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "DOCUMENT_SCREEN">;
  route: RouteProp<TStackParamsList, "DOCUMENT_SCREEN">;
};

export const DocumentScreen: React.FC<TScreenProps> = ({
  navigation,
  route,
}) => {
  const { type } = route.params;

  const getTitle = () => {
    return type === "terms-of-use" ? "Terms of Use" : "Privacy Policy";
  };

  const getContent = () => {
    if (type === "terms-of-use") {
      return termsOfUseContent;
    } else {
      return privacyPolicyContent;
    }
  };

  return (
    <GradientLayout>
      <View className="flex-1 px-4 py-6">
        <View className="flex-row items-center pt-8 mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold ml-4">
            {getTitle()}
          </Text>
        </View>

        <ScrollView className="flex-1 bg-white/10 rounded-xl p-4">
          <Text className="text-white">{getContent()}</Text>
        </ScrollView>
      </View>
    </GradientLayout>
  );
};

const termsOfUseContent = `
Welcome to Bias Boutique! By accessing or using our mobile application, you agree to be bound by these Terms of Use, which govern your access and use of our services. If you do not agree with any part of these terms, you should refrain from using the application.

User Account and Use of the Application
To access certain features of Bias Boutique, you must register for an account. It is your responsibility to maintain the confidentiality of your account details and to monitor all activity under your account. Bias Boutique grants you a non-exclusive, non-transferable, revocable license to use the application for your personal and non-commercial use. You agree not to use the application for any unlawful activities or in a manner that violates these terms.

Intellectual Property and Prohibited Conduct
All intellectual property rights in the application and its content are owned by or licensed to Bias Boutique. You may not use any content from our application without our permission. Engaging in prohibited conduct, such as using the application for illegal purposes, violating laws or third party rights, is grounds for immediate termination of your access to the application.

Disclaimer of Warranties and Limitation of Liability
Bias Boutique is provided on an "as is" basis without warranties of any kind, and we do not guarantee continuous, error-free, or secure access to our application. We shall not be liable for any damages or losses arising from your use or inability to use the application.

Amendments and Governing Law
We reserve the right to modify these Terms at any time. Your continued use of the application after any changes constitutes your agreement to the new terms. These terms are governed by the laws of the Philippines, and any disputes will be resolved in accordance with these laws.

Contact Information
For any questions regarding these terms, please contact us at (02) 8836-70-91
`;

const privacyPolicyContent = `

This Privacy Policy outlines how Bias Boutique collects, uses, and shares your personal information when you use our mobile application. By using the app, you consent to the collection, use, and sharing of your information as described in this policy.

Information Collection and Use
We collect information you provide directly to us, such as when you create an account, as well as information about your device and application usage automatically. We use this information to provide and improve our services, process transactions, communicate with you, and for compliance with our legal obligations.

Sharing of Information
Your information may be shared with third-party service providers to assist in providing our services, including payment processors. We also share information when required by law and to protect our rights.

Data Security and Children's Privacy
We implement security measures to protect your information, but we cannot guarantee its absolute security. Our application is not intended for children under 18, and we do not knowingly collect information from children under this age.

Policy Changes and Contact
We may update this Privacy Policy periodically. The updated policy will be posted on our application with an updated effective date. If you have any questions or concerns about our privacy practices, please contact us via the provided contact information.
`;
