import AppLoader from '@/app/components/AppLoader';
import api from '@/services/api';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';

export default function ViewEvent() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(false)

    const [event, setEvent] = useState<any>(null);

    const fileUrl = (path: string) =>
        `${process.env.EXPO_PUBLIC_STORAGE_URL}/${path}`;

    const loadEvent = async () => {
        setLoading(true)
        const res = await api.get(`/admin/events/${id}/show`);
        setEvent(res.data.data);
        setLoading(false)
    };

    useEffect(() => {
        loadEvent();
    }, []);

    const togglePublish = async () => {
        try {

            if (event.published) {
                setLoading(true)
                await api.patch(`/admin/events/${id}/hide`);
                loadEvent();
                setLoading(false)
            } else {
                setLoading(true)
                await api.patch(`/admin/events/${id}/show`);
                loadEvent();
                setLoading(false)
            }

            loadEvent();
        } catch {
            Alert.alert('Error', 'Failed to update');
        }
    };

    if (!event) return null;

    if (loading) {
        return (
            <AppLoader />
        )
    }

    return (
        <>
            <Stack.Screen options={{ title: '' }} />
            <ScrollView className="p-4">

                <Text className="text-xl font-bold">
                    {event.name_of_event}
                </Text>

                <Text>{event.date_of_event}</Text>

                <Text className="mt-2">{event.description}</Text>

                {/* Photos */}
                <View className="flex-row flex-wrap mt-4 gap-2">
                    {event.event_photos?.map((p: string) => (
                        <Image
                            key={p}
                            source={{ uri: fileUrl(p) }}
                            className="w-24 h-24 rounded"
                        />
                    ))}
                </View>

                {/* Edit */}

                {!event.published && (
                    <Pressable
                        onPress={() => router.push(`/admin/events/edit/${id}`)}
                        className="bg-amber-500 p-3 rounded-xl mt-4"
                    >
                        <Text className="text-white text-center">Edit</Text>
                    </Pressable>
                )}


                {/* Publish */}
                <Pressable
                    onPress={togglePublish}
                    className="bg-blue-600 p-3 rounded-xl mt-3"
                >
                    <Text className="text-white text-center">
                        {event.published ? 'Hide Event' : 'Publish Event'}
                    </Text>
                </Pressable>
            </ScrollView>
        </>
    );
}