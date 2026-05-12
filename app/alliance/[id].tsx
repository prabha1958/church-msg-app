import AppHeader from '@/app/components/AppHeader';
import AppLoader from '@/app/components/AppLoader';
import MemberMenuModal from '@/app/components/MemberMenuModal';
import api from '@/services/api';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Dimensions, Image, Modal, Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';
import InfoRow from "../components/InfoRow";
import Section from '../components/Section';





export default function ViewAlliance() {
    const { id } = useLocalSearchParams();
    const [alliance, setAlliance] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const router = useRouter();



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
            const res = await api.get(`/alliances/${id}`);
            setAlliance(res.data.data)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAlliance();
    }, []);

    if (loading) return <AppLoader />;

    if (!alliance) return <Text>No data</Text>;


    const images = [
        alliance.alliance.profile_photo,
        alliance.alliance.photo1,
        alliance.alliance.photo2,
        alliance.alliance.photo3,
    ].filter(Boolean);

    const fullName = [alliance.alliance.family_name, alliance.alliance.first_name, alliance.alliance.middle_name, alliance.alliance.last_name]
        .filter(Boolean)
        .join(" ");

    const member_name = [alliance.member.family_name, alliance.member.first_name, alliance.member.last_name]
        .filter(Boolean)
        .join(" ");
    const email = alliance.member.email;
    const mobile = alliance.member.mobile_number


    return (
        <>
            <Stack.Screen options={{ title: '' }} />
            <View style={{ flex: 1 }} >

                <SafeAreaView className="flex-1 bg-[#040c1f]">



                    <ScrollView className="p-4">
                        <Text
                            className="text-amber-400 text-2xl p-2"
                            onPress={() => router.back()}
                        >
                            ←
                        </Text>
                        <View className='mb-4 mt-10' >
                            <AppHeader title={alliance.alliance.first_name} onMenuPress={() => setMenuOpen(true)} />
                        </View>

                        <MemberMenuModal visible={menuOpen}
                            onClose={() => setMenuOpen(false)} />
                        {/* Profile */}
                        <Pressable
                            onPress={() =>
                                fileUrl(alliance.alliance.profile_photo) &&
                                setSelectedImage(fileUrl(alliance.alliance.profile_photo)!)
                            }
                        >
                            <Image
                                source={
                                    fileUrl(alliance.alliance.profile_photo)
                                        ? { uri: fileUrl(alliance.alliance.profile_photo) }
                                        : require('../../assets/images/no-photo.png')
                                }
                                className="w-32 h-32 rounded-xl mb-4"
                            />
                        </Pressable>

                        <View className="p-4">
                            <Text className="text-amber-400 text-2xl font-bold">
                                {fullName}
                            </Text>

                            <Text className="text-slate-300 mt-1">
                                {alliance.alliance.alliance_type.toUpperCase()} • {alliance.age} yrs
                            </Text>
                        </View>

                        {/* Photos */}
                        <Text className="mt-4 font-bold text-gray-50">Photos</Text>
                        <View className="flex-row gap-2 mt-2">
                            {['photo1', 'photo2', 'photo3'].map((k) =>
                                alliance.alliance[k] ? (
                                    <Pressable
                                        key={k}
                                        onPress={() =>
                                            fileUrl(alliance.alliance[k]) &&
                                            setSelectedImage(fileUrl(alliance.alliance[k])!)
                                        }
                                    >
                                        <Image
                                            source={{ uri: fileUrl(alliance.alliance[k]) }}
                                            className="w-24 h-24 rounded"
                                        />
                                    </Pressable>
                                ) : null
                            )}

                        </View>
                        <Text className='text-sm text-gray-50 font-bild'>click to view photo</Text>
                        {/* Family */}
                        <View className="mx-4 mt-6 bg-[#071633] rounded-xl border border-[#102a56]">

                            <InfoRow label="Profession" value={alliance.alliance.profession} />
                            <InfoRow label="Designation" value={alliance.alliance.designation} />
                            <InfoRow label="Company" value={alliance.alliance.company_name} />
                            <InfoRow label="Place" value={alliance.alliance.place_of_working} />
                            <InfoRow label="Father" value={alliance.alliance.father_name} />
                            <InfoRow label="Mother" value={alliance.alliance.mother_name} />

                            <InfoRow
                                label="Education"
                                value={alliance.alliance.educational_qualifications}
                            />

                            {alliance.alliance.about_self && (
                                <Section title="About Ward" text={alliance.alliance.about_self} />
                            )}

                            {alliance.alliance.about_family && (
                                <Section title="About Family" text={alliance.alliance.about_family} />
                            )}

                            <InfoRow label="Posted by" value={member_name} />
                            <InfoRow label="email" value={email} />
                            <InfoRow label="mobile" value={mobile} />
                        </View>




                    </ScrollView>
                </SafeAreaView>

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

