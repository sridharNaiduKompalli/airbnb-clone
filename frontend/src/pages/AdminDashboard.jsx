import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { Users, Home, CreditCard, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, listings: 0, bookings: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      try {
        const res = await fetch(`${baseUrl}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, token, navigate]);

  if (loading) return <div className="min-h-screen pt-24 text-center">Loading dashboard...</div>;

  const statCards = [
    { title: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Total Listings', value: stats.listings, icon: Home, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Total Bookings', value: stats.bookings, icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-[#FDFBF7]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-[Georgia] text-[#1D3E2F] mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-8">Platform overview and statistics.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
      </div>
    </div>
  );
}
