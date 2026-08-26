import React from 'react';
import { Star } from 'lucide-react';
import useWishlistStore from '../store/useWishlistStore';

function ListingCard({ listing, showTotal, onClick }) {
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const wishlisted = isWishlisted(listing.id);

  const mockDates = [
    'Sep 10 - 15',
    'Oct 3 - 8',
    'Sep 24 - 29',
    'Oct 12 - 17',
    'Nov 1 - 6',
    'Dec 20 - 25',
  ][listing.id % 6] || 'Sep 15 - 20';

  const basePrice = listing.price;
  const totalPrice = Math.round(basePrice * 5 * 1.12); // 5 nights with service fee

  return (
    <div onClick={onClick} className="group cursor-pointer flex flex-col space-y-3">
      {/* Listing Image container */}
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100 relative">
        <img
          src={listing.image}
          alt={listing.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Wishlist Heart Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(listing);
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-transparent hover:scale-110 transition-transform active:scale-95"
          title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className={`h-6 w-6 stroke-[2] drop-shadow-md transition-all duration-200 ${
              wishlisted ? 'fill-red-500 stroke-red-500' : 'fill-none stroke-white'
            }`}
            viewBox="0 0 32 32"
          >
            <path d="M16 28c7-4.733 14-10 14-17 0-4.333-3.413-8-8-8-3.08 0-5.747 1.893-7 4.787C13.747 4.893 11.08 3 8 3 3.413 3 0 6.667 0 11c0 7 7 12.267 14 17z" />
          </svg>
        </button>
      </div>

      {/* Listing Details */}
      <div className="flex flex-col space-y-1 text-sm">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900 truncate max-w-[80%]">
            {listing.location}
          </h3>
          <div className="flex items-center space-x-1 shrink-0">
            <Star className="h-3.5 w-3.5 fill-black text-black" />
            <span className="text-gray-900 font-medium">
              {Number(listing.rating).toFixed(2)}
            </span>
          </div>
        </div>

        <p className="text-gray-500 truncate">{listing.title}</p>
        <p className="text-gray-400 text-xs">{mockDates}</p>

        {/* Price Display — reacts to showTotal toggle */}
        <div className="pt-1">
          {showTotal ? (
            <div className="flex flex-col">
              <div className="flex items-baseline space-x-1">
                <span className="font-bold text-[#1D3E2F]">
                  
                </span>
                <span className="text-[#1D3E2F] font-medium text-xs bg-[#E8F5EC] px-1.5 py-0.5 rounded-full">
                  total before taxes
                </span>
              </div>
              <p className="text-gray-400 text-xs mt-0.5">
                /night · 5 nights + fees
              </p>
            </div>
          ) : (
            <div className="flex items-baseline space-x-1">
              <span className="font-semibold text-gray-900"></span>
              <span className="text-gray-500 font-normal text-xs">/ night</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListingCard;
