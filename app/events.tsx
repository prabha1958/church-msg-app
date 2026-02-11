import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventCard from "./components/EventCard";
import MemberMenuModal from "./components/MemberMenuModal";

import { router } from "expo-router";
import Loader from "./components/Loader";




type Events = {
    id: number;
    date_of_event: string;
    name_of_event: string;
    description: string;
    event_photos: [];

};

export default function Events() {


    const [events, setEvents] = useState<Events[]>([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);



    useEffect(() => {
        let mounted = true;

        const fetchEvents = async () => {
            try {

                setLoading(true)
                const token = await AsyncStorage.getItem("auth_token");

                const res = await fetch(
                    `${process.env.EXPO_PUBLIC_API_URL}/events`,
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();
                if (mounted) setEvents(data.data);



            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchEvents();

        return () => {
            mounted = false;
        };
    }, []);


    if (loading) {
        return (
            <View className="flex-1 bg-[#040c1f]">
                <Loader />
            </View>
        );
    }



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

            </View>

            <MemberMenuModal visible={menuOpen}
                onClose={() => setMenuOpen(false)} />

            {/* Back */}
            <Text
                className="text-amber-400 text-2xl p-4"
                onPress={() => router.back()}
            >
                ←
            </Text>


            {/* Message list */}

            <Text className="text-blue-50 text-2xl mt-10 text-center">Events</Text>


            <FlatList
                data={events}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <EventCard item={item} />}
                contentContainerStyle={{ padding: 12 }}
                refreshing={refreshing}
                ListEmptyComponent={
                    <Text className="text-center text-gray-500 mt-10">
                        No event available
                    </Text>
                }
            />

        </SafeAreaView>
    );
}
