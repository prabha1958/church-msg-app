import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { calculateAge } from "../../utils/date"; // adjust path
import ImageSlider from "../components/ImageSlider";

export default function AllianceDetail() {
    const params = useLocalSearchParams<{ id?: string | string[] }>();
    const [data, setData] = useState<any>(null);
    const allianceId =
        typeof params.id === "string"
            ? params.id
            : Array.isArray(params.id)
                ? params.id[0]
                : null;

    useEffect(() => {
        if (allianceId) {
            load(allianceId);
        }
    }, [allianceId]);


    const load = async (id: string) => {
        try {
            const token = await AsyncStorage.getItem("auth_token");

            const res = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/alliances/${id}`,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const json = await res.json();





            if (json.success) {
                setData(json.data);
            }
        } catch (e) {
            console.error("Failed to load alliance", e);
        }
    };

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

    const age = calculateAge(data.alliance.date_of_birth);

    const images = [
        data.alliance.profile_photo,
        data.alliance.photo1,
        data.alliance.photo2,
        data.alliance.photo3,
    ].filter(Boolean);

    const fullName = [data.alliance.first_name, data.alliance.middle_name, data.alliance.last_name]
        .filter(Boolean)
        .join(" ");

    const member_name = [data.member.family_name, data.member.first_name, data.member.last_name]
        .filter(Boolean)
        .join(" ");

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

                {/* Images */}
                <ImageSlider images={images} />

                {/* Content */}


                <View className="p-4">
                    <Text className="text-amber-400 text-2xl font-bold">
                        {fullName}
                    </Text>

                    <Text className="text-slate-300 mt-1">
                        {data.alliance.alliance_type.toUpperCase()} • {data.age} yrs
                    </Text>
                </View>

                <View className="mx-4 mt-6 bg-[#071633] rounded-xl border border-[#102a56]">
                    <InfoRow label="Family Name" value={data.alliance.family_name} />
                    <InfoRow label="First Name" value={data.alliance.first_name} />
                    <InfoRow label="Last Name" value={data.alliance.last_name} />
                    <InfoRow label="Date of birth " value={formatDate(data.alliance.date_of_birth)} />
                    <InfoRow label="Age" value={age} />
                    <InfoRow label="Profession" value={data.alliance.profession} />
                    <InfoRow label="Designation" value={data.alliance.designation} />
                    <InfoRow label="Company" value={data.alliance.company_name} />
                    <InfoRow label="Place" value={data.alliance.place_of_working} />
                    <InfoRow label="Father" value={data.alliance.father_name} />
                    <InfoRow label="Mother" value={data.alliance.mother_name} />

                    <InfoRow
                        label="Education"
                        value={data.alliance.educational_qualifications}
                    />

                    {data.alliance.about_self && (
                        <Section title="About Self" text={data.alliance.about_self} />
                    )}

                    {data.alliance.about_family && (
                        <Section title="About Family" text={data.alliance.about_family} />
                    )}

                    <InfoRow label="Posted by" value={member_name} />
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

