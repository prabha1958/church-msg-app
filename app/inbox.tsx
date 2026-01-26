import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MemberMenuModal from "./components/MemberMenuModal";
import MessageCard from "./components/MessageCard";


type Message = {
    id: number;
    title: string;
    body: string;
    published_at: string;
    image_path: string;
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
            const token = await AsyncStorage.getItem("auth_token");


            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/messages`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });


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

    return (
        <SafeAreaView className="flex-1 bg-[#040c1f]">



            {/* Header */}
            <View className="bg-[#272757] px-4 py-3 flex-row items-center justify-between">

                {/* Left: Menu */}
                <TouchableOpacity onPress={() => setMenuOpen(true)}>
                    <Text className="text-white text-2xl font-bold">☰</Text>
                </TouchableOpacity>

                {/* Right: Church Logo */}
                <Image
                    source={require("../assets/images/church-logo.png")}
                    className="w-8 h-8"
                    resizeMode="contain"
                />
            </View>

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
