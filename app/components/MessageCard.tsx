import { Text, View } from "react-native";

export default function MessageCard({ item }: { item: any }) {
    return (
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
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
    );
}
