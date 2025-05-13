import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import { useProductsService, type Product } from "@/services/products.service";
import { PRODUCT_PLACEHOLDER } from "@/images";
import {
  ArrowLeft,
  ChevronDown,
  Search,
  X,
  Sparkles,
} from "lucide-react-native";
import { getProductComparison } from "@/libs/compareai";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "PRODUCT_COMPARE_SCREEN">;
};

export const ProductCompareScreen: React.FC<TScreenProps> = ({
  navigation,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [product1, setProduct1] = useState<Product | null>(null);
  const [product2, setProduct2] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingComparison, setIsGeneratingComparison] = useState(false);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [aiComparison, setAiComparison] = useState<string>("");
  const productsService = useProductsService();

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((p) => p.category))
    );
    return ["All", ...uniqueCategories];
  }, [products]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (product1 && product2) {
      generateComparison();
    } else {
      setAiComparison("");
    }
  }, [product1, product2]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const fetchedProducts = await productsService.getProductsByCategory(
        "View All"
      );
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateComparison = async () => {
    if (!product1 || !product2) return;

    setIsGeneratingComparison(true);
    try {
      const comparison = await getProductComparison({
        product1,
        product2,
      });
      setAiComparison(comparison);
    } catch (error) {
      console.error("Failed to generate comparison:", error);
      setAiComparison("Failed to generate comparison. Please try again.");
    } finally {
      setIsGeneratingComparison(false);
    }
  };

  const getAssetUrl = (image: string | null) => {
    if (!image) return PRODUCT_PLACEHOLDER;
    return "https://bias-boutique-backend-production.up.railway.app" + image;
  };

  const formatPrice = (price: number) => {
    return `₱${price.toLocaleString()}`;
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const ProductDropdown = ({
    visible,
    onClose,
    onSelect,
    selectedProduct,
  }: {
    visible: boolean;
    onClose: () => void;
    onSelect: (product: Product) => void;
    selectedProduct: Product | null;
  }) => {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={onClose}
        >
          <View className="flex-1 mt-20 mx-4">
            <View className="bg-white rounded-lg max-h-[80%]">
              <View className="p-4 border-b border-gray-200">
                <Text className="text-lg font-semibold mb-4">
                  Select a Product
                </Text>

                <View className="flex-row items-center bg-gray-100 rounded-lg px-3 mb-4">
                  <Search size={20} color="#666" />
                  <TextInput
                    className="flex-1 p-2 text-base"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                  {searchQuery ? (
                    <TouchableOpacity onPress={() => setSearchQuery("")}>
                      <X size={20} color="#666" />
                    </TouchableOpacity>
                  ) : null}
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-2"
                >
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      onPress={() => setSelectedCategory(category)}
                      className={`mr-2 px-3 py-1 rounded-full ${
                        selectedCategory === category
                          ? "bg-blue-500"
                          : "bg-gray-200"
                      }`}
                    >
                      <Text
                        className={`${
                          selectedCategory === category
                            ? "text-white"
                            : "text-gray-700"
                        }`}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className={`p-4 border-b border-gray-100 ${
                      selectedProduct?.id === item.id ? "bg-gray-50" : ""
                    }`}
                    onPress={() => {
                      onSelect(item);
                      onClose();
                    }}
                  >
                    <View className="flex-row items-center">
                      <Image
                        source={{ uri: getAssetUrl(item.image) }}
                        className="w-12 h-12 rounded"
                        resizeMode="cover"
                      />
                      <View className="ml-3 flex-1">
                        <Text className="font-medium">{item.name}</Text>
                        <Text className="text-gray-600">
                          {formatPrice(item.price)}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                          {item.category}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View className="p-4 items-center">
                    <Text className="text-gray-500">No products found</Text>
                  </View>
                }
              />
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <GradientLayout>
      <View className="flex-row items-center justify-between px-4 py-3 pt-20">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-semibold">
          Compare Products (AI)
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="flex-row justify-between mb-4">
          <View className="w-[48%]">
            <TouchableOpacity
              className="bg-white/10 p-3 rounded-lg mb-2 flex-row items-center justify-between"
              onPress={() => setShowDropdown1(true)}
            >
              <Text className="text-white">
                {product1 ? product1.name : "Select product 1"}
              </Text>
              <ChevronDown color="white" size={20} />
            </TouchableOpacity>
            {isLoading ? (
              <View className="h-40 bg-white/10 rounded-lg items-center justify-center">
                <Text className="text-white">Loading...</Text>
              </View>
            ) : product1 ? (
              <View className="bg-white/10 rounded-lg overflow-hidden">
                <Image
                  source={{ uri: getAssetUrl(product1.image) }}
                  className="w-full h-40"
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text className="text-white font-semibold">
                    {product1.name}
                  </Text>
                  <Text className="text-white/80 text-sm mt-1">
                    {product1.description}
                  </Text>
                  <Text className="text-white font-bold mt-2">
                    {formatPrice(product1.price)}
                  </Text>
                </View>
              </View>
            ) : (
              <View className="h-40 bg-white/10 rounded-lg items-center justify-center">
                <Text className="text-white">No product selected</Text>
              </View>
            )}
          </View>

          <View className="w-[48%]">
            <TouchableOpacity
              className="bg-white/10 p-3 rounded-lg mb-2 flex-row items-center justify-between"
              onPress={() => setShowDropdown2(true)}
            >
              <Text className="text-white">
                {product2 ? product2.name : "Select product 2"}
              </Text>
              <ChevronDown color="white" size={20} />
            </TouchableOpacity>
            {isLoading ? (
              <View className="h-40 bg-white/10 rounded-lg items-center justify-center">
                <Text className="text-white">Loading...</Text>
              </View>
            ) : product2 ? (
              <View className="bg-white/10 rounded-lg overflow-hidden">
                <Image
                  source={{ uri: getAssetUrl(product2.image) }}
                  className="w-full h-40"
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text className="text-white font-semibold">
                    {product2.name}
                  </Text>
                  <Text className="text-white/80 text-sm mt-1">
                    {product2.description}
                  </Text>
                  <Text className="text-white font-bold mt-2">
                    {formatPrice(product2.price)}
                  </Text>
                </View>
              </View>
            ) : (
              <View className="h-40 bg-white/10 rounded-lg items-center justify-center">
                <Text className="text-white">No product selected</Text>
              </View>
            )}
          </View>
        </View>

        {product1 && product2 && (
          <View className="bg-white/10 rounded-lg p-4 mb-4">
            <View className="flex-row items-center mb-3">
              <Sparkles size={20} color="white" />
              <Text className="text-white text-lg font-semibold ml-2">
                AI Generated Overview
              </Text>
            </View>
            {isGeneratingComparison ? (
              <View className="flex-row items-center justify-center py-4">
                <ActivityIndicator color="white" />
                <Text className="text-white ml-2">
                  Generating comparison...
                </Text>
              </View>
            ) : (
              <View className="space-y-2">
                {aiComparison.split("\n").map((line, index) => (
                  <Text key={index} className="text-white/80">
                    {line}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <ProductDropdown
        visible={showDropdown1}
        onClose={() => {
          setShowDropdown1(false);
          setSearchQuery("");
          setSelectedCategory("All");
        }}
        onSelect={setProduct1}
        selectedProduct={product1}
      />

      <ProductDropdown
        visible={showDropdown2}
        onClose={() => {
          setShowDropdown2(false);
          setSearchQuery("");
          setSelectedCategory("All");
        }}
        onSelect={setProduct2}
        selectedProduct={product2}
      />
    </GradientLayout>
  );
};
