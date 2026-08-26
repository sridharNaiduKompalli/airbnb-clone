import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, DollarSign, ArrowLeft } from 'lucide-react';
import Loader from '../components/Loader.jsx';

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    fetch(`${baseUrl}/api/bookings`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch bookings");
        return res.json();
      })
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Trips & Bookings</h1>

      {error ? (
        /* Error state */
        <div className="text-center py-16 bg-gray-50 border border-gray-100 rounded-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-2">Could not retrieve bookings</h3>
          <p className="text-gray-500 mb-6">Please ensure the backend service and database are active.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-brand text-white px-6 py-2 rounded-lg font-semibold"
          >
            Go Back Home
          </button>
        </div>
      ) : bookings.length === 0 ? (
        /* Empty bookings list */
        <div className="text-center py-16 bg-gray-50 border border-gray-100 rounded-2xl p-8">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No trips booked... yet!</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Time to dust off your bags and start planning your next getaway. Explore stays to find the perfect home.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-brand text-white px-6 py-2.5 rounded-lg hover:bg-brand-dark transition font-semibold shadow-sm"
          >
            Start Searching
          </button>
        </div>
      ) : (
        /* Active bookings feed */
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col sm:flex-row border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition bg-white"
            >
              {/* Listing Thumbnail Image */}
              <div className="w-full sm:w-48 h-36 bg-gray-100 shrink-0 relative">
                <img
                  src={booking.listing_image}
                  alt={booking.listing_title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Booking specifications */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900">{booking.listing_title}</h3>
                      <p className="text-sm text-gray-500">{booking.listing_location}</p>
                    </div>
                    <div className="bg-brand/10 text-brand px-3 py-1 rounded-full text-xs font-bold border border-brand/20">
                      Confirmed
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                      <span>{booking.check_in} to {booking.check_out}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400 shrink-0" />
                      <span>Guest: <strong className="text-gray-900">{booking.guest_name}</strong></span>
                    </div>
                    <div className="flex items-center space-x-1 font-semibold text-gray-900">
                      <DollarSign className="h-4 w-4 text-gray-500 shrink-0" />
                      <span>Paid: ${booking.total_price}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center">
                  <span>Reserved on: {new Date(booking.created_at || Date.now()).toLocaleDateString()}</span>
                  <button
                    onClick={() => navigate(`/listing/${booking.listing_id}`)}
                    className="text-brand hover:underline font-semibold text-sm"
                  >
                    View Details
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;
