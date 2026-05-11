import AppHeader from '@/app/components/AppHeader';
import FormDateInput from '@/app/components/FormDateInput';
import ImagePickerInput from '@/app/components/ImagePickerInput';
import MemberMenuModal from '@/app/components/MemberMenuModal';
import api from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';





export default function EditPastor() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [pastor, setPastor] = useState<any>(null);
    const [form, setForm] = useState<any>({});
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const [couplePreview, setCouplePreview] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    type UploadImage = {
        uri: string;
        name: string;
        type: string;
    };

    type EditForm = {
        name: string,
        designation: string,
        qualifications: string,
        date_of_joining: string,
        date_of_leaving: string,
        past_service_description: string,
        order_no: number,
    }


    const [editForm, setEditForm] = useState({
        name: '',
        designation: '',
        qualifications: '',
        date_of_joining: '',
        date_of_leaving: '',
        past_service_description: '',
        order_no: '',
    });


    const fileUrl = (path: string | null) => {
        if (!path) return null;

        return `${process.env.EXPO_PUBLIC_STORAGE_URL}/${path}`;
    };

    const loadPastor = async () => {
        try {
            setLoading(true)
            const res = await api.get(`/admin/pastors/${id}`);
            const data = res.data.data;

            setPastor(data);
            setEditForm(data);



            setProfilePreview(
                data.photo ? fileUrl(data.photo) : null
            );



            setLoading(false)
        } catch {
            alert('Pastor not found');
        }
    };

    useEffect(() => {
        loadPastor();
    }, []);

    const updatePastor = async () => {
        setLoading(true);
        try {
            const fd = new FormData();

            const isUploadImage = (val: any): val is UploadImage => {
                return val && typeof val === 'object' && 'uri' in val;
            };

            // ✅ Fields to skip
            const skipFields = [
                'photo', 'couple_pic',
                'created_at', 'updated_at',
                'id',
            ];

            (Object.keys(editForm) as (keyof EditForm)[]).forEach((key) => {
                const value = editForm[key];

                if (skipFields.includes(key)) return;
                if (value === null || value === undefined || value === '') return;

                // ✅ Skip any nested objects/arrays
                if (typeof value === 'object') {
                    console.warn(`Skipping object field: ${key}`);
                    return;
                }

                fd.append(key, String(value));
            });

            // ✅ Append images only if newly selected
            ['photo'].forEach((key) => {
                const value = editForm[key as keyof EditForm];

                if (isUploadImage(value)) {
                    const uri = value.uri.startsWith('file://')
                        ? value.uri
                        : `file://${value.uri}`;

                    fd.append(key, {
                        uri,
                        name: value.name || 'photo.jpg',
                        type: value.type || 'image/jpeg',
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

            await api.post(`/admin/pastors/${id}`, fd, { headers });

            alert('Pastor updated');
            loadPastor();

        } catch (e: any) {
            console.warn('UPDATE ERROR:', e);
            if (e.response?.status === 422) {
                const errors = e.response.data.errors;
                const msg = Object.values(errors).flat().join('\n');
                alert(msg);
            } else {
                alert(e.response?.data?.message || e.message || 'Update failed');
            }
        } finally {
            setLoading(false); // ✅ always runs, moved out of try
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
                    <ScrollView className="flex-1 bg-[#082775] p-4">
                        <Text
                            className="text-white text-2xl mr-3"
                            onPress={() => router.back()}
                        >
                            ←
                        </Text>

                        {/* Photos */}
                        <View className='mb-4'>
                            <AppHeader title={"Edit Pastor"} onMenuPress={() => setMenuOpen(true)} />
                        </View>
                        <MemberMenuModal visible={menuOpen}
                            onClose={() => setMenuOpen(false)} />
                        <View className="flex-row justify-between mb-4"></View>

                        {/* Basic Info */}
                        <View className="bg-[#5789c2] p-4 rounded-xl mb-4">


                            <ImagePickerInput
                                label="Photo"
                                imageUri={profilePreview}
                                onChange={(img) => {
                                    setEditForm((prev: any) => ({ ...prev, photo: img }));
                                    setProfilePreview(img.uri);
                                }}
                            />




                            <TextInput
                                value={editForm.name}
                                onChangeText={(t) => setEditForm({ ...editForm, name: t })}
                                placeholder=" Name"
                                className="bg-gray-100 p-3 rounded-xl mb-2"
                            />

                            <Text className="font-bold text-gray-50 text-sm">Designation</Text>
                            <TextInput
                                value={editForm.designation}
                                onChangeText={(t) => setEditForm({ ...editForm, designation: t })}
                                placeholder="Designation"
                                className="bg-gray-100 p-3 rounded-xl mb-2"
                            />

                            <Text className="font-bold text-gray-50 text-sm">Qualifications</Text>
                            <TextInput
                                value={editForm.qualifications}
                                onChangeText={(t) => setEditForm({ ...editForm, qualifications: t })}
                                placeholder="Designation"
                                className="bg-gray-100 p-3 rounded-xl mb-2"
                            />

                            <Text className="font-bold text-gray-50 text-sm">About Pastor</Text>




                            <TextInput
                                placeholder="   About the Pastor"
                                value={editForm.past_service_description}
                                multiline
                                textAlignVertical="top"
                                onChangeText={(t) =>
                                    setEditForm({ ...editForm, past_service_description: t })
                                }
                                className="bg-white p-3 rounded-xl mb-3 h-32"
                            />





                            <FormDateInput
                                label="Date of Joining"
                                value={editForm.date_of_joining || ''}
                                onChangeText={(t) =>
                                    setEditForm({ ...editForm, date_of_joining: t })
                                }

                            />

                            <FormDateInput
                                label="Date of Leaving"
                                value={editForm.date_of_leaving || ''}
                                onChangeText={(t) =>
                                    setEditForm({ ...editForm, date_of_leaving: t })
                                }

                            />
                            <Text className="font-bold text-gray-50 text-sm">Order No</Text>
                            <TextInput
                                value={String(editForm.order_no)}
                                keyboardType='numeric'
                                onChangeText={(t) => setEditForm({ ...editForm, order_no: t })}
                                placeholder="Order number"
                                className="bg-gray-100 p-3 rounded-xl mb-2"
                            />










                            <Pressable
                                onPress={updatePastor}
                                className="bg-green-600 p-3 rounded-xl"
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



                        {/* Deactivate */}


                    </ScrollView>
                </KeyboardAwareScrollView>
            </KeyboardAvoidingView>
        </>
    );
}

function setLoading(arg0: boolean) {
    throw new Error('Function not implemented.');
}
