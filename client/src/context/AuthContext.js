import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);


    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/check-session', { withCredentials: true });
                setIsAuthenticated(response.data.authenticated);
                setUserId(response.data.user_id);
            } catch (error) {
                setIsAuthenticated(false);
            }
        };
        checkAuthStatus();
    }, []);

    const logout = async () => {
        try {
            await axios.post('http://127.0.0.1:5000/logout', {}, { withCredentials: true });
            setIsAuthenticated(false);
            setUserId(null)
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, userId, setUserId, logout }}>
            {children}
        </AuthContext.Provider>
    );
}