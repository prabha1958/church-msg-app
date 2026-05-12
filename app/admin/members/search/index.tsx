import api from '@/services/api';
import { Stack, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface Member {
    id: number;
    family_name: string;
    first_name: string;
    middle_name?: string;
    last_name?: string;
    email: string;
    mobile_number: string;
    profile_photo?: string | null;
}

export default function EditMemberSearch() {
    const router = useRouter();

    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const handleSearch = async () => {
        if (!search.trim()) {
            alert('Enter member name');
            return;
        }

        try {
            setLoading(true);

            const res = await api.get(`/admin/members?search=${search}`);


            setMembers(res.data.data.data || []);

        } catch (e) {
            console.log(e);

            alert('Unable to load members');
        } finally {
            setLoading(false);
        }
    };

    const fileUrl = (path?: string | null) => {
        if (!path) return 'https://via.placeholder.com/150';

        return `${process.env.EXPO_PUBLIC_STORAGE_URL}/${path}`;
    };

    return (
        <>
            <Stack.Screen options={{ title: '' }} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1 bg-[#082775] p-4"
            >
                <KeyboardAwareScrollView extraScrollHeight={120} enableOnAndroid>


                    <View className="flex-1 bg-[#082775] p-4 pt-10">

                        <View className="bg-white p-4 rounded-xl mb-4">

                            <Text className="font-bold mb-3">
                                Enter member first name or last name to search
                            </Text>

                            <TextInput
                                placeholder="Enter Member's first name or last name"
                                value={search}
                                onChangeText={(text) => {
                                    setSearch(text);

                                    if (text.trim() === '') {
                                        setMembers([]);
                                    }
                                }}
                                className="bg-gray-100 p-3 rounded-xl mb-3"
                            />

                            <Pressable
                                onPress={handleSearch}
                                className="bg-blue-600 p-4 rounded-xl"
                            >
                                <Text className="text-white text-center font-bold">
                                    Search Member
                                </Text>
                            </Pressable>
                        </View>

                        {loading && (
                            <ActivityIndicator size="large" color="#fff" />
                        )}

                        {members.map((m) => (
                            <Pressable
                                key={m.id}
                                onPress={() =>
                                    router.push(`/admin/members/edit/${m.id}`)
                                }
                                className="bg-white p-3 rounded-xl mb-3 flex-row items-center"
                            >
                                <Image
                                    source={{
                                        uri: fileUrl(m.profile_photo),
                                    }}
                                    className="w-20 h-20 rounded-lg mr-3"
                                />

                                <View>
                                    <Text className="font-bold text-lg">
                                        {m.id}
                                    </Text>

                                    <Text className="font-bold text-lg">
                                        {m.first_name} {m.last_name}
                                    </Text>

                                    <Text className="text-gray-600">
                                        {m.mobile_number}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}

                    </View>
                </KeyboardAwareScrollView>
            </KeyboardAvoidingView>

        </>
    );
}