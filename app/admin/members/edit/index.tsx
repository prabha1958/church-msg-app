import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

export default function EditMemberSearch() {
    const [memberId, setMemberId] = useState('');
    const router = useRouter();

    const handleSearch = () => {
        if (!memberId) {
            alert('Enter Member ID');
            return;
        }

        router.push(`/admin/members/edit/${memberId}`);
    };

    return (
        <View className="flex-1 bg-[#082775] p-4 justify-center">
            <View className="bg-white p-4 rounded-xl">
                <Text className="font-bold mb-3">Select Member to Edit</Text>

                <TextInput
                    placeholder="Enter Member ID"
                    value={memberId}
                    onChangeText={setMemberId}
                    keyboardType="numeric"
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
        </View>
    );
}