import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "../global.css";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");

        if (token) {
          router.replace("/inbox");
        } else {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      }
    };

    checkAuth();
  }, []);

  // ✅ ALWAYS return Stack immediately
  return (
    <>
      <StatusBar style="light" backgroundColor="#272757" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  )


}
