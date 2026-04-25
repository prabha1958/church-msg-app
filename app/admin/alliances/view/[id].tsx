import AppHeader from '@/app/components/AppHeader';
import AppLoader from '@/app/components/AppLoader';
import FormSelect from '@/app/components/FormSelect';
import MemberMenuModal from '@/app/components/MemberMenuModal';
import api from '@/services/api';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, Image, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';





export default function ViewAlliance() {
    const { id } = useLocalSearchParams();
    const [alliance, setAlliance] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();
    const [payOpen, setPayOpen] = useState(false);


    const [offlineForm, setOfflineForm] = useState({
        amount: 3000,
        payment_mode: 'cash',
        reference_no: '',
    });

    const fileUrl = (path?: string | null) =>
        path
            ? `${process.env.EXPO_PUBLIC_STORAGE_URL}/${path}`
            : undefined;

    const loadAlliance = async () => {
        try {
            const res = await api.get(`/admin/alliances/${id}`);
            setAlliance(res.data.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAlliance();
    }, []);

    if (loading) return <AppLoader />;

    if (!alliance) return <Text>No data</Text>;

    const handleOfflinePay = async () => {
        setLoading(true);

        try {
            const res = await api.post(
                `/admin/alliances/${id}/payments/offline`,
                offlineForm
            );

            Alert.alert('Success', 'Offline payment recorded');

            setPayOpen(false);
            loadAlliance(); // refresh data

        } catch (e: any) {
            if (e.response?.data?.message) {
                Alert.alert('Error', e.response.data.message);
            } else {
                Alert.alert('Error', 'Payment failed');
            }
        } finally {
            setLoading(false);
        }
    };



    return (
        <>
            <Stack.Screen options={{ title: '' }} />
            <View style={{ flex: 1 }}>
                <View className='mb-4'>
                    <AppHeader title={alliance.first_name} onMenuPress={() => setMenuOpen(true)} />
                </View>

                <MemberMenuModal visible={menuOpen}
                    onClose={() => setMenuOpen(false)} />

                <ScrollView className="p-4 bg-white">
                    {/* Profile */}
                    <Pressable
                        onPress={() =>
                            fileUrl(alliance.profile_photo) &&
                            setSelectedImage(fileUrl(alliance.profile_photo)!)
                        }
                    >
                        <Image
                            source={
                                fileUrl(alliance.profile_photo)
                                    ? { uri: fileUrl(alliance.profile_photo) }
                                    : require('../../../../assets/images/no-photo.png')
                            }
                            className="w-32 h-32 rounded-xl mb-4"
                        />
                    </Pressable>

                    <Text className="text-xl font-bold">
                        {alliance.first_name} {alliance.last_name}
                    </Text>

                    <Text>Family: {alliance.family_name}</Text>
                    <Text>Type: {alliance.alliance_type}</Text>
                    <Text>DOB: {alliance.date_of_birth}</Text>

                    {/* Photos */}
                    <Text className="mt-4 font-bold">Photos</Text>
                    <View className="flex-row gap-2 mt-2">
                        {['photo1', 'photo2', 'photo3'].map((k) =>
                            alliance[k] ? (
                                <Pressable
                                    key={k}
                                    onPress={() =>
                                        fileUrl(alliance[k]) &&
                                        setSelectedImage(fileUrl(alliance[k])!)
                                    }
                                >
                                    <Image
                                        source={{ uri: fileUrl(alliance[k]) }}
                                        className="w-24 h-24 rounded"
                                    />
                                </Pressable>
                            ) : null
                        )}
                    </View>

                    {/* Family */}
                    <Text className="mt-4 font-bold">Family</Text>
                    <Text>Father: {alliance.father_name}</Text>
                    <Text>Mother: {alliance.mother_name}</Text>

                    {/* Work */}
                    <Text className="mt-4 font-bold">Profession</Text>
                    <Text>{alliance.profession}</Text>
                    <Text>{alliance.designation}</Text>
                    <Text>{alliance.company_name}</Text>

                    {/* About */}
                    <Text className="mt-4 font-bold">About</Text>
                    <Text>{alliance.about_self}</Text>
                    <Text>{alliance.about_family}</Text>

                    <Pressable
                        onPress={() => router.push(`/admin/alliances/edit/${id}`)}
                        className="bg-[#d1a917] p-4 rounded-xl mt-4"
                    >
                        <Text className="text-white text-center font-bold">
                            Edit Alliance
                        </Text>
                    </Pressable>
                    {!alliance.amount && (
                        <Pressable
                            onPress={() => setPayOpen(true)}
                            className="bg-blue-600 p-3 rounded-xl mt-3"
                        >
                            <Text className="text-white text-center">Pay</Text>
                        </Pressable>
                    )}

                    {alliance.amount && (
                        <View className="bg-green-200 p-3 rounded-xl mt-3">
                            <Text className="text-green-800 text-center font-bold">
                                Paid ₹{alliance.amount}
                            </Text>
                        </View>
                    )}


                </ScrollView>

                {/* ✅ MODAL MUST BE HERE */}
                <Modal visible={!!selectedImage} transparent>
                    <Pressable
                        onPress={() => setSelectedImage(null)}
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.9)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            source={{ uri: selectedImage! }}
                            style={{
                                width: Dimensions.get('window').width,
                                height: Dimensions.get('window').height * 0.7,
                                resizeMode: 'contain',
                            }}
                        />
                    </Pressable>
                </Modal>
                <Modal visible={payOpen} transparent animationType="slide">
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        className="flex-1 bg-[#082775] p-4"
                    >

                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                justifyContent: 'center',
                                padding: 20,
                            }}
                        >
                            <View className="bg-white p-4 rounded-xl">

                                <Text className="text-lg font-bold mb-3">
                                    Offline Payment
                                </Text>

                                {/* Amount */}
                                <Text>Amount</Text>
                                <TextInput
                                    value={String(offlineForm.amount)}
                                    keyboardType="numeric"
                                    onChangeText={(t) =>
                                        setOfflineForm({ ...offlineForm, amount: Number(t) })
                                    }
                                    className="border p-3 rounded-xl mb-2"
                                />


                                {/* Payment Mode */}
                                <Text>Payment Mode</Text>
                                <FormSelect
                                    label="Mode of Payment"
                                    value={offlineForm.payment_mode}
                                    onChange={(value) =>
                                        setOfflineForm(prev => ({ ...prev, payment_mode: value }))
                                    }
                                    items={[
                                        { label: 'cash', value: 'cash' },
                                        { label: 'upi', value: 'upi' },

                                    ]}
                                />


                                {/* Reference */}
                                <Text>Reference No</Text>
                                <TextInput
                                    value={offlineForm.reference_no}
                                    onChangeText={(t) =>
                                        setOfflineForm({ ...offlineForm, reference_no: t })
                                    }
                                    className="border p-3 rounded-xl mb-3"
                                />

                                {/* Buttons */}
                                <View className="flex-row justify-between">
                                    <Pressable
                                        onPress={() => setPayOpen(false)}
                                        className="bg-gray-400 p-3 rounded-xl"
                                    >
                                        <Text>Cancel</Text>
                                    </Pressable>

                                    <Pressable
                                        onPress={handleOfflinePay}
                                        className="bg-green-600 p-3 rounded-xl"
                                    >
                                        <Text className="text-white">
                                            {loading ? 'Processing...' : 'Confirm'}
                                        </Text>
                                    </Pressable>
                                </View>

                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            </View>
        </>
    );


}

