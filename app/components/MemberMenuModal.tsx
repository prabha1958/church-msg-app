import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image, Modal, Text, TouchableOpacity, View } from "react-native";






const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.70; // 70% width

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
                        <View className="flex items-center mb-5">
                            <Image
                                source={
                                    member?.profile_photo
                                        ? { uri: `${process.envEXPO_PUBLIC_STORAGE_URL}/${member.profile_photo}` }
                                        : require("../../assets/images/avatar.png")
                                }
                                className="w-20 h-20 rounded-full"
                                resizeMode="contain"

                            />

                        </View>

                        <Text className="text-xl font-semibold text-blue-900 mb-1">
                            {member?.family_name ?? "Member"}  {member?.first_name ?? "Member"}  {member?.last_name ?? "Member"}
                        </Text>

                        <Text className="text-gray-500 mb-6 text-sm font-bold">
                            Member ID: {member?.id ?? "-"}
                        </Text>

                        <TouchableOpacity onPress={() => { onClose(); router.push('/subscription') }} className="mb-9">
                            <Text>Subscription</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { onClose(); router.push('/profile') }} className="mb-9">
                            <Text>Profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { onClose(); router.push('/alliances') }} className="mb-9">
                            <Text>Alliance</Text>
                        </TouchableOpacity>

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