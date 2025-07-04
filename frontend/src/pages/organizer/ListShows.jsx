import React from 'react';
import { Calendar, MapPin, Clock, Tag, Eye, Edit, Trash2 } from 'lucide-react';

const ListShows = () => {
  const shows = [
    {
      id: 1,
      title: "The Accountant²",
      date: "2025-08-12",
      time: "7:30 PM",
      location: "PVR Cinemas, Downtown",
      poster: "https://m.media-amazon.com/images/I/91dAIcmOjAL._AC_UF1000,1000_QL80_.jpg",
      status: "Active",
      ticketsSold: 250,
      totalTickets: 300,
    },
    {
      id: 2,
      title: "Interstellar",
      date: "2025-09-01",
      time: "8:00 PM",
      location: "Cineplex, City Center",
      poster: "https://m.media-amazon.com/images/I/91obuWc3ZzL._AC_UF1000,1000_QL80_.jpg",
      status: "Upcoming",
      ticketsSold: 0,
      totalTickets: 400,
    },
    {
      id: 3,
      title: "Inception",
      date: "2025-07-20",
      time: "6:00 PM",
      location: "Grand Cinema, West End",
      poster: "https://m.media-amazon.com/images/I/81o-F1z2+wL._AC_UF1000,1000_QL80_.jpg",
      status: "Completed",
      ticketsSold: 180,
      totalTickets: 200,
    },
    {
      id: 4,
      title: "Dune: Part Two",
      date: "2025-10-05",
      time: "9:00 PM",
      location: "IMAX Theatre, North Side",
      poster: "https://m.media-amazon.com/images/I/81+K1+e+f+L._AC_UF1000,1000_QL80_.jpg",
      status: "Upcoming",
      ticketsSold: 0,
      totalTickets: 350,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500';
      case 'Upcoming':
        return 'bg-blue-500';
      case 'Completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen  text-white">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-300">Your Shows</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {shows.map((show) => (
          <div key={show.id} className="glass rounded-lg shadow-xl overflow-hidden border border-blue-400/20">
            <img src={show.poster} alt={show.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{show.title}</h3>
              <p className="text-blue-200 text-sm flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4" /> {show.date}
              </p>
              <p className="text-blue-200 text-sm flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4" /> {show.time}
              </p>
              <p className="text-blue-300 text-xs flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4" /> {show.location}
              </p>

              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-blue-200">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(show.status)}`}>
                  {show.status}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-blue-200">Tickets Sold:</span>
                <span className="font-semibold text-white">{show.ticketsSold} / {show.totalTickets}</span>
              </div>

              <div className="flex gap-4 mt-6">
                <button className="flex-1 flex items-center justify-center gap-2 border border-blue-600 text-blue-400 font-bold py-2 rounded-lg transition-colors hover:bg-blue-900/20">
                  <Eye className="w-4 h-4" /> View
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 border border-yellow-600 text-yellow-400 font-bold py-2 rounded-lg transition-colors hover:bg-yellow-900/20">
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 border border-red-600 text-red-400 font-bold py-2 rounded-lg transition-colors hover:bg-red-900/20">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListShows;