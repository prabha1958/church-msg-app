import AppHeader from '@/app/components/AppHeader';
import MemberMenuModal from '@/app/components/MemberMenuModal';
import PastorCard from '@/app/components/PastorCard';
import api from '@/services/api';
import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';


interface Pastor {
    id: number;
    name: string;
    designation: string;
    qualifications: string;
    date_of_joining: string;
    date_of_leaving: string;
    past_service_description: string;
    order_no: number;

}

export default function Clergy() {
    const [pastors, setPastors] = useState<Pastor[]>([]);
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);


    const loadPastors = async () => {
        const res = await api.get('/admin/pastors');
        setPastors(res.data.data.data);

    };

    useEffect(() => {
        loadPastors();
    }, []);



    const refreshPastors = async () => {
        setRefreshing(true);
        await loadPastors();   // your existing API call
        setRefreshing(false);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            loadPastors();

        }, 30000); // every 30 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Stack.Screen options={{ title: '' }} />
            <View className="p-4">

                <View className='mb-4'>
                    <AppHeader title={"Clergy"} onMenuPress={() => setMenuOpen(true)} />
                </View>
                <MemberMenuModal visible={menuOpen}
                    onClose={() => setMenuOpen(false)} />


                {/* Add Button */}
                <Pressable
                    onPress={() => router.push('/admin/clergy/add')}
                    className="bg-green-600 p-3 rounded-xl mb-4"
                >
                    <Text className="text-white text-center">+ Add Pastor</Text>
                </Pressable>

                <FlatList
                    data={pastors}
                    keyExtractor={(item) => item.id.toString()}
                    refreshing={refreshing}
                    onRefresh={refreshPastors}
                    renderItem={({ item }) => <PastorCard item={item} />}
                />
            </View>
        </>
    );
}