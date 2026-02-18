import { apiFetch } from "@/lib/api";
import { syncSessionFromServer } from "@/utils/syncSessionFromServer";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import MemberMenuModal from "../components/MemberMenuModal";
import MessageCard from "../components/MessageCard";



type Message = {
    id: number;
    title: string;
    body: string;
    published_at: string;
    image_path: string;
    attachment_path: string;
};

export default function InboxScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);


    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await apiFetch(`${process.env.EXPO_PUBLIC_API_URL}/messages`);

            if (!res.ok) {
                const text = await res.text();
                console.log("Messages API error:", text);
                return;
            }

            const data = await res.json();
            setMessages(data.data ?? []);



        } catch (e) {
            console.log("Failed to load messages", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchMessages();
            syncSessionFromServer();
        }, 30000); // every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const refreshMessages = async () => {
        setRefreshing(true);
        await fetchMessages();   // your existing API call
        setRefreshing(false);
    };



    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center bg-[#F4F6FB]">
                <ActivityIndicator size="large" color="#272757" />
            </SafeAreaView>
        );
    }

    const logo = require("../../assets/images/icon.png")

    return (
        <SafeAreaView className="flex-1 bg-[#040c1f]">

            {/* Header */}

            <AppHeader title={"Messages from Church"} onMenuPress={() => setMenuOpen(true)} />

            <MemberMenuModal visible={menuOpen}
                onClose={() => setMenuOpen(false)} />

            {/* Message list */}

            <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MessageCard item={item} />}
                contentContainerStyle={{ padding: 12 }}
                refreshing={refreshing}
                onRefresh={refreshMessages}
                ListEmptyComponent={
                    <Text className="text-center text-gray-500 mt-10">
                        No messages available
                    </Text>
                }
            />

        </SafeAreaView>
    );
}
