import AppHeader from '@/app/components/AppHeader';
import FormDateInput from '@/app/components/FormDateInput';
import MemberMenuModal from '@/app/components/MemberMenuModal';
import api from '@/services/api';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
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

export default function AddEvent() {
    const router = useRouter();

    const [form, setForm] = useState({
        name_of_event: '',
        description: '',
        date_of_event: '',
    });

    const [images, setImages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    // 📸 Pick multiple images
    const pickImages = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true, // 🔥 IMPORTANT
            quality: 0.7,
        });

        if (!res.canceled) {
            const selected = res.assets;

            if (images.length + selected.length > 6) {
                Alert.alert('Max 6 images allowed');
                return;
            }

            const mapped = selected.map((a) => ({
                uri: a.uri,
                name: 'photo.jpg',
                type: 'image/jpeg',
            }));

            setImages([...images, ...mapped]);
        }
    };

    // ❌ Remove image
    const removeImage = (index: number) => {
        const updated = [...images];
        updated.splice(index, 1);
        setImages(updated);
    };

    // 🚀 Submit
    const submitEvent = async () => {
        setLoading(true);

        try {
            const fd = new FormData();

            fd.append('name_of_event', form.name_of_event);
            fd.append('description', form.description);
            fd.append('date_of_event', form.date_of_event);

            images.forEach((img) => {
                fd.append('event_photos[]', img);
            });

            await api.post('/admin/events', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            Alert.alert('Success', 'Event created');

            router.replace('/admin/events');
        } catch (e: any) {
            if (e.response?.data?.errors) {
                const errors = e.response.data.errors;

                const msg = Object.values(errors)
                    .map((err: any) => err[0])
                    .join('\n');

                Alert.alert('Validation Error', msg);
            } else {
                Alert.alert('Error', 'Failed to create event');
            }
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
                <ScrollView className="p-4 bg-white">

                    <View className='mb-4'>
                        <AppHeader title={"Add Event"} onMenuPress={() => setMenuOpen(true)} />
                    </View>
                    <MemberMenuModal visible={menuOpen}
                        onClose={() => setMenuOpen(false)} />

                    <Text className="text-xl font-bold mb-4">
                        Add Event
                    </Text>

                    {/* Name */}
                    <Text>Name of Event</Text>
                    <TextInput
                        className="border p-3 rounded-xl mb-3"
                        value={form.name_of_event}
                        onChangeText={(t) =>
                            setForm({ ...form, name_of_event: t })
                        }
                    />

                    {/* Date */}
                    <FormDateInput
                        label="Event Date"
                        value={form.date_of_event}
                        onChangeText={(text) =>
                            setForm(prev => ({ ...prev, date_of_event: text }))
                        }
                    />



                    {/* Description */}
                    <Text>Description</Text>
                    <TextInput
                        multiline
                        className="border p-3 rounded-xl mb-3"
                        value={form.description}
                        onChangeText={(t) =>
                            setForm({ ...form, description: t })
                        }
                    />

                    {/* 📸 Image Picker */}
                    <Pressable
                        onPress={pickImages}
                        className="bg-gray-300 p-3 rounded-xl mb-3"
                    >
                        <Text>Select Photos</Text>
                    </Pressable>

                    {/* Preview Grid */}
                    <View className="flex-row flex-wrap gap-2">
                        {images.map((img, idx) => (
                            <View key={idx} style={{ position: 'relative' }}>
                                <Image
                                    source={{ uri: img.uri }}
                                    style={{ width: 100, height: 100, borderRadius: 8 }}
                                />

                                {/* Remove Button */}
                                <Pressable
                                    onPress={() => removeImage(idx)}
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

                    {/* Submit */}
                    <Pressable
                        onPress={submitEvent}
                        className="bg-green-600 p-4 rounded-xl mt-5"
                    >
                        {loading ? (
                            <View className="flex-row justify-center items-center">
                                <ActivityIndicator color="#fff" />
                                <Text className="text-white ml-2 font-bold">Creating Event...</Text>
                            </View>
                        ) : (
                            <Text className="text-white text-center font-bold">
                                Create Event
                            </Text>
                        )}
                    </Pressable>

                    <View className="h-20" />
                </ScrollView>
            </KeyboardAvoidingView>
        </>
    );
}