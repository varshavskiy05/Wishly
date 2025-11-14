import axios from "axios";
import Constants from "expo-constants";

const BASE_URL = Constants.expoConfig?.extra?.BASE_URL || "http://localhost:4000";


export const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(async (config) => {
    const token = 'mock-token';
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
})