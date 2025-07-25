import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, Eye, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const ListShows = () => {
  const [shows, setShows] = useState([]);
  const navigate = useNavigate();

  // Fetch shows from backend
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API}/events/get-my-events`, { withCredentials: true });
        setShows(res.data.events || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch shows');
      }
    };
    fetchShows();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'upcoming':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  // View handler
  const handleView = (id) => {
    navigate(`/organizer/show/${id}`); // You can create a ShowDetails page for this route
  };

  // Edit handler
  const handleEdit = (id) => {
    navigate(`/organizer/edit-event/${id}`); // You can create an EditEvent page for this route
  };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API}/events/delete-my-event/${id}`, { withCredentials: true });
      toast.success('Event deleted!');
      setShows(shows.filter(show => show._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    }
  };

  return (
    <div className="min-h-screen  text-white">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-300">Your Shows</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {shows.map((show) => (
          <div key={show._id} className="glass rounded-lg shadow-xl overflow-hidden border border-blue-400/20">
            <img src={show.banner} alt={show.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">{show.title}</h3>
              <p className="text-blue-200 text-sm flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4" /> {show.eventDateTime && show.eventDateTime.length > 0
                  ? new Date(show.eventDateTime[0]).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                  : 'N/A'}
              </p>
              <p className="text-blue-300 text-xs flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4" /> {show.location}
              </p>

              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-blue-200">Status:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(show.status)}`}>
                  {show.status?.charAt(0).toUpperCase() + show.status?.slice(1)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-blue-200">Bookings:</span>
                <span className="font-semibold text-white">{show.totalBookings}</span>
              </div>
              <div className="flex justify-between items-center text-sm mb-4">
                <span className="text-blue-200">Revenue:</span>
                <span className="font-semibold text-white">₹{show.totalRevenue}</span>
              </div>
              <div className="flex gap-4 mt-6">
                <button onClick={() => handleView(show._id)} className="flex-1 flex items-center justify-center gap-2 border border-blue-600 text-blue-400 font-bold py-2 rounded-lg transition-colors hover:bg-blue-900/20">
                  <Eye className="w-4 h-4" /> View
                </button>
                <button onClick={() => handleEdit(show._id)} className="flex-1 flex items-center justify-center gap-2 border border-yellow-600 text-yellow-400 font-bold py-2 rounded-lg transition-colors hover:bg-yellow-900/20">
                  <Edit className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => handleDelete(show._id)} className="flex-1 flex items-center justify-center gap-2 border border-red-600 text-red-400 font-bold py-2 rounded-lg transition-colors hover:bg-red-900/20">
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