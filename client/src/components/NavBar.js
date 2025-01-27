import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../index.css';  // Ensure this import exists to apply the styles

const NavBar = () => {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/register');
    };

    return (
        <nav className="navbar">
            <ul>
            <li><Link to="/" className="nav-button">Home</Link></li>
            {!isAuthenticated ? (
                <li><Link to="/register" className="nav-button">Register/Login</Link></li>
            ) : (
                <>
                    <li><Link to="/closet" className="nav-button">Closet</Link></li>
                    <li><Link to="/outfit-creator" className="nav-button">Outfit Creator</Link></li>
                    {/* <Link to="/dashboard" className="nav-button">Dashboard</Link> */}
                    <li><button onClick={handleLogout} className="nav-button">Logout</button></li>

                </>
            )}
            </ul>
        </nav>
    );
};

export default NavBar;