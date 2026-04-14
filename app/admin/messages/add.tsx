import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function AddMessage() {
    const router = useRouter();

    const [form, setForm] = useState({
        title: '',
        body: '',
        from: '',
        from_name: '',
        image: null as any,
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

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
                type: asset.type === 'image' ? 'image/jpeg' : 'image/jpeg',
            };

            setPreview(asset.uri);
            setForm((prev) => ({ ...prev, image }));
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const fd = new FormData();

            // append text fields safely
            const append = (key: string, value: any) => {
                if (value !== null && value !== undefined && value !== '') {
                    fd.append(key, String(value));
                }
            };

            append('title', form.title);
            append('body', form.body);
            append('from', form.from);
            append('from_name', form.from_name);
            append('message_type', 'general');

            if (form.image) {
                const uri =
                    form.image.uri.startsWith('file://')
                        ? form.image.uri
                        : `file://${form.image.uri}`;

                fd.append('image_path', {
                    uri,
                    name: form.image.name || 'photo.jpg',
                    type: form.image.type || 'image/jpeg',
                } as any);
            }

            // 🔥 IMPORTANT: use fetch instead of axios for image upload
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/admin/messages`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem('auth_token')}`,
                        Accept: 'application/json',
                        // ❌ DO NOT set Content-Type
                    },
                    body: fd,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Upload failed');
            }

            Alert.alert('Success', 'Message created');

            router.replace('/admin/messages');

        } catch (e: any) {
            console.log('ERROR:', e);
            Alert.alert('Error', e.message);
        } finally {
            setLoading(false);
        }
    };

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
                        {/* Image Preview */}
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
                            <Text className="text-center">Upload Image</Text>
                        </Pressable>

                        <TextInput
                            placeholder="Message Title"
                            value={form.title}
                            onChangeText={(text) =>
                                setForm((prev) => ({ ...prev, title: text }))
                            }
                            className="bg-white p-3 rounded-xl mb-3"
                        />

                        <TextInput
                            placeholder="Message Body"
                            value={form.body}
                            multiline
                            textAlignVertical="top"
                            onChangeText={(text) =>
                                setForm((prev) => ({ ...prev, body: text }))
                            }
                            className="bg-white p-3 rounded-xl mb-3 h-32"
                        />

                        <TextInput
                            placeholder="Message From"
                            value={form.from}
                            onChangeText={(text) =>
                                setForm((prev) => ({ ...prev, from: text }))
                            }
                            className="bg-white p-3 rounded-xl mb-3"
                        />

                        <TextInput
                            placeholder="Message By"
                            value={form.from_name}
                            onChangeText={(text) =>
                                setForm((prev) => ({ ...prev, from_name: text }))
                            }
                            className="bg-white p-3 rounded-xl mb-3"
                        />

                        <Pressable
                            onPress={handleSubmit}
                            className="bg-blue-600 p-4 rounded-xl"
                        >
                            <Text className="text-white text-center font-bold">
                                {loading ? 'Saving...' : 'Create Message'}
                            </Text>
                        </Pressable>
                    </View>
                </KeyboardAwareScrollView>
            </KeyboardAvoidingView>
        </>
    );
}