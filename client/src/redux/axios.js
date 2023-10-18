import axios from 'axios';
import Cookies from 'js-cookie'

const instance = axios.create({
    baseURL: 'https://clarifier-api.onrender.com',
    headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
    credentials: 'include',
    withCredentials: true,
});

instance.interceptors.request.use((config) => {
    config.headers.Authorization = Cookies.get('token');
    return config;
})

export default instance;