import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { registerForPushNotifications } from "../lib/registerForPush";


export default function LoginScreen() {
    const [memberId, setMemberId] = useState("");
    const [mobile, setMobile] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const pushToken = registerForPushNotifications();





    const handleLogin = async () => {

        if (!memberId || !mobile) {
            Alert.alert("Error", "Please enter Member ID and Mobile Number");
            return;
        }

        setLoading(true);

        try {

            const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/member/login`, {

                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    member_id: memberId,
                    mobile_number: mobile,
                }),

            });

            if (!res.ok) {
                const text = await res.text();
                console.log(text);
                throw new Error("Login failed");
            }
            const data = await res.json();

            if (!res.ok) {
                Alert.alert("Login failed", data.message || "Invalid credentials");
                return;
            }

            // ✅ store token later
            await AsyncStorage.setItem("auth_token", data.token);
            await AsyncStorage.setItem("member", JSON.stringify(data.member));
            await AsyncStorage.setItem("alliance", JSON.stringify(data.alliance))
            const token = await AsyncStorage.getItem('auth_token')

            //   if (pushToken) {
            //     await fetch(`${process.env.EXPO_PUBLIC_API_URL}/device-token`, {
            //       method: "POST",
            //     headers: {
            //       Accept: "application/json",
            //     Authorization: `Bearer ${token}`,
            //   "Content-Type": "application/json",
            // },
            // body: JSON.stringify({
            //   token: pushToken,
            //  }),
            // });
            //  }
            router.replace('/inbox');





            Alert.alert("Success", "Logged in successfully");
        } catch (e) {
            Alert.alert("Error", "Server error");

        } finally {

            setLoading(false);
        }
    };



    return (
        <View className="flex-1 justify-center bg-blue-50 px-6">
            <Text className="text-2xl font-bold text-center mb-8 text-[#272757]">
                Member Login
            </Text>

            <TextInput
                placeholder="Member ID"
                keyboardType="numeric"
                className="border border-gray-300 rounded-lg px-4 py-3 mb-4 bg-white"
                value={memberId}
                onChangeText={setMemberId}
            />

            <TextInput
                placeholder="Mobile Number"
                keyboardType="phone-pad"
                className="border border-gray-300 rounded-lg px-4 py-3 mb-6 bg-white"
                value={mobile}
                onChangeText={setMobile}
            />

            <TouchableOpacity
                className={`py-3 rounded-lg ${loading ? "bg-gray-400" : "bg-[#272757]"
                    }`}
                onPress={handleLogin}
                disabled={loading}
            >
                <Text className="text-white text-center font-semibold text-lg">
                    {loading ? "Logging in..." : "Login"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
