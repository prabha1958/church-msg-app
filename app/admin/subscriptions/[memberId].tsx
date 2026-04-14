import AppHeader from '@/app/components/AppHeader';
import MemberMenuModal from '@/app/components/MemberMenuModal';
import api from '@/services/api';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function SubscriptionDetails() {
    const { memberId } = useLocalSearchParams();

    const [member, setMember] = useState<any>(null);
    const [months, setMonths] = useState<any[]>([]);
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
    const [monthlyFee, setMonthlyFee] = useState(0);
    const [paymentMode, setPaymentMode] = useState('cash');
    const [referenceNo, setReferenceNo] = useState('');
    const [paidAmount, setPaidAmount] = useState(0);
    const [dueAmount, setDueAmount] = useState(0);
    const [financialYear, setFinancialYear] = useState('');

    const [confirmVisible, setConfirmVisible] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    const loadDue = async () => {
        try {
            const res = await api.get(`/admin/subscriptions/${memberId}/due`);
            const data = res.data;

            setMember(data.member);
            setMonths(data.months);
            setSelectedMonths(data.months.filter((m: any) => m.due).map((m: any) => m.month));
            setMonthlyFee(data.subscription.monthly_fee);
            setPaidAmount(data.paid_amount ?? 0);
            setDueAmount(data.due_amount ?? 0);
            setFinancialYear(data.subscription.financial_year ?? '');
        } catch (e) {
            alert('Failed to load subscription');
        }
    };

    useEffect(() => {
        loadDue();
    }, []);

    const toggleMonth = (month: string) => {
        setSelectedMonths((prev) =>
            prev.includes(month)
                ? prev.filter((m) => m !== month)
                : [...prev, month]
        );
    };

    const total = selectedMonths.length * monthlyFee;

    const handlePay = async () => {
        setConfirmVisible(false);
        setProcessing(true);

        if (selectedMonths.length === 0) {
            alert('Please select months');
            return;
        }

        if (!referenceNo || referenceNo.trim() === '') {
            alert('Reference number required');
            return;
        }

        setConfirmVisible(false);
        setProcessing(true);

        try {
            await api.post(`/admin/subscriptions/${memberId}/pay-offline`, {
                months: selectedMonths,
                payment_mode: paymentMode,
                reference_no: referenceNo,
            });

            setProcessing(false);
            setSuccessVisible(true);
            loadDue();
        } catch (e: any) {
            setProcessing(false);
            alert(e.response?.data?.message || 'Payment failed');
        }
    };

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

                    <View className='mb-4'>
                        <AppHeader title={"Subscription "} onMenuPress={() => setMenuOpen(true)} />
                    </View>
                    <MemberMenuModal visible={menuOpen}
                        onClose={() => setMenuOpen(false)} />
                    <View className="flex-row justify-between mb-4"></View>

                    <ScrollView className="flex-1 bg-[#5789c2] p-4 rounded-xl">



                        {/* Top Summary */}
                        {member && (
                            <View className="bg-[#a3cdf7] p-4 rounded-xl mb-4">
                                <Text className="font-bold text-xl">{member.family_name} {member.first_name} {member.last_name}</Text>
                                <Text className='text-sm font-bold text-blue-950'>Member ID: {memberId}</Text>
                                <Text className='text-sm font-bold text-blue-950'>Financial Year: {financialYear}</Text>
                                <Text className='text-sm font-bold text-blue-950' >Monthly Subscription: {monthlyFee}</Text>
                                <Text className="text-green-600 text-xl font-bold">Paid: ₹{paidAmount}</Text>
                                <Text className="text-red-600">Due: ₹{dueAmount}</Text>
                            </View>
                        )}

                        {/* Months */}
                        <View className="bg-white p-4 rounded-xl mb-4">
                            <Text className="font-bold mb-2">Select Months</Text>

                            {months.map((m: any) => (
                                <Pressable
                                    key={m.month}
                                    onPress={() => !m.paid && toggleMonth(m.month)}
                                    className={`p-3 rounded-lg mb-2 ${m.paid
                                        ? 'bg-green-200'
                                        : selectedMonths.includes(m.month)
                                            ? 'bg-amber-200'
                                            : 'bg-gray-200'
                                        }`}
                                >
                                    <Text className="capitalize">
                                        {m.month} {m.paid ? '(Paid)' : ''}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        {/* Payment */}
                        <View className="bg-white p-4 rounded-xl mb-4">
                            <TextInput
                                placeholder="Reference Number"
                                value={referenceNo}
                                onChangeText={setReferenceNo}
                                className="bg-gray-100 p-3 rounded-xl mb-3"
                            />

                            <Pressable
                                onPress={() =>
                                    setPaymentMode(paymentMode === 'cash' ? 'upi' : 'cash')
                                }
                                className="bg-gray-200 p-3 rounded-xl mb-3"
                            >
                                <Text>Payment Mode: {paymentMode.toUpperCase()}</Text>
                            </Pressable>

                            <Text className="font-bold mb-3">
                                Total Amount: ₹{total}
                            </Text>

                            <Pressable
                                onPress={() => {
                                    if (selectedMonths.length === 0) {
                                        alert('Please select at least one month');
                                        return;
                                    }

                                    if (!referenceNo || referenceNo.trim() === '') {
                                        alert('Please enter reference number');
                                        return;
                                    }

                                    setConfirmVisible(true);
                                }}
                                className="bg-green-600 p-4 rounded-xl"
                            >
                                <Text className="text-white text-center font-bold">
                                    Pay
                                </Text>
                            </Pressable>
                        </View>

                        {/* Confirmation Modal */}
                        <Modal visible={confirmVisible} transparent animationType="fade">
                            <View className="flex-1 justify-center items-center bg-black/50">
                                <View className="bg-white p-6 rounded-xl w-80">
                                    <Text className="font-bold mb-2">Confirm Payment</Text>
                                    <Text>Member: {member?.name}</Text>
                                    <Text>Months: {selectedMonths.join(', ')}</Text>
                                    <Text>Mode: {paymentMode}</Text>
                                    <Text>Reference: {referenceNo}</Text>
                                    <Text>Total: ₹{total}</Text>

                                    <Pressable
                                        onPress={handlePay}
                                        className="bg-green-600 p-3 rounded-xl mt-4"
                                    >
                                        <Text className="text-white text-center">
                                            Confirm Payment
                                        </Text>
                                    </Pressable>

                                    <Pressable
                                        onPress={() => setConfirmVisible(false)}
                                        className="mt-2"
                                    >
                                        <Text className="text-center text-red-500">Cancel</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Modal>

                        {/* Processing Modal */}
                        <Modal visible={processing} transparent animationType="fade">
                            <View className="flex-1 justify-center items-center bg-black/50">
                                <View className="bg-white p-6 rounded-xl items-center">
                                    <ActivityIndicator size="large" />
                                    <Text className="mt-3">Processing Payment...</Text>
                                </View>
                            </View>
                        </Modal>

                        {/* Success Modal */}
                        <Modal visible={successVisible} transparent animationType="fade">
                            <View className="flex-1 justify-center items-center bg-black/50">
                                <View className="bg-white p-6 rounded-xl items-center">
                                    <Text className="text-green-600 font-bold text-lg">
                                        Payment Recorded Successfully
                                    </Text>
                                    <Pressable
                                        onPress={() => setSuccessVisible(false)}
                                        className="bg-green-600 p-3 rounded-xl mt-4"
                                    >
                                        <Text className="text-white">OK</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Modal>

                    </ScrollView>
                </KeyboardAwareScrollView>
            </KeyboardAvoidingView>
        </>
    );
}