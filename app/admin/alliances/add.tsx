import AppHeader from '@/app/components/AppHeader';
import FormDateInput from '@/app/components/FormDateInput';
import FormInput from '@/app/components/FormInput';
import FormSelect from '@/app/components/FormSelect';
import ImagePickerInput from '@/app/components/ImagePickerInput';
import MemberMenuModal from '@/app/components/MemberMenuModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function AddAlliance() {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState<any>({
        member_id: '',
        alliance_type: '',
        family_name: '',
        first_name: '',
        last_name: '',
        date_of_birth: '',
        father_name: '',
        mother_name: '',
        father_occupation: '',
        mother_occupation: '',
        educational_qualifications: '',
        profession: '',
        designation: '',
        company_name: '',
        place_of_working: '',
        about_self: '',
        about_family: '',
    });

    const [images, setImages] = useState<any>({
        profile_photo: null,
        photo1: null,
        photo2: null,
        photo3: null,
    });


    const pickImage = async (key: string) => {
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!res.canceled) {
            const asset = res.assets[0];

            const image = {
                uri: asset.uri,
                name: asset.fileName || `${key}.jpg`,
                type: 'image/jpeg',
            };

            setImages((prev: any) => ({
                ...prev,
                [key]: image,
            }));
        }
    };

    const submitAlliance = async () => {
        try {
            setLoading(true);

            const fd = new FormData();

            // 🔥 Type guard
            const isUploadImage = (val: any): val is { uri: string; name: string; type: string } => {
                return val && typeof val === 'object' && 'uri' in val;
            };

            // ✅ Append form fields
            Object.keys(form).forEach((key) => {
                const value = form[key];

                if (value === null || value === undefined || value === '') return;

                fd.append(key, String(value));
            });

            // ✅ Append images
            Object.keys(images).forEach((key) => {
                const value = images[key];

                if (!value) return;

                if (isUploadImage(value)) {
                    const uri = value.uri.startsWith('file://')
                        ? value.uri
                        : `file://${value.uri}`;

                    fd.append(key, {
                        uri,
                        name: value.name || `${key}.jpg`,
                        type: value.type || 'image/jpeg',
                    } as any);
                }
            });

            // ✅ API call
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/admin/alliances`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem('auth_token')}`,
                        Accept: 'application/json',
                    },
                    body: fd,
                }
            );

            // ✅ Read response ONLY ONCE
            const text = await response.text();


            let data: any = {};
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error('Invalid server response');
            }

            // ❌ Handle errors
            if (!response.ok) {
                if (!response.ok) {


                    // ✅ If validation errors exist
                    if (data.errors && Object.keys(data.errors).length > 0) {
                        const msg = Object.values(data.errors)
                            .map((err: any) => err[0])
                            .join('\n');

                        throw new Error(msg);
                    }

                    // ✅ fallback to message
                    if (data.message) {
                        throw new Error(data.message);
                    }

                    throw new Error('Validation failed');
                }

                throw new Error(data.message || 'Something went wrong');
            }

            // ✅ Success
            Alert.alert('Success', 'Alliance Created');
            router.back();

        } catch (e: any) {
            console.log('ERROR:', e);
            Alert.alert('Error', e.message || 'Failed to create alliance');
        } finally {
            setLoading(false);
        }

    };

    return (
        <>
            <Stack.Screen options={{ title: '' }} />
            <ScrollView className="p-4 bg-[#8698eb]">
                <View className='mb-4 '>
                    <AppHeader title={"Add Alliance"} onMenuPress={() => setMenuOpen(true)} />
                </View>
                <MemberMenuModal visible={menuOpen}
                    onClose={() => setMenuOpen(false)} />

                <FormInput
                    label="Member ID"
                    placeholder="Member ID"
                    onChangeText={(t) => setForm({ ...form, member_id: t })}
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
                    placeholder="Family Name"
                    onChangeText={(t) => setForm({ ...form, family_name: t })}
                />

                <FormInput
                    label="First Name"
                    placeholder="First Name"
                    onChangeText={(t) => setForm({ ...form, first_name: t })}
                />

                <FormInput
                    label="Last Name"
                    placeholder="Last Name"
                    onChangeText={(t) => setForm({ ...form, last_name: t })}
                />

                <FormDateInput
                    label="Date of Birth"
                    value={form.date_of_birth}

                    onChangeText={(t) => setForm({ ...form, date_of_birth: t })}
                />

                <FormInput
                    label="Father Name"
                    placeholder="Father Name"
                    onChangeText={(t) => setForm({ ...form, father_name: t })}
                />

                <FormInput
                    label="Mother Name"
                    placeholder="Mother Name"
                    onChangeText={(t) => setForm({ ...form, mother_name: t })}
                />

                <FormInput
                    label="Father Occupation"
                    placeholder="Father Occupation"
                    onChangeText={(t) => setForm({ ...form, father_occupation: t })}
                />

                <FormInput
                    label="Mother Occupation"
                    placeholder="Mother Occupation"
                    onChangeText={(t) => setForm({ ...form, mother_occupation: t })}
                />

                <FormInput
                    label="Education"
                    placeholder="Educational Qualifications"
                    onChangeText={(t) =>
                        setForm({ ...form, educational_qualifications: t })
                    }
                />

                <FormInput
                    label="Profession"
                    placeholder="Profession"
                    onChangeText={(t) => setForm({ ...form, profession: t })}
                />

                <FormInput
                    label="Designation"
                    placeholder="Designation"
                    onChangeText={(t) => setForm({ ...form, designation: t })}
                />

                <FormInput
                    label="Company"
                    placeholder="Company Name"
                    onChangeText={(t) => setForm({ ...form, company_name: t })}
                />

                <FormInput
                    label="Place of Working"
                    placeholder="Place of Working"
                    onChangeText={(t) => setForm({ ...form, place_of_working: t })}
                />

                <TextInput
                    placeholder="About the ward"
                    value={form.about_self}
                    multiline
                    textAlignVertical="top"
                    onChangeText={(t) =>
                        setForm(({ ...form, about_self: t }))
                    }
                    className="bg-white p-3 rounded-xl mb-3 h-32"
                />

                <TextInput
                    placeholder="About the family"
                    value={form.about_family}
                    multiline
                    textAlignVertical="top"
                    onChangeText={(t) =>
                        setForm(({ ...form, about_family: t }))
                    }
                    className="bg-white p-3 rounded-xl mb-3 h-32"
                />

                {/* Images */}
                <ImagePickerInput
                    label="Profile Photo"
                    imageUri={images.profile_photo?.uri}
                    onChange={(img) => setImages({ ...images, profile_photo: img })}
                />

                <ImagePickerInput
                    label="Photo 1"
                    imageUri={images.photo1?.uri}
                    onChange={(img) => setImages({ ...images, photo1: img })}
                />

                <ImagePickerInput
                    label="Photo 2"
                    imageUri={images.photo2?.uri}
                    onChange={(img) => setImages({ ...images, photo2: img })}
                />

                <ImagePickerInput
                    label="Photo 3"
                    imageUri={images.photo3?.uri}
                    onChange={(img) => setImages({ ...images, photo3: img })}
                />

                <Pressable
                    onPress={submitAlliance}
                    className="bg-green-600 p-4 rounded-xl mt-4"
                >
                    {loading ? (
                        <View className="flex-row justify-center items-center">
                            <ActivityIndicator color="#fff" />
                            <Text className="text-white ml-2 font-bold">Creating...</Text>
                        </View>
                    ) : (
                        <Text className="text-white text-center font-bold">
                            Create Alliance
                        </Text>
                    )}
                </Pressable>

                <View className="h-20" />
            </ScrollView>
        </>
    );
}