import { $baseApi } from "@/api";
import { CartItem, useCartStore } from "@/store/cart.store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TStackParamsList } from "@/types/navigation";
import { useUserStore } from "@/store/user.store";

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
  payment_link: string;
}

export const useOrdersService = () => {
  const navigation = useNavigation<StackNavigationProp<TStackParamsList>>();
  const { removeFromCart } = useCartStore();
  const { user } = useUserStore();

  const fetchOrdersByCurrentUserEmail = async () => {
    const email = user?.email || "";
    try {
      const response = await $baseApi.get(`/orders?email=${email}`);

      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch orders: ${error.message}`);
      }
      throw new Error("Failed to fetch orders");
    }
  };

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

      console.log("response.data", response.data);

      if (!response.data.payment_link) {
        throw new Error("No payment URL received from server");
      }

      for (const item of cartItems) {
        await removeFromCart(item.id);
      }

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
    fetchOrdersByCurrentUserEmail,
  };
};
