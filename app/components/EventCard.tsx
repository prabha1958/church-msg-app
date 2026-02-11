import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function EventCard({ item }: { item: any }) {
    const router = useRouter();



    return (
        <TouchableOpacity
            onPress={() => router.push(`/event/${item.id}`)}
        >
            <View className="flex flex-row gap-4 bg-[#6f7d05] rounded-xl p-4 mb-3 shadow-sm">

                {/* Photo */}
                <Image
                    source={
                        item.event_photos?.length > 0
                            ? { uri: `${process.env.EXPO_PUBLIC_STORAGE_URL}/${item.event_photos[0]}` }
                            : require("../../assets/images/avatar.png")
                    }
                    className="w-20 h-20 rounded-lg"
                    resizeMode="cover"
                />

                {/* Text */}
                <View className="flex-1">
                    <Text className="text-base font-semibold text-[#defaec]">
                        {item.name_of_event}
                    </Text>

                    <Text className="text-xs text-[#b6e6cc] mt-1">
                        {new Date(item.date_of_event).toDateString()}
                    </Text>

                    <Text
                        numberOfLines={2}
                        className="text-sm text-[#defaec] mt-2"
                    >
                        {item.description}
                    </Text>
                </View>

            </View>
        </TouchableOpacity>
    );
}
