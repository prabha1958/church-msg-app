import FormDateInput from '@/app/components/FormDateInput';
import api from '@/services/api';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function EditEvent() {
    const { id } = useLocalSearchParams();
    const router = useRouter();

    const [form, setForm] = useState<any>({});
    const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
    const [newPhotos, setNewPhotos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fileUrl = (path: string) =>
        `${process.env.EXPO_PUBLIC_STORAGE_URL}/${path}`;

    // 📥 Load Event
    const loadEvent = async () => {
        const res = await api.get(`/admin/events/${id}/show`);
        const data = res.data.data;

        setForm(data);
        setExistingPhotos(data.event_photos || []);
    };

    useEffect(() => {
        loadEvent();
    }, []);

    // 📸 Pick new images
    const pickImages = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.7,
        });

        if (!res.canceled) {
            const selected = res.assets;

            if (existingPhotos.length + newPhotos.length + selected.length > 6) {
                Alert.alert('Maximum 6 photos allowed');
                return;
            }

            const mapped = selected.map((a) => ({
                uri: a.uri,
                name: 'photo.jpg',
                type: 'image/jpeg',
            }));

            setNewPhotos([...newPhotos, ...mapped]);
        }
    };

    // ❌ Remove existing photo (API)
    const removeExistingPhoto = async (path: string) => {
        try {
            const res = await api.delete(
                `/admin/events/${id}/photo`,
                { data: { photo_path: path } }
            );

            setExistingPhotos(res.data.event.event_photos);
        } catch {
            Alert.alert('Error', 'Failed to remove photo');
        }
    };

    // ❌ Remove new photo (local)
    const removeNewPhoto = (index: number) => {
        const updated = [...newPhotos];
        updated.splice(index, 1);
        setNewPhotos(updated);
    };

    // 🚀 Submit
    const updateEvent = async () => {
        setLoading(true);

        try {
            const fd = new FormData();

            Object.keys(form).forEach((key) => {
                if (!form[key]) return;

                if (key === 'event_photos') return;

                fd.append(key, form[key]);
            });

            // append new photos
            if (newPhotos.length) {
                newPhotos.forEach((img) => {
                    fd.append('event_photos[]', img);
                });

                fd.append('append_photos', '1');
            }

            fd.append('_method', 'PATCH');

            await api.post(`/admin/events/${id}`, fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            Alert.alert('Success', 'Event updated');

            router.replace(`/admin/events/view/${id}`);

        } catch (e: any) {
            if (e.response?.data?.errors) {
                const msg = Object.values(e.response.data.errors)
                    .map((err: any) => err[0])
                    .join('\n');

                Alert.alert('Validation Error', msg);
            } else {
                Alert.alert('Error', 'Update failed');
            }
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

            <ScrollView className="p-4 bg-white">

                <Text className="text-xl font-bold mb-4">
                    Edit Event
                </Text>

                {/* Existing Photos */}
                <Text className="font-bold mb-2">Existing Photos</Text>
                <View className="flex-row flex-wrap gap-2">
                    {existingPhotos.map((p) => (
                        <View key={p} style={{ position: 'relative' }}>
                            <Image
                                source={{ uri: fileUrl(p) }}
                                style={{ width: 100, height: 100, borderRadius: 8 }}
                            />

                            <Pressable
                                onPress={() => removeExistingPhoto(p)}
                                style={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 5,
                                    backgroundColor: 'red',
                                    padding: 4,
                                    borderRadius: 10,
                                }}
                            >
                                <Text style={{ color: 'white' }}>✕</Text>
                            </Pressable>
                        </View>
                    ))}
                </View>

                {/* New Photos */}
                <Text className="font-bold mt-4">New Photos</Text>
                <View className="flex-row flex-wrap gap-2">
                    {newPhotos.map((img, idx) => (
                        <View key={idx} style={{ position: 'relative' }}>
                            <Image
                                source={{ uri: img.uri }}
                                style={{ width: 100, height: 100, borderRadius: 8 }}
                            />

                            <Pressable
                                onPress={() => removeNewPhoto(idx)}
                                style={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 5,
                                    backgroundColor: 'red',
                                    padding: 4,
                                    borderRadius: 10,
                                }}
                            >
                                <Text style={{ color: 'white' }}>✕</Text>
                            </Pressable>
                        </View>
                    ))}
                </View>

                {/* Pick Images */}
                <Pressable
                    onPress={pickImages}
                    className="bg-gray-300 p-3 rounded-xl mt-3"
                >
                    <Text>Select More Photos</Text>
                </Pressable>

                {/* Form Fields */}
                <Text className="mt-4">Name</Text>
                <TextInput
                    value={form.name_of_event}
                    onChangeText={(t) =>
                        setForm({ ...form, name_of_event: t })
                    }
                    className="border p-3 rounded-xl mb-2"
                />

                <Text>Date</Text>

                <FormDateInput
                    label="Event Date"
                    value={form.date_of_event}
                    onChangeText={(t) =>
                        setForm({ ...form, date_of_event: t })
                    }
                />


                <Text>Description</Text>
                <TextInput
                    multiline
                    value={form.description}
                    onChangeText={(t) =>
                        setForm({ ...form, description: t })
                    }
                    className="border p-3 rounded-xl mb-3"
                />

                {/* Submit */}
                <Pressable
                    onPress={updateEvent}
                    className="bg-green-600 p-4 rounded-xl"
                >
                    <Text className="text-white text-center">
                        {loading ? 'Updating...' : 'Update Event'}
                    </Text>
                </Pressable>

                <View className="h-20" />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}