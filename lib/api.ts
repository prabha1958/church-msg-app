import AsyncStorage from "@react-native-async-storage/async-storage";

export async function apiFetch(url: string, options: any = {}) {
    const token = await AsyncStorage.getItem("auth_token");

    return fetch(url, {
        ...options,
        headers: {
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            ...(options.headers || {}),
        },
    });
}
