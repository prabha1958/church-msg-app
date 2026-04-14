import AppHeader from '@/app/components/AppHeader';
import MemberMenuModal from '@/app/components/MemberMenuModal';
import api from '@/services/api';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';

export default function MessagesList() {
    const router = useRouter();
    const [messages, setMessages] = useState<any[]>([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const loadMessages = async () => {
        try {
            const res = await api.get('/admin/messages');
            setMessages(res.data.data);
        } catch (e) {
            console.log("Failed to load messages");
        }
    };

    useEffect(() => {
        loadMessages();
    }, []);


    useEffect(() => {
        const interval = setInterval(() => {
            loadMessages();

        }, 30000); // every 30 seconds

        return () => clearInterval(interval);
    }, []);

    const refreshMessages = async () => {
        setRefreshing(true);
        await loadMessages();   // your existing API call
        setRefreshing(false);
    };

    const fileUrl = (path?: string | null): string => {
        if (!path) {
            return 'https://via.placeholder.com/100'; // fallback image
        }

        return `${process.env.EXPO_PUBLIC_STORAGE_URL}/${path}`;
    };

    const MessageCard = ({ item }: any) => (
        <Pressable
            onPress={() => router.push(`/admin/messages/${item.id}`)}
            className="bg-white p-4 rounded-2xl mb-3 shadow-sm"
        >
            <View className="flex-row">
                {item.image_path && (
                    <Image
                        source={{ uri: fileUrl(item.image_path) }}
                        className="w-16 h-16 rounded-xl mr-3"
                    />
                )}

                <View className="flex-1">
                    <Text className="font-bold text-lg">{item.title}</Text>

                    <Text numberOfLines={2} className="text-gray-600">
                        {item.body}
                    </Text>

                    <View className="flex-row justify-between items-center mt-2">
                        <Text className="text-gray-400 text-xs">
                            {item.published_at ?? 'Not published'}
                        </Text>

                        <View
                            className={`px-2 py-1 rounded-full ${item.is_published ? 'bg-green-100' : 'bg-amber-100'
                                }`}
                        >
                            <Text
                                className={`text-xs ${item.is_published ? 'text-green-700' : 'text-amber-700'
                                    }`}
                            >
                                {item.is_published ? 'Published' : 'Draft'}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    );

    return (
        <>
            <Stack.Screen options={{ title: '' }} />
            <View className="flex-1 bg-gray-100 p-4">

                <View className='mb-4'>
                    <AppHeader title={"Messages from Church"} onMenuPress={() => setMenuOpen(true)} />
                </View>
                <MemberMenuModal visible={menuOpen}
                    onClose={() => setMenuOpen(false)} />
                <View className="flex-row justify-between mb-4"></View>
                {/* Add Message Button */}
                <Pressable
                    onPress={() => router.push('/admin/messages/add')}
                    className="bg-blue-600 p-3 rounded-xl mb-4"
                >
                    <Text className="text-white text-center font-bold">
                        + Add Message
                    </Text>
                </Pressable>

                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <MessageCard item={item} />}
                    refreshing={refreshing}
                    onRefresh={refreshMessages}
                />
            </View>
        </>
    );
}