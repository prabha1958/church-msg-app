import AppHeader from '@/app/components/AppHeader';
import FormDateInput from '@/app/components/FormDateInput';
import FormInput from '@/app/components/FormInput';
import FormSelect from '@/app/components/FormSelect';
import ImagePickerInput from '@/app/components/ImagePickerInput';
import MemberMenuModal from '@/app/components/MemberMenuModal';
import api from '@/services/api';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

export default function AddAlliance() {
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);

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

    const submitAlliance = async () => {
        try {
            const fd = new FormData();

            Object.keys(form).forEach((key) => {
                if (form[key]) fd.append(key, form[key]);
            });

            Object.keys(images).forEach((key) => {
                if (images[key]) {
                    fd.append(key, images[key]);
                }
            });

            await api.post('/admin/alliances', fd, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            Alert.alert('Success', 'Alliance Created');
            router.back();
        } catch (e: any) {
            if (e.response?.data?.errors) {
                const errors = e.response.data.errors;

                const errorMessages = Object.values(errors)
                    .map((err: any) => err[0])
                    .join('\n');

                Alert.alert('Validation Error', errorMessages);
            } else if (e.response?.data?.message) {
                Alert.alert('Error', e.response.data.message);
            } else {
                Alert.alert('Error', 'Something went wrong');
            }
        }
    };

    return (
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
                <Text className="text-white text-center font-bold">
                    Create Alliance
                </Text>
            </Pressable>

            <View className="h-20" />
        </ScrollView>
    );
}