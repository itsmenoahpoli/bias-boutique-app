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
  navigation: StackNavigationProp<TStackParamsList, "ALBUMS_SCREEN">;
};

const products = [
  {
    id: 1,
    name: "Album 1",
    price: "₱1,500",
    image: PRODUCT_PLACEHOLDER,
  },
  {
    id: 2,
    name: "Album 2",
    price: "₱1,800",
    image: PRODUCT_PLACEHOLDER,
  },
  {
    id: 3,
    name: "Album 3",
    price: "₱1,600",
    image: PRODUCT_PLACEHOLDER,
  },
  {
    id: 4,
    name: "Album 4",
    price: "₱2,000",
    image: PRODUCT_PLACEHOLDER,
  },
  {
    id: 5,
    name: "Album 5",
    price: "₱1,700",
    image: PRODUCT_PLACEHOLDER,
  },
  {
    id: 6,
    name: "Album 6",
    price: "₱1,900",
    image: PRODUCT_PLACEHOLDER,
  },
];

export const AlbumsScreen: React.FC<TScreenProps> = ({ navigation }) => {
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

  return (
    <GradientLayout>
      {/* Header */}
      <View className="px-4 pt-12 pb-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-white text-xl font-bold mr-9">
            Albums
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("CART_SCREEN")}
            className="relative p-2"
          >
            <ShoppingCart size={24} color="white" />
            {items.length > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
                <Text className="text-white text-xs">{items.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Products Grid */}
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row flex-wrap justify-between">
          {products.map((product) => (
            <TouchableOpacity
              key={product.id}
              className="w-[48%] bg-white/10 rounded-xl mb-4 overflow-hidden"
              onPress={() => handleAddToCart(product)}
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

        {/* Add padding at the bottom for better scrolling experience */}
        <View className="h-20" />
      </ScrollView>
    </GradientLayout>
  );
};
