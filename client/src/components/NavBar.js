import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NavBar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/register');
    };

    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                {!isAuthenticated ? (
                    <li><Link to="/register">Register/Login</Link></li>
                ) : (
                    <>
                        <li><Link to="/closet">Closet</Link></li>
                        <li><Link to="/outfit-creator">Outfit Creator</Link></li>
                        {/* <li><Link to="/dashboard">Dashboard</Link></li> */}
                        <li><button onClick={handleLogout}>Logout</button></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default NavBar;