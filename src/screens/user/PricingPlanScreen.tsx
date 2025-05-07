import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { PaymentOptionsModal } from "@/components/PaymentOptionsModal";
import { type TStackParamsList } from "@/types/navigation";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "PRICINGPLAN_SCREEN">;
};

const plans = [
  {
    id: "free",
    title: "7 days free",
    price: "₱1788 billed annually after trial",
  },
  { id: "monthly", title: "Monthly", price: "₱149 per month" },
  {
    id: "annual",
    title: "Annual",
    price: "₱894 per year",
    discount: "₱74.5 / month",
  },
];

export const PricingPlanScreen: React.FC<TScreenProps> = (props) => {
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>("free");
  const [showPaymentOptions, setShowPaymentOptions] = React.useState(false);

  const handleSelectPayment = () => {
    setShowPaymentOptions(true);
  };

  const handleClosePaymentOptions = () => {
    setShowPaymentOptions(false);
  };

  const handleSelectPaymentOption = (option: any) => {
    const selectedPlanData = plans.find((plan) => plan.id === selectedPlan);
    let amount = 0;
    let planTitle = "";

    if (selectedPlanData) {
      if (selectedPlan === "free") {
        amount = 1788;
      } else if (selectedPlan === "monthly") {
        amount = 149;
      } else if (selectedPlan === "annual") {
        amount = 894;
      }

      // Get the title of the selected plan
      planTitle = selectedPlanData.title;
    }

    const paymentType = determinePaymentType(option.id);

    setShowPaymentOptions(false);

    props.navigation.navigate("PAYMENT_SCREEN", {
      type: paymentType,
      channel: option.id,
      amount: amount,
      planTitle: planTitle,
    });
  };

  // Helper function to determine payment type
  const determinePaymentType = (
    channelId: string
  ): "e-wallet" | "credit-card" => {
    // List of e-wallet options
    const eWalletOptions = ["gcash", "maya", "grabpay", "shopeepay"];

    // If channelId is in eWalletOptions, return "e-wallet", otherwise return "credit-card"
    return eWalletOptions.includes(channelId) ? "e-wallet" : "credit-card";
  };

  return (
    <GradientLayout>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-white text-2xl font-bold">Pricing Plan</Text>
        <Text className="text-white text-sm text-center mt-2 opacity-70">
          Choose a subscription plan to unlock all the functionality of the
          application
        </Text>

        <View className="w-full flex flex-col mt-6 gap-y-4">
          {plans.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              onPress={() => setSelectedPlan(plan.id)}
              className={`p-4 rounded-xl border w-full ${
                selectedPlan === plan.id
                  ? "bg-purple-500/50 border-purple-500"
                  : "bg-blue-500/20 border-blue-500"
              }`}
            >
              <Text className="text-white text-lg font-semibold">
                {plan.title}
              </Text>
              <Text className="text-white text-sm opacity-70">
                {plan.price}
              </Text>

              {plan.discount && (
                <View className="absolute top-2 right-2 bg-purple-600 px-2 py-1 rounded-lg">
                  <Text className="text-white text-xs">{plan.discount}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text className="text-white text-sm opacity-70 mt-4">
          Cancel anytime
        </Text>
        <Text className="text-white text-xs opacity-50">
          Terms and Condition
        </Text>

        <TouchableOpacity
          className="mt-6 bg-white/20 px-6 py-3 rounded-xl"
          onPress={handleSelectPayment}
        >
          <Text className="text-white text-lg font-semibold">
            CONTINUE TO PURCHASE
          </Text>
        </TouchableOpacity>

        <PaymentOptionsModal
          visible={showPaymentOptions}
          onClose={handleClosePaymentOptions}
          onSelectPaymentOption={handleSelectPaymentOption}
        />
      </View>
    </GradientLayout>
  );
};
