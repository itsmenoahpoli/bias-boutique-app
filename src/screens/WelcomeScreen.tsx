import React from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { BRAND_LOGO } from "@/images";
import { type TStackParamsList } from "@/types/navigation";
import { useUserStore } from "@/store/user.store";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "WELCOME_SCREEN">;
};

export const WelcomeScreen: React.FC<TScreenProps> = (props) => {
  const user = useUserStore((state) => state.user);

  React.useEffect(() => {
    setTimeout(() => {
      if (user) {
        props.navigation.replace("USERHOME_SCREEN");
      } else {
        props.navigation.replace("PRICINGPLAN_SCREEN");
      }
    }, 2500);
  }, [user]);

  return (
    <GradientLayout>
      <View className="flex-1 justify-center items-center">
        <View className="flex flex-col gap-y-1">
          <Image
            source={BRAND_LOGO}
            className="w-32 h-32 mx-auto"
            resizeMethod="scale"
            resizeMode="contain"
          />
          <Text className="text-xl text-white font-bold mb-5">
            BIAS BOUTIQUE
          </Text>

          <ActivityIndicator size="large" />
        </View>
      </View>
    </GradientLayout>
  );
};
