import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from "react-native";

type CashInModalProps = {
  visible: boolean;
  onClose: () => void;
  onCashIn: (amount: number) => void;
};

export const CashInModal: React.FC<CashInModalProps> = ({
  visible,
  onClose,
  onCashIn,
}) => {
  const [customAmount, setCustomAmount] = useState("");
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const amounts = [100, 200, 300, 400, 500, 1000];

  const handleAmountSelect = (amount: number) => {
    onClose();
    setIsCustomAmount(false);
    setCustomAmount("");
    onCashIn(amount);
  };

  const handleCustomAmountSubmit = () => {
    const amount = Number(customAmount);
    if (!isNaN(amount) && amount > 0) {
      onClose();
      setIsCustomAmount(false);
      setCustomAmount("");
      onCashIn(amount);
    } else {
      Alert.alert("Invalid Amount", "Please enter a valid amount");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <Pressable
          className="flex-1 justify-center items-center bg-black/50"
          onPress={onClose}
        >
          <Pressable
            className="w-[80%] bg-white rounded-2xl p-4"
            onPress={(e) => e.stopPropagation()}
          >
            <Text className="text-xl font-bold text-center mb-4">
              WALLET CASH-IN
            </Text>
            <Text className="font-medium text-center mb-4">
              Select Amount
            </Text>

            {!isCustomAmount ? (
              <>
                <View className="flex-row flex-wrap justify-between">
                  {amounts.map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      className="w-[30%] bg-purple-100 rounded-xl p-3 mb-3"
                      onPress={() => handleAmountSelect(amount)}
                    >
                      <Text className="text-purple-900 text-center font-semibold">
                        ₱{amount}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  className="mt-2"
                  onPress={() => setIsCustomAmount(true)}
                >
                  <Text className="text-purple-700 text-center">
                    Enter Custom Amount
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <View>
                <TextInput
                  className="border border-gray-300 rounded-xl p-3 mb-4"
                  placeholder="Enter amount"
                  keyboardType="numeric"
                  value={customAmount}
                  onChangeText={setCustomAmount}
                  autoFocus
                />
                <View className="flex-row justify-end space-x-3">
                  <TouchableOpacity
                    className="px-4 py-2"
                    onPress={() => {
                      setIsCustomAmount(false);
                      setCustomAmount("");
                    }}
                  >
                    <Text className="text-gray-600">Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-purple-700 px-4 py-2 rounded-xl"
                    onPress={handleCustomAmountSubmit}
                  >
                    <Text className="text-white">Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              className="mt-4"
              onPress={onClose}
            >
              <Text className="text-gray-500 text-center">Cancel</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};