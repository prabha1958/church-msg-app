import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MessageCard from "./components/MessageCard";


type Message = {
    id: number;
    title: string;
    body: string;
    published_at: string;
};

export default function InboxScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const token = await AsyncStorage.getItem("auth_token");

            const res = await fetch("http://192.168.1.82:8000/api/messages", {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });


            const data = await res.json();
            setMessages(data.data ?? []);
            console.log(messages)

        } catch (e) {
            console.log("Failed to load messages", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-[#F4F6FB]">
                <ActivityIndicator size="large" color="#272757" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#F4F6FB]">
            {/* Header */}
            <View className="bg-[#272757] px-4 py-4">
                <Text className="text-white text-xl font-semibold">
                    Inbox
                </Text>
            </View>

            {/* Message list */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ padding: 12 }}
                renderItem={({ item }) => <MessageCard item={item} />}
                ListEmptyComponent={
                    <Text className="text-center text-gray-500 mt-10">
                        No messages available
                    </Text>
                }
            />
        </SafeAreaView>
    );
}
