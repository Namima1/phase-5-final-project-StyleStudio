import React, { useEffect, useState } from 'react';
// import { getClothingItems, getUsers } from '../utils/api';
import NewClothingItemForm from '../components/NewClothingItemForm';
import { getUsers, getClothingItems, addClothingItem } from '../utils/api';

const ClothingPage = () => {
    const [clothing, setClothing] = useState([]);
    const [users, setUsers] = useState([]);

    const fetchClothing = async () => {
        try {
            const data = await getClothingItems();
            setClothing(data);
        } catch (error) {
            console.error("Error fetching clothing items:", error);
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        fetchClothing();
        fetchUsers();
    }, []);

    return (
        <div>
            <h2>Clothing Items</h2>
            <NewClothingItemForm users={users} onClothingAdded={fetchClothing} />
            <ul>
                {clothing.map((item) => (
                    <li key={item.id}>{item.name} - {item.category}</li>
                ))}
            </ul>
        </div>
    );
};

export default ClothingPage;