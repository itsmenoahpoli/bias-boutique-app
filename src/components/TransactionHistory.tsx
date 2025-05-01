import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useOrdersService } from "@/services/orders.service";
import { useUserStore } from "@/store/user.store";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { TStackParamsList } from "@/types/navigation";

interface Transaction {
  id: string;
  transactionId: string;
  amount: number;
  date: string;
  status: string;
  paymentType: string;
}

export const TransactionHistory: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<TStackParamsList>>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchOrdersByCurrentUserEmail } = useOrdersService();
  const { user } = useUserStore();

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      const orders = await fetchOrdersByCurrentUserEmail();

      // Transform orders into transactions
      const transformedTransactions = orders.map((order: any) => {
        // Generate random transaction ID
        const randomId = Math.random()
          .toString(36)
          .substring(2, 10)
          .toUpperCase();

        return {
          id: order.id,
          transactionId: `TXN-${randomId}`,
          amount: order.total_amount,
          date: order.createdAt,
          status: order.payment_status || "Pending",
          paymentType: order.payment_type || "Unknown",
        };
      });

      setTransactions(transformedTransactions);
    } catch (error) {
      console.error("Failed to load transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "text-green-500";
      case "pending":
        return "text-yellow-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const handleTransactionPress = (transaction: Transaction) => {
    navigation.navigate("ORDERS_SCREEN", {
      selectedOrderId: transaction.id,
      showDetails: true,
    });
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <TouchableOpacity
      className="bg-white/10 rounded-xl p-4 mb-3"
      onPress={() => handleTransactionPress(item)}
    >
      <View className="flex-row justify-between items-center mb-1">
        <Text className="text-white font-bold">{item.transactionId}</Text>
        <Text className={`font-semibold ${getStatusColor(item.status)}`}>
          {item.status}
        </Text>
      </View>
      <View className="flex-row justify-between items-center">
        <Text className="text-white/70">{formatDate(item.date)}</Text>
        <Text className="text-white font-bold">{formatPrice(item.amount)}</Text>
      </View>
      <Text className="text-white/70 text-xs mt-1">
        Payment Method: {item.paymentType}
      </Text>
    </TouchableOpacity>
  );

  const EmptyList = () => (
    <View className="items-center justify-center py-10">
      <Text className="text-white text-center">No transactions found</Text>
    </View>
  );

  return (
    <View className="flex-1">
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="white" />
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 10 }}
          ListEmptyComponent={EmptyList}
        />
      )}
    </View>
  );
};
