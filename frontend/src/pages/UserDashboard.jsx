import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Home, Calendar, Heart, Settings, PlusCircle, Star } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

export default function UserDashboard() {
  const { user, token, login } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState(null);
  const [myListings, setMyListings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [myFavourites, setMyFavourites] = useState([]);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);

  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${baseUrl}/api/users/profile`, { headers }).then(r => r.json()),
      fetch(`${baseUrl}/api/users/my-listings`, { headers }).then(r => r.json()),
      fetch(`${baseUrl}/api/users/my-bookings`, { headers }).then(r => r.json()),
      fetch(`${baseUrl}/api/favourites`, { headers }).then(r => r.json()),
    ]).then(([prof, listings, bookings, favs]) => {
      setProfile(prof);
      setEditName(prof?.name || '');
      setMyListings(Array.isArray(listings) ? listings : []);
      setMyBookings(Array.isArray(bookings) ? bookings : []);
      setMyFavourites(Array.isArray(favs) ? favs : []);
    });
  }, [user, token, navigate]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${baseUrl}/api/users/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: editName })
      });
      const updated = await res.json();
      setProfile(updated);
      login({ ...user, name: updated.name }, token);
      alert('Profile updated!');
    } catch (e) { alert('Failed to update profile'); }
    finally { setSaving(false); }
  };

  if (!user) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'bookings', label: `My Trips (${myBookings.length})`, icon: Calendar },
    { id: 'listings', label: `My Places (${myListings.length})`, icon: Home },
    { id: 'favourites', label: `Favourites (${myFavourites.length})`, icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#FDFBF7]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-[#1D3E2F] text-white flex items-center justify-center text-3xl font-bold uppercase">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-[Georgia] text-[#1D3E2F]">{profile?.name || user.name}</h1>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>
              {user.role === 'admin' ? '⭐ Admin' : '✅ Member'}
            </span>
          </div>
          <div className="ml-auto flex gap-3">
            <Link to="/add-place" className="flex items-center gap-2 px-4 py-2 bg-[#1D3E2F] text-white rounded-lg text-sm font-medium hover:bg-[#152D22] transition">
              <PlusCircle className="w-4 h-4" /> Host a Place
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-medium hover:bg-red-100 transition">
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Tabs */}
          <div className="w-56 shrink-0">
            <nav className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm text-left transition border-b border-gray-50 last:border-0 ${activeTab === tab.id ? 'bg-[#1D3E2F] text-white font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <tab.icon className="w-4 h-4 shrink-0" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: 'Trips Booked', value: myBookings.length, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'Places Hosted', value: myListings.length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Saved Favourites', value: myFavourites.length, color: 'text-pink-600', bg: 'bg-pink-50' },
                  ].map((card, i) => (
                    <div key={i} className={`bg-white rounded-2xl border border-gray-100 p-6`}>
                      <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                      <p className={`text-4xl font-bold ${card.color}`}>{card.value}</p>
                    </div>
                  ))}
                </div>

                {myBookings.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Trips</h3>
                    <div className="space-y-3">
                      {myBookings.slice(0, 3).map(b => (
                        <div key={b.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                          <img src={b.listing_image} className="w-14 h-14 rounded-lg object-cover" alt="" />
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{b.listing_title || 'Listing'}</p>
                            <p className="text-xs text-gray-500">{b.check_in} → {b.check_out}</p>
                          </div>
                          <span className="ml-auto text-sm font-semibold text-gray-900">${b.total_price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MY TRIPS */}
            {activeTab === 'bookings' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">My Trips</h2>
                {myBookings.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Calendar className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p>No trips booked yet.</p>
                    <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-[#1D3E2F] text-white rounded-lg text-sm">Browse stays</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myBookings.map(b => (
                      <div key={b.id} className="flex gap-4 border border-gray-100 rounded-xl p-4">
                        <img src={b.listing_image} className="w-24 h-20 rounded-lg object-cover shrink-0" alt="" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{b.listing_title || 'Listing'}</p>
                          <p className="text-sm text-gray-500">{b.listing_location}</p>
                          <p className="text-sm text-gray-600 mt-1">{b.check_in} → {b.check_out}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">Confirmed</span>
                          <p className="font-bold text-gray-900 mt-2">${b.total_price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MY PLACES */}
            {activeTab === 'listings' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">My Places</h2>
                  <Link to="/add-place" className="flex items-center gap-2 text-sm text-[#1D3E2F] font-semibold hover:underline">
                    <PlusCircle className="w-4 h-4" /> Add New Place
                  </Link>
                </div>
                {myListings.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Home className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p>You haven't listed any places yet.</p>
                    <Link to="/add-place" className="inline-block mt-4 px-4 py-2 bg-[#1D3E2F] text-white rounded-lg text-sm">Host your first place</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {myListings.map(l => (
                      <div key={l.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer" onClick={() => navigate(`/listing/${l.id}`)}>
                        <img src={l.image} className="w-full h-36 object-cover" alt={l.title} />
                        <div className="p-3">
                          <p className="font-medium text-gray-900 text-sm">{l.title}</p>
                          <p className="text-xs text-gray-500">{l.location}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-semibold text-[#1D3E2F]">${l.price}/night</span>
                            <span className="text-xs flex items-center gap-1 text-gray-500"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> {Number(l.rating).toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FAVOURITES */}
            {activeTab === 'favourites' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Saved Favourites</h2>
                {myFavourites.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Heart className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p>No favourites saved yet.</p>
                    <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-[#1D3E2F] text-white rounded-lg text-sm">Browse listings</button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {myFavourites.map(l => (
                      <div key={l.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition cursor-pointer" onClick={() => navigate(`/listing/${l.id}`)}>
                        <img src={l.image} className="w-full h-36 object-cover" alt={l.title} />
                        <div className="p-3">
                          <p className="font-medium text-gray-900 text-sm">{l.title}</p>
                          <p className="text-xs text-gray-500">{l.location}</p>
                          <span className="text-sm font-semibold text-[#1D3E2F]">${l.price}/night</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D3E2F]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={user.email} disabled className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed" />
                    <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-6 py-2.5 bg-[#1D3E2F] text-white rounded-lg font-medium hover:bg-[#152D22] transition disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
