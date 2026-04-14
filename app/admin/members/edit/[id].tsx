import AppHeader from '@/app/components/AppHeader';
import FormDateInput from '@/app/components/FormDateInput';
import FormSelect from '@/app/components/FormSelect';
import ImagePickerInput from '@/app/components/ImagePickerInput';
import MemberMenuModal from '@/app/components/MemberMenuModal';
import api from '@/services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';




export default function EditMember() {
    const { id } = useLocalSearchParams();

    const [member, setMember] = useState<any>(null);
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


    type MemberForm = {
        family_name: string;
        first_name: string;
        middle_name?: string;
        last_name?: string;
        gender: string;
        spouse_name: string;

        profile_photo?: UploadImage | null;
        couple_pic?: UploadImage | null;

        email?: string;
        mobile_number?: string;
        date_of_birth?: string;
        wedding_date?: string;

        address_flat_number?: string;
        address_premises?: string;
        address_area?: string;
        address_landmark: string;
        address_city?: string;
        address_pin?: string;

        area_no?: string;
        occupation?: string;
        membership_fee?: string;
        status?: string;
    };



    const fileUrl = (path: string | null) => {
        if (!path) return null;

        return `${process.env.EXPO_PUBLIC_STORAGE_URL}/${path}`;
    };

    const loadMember = async () => {
        try {
            setLoading(true)
            const res = await api.get(`/admin/members/${id}`);
            const data = res.data.data;

            setMember(data);
            setForm(data);


            setEmail(data.email);
            setMobile(data.mobile_number);
            setProfilePreview(
                data.profile_photo ? fileUrl(data.profile_photo) : null
            );


            setCouplePreview(
                data.couple_pic ? fileUrl(data.couple_pic) : null
            );
            setLoading(false)
        } catch {
            alert('Member not found');
        }
    };

    useEffect(() => {
        loadMember();
    }, []);

    const updateMember = async () => {
        try {
            setLoading(true);

            const fd = new FormData();

            // 🔥 Type guard
            const isUploadImage = (val: any): val is UploadImage => {
                return val && typeof val === 'object' && 'uri' in val;
            };

            (Object.keys(form) as (keyof MemberForm)[]).forEach((key) => {
                const value = form[key];

                if (value === null || value === undefined || value === '') return;

                // ✅ Handle images ONLY if new image selected
                if (key === 'profile_photo' || key === 'couple_pic') {
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

                    return; // skip further processing
                }

                // ✅ Normal fields
                fd.append(key, String(value));
            });

            // ✅ Laravel method override
            fd.append('_method', 'PUT');

            // ✅ Use fetch (NOT axios)
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/admin/members/${id}`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${await AsyncStorage.getItem('auth_token')}`,
                        Accept: 'application/json',
                    },
                    body: fd,
                }
            );

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 422) {
                    let msg = '';
                    Object.values(data.errors || {}).forEach((errArr: any) => {
                        msg += errArr[0] + '\n';
                    });
                    throw new Error(msg);
                }

                throw new Error(data.message || 'Update failed');
            }

            alert('Member updated');
            loadMember();
            setLoading(false)

        } catch (e: any) {
            console.log('ERROR:', e);
            alert(e.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const updateEmail = async () => {
        try {
            setLoading(true)
            await api.patch(`/admin/members/${id}/email`, { email });
            alert('Email updated');
            setLoading(false)
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

    const updateMobile = async () => {
        try {
            setLoading(true)
            await api.patch(`/admin/members/${id}/mobile`, {
                mobile_number: mobile,
            });
            alert('Mobile updated');
            setLoading(false)
        } catch {
            alert('Mobile update failed');
        }
    };

    const deactivateMember = async () => {
        Alert.alert(
            'Confirm Deactivation',
            'Are you sure you want to deactivate this member?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes, Deactivate',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true)
                            await api.delete(`/admin/members/${id}/deactivate`);
                            Alert.alert('Success', 'Member deactivated');
                            setLoading(false)
                        } catch {
                            Alert.alert('Error', 'Failed to deactivate');
                        }
                    },
                },
            ]
        );
    };

    if (!member) return null;



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

                        {/* Photos */}
                        <View className='mb-4'>
                            <AppHeader title={"Edit Member"} onMenuPress={() => setMenuOpen(true)} />
                        </View>
                        <MemberMenuModal visible={menuOpen}
                            onClose={() => setMenuOpen(false)} />
                        <View className="flex-row justify-between mb-4"></View>

                        {/* Basic Info */}
                        <View className="bg-[#5789c2] p-4 rounded-xl mb-4">
                            <Text className="font-bold mb-2">Basic Info</Text>

                            <ImagePickerInput
                                label="Profile Photo"
                                imageUri={profilePreview}
                                onChange={(img) => {
                                    setForm((prev: any) => ({ ...prev, profile_photo: img }));
                                    setProfilePreview(img.uri);
                                }}
                            />

                            <ImagePickerInput
                                label="Couple Photo"
                                imageUri={couplePreview}
                                onChange={(img) => {
                                    setForm((prev: any) => ({ ...prev, couple_pic: img }));
                                    setCouplePreview(img.uri);
                                }}
                            />



                            <TextInput
                                value={form.family_name}
                                onChangeText={(t) => setForm({ ...form, family_name: t })}
                                placeholder="Family Name"
                                className="bg-gray-100 p-3 rounded-xl mb-2"
                            />

                            <TextInput
                                value={form.first_name}
                                onChangeText={(t) => setForm({ ...form, first_name: t })}
                                placeholder="First Name"
                                className="bg-gray-100 p-3 rounded-xl mb-2"
                            />
                            <TextInput
                                value={form.middle_name}
                                onChangeText={(t) => setForm({ ...form, middle_name: t })}
                                placeholder="Middle Name"
                                className="bg-gray-100 p-3 rounded-xl mb-2"
                            />
                            <TextInput
                                value={form.last_name}
                                onChangeText={(t) => setForm({ ...form, last_name: t })}
                                placeholder="Last Name"
                                className="bg-gray-100 p-3 rounded-xl mb-2"
                            />
                            <FormSelect
                                label="Gender"
                                value={form.gender}
                                onChange={(t) =>
                                    setForm(() => ({ ...form, gender: t }))
                                }
                                items={[
                                    { label: 'male', value: 'male' },
                                    { label: 'female', value: 'female' },
                                ]}
                            />
                            <Text className="font-bold text-gray-50 text-sm">Spouse Name</Text>
                            <TextInput
                                value={form.spouse_name}
                                onChangeText={(t) => setForm({ ...form, spouse_name: t })}
                                placeholder="Spouse Name"
                                className="bg-gray-100 p-3 rounded-xl mb-2"
                            />
                            <Text className="font-bold text-gray-50 text-sm">Occupation</Text>
                            <TextInput
                                value={form.occupation}
                                onChangeText={(t) => setForm({ ...form, occupation: t })}
                                placeholder="Occupation"
                                className="bg-gray-100 p-3 rounded-xl mb-2"
                            />

                            <FormSelect
                                label="Occupation Status"
                                value={form.status}
                                onChange={(value) =>
                                    setForm({ ...form, occupation: value })
                                }
                                items={[
                                    { label: 'in_service', value: 'in_service' },
                                    { label: 'retired', value: 'retired' },

                                ]}
                            />
                            <Text className="font-bold mb-2">Important Dates</Text>

                            <FormDateInput
                                label="Date of Birth"
                                value={form.date_of_birth}
                                onChangeText={(t) => setForm({ ...form, date_of_birth: t })}

                            />

                            <FormDateInput
                                label="Wedding Date"
                                value={form.wedding_date}
                                onChangeText={(t) => setForm({ ...form, wedding_date: t })}

                            />
                            <Text className="font-bold mb-2">Address</Text>
                            <TextInput
                                value={form.address_flat_number}
                                onChangeText={(t) => setForm({ ...form, address_flat_number: t })}
                                placeholder="Flat Number"
                                className="bg-gray-100 p-3 rounded-xl mb-2"
                            />
                            <TextInput
                                value={form.address_premises}
                                onChangeText={(t) => setForm({ ...form, address_premises: t })}
                                placeholder="Premises"
                                className="bg-gray-100 p-3 rounded-xl mb-2"
                            />


                            <TextInput
                                value={form.address_area}
                                onChangeText={(t) => setForm({ ...form, address_area: t })}
                                placeholder="Area"
                                className="bg-gray-100 p-3 rounded-xl mb-2"
                            />
                            <TextInput
                                value={form.address_landmark}
                                onChangeText={(t) => setForm({ ...form, address_landmark: t })}
                                placeholder="Land Mark"
                                className="bg-gray-100 p-3 rounded-xl mb-2"
                            />
                            <TextInput
                                value={form.address_city}
                                onChangeText={(t) => setForm({ ...form, address_city: t })}
                                placeholder="Land Mark"
                                className="bg-gray-100 p-3 rounded-xl mb-2"
                            />
                            <TextInput
                                value={form.address_pin}
                                keyboardType='numeric'
                                onChangeText={(t) => setForm({ ...form, address_pin: t })}
                                placeholder="PIN"
                                className="bg-gray-100 p-3 rounded-xl mb-2"
                            />
                            <Text className="font-bold text-sm text-gray-50">Membership Fee</Text>
                            <TextInput
                                value={form.membership_fee ? String(form.membership_fee) : ''}
                                keyboardType='numeric'
                                onChangeText={(t) => setForm({ ...form, membership_fee: t })}
                                placeholder="Membership Fee"
                                className="bg-gray-100 p-3 rounded-xl mb-2"
                            />


                            <Pressable
                                onPress={updateMember}
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

                        {/* Email */}
                        <View className="bg-white p-4 rounded-xl mb-4">
                            <Text className="font-bold mb-2">Update Email</Text>

                            <TextInput
                                value={email}
                                onChangeText={setEmail}
                                className="bg-gray-100 p-3 rounded-xl mb-2"
                            />

                            <Pressable
                                onPress={updateEmail}
                                className="bg-blue-600 p-3 rounded-xl"
                            >
                                {loading ? (
                                    <View className="flex-row justify-center items-center">
                                        <ActivityIndicator color="#fff" />
                                        <Text className="text-white ml-2 font-bold">Updating...</Text>
                                    </View>
                                ) : (
                                    <Text className="text-white text-center font-bold">
                                        Update Email
                                    </Text>
                                )}
                            </Pressable>
                        </View>

                        {/* Mobile */}
                        <View className="bg-white p-4 rounded-xl mb-4">
                            <Text className="font-bold mb-2">Update Mobile</Text>

                            <TextInput
                                value={mobile}
                                onChangeText={setMobile}
                                keyboardType="numeric"
                                className="bg-gray-100 p-3 rounded-xl mb-2"
                            />

                            <Pressable
                                onPress={updateMobile}
                                className="bg-blue-600 p-3 rounded-xl"
                            >
                                {loading ? (
                                    <View className="flex-row justify-center items-center">
                                        <ActivityIndicator color="#fff" />
                                        <Text className="text-white ml-2 font-bold">Updating...</Text>
                                    </View>
                                ) : (
                                    <Text className="text-white text-center font-bold">
                                        Update Mobile
                                    </Text>
                                )}
                            </Pressable>
                        </View>

                        {/* Deactivate */}
                        <Pressable
                            onPress={deactivateMember}
                            className="bg-red-600 p-4 rounded-xl"
                        >
                            {loading ? (
                                <View className="flex-row justify-center items-center">
                                    <ActivityIndicator color="#fff" />
                                    <Text className="text-white ml-2 font-bold">Deactivating...</Text>
                                </View>
                            ) : (
                                <Text className="text-white text-center font-bold">
                                    Deactivate Member
                                </Text>
                            )}
                        </Pressable>

                    </ScrollView>
                </KeyboardAwareScrollView>
            </KeyboardAvoidingView>
        </>
    );
}

function setLoading(arg0: boolean) {
    throw new Error('Function not implemented.');
}
