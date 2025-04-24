import { $baseApi } from "@/api";
import { CartItem } from "@/store/cart.store";

interface CartItemDTO {
  sku: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface OrderDTO {
  customer_email: string;
  payment_link: string;
  cart_items: CartItemDTO[];
  total_amount: number;
  voucher: string | null;
  is_paid: boolean;
  date_checkout: string;
  payment_type: string;
  date_paid: string | null;
}

export const useOrdersService = () => {
  const createOrder = async (
    customerEmail: string,
    paymentLink: string,
    cartItems: CartItem[],
    voucherCode?: string
  ) => {
    try {
      const cartItemDTOs: CartItemDTO[] = cartItems.map((item) => {
        // Remove '₱' and ',' from price string and convert to number
        const numericPrice = parseFloat(item.price.replace(/[₱,]/g, ""));

        return {
          sku: item.id.toString(), // Assuming id can be used as SKU
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
        payment_link: paymentLink,
        cart_items: cartItemDTOs,
        total_amount: totalAmount,
        voucher: voucherCode || null,
        is_paid: false,
        date_checkout: new Date().toISOString(),
        payment_type: "online", // or get this from params if you have multiple payment types
        date_paid: null,
      };

      const response = await $baseApi.post("/orders", orderPayload);
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
