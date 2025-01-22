import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NavBar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://127.0.0.1:5000/logout', {}, { withCredentials: true });
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/closet">Closet</Link></li>
                <li><Link to="/outfit-creator">Outfit Creator</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
                <li><Link to="/register">Register/Login</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
        </nav>
    );
};

export default NavBar;