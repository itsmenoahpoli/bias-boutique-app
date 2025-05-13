import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { CashInModal } from "@/components/CashInModal";
import { PaymentOptionsModal } from "@/components/PaymentOptionsModal";
import { TransactionHistory } from "@/components/TransactionHistory";
import { type TStackParamsList } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useWalletStore } from "@/store/wallet.store";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "WALLET_SCREEN">;
};

export const WalletScreen: React.FC<TScreenProps> = ({ navigation }) => {
  const [isCashInModalVisible, setIsCashInModalVisible] = useState(false);
  const [isPaymentOptionsVisible, setIsPaymentOptionsVisible] = useState(false);
  const [isPaymentInputVisible, setIsPaymentInputVisible] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("options");
  const [cashInAmount, setCashInAmount] = useState(0);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<any>(null);
  const [paymentInput, setPaymentInput] = useState("");
  const { balance, addBalance, loadBalance } = useWalletStore();

  useEffect(() => {
    loadBalance();
  }, []);

  const handleCashIn = (amount: number) => {
    setCashInAmount(amount);
    setIsCashInModalVisible(false);
    setIsPaymentOptionsVisible(true);
  };

  const handleSelectPaymentOption = (option: any) => {
    setSelectedPaymentOption(option);
    setIsPaymentOptionsVisible(false);
    setIsPaymentInputVisible(true);
  };

  const handlePaymentSubmit = async () => {
    setIsPaymentInputVisible(false);
    await addBalance(cashInAmount);
    setPaymentInput("");
    setSelectedPaymentOption(null);
    setIsSuccessModalVisible(true);
  };

  const getInputPlaceholder = () => {
    if (!selectedPaymentOption) return "Enter payment details";

    switch (selectedPaymentOption.id) {
      case "gcash":
      case "maya":
        return "Enter mobile number";
      case "bpi":
      case "chinabank":
      case "rcbc":
      case "unionbank":
        return "Enter account number";
      case "qrph":
        return "Enter reference number";
      default:
        return "Enter payment details";
    }
  };

  const renderPaymentInputModal = () => {
    if (!selectedPaymentOption) return null;

    return (
      <Modal
        visible={isPaymentInputVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPaymentInputVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-xl w-11/12 max-w-md">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold">
                {selectedPaymentOption.name}
              </Text>
              <Pressable onPress={() => setIsPaymentInputVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </Pressable>
            </View>

            <Text className="text-gray-700 mb-2">Payment Details</Text>
            <TextInput
              className="border border-gray-300 rounded-md p-3 mb-6"
              placeholder={getInputPlaceholder()}
              value={paymentInput}
              onChangeText={setPaymentInput}
              keyboardType={
                selectedPaymentOption.id.includes("bank")
                  ? "number-pad"
                  : "default"
              }
            />

            <View className="flex-row justify-end space-x-3">
              <Pressable
                onPress={() => setIsPaymentInputVisible(false)}
                className="bg-gray-200 py-3 px-5 rounded-md"
              >
                <Text>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handlePaymentSubmit}
                className="bg-blue-500 py-3 px-5 rounded-md"
              >
                <Text className="text-white font-medium">Submit Payment</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderSuccessModal = () => {
    return (
      <Modal
        visible={isSuccessModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSuccessModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-xl w-11/12 max-w-md items-center">
            <View className="w-16 h-16 bg-green-100 rounded-full justify-center items-center mb-4">
              <Ionicons name="checkmark" size={32} color="#22c55e" />
            </View>
            <Text className="text-green-600 text-xl font-bold mb-2">
              Payment Successful!
            </Text>
            <Text className="text-gray-700 mb-6 text-center">
              Your wallet has been credited with ₱
              {cashInAmount.toLocaleString()}.00
            </Text>
            <TouchableOpacity
              onPress={() => setIsSuccessModalVisible(false)}
              className="bg-blue-500 py-3 px-8 rounded-md"
            >
              <Text className="text-white font-medium">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const options = [
    {
      label: "Transaction History",
      icon: "receipt",
      onPress: () => setActiveTab("history"),
    },
    {
      label: "Payment Options",
      icon: "card",
      onPress: () => setIsPaymentOptionsVisible(true),
    },
    {
      label: "Cash-In",
      icon: "add-circle",
      onPress: () => setIsCashInModalVisible(true),
    },
    {
      label: "Vouchers",
      icon: "pricetag",
      onPress: () =>
        Alert.alert("Coming Soon", "Vouchers feature is not yet available"),
    },
  ];

  return (
    <GradientLayout>
      <View className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="flex-row items-center pt-8 mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold ml-4 flex-1 text-center mr-9">
            Wallet
          </Text>
        </View>

        {/* Balance Card */}
        <View className="bg-white/10 rounded-2xl p-4 mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-white text-sm">Available Balance (₱)</Text>
            <TouchableOpacity
              className="bg-pink-500 px-4 py-1 rounded-full"
              onPress={() => setIsCashInModalVisible(true)}
            >
              <Text className="text-white text-sm">Cash In</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row items-end justify-between">
            <Text className="text-white text-3xl font-bold">
              {balance.toFixed(2)}
            </Text>
            <Text className="text-yellow-300 text-xs">
              Rebates (₱) 0.00 &gt;
            </Text>
          </View>
        </View>

        {/* Verify Account */}
        <TouchableOpacity className="bg-white/10 rounded-2xl p-4 mb-6 flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="shield-checkmark" size={20} color="#fff" />
            <Text className="text-white ml-2 text-sm">
              Verify your account to secure your transactions
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#fff" />
        </TouchableOpacity>

        {activeTab === "options" ? (
          /* Action Buttons */
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {options.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="w-[48%] items-center bg-white/10 rounded-2xl p-4"
                onPress={item.onPress}
              >
                <View className="w-12 h-12 bg-pink-500/20 rounded-full justify-center items-center mb-2">
                  <Ionicons name={item.icon as any} size={24} color="#fff" />
                </View>
                <Text className="text-white text-sm font-medium text-center">
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View className="flex-1">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-white text-lg font-bold">
                Transaction History
              </Text>
              <TouchableOpacity onPress={() => setActiveTab("options")}>
                <Text className="text-pink-200">Back to Options</Text>
              </TouchableOpacity>
            </View>
            <TransactionHistory />
          </View>
        )}

        {/* Cash In Modal */}
        <CashInModal
          visible={isCashInModalVisible}
          onClose={() => setIsCashInModalVisible(false)}
          onCashIn={handleCashIn}
        />

        {/* Payment Options Modal */}
        <PaymentOptionsModal
          visible={isPaymentOptionsVisible}
          onClose={() => setIsPaymentOptionsVisible(false)}
          onSelectPaymentOption={handleSelectPaymentOption}
        />

        {/* Payment Input Modal */}
        {renderPaymentInputModal()}

        {/* Success Modal */}
        {renderSuccessModal()}
      </View>
    </GradientLayout>
  );
};
