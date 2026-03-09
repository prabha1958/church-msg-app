import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventCard from "./components/EventCard";
import MemberMenuModal from "./components/MemberMenuModal";

import { router } from "expo-router";
import AppHeader from "./components/AppHeader";
import AppLoader from "./components/AppLoader";
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
        fetchEvents();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchEvents();
        }, 30000); // every 30 seconds

        return () => clearInterval(interval);
    }, []);



    const fetchEvents = async () => {
        try {


            const res = await apiFetch(
                `${process.env.EXPO_PUBLIC_API_URL}/events`
            );

            const data = await res.json();
            setEvents(data.data)
            setLoading(false)


        } catch (e) {
            console.log('failed to fetch events', e)
            setLoading(false)
        }
    }


    if (loading) {
        <AppLoader />
    }

    const refreshEvents = async () => {
        setRefreshing(true);
        await fetchEvents();   // your existing API call
        setRefreshing(false);
    };



    return (

        <SafeAreaView className="flex-1 bg-[#040c1f]">
            {loading && (
                <View className="flex-1 bg-[#040c1f]">
                    <Loader />
                </View>
            )}
            {/* Back */}
            <Text
                className="text-amber-400 text-2xl p-4"
                onPress={() => router.back()}
            >
                ←
            </Text>

            {/* Header */}

            <AppHeader title={"Events"} onMenuPress={() => setMenuOpen(true)} />


            <MemberMenuModal visible={menuOpen}
                onClose={() => setMenuOpen(false)} />



            {/* Message list */}




            <FlatList
                data={events}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <EventCard item={item} />}
                contentContainerStyle={{ padding: 12 }}
                refreshing={refreshing}
                onRefresh={refreshEvents}
                ListEmptyComponent={
                    <Text className="text-center text-gray-500 mt-10">
                        No event available
                    </Text>
                }
            />

        </SafeAreaView>
    );
}
