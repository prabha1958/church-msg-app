import api from '@/services/api';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
            setPreview(asset.uri);
            setMessage((prev: any) => ({ ...prev, image: asset }));
        }
    };

    const updateMessage = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('title', message.title);
            formData.append('body', message.body);
            formData.append('from', message.from);
            formData.append('from_name', message.from_name);

            if (message.image) {
                formData.append('image_path', {
                    uri: message.image.uri,
                    name: 'photo.jpg',
                    type: 'image/jpeg',
                } as any);
            }

            await api.put(`/admin/messages/${id}/update`, formData);

            Alert.alert("Updated");
            router.push('/admin/messages')
            loadMessage();
        } catch (e: any) {
            Alert.alert("Update failed");

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
    );
}