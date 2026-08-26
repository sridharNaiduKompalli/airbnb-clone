import React, { useState, useEffect } from 'react';
import FilterBar from '../components/FilterBar.jsx';
import ListingCard from '../components/ListingCard.jsx';
import Loader from '../components/Loader.jsx';

function Home({ onNavigate }) {
  const [listings, setListings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showTotalWithTaxes, setShowTotalWithTaxes] = useState(false); // Toggle state for pricing display

  useEffect(() => {
    setLoading(true);
    setError(false);
    
    const url = selectedCategory === 'all'
      ? '/api/listings'
      : `/api/listings?type=${selectedCategory}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("API call failed");
        return res.json();
      })
      .then((data) => {
        setListings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching listings:", err);
        setError(true);
        setLoading(false);
      });
  }, [selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Tropical Hero Section inspired by Tropica */}
      <div className="bg-[#1A3E2A] text-[#FAF6F0] py-16 px-4 text-center select-none shadow-inner relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF6F0_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-3xl mx-auto relative z-10 space-y-4">
          <span className="text-xs uppercase tracking-widest text-[#E2DCD5] font-semibold">Stays in Paradise</span>
          <h2 className="text-4xl sm:text-5xl font-serif text-[#FAF6F0]">Uncover the Art of Tropical Stays</h2>
          <p className="text-sm sm:text-base text-[#FAF6F0]/80 max-w-xl mx-auto font-light leading-relaxed">
            A handpicked selection of tranquil beachfront villas, lush redwood canopy treehouses, and private forest retreats. Experience travel, curated.
          </p>
        </div>
      </div>

      {/* Category Filter Bar */}
      <FilterBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Stretch Toggle Switch Bar */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center justify-between border border-[#E2DCD5] bg-white rounded-2xl p-4 shadow-sm hover:shadow transition-all duration-300">
          <div>
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Display total price before taxes</h4>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">Includes service fees, excl. local taxes</p>
          </div>
          <div>
            {/* Custom Stretch Toggle */}
            <label className="toggle-label select-none">
              <input
                type="checkbox"
                className="hidden toggle-checkbox"
                checked={showTotalWithTaxes}
                onChange={() => setShowTotalWithTaxes(!showTotalWithTaxes)}
              />
              <div className="toggle-track">
                <div className="toggle-knob"></div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Grid of Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {loading ? (
          <Loader />
        ) : error ? (
          /* Error Page State */
          <div className="text-center py-16">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Could not load listings</h3>
            <p className="text-gray-500 mb-4">Please make sure the backend server is running and database is accessible.</p>
            <button
              onClick={() => setSelectedCategory(selectedCategory)}
              className="bg-[#2D4030] text-white px-6 py-2.5 rounded-lg hover:bg-[#1A3E2A] transition font-semibold"
            >
              Try Again
            </button>
          </div>
        ) : listings.length === 0 ? (
          /* Empty Page State */
          <div className="text-center py-16">
            <h3 className="text-lg font-bold text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-500">We couldn't find any listings matching this category.</p>
          </div>
        ) : (
          /* Active Listings Feed Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                showTotal={showTotalWithTaxes} // Forward pricing mode
                onClick={() => onNavigate('detail', listing.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
