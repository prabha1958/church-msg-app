import { apiFetch } from "@/lib/api";
import { calculateAge, formatDate } from "@/utils/date";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import AppLoader from "../components/AppLoader";
import ImageSlider from "../components/ImageSlider";
import InfoRow from "../components/InfoRow";
import Section from "../components/Section";

export default function AllianceDetail() {
    const params = useLocalSearchParams<{ id?: string | string[] }>();
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
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
            setLoading(true)
            const res = await apiFetch(
                `${process.env.EXPO_PUBLIC_API_URL}/alliances/${id}`
            );

            const json = await res.json();





            if (json.success) {
                setData(json.data);
                setLoading(false)
            }
        } catch (e) {
            console.error("Failed to load alliance", e);
            setLoading(false)
        }
    };

    if (loading) {
        return (
            <AppLoader />
        )
    }

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

                <AppHeader title={fullName} onMenuPress={() => setMenuOpen(true)} />

                {/* Images */}
                <ImageSlider images={images} />
                <Text className="text-sm text-gray-300 text-right">slide to see more photos</Text>
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
