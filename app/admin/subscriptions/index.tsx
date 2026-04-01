import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

export default function SubscriptionsSearch() {
    const [memberId, setMemberId] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        if (!memberId) {
            alert('Enter Member ID');
            return;
        }

        router.push({
            pathname: '/admin/subscriptions/[memberId]',
            params: { memberId },
        });
    };

    return (
        <View className="flex-1 bg-gray-100 p-4">
            <Text className="text-xl font-bold mb-4">Subscriptions</Text>

            <TextInput
                placeholder="Enter Member ID"
                value={memberId}
                keyboardType="numeric"
                onChangeText={setMemberId}
                className="bg-white p-3 rounded-xl mb-3"
            />

            <Pressable
                onPress={handleSearch}
                className="bg-blue-600 p-3 rounded-xl"
            >
                <Text className="text-white text-center font-bold">
                    Search
                </Text>
            </Pressable>
        </View>
    );
}