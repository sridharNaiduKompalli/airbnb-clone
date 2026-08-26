import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

export default function AddPlace() {
  const { token, user } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    image: '',
    type: 'cabins'
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    try {
      const res = await fetch(`${baseUrl}/api/listings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          images: [formData.image, formData.image, formData.image, formData.image, formData.image] // Mock multiple images
        })
      });
      
      if (!res.ok) throw new Error('Failed to create listing');
      navigate('/');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 bg-[#FDFBF7]">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-[Georgia] text-[#1D3E2F] mb-2">Host your place</h1>
        <p className="text-gray-600 mb-8">Share your incredible space with the Tropica community.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Listing Title</label>
            <input required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-[#1D3E2F]" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Modern Glass Lakehouse" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea required rows={4} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-[#1D3E2F]" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe what makes your place special..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price per night ($)</label>
              <input required type="number" min="10" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-[#1D3E2F]" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Type</label>
              <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-[#1D3E2F]" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option value="cabins">Cabins</option>
                <option value="beachfront">Beachfront</option>
                <option value="treehouses">Treehouses</option>
                <option value="desert">Desert</option>
                <option value="historic">Historic</option>
                <option value="lake">Lake</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-[#1D3E2F]" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Malibu, California" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label>
            <input required type="url" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-[#1D3E2F]" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://images.unsplash.com/..." />
            <p className="text-xs text-gray-500 mt-1">For this demo, please paste an image URL from the web.</p>
          </div>

          {formData.image && (
            <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200">
              <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
            </div>
          )}

          <div className="pt-4 border-t border-gray-100">
            <button disabled={loading} type="submit" className="w-full py-3 bg-[#1D3E2F] text-white rounded-lg hover:bg-[#152D22] transition font-medium">
              {loading ? 'Publishing...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
