import { create } from 'zustand';

const safeJsonParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};

const useWishlistStore = create((set, get) => ({
  items: safeJsonParse(localStorage.getItem('wishlist')) || [],

  addToWishlist: (listing) => {
    const current = get().items;
    if (!current.find((l) => l.id === listing.id)) {
      const updated = [...current, listing];
      localStorage.setItem('wishlist', JSON.stringify(updated));
      set({ items: updated });
    }
  },

  removeFromWishlist: (listingId) => {
    const updated = get().items.filter((l) => l.id !== listingId);
    localStorage.setItem('wishlist', JSON.stringify(updated));
    set({ items: updated });
  },

  toggleWishlist: (listing) => {
    const { items, addToWishlist, removeFromWishlist } = get();
    const exists = items.find((l) => l.id === listing.id);
    if (exists) {
      removeFromWishlist(listing.id);
    } else {
      addToWishlist(listing);
    }
  },

  isWishlisted: (listingId) => {
    return !!get().items.find((l) => l.id === listingId);
  },
}));

export default useWishlistStore;
