import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import AppHeader from '../components/AppHeader';
import MemberMenuModal from '../components/MemberMenuModal';






export default function AdminDashboard() {

    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <ScrollView className="flex-1 bg-gray-100 p-4">
            <View className='py-3 mt-10'>
                <AppHeader title={"Admin Dashboard"} onMenuPress={() => setMenuOpen(true)} />
            </View>


            <MemberMenuModal visible={menuOpen}
                onClose={() => setMenuOpen(false)} />

            <View className="flex-row flex-wrap justify-between">

                <AdminCard
                    title="Add Member"
                    icon="person-add"
                    color="bg-blue-500"
                    onPress={() => router.push('admin/members/add')}
                />

                <AdminCard
                    title="Edit Member"
                    icon="person-add"
                    color="bg-[#666102]"
                    onPress={() => router.push('admin/members/edit')}
                />

                <AdminCard
                    title="Send Message"
                    icon="chatbox"
                    color="bg-green-500"
                    onPress={() => router.push('/admin/messages')}
                />

                <AdminCard
                    title="Subscriptions"
                    icon="card"
                    color="bg-purple-500"
                    onPress={() => router.push('/admin/subscriptions')}
                />

                <AdminCard
                    title="Alliances"
                    icon="people"
                    color="bg-orange-500"
                    onPress={() => router.push('/admin/alliances')}
                />

                <AdminCard
                    title="Events"
                    icon="people"
                    color="bg-[#8ce617]"
                    onPress={() => router.push('/admin/events')}
                />

                <AdminCard
                    title="Reports"
                    icon="bar-chart"
                    color="bg-indigo-500"
                    onPress={() => router.push('/admin/reports')}
                />

                <AdminCard
                    title="Settings"
                    icon="settings"
                    color="bg-gray-600"
                    onPress={() => router.push('/admin/settings')}
                />

            </View>
        </ScrollView>
    );
}


type AdminCardProps = {
    title: string;
    icon: any;
    color: string;
    onPress: () => void;
};

function AdminCard({ title, icon, color, onPress }: AdminCardProps) {
    return (
        <Pressable
            onPress={onPress}
            className={`w-[48%] ${color} p-5 rounded-2xl mb-4`}
        >
            <Ionicons name={icon} size={32} color="white" />
            <Text className="text-white text-lg mt-3 font-semibold">
                {title}
            </Text>
        </Pressable>
    );
}