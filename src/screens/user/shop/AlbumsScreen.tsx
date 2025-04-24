import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import { ArrowLeft, ShoppingCart } from "lucide-react-native";
import { PRODUCT_PLACEHOLDER } from "@/images";
import { useCartStore } from "@/store/cart.store";
import { useProductsService } from "@/services";
import type { Product } from "@/services/products.service";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "ALBUMS_SCREEN">;
};

export const AlbumsScreen: React.FC<TScreenProps> = ({ navigation }) => {
  const { addToCart, items, loadCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const productsService = useProductsService();

  useEffect(() => {
    loadCart();
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productsService.getProductsByCategory("Albums"); // Change category name for each screen
      setProducts(data);
    } catch (error) {
      Alert.alert("Error", "Failed to load albums"); // Change error message for each screen
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return `₱${price.toLocaleString()}`;
  };

  const handleProductPress = (product: Product) => {
    navigation.navigate("VIEW_PRODUCT_DETAIL_SCREEN", {
      product: {
        ...product,
        image: PRODUCT_PLACEHOLDER,
      },
    });
  };

  const handleAddToCart = async (product: Product) => {
    setIsLoading(true);
    try {
      const cartItem = {
        id: Number(product.id),
        name: product.name,
        price: formatPrice(product.price),
        image: PRODUCT_PLACEHOLDER,
      };

      await addToCart(cartItem);

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

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="white" />
          </View>
        ) : (
          <View className="flex-row flex-wrap justify-between">
            {products.map((product) => (
              <TouchableOpacity
                key={product.id}
                className="w-[48%] bg-white/10 rounded-xl mb-4 overflow-hidden"
                onPress={() => handleProductPress(product)}
              >
                <Image
                  source={PRODUCT_PLACEHOLDER}
                  className="w-full h-40"
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text className="text-white font-semibold">
                    {product.name}
                  </Text>
                  <Text className="text-white/80">
                    {formatPrice(product.price)}
                  </Text>
                  {product.is_discounted && (
                    <Text className="text-red-500 line-through">
                      {formatPrice(product.discounted_price)}
                    </Text>
                  )}
                  {product.stocks_qty <= 0 && (
                    <Text className="text-red-500">Out of Stock</Text>
                  )}
                  <TouchableOpacity
                    className="mt-2 bg-white/20 p-2 rounded"
                    onPress={() => handleAddToCart(product)}
                    disabled={product.stocks_qty <= 0}
                  >
                    <Text className="text-white text-center">
                      {product.stocks_qty <= 0 ? "Out of Stock" : "Add to Cart"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View className="h-20" />
      </ScrollView>
    </GradientLayout>
  );
};
