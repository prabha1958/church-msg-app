import { router } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

const STORAGE = process.env.EXPO_PUBLIC_STORAGE_URL;


type AllianceCardProps = {
    alliance: {
        id: number;
        first_name: string;
        middle_name?: string;
        last_name?: string;
        alliance_type: string;
        profile_photo?: string | null;
        profession: string;
        place_of_working: string;
        age: number;
    };
    member: {
        member_name: string;
    };
};

export default function AllianceCard({
    alliance,
    member,
}: AllianceCardProps) {
    const fullName = [alliance.first_name, alliance.middle_name, alliance.last_name]
        .filter(Boolean)
        .join(" ");

    console.log(alliance.id)

    return (
        <Pressable
            onPress={() =>
                router.push({
                    pathname: "/alliance/[id]",
                    params: { id: alliance.id },
                })
            }
            className="bg-[#071633] rounded-xl mb-4 overflow-hidden border border-[#102a56]"
        >
            <View className="flex-row p-3">
                {/* Profile Photo */}
                <Image
                    source={
                        alliance.profile_photo
                            ? { uri: `${STORAGE}/${alliance.profile_photo}` }
                            : require("../../assets/images/avatar.png")
                    }
                    style={{ width: 72, height: 72 }}
                    className="rounded-lg"
                    resizeMode="cover"
                />

                {/* Info */}
                <View className="flex-1 ml-3">
                    <Text className="text-amber-400 font-bold text-lg">
                        {fullName}
                    </Text>

                    <Text className="text-slate-300 text-sm">
                        {alliance.alliance_type} • {alliance.age} yrs
                    </Text>

                    <Text className="text-slate-400 text-sm mt-1">
                        {alliance.profession} — {alliance.place_of_working}
                    </Text>

                    <Text className="text-slate-500 text-xs mt-1">
                        Posted by: {member.member_name}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
}
