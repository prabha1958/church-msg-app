import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function AdminLayout() {
    return (
        <>
            <StatusBar backgroundColor="#272757" />
            <Stack  >
                <Stack.Screen name="index" options={{ title: 'Admin Dashboard' }} />
                <Stack.Screen name="members/add" options={{ title: 'Add Member' }} />
                <Stack.Screen name="messages/send" options={{ title: 'Send Message' }} />
                <Stack.Screen name="subscriptions/index" options={{ title: 'Subscriptions' }} />
                <Stack.Screen name="alliances/index" options={{ title: 'Alliances' }} />
                <Stack.Screen name="[id]" options={{ title: 'Message Details' }} />
            </Stack>
        </>
    );
}