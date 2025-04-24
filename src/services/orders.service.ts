import { $baseApi } from "@/api";
import { CartItem } from "@/store/cart.store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TStackParamsList } from "@/types/navigation";

interface CartItemDTO {
  sku: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface OrderDTO {
  customer_email: string;
  cart_items: CartItemDTO[];
  total_amount: number;
  voucher: string | null;
}

interface OrderResponse {
  payment_url: string;
  // ... other response fields
}

export const useOrdersService = () => {
  const navigation = useNavigation<StackNavigationProp<TStackParamsList>>();

  const createOrder = async (
    customerEmail: string,
    cartItems: CartItem[],
    voucherCode?: string
  ) => {
    try {
      const cartItemDTOs: CartItemDTO[] = cartItems.map((item) => {
        const numericPrice = parseFloat(item.price.replace(/[₱,]/g, ""));

        return {
          sku: item.id.toString(),
          name: item.name,
          quantity: item.quantity,
          price: numericPrice,
          total: numericPrice * item.quantity,
        };
      });

      const totalAmount = cartItemDTOs.reduce(
        (sum, item) => sum + item.total,
        0
      );

      const orderPayload: OrderDTO = {
        customer_email: customerEmail,
        cart_items: cartItemDTOs,
        total_amount: totalAmount,
        voucher: voucherCode || null,
      };

      const response = await $baseApi.post<OrderResponse>(
        "/orders",
        orderPayload
      );

      if (!response.data.payment_url) {
        throw new Error("No payment URL received from server");
      }

      await navigation.navigate("CHECKOUT_WEBVIEW", {
        url: response.data.payment_url,
      });

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create order: ${error.message}`);
      }
      throw new Error("Failed to create order");
    }
  };

  return {
    createOrder,
  };
};
