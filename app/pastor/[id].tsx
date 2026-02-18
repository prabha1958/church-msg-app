import { apiFetch } from "@/lib/api";
import { formatDate } from "@/utils/date";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import InfoRow from "../components/InfoRow";
import Loader from "../components/Loader";
import MemberMenuModal from "../components/MemberMenuModal";
import Section from "../components/Section";

export default function PastorDetail() {
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
                    `${process.env.EXPO_PUBLIC_API_URL}/pastors/${pastorId}`
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
                <Loader />
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

                <AppHeader title={data.name} onMenuPress={() => setMenuOpen(true)} />


                {/* Content */}
                <View className="mt-7">
                    {data.photo && (
                        <Image
                            source={{
                                uri: `${process.env.EXPO_PUBLIC_STORAGE_URL}/${data.photo}`,
                            }}
                            className="w-full h-56 rounded-xl mb-4"
                            resizeMode="cover"
                        />
                    )}
                </View>

                <MemberMenuModal visible={menuOpen}
                    onClose={() => setMenuOpen(false)} />

                <View className="p-4">

                    <Text className="text-[#fce2cc] text-xl font-bold text-center">
                        {data.designation}
                    </Text>

                    <Text className="text-slate-300 mt-1">
                        Qualifications:  {data.qualifications}
                    </Text>
                </View>

                <View className="mx-4 mt-6 bg-[#071633] rounded-xl border border-[#102a56]">
                    <InfoRow
                        label="Date of joining"
                        value={formatDate(data.date_of_joining)}
                    />

                    {data.past_service_description && (
                        <Section
                            title="About the pastor"
                            text={data.past_service_description}
                        />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
