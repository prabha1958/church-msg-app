import FormDateInput from '@/app/components/FormDateInput';
import api from '@/services/api';
import { Stack } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    ScrollView,
    Text,
    View
} from 'react-native';

export default function Reports() {
    const [selectedDate, setSelectedDate] = useState('');
    const [collections, setCollections] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const fetchDailyReport = async () => {
        if (!selectedDate) {
            alert('Please enter date');
            return;
        }

        setLoading(true);

        try {
            const res = await api.get(
                `/admin/subscriptions/daily-report?date=${selectedDate}`
            );

            setCollections(res.data);
        } catch {
            alert('Failed to fetch report');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Stack.Screen options={{ title: '' }} />
            <ScrollView className="p-4 bg-white">

                <Text className="text-xl font-bold mb-4">
                    Daily Collection Report
                </Text>

                {/* Date Input */}
                <Text>Enter Date (YYYY-MM-DD)</Text>

                <FormDateInput
                    label="Enter Date "
                    value={selectedDate}
                    onChangeText={setSelectedDate}
                />


                {/* Fetch Button */}
                <Pressable
                    onPress={fetchDailyReport}
                    className="bg-blue-600 p-3 rounded-xl mb-4"
                >
                    <Text className="text-white text-center">
                        Get Report
                    </Text>
                </Pressable>

                {loading && <ActivityIndicator />}

                {/* Report */}
                {collections && (
                    <View className="mt-4">

                        <Text className="font-bold text-lg">
                            Date: {selectedDate}
                        </Text>

                        <Text>Admin: {collections.admin_name}</Text>

                        {/* Payments List */}
                        <Text className="font-bold mt-4 mb-2">
                            Payments
                        </Text>

                        <FlatList
                            data={collections.payments}
                            keyExtractor={(item) => item.payment_id.toString()}
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <View className="border p-2 mb-2 rounded">
                                    <Text>Member: {item.member_name}</Text>
                                    <Text>ID: {item.member_id}</Text>
                                    <Text>Date: {item.payment_date}</Text>
                                    <Text>Amount: ₹{item.amount}</Text>
                                    <Text>Mode: {item.payment_mode}</Text>
                                    <Text>Ref: {item.reference_no}</Text>
                                </View>
                            )}
                        />

                        {/* Totals */}
                        <View className="mt-4 p-3 bg-gray-100 rounded">
                            <Text>Total Transactions: {collections.total_transactions}</Text>
                            <Text>Cash: ₹{collections.mode_totals?.cash ?? 0}</Text>
                            <Text>UPI: ₹{collections.mode_totals?.upi ?? 0}</Text>
                            <Text>Other: ₹{collections.mode_totals?.other ?? 0}</Text>

                            <Text className="font-bold text-lg mt-2">
                                Grand Total: ₹{collections.total_amount}
                            </Text>
                        </View>

                    </View>
                )}
            </ScrollView>
        </>
    );
}