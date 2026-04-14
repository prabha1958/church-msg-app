import api from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function MessageDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [message, setMessage] = useState<any>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fileUrl = (path?: string) => {
        if (!path) return null;
        return `${process.env.EXPO_PUBLIC_STORAGE_URL}/${path}`;
    };

    const loadMessage = async () => {
        try {
            const res = await api.get(`/admin/messages/${id}`);
            setMessage(res.data.data);
            setPreview(fileUrl(res.data.data.image_path));
        } catch (e) {
            console.log("Failed to load message");
        }
    };

    useEffect(() => {
        loadMessage();
    }, []);

    const pickImage = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!res.canceled) {
            const asset = res.assets[0];

            const image = {
                uri: asset.uri,
                name: asset.fileName || 'photo.jpg',
                type: 'image/jpeg',
            };

            setPreview(asset.uri);
            setMessage((prev: any) => ({ ...prev, image }));
        }
    };

    const updateMessage = async () => {
        try {
            setLoading(true);

            const fd = new FormData();

            const append = (key: string, value: any) => {
                if (value !== null && value !== undefined && value !== '') {
                    fd.append(key, String(value));
                }
            };

            append('title', message.title);
            append('body', message.body);
            append('from', message.from);
            append('from_name', message.from_name);

            // Laravel PATCH support
            fd.append('_method', 'PUT');

            // ✅ Handle image (Android safe)
            if (message.image) {
                const uri =
                    message.image.uri.startsWith('file://')
                        ? message.image.uri
                        : `file://${message.image.uri}`;

                fd.append('image_path', {
                    uri,
                    name: message.image.name || 'photo.jpg',
                    type: message.image.type || 'image/jpeg',
                } as any);
            }

            // ✅ Use fetch instead of axios
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/admin/messages/${id}/update`,
                {
                    method: 'POST', // Laravel PATCH workaround
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem('auth_token')}`,
                        Accept: 'application/json',
                    },
                    body: fd,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Update failed');
            }

            Alert.alert('Success', 'Message updated');

            router.replace('/admin/messages'); // better than push

        } catch (e: any) {
            console.log('ERROR:', e);
            Alert.alert('Error', e.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const publishMessage = async () => {
        await api.post(`/admin/messages/${id}/send`);
        Alert.alert("Message Published");
        loadMessage();
    };

    const hideMessage = async () => {
        await api.patch(`/admin/messages/${id}/hide`);
        Alert.alert("Message Hidden");
        loadMessage();
    };

    const showMessage = async () => {
        await api.patch(`/admin/messages/${id}/show`);
        Alert.alert("Message Shown");
        loadMessage();
    };

    const isGeneral = message?.message_type === 'general';
    const isPublished = message?.is_published;

    if (!message) return null;

    return (
        <>
            <Stack.Screen options={{ title: '' }} />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 bg-[#082775] p-4"
            >
                <KeyboardAwareScrollView

                    extraScrollHeight={120}
                    enableOnAndroid={true}
                >


                    <View className="flex-1 bg-gray-100 p-4">
                        {preview && (
                            <Image
                                source={{ uri: preview }}
                                className="w-full h-40 rounded-xl mb-3"
                            />
                        )}

                        <Pressable
                            onPress={pickImage}
                            className="bg-gray-300 p-3 rounded-xl mb-3"
                        >
                            <Text className="text-center">Change Image</Text>
                        </Pressable>

                        <TextInput
                            value={message.title}
                            onChangeText={(text) =>
                                setMessage((prev: any) => ({ ...prev, title: text }))
                            }
                            placeholder="Title"
                            className="bg-white p-3 rounded-xl mb-3"
                        />

                        <TextInput
                            value={message.body}
                            multiline
                            numberOfLines={4}
                            onChangeText={(text) =>
                                setMessage((prev: any) => ({ ...prev, body: text }))
                            }
                            placeholder="Body"
                            className="bg-white p-3 rounded-xl mb-3"
                        />

                        <TextInput
                            value={message.from}
                            onChangeText={(text) =>
                                setMessage((prev: any) => ({ ...prev, from: text }))
                            }
                            placeholder="From"
                            className="bg-white p-3 rounded-xl mb-3"
                        />

                        <TextInput
                            value={message.from_name}
                            onChangeText={(text) =>
                                setMessage((prev: any) => ({ ...prev, from_name: text }))
                            }
                            placeholder="From Name"
                            className="bg-white p-3 rounded-xl mb-3"
                        />

                        {isGeneral && (
                            <>
                                {/* Update */}
                                {!isPublished && (
                                    <Pressable
                                        onPress={updateMessage}
                                        className="bg-amber-600 p-4 rounded-xl mb-3"
                                    >
                                        <Text className="text-white text-center font-bold">
                                            {loading ? 'Updating...' : 'Update Message'}
                                        </Text>
                                    </Pressable>
                                )}


                                {/* Publish */}
                                {!isPublished && (
                                    <Pressable
                                        onPress={publishMessage}
                                        className="bg-green-600 p-4 rounded-xl mb-3"
                                    >
                                        <Text className="text-white text-center font-bold">
                                            Publish Message
                                        </Text>
                                    </Pressable>
                                )}

                                {/* Hide / Show */}
                                {isPublished ? (
                                    <Pressable
                                        onPress={hideMessage}
                                        className="bg-red-600 p-4 rounded-xl"
                                    >
                                        <Text className="text-white text-center font-bold">
                                            Hide Message
                                        </Text>
                                    </Pressable>
                                ) : (
                                    <Pressable
                                        onPress={showMessage}
                                        className="bg-blue-600 p-4 rounded-xl"
                                    >
                                        <Text className="text-white text-center font-bold">
                                            Show Message
                                        </Text>
                                    </Pressable>
                                )}
                            </>
                        )}
                    </View>
                </KeyboardAwareScrollView>
            </KeyboardAvoidingView>
        </>
    );
}