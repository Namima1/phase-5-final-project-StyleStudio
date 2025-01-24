import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClosetPage = () => {
    const [clothingItems, setClothingItems] = useState([]);
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        category: '',
        file: null
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchClothingItems();
    }, []);

    const fetchClothingItems = async () => {
        try {
            const response = await axios.get('http://localhost:5000/clothing', { withCredentials: true });
            setClothingItems(response.data);
        } catch (error) {
            console.error('Error fetching clothing items:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, file: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('category', formData.category);
        if (formData.file) {
            data.append('file', formData.file);
        }
    
        console.log([...data.entries()]);  // Debugging to check form data
    
        try {
            if (isEditing) {
                await axios.patch(`http://localhost:5000/clothing/${formData.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                });
                alert('Item updated successfully!');
            } else {
                await axios.post('http://localhost:5000/clothing/upload', data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    withCredentials: true
                });
                alert('Item uploaded successfully!');
            }
            fetchClothingItems();
            setFormData({ id: '', name: '', category: '', file: null });
            setIsEditing(false);
        } catch (error) {
            console.error('Error uploading/updating item:', error);
            alert('Failed to upload/update item.');
        }
    };

    const handleEdit = (item) => {
        setFormData({ id: item.id, name: item.name, category: item.category });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await axios.delete(`http://localhost:5000/clothing/${id}`, { withCredentials: true });
                alert('Item deleted successfully!');
                fetchClothingItems();
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('Failed to delete item.');
            }
        }
    };

    return (
        <div>
            <h2>Your Closet</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input
                    type="text"
                    name="name"
                    placeholder="Item Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <select name="category" value={formData.category} onChange={handleChange} required>
                    <option value="">Select Category</option>
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                </select>
                <input type="file" name="file" onChange={handleChange} />
                <button type="submit">{isEditing ? 'Update' : 'Upload'}</button>
            </form>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {clothingItems.map(item => (
                    <div key={item.id} style={{ border: '1px solid black', padding: '10px' }}>
                        <img src={item.image_url} alt={item.name} style={{ width: '100%' }} />
                        <h3>{item.name}</h3>
                        <p>Category: {item.category}</p>
                        <button onClick={() => handleEdit(item)}>Edit</button>
                        <button onClick={() => handleDelete(item.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClosetPage;