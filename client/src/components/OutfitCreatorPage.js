import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OutfitCreatorPage = () => {
    const [clothingItems, setClothingItems] = useState([]);
    const [outfit, setOutfit] = useState({
        top: '',
        bottom: '',
        shoes: '',
        accessories: ''
    });
    const [savedOutfit, setSavedOutfit] = useState(null);

    useEffect(() => {
        fetchClothingItems();
    }, []);

    const fetchClothingItems = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/clothing', {
                withCredentials: true
            });
            setClothingItems(response.data);
        } catch (error) {
            console.error("Error fetching clothing items:", error);
        }
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        setOutfit({ ...outfit, [name]: value });
    };

    const handleSaveOutfit = () => {
        const selectedItems = Object.values(outfit).filter(id => id);
        if (selectedItems.length === 0) {
            alert("Please select at least one item to save the outfit.");
            return;
        }

        const selectedImages = Object.keys(outfit).map(category => {
            const item = clothingItems.find(item => item.id === parseInt(outfit[category]));
            return item ? item.image_url : null;
        }).filter(Boolean);

        setSavedOutfit(selectedImages);
    };

    return (
        <div>
            <h2>Create Your Outfit</h2>

            <div>
                <label>Top:</label>
                <select name="top" value={outfit.top} onChange={handleSelectChange}>
                    <option value="">Select a top</option>
                    {clothingItems.filter(item => item.category === 'Tops').map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label>Bottom:</label>
                <select name="bottom" value={outfit.bottom} onChange={handleSelectChange}>
                    <option value="">Select a bottom</option>
                    {clothingItems.filter(item => item.category === 'Bottoms').map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label>Shoes:</label>
                <select name="shoes" value={outfit.shoes} onChange={handleSelectChange}>
                    <option value="">Select shoes</option>
                    {clothingItems.filter(item => item.category === 'Shoes').map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label>Accessories:</label>
                <select name="accessories" value={outfit.accessories} onChange={handleSelectChange}>
                    <option value="">Select accessories</option>
                    {clothingItems.filter(item => item.category === 'Accessories').map(item => (
                        <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
            </div>

            <button onClick={handleSaveOutfit}>Save Outfit</button>

            {savedOutfit && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', 
                    justifyContent: 'center', alignItems: 'center', flexDirection: 'column'
                }}>
                    <button onClick={() => setSavedOutfit(null)} style={{ marginBottom: '20px', padding: '10px' }}>
                        Close Outfit
                    </button>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {savedOutfit.map((image, index) => (
                            <img key={index} src={image} alt="Outfit item" style={{ maxHeight: '400px' }} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OutfitCreatorPage;