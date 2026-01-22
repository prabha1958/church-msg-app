import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
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

  useEffect(() => {
    const sub =
      Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;

        if (data?.type === "message") {
          router.push(`/message/${data.message_id}`);
        }
      });

    return () => sub.remove();
  }, []);


  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
