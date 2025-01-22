import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:5000";

export const registerUser = async (userData) => {
    return await axios.post(`${API_BASE_URL}/register`, userData);
};

export const loginUser = async (loginData) => {
    return await axios.post(`${API_BASE_URL}/login`, loginData);
};

export const getClothingItems = async () => {
    return await axios.get(`${API_BASE_URL}/clothing`);
};

export const uploadClothingItem = async (formData) => {
    return await axios.post(`${API_BASE_URL}/clothing/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const updateClothingItem = async (id, updatedData) => {
    return await axios.patch(`${API_BASE_URL}/clothing/${id}`, updatedData);
};

export const deleteClothingItem = async (id) => {
    return await axios.delete(`${API_BASE_URL}/clothing/${id}`);
};