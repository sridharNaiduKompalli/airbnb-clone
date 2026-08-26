import React from 'react';
import { Search, Globe, Menu, User, Activity, LogOut, LayoutDashboard, PlusCircle, Heart, UserCircle, Bookmark } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useWishlistStore from '../store/useWishlistStore';

function Header({ apiHealth }) {
  const { user, logout } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center cursor-pointer">
          <img
            src="https://logodownload.org/wp-content/uploads/2016/10/airbnb-logo-3-1.png"
            alt="Tropica Logo"
            className="h-7 w-auto object-contain"
          />
        </Link>

        {/* Center Search Bar */}
        <div className="hidden md:flex items-center border border-gray-200 rounded-full py-2 px-4 shadow-sm hover:shadow-md cursor-pointer transition">
          <span className="text-sm font-semibold px-4 border-r border-gray-200">Anywhere</span>
          <span className="text-sm font-semibold px-4 border-r border-gray-200">Any week</span>
          <span className="text-sm text-gray-500 px-4">Add guests</span>
          <div className="bg-brand text-white p-2 rounded-full">
            <Search className="h-4 w-4" />
          </div>
        </div>

        {/* Right Nav */}
        <div className="flex items-center space-x-3 relative">
          {/* Health Badge */}
          <div className="hidden lg:flex items-center">
            {apiHealth ? (
              apiHealth.status === 'UP' ? (
                <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200">
                  <Activity className="h-3.5 w-3.5 mr-1 animate-pulse" />
                  API connected
                </div>
              ) : (
                <div className="flex items-center bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-semibold border border-red-200">
                  <Activity className="h-3.5 w-3.5 mr-1" />
                  API offline
                </div>
              )
            ) : (
              <div className="flex items-center bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold border border-yellow-200">
                <Activity className="h-3.5 w-3.5 mr-1 animate-spin" />
                Connecting...
              </div>
            )}
          </div>

          {/* Tropica your home */}
          <Link
            to="/add-place"
            className="text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition hidden md:block"
          >
            Tropica your home
          </Link>

          {/* Wishlist Icon with Badge */}
          <Link
            to="/wishlist"
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
            title="My Wishlist"
          >
            <Heart className="h-5 w-5 transition-colors" />
            {wishlistItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E61E4D] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full leading-none">
                {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
              </span>
            )}
          </Link>

          {/* User Menu */}
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 border border-gray-200 rounded-full p-2 hover:shadow-md cursor-pointer transition relative"
          >
            <Menu className="h-5 w-5 text-gray-500" />
            {user ? (
              <div className="bg-brand text-white rounded-full p-1 w-6 h-6 flex items-center justify-center font-bold text-xs uppercase">
                {user?.name ? user.name.charAt(0) : 'U'}
              </div>
            ) : (
              <div className="bg-gray-500 text-white rounded-full p-1">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute top-12 right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden py-2 z-50">
              {user ? (
                <>
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  
                  <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100">
                    <UserCircle className="w-4 h-4 mr-3 text-gray-400" />
                    My Dashboard
                  </Link>

                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                      <LayoutDashboard className="w-4 h-4 mr-3 text-gray-400" />
                      Admin Dashboard
                    </Link>
                  )}
                  
                  <Link to="/bookings" onClick={() => setDropdownOpen(false)} className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100">
                    My Bookings
                  </Link>

                  <Link to="/wishlist" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                    <Heart className="w-4 h-4 mr-3 text-gray-400" />
                    My Wishlist
                    {wishlistItems.length > 0 && (
                      <span className="ml-auto bg-[#E61E4D] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Link>

                  <Link to="/favourites" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                    <Bookmark className="w-4 h-4 mr-3 text-gray-400" />
                    My Favourites
                  </Link>
                  
                  <Link to="/add-place" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                    <PlusCircle className="w-4 h-4 mr-3 text-gray-400" />
                    Host an experience
                  </Link>
                  
                  <div className="border-t border-gray-100 my-1"></div>
                  
                  <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                    <LogOut className="w-4 h-4 mr-3 text-gray-400" />
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setDropdownOpen(false)} className="block px-4 py-3 text-sm font-bold text-gray-900 hover:bg-gray-100">
                    Log in
                  </Link>
                  <Link to="/login" onClick={() => setDropdownOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                    Sign up
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <Link to="/add-place" onClick={() => setDropdownOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                    Tropica your home
                  </Link>
                  <Link to="/wishlist" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                    <Heart className="w-4 h-4 mr-3 text-gray-400" />
                    My Wishlist
                  </Link>
                  <Link to="/" onClick={() => setDropdownOpen(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100">
                    Help Center
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
