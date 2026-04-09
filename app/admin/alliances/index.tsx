import AppHeader from '@/app/components/AppHeader';
import MemberMenuModal from '@/app/components/MemberMenuModal';
import api from '@/services/api';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';



interface Alliance {
    id: number;
    first_name: string;
    last_name?: string;
    family_name?: string;
    profession?: string;
    profile_photo?: string | null;
    amount?: number | null;
    member_name: string;
    member_email: string;
    member_mobile: string;

}

export default function Alliances() {
    const [alliances, setAlliances] = useState<Alliance[]>([]);
    const router = useRouter();
    const [menuOpen, setMenuOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const loadAlliances = async () => {
        const res = await api.get('/admin/alliances');
        setAlliances(res.data.data);
    };

    useEffect(() => {
        loadAlliances();
    }, []);


    const refreshMessages = async () => {
        setRefreshing(true);
        await loadAlliances();   // your existing API call
        setRefreshing(false);
    };


    const fileUrl = (path?: string | null): string | undefined => {
        if (!path) return undefined;
        return `${process.env.EXPO_PUBLIC_STORAGE_URL}/${path}`;
    };

    return (
        <>
            <Stack.Screen options={{ title: '' }} />
            <View style={{ flex: 1, padding: 10 }} className='bg-[#0a2dc7]'>

                <View className='mb-4 mt-5'>
                    <AppHeader title={"Alliances"} onMenuPress={() => setMenuOpen(true)} />
                </View>
                <MemberMenuModal visible={menuOpen}
                    onClose={() => setMenuOpen(false)} />
                <TouchableOpacity
                    onPress={() => router.push('/admin/alliances/add')}
                    style={{ backgroundColor: 'green', padding: 10, marginBottom: 10 }}
                    className='rounded-xl'
                >
                    <Text style={{ color: 'white' }}> + Add Alliance</Text>
                </TouchableOpacity>

                <FlatList
                    data={alliances}
                    keyExtractor={(item) => item.id.toString()}
                    refreshing={refreshing}
                    onRefresh={refreshMessages}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => router.push(`/admin/alliances/view/${item.id}`)}
                            style={{ flexDirection: 'row', padding: 10, borderBottomWidth: 1 }}
                            className='bg-[#96a2d9] rounded-xl m-1'
                        >
                            <Image
                                source={
                                    fileUrl(item.profile_photo)
                                        ? { uri: fileUrl(item.profile_photo) }
                                        : require('../../../assets/images/no-photo.png')
                                }
                                style={{ width: 50, height: 50, borderRadius: 25 }}
                            />

                            <View style={{ marginLeft: 10 }} >
                                <Text>{item.first_name} {item.last_name}</Text>
                                <Text>{item.profession}</Text>
                                <Text>Posted by: {item.member_name}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </>
    );
}