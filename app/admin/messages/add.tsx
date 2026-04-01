import api from '@/services/api';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
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
            setPreview(asset.uri);
            setForm((prev) => ({ ...prev, image: asset }));
        }
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('body', form.body);
            formData.append('from', form.from);
            formData.append('from_name', form.from_name);
            formData.append('message_type', 'general');

            if (form.image) {
                formData.append('image_path', {
                    uri: form.image.uri,
                    name: 'photo.jpg',
                    type: 'image/jpeg',
                } as any);
            }

            await api.post('/admin/messages', formData);

            Alert.alert('Success', 'Message created successfully');

            // Reset form
            setForm({
                title: '',
                body: '',
                from: '',
                from_name: '',
                image: null,
            });
            setPreview(null);

            router.push('/admin/messages');

        } catch (e: any) {
            console.log(e.response?.data || e.message);
            Alert.alert('Error', 'Failed to create message');
        } finally {
            setLoading(false);
        }
    };

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
    );
}