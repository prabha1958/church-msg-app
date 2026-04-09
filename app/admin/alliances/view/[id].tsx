import AppHeader from '@/app/components/AppHeader';
import MemberMenuModal from '@/app/components/MemberMenuModal';
import api from '@/services/api';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Image, Modal, Pressable, ScrollView, Text, View } from 'react-native';





export default function ViewAlliance() {
    const { id } = useLocalSearchParams();
    const [alliance, setAlliance] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();

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

    if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />;

    if (!alliance) return <Text>No data</Text>;




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
            </View>
        </>
    );


}

