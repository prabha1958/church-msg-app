import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function MessageCard({ item }: { item: any }) {

    const router = useRouter();
    const type = String(item.message_type || "general").toLowerCase();

    function getContainerBg(type: string) {
        switch (type) {
            case "birthday":
                return "bg-purple-700";
            case "anniversary":
                return "bg-emerald-700";
            case "changes":
                return "bg-amber-950";
            case "otp":
                return "bg-red-600";
            default:
                return "bg-[#071633]";
        }
    }

    function getTitleColor(type: string) {
        switch (type) {
            case "changes":
                return "text-amber-300";
            default:
                return "text-white";
        }
    }

    function getBodyColor(type: string) {
        switch (type) {
            case "changes":
                return "text-amber-300";
            case "birthday":
                return "text-purple-100";
            case "anniversary":
                return "text-emerald-100";
            case "otp":
                return "text-red-100";
            default:
                return "text-slate-300";
        }
    }

    return (

        <TouchableOpacity
            onPress={() => router.push(`/message/${item.id}`)}

        >

            <View className={`${getContainerBg(type)} rounded-xl p-4 mb-3 shadow-sm`}>

                <Text className="text-xs text-gray-400 text-right">
                    {new Date(item.published_at).toDateString()}
                </Text>



                {item.image_path &&
                    <Image
                        source={
                            item?.image_path
                                ? { uri: `${process.env.EXPO_PUBLIC_STORAGE_URL}/${item.image_path}` }
                                : require("../../assets/images/avatar.png")
                        }
                        className="w-20 h-20"
                        resizeMode="contain"

                    />
                }

                <Text className={`${getTitleColor(type)} font-semibold text-base mb-1`}>
                    {item.title}
                </Text>

                <Text
                    className={`${getBodyColor(type)} text-sm mb-2`}
                    numberOfLines={2}
                >
                    {item.body}
                </Text>


            </View>
        </TouchableOpacity>
    );
}
