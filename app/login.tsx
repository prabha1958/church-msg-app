import { registerForPushNotificationsAsync } from "@/services/registerForPushNotificationsAsync";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, ImageBackground, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";



export default function LoginScreen() {
    const [memberId, setMemberId] = useState("");
    const [mobile, setMobile] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();


    const bgImage = require("../assets/images/loginbg.png");
    const logo = require("../assets/images/icon.png");



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


            const data = await res.json();



            if (!res.ok) {
                Alert.alert("Login failed", data.message || "Invalid credentials");
                return;
            }

            await AsyncStorage.setItem("auth_token", data.token);
            await AsyncStorage.setItem("member", JSON.stringify(data.member));
            await AsyncStorage.setItem("alliance", JSON.stringify(data.alliance));
            await AsyncStorage.setItem("member_role", JSON.stringify(data.member.role));


            const authToken = data.token;


            const token = await registerForPushNotificationsAsync();


            if (token) {
                const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/device-token`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });

            }



            router.replace("/inbox");






        } catch (e: any) {
            console.log("LOGIN ERROR =", e);
            Alert.alert(
                "Error",
                e?.message || "Something went wrong. Please check your connection and try again."
            );
        } finally {
            setLoading(false);
        }
    };



    return (


        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                source={bgImage}
                resizeMode="cover"
                style={{ flex: 1 }}
            >
                <View flex-1 className="flex items-center mt-8">
                    <Image
                        source={logo}
                        style={{ width: 80, height: 80, borderRadius: 15 }}
                        alt="logo"
                        className="rounded-full "

                    />

                </View>

                <View className="flex-1  px-6 mt-10">

                    <Text className="text-2xl font-bold text-center mb-8 text-[#cee612]">
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
                        className={`py-3 rounded-lg ${loading ? "bg-gray-400" : "bg-[#576109]"
                            }`}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text className="text-white text-center font-semibold text-lg">
                            {loading ? "Logging in..." : "Login"}
                        </Text>
                    </TouchableOpacity>

                </View>
            </ImageBackground>
        </SafeAreaView>


    );
}