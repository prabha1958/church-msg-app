import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Message = {
    id: number;
    title: string;
    body: string;
    published_at: string;
};

export default function MessageDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [message, setMessage] = useState<Message | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter()

    useEffect(() => {
        fetchMessage();
    }, []);

    const fetchMessage = async () => {
        try {
            const token = await AsyncStorage.getItem("auth_token");

            const res = await fetch(
                `http://192.168.1.82:8000/api/messages/${id}`,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();
            setMessage(data);
        } catch (e) {
            console.log("Failed to load message", e);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" />
            </SafeAreaView>
        );
    }

    if (!message) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <Text>Message not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-[#F4F6FB] px-4 py-4">
            <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-blue-950 text-lg mr-3">←</Text>
            </TouchableOpacity>
            <Text className="text-[#272757] text-xl font-semibold mb-2">
                {message.title}
            </Text>

            <Text className="text-gray-500 text-sm mb-4">
                {new Date(message.published_at).toDateString()}
            </Text>

            <Text className="text-gray-700 text-base leading-6">
                {message.body}
            </Text>
        </SafeAreaView>
    );
}
