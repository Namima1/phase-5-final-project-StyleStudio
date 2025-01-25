import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ClosetPage = () => {
    const [clothingItems, setClothingItems] = useState([]);
    const [showUploadForm, setShowUploadForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const {userId} = useContext(AuthContext)
    console.log(userId)

    useEffect(() => {
        fetchClothingItems();
    }, []);

    const fetchClothingItems = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/clothing', { withCredentials: true });
            setClothingItems(response.data);
        } catch (err) {
            console.error("Error fetching clothing items:", err);
        }
    };

    const uploadSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        category: Yup.string().required('Category is required'),
        image: Yup.mixed().required('Image is required')
    });

    const handleFormSubmit = async (values, { resetForm }) => {
        const reader = new FileReader();
        reader.readAsDataURL(values.image);
        reader.onloadend = async () => {
            const base64Image = reader.result;

            const payload = {
                name: values.name,
                category: values.category,
                user_id: userId,
                image: base64Image,
            };

            try {
                if (editingItem) {
                    // Update existing item
                    await axios.patch(`http://127.0.0.1:5000/clothing/${editingItem.id}`, payload, {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true
                    });
                    alert('Item updated successfully!');
                    setEditingItem(null);
                } else {
                    // Add new item
                    await axios.post('http://127.0.0.1:5000/clothing/upload_base64', payload, {
                        headers: { 'Content-Type': 'application/json' },
                        withCredentials: true
                    });
                    alert('Item uploaded successfully!');
                }
                fetchClothingItems();
                resetForm();
                setShowUploadForm(false);
            } catch (error) {
                console.error('Error uploading:', error);
                alert('Failed to upload item.');
            }
        };
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await axios.delete(`http://127.0.0.1:5000/clothing/${id}`, { withCredentials: true });
                fetchClothingItems();
                alert('Item deleted successfully!');
            } catch (error) {
                console.error('Error deleting item:', error);
                alert('Failed to delete item.');
            }
        }
    };

    return (
        <div>
            <h2>Your Closet</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {clothingItems.length > 0 ? (
                    clothingItems.map(item => (
                        <div key={item.id} style={{ border: '1px solid black', padding: '10px' }}>
                            <img src={item.image_url} alt={item.name} style={{ width: '100%' }} />
                            <h3>{item.name}</h3>
                            <p>Category: {item.category}</p>
                            <button onClick={() => { setEditingItem(item); setShowUploadForm(true); }}>Edit</button>
                            <button onClick={() => handleDelete(item.id)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No clothing items found.</p>
                )}
            </div>

            <button onClick={() => { setEditingItem(null); setShowUploadForm(true); }}>Upload New Item</button>

            {showUploadForm && (
                <Formik
                    initialValues={{
                        name: editingItem ? editingItem.name : '',
                        category: editingItem ? editingItem.category : '',
                        image: null
                    }}
                    validationSchema={uploadSchema}
                    onSubmit={handleFormSubmit}
                >
                    {({ setFieldValue }) => (
                        <Form encType="multipart/form-data">
                            <Field type="text" name="name" placeholder="Name" />
                            <ErrorMessage name="name" component="div" />

                            <Field as="select" name="category">
                                <option value="">Select Category</option>
                                <option value="Tops">Tops</option>
                                <option value="Bottoms">Bottoms</option>
                                <option value="Shoes">Shoes</option>
                                <option value="Accessories">Accessories</option>
                            </Field>
                            <ErrorMessage name="category" component="div" />

                            <input
                                type="file"
                                name="image"
                                onChange={(event) => setFieldValue('image', event.currentTarget.files[0])}
                            />
                            <ErrorMessage name="image" component="div" />

                            <button type="submit">{editingItem ? "Update" : "Upload"}</button>
                        </Form>
                    )}
                </Formik>
            )}
        </div>
    );
};

export default ClosetPage;