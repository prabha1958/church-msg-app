import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "../components/Loader";

export default function PastorDetail() {
    const params = useLocalSearchParams<{ id?: string | string[] }>();
    const [data, setData] = useState<any>(null);
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

                setLoading(true)
                const token = await AsyncStorage.getItem("auth_token");

                const res = await fetch(
                    `${process.env.EXPO_PUBLIC_API_URL}/pastors/${pastorId}`,
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
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

    const formatDate = (date?: string | Date | null) => {
        if (!date) return "—";
        const d = typeof date === "string" ? new Date(date) : date;
        return d.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };



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


                {/* Content */}
                {data.photo && (
                    <Image
                        source={{
                            uri: `${process.env.EXPO_PUBLIC_STORAGE_URL}/${data.photo}`,
                        }}
                        className="w-full h-56 rounded-xl mb-4"
                        resizeMode="cover"
                    />
                )}



                <View className="p-4">

                    <Text className="text-amber-400 text-2xl font-bold">
                        {data.name}
                    </Text>
                    <Text className="text-[#fce2cc] text-xl font-bold text-center">
                        {data.designation}
                    </Text>

                    <Text className="text-slate-300 mt-1">
                        {data.qualifications}
                    </Text>
                </View>

                <View className="mx-4 mt-6 bg-[#071633] rounded-xl border border-[#102a56]">

                    <InfoRow label="Date of joining " value={formatDate(data.date_of_joining)} />


                    {data.past_service_desctiption && (
                        <Section title="About the pastor" text={data.past_service_description} />
                    )}

                    <Text className="text-amber-100 text-sm">{data.past_service_description}</Text>


                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function Info({ label, value }: { label: string; value?: string }) {
    if (!value) return null;
    return (
        <View className="mt-3">
            <Text className="text-slate-400 text-sm">{label}</Text>
            <Text className="text-slate-200">{value}</Text>
        </View>
    );
}

function Section({ title, text }: { title: string; text: string }) {
    return (
        <View className="mt-5">
            <Text className="text-amber-400 font-semibold">{title}</Text>
            <Text className="text-slate-300 mt-1">{text}</Text>
        </View>
    );
}

function InfoRow({
    label,
    value,
    isLast = false,
}: {
    label: string;
    value?: string | number | null;
    isLast?: boolean;
}) {
    return (
        <View
            className={`flex-row px-4 py-3 ${isLast ? "" : "border-b border-[#102a56]"
                }`}
        >
            <Text className="w-32 text-slate-400">{label}</Text>
            <Text className="flex-1 text-amber-300">
                {value || "—"}
            </Text>
        </View>
    );
}

