import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    try {
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed');
      
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 flex items-center justify-center bg-[#FDFBF7]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-3xl font-[Georgia] text-[#1D3E2F] mb-6 text-center">
          {isLogin ? 'Welcome back' : 'Join Tropica'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D3E2F]"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D3E2F]"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1D3E2F]"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#1D3E2F] text-white rounded-lg hover:bg-[#152D22] transition font-medium mt-6"
          >
            {isLogin ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#1D3E2F] font-semibold hover:underline"
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
}
