import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import { ArrowLeft, ShoppingCart } from "lucide-react-native";
import { PRODUCT_PLACEHOLDER } from "@/images";
import { useCartStore } from "@/store/cart.store";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "ACCESSORIES_SCREEN">;
};

const products = [
  {
    id: 1,
    name: "Fan Ring",
    price: "₱350",
    image: PRODUCT_PLACEHOLDER,
  },
  {
    id: 2,
    name: "K-Pop Bracelet",
    price: "₱250",
    image: PRODUCT_PLACEHOLDER,
  },
  // Add more accessories as needed
];

export const AccessoriesScreen: React.FC<TScreenProps> = ({ navigation }) => {
  const { addToCart, items, loadCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const handleAddToCart = async (product: (typeof products)[0]) => {
    setIsLoading(true);
    try {
      await addToCart(product);
      Alert.alert(
        "Added to Cart!",
        `${product.name} has been added to your cart`,
        [
          {
            text: "Continue Shopping",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "View Cart",
            onPress: () => navigation.navigate("CART_SCREEN"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "There was a problem adding this item to your cart",
        [{ text: "OK" }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <GradientLayout>
      <View className="px-4 pt-12 pb-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-white text-xl font-bold mr-9">
            Accessories
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("CART_SCREEN")}
            className="relative p-2"
          >
            <ShoppingCart size={24} color="white" />
            {cartItemCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs">{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between">
          {products.map((product) => (
            <TouchableOpacity
              key={product.id}
              className="w-[48%] bg-white/10 rounded-xl mb-4 overflow-hidden"
              onPress={() =>
                navigation.navigate("VIEW_PRODUCT_DETAIL_SCREEN", { product })
              }
            >
              <Image
                source={product.image}
                className="w-full h-40"
                resizeMode="cover"
              />
              <View className="p-3">
                <Text className="text-white font-semibold">{product.name}</Text>
                <Text className="text-white/80">{product.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View className="h-20" />
      </ScrollView>
    </GradientLayout>
  );
};
