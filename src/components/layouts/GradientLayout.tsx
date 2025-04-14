import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type TScreenProps = {
  children: React.ReactNode;
};

export const GradientLayout: React.FC<TScreenProps> = (props) => {
  return (
    <LinearGradient
      colors={["#0093E9", "#8e2de2"]}
      start={{ x: 0.0, y: 0.0 }}
      end={{ x: 1.0, y: 1.0 }}
      className="flex-1"
    >
      <View className="flex-1">{props.children}</View>
    </LinearGradient>
  );
};
