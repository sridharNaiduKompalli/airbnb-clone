import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles } from 'lucide-react';
import useWishlistStore from '../store/useWishlistStore';
import ListingCard from '../components/ListingCard.jsx';

export default function Wishlist() {
  const navigate = useNavigate();
  const { items, removeFromWishlist } = useWishlistStore();

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero Banner */}
      <div className="bg-[#1A3E2A] text-[#FAF6F0] py-12 px-4 text-center select-none relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FAF6F0_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-3xl mx-auto relative z-10 space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <Heart className="w-6 h-6 fill-[#E61E4D] text-[#E61E4D]" />
            <span className="text-xs uppercase tracking-widest text-[#E2DCD5] font-semibold">
              Your Wishlist
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#FAF6F0]">
            Places You're Dreaming About
          </h2>
          <p className="text-sm text-[#FAF6F0]/70 max-w-lg mx-auto font-light">
            {items.length === 0
              ? 'Start saving places you love — click the heart icon on any listing.'
              : `${items.length} place${items.length === 1 ? '' : 's'} saved to your wishlist.`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {items.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-[#FFF0F3] rounded-full flex items-center justify-center mx-auto mb-5">
              <Heart className="w-10 h-10 text-[#E61E4D]/50" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No wishlist items yet
            </h3>
            <p className="text-gray-400 mb-6 max-w-sm mx-auto text-sm">
              Browse listings and tap the heart icon to save your favourite places for later.
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#1D3E2F] text-white rounded-full font-medium hover:bg-[#152D22] transition shadow-sm hover:shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Explore Places</span>
            </button>
          </div>
        ) : (
          <>
            {/* Clear All Button */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-700">
                {items.length} saved place{items.length !== 1 ? 's' : ''}
              </h3>
              <button
                onClick={() => {
                  if (window.confirm('Clear your entire wishlist?')) {
                    items.forEach((i) => removeFromWishlist(i.id));
                  }
                }}
                className="text-sm text-gray-400 hover:text-red-500 transition underline underline-offset-2"
              >
                Clear all
              </button>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {items.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  showTotal={false}
                  onClick={() => navigate(/listing/)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
