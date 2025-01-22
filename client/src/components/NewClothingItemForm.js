import React, { useState, useEffect } from 'react';
import { getUsers, addClothingItem } from '../utils/api';

const NewClothingItemForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        user_id: ''
    });
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        async function fetchUsers() {
            try {
                const userData = await getUsers();
                setUsers(userData);
            } catch (error) {
                console.error("Error fetching users:", error);
                setError('Failed to load users.');
            }
        }
        fetchUsers();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.name || !formData.category || !formData.user_id) {
            setError('All fields are required');
            return;
        }
        try {
            await addClothingItem(formData);
            setFormData({ name: '', category: '', user_id: '' });
            setSuccess('Clothing item added successfully!');
        } catch (err) {
            setError(err.response?.data?.error || 'Error adding clothing item. Please try again.');
        }
    };

    return (
        <div>
            <h2>Add New Clothing Item</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Item Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="category"
                    placeholder="Category (e.g., Tops, Bottoms)"
                    value={formData.category}
                    onChange={handleChange}
                    required
                />
                <select name="user_id" value={formData.user_id} onChange={handleChange} required>
                    <option value="">Select User</option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.username}
                        </option>
                    ))}
                </select>
                <button type="submit">Add Item</button>
            </form>
        </div>
    );
};

export default NewClothingItemForm;