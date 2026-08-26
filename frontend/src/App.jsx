import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import ListingDetail from './pages/ListingDetail.jsx';
import MyBookings from './pages/MyBookings.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'detail' | 'bookings'
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [apiHealth, setApiHealth] = useState(null);

  // Monitor backend health
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setApiHealth(data))
      .catch(err => {
        console.error("Backend health check failed:", err);
        setApiHealth({ status: "DOWN", error: true });
      });
  }, [currentPage]);

  const navigateTo = (page, listingId = null) => {
    setCurrentPage(page);
    if (listingId) {
      setSelectedListingId(listingId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header component */}
      <Header currentPage={currentPage} onNavigate={navigateTo} apiHealth={apiHealth} />

      {/* Main Content Area */}
      <main className="flex-grow">
        {currentPage === 'home' && (
          <Home onNavigate={navigateTo} />
        )}
        {currentPage === 'detail' && (
          <ListingDetail id={selectedListingId} onNavigate={navigateTo} />
        )}
        {currentPage === 'bookings' && (
          <MyBookings onNavigate={navigateTo} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          <div className="flex justify-center space-x-6 mb-4">
            <button onClick={() => navigateTo('home')} className="hover:underline">Home</button>
            <button onClick={() => navigateTo('bookings')} className="hover:underline">My Bookings</button>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
          </div>
          <p>© {new Date().getFullYear()} Airbnb Clone DevOps Project. For demonstration purposes only.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
