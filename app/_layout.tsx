import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
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

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,

      // ✅ REQUIRED in newer expo-notifications
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

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


  // ✅ ALWAYS return Stack immediately
  return (
    <>
      <StatusBar style="light" backgroundColor="#272757" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  )


}
