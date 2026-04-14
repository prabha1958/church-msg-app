import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    timeout: 60000, // 20 seconds
});
api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('auth_token');


    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    const fullUrl = `${config.baseURL ?? ''}${config.url ?? ''}`;


    return config;
});
export default api;