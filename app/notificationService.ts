import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export interface DeviceTokenPayload {
    token: string;
    platform: string;
    deviceId?: string;
}

class NotificationService {
    private token: string | null = null;

    /**
     * Request notification permissions and get push token
     */
    async registerForPushNotifications(): Promise<string | null> {
        if (!Device.isDevice) {
            console.warn('Push notifications only work on physical devices');
            return null;
        }

        try {
            // Check existing permissions
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            // Request permissions if not granted
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            }

            if (finalStatus !== 'granted') {
                console.warn('Notification permission not granted');
                return null;
            }

            // Get the push token
            const tokenData = await Notifications.getExpoPushTokenAsync({
                projectId: 'YOUR_EXPO_PROJECT_ID', // Replace with your Expo project ID from app.json
            });

            this.token = tokenData.data;

            // Android-specific channel configuration
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            return this.token;
        } catch (error) {
            console.error('Error registering for push notifications:', error);
            return null;
        }
    }

    /**
     * Send device token to backend
     */
    async sendTokenToBackend(apiUrl: string, authToken?: string): Promise<boolean> {
        if (!this.token) {
            console.warn('No push token available to send');
            return false;
        }

        try {
            const payload: DeviceTokenPayload = {
                token: this.token,
                platform: Platform.OS,
                deviceId: Device.modelName || undefined,
            };

            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            };

            if (authToken) {
                headers['Authorization'] = `Bearer ${authToken}`;
            }

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`Failed to send token: ${response.status}`);
            }

            console.log('Device token successfully sent to backend');
            return true;
        } catch (error) {
            console.error('Error sending token to backend:', error);
            return false;
        }
    }

    /**
     * Get the current push token
     */
    getToken(): string | null {
        return this.token;
    }

    /**
     * Add listener for notifications received while app is foregrounded
     */
    addNotificationReceivedListener(
        callback: (notification: Notifications.Notification) => void
    ) {
        return Notifications.addNotificationReceivedListener(callback);
    }

    /**
     * Add listener for when user interacts with notification
     */
    addNotificationResponseListener(
        callback: (response: Notifications.NotificationResponse) => void
    ) {
        return Notifications.addNotificationResponseReceivedListener(callback);
    }

    /**
     * Schedule a local notification (for testing)
     */
    async scheduleLocalNotification(title: string, body: string, seconds: number = 1) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
                data: { customData: 'goes here' },
            },
            trigger: {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds,
                repeats: false,
            },
        });
    }
}

export default new NotificationService();
