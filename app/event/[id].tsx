import { apiFetch } from "@/lib/api";
import { formatDate } from "@/utils/date";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import AppLoader from "../components/AppLoader";
import MemberMenuModal from "../components/MemberMenuModal";

export default function EventDetail() {
    const params = useLocalSearchParams<{ id?: string | string[] }>();
    const [data, setData] = useState<any>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [viewerVisible, setViewerVisible] = useState(false);
    const pastorId =
        typeof params.id === "string"
            ? params.id
            : Array.isArray(params.id)
                ? params.id[0]
                : null;

    const fileUrl = (path?: string | null) =>
        path
            ? `${process.env.EXPO_PUBLIC_STORAGE_URL}/${path}`
            : undefined;


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
            <AppLoader />
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
                <Text className="mt-4 font-bold text-gray-50">Photos</Text>

                <View className="flex-row gap-2 mt-2 flex-wrap">
                    {data.event_photos.map((photo: string, index: number) =>
                        photo ? (
                            <Pressable
                                key={index}
                                onPress={() => {
                                    const url = fileUrl(photo);

                                    if (url) {
                                        setSelectedImage(url);
                                        setViewerVisible(true);
                                    }
                                }}
                            >
                                <Image
                                    source={{ uri: fileUrl(photo) }}
                                    className="w-24 h-24 rounded"
                                />
                            </Pressable>
                        ) : null
                    )}

                    <Modal visible={!!selectedImage} transparent>
                        <Pressable
                            onPress={() => setSelectedImage(null)}
                            style={{
                                flex: 1,
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Image
                                source={{ uri: selectedImage! }}
                                style={{
                                    width: Dimensions.get('window').width,
                                    height: Dimensions.get('window').height * 0.7,
                                    resizeMode: 'contain',
                                }}
                            />
                        </Pressable>
                    </Modal>

                </View>




                <Text className="text-sm text-gray-300 text-right">click to view photo</Text>

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
