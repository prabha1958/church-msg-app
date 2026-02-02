import AsyncStorage from "@react-native-async-storage/async-storage";

export async function syncSessionFromServer() {
    const token = await AsyncStorage.getItem("auth_token");
    if (!token) return;

    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/member/session`, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

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
