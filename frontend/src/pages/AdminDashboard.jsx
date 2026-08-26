import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Users, Home, CreditCard, TrendingUp, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, listings: 0, bookings: 0, revenue: 0 });
  const [activeTab, setActiveTab] = useState('stats');
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch(`${baseUrl}/api/admin/stats`, { headers }).then(r => r.json()),
      fetch(`${baseUrl}/api/admin/users`, { headers }).then(r => r.json()),
      fetch(`${baseUrl}/api/admin/listings`, { headers }).then(r => r.json()),
      fetch(`${baseUrl}/api/admin/bookings`, { headers }).then(r => r.json()),
    ]).then(([s, u, l, b]) => {
      setStats(s);
      setUsers(Array.isArray(u) ? u : []);
      setListings(Array.isArray(l) ? l : []);
      setBookings(Array.isArray(b) ? b : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [user, token, navigate]);

  const deleteListing = async (id) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    await fetch(`${baseUrl}/api/admin/listings/${id}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
    });
    setListings(prev => prev.filter(l => l.id !== id));
  };

  if (loading) return <div className="min-h-screen pt-24 text-center text-gray-500">Loading Admin Panel...</div>;

  const statCards = [
    { title: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Listings', value: stats.listings, icon: Home, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Total Bookings', value: stats.bookings, icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Total Revenue', value: `$${(stats.revenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const tabs = ['stats', 'users', 'listings', 'bookings'];

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-[Georgia] text-[#1D3E2F]">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Full platform management panel</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1 rounded-xl border border-gray-100 w-fit">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition ${activeTab === tab ? 'bg-[#1D3E2F] text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* Stats */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className={`p-4 rounded-xl ${card.bg}`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">All Users ({users.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">Name</th>
                    <th className="px-6 py-3 text-left">Email</th>
                    <th className="px-6 py-3 text-left">Role</th>
                    <th className="px-6 py-3 text-left">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-gray-400">#{u.id}</td>
                      <td className="px-6 py-3 font-medium text-gray-900">{u.name}</td>
                      <td className="px-6 py-3 text-gray-600">{u.email}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === 'admin' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'}`}>{u.role}</span>
                      </td>
                      <td className="px-6 py-3 text-gray-400">{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Listings */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">All Listings ({listings.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">Title</th>
                    <th className="px-6 py-3 text-left">Location</th>
                    <th className="px-6 py-3 text-left">Type</th>
                    <th className="px-6 py-3 text-left">Price</th>
                    <th className="px-6 py-3 text-left">Host</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {listings.map(l => (
                    <tr key={l.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-gray-400">#{l.id}</td>
                      <td className="px-6 py-3 font-medium text-gray-900 max-w-[200px] truncate">{l.title}</td>
                      <td className="px-6 py-3 text-gray-600">{l.location}</td>
                      <td className="px-6 py-3"><span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{l.type}</span></td>
                      <td className="px-6 py-3 font-semibold">${l.price}</td>
                      <td className="px-6 py-3 text-gray-600">{l.host_name}</td>
                      <td className="px-6 py-3">
                        <button onClick={() => deleteListing(l.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">All Bookings ({bookings.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="px-6 py-3 text-left">ID</th>
                    <th className="px-6 py-3 text-left">Guest</th>
                    <th className="px-6 py-3 text-left">Listing</th>
                    <th className="px-6 py-3 text-left">Check-in</th>
                    <th className="px-6 py-3 text-left">Check-out</th>
                    <th className="px-6 py-3 text-left">Amount</th>
                    <th className="px-6 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 text-gray-400">#{b.id}</td>
                      <td className="px-6 py-3 font-medium text-gray-900">{b.user_name || b.guest_name}</td>
                      <td className="px-6 py-3 text-gray-600 max-w-[200px] truncate">{b.listing_title || `#${b.listing_id}`}</td>
                      <td className="px-6 py-3 text-gray-600">{b.check_in}</td>
                      <td className="px-6 py-3 text-gray-600">{b.check_out}</td>
                      <td className="px-6 py-3 font-semibold text-gray-900">${b.total_price}</td>
                      <td className="px-6 py-3"><span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">Confirmed</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
