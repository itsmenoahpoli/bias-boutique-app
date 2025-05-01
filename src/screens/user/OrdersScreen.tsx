import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useOrdersService } from "@/services/orders.service";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "ORDERS_SCREEN">;
  route: RouteProp<TStackParamsList, "ORDERS_SCREEN">;
};

interface OrderItem {
  sku: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  customer_email: string;
  cart_items: string | OrderItem[]; // Can be string or already parsed
  total_amount: number;
  voucher: string | null;
  order_number: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  payment_status?: string; // Added payment status
  payment_type?: string; // Added payment type
  checkout_date?: string; // Added checkout date
  shipment_status?: string; // Added shipment status
}

const orderStatuses = [
  "All Orders",
  "To Ship",
  "To Receive",
  "To Review",
  "Returns/Cancels",
];

export const OrdersScreen: React.FC<TScreenProps> = ({ navigation, route }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All Orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { fetchOrdersByCurrentUserEmail } = useOrdersService();

  // Get params from route if they exist
  const selectedOrderId = route.params?.selectedOrderId;
  const showDetails = route.params?.showDetails;

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    // If selectedOrderId is provided, find and show that order's details
    if (selectedOrderId && orders.length > 0) {
      const order = orders.find((order) => order.id === selectedOrderId);
      if (order) {
        setSelectedOrder(order);
        if (showDetails) {
          setModalVisible(true);
        }
      }
    }
  }, [selectedOrderId, orders]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await fetchOrdersByCurrentUserEmail();

      // Parse cart_items if it's a string
      const parsedOrders = data.map((order: Order) => {
        if (typeof order.cart_items === "string") {
          try {
            return {
              ...order,
              cart_items: JSON.parse(order.cart_items),
            };
          } catch (e) {
            console.error("Error parsing cart_items:", e);
            return {
              ...order,
              cart_items: [],
            };
          }
        }
        return order;
      });

      setOrders(parsedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleStatusSelect = (status: string) => {
    setSelectedStatus(status);
    setIsDropdownOpen(false);
  };

  // Filter orders based on selected status
  const filteredOrders = useMemo(() => {
    if (selectedStatus === "All Orders" || selectedStatus === "To Ship")
      return orders;

    return orders.filter((order) => {
      switch (selectedStatus) {
        case "To Pay":
          return order.payment_status?.toLowerCase() === "pending";
        case "To Receive":
          return order.shipment_status?.toLowerCase() === "shipped";
        case "To Review":
          return order.shipment_status?.toLowerCase() === "delivered";
        case "Returns/Cancels":
          return order.shipment_status?.toLowerCase() === "cancelled";
        default:
          return true;
      }
    });
  }, [orders, selectedStatus]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return `₱${price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
  };

  // Helper to get cart items safely
  const getCartItems = (order: Order): OrderItem[] => {
    if (typeof order.cart_items === "string") {
      try {
        return JSON.parse(order.cart_items);
      } catch (e) {
        console.error("Error parsing cart_items in render:", e);
        return [];
      }
    }
    return order.cart_items as OrderItem[];
  };

  // Get total number of items in an order
  const getTotalItems = (order: Order): number => {
    const items = getCartItems(order);
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  // Get color for payment status tag
  const getPaymentStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-500/50";
      case "pending":
        return "bg-yellow-500/50";
      case "failed":
        return "bg-red-500/50";
      default:
        return "bg-gray-500/50";
    }
  };

  // Get color for payment type tag
  const getPaymentTypeColor = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "gcash":
        return "bg-blue-500/50";
      case "maya":
        return "bg-purple-500/50";
      case "credit card":
        return "bg-indigo-500/50";
      default:
        return "bg-gray-500/50";
    }
  };

  // Get color for shipment status tag
  const getShipmentStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "shipped":
        return "bg-green-500/50";
      case "delivered":
        return "bg-blue-500/50";
      case "cancelled":
        return "bg-red-500/50";
      default:
        return "bg-orange-500/50";
    }
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  const renderOrderDetailsModal = () => {
    if (!selectedOrder) return null;

    const cartItems = getCartItems(selectedOrder);
    const paymentStatus = selectedOrder.payment_status || "Pending";
    const paymentType = selectedOrder.payment_type || "Unknown";
    const shipmentStatus = selectedOrder.shipment_status || "To Ship";
    const checkoutDate = selectedOrder.checkout_date || selectedOrder.createdAt;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
        >
          <View
            style={{
              backgroundColor: "#1F2937",
              width: "90%",
              height: "80%",
              borderRadius: 12,
              padding: 16,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                Order Details
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ flex: 1, height: "100%" }}
              contentContainerStyle={{ paddingBottom: 10 }}
            >
              {/* Order Info */}
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    fontSize: 18,
                    marginBottom: 8,
                  }}
                >
                  {selectedOrder.order_number}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                    Checkout Date:
                  </Text>
                  <Text style={{ color: "white" }}>
                    {formatDate(checkoutDate)}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                    Customer Email:
                  </Text>
                  <Text style={{ color: "white" }}>
                    {selectedOrder.customer_email}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                    Total Amount:
                  </Text>
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {formatPrice(selectedOrder.total_amount)}
                  </Text>
                </View>

                {selectedOrder.voucher && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                      Voucher:
                    </Text>
                    <Text style={{ color: "white" }}>
                      {selectedOrder.voucher}
                    </Text>
                  </View>
                )}
              </View>

              {/* Status Info */}
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    marginBottom: 8,
                  }}
                >
                  Order Status
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                    Payment Status:
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 9999,
                      backgroundColor:
                        paymentStatus.toLowerCase() === "paid"
                          ? "rgba(34,197,94,0.5)"
                          : paymentStatus.toLowerCase() === "pending"
                          ? "rgba(234,179,8,0.5)"
                          : paymentStatus.toLowerCase() === "failed"
                          ? "rgba(239,68,68,0.5)"
                          : "rgba(107,114,128,0.5)",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 12,
                        textTransform: "uppercase",
                      }}
                    >
                      {paymentStatus}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                    Payment Type:
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 9999,
                      backgroundColor:
                        paymentType.toLowerCase() === "gcash"
                          ? "rgba(59,130,246,0.5)"
                          : paymentType.toLowerCase() === "maya"
                          ? "rgba(168,85,247,0.5)"
                          : paymentType.toLowerCase() === "credit card"
                          ? "rgba(99,102,241,0.5)"
                          : "rgba(107,114,128,0.5)",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 12,
                        textTransform: "uppercase",
                      }}
                    >
                      {paymentType}
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ color: "rgba(255,255,255,0.8)" }}>
                    Shipment Status:
                  </Text>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 9999,
                      backgroundColor:
                        shipmentStatus.toLowerCase() === "shipped"
                          ? "rgba(34,197,94,0.5)"
                          : shipmentStatus.toLowerCase() === "delivered"
                          ? "rgba(59,130,246,0.5)"
                          : shipmentStatus.toLowerCase() === "cancelled"
                          ? "rgba(239,68,68,0.5)"
                          : "rgba(249,115,22,0.5)",
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontSize: 12,
                        textTransform: "uppercase",
                      }}
                    >
                      {shipmentStatus}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Cart Items */}
              <View
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    marginBottom: 8,
                  }}
                >
                  Cart Items ({cartItems.length})
                </Text>

                {cartItems.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      borderBottomWidth: index === cartItems.length - 1 ? 0 : 1,
                      borderBottomColor: "rgba(255,255,255,0.1)",
                      paddingVertical: 8,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontWeight: "500",
                          flex: 1,
                          marginRight: 8,
                          flexWrap: "wrap",
                        }}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                      >
                        {item.name}
                      </Text>
                      <Text style={{ color: "white" }}>
                        {formatPrice(item.price)}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 4,
                      }}
                    >
                      <Text style={{ color: "rgba(255,255,255,0.7)" }}>
                        Quantity: {item.quantity}
                      </Text>
                      <Text style={{ color: "white", fontWeight: "500" }}>
                        Subtotal: {formatPrice(item.total)}
                      </Text>
                    </View>
                  </View>
                ))}

                <View
                  style={{
                    marginTop: 12,
                    paddingTop: 12,
                    borderTopWidth: 1,
                    borderTopColor: "rgba(255,255,255,0.2)",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    Total:
                  </Text>
                  <Text style={{ color: "white", fontWeight: "bold" }}>
                    {formatPrice(selectedOrder.total_amount)}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={{
                backgroundColor: "#9333EA",
                paddingVertical: 12,
                borderRadius: 12,
                marginTop: 12,
              }}
              onPress={closeModal}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <GradientLayout>
      <View className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="flex-row items-center pt-8 mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold ml-4">My Orders</Text>
        </View>

        {/* Dropdown Filter */}
        <View className="mb-4">
          <TouchableOpacity
            onPress={toggleDropdown}
            className="flex-row items-center justify-between bg-white/10 p-3 rounded-xl"
          >
            <Text className="text-white">{selectedStatus}</Text>
            <Ionicons
              name={isDropdownOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color="#fff"
            />
          </TouchableOpacity>

          {isDropdownOpen && (
            <View className="absolute top-14 left-0 right-0 bg-purple-800 rounded-xl z-10 -mt-2">
              {orderStatuses.map((status) => (
                <TouchableOpacity
                  key={status}
                  onPress={() => handleStatusSelect(status)}
                  className={`p-3 border-b border-white/20 ${
                    status === selectedStatus ? "bg-purple-600" : ""
                  }`}
                >
                  <Text className="text-white">{status}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="white" />
          </View>
        ) : filteredOrders.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <View className="bg-white/10 rounded-xl p-6 w-full items-center">
              <Ionicons name="cart-outline" size={60} color="white" />
              <Text className="text-white text-lg font-semibold mt-4">
                {selectedStatus === "All Orders"
                  ? "You have no orders yet"
                  : `No ${selectedStatus} orders found`}
              </Text>
              <Text className="text-white/70 text-center mt-2">
                {selectedStatus === "All Orders"
                  ? "Start shopping to see your orders here"
                  : "Try selecting a different filter or place new orders"}
              </Text>
              <TouchableOpacity
                className="mt-6 bg-purple-500 px-6 py-3 rounded-lg"
                onPress={() =>
                  selectedStatus === "All Orders"
                    ? navigation.navigate("USERHOME_SCREEN")
                    : setSelectedStatus("All Orders")
                }
              >
                <Text className="text-white font-semibold">
                  {selectedStatus === "All Orders"
                    ? "Browse Products"
                    : "View All Orders"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {filteredOrders.map((order) => {
              const totalItems = getTotalItems(order);
              const paymentStatus = order.payment_status || "Pending";
              const paymentType = order.payment_type || "Unknown";
              const shipmentStatus = order.shipment_status || "To Ship";
              const checkoutDate = order.checkout_date || order.createdAt;

              return (
                <View
                  key={order.id}
                  className="bg-white/10 rounded-xl p-4 mb-4"
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-white font-bold">
                      {order.order_number}
                    </Text>
                    <View>
                      <Text className="text-white/70 text-xs text-right">
                        Checkout Date:
                      </Text>
                      <Text className="text-white/70 text-xs">
                        {formatDate(checkoutDate)}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center mb-2">
                    <Text className="text-white">Cart Items: {totalItems}</Text>
                  </View>

                  {/* Status Tags */}
                  <View className="flex-row flex-wrap gap-2 mb-3">
                    <View>
                      <Text className="text-white/70 text-xs mb-1">
                        PAYMENT STATUS:
                      </Text>
                      <View
                        className={`px-2 py-1 rounded-full ${getPaymentStatusColor(
                          paymentStatus
                        )}`}
                      >
                        <Text className="text-white text-xs uppercase">
                          {paymentStatus}
                        </Text>
                      </View>
                    </View>

                    <View>
                      <Text className="text-white/70 text-xs mb-1">
                        PAYMENT TYPE:
                      </Text>
                      <View
                        className={`px-2 py-1 rounded-full ${getPaymentTypeColor(
                          paymentType
                        )}`}
                      >
                        <Text className="text-white text-xs uppercase">
                          {paymentType}
                        </Text>
                      </View>
                    </View>

                    <View>
                      <Text className="text-white/70 text-xs mb-1">
                        SHIPMENT STATUS:
                      </Text>
                      <View
                        className={`px-2 py-1 rounded-full ${getShipmentStatusColor(
                          shipmentStatus
                        )}`}
                      >
                        <Text className="text-white text-xs uppercase">
                          {shipmentStatus}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center border-t border-white/10 pt-2">
                    <Text className="text-white">Total:</Text>
                    <Text className="text-white font-bold">
                      {formatPrice(order.total_amount)}
                    </Text>
                  </View>

                  <View className="mt-3 flex-row justify-between">
                    <TouchableOpacity className="bg-purple-500/30 px-4 py-2 rounded-lg">
                      <Text className="text-white">Track Order</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="bg-white/20 px-4 py-2 rounded-lg"
                      onPress={() => handleViewDetails(order)}
                    >
                      <Text className="text-white">View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}

        {renderOrderDetailsModal()}
      </View>
    </GradientLayout>
  );
};
