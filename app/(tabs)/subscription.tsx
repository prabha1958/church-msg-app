import { apiFetch } from "@/lib/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../components/AppHeader";
import MemberMenuModal from "../components/MemberMenuModal";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

type Row = {
    month: string;
    payment_id: number | null;
    paid_at: string | null;
    status: "paid" | "unpaid";
};

type ApiResponse = {
    success: boolean;
    member: {
        id: number;
        name: string;
        membership_fee: number;
    };
    subscription: {
        financial_year: string;
    } | null;
    months: Row[];
    fy: string;
};




export default function Subscription() {

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<ApiResponse | null>(null);
    const [rows, setRows] = useState<Row[]>([]);
    const [menuOpen, setMenuOpen] = useState(false);





    useEffect(() => {
        fetchSubscription();
    }, []);


    const buildRows = (
        months: string[],
        subscription: any
    ): Row[] => {
        return months.map((month): Row => {
            const paymentId = subscription?.[`${month}_payment_id`] ?? null;
            const paidAt = subscription?.[`${month}_paid_at`] ?? null;

            return {
                month: month.toUpperCase(),
                payment_id: paymentId ? Number(paymentId) : null,
                paid_at: paidAt,
                status: paymentId ? "paid" : "unpaid",
            };
        });
    };



    const fetchSubscription = async () => {
        try {
            const memberStr = await AsyncStorage.getItem("member");
            if (!memberStr) throw new Error("Member missing");

            const member = JSON.parse(memberStr);

            const res = await apiFetch(
                `${process.env.EXPO_PUBLIC_API_URL}/subscriptions/${member.id}`,
                {
                }
            );
            const json = await res.json();

            const transformedRows = buildRows(
                json.months,
                json.subscription
            );

            setData(json);
            setRows(transformedRows);

        } catch (e) {
            console.log("Failed to load subscription", e);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-[#040c1f] items-center justify-center">
                <Text className="text-amber-400 text-lg">Loading subscription…</Text>
            </SafeAreaView>
        );
    }

    if (!data) {
        return (
            <SafeAreaView className="flex-1 bg-[#040c1f] items-center justify-center">
                <Text className="text-red-400">Failed to load data</Text>
            </SafeAreaView>
        );
    }

    const logo = require("../../assets/images/icon.png")



    return (
        <SafeAreaView className="flex-1 bg-[#040c1f] p-2">
            {/* Header */}
            <View className="bg-[#071633]  py-4 border-b border-[#102a56]">
                <AppHeader title="Subscription" onMenuPress={() => setMenuOpen(true)} />
                <MemberMenuModal visible={menuOpen}
                    onClose={() => setMenuOpen(false)} />

                <View className="mt-2">
                    <Text className="text-slate-300">
                        Name: <Text className="text-amber-300 text-xl">{data.member.name}</Text>
                    </Text>

                    <Text className="text-slate-300">
                        Member ID: <Text className="text-blue-50">{data.member.id}</Text>
                    </Text>

                    <Text className="text-slate-300">
                        Financial Year:{" "}
                        <Text className="text-amber-300">
                            {data.fy ?? "—"}
                        </Text>
                    </Text>
                </View>
            </View>

            {/* Table Header */}
            <View className="flex-row px-3 py-3 border-b border-[#102a56] border border-amber-200">
                <Text className="flex-1 text-amber-400 font-semibold">Month</Text>
                <Text className="flex-1 text-center text-amber-400 font-semibold">
                    Payment
                </Text>
                <Text className="flex-1 text-center text-amber-400 font-semibold">
                    Paid At
                </Text>
                <Text className="flex-1 text-center text-amber-400 font-semibold">
                    Status
                </Text>
            </View>

            {/* Table Rows */}
            <FlatList
                data={rows}
                keyExtractor={(item, index) => `${item.month}-${index}`}
                contentContainerStyle={{ paddingBottom: 40 }}
                renderItem={({ item }) => (
                    <View className="flex-row px-3 py-4 border border-amber-200">
                        <Text className="flex-1 text-slate-200">
                            {item.month}
                        </Text>

                        <Text className="flex-1 text-center text-slate-300">
                            {item.payment_id ?? "—"}
                        </Text>

                        <Text className="flex-1 text-center text-slate-300">
                            {item.paid_at ?? "—"}
                        </Text>

                        <View className="flex-1 items-center">
                            <Text
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === "paid"
                                    ? "bg-green-600 text-white"
                                    : "bg-slate-600 text-white"
                                    }`}
                            >
                                {item.status === "paid" ? "PAID" : "UNPAID"}
                            </Text>
                        </View>
                    </View>
                )}
            />

        </SafeAreaView>
    );
}
