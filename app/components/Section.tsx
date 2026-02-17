import React from "react";
import { Text, View } from "react-native";

type Props = {
    title: string;
    text: string;
};

export default function Section({ title, text }: Props) {
    if (!text) return null;

    return (
        <View className="mt-5">
            <Text className="text-amber-400 font-semibold">{title}</Text>
            <Text className="text-slate-300 mt-1">{text}</Text>
        </View>
    );
}

