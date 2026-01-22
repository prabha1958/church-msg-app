import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function MessageCard({ item }: { item: any }) {

    const PROFILE_BASE_URL = "http://192.168.1.82:8000/storage";
    const router = useRouter();



    return (

        <TouchableOpacity
            onPress={() => router.push(`/message/${item.id}`)}

        >
            <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                {item.image_path &&
                    <Image
                        source={
                            item?.image_path
                                ? { uri: `${PROFILE_BASE_URL}/${item.image_path}` }
                                : require("../../assets/images/avatar.png")
                        }
                        className="w-20 h-20"
                        resizeMode="contain"

                    />
                }
                <Text className="text-[#1E1E3F] font-semibold text-base mb-1">
                    {item.title}
                </Text>

                <Text
                    className="text-gray-600 text-sm mb-2"
                    numberOfLines={3}
                >
                    {item.body}
                </Text>

                <Text className="text-xs text-gray-400">
                    {new Date(item.published_at).toDateString()}
                </Text>
            </View>
        </TouchableOpacity>
    );
}
