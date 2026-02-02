import { syncSessionFromServer } from "@/utils/syncSessionFromServer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { Image, View } from "react-native";



const STORAGE = process.env.EXPO_PUBLIC_STORAGE_URL;

export default function TabLayout() {
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [canViewAlliance, setCanViewAlliance] = useState(false);

    function isAllianceActive(paymentDate?: string | null): boolean {
        if (!paymentDate) return false;

        const paidAt = new Date(paymentDate);
        if (isNaN(paidAt.getTime())) return false;

        const expiry = new Date(paidAt);
        expiry.setMonth(expiry.getMonth() + 6);

        return expiry >= new Date();
    }

    useEffect(() => {
        checkAllianceAccess();
    }, []);

    const checkAllianceAccess = async () => {
        const allianceStr = await AsyncStorage.getItem("alliance");

        if (!allianceStr) {
            setCanViewAlliance(false);
            return;
        }

        const alliance = JSON.parse(allianceStr);
        if (!alliance) {
            setCanViewAlliance(false);
            return;

        } else {
            const allowed = isAllianceActive(alliance.payment_date);
            setCanViewAlliance(allowed);
        }

    };


    useEffect(() => {
        loadProfilePhoto();
    }, []);

    const loadProfilePhoto = async () => {
        const memberStr = await AsyncStorage.getItem("member");
        if (!memberStr) return;

        const member = JSON.parse(memberStr);
        setProfilePhoto(member.profile_photo ?? null);
    };


    useEffect(() => {
        const interval = setInterval(() => {

            syncSessionFromServer();
        }, 30000); // every 30 seconds

        return () => clearInterval(interval);
    }, []);




    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: "#071633",
                    borderTopColor: "#102a56",
                    height: 62,
                },
                tabBarActiveTintColor: "#fbbf24", // amber
                tabBarInactiveTintColor: "#94a3b8",
            }}
        >
            <Tabs.Screen
                name="inbox"
                options={{
                    title: "Messages",
                    tabBarIcon: ({ color, size }) => (
                        <TabIcon source={require("../../assets/images/mailbox.png")} />
                    ),
                }}
            />

            <Tabs.Screen
                name="subscription"
                options={{
                    title: "Subscription",
                    tabBarIcon: () => (
                        <TabIcon source={require("../../assets/images/dollor.png")} />
                    ),
                }}
            />

            <Tabs.Screen
                name="alliances"
                options={{
                    title: "Alliances",
                    href: canViewAlliance ? undefined : null, // ✅ hides tab completely
                    tabBarIcon: () => (
                        <TabIcon source={require("../../assets/images/alliance.png")} />
                    ),
                }}
            />


            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: () => (
                        <ProfileTabIcon photo={profilePhoto} />
                    ),
                }}
            />
        </Tabs>
    );
}

function TabIcon({ source }: { source: any }) {
    return (
        <Image
            source={source}
            style={{ width: 22, height: 22 }}
            resizeMode="contain"
        />
    );
}

function ProfileTabIcon({ photo }: { photo: string | null }) {
    return (
        <View
            style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                overflow: "hidden",
                borderWidth: 1,
                borderColor: "#fbbf24",
            }}
        >
            <Image
                source={
                    photo
                        ? { uri: `${STORAGE}/${photo}` }
                        : require("../../assets/images/avatar.png")
                }
                style={{ width: 28, height: 28 }}
            />
        </View>
    );
}

