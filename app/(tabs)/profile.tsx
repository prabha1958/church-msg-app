import { apiFetch } from "@/lib/api";
import { formatDate } from "@/utils/date";
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import AppLoader from "../components/AppLoader";
import InfoRow from "../components/InfoRow";
import MemberMenuModal from "../components/MemberMenuModal";

const router = useRouter();


type Member = {
    id: number;
    family_name: string;
    first_name: string;
    middle_name?: string;
    last_name?: string;
    date_of_birth: Date;
    wedding_date: Date;
    spouse_name: string;
    email: string;
    mobile_number: string;
    address_flat_no: string;
    address_premises: string;
    address_area: string;
    address_landmark: string;
    address_pin: number;
    occupation?: string;
    status: "in_service" | "retired" | "other";

    profile_photo?: string | null;
    couple_pic?: string | null;

    membership_fee?: number | null;
}
const STORAGE_URL = process.env.EXPO_PUBLIC_STORAGE_URL;

export default function Profile() {
    const [member, setMember] = useState<Member | null>(null);
    const [changeModalOpen, setChangeModalOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        loadMember();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            loadMember();
        }, 30000); // every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const refreshMessages = async () => {
        setRefreshing(true);
        await loadMember();   // your existing API call
        setRefreshing(false);
    };

    const loadMember = async () => {
        try {
            setLoading(true)
            const res = await apiFetch(`${process.env.EXPO_PUBLIC_API_URL}/member`);

            const data = await res.json();

            setMember(data);
            setLoading(false)


        } catch (e) {
            setLoading(false)
            console.log("Failed to load member", e);
        }


        //  if (!memberStr) return;
        // setMember(JSON.parse(memberStr));
    };


    if (loading) {
        return (
            <AppLoader />
        );
    }

    const fullName = [
        member?.first_name,
        member?.middle_name,
        member?.last_name,
    ]
        .filter(Boolean)
        .join(" ");

    const address = [
        member?.address_flat_no,
        member?.address_premises,
        member?.address_area,
        member?.address_landmark,
        member?.address_pin,
    ]
        .filter(Boolean)
        .join(", ");


    const logo = require("../../assets/images/icon.png")

    return (
        <SafeAreaView className="flex-1 bg-[#040c1f]">

            <AppHeader title={"Profile"} onMenuPress={() => setMenuOpen(true)} />
            <MemberMenuModal visible={menuOpen}
                onClose={() => setMenuOpen(false)} />

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                <View className="flex-row justify-between items-center p-4 pt-6">
                    <Text className="text-xl font-bold">Profile</Text>

                    <Pressable
                        onPress={() => router.push(`/member/profile/edit/${member?.id}`)}
                        className="bg-blue-600 px-4 py-2 rounded-lg"
                    >
                        <Text className="text-white font-semibold">Edit</Text>
                    </Pressable>
                </View>
                {/* Photos */}
                <View className="items-center mt-6">
                    <Image
                        source={
                            member?.profile_photo
                                ? { uri: `${STORAGE_URL}/${member.profile_photo}` }
                                : require("../../assets/images/avatar.png")
                        }
                        style={{ width: 96, height: 96 }}
                        className="rounded-full border-2 border-amber-400"
                    />

                    {member?.couple_pic ? (
                        <Image
                            source={{ uri: `${STORAGE_URL}/${member.couple_pic}` }}
                            style={{ width: 200, height: 120 }}
                            className="rounded-xl mt-4 border border-[#102a56]"
                            resizeMode="cover"
                        />
                    ) : null}
                </View>


                {/* Info Card */}
                <View className="mx-4 mt-6 bg-[#071633] rounded-xl border border-[#102a56]">
                    <InfoRow label="Family Name" value={member?.family_name} />
                    <InfoRow label="Full Name" value={fullName} />
                    <InfoRow label="Date of Birth" value={formatDate(member?.date_of_birth)} />
                    <InfoRow label="Wedding Date" value={formatDate(member?.wedding_date)} />
                    <InfoRow label="Spouse Name" value={member?.spouse_name} />
                    <InfoRow label="Email" value={member?.email} />
                    <InfoRow label="Mobile" value={member?.mobile_number} />
                    <InfoRow label="Address" value={address} />
                    <InfoRow label="Occupation" value={member?.occupation} />
                    <InfoRow label="Status" value={member?.status.replace("_", " ")} />
                    <InfoRow
                        label="Membership Fee"
                        value={
                            member?.membership_fee
                                ? `₹ ${member.membership_fee}`
                                : "—"
                        }
                        isLast
                    />
                </View>


            </ScrollView>
        </SafeAreaView>
    );
}