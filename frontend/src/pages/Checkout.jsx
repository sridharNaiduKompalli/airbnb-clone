import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, token } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // If accessed without proper state (not from a listing page)
  if (!state?.listing) {
    navigate('/');
    return null;
  }

  const { listing, checkIn, checkOut } = state;
  const nights = 3; // Hardcoded for demo, normally calculated from dates
  const total = listing.price * nights + 120; // + cleaning fee

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please log in to book this property.");
      navigate('/login');
      return;
    }

    setLoading(true);
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    try {
      const res = await fetch(`${baseUrl}/api/bookings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Though our backend doesn't strictly require it yet, it's good practice
        },
        body: JSON.stringify({
          listing_id: listing.id,
          check_in: checkIn || "2026-10-01",
          check_out: checkOut || "2026-10-04",
          guest_name: user.name,
          total_price: total
        })
      });
      
      if (!res.ok) throw new Error('Booking failed');
      alert('Payment successful! Your trip is booked.');
      navigate('/');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-[#FDFBF7]">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Payment Form */}
        <div className="flex-1">
          <h2 className="text-3xl font-[Georgia] text-[#1D3E2F] mb-6">Confirm and pay</h2>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h3 className="text-xl font-medium mb-4">Pay with</h3>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card number</label>
                <input required type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiration</label>
                  <input required type="text" placeholder="MM/YY" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                  <input required type="text" placeholder="123" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zip code</label>
                <input required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
              </div>
              <button disabled={loading} type="submit" className="w-full py-3 bg-[#E51D53] text-white rounded-lg font-medium text-lg mt-6 hover:bg-[#D41849] transition">
                {loading ? 'Processing...' : 'Request to book'}
              </button>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="w-full md:w-[350px]">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
              <img src={listing.image} className="w-24 h-24 object-cover rounded-xl" alt={listing.title} />
              <div>
                <p className="text-xs text-gray-500 uppercase">{listing.type}</p>
                <p className="font-medium text-gray-900 line-clamp-2">{listing.title}</p>
                <p className="text-sm flex items-center mt-1">★ {listing.rating} ({listing.reviews_count} reviews)</p>
              </div>
            </div>
            
            <h3 className="font-medium text-lg mb-4">Price details</h3>
            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 text-gray-600">
              <div className="flex justify-between">
                <span>${listing.price} x {nights} nights</span>
                <span>${listing.price * nights}</span>
              </div>
              <div className="flex justify-between">
                <span>Cleaning fee</span>
                <span>$120</span>
              </div>
            </div>
            
            <div className="flex justify-between font-bold text-lg text-gray-900">
              <span>Total (USD)</span>
              <span>${total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
