import React from 'react';
import { Star } from 'lucide-react';

function ListingCard({ listing, showTotal, onClick }) {
  const mockDates = [
    "Sep 10 – 15",
    "Oct 3 – 8",
    "Sep 24 – 29",
    "Oct 12 – 17",
    "Nov 1 – 6",
    "Dec 20 – 25"
  ][listing.id % 6] || "Sep 15 – 20";

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer flex flex-col space-y-3"
    >
      {/* Listing Image container */}
      <div className="aspect-square w-full overflow-hidden rounded-xl bg-gray-100 relative">
        <img
          src={listing.image}
          alt={listing.title}
          className="h-full w-full object-cover object-center group-hover:scale-103 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Simple Heart Favorite Badge Mock */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            alert("Added to wishlist!");
          }}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-transparent text-white hover:scale-110 transition active:scale-95"
        >
          <svg
            className="h-6 w-6 stroke-white fill-black/30 stroke-[2] hover:fill-brand hover:stroke-brand transition"
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

        <div className="pt-1 flex items-baseline space-x-1">
          <span className="font-semibold text-gray-900">
            ${showTotal ? Math.round(listing.price * 1.12) : listing.price}
          </span>
          <span className="text-gray-500 font-normal text-xs">
            {showTotal ? 'total before taxes' : 'night'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ListingCard;
