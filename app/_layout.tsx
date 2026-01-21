import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import "../global.css";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("auth_token");

      if (token) {
        router.replace("/inbox");
      } else {
        router.replace("/login");
      }
    };

    checkLogin();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
