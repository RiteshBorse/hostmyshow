import React from 'react';
import { Ticket, DollarSign, CalendarPlus, Users } from 'lucide-react';

const DashboardHome = () => {
  // Mock data for demonstration
  const stats = {
    totalBookings: 1250,
    totalRevenue: 750000,
    activeShows: 15,
    totalUsers: 5000,
  };

  const events = [
    {
      id: 1,
      title: "The Accountant²",
      date: "2025-08-12",
      time: "7:30 PM",
      location: "PVR Cinemas, Downtown",
      poster: "https://m.media-amazon.com/images/I/91dAIcmOjAL._AC_UF1000,1000_QL80_.jpg",
      bookings: 250,
      revenue: 87500,
    },
    {
      id: 2,
      title: "Interstellar",
      date: "2025-09-01",
      time: "8:00 PM",
      location: "Cineplex, City Center",
      poster: "https://m.media-amazon.com/images/I/91obuWc3ZzL._AC_UF1000,1000_QL80_.jpg",
      bookings: 300,
      revenue: 105000,
    },
    {
      id: 3,
      title: "Inception",
      date: "2025-09-15",
      time: "6:00 PM",
      location: "Grand Cinema, West End",
      poster: "https://m.media-amazon.com/images/I/81o-F1z2+wL._AC_UF1000,1000_QL80_.jpg",
      bookings: 180,
      revenue: 63000,
    },
  ];

  return (
    <>
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-300">Dashboard Overview</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="glass p-6 rounded-lg shadow-xl flex flex-col items-center justify-center text-center border border-blue-400/20">
          <Ticket className="w-10 h-10 text-blue-400 mb-3" />
          <p className="text-3xl font-bold text-white">{stats.totalBookings}</p>
          <p className="text-blue-200">Total Bookings</p>
        </div>
        <div className="glass p-6 rounded-lg shadow-xl flex flex-col items-center justify-center text-center border border-blue-400/20">
          <DollarSign className="w-10 h-10 text-green-400 mb-3" />
          <p className="text-3xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
          <p className="text-blue-200">Total Revenue</p>
        </div>
        <div className="glass p-6 rounded-lg shadow-xl flex flex-col items-center justify-center text-center border border-blue-400/20">
          <CalendarPlus className="w-10 h-10 text-purple-400 mb-3" />
          <p className="text-3xl font-bold text-white">{stats.activeShows}</p>
          <p className="text-blue-200">Active Shows</p>
        </div>
        <div className="glass p-6 rounded-lg shadow-xl flex flex-col items-center justify-center text-center border border-blue-400/20">
          <Users className="w-10 h-10 text-yellow-400 mb-3" />
          <p className="text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
          <p className="text-blue-200">Total Users</p>
        </div>
      </div>

      {/* Events Section */}
      <h2 className="text-3xl font-bold mb-6 text-blue-300">Your Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div key={event.id} className="glass rounded-lg shadow-xl overflow-hidden border border-blue-400/20">
            <img src={event.poster} alt={event.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
              <p className="text-blue-200 text-sm mb-1">{event.date} • {event.time}</p>
              <p className="text-blue-300 text-xs mb-4">{event.location}</p>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-blue-200">Bookings:</span>
                <span className="font-semibold text-white">{event.bookings}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-blue-200">Revenue:</span>
                <span className="font-semibold text-white">₹{event.revenue.toLocaleString()}</span>
              </div>
              <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardHome; 