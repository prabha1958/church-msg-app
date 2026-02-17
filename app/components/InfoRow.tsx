import React from "react";
import { Text, View } from "react-native";

type Props = {
    label: string;
    value?: string | number | null;
    isLast?: boolean;
};

export default function InfoRow({ label, value, isLast = false }: Props) {
    return (
        <View
            className={`flex-row px-4 py-3 ${isLast ? "" : "border-b border-[#102a56]"}`}
        >
            <Text className="w-32 text-slate-400">{label}</Text>
            <Text className="flex-1 text-amber-300">
                {value ?? "—"}
            </Text>
        </View>
    );
}

