import AppHeader from '@/app/components/AppHeader';
import MemberMenuModal from '@/app/components/MemberMenuModal';
import api from '@/services/api';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';


interface Event {
    id: number;
    name_of_event: string;
    date_of_event: string;
    published: boolean;
}

export default function Events() {
    const [events, setEvents] = useState<Event[]>([]);
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);


    const loadEvents = async () => {
        const res = await api.get('/admin/events');
        setEvents(res.data.data);
    };

    useEffect(() => {
        loadEvents();
    }, []);



    const refreshMessages = async () => {
        setRefreshing(true);
        await loadEvents();   // your existing API call
        setRefreshing(false);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            loadEvents();

        }, 30000); // every 30 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Stack.Screen options={{ title: '' }} />
            <View className="p-4">

                <View className='mb-4'>
                    <AppHeader title={"Events"} onMenuPress={() => setMenuOpen(true)} />
                </View>
                <MemberMenuModal visible={menuOpen}
                    onClose={() => setMenuOpen(false)} />


                {/* Add Button */}
                <Pressable
                    onPress={() => router.push('/admin/events/add')}
                    className="bg-green-600 p-3 rounded-xl mb-4"
                >
                    <Text className="text-white text-center">+ Add Event</Text>
                </Pressable>

                <FlatList
                    data={events}
                    keyExtractor={(item) => item.id.toString()}
                    refreshing={refreshing}
                    onRefresh={refreshMessages}
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => router.push(`/admin/events/view/${item.id}`)}
                            className="p-3 border-b"
                        >
                            <Text className="font-bold">{item.name_of_event}</Text>
                            <Text>{item.date_of_event}</Text>

                            <Text
                                className={
                                    item.published
                                        ? 'text-green-600'
                                        : 'text-red-600'
                                }
                            >
                                {item.published ? 'Published' : 'Not Published'}
                            </Text>
                        </Pressable>
                    )}
                />
            </View>
        </>
    );
}