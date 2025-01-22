import React, { useState } from 'react';
import axios from 'axios';

const RegisterLoginPage = () => {
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
            ? 'http://127.0.0.1:5000/register' 
            : 'http://127.0.0.1:5000/login';

        try {
            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });

            console.log(`${isRegistering ? 'Registration' : 'Login'} successful:`, response.data);
            alert(`${isRegistering ? 'Registration' : 'Login'} successful!`);
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