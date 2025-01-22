import React, { useState } from 'react';
import { addUser } from '../utils/api';

const NewUserForm = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.username || !formData.email || !formData.password) {
            setError('All fields are required.');
            return;
        }

        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            await addUser(formData);
            setSuccess('User registered successfully!');
            setFormData({ username: '', email: '', password: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Error registering user.');
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <input 
                    type="text" 
                    name="username" 
                    placeholder="Username" 
                    value={formData.username} 
                    onChange={handleChange} 
                    required 
                />
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
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default NewUserForm;