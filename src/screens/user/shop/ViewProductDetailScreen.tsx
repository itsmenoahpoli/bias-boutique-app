import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import {
  ArrowLeft,
  MessageCircle,
  Share2,
  Star,
  Heart,
} from "lucide-react-native";
import { $baseApi } from "@/api";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { PRODUCT_PLACEHOLDER } from "@/images";
import { useOrdersService } from "@/services/orders.service";
import { useUserStore } from "@/store/user.store";
import { PaymentOptionsModal } from "@/components";

type ProductDetails = {
  id: string;
  name: string;
  price: number;
  discounted_price: number;
  is_discounted: boolean;
  category: string;
  description: string;
  stocks_qty: number;
  image: string | null;
};

type TScreenProps = {
  navigation: StackNavigationProp<
    TStackParamsList,
    "VIEW_PRODUCT_DETAIL_SCREEN"
  >;
  route: RouteProp<TStackParamsList, "VIEW_PRODUCT_DETAIL_SCREEN">;
};

export const ViewProductDetailScreen: React.FC<TScreenProps> = ({
  navigation,
  route,
}) => {
  const { product } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [productDetails, setProductDetails] = useState<ProductDetails>(
    product as ProductDetails
  );
  const { addToCart } = useCartStore();
  const {
    addToWishlist,
    removeFromWishlist,
    items: wishlistItems,
  } = useWishlistStore();
  const { createOrder } = useOrdersService();
  const { user } = useUserStore();
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    fetchProductDetails();
    checkWishlistStatus();
  }, []);

  const checkWishlistStatus = () => {
    const exists = wishlistItems.some((item) => item.id === product.id);
    setIsInWishlist(exists);
  };

  const handleWishlistToggle = async () => {
    if (!user?.email) {
      Alert.alert("Error", "Please login to add items to wishlist");
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(productDetails.id);
        Alert.alert("Success", "Product removed from wishlist");
      } else {
        const wishlistItem = {
          id: productDetails.id,
          name: productDetails.name,
          price: `₱${productDetails.price}`,
          image: productDetails.image || PRODUCT_PLACEHOLDER,
        };
        await addToWishlist(wishlistItem);
        Alert.alert("Success", "Product added to wishlist");
      }
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      Alert.alert("Error", "Failed to update wishlist");
    }
  };

  const fetchProductDetails = async () => {
    try {
      const response = await $baseApi.get<ProductDetails>(
        `/products/${product.id}`
      );
      setProductDetails(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to load product details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      const cartItem = {
        id: productDetails.id,
        name: productDetails.name,
        price: `₱${productDetails.price}`,
        image: productDetails.image || PRODUCT_PLACEHOLDER,
      };

      await addToCart(cartItem);
      Alert.alert("Success", "Product added to cart");
    } catch (error) {
      Alert.alert("Error", "Failed to add product to cart");
    }
  };

  const handleBuyNow = async () => {
    if (!user?.email) {
      Alert.alert("Error", "Please login to proceed with checkout");
      return;
    }

    setIsProcessing(true);
    try {
      const cartItem = {
        id: productDetails.id,
        name: productDetails.name,
        price: `₱${productDetails.price}`,
        image: productDetails.image || PRODUCT_PLACEHOLDER,
        quantity: 1,
      };

      await addToCart(cartItem);
      navigation.navigate("CART_SCREEN", { autoCheckout: true });
    } catch (error) {
      Alert.alert("Error", "Failed to add product to cart");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectPaymentOption = async (option: any) => {
    setShowPaymentOptions(false);
    try {
      const cartItem = {
        id: productDetails.id,
        name: productDetails.name,
        price: `₱${productDetails.price}`,
        image: productDetails.image || PRODUCT_PLACEHOLDER,
        quantity: 1,
      };

      const orderResponse = await createOrder(user?.email || "", [cartItem]);
      // navigation.navigate("CHECKOUT_WEBVIEW", {
      //   url: orderResponse.payment_link,
      // });
    } catch (error) {
      Alert.alert(
        "Checkout Error",
        error instanceof Error ? error.message : "Failed to process checkout"
      );
    }
  };

  if (isLoading) {
    return (
      <GradientLayout>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="white" />
        </View>
      </GradientLayout>
    );
  }

  return (
    <GradientLayout>
      <ScrollView className="flex-1 bg-white">
        <View className="relative">
          <View className="absolute top-10 left-3 z-10">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="bg-white/80 rounded-full p-2"
            >
              <ArrowLeft size={20} color="#000" />
            </TouchableOpacity>
          </View>

          <View className="bg-orange-400 p-6 pt-16 items-center">
            <Text className="text-3xl font-bold text-black">
              {productDetails.name}
            </Text>
            <View className="flex-row mt-4 w-full justify-center">
              <Image
                source={{
                  uri: productDetails.image
                    ? `https://bias-boutique-backend-production.up.railway.app${productDetails.image}`
                    : PRODUCT_PLACEHOLDER,
                }}
                className="w-32 h-32 rounded-lg shadow-md"
                resizeMode="cover"
              />
            </View>
          </View>
        </View>

        <View className="bg-white p-4 flex-row justify-between items-center">
          <View className="flex-row">
            <TouchableOpacity
              className="bg-pink-600 rounded-full px-4 py-2 mr-2"
              onPress={handleBuyNow}
              disabled={isProcessing}
            >
              <Text className="text-white font-semibold">
                {isProcessing ? "Processing..." : "Buy Now"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="border border-pink-600 rounded-full px-4 py-2 mr-2"
              onPress={handleAddToCart}
            >
              <Text className="text-pink-600 font-semibold">Add to Cart</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="border border-pink-600 rounded-full p-2"
              onPress={handleWishlistToggle}
            >
              <Heart
                size={20}
                color="#DB2777"
                fill={isInWishlist ? "#DB2777" : "none"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View className="bg-purple-600 p-4">
          <Text className="text-white text-2xl font-bold">
            ₱{productDetails.price.toLocaleString()}
          </Text>
          {productDetails.is_discounted && (
            <Text className="text-white/80 line-through">
              ₱{productDetails.discounted_price.toLocaleString()}
            </Text>
          )}
          <Text className="text-white font-bold mt-1">
            {productDetails.category}
          </Text>
          <View className="flex-row items-center mt-1">
            <Star size={16} color="#FCD34D" fill="#FCD34D" />
            <Text className="text-white ml-1">5.0</Text>
            <Text className="text-white text-opacity-80 ml-2">
              {productDetails.stocks_qty} in stock
            </Text>
            <View className="flex-1 flex-row justify-end">
              <TouchableOpacity className="mr-2">
                <MessageCircle size={18} color="white" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Share2 size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="bg-white p-4">
          <Text className="font-bold text-lg mb-2">Description</Text>
          <Text className="text-gray-600 text-sm">
            {productDetails.description}
          </Text>
        </View>
      </ScrollView>

      <PaymentOptionsModal
        visible={showPaymentOptions}
        onClose={() => setShowPaymentOptions(false)}
        onSelectPaymentOption={handleSelectPaymentOption}
      />
    </GradientLayout>
  );
};
