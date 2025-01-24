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
    const [savedOutfits, setSavedOutfits] = useState([]); // Store saved outfits
    const [previewOutfit, setPreviewOutfit] = useState(null);
    const [editingOutfitIndex, setEditingOutfitIndex] = useState(null);

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

    const handleGenerateOutfit = () => {
        const selectedItems = Object.values(outfit).filter(id => id);
        if (selectedItems.length === 0) {
            alert("Please select at least one item to generate an outfit.");
            return;
        }

        const selectedImages = Object.keys(outfit).map(category => {
            const item = clothingItems.find(item => item.id === parseInt(outfit[category]));
            return item ? item.image_url : null;
        }).filter(Boolean);

        setPreviewOutfit(selectedImages);
    };

    const handleSaveOutfit = () => {
        if (previewOutfit && previewOutfit.length > 0) {
            if (editingOutfitIndex !== null) {
                const updatedOutfits = [...savedOutfits];
                updatedOutfits[editingOutfitIndex] = previewOutfit;
                setSavedOutfits(updatedOutfits);
                setEditingOutfitIndex(null);
            } else {
                setSavedOutfits([...savedOutfits, previewOutfit]);
            }
            setPreviewOutfit(null); // Close preview after saving
        }
    };

    const handleEditOutfit = (index) => {
        setPreviewOutfit(savedOutfits[index]);
        setEditingOutfitIndex(index);
    };

    const handleDeleteOutfit = (index) => {
        if (window.confirm("Are you sure you want to delete this outfit?")) {
            const updatedOutfits = savedOutfits.filter((_, idx) => idx !== index);
            setSavedOutfits(updatedOutfits);
        }
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

            <button onClick={handleGenerateOutfit}>Generate</button>

            <div>
                <h3>Saved Outfits</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    {savedOutfits.map((outfit, index) => (
                        <div 
                            key={index} 
                            style={{ border: '1px solid #ddd', padding: '10px', cursor: 'pointer' }}
                            onClick={() => handleEditOutfit(index)}
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                                {outfit.map((image, idx) => (
                                    <img key={idx} src={image} alt="Outfit item" style={{ maxHeight: '150px' }} />
                                ))}
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteOutfit(index); }}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>

            {previewOutfit && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
                    backgroundColor: 'rgba(0, 0, 0, 0.8)', display: 'flex', 
                    justifyContent: 'center', alignItems: 'center', flexDirection: 'column'
                }}>
                    <button onClick={() => setPreviewOutfit(null)} style={{ marginBottom: '20px', padding: '10px' }}>
                        Close Outfit
                    </button>
                    <button onClick={handleSaveOutfit} style={{ marginBottom: '20px', padding: '10px' }}>
                        Save
                    </button>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {previewOutfit.map((image, index) => (
                            <img key={index} src={image} alt="Outfit item" style={{ maxHeight: '400px' }} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OutfitCreatorPage;