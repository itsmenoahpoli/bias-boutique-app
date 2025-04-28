import { $baseApi } from "@/api";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discounted_price: number;
  stocks_qty: number;
  is_discounted: boolean;
  is_pulished: boolean;
  createdAt: string;
  updatedAt: string;
};

type ProductResponse = {
  data: Product[];
  message: string;
  success: boolean;
};

export const useProductsService = () => {
  const navigation = useNavigation();

  const getProductsByCategory = async (
    category: string
  ): Promise<Product[]> => {
    try {
      const response = await $baseApi.get<Product[]>(
        `/products?category=${category}`
      );

      if (!response.data.length) {
        Alert.alert("No Products", "No products available for this category", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      }

      return response.data.map((product) => ({
        ...product,
        // Format the price to Philippine Peso
        price: product.is_discounted ? product.discounted_price : product.price,
      }));
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to fetch ${category} products: ${error.message}`
        );
      }
      throw new Error(`Failed to fetch ${category} products`);
    }
  };

  return {
    getProductsByCategory,
  };
};
