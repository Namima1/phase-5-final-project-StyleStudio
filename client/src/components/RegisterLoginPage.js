import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterLoginPage = () => {
    const { setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [isRegistering, setIsRegistering] = useState(true);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = isRegistering 
            ? 'http://localhost:5000/register' 
            : 'http://localhost:5000/login';
    
        console.log("Submitting:", formData);  // Debugging
    
        try {
            await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
    
            alert(`${isRegistering ? 'Registration' : 'Login'} successful!`);
            setIsAuthenticated(true);
            navigate('/');
        } catch (error) {
            console.error(`Error ${isRegistering ? 'registering' : 'logging in'}:`, error.response?.data || error.message);
            alert(error.response?.data?.error || `Failed to ${isRegistering ? 'register' : 'login'}`);
        }
    };    

    return (
        <div>
            <h2>{isRegistering ? 'Register' : 'Login'}</h2>
            <form onSubmit={handleSubmit}>
                {isRegistering && (
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                )}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">{isRegistering ? "Register" : "Login"}</button>
            </form>
            <button onClick={() => setIsRegistering(!isRegistering)}>
                {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
            </button>
        </div>
    );
};

export default RegisterLoginPage;