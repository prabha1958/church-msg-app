import { apiFetch } from "@/lib/api";
import { formatDate } from "@/utils/date";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import ImageSlider from "../components/ImageSlider";
import Loader from "../components/Loader";
import MemberMenuModal from "../components/MemberMenuModal";

export default function EventDetail() {
    const params = useLocalSearchParams<{ id?: string | string[] }>();
    const [data, setData] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const pastorId =
        typeof params.id === "string"
            ? params.id
            : Array.isArray(params.id)
                ? params.id[0]
                : null;




    useEffect(() => {
        let mounted = true;

        const fetchMessage = async () => {
            try {

                setLoading(true);

                const res = await apiFetch(
                    `${process.env.EXPO_PUBLIC_API_URL}/events/${pastorId}`
                );

                const data = await res.json();
                if (mounted) setData(data.data);




            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchMessage();

        return () => {
            mounted = false;
        };
    }, [pastorId]);

    if (loading) {
        return (
            <View className="flex-1 bg-[#040c1f]">
                <View>
                    <Loader />
                </View>

            </View>
        );
    }

    if (!data) return null;


    return (
        <SafeAreaView className="flex-1 bg-[#040c1f]">
            <ScrollView>
                {/* Back */}
                <Text
                    className="text-amber-400 text-2xl p-4"
                    onPress={() => router.back()}
                >
                    ←
                </Text>

                <AppHeader title={data.name_of_event} onMenuPress={() => setMenuOpen(true)} />

                <MemberMenuModal visible={menuOpen}
                    onClose={() => setMenuOpen(false)} />
                {/* Content */}
                <View className="mt-7">
                    {data.event_photos && (
                        <ImageSlider images={data.event_photos} />
                    )}
                </View>
                <Text className="text-sm text-gray-300 text-right">slide to see more photos</Text>

                <View className="p-4">



                    <Text className="text-slate-300 mt-1">
                        {formatDate(data.date_of_event)}
                    </Text>
                </View>

                <View className="mx-4 mt-6 bg-[#071633] rounded-xl border border-[#102a56]">


                    <Text className="text-amber-100 text-sm">{data.description}</Text>


                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
