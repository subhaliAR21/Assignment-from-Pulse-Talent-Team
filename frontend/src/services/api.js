import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export const loginUser = (formData) => API.post('/auth/login', formData);
export const registerUser = (formData) => API.post('/auth/register', formData); // Correct signup endpoint
export const getVideos = () => API.get('/videos');
export const uploadVideo = (formData, onProgress) => API.post('/videos/upload', formData, {
    onUploadProgress: onProgress
});

export default API;