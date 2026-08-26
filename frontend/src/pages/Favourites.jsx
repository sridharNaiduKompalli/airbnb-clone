import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import ListingCard from '../components/ListingCard.jsx';

export default function Favourites() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${baseUrl}/api/favourites`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setFavourites(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user, token, navigate]);

  if (loading) return <div className="min-h-screen pt-24 text-center text-gray-500">Loading your favourites...</div>;

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-[Georgia] text-[#1D3E2F] mb-1">Your Favourites</h1>
          <p className="text-gray-500">Places you've saved for later.</p>
        </div>

        {favourites.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No favourites yet</h3>
            <p className="text-gray-500 mb-6">Click the heart icon on any listing to save it here.</p>
            <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-[#1D3E2F] text-white rounded-lg font-medium hover:bg-[#152D22] transition">
              Browse Listings
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {favourites.map(listing => (
              <ListingCard
                key={listing.id}
                listing={listing}
                showTotal={false}
                onClick={() => navigate(`/listing/${listing.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
