import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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

            console.log("API RESPONSE:", json); // 🔴 IMPORTANT

            if (json.success) {
                setData(json.data);
            }
        } catch (e) {
            console.error("Failed to load alliance", e);
        }
    };

    if (!data) return null;

    const images = [
        data.alliance.profile_photo,
        data.alliance.photo1,
        data.alliance.photo2,
        data.alliance.photo3,
    ].filter(Boolean);

    const fullName = [data.alliance.first_name, data.alliance.middle_name, data.alliance.last_name]
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

                    <Info label="Profession" value={data.alliance.profession} />
                    <Info label="Designation" value={data.alliance.designation} />
                    <Info label="Company" value={data.alliance.company_name} />
                    <Info label="Place" value={data.alliance.place_of_working} />

                    <Info label="Father" value={data.alliance.father_name} />
                    <Info label="Mother" value={data.alliance.mother_name} />

                    <Info
                        label="Education"
                        value={data.alliance.educational_qualifications}
                    />

                    {data.alliance.about_self && (
                        <Section title="About Self" text={data.alliance.about_self} />
                    )}

                    {data.alliance.about_family && (
                        <Section title="About Family" text={data.alliance.about_family} />
                    )}
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

