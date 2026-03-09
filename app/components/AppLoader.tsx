import { ActivityIndicator, Image, View } from "react-native";

export default function AppLoader() {
    return (
        <View className="flex-1 items-center justify-center bg-[#191970]">
            <View className="p-6 rounded-full bg-white/10">
                <Image
                    source={require("../../assets/images/icon.png")}
                    className="w-28 h-28"
                    resizeMode="contain"
                />
            </View>

            <ActivityIndicator size="large" color="#cee612" className="mt-6" />
        </View>
    );
}