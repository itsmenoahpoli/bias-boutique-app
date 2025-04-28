import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { type TStackParamsList } from "@/types/navigation";

import {
  WelcomeScreen,
  LoginScreen,
  SignupScreen,
  PricingPlanScreen,
  UserHomeScreen,
  OrdersScreen,
  WalletScreen,
  ProfileScreen,
  ViewProductDetailScreen,
  ProductsScreen,
  CartScreen,
  CheckoutWebViewScreen,
} from "@/screens";

const { Navigator, Screen } = createStackNavigator<TStackParamsList>();

const navigationOpts = {
  headerShown: false,
};

export const AppNavigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Navigator
        screenOptions={navigationOpts}
        initialRouteName="WELCOME_SCREEN"
      >
        <Screen name="WELCOME_SCREEN" component={WelcomeScreen} />

        {/* Auth screens */}
        <Screen name="LOGIN_SCREEN" component={LoginScreen} />
        <Screen name="SIGNUP_SCREEN" component={SignupScreen} />

        {/* User screens */}
        <Screen name="PRICINGPLAN_SCREEN" component={PricingPlanScreen} />
        <Screen name="USERHOME_SCREEN" component={UserHomeScreen} />
        <Screen name="ORDERS_SCREEN" component={OrdersScreen} />
        <Screen name="WALLET_SCREEN" component={WalletScreen} />
        <Screen name="PROFILE_SCREEN" component={ProfileScreen} />
        <Screen name="CART_SCREEN" component={CartScreen} />

        {/* Shop screens */}

        <Screen name="PRODUCTS_SCREEN" component={ProductsScreen} />
        <Screen
          name="VIEW_PRODUCT_DETAIL_SCREEN"
          component={ViewProductDetailScreen}
        />
        <Screen name="CHECKOUT_WEBVIEW" component={CheckoutWebViewScreen} />
      </Navigator>
    </NavigationContainer>
  );
};
