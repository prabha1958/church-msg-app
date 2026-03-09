import AsyncStorage from "@react-native-async-storage/async-storage";

import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";







export default function RootLayout() {
  const router = useRouter();


  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,   // required
      shouldShowList: true,     // required
      shouldPlaySound: true,    // required
      shouldSetBadge: false,
    }),
  });



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

  useEffect(() => {

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;

        if (data?.id) {
          router.push(`/message/${data.id}`);
        }
      }

    );

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        const data = response.notification.request.content.data;

        if (data?.id) {
          router.push(`/message/${data.id}`);
        }
      }
    });

    return () => subscription.remove();

  }, []);



  // ✅ ALWAYS return Stack immediately
  return (
    <SafeAreaProvider>
      <View className="flex-1 bg-slate-950">

        <StatusBar style="light" backgroundColor="#272757" />
        <Stack screenOptions={{ headerShown: false }} />

      </View>
    </SafeAreaProvider>

  )


}
