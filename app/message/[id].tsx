import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";



export default function MessageDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [message, setMessage] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);


    useEffect(() => {
        fetchMessage();
    }, []);

    const fetchMessage = async () => {
        const token = await AsyncStorage.getItem("auth_token");

        const res = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/messages/${id}`,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await res.json();
        setMessage(data);
    };

    if (!message) return null;

    const type = String(message.message_type || "general").toLowerCase();

    function getContainerBg(type: string) {
        switch (type) {
            case "birthday":
                return "bg-purple-700  rounded-2xl";
            case "anniversary":
                return "bg-emerald-700  rounded-2xl";
            case "changes":
                return "bg-amber-950  py-10 px-4 rounded-2xl";
            case "otp":
                return "bg-red-600  py-10 px-4 rounded-2xl";
            default:
                return "bg-[#071633]  py-10 px-4 rounded-2xl";
        }
    }

    function getTitleColor(type: string) {
        switch (type) {
            case "changes":
                return "text-amber-300";
            case "birthday":
                return "text-purple-850";
            case "anniversary":
                return "text-green-50";
            default:
                return "text-white";
        }
    }

    function getBodyColor(type: string) {
        switch (type) {
            case "changes":
                return "text-amber-300";
            case "birthday":
                return "text-purple-800";
            case "anniversary":
                return "text-emerald-100";
            case "otp":
                return "text-red-100";
            default:
                return "text-slate-300";
        }
    }


    const isBirthday = type === "birthday";
    const isAnniversary = type === "anniversary";

    const bgImage =
        isBirthday
            ? require("../../assets/images/birthday.png")
            : require("../../assets/images/anniversary.png");




    return (
        <SafeAreaView className="flex-1  bg-[#040c1f]">
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
            {/* Header */}
            <View className=" px-4 py-3 flex-row items-center">
                <Text
                    className="text-white text-2xl mr-3"
                    onPress={() => router.back()}
                >
                    ←
                </Text>

            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>

                <View className={`${getContainerBg(type)} `}>

                    {isBirthday || isAnniversary ? (

                        <ImageBackground
                            source={bgImage}
                            resizeMode="stretch"
                            imageStyle={{ borderRadius: 16 }}
                            className="rounded-xl p-4 mb-3 overflow-hidden brightness-110"
                        >

                            <Text className="text-blue-50 text-sm text-right">
                                {new Date(message.published_at).toDateString()}
                            </Text>
                            {/* Title + Date */}
                            <View className="flex-row items-start mb-3">
                                <Text className={`${getTitleColor(type)} text-3xl font-semibold flex-1 pr-2`}>
                                    {message.title}
                                </Text>


                            </View>

                            {/* Image (if exists) */}
                            {message.image_path && (
                                <Image
                                    source={{
                                        uri: `${process.env.EXPO_PUBLIC_STORAGE_URL}/${message.image_path}`,
                                    }}
                                    className="w-full h-56 rounded-xl mb-4"
                                    resizeMode="cover"
                                />
                            )}

                            {/* Body */}
                            <Text className={`${getTitleColor(type)} text-xl font-bold leading-6`}>
                                {message.body}
                            </Text>
                            <View className="mt-2">
                                <Text className="text-xl font-bold  text-amber-950 text-right">{message.from_name}</Text>
                                <Text className="text-blue-950 text-right">{message.from}</Text>
                            </View>


                        </ImageBackground>

                    ) : (

                        <>

                            <Text className="text-blue-50 text-sm text-right">
                                {new Date(message.published_at).toDateString()}
                            </Text>
                            {/* Title + Date */}
                            <View className="flex-row items-start mb-3">
                                <Text className={`${getTitleColor(type)} text-xl font-semibold flex-1 pr-2`}>
                                    {message.title}
                                </Text>


                            </View>

                            {/* Image (if exists) */}
                            {message.image_path && (
                                <Image
                                    source={{
                                        uri: `${process.env.EXPO_PUBLIC_STORAGE_URL}/${message.image_path}`,
                                    }}
                                    className="w-full h-56 rounded-xl mb-4"
                                    resizeMode="cover"
                                />
                            )}

                            {/* Body */}
                            <Text className={`${getTitleColor(type)} text-base leading-6`}>
                                {message.body}
                            </Text>
                            <View className="mt-2">
                                <Text className="text-xl font-bold  text-amber-50 text-right">{message.from_name}</Text>
                                <Text className="text-blue-50 text-right">{message.from}</Text>
                            </View>


                        </>

                    )}



                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
