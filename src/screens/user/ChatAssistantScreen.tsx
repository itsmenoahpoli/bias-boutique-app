import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
  Image,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { GradientLayout } from "@/components";
import { type TStackParamsList } from "@/types/navigation";
import { ArrowLeft, Send } from "lucide-react-native";
import { getChatResponse } from "@/libs/chatai";
import { contextData } from "@/libs/chatai/context";
import { BRAND_LOGO } from "@/images";
import { useUserStore } from "@/store/user.store";

type TScreenProps = {
  navigation: StackNavigationProp<TStackParamsList, "CHATASSISTANT_SCREEN">;
};

type Message = {
  id: string;
  text: string;
  isUser: boolean;
};

export const ChatAssistantScreen: React.FC<TScreenProps> = ({ navigation }) => {
  const user = useUserStore((state) => state.user);
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hello! How can I help you today?", isUser: false },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Auto-scroll when messages change
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (inputText.trim() === "") return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await getChatResponse({
        userMessage: inputText,
        contextData,
      });

      const botMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't process your request. Please try again.",
        isUser: false,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderFooter = () => {
    if (!isLoading) return null;

    return (
      <View className="p-3 rounded-xl my-1 bg-purple-600/70 self-start flex-row items-center">
        <ActivityIndicator size="small" color="white" />
        <Text className="text-white ml-2">Thinking...</Text>
      </View>
    );
  };

  return (
    <GradientLayout>
      <View className="flex-1 px-4 py-6">
        <View className="flex-row items-center pt-8 mb-6">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold flex-1 text-center">
            Chat Assistant
          </Text>
          <TouchableOpacity
            onPress={() =>
              setMessages([
                {
                  id: "1",
                  text: "Hello! How can I help you today?",
                  isUser: false,
                },
              ])
            }
          >
            <Text className="text-white">Clear</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          className="flex-1 bg-white/10 rounded-xl p-2 mb-4"
          renderItem={({ item }) => (
            <View className="flex-row my-2">
              {!item.isUser && (
                <Image
                  source={BRAND_LOGO}
                  className="w-8 h-8 rounded-full mr-2 self-end"
                  resizeMode="contain"
                />
              )}
              <View
                className={`p-3 rounded-xl max-w-[75%] ${
                  item.isUser ? "bg-blue-600 ml-auto" : "bg-purple-600"
                }`}
              >
                <Text className="text-white">{item.text}</Text>
              </View>
              {item.isUser && (
                <View className="w-8 h-8 rounded-full ml-2 self-end bg-blue-400 items-center justify-center">
                  <Text className="text-white font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </Text>
                </View>
              )}
            </View>
          )}
          ListFooterComponent={renderFooter}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={100}
        >
          <View className="flex-row items-center bg-white/20 rounded-full px-4 py-2">
            <TextInput
              className="flex-1 text-white"
              placeholder="Type a message..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity
              onPress={handleSend}
              disabled={isLoading || inputText.trim() === ""}
              className={`ml-2 ${
                isLoading || inputText.trim() === "" ? "opacity-50" : ""
              }`}
            >
              <Send size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </GradientLayout>
  );
};
