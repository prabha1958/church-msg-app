import { Ionicons } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
    title: string;
    onMenuPress?: () => void;
};

export default function AppHeader({ title, onMenuPress }: Props) {
    const logo = require("../../assets/images/icon.png");

    return (
        <View className="bg-[#272757] px-4 py-3 flex-row items-center justify-between">

            <TouchableOpacity onPress={onMenuPress}>
                <Ionicons name="menu" size={24} color="white" />
            </TouchableOpacity>

            <Text className="text-xl text-amber-200 font-bold">
                {title}
            </Text>

            <Image
                source={logo}
                style={{ width: 30, height: 30, borderRadius: 15 }}
            />
        </View>
    );
}
