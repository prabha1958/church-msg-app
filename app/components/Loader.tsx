import { ActivityIndicator, View } from "react-native";

type LoaderProps = {
    fullscreen?: boolean;
    size?: "small" | "large";
};

export default function Loader({
    fullscreen = true,
    size = "large",
}: LoaderProps) {
    if (fullscreen) {
        return (
            <View className="flex-1 items-center justify-center bg-white dark:bg-black">
                <ActivityIndicator size={size} color="#0f172a" />
            </View>
        );
    }

    return <ActivityIndicator size={size} color="#0f172a" />;
}
