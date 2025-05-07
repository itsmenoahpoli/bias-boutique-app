import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import { useSubscriptionStore } from "@/store";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "PAYMENT_SCREEN">;
  route: RouteProp<TStackParamsList, "PAYMENT_SCREEN">;
};

export const PaymentScreen: React.FC<TScreenProps> = (props) => {
  const { type, channel, amount, planTitle } = props.route.params;
  const formattedAmount = `₱${amount.toLocaleString()}`;
  const setSubscription = useSubscriptionStore(
    (state) => state.setSubscription
  );

  console.log(type);

  const [modalVisible, setModalVisible] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [successModal, setSuccessModal] = useState(false);

  const handlePayment = () => {
    setModalVisible(true);
  };

  const handleSendOTP = () => {
    alert("OTP sent to your mobile number");
  };

  const calculateExpiryDate = () => {
    const today = new Date();

    // Determine plan duration based on title
    if (
      planTitle.toLowerCase().includes("annual") ||
      planTitle.toLowerCase().includes("year")
    ) {
      // Add 1 year
      return new Date(today.setFullYear(today.getFullYear() + 1));
    } else if (
      planTitle.toLowerCase().includes("monthly") ||
      planTitle.toLowerCase().includes("month")
    ) {
      // Add 1 month
      return new Date(today.setMonth(today.getMonth() + 1));
    } else if (
      planTitle.toLowerCase().includes("free") ||
      planTitle.toLowerCase().includes("days")
    ) {
      // Add 7 days for free trial
      return new Date(today.setDate(today.getDate() + 7));
    }

    // Default to 30 days if plan duration is unclear
    return new Date(today.setDate(today.getDate() + 30));
  };

  const saveSubscriptionData = async () => {
    try {
      const purchaseDate = new Date().toISOString();
      const expiryDate = calculateExpiryDate().toISOString();

      const planId = planTitle.toLowerCase().includes("annual")
        ? "annual"
        : planTitle.toLowerCase().includes("monthly")
        ? "monthly"
        : "free";

      await setSubscription({
        planId,
        planTitle,
        amount,
        purchaseDate,
        expiryDate,
        paymentMethod: {
          type,
          channel,
        },
      });

      console.log("Subscription data saved successfully");
    } catch (error) {
      console.error("Error saving subscription data:", error);
    }
  };

  const processPayment = () => {
    setModalVisible(false);
    // Save subscription data when payment is processed
    saveSubscriptionData().then(() => {
      setSuccessModal(true);
    });
  };

  const renderPaymentForm = () => {
    if (type === "credit-card") {
      return (
        <>
          <Text className="text-gray-700 mb-2">Name on Card</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-3 mb-4"
            placeholder="Enter cardholder name"
            value={cardName}
            onChangeText={setCardName}
          />

          <Text className="text-gray-700 mb-2">Card Number</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-3 mb-4"
            placeholder="XXXX XXXX XXXX XXXX"
            keyboardType="number-pad"
            value={cardNumber}
            onChangeText={setCardNumber}
          />

          <View className="flex-row space-x-4 mb-6">
            <View className="flex-1">
              <Text className="text-gray-700 mb-2">Expiry Date</Text>
              <TextInput
                className="border border-gray-300 rounded-md p-3"
                placeholder="MM/YY"
                keyboardType="number-pad"
                value={cardExpiry}
                onChangeText={setCardExpiry}
              />
            </View>
            <View className="flex-1">
              <Text className="text-gray-700 mb-2">CVV</Text>
              <TextInput
                className="border border-gray-300 rounded-md p-3"
                placeholder="XXX"
                keyboardType="number-pad"
                secureTextEntry
                value={cardCvv}
                onChangeText={setCardCvv}
              />
            </View>
          </View>
        </>
      );
    } else {
      return (
        <>
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold">E-Wallet Payment</Text>
            <TouchableOpacity onPress={() => handleSendOTP()}>
              <Text className="text-blue-500">Send OTP</Text>
            </TouchableOpacity>
          </View>

          <Text className="text-gray-700 mb-2">Mobile Number</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-3 mb-4"
            placeholder="Enter mobile number"
            keyboardType="phone-pad"
            value={mobileNumber}
            onChangeText={setMobileNumber}
          />

          <Text className="text-gray-700 mb-2">OTP Code</Text>
          <TextInput
            className="border border-gray-300 rounded-md p-3 mb-6"
            placeholder="Enter OTP code"
            keyboardType="number-pad"
            value={otpCode}
            onChangeText={setOtpCode}
          />
        </>
      );
    }
  };

  return (
    <GradientLayout>
      <View className="flex-1 p-6 pt-16">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-white text-2xl font-bold">Payment Details</Text>
          <TouchableOpacity
            onPress={() => props.navigation.goBack()}
            className="bg-red-800 py-2 px-4 rounded-md"
          >
            <Text className="text-white font-medium">Cancel</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white/20 p-4 rounded-xl mb-4">
          <Text className="text-white text-lg mb-2">Selected Plan</Text>
          <Text className="text-white text-xl font-semibold">{planTitle}</Text>
        </View>

        <View className="bg-white/20 p-4 rounded-xl mb-4">
          <Text className="text-white text-lg mb-2">Payment Method</Text>
          <Text className="text-white text-xl font-semibold capitalize">
            {channel}
          </Text>
        </View>

        <View className="bg-white/20 p-4 rounded-xl">
          <Text className="text-white text-lg mb-2">Amount</Text>
          <Text className="text-white text-2xl font-bold">
            {formattedAmount}.00
          </Text>
        </View>

        {/* Payment Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-xl w-11/12 max-w-md">
              {type === "credit-card" && (
                <Text className="text-xl font-bold mb-6">
                  Credit Card Payment
                </Text>
              )}

              {renderPaymentForm()}

              <View className="flex-row justify-end space-x-3">
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  className="bg-gray-200 py-3 px-5 rounded-md"
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={processPayment}
                  className="bg-blue-500 py-3 px-5 rounded-md"
                >
                  <Text className="text-white font-medium">
                    Process Payment
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Success Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={successModal}
          onRequestClose={() => setSuccessModal(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-xl w-11/12 max-w-md items-center">
              <Text className="text-green-600 text-xl font-bold mb-4">
                Payment Successful!
              </Text>
              <Text className="text-gray-700 mb-6 text-center">
                Your payment of {formattedAmount}.00 has been processed
                successfully.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setSuccessModal(false);
                  props.navigation.navigate("USERHOME_SCREEN");
                }}
                className="bg-blue-500 py-3 px-8 rounded-md"
              >
                <Text className="text-white font-medium">Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Payment Button - Fixed at bottom */}
      <View className="absolute bottom-0 left-0 right-0 p-6 bg-black/30">
        <TouchableOpacity
          onPress={handlePayment}
          className="bg-blue-600 py-4 rounded-xl items-center"
        >
          <Text className="text-white font-bold text-lg">
            Proceed to Payment
          </Text>
        </TouchableOpacity>
      </View>
    </GradientLayout>
  );
};
