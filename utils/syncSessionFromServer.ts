import AsyncStorage from "@react-native-async-storage/async-storage";
import { apiFetch } from "@/lib/api";

export async function syncSessionFromServer() {
    const res = await apiFetch(`${process.env.EXPO_PUBLIC_API_URL}/member/session`);

    if (!res.ok) {
        const text = await res.text();
        console.log("Session sync failed:", text);
        return;
    }

    const data = await res.json();

    await AsyncStorage.multiSet([
        ["member", JSON.stringify(data.member)],
        ["alliance", JSON.stringify(data.alliance)],
    ]);
}
