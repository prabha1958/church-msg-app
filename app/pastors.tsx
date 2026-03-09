import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MemberMenuModal from "./components/MemberMenuModal";
import PastorCard from "./components/PastorCard";

import { router } from "expo-router";
import AppHeader from "./components/AppHeader";
import AppLoader from "./components/AppLoader";




type Pastor = {
    id: number;
    name: string;
    qualifications: string;
    date_of_joining: string;
    designation: string;
    photo: string,
};

export default function Pastors() {


    const [pastors, setPastors] = useState<Pastor[]>([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);




    useEffect(() => {
        fetchPastors();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            fetchPastors();
        }, 30000); // every 30 seconds

        return () => clearInterval(interval);
    }, []);



    const fetchPastors = async () => {
        try {
            setLoading(true)

            const res = await apiFetch(
                `${process.env.EXPO_PUBLIC_API_URL}/pastors`
            );

            const data = await res.json();
            setPastors(data.data)
            setLoading(false)


        } catch (e) {
            console.log('failed to fetch pastors', e)
            setLoading(false)
        }
    }



    if (loading) {
        return (
            <AppLoader />
        );
    }

    const refreshPastors = async () => {
        setRefreshing(true);
        await fetchPastors();   // your existing API call
        setRefreshing(false);
    };



    return (
        <SafeAreaView className="flex-1 bg-[#040c1f]">

            <Text
                className="text-amber-400 text-2xl p-4"
                onPress={() => router.back()}
            >
                ←
            </Text>

            {/* Header */}
            <AppHeader title={"Our Clergy"} onMenuPress={() => setMenuOpen(true)} />

            <MemberMenuModal visible={menuOpen}
                onClose={() => setMenuOpen(false)} />

            {/* Back */}



            {/* Message list */}




            <FlatList
                data={pastors}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <PastorCard item={item} />}
                contentContainerStyle={{ padding: 12 }}
                refreshing={refreshing}
                onRefresh={refreshPastors}
                ListEmptyComponent={
                    <Text className="text-center text-gray-500 mt-10">
                        No pastor available
                    </Text>
                }
            />

        </SafeAreaView>
    );
}
