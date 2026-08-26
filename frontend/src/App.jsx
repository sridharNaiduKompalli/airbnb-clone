import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import ListingDetail from './pages/ListingDetail.jsx';
import MyBookings from './pages/MyBookings.jsx';
import Auth from './pages/Auth.jsx';
import AddPlace from './pages/AddPlace.jsx';
import Checkout from './pages/Checkout.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Favourites from './pages/Favourites.jsx';
import UserDashboard from './pages/UserDashboard.jsx';
import Wishlist from './pages/Wishlist.jsx';

function App() {
  const [apiHealth, setApiHealth] = useState(null);

  // Monitor backend health
  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${baseUrl}/api/health`)
      .then(res => res.json())
      .then(data => setApiHealth(data))
      .catch(err => {
        console.error("Backend health check failed:", err);
        setApiHealth({ status: "DOWN", error: true });
      });
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-[#FDFBF7]">
        <Header apiHealth={apiHealth} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/listing/:id" element={<ListingDetail />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/add-place" element={<AddPlace />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/favourites" element={<Favourites />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/dashboard" element={<UserDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
