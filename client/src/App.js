import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import RegisterLoginPage from './components/RegisterLoginPage';
import ClosetPage from './components/ClosetPage';
import OutfitCreatorPage from './components/OutfitCreatorPage';
// import DashboardPage from './components/DashboardPage';
import HomePage from './pages/HomePage';
import { AuthProvider } from './context/AuthContext';
import './index.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <NavBar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterLoginPage />} />
                    <Route path="/login" element={<RegisterLoginPage />} />
                    <Route path="/closet" element={<ClosetPage />} />
                    <Route path="/outfit-creator" element={<OutfitCreatorPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;