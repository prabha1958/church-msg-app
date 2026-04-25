import AppHeader from '@/app/components/AppHeader';
import AppLoader from '@/app/components/AppLoader';
import FormDateInput from '@/app/components/FormDateInput';
import FormInput from '@/app/components/FormInput';
import FormSelect from '@/app/components/FormSelect';
import ImagePickerInput from '@/app/components/ImagePickerInput';
import api from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';


import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function EditAlliance() {
    const { id } = useLocalSearchParams();
    const [loading, setLoading] = useState(true);
    const router = useRouter()

    const [alliance, setAlliance] = useState<any>(null);
    const [form, setForm] = useState<any>({});
    const [images, setImages] = useState<any>({});

    type RNFile = {
        uri: string;
        name: string;
        type: string;
    };


    const fileUrl = (path?: string | null) => {
        if (!path) return null;
        return `${process.env.EXPO_PUBLIC_STORAGE_URL}/${path}`;
    };

    const loadAlliance = async () => {
        setLoading(true)
        try {
            const res = await api.get(`/admin/alliances/${id}`);
            const data = res.data.data;

            setAlliance(data);
            setForm(data);

            setImages({
                profile_photo: null,
                photo1: null,
                photo2: null,
                photo3: null,

                preview_profile: fileUrl(data.profile_photo),
                preview1: fileUrl(data.photo1),
                preview2: fileUrl(data.photo2),
                preview3: fileUrl(data.photo3),
            });
            setLoading(false)
        } catch {
            alert('Alliance not found');
            setLoading(false)
        }
    };

    useEffect(() => {
        loadAlliance();
    }, []);

    const updateAlliance = async () => {
        setLoading(true);
        try {
            const fd = new FormData();

            // ✅ Fields to skip entirely
            const skipFields = [
                'profile_photo', 'photo1', 'photo2', 'photo3',
                'member',           // 👈 nested object — causes ERR_NETWORK on Android
                'created_at',       // 👈 not needed
                'updated_at',       // 👈 not needed
                'id',               // 👈 already in URL
            ];

            Object.keys(form).forEach((key) => {
                const value = form[key];

                if (skipFields.includes(key)) return;
                if (value === null || value === undefined) return;

                // ✅ Extra safety — skip any remaining objects/arrays
                if (typeof value === 'object') {
                    console.warn(`Skipping object field: ${key}`);
                    return;
                }

                fd.append(key, String(value)); // 👈 always cast to string
            });

            ['profile_photo', 'photo1', 'photo2', 'photo3'].forEach((key) => {
                const img = images[key];
                if (img && img.uri) {
                    fd.append(key, {
                        uri: img.uri,
                        name: 'photo.jpg',
                        type: 'image/jpeg',
                    } as any);
                }
            });

            fd.append('_method', 'PATCH');

            const token = await AsyncStorage.getItem('auth_token');

            const headers: any = {
                Accept: 'application/json',
                Authorization: `Bearer ${token}`,
            };

            if (Platform.OS === 'android') {
                headers['Content-Type'] = 'multipart/form-data';
            }

            await api.post(`/admin/alliances/${id}`, fd, { headers });

            setLoading(false);
            router.replace(`/admin/alliances/view/${id}`);
            alert('Alliance updated');

        } catch (e: any) {
            setLoading(false);
            if (e.response?.status === 422) {
                const errors = e.response.data.errors;
                const msg = Object.values(errors).flat().join('\n');
                alert(msg);
            } else {
                alert(e.response?.data?.message || e.message || 'Update failed');
            }
        }
    };

    if (loading) {
        return <AppLoader />
    }

    if (!alliance) return null;



    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-[#082775] p-4"
        >
            <KeyboardAwareScrollView extraScrollHeight={120} enableOnAndroid>
                <ScrollView className="flex-1 bg-[#082775] p-4">

                    <View className="mb-4">
                        <AppHeader title="Edit Alliance" />
                    </View>

                    <View className="bg-[#5789c2] p-4 rounded-xl mb-4">

                        {/* Images */}
                        <ImagePickerInput
                            label="Profile Photo"
                            imageUri={images.profile_photo?.uri || images.preview_profile}
                            onChange={(img) =>
                                setImages((prev: any) => ({ ...prev, profile_photo: img }))
                            }
                        />

                        <ImagePickerInput
                            label="Photo 1"
                            imageUri={images.photo1?.uri || images.preview1}
                            onChange={(img) =>
                                setImages((prev: any) => ({ ...prev, photo1: img }))
                            }
                        />

                        <ImagePickerInput
                            label="Photo 2"
                            imageUri={images.photo2?.uri || images.preview2}
                            onChange={(img) =>
                                setImages((prev: any) => ({ ...prev, photo2: img }))
                            }
                        />

                        <ImagePickerInput
                            label="Photo 3"
                            imageUri={images.photo3?.uri || images.preview3}
                            onChange={(img) =>
                                setImages((prev: any) => ({ ...prev, photo3: img }))
                            }
                        />

                        {/* Basic */}

                        <FormInput

                            label="Member id"
                            value={form.member_id ? String(form.member_id) : ''}
                            onChangeText={(t) => setForm({ ...form, member_id: t })}
                            placeholder='member id'
                        />

                        <FormSelect
                            label="Alliance Type"
                            value={form.alliance_type}
                            onChange={(value) =>
                                setForm(({ ...form, alliance_type: value }))
                            }
                            items={[
                                { label: 'bride', value: 'bride' },
                                { label: 'bridegroom', value: 'bridegroom' },
                            ]}
                        />



                        <FormInput
                            label="Family Name"
                            value={form.family_name}
                            onChangeText={(t) => setForm({ ...form, family_name: t })}
                            placeholder="Family Name"
                        />

                        <FormInput
                            label="First Name"
                            value={form.first_name}
                            onChangeText={(t) => setForm({ ...form, first_name: t })}
                            placeholder="First Name"
                        />

                        <FormInput
                            label="Last Name"
                            value={form.last_name}
                            onChangeText={(t) => setForm({ ...form, last_name: t })}
                            placeholder="Last Name"
                        />

                        <FormDateInput
                            label="Date of Birth"
                            value={form.date_of_birth}
                            onChangeText={(t) =>
                                setForm({ ...form, date_of_birth: t })
                            }
                        />

                        {/* Family */}
                        <FormInput
                            label="Father Name"
                            value={form.father_name}
                            onChangeText={(t) => setForm({ ...form, father_name: t })}
                            placeholder="Father Name"
                        />

                        <FormInput
                            label="Mother Name"
                            value={form.mother_name}
                            onChangeText={(t) => setForm({ ...form, mother_name: t })}
                            placeholder="Mother Name"
                        />

                        {/* Profession */}
                        <FormInput
                            label="Profession"
                            value={form.profession}
                            onChangeText={(t) => setForm({ ...form, profession: t })}
                            placeholder="Profession"
                        />

                        <FormInput
                            label="Designation"
                            value={form.designation}
                            onChangeText={(t) => setForm({ ...form, designation: t })}
                            placeholder="Designation"
                        />

                        <FormInput
                            label="Company"
                            value={form.company_name}
                            onChangeText={(t) => setForm({ ...form, company_name: t })}
                            placeholder="Company Name"
                        />

                        {/* About */}
                        <FormInput
                            label="About Self"
                            value={form.about_self}
                            onChangeText={(t) => setForm({ ...form, about_self: t })}
                            placeholder="About Self"
                        />

                        <FormInput
                            label="About Family"
                            value={form.about_family}
                            onChangeText={(t) => setForm({ ...form, about_family: t })}
                            placeholder="About Family"
                        />


                        <Pressable
                            onPress={updateAlliance}
                            className="bg-green-600 p-3 rounded-xl mt-3"
                        >
                            {loading ? (
                                <View className="flex-row justify-center items-center">
                                    <ActivityIndicator color="#fff" />
                                    <Text className="text-white ml-2 font-bold">Saving...</Text>
                                </View>
                            ) : (
                                <Text className="text-white text-center font-bold">
                                    Save Changes
                                </Text>
                            )}
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAwareScrollView>
        </KeyboardAvoidingView>
    );
}