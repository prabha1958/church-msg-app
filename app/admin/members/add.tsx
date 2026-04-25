import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import AppHeader from '@/app/components/AppHeader';
import AppLoader from '@/app/components/AppLoader';
import FormDateInput from '@/app/components/FormDateInput';
import FormSelect from '@/app/components/FormSelect';
import { Stack } from 'expo-router';
import MemberMenuModal from "../../components/MemberMenuModal";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInputProps } from 'react-native';

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


type InputProps = TextInputProps & {
    placeholder: string;
    value?: string;
    onChangeText: (text: string) => void;
};





const FormInput = ({
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
    ...rest
}: InputProps) => {
    return (
        <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            className="border p-3 rounded-xl mb-3 bg-white text-xl text-gray-500 font-bold"
            {...rest}
        />
    );
};




export default function AddMember() {
    const [profile, setProfile] = useState<string | null>(null);
    const [couple, setCouple] = useState<string | null>(null);
    const [dob, setDob] = useState<Date | null>(null);
    const [weddingDate, setWeddingDate] = useState<Date | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loading, setLoading] = useState(false);




    const initialForm: MemberForm = {
        family_name: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        spouse_name: '',
        email: '',
        mobile_number: '',
        date_of_birth: '',
        wedding_date: '',
        address_flat_number: '',
        address_premises: '',
        address_area: '',
        address_landmark: '',
        address_city: '',
        address_pin: '',
        area_no: '',
        occupation: '',
        membership_fee: '',
        status: '',
        gender: ''
    };

    const [form, setForm] = useState<MemberForm>(initialForm);

    const pickImage = async (type: 'profile' | 'couple') => {
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });

        if (!res.canceled) {
            const asset = res.assets[0];

            const image = {
                uri: asset.uri,
                name: asset.fileName || 'photo.jpg',
                type: 'image/jpeg',
            };

            if (type === 'profile') {
                setProfile(asset.uri);
                setForm((prev) => ({ ...prev, profile_photo: image }));
            } else {
                setCouple(asset.uri);
                setForm((prev) => ({ ...prev, couple_pic: image }));
            }
        }
    };
    const handleSubmit = async () => {
        try {
            setLoading(true);

            const fd = new FormData();

            // ✅ append safely
            (Object.keys(form) as (keyof MemberForm)[]).forEach((key) => {
                const value = form[key];

                if (value === null || value === undefined || value === '') return;

                // ✅ TYPE GUARD (VERY IMPORTANT)
                if (
                    typeof value === 'object' &&
                    value !== null &&
                    'uri' in value
                ) {
                    const image = value as UploadImage;

                    const uri = image.uri.startsWith('file://')
                        ? image.uri
                        : `file://${image.uri}`;

                    fd.append(key, {
                        uri,
                        name: image.name || 'photo.jpg',
                        type: image.type || 'image/jpeg',
                    } as any);

                } else {
                    fd.append(key, String(value));
                }
            });

            // ✅ Use fetch instead of axios
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/admin/members`,
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

                throw new Error(data.message || 'Something went wrong');
            }

            alert('Member added successfully');

            setForm(initialForm);
            setProfile(null);
            setCouple(null);

        } catch (e: any) {
            console.log('ERROR:', e);
            alert(e.message || 'Failed to add member');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AppLoader />
        );
    }

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

                    {/* Photos */}
                    <View className='mb-4'>
                        <AppHeader title={"Add Member"} onMenuPress={() => setMenuOpen(true)} />
                    </View>
                    <MemberMenuModal visible={menuOpen}
                        onClose={() => setMenuOpen(false)} />
                    <View className="flex-row justify-between mb-4">



                        <Pressable onPress={() => pickImage('profile')}>
                            {profile ? (
                                <Image source={{ uri: profile }} className="w-40 h-40 rounded-xl" />
                            ) : (
                                <View className="w-40 h-40 bg-gray-300 rounded-xl p-1 justify-center items-center">
                                    <Text>Select Profile Photo</Text>
                                </View>
                            )}
                        </Pressable>

                        <Pressable onPress={() => pickImage('couple')}>
                            {couple ? (
                                <Image source={{ uri: couple }} className="w-40 h-40 rounded-xl" />
                            ) : (
                                <View className="w-40 h-40 bg-gray-300 p-2 rounded-xl justify-center items-center">
                                    <Text>select couple pic</Text>
                                </View>
                            )}
                        </Pressable>
                    </View>

                    {/* BASIC INFO */}
                    <Text className="font-semibold mb-2">Basic Info</Text>

                    <FormInput placeholder={'Family Name'}
                        value={form.family_name}
                        onChangeText={(text) =>
                            setForm((prev) => ({ ...prev, family_name: text }))
                        }
                    />



                    <FormInput
                        placeholder="First Name"
                        value={form.first_name}
                        onChangeText={(text) =>
                            setForm((prev) => ({ ...prev, first_name: text }))
                        }
                    />

                    <FormInput
                        placeholder="Middle Name"
                        value={form.middle_name}
                        onChangeText={(text) =>
                            setForm((prev) => ({ ...prev, middle_name: text }))
                        }
                    />
                    <FormInput
                        placeholder="Last Name"
                        value={form.last_name}
                        onChangeText={(text) =>
                            setForm((prev) => ({ ...prev, last_name: text }))
                        }
                    />
                    <FormInput
                        placeholder="Spouse Name"
                        value={form.spouse_name}
                        onChangeText={(text) =>
                            setForm((prev) => ({ ...prev, spouse_name: text }))
                        }
                    />



                    {/* CONTACT */}
                    <Text className="font-semibold mt-4 mb-2">Contact</Text>

                    <FormInput
                        placeholder="Email"
                        value={form.email}
                        keyboardType='email-address'
                        autoComplete="email"
                        onChangeText={(text) =>
                            setForm((prev) => ({ ...prev, email: text }))
                        }
                    />
                    <FormInput
                        placeholder="mobile_number"
                        value={form.mobile_number}
                        keyboardType='phone-pad'
                        autoComplete="tel"
                        onChangeText={(text) =>
                            setForm((prev) => ({ ...prev, mobile_number: text }))
                        }
                    />
                    <FormSelect
                        label="Gender"
                        value={form.gender}
                        onChange={(value) =>
                            setForm(prev => ({ ...prev, gender: value }))
                        }
                        items={[
                            { label: 'male', value: 'male' },
                            { label: 'female', value: 'female' },
                        ]}
                    />


                    {/* DATES */}
                    <FormDateInput
                        label="Date of Birth"
                        value={form.date_of_birth}
                        onChangeText={(text) =>
                            setForm(prev => ({ ...prev, date_of_birth: text }))
                        }
                    />

                    <FormDateInput
                        label="Wedding Date"
                        value={form.wedding_date}
                        onChangeText={(text) =>
                            setForm(prev => ({ ...prev, wedding_date: text }))
                        }
                    />


                    {/* ADDRESS */}
                    <Text className="font-semibold mt-4 mb-2">Address</Text>

                    <FormInput
                        placeholder="Flat No"
                        value={form.address_flat_number}
                        onChangeText={(text) =>
                            setForm((prev) => ({ ...prev, address_flat_number: text }))
                        }
                    />

                    <FormInput
                        placeholder="Premises Name"
                        value={form.address_premises}
                        onChangeText={(text) =>
                            setForm((prev) => ({ ...prev, address_premises: text }))
                        }
                    />
                    <FormInput
                        placeholder="Area Name"
                        value={form.address_area}
                        onChangeText={(text) =>
                            setForm((prev) => ({ ...prev, address_area: text }))
                        }
                    />
                    <FormInput
                        placeholder="Land mark"
                        value={form.address_landmark}
                        onChangeText={(text) =>
                            setForm((prev) => ({ ...prev, address_landmark: text }))
                        }
                    />
                    <FormInput
                        placeholder="City Name"
                        value={form.address_city}
                        onChangeText={(text) =>
                            setForm((prev) => ({ ...prev, address_city: text }))
                        }
                    />
                    <FormInput
                        placeholder="Pin"
                        value={form.address_pin}
                        keyboardType='numeric'
                        onChangeText={(text) =>
                            setForm((prev) => ({ ...prev, address_pin: text }))
                        }
                    />

                    {/* CHURCH */}
                    <Text className="font-semibold mt-4 mb-2">Church Info</Text>

                    <FormInput
                        placeholder="Area Number"
                        value={form.area_no}
                        keyboardType='numeric'
                        onChangeText={(text) =>
                            setForm((prev) => ({ ...prev, area_no: text }))
                        }
                    />
                    <FormInput
                        placeholder="Occupation"
                        value={form.occupation}
                        onChangeText={(text) =>
                            setForm((prev) => ({ ...prev, occupation: text }))
                        }
                    />

                    <FormSelect
                        label="Occupation Status"
                        value={form.status}
                        onChange={(value) =>
                            setForm(prev => ({ ...prev, status: value }))
                        }
                        items={[
                            { label: 'in_service', value: 'in_service' },
                            { label: 'retired', value: 'retired' },

                        ]}
                    />
                    <FormInput
                        placeholder="Membership Fee"
                        value={form.membership_fee}
                        keyboardType='numeric'
                        onChangeText={(text) =>
                            setForm((prev) => ({ ...prev, membership_fee: text }))
                        }
                    />

                    {/* SUBMIT */}
                    <Pressable
                        onPress={handleSubmit}
                        disabled={loading}
                        className={`p-4 rounded-xl ${loading ? 'bg-gray-400' : 'bg-[#875504]'}`}

                    >
                        {loading ? (
                            <View className="flex-row justify-center items-center">
                                <ActivityIndicator color="#fff" />
                                <Text className="text-white ml-2 font-bold">Creating...</Text>
                            </View>
                        ) : (
                            <Text className="text-white text-center font-bold">
                                Create Member
                            </Text>
                        )}
                    </Pressable>


                </KeyboardAwareScrollView>
            </KeyboardAvoidingView>
        </>
    );
}