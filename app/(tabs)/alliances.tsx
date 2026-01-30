import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AllianceCard from "../components/AllianceCard";
import MemberMenuModal from "../components/MemberMenuModal";


type AllianceRow = {
    alliance: {
        id: number;
        family_name: string;
        first_name: string;
        middle_name?: string;
        last_name?: string;
        date_of_birth: string;
        alliance_type: string;
        profile_photo?: string | null;
        photo1?: string | null;
        photo2?: string | null;
        photo3?: string | null;
        educational_qualifications: string;
        profession: string;
        designation: string;
        company_name: string;
        place_of_working: string;
        about_self?: string | null;
        about_family?: string | null;
        age: number;

    };
    member: {
        member_id: number;
        member_name: string;
        email: string;
        mobile_number: string;
    };
};


export default function InboxScreen() {
    const [alliances, setAlliances] = useState<AllianceRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [myAllianceType, setMyAllianceType] = useState<
        "bride" | "bridegroom" | null
    >(null);


    useEffect(() => {
        loadMyAllianceType();
    }, []);

    const loadMyAllianceType = async () => {
        const allianceStr = await AsyncStorage.getItem("alliance");
        if (!allianceStr) return;

        const alliance = JSON.parse(allianceStr);

        // assuming backend sends alliance_type if member posted alliance
        if (alliance?.alliance_type) {
            setMyAllianceType(alliance.alliance_type);
        }
    };


    useEffect(() => {
        fetchAlliances();
    }, []);

    const fetchAlliances = async () => {
        try {
            const token = await AsyncStorage.getItem("auth_token");


            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/alliances`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });


            const data = await res.json();
            setAlliances(data.data ?? []);


        } catch (e) {
            console.log("Failed to load messages", e);
        } finally {
            setLoading(false);
        }
    };




    useEffect(() => {
        const interval = setInterval(() => {
            fetchAlliances();
        }, 30000); // every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const refreshMessages = async () => {
        setRefreshing(true);
        await fetchAlliances();   // your existing API call
        setRefreshing(false);
    };


    const visibleAlliances = alliances.filter((row) => {
        const type = row.alliance.alliance_type;

        // If member has NOT posted any alliance → show all
        if (!myAllianceType) return true;

        // If member is bridegroom → show brides only
        if (myAllianceType === "bridegroom") {
            return type === "bride";
        }

        // If member is bride → show bridegrooms only
        if (myAllianceType === "bride") {
            return type === "bridegroom";
        }

        return true;
    });




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
                <Image
                    source={require("../../assets/images/church-logo.png")}
                    className="w-8 h-8"
                    resizeMode="contain"
                />
            </View>

            <MemberMenuModal visible={menuOpen}
                onClose={() => setMenuOpen(false)} />

            {/* Message list */}

            <FlatList
                data={visibleAlliances}
                keyExtractor={(item) => item.alliance.id.toString()}
                renderItem={({ item }) => (
                    <AllianceCard
                        alliance={item.alliance}
                        member={item.member}
                    />
                )}
                contentContainerStyle={{ padding: 12 }}
                refreshing={refreshing}
                onRefresh={refreshMessages}
                ListEmptyComponent={
                    <Text className="text-center text-gray-500 mt-10">
                        No messages available
                    </Text>
                }
            />

        </SafeAreaView>
    );
}
