import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, Share, Heart, Shield, Award } from 'lucide-react';
import Loader from '../components/Loader.jsx';

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Booking Form State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');

  useEffect(() => {
    setLoading(true);
    setError(false);
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    fetch(`${baseUrl}/api/listings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load listing details");
        return res.json();
      })
      .then((data) => {
        setListing(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, [id]);

  // Calculate pricing
  const getDaysCount = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end - start;
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const days = getDaysCount();
  const basePrice = listing ? listing.price * days : 0;
  const serviceFee = Math.round(basePrice * 0.12);
  const totalPrice = basePrice + serviceFee;

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }
    if (days <= 0) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    // Pass booking details to checkout page
    navigate('/checkout', { state: { listing, checkIn, checkOut, totalPrice } });
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !listing) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Listing not found</h3>
        <p className="text-gray-500 mb-6">The listing you requested could not be retrieved.</p>
        <button onClick={() => navigate('/')} className="bg-[#1D3E2F] text-white px-6 py-2 rounded-lg font-semibold">
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center space-x-1 text-sm font-semibold text-gray-700 hover:text-black mb-6 hover:underline"
      >
        <ChevronLeft className="h-5 w-5" />
        <span>Back to listings</span>
      </button>

      {/* Title Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">{listing.title}</h1>
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-gray-950 font-semibold">
              <Star className="h-4 w-4 fill-black text-black mr-1" />
              {listing.rating.toFixed(2)}
            </span>
            <span>•</span>
            <span className="underline cursor-pointer hover:text-black">{listing.reviews_count} reviews</span>
            <span>•</span>
            <span className="underline cursor-pointer hover:text-black">{listing.location}</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition text-gray-700 hover:text-black">
              <Share className="h-4 w-4" />
              <span className="underline font-semibold text-xs">Share</span>
            </button>
            <button className="flex items-center space-x-1 hover:bg-gray-100 px-3 py-1.5 rounded-lg transition text-gray-700 hover:text-black">
              <Heart className="h-4 w-4" />
              <span className="underline font-semibold text-xs">Save</span>
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery (Airbnb 5-image Grid Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden mb-8 aspect-[16/9] md:aspect-[21/9]">
        {/* Large Main Photo */}
        <div className="md:col-span-2 h-full overflow-hidden">
          <img
            src={listing.images ? listing.images[0] : listing.image}
            alt={listing.title}
            className="h-full w-full object-cover hover:scale-102 hover:brightness-95 transition duration-300 cursor-pointer"
          />
        </div>
        {/* 4 Smaller Photos */}
        <div className="hidden md:grid grid-cols-2 col-span-2 gap-2 h-full">
          <div className="h-full overflow-hidden">
            <img
              src={listing.images && listing.images[1] ? listing.images[1] : "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&q=80&w=600"}
              alt=""
              className="h-full w-full object-cover hover:scale-105 hover:brightness-95 transition duration-300 cursor-pointer"
            />
          </div>
          <div className="h-full overflow-hidden">
            <img
              src={listing.images && listing.images[2] ? listing.images[2] : "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&q=80&w=600"}
              alt=""
              className="h-full w-full object-cover hover:scale-105 hover:brightness-95 transition duration-300 cursor-pointer"
            />
          </div>
          <div className="h-full overflow-hidden">
            <img
              src={listing.images && listing.images[3] ? listing.images[3] : "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600"}
              alt=""
              className="h-full w-full object-cover hover:scale-105 hover:brightness-95 transition duration-300 cursor-pointer"
            />
          </div>
          <div className="h-full overflow-hidden">
            <img
              src={listing.images && listing.images[4] ? listing.images[4] : "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600"}
              alt=""
              className="h-full w-full object-cover hover:scale-105 hover:brightness-95 transition duration-300 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Grid Layout: Details vs Booking Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Main Details (Left 2 columns on desktop) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Host Info */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Entire home hosted by {listing.host_name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                4 guests • 2 bedrooms • 2 beds • 1 bath
              </p>
            </div>
            <img
              src={listing.host_avatar}
              alt={listing.host_name}
              className="h-12 w-12 rounded-full object-cover"
            />
          </div>

          {/* Badges Info */}
          <div className="border-b border-gray-200 pb-6 space-y-4">
            <div className="flex space-x-4">
              <Award className="h-6 w-6 text-gray-700 shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Superhost</h4>
                <p className="text-gray-500 text-xs mt-0.5">
                  Hosts are experienced, highly rated hosts who are committed to providing great stays.
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Shield className="h-6 w-6 text-gray-700 shrink-0 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">Free cancellation for 48 hours</h4>
                <p className="text-gray-500 text-xs mt-0.5">
                  Get a full refund if you change your mind.
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-b border-gray-200 pb-6">
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What this place offers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {listing.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center space-x-3 text-gray-700">
                  <span className="h-2 w-2 rounded-full bg-brand"></span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Booking Card Widget (Right column on desktop) */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 border border-gray-200 rounded-2xl p-6 shadow-lg bg-white">
            
            {/* Header / Price per night */}
            <div className="flex justify-between items-baseline mb-6">
              <div>
                <span className="text-2xl font-bold text-gray-900">${listing.price}</span>
                <span className="text-gray-500 text-sm"> / night</span>
              </div>
              <div className="flex items-center space-x-1 text-sm font-semibold">
                <Star className="h-3.5 w-3.5 fill-black text-black" />
                <span>{listing.rating.toFixed(2)}</span>
                <span className="text-gray-400 font-normal">•</span>
                <span className="underline text-gray-500 font-normal">{listing.reviews_count} reviews</span>
              </div>
            </div>

              {/* Reservation Form */}
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="border border-gray-300 rounded-xl overflow-hidden divide-y divide-gray-300">
                  <div className="grid grid-cols-2">
                    <div className="p-3">
                      <label className="block text-[10px] font-bold text-gray-900 uppercase">Check-In</label>
                      <input
                        type="date"
                        required
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full text-xs text-gray-500 bg-transparent border-0 p-0 focus:ring-0 mt-1 cursor-pointer focus:outline-none"
                      />
                    </div>
                    <div className="p-3 border-l border-gray-300">
                      <label className="block text-[10px] font-bold text-gray-900 uppercase">Check-Out</label>
                      <input
                        type="date"
                        required
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full text-xs text-gray-500 bg-transparent border-0 p-0 focus:ring-0 mt-1 cursor-pointer focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#E61E4D] via-[#E31C5F] to-[#D70466] text-white py-3.5 rounded-lg font-semibold active:scale-[0.98] hover:brightness-105 transition-all shadow-md"
                >
                  Reserve
                </button>

                {/* Pricing breakdowns */}
                {days > 0 && (
                  <div className="pt-4 space-y-3 border-t border-gray-200 text-sm">
                    <p className="text-center text-xs text-gray-500 mb-2">You won't be charged yet</p>
                    
                    <div className="flex justify-between text-gray-600">
                      <span className="underline">${listing.price} x {days} nights</span>
                      <span>${basePrice}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span className="underline">Airbnb service fee (12%)</span>
                      <span>${serviceFee}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-900 pt-3 border-t border-gray-200 text-base">
                      <span>Total before taxes</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                )}
              </form>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ListingDetail;
