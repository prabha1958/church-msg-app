import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
    if (!Device.isDevice) {
        console.log("Must use physical device");
        return null;
    }

    const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== "granted") {
        console.log("Notification permission denied");
        return null;
    }

    const projectId =
        Constants.expoConfig?.extra?.eas?.projectId ||
        Constants.easConfig?.projectId;

    if (!projectId) {
        console.log("Project ID missing");
        return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
    });

    if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            sound: "default",
        });
    }

    console.log("Expo Push Token:", tokenData.data);

    return tokenData.data;
}
