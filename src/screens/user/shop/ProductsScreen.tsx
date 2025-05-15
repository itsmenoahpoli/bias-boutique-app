import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import {
  ArrowLeft,
  ShoppingCart,
  Search,
  ChevronDown,
} from "lucide-react-native";
import { PRODUCT_PLACEHOLDER } from "@/images";
import { useCartStore } from "@/store/cart.store";
import { useProductsService, type Product } from "@/services/products.service";
import { getAnimatedStyle } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type ProductsScreenNavigationProp = StackNavigationProp<
  TStackParamsList,
  "PRODUCTS_SCREEN"
>;

type ProductsScreenRouteProp = RouteProp<TStackParamsList, "PRODUCTS_SCREEN">;

type Props = {
  navigation: ProductsScreenNavigationProp;
  route: ProductsScreenRouteProp;
};

export const ProductsScreen = ({ navigation, route }: Props) => {
  const { category, searchQuery } = route.params;
  const { addToCart, items, loadCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState("");
  const [sortBy, setSortBy] = useState<"price" | "name">("price");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const productsService = useProductsService();

  useEffect(() => {
    loadCart();
    fetchProducts();
  }, [category]);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchText, sortBy, sortOrder]);

  const filterAndSortProducts = () => {
    let filtered = [...products];

    if (searchText) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === "price") {
        return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
      } else {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
    });

    setFilteredProducts(filtered);
  };

  const getAssetUrl = (image: string | null) => {
    if (!image) return PRODUCT_PLACEHOLDER;
    return "https://bias-boutique-backend-production.up.railway.app" + image;
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const fetchedProducts = await productsService.getProductsByCategory(
        category,
        searchQuery
      );
      setProducts(fetchedProducts);
    } catch (error) {
      Alert.alert("Error", `Failed to load products`);
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
        image: getAssetUrl(product.image),
      },
    });
  };

  const handleAddToCart = async (product: Product) => {
    setIsLoading(true);
    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: formatPrice(product.price),
        image: product.image || PRODUCT_PLACEHOLDER,
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
            onPress: () => navigation.navigate("CART_SCREEN", {}),
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
      <View className="flex-1">
        <View className="px-4 pt-20">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <ArrowLeft color="white" />
            </TouchableOpacity>
            <Text className="text-white text-lg font-semibold">{category}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("CART_SCREEN", {})}
            >
              <ShoppingCart color="white" />
            </TouchableOpacity>
          </View>

          <View className="mb-4">
            <View className="flex-row items-center bg-white/10 rounded-lg px-3 py-2 mb-2">
              <Search color="white" size={20} />
              <TextInput
                className="flex-1 text-white ml-2"
                placeholder="Search products..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>

            <View className="flex-row gap-2">
              <TouchableOpacity
                className="flex-1 bg-white/10 rounded-lg px-3 py-2"
                onPress={() => setSortBy(sortBy === "price" ? "name" : "price")}
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-white">Sort by: {sortBy}</Text>
                  <ChevronDown color="white" size={20} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-white/10 rounded-lg px-3 py-2"
                onPress={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-white">Order: {sortOrder}</Text>
                  <ChevronDown color="white" size={20} />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="white" />
            </View>
          ) : filteredProducts.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <View className="bg-white/10 rounded-2xl p-8 items-center">
                <MaterialCommunityIcons
                  name="shopping-outline"
                  size={64}
                  color="white"
                  className="mb-4"
                />
                <Text className="text-white text-xl font-semibold mb-2">
                  No Products Found
                </Text>
                <Text className="text-white/70 text-center">
                  {searchText
                    ? "Try adjusting your search or filters"
                    : "No products available in this category"}
                </Text>
              </View>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {filteredProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  className="w-[48%] bg-white/10 rounded-xl mb-4 overflow-hidden"
                  onPress={() => handleProductPress(product)}
                >
                  <Image
                    source={{
                      uri: getAssetUrl(product.image) || PRODUCT_PLACEHOLDER,
                    }}
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
                        {product.stocks_qty <= 0
                          ? "Out of Stock"
                          : "Add to Cart"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <View className="h-20" />
        </ScrollView>
      </View>
    </GradientLayout>
  );
};
