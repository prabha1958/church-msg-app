import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, Modal, Text, TouchableOpacity, View } from "react-native";





const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.75; // 75% width

type Member = {
    id?: number;
    first_name?: string;
    family_name?: string;
    last_name?: string;
    profile_photo?: string;
};

export default function MemberMenuModal({
    visible,
    onClose,
}: {
    visible: boolean;
    onClose: () => void;
}) {
    const router = useRouter();
    const translateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
    const [member, setMember] = useState<Member | null>(null);
    const PROFILE_BASE_URL = "http://192.168.1.82:8000/storage";

    // Load member when modal opens
    useEffect(() => {
        if (!visible) return;

        const loadMember = async () => {
            const stored = await AsyncStorage.getItem("member");
            if (stored) setMember(JSON.parse(stored));
        };

        loadMember();

        Animated.timing(translateX, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [visible]);



    // Close animation
    const closeDrawer = () => {
        Animated.timing(translateX, {
            toValue: -DRAWER_WIDTH,
            duration: 200,
            useNativeDriver: true,
        }).start(() => onClose());
    };

    const logout = async () => {
        await AsyncStorage.multiRemove(["auth_token", "member"]);
        closeDrawer();
        router.replace("/login");
    };

    if (!visible) return null;

    return (
        <Modal transparent animationType="none" visible={visible}>
            <View className="flex-1 flex-row bg-black/40">

                {/* Drawer */}
                <Animated.View
                    style={{ transform: [{ translateX }] }}
                    className="bg-white h-full px-6 py-40"
                // width must be inline style
                >
                    <View style={{ width: DRAWER_WIDTH }}>
                        <View className="flex items-center">
                            <Image
                                source={
                                    member?.profile_photo
                                        ? { uri: `${PROFILE_BASE_URL}/${member.profile_photo}` }
                                        : require("../../assets/images/avatar.png")
                                }
                                className="w-20 h-20"
                                resizeMode="contain"

                            />

                        </View>

                        <Text className="text-xl font-semibold text-[#272757] mb-1">
                            {member?.family_name ?? "Member"}  {member?.first_name ?? "Member"}  {member?.last_name ?? "Member"}
                        </Text>

                        <Text className="text-gray-500 mb-6">
                            Member ID: {member?.id ?? "-"}
                        </Text>

                        <TouchableOpacity
                            onPress={logout}
                            className="bg-red-600 py-3 rounded-lg mb-3"
                        >
                            <Text className="text-white text-center font-semibold">
                                Logout
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                {/* Click outside to close */}
                <TouchableOpacity
                    className="flex-1"
                    activeOpacity={1}
                    onPress={closeDrawer}
                />
            </View>
        </Modal>
    );
}