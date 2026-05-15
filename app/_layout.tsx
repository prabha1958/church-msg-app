import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

export default function RootLayout() {

  const router = useRouter();

  // ✅ Notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  // ✅ Android channel
  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("church", {
        name: "Church Notifications",
        importance: Notifications.AndroidImportance.MAX,

      });
    }
  }, []);



  // ✅ Bell sound
  const playBell = async () => {
    try {

      const { sound } = await Audio.Sound.createAsync(
        require('@/assets/sounds/church_bell.mp3')
      );

      await sound.playAsync();

    } catch (e) {
      console.log('Bell sound error:', e);
    }
  };

  // ✅ Auth check
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

  // ✅ Play bell when notification received
  useEffect(() => {

    const receivedSubscription =
      Notifications.addNotificationReceivedListener(
        async () => {
          await playBell();
        }
      );

    return () => {
      receivedSubscription.remove();
    };

  }, []);

  // ✅ Handle notification click
  useEffect(() => {

    const responseSubscription =
      Notifications.addNotificationResponseReceivedListener(
        (response) => {

          const data =
            response.notification.request.content.data;

          if (data?.id) {
            router.push(`/message/${data.id}`);
          }
        }
      );

    Notifications.getLastNotificationResponseAsync()
      .then((response) => {

        if (response) {

          const data =
            response.notification.request.content.data;

          if (data?.id) {
            router.push(`/message/${data.id}`);
          }
        }
      });

    return () => {
      responseSubscription.remove();
    };
  }, []);









  return (
    <SafeAreaProvider>

      <View className="flex-1 bg-slate-950">

        <StatusBar
          style="dark"
          backgroundColor="#272757"
        />

        <Stack screenOptions={{ headerShown: false }} />

      </View>

    </SafeAreaProvider>
  );
}