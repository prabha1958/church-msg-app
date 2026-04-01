import api from '@/services/api';
import { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import AppLoader from "../components/AppLoader";
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
            const res = await api.get('/messages');

            setMessages(res.data.data ?? []);

        } catch (e: any) {
            console.log("Messages API error:", e.response?.data || e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchMessages();

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
            <AppLoader />
        );
    }




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
