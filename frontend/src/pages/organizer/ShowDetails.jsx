import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Calendar, MapPin, DollarSign, Users, Info } from 'lucide-react';

const ShowDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API}/events/get-my-events/${id}`, { withCredentials: true });
        setEvent(res.data.event);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch event details');
        toast.error(err.response?.data?.message || 'Failed to fetch event details');
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white text-xl">
        Loading event details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400 text-xl">
        Error: {error}
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-yellow-400 text-xl">
        Event not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 text-white">
      <div className="max-w-4xl mx-auto glass rounded-lg shadow-xl overflow-hidden border border-blue-400/20 p-8">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-4xl font-bold text-blue-300">{event.title}</h1>
          <Link to={`/organizer/edit-event/${event._id}`}>
            <button className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
              Edit Event
            </button>
          </Link>
        </div>

        <img src={event.banner} alt={event.title} className="w-full h-80 object-cover rounded-lg mb-6 shadow-md" />
        {event.image && (
            <img src={event.image} alt={`${event.title} Image`} className="w-full h-auto object-cover rounded-lg mb-6 shadow-md" />
        )}

        <p className="text-blue-200 text-lg mb-4">{event.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-3 text-lg">
            <Calendar className="w-6 h-6 text-blue-400" />
            <span>
              {event.eventDateTime && event.eventDateTime.length > 0
                ? new Date(event.eventDateTime[0]).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
                : 'N/A'}
            </span>
          </div>
          <div className="flex items-center gap-3 text-lg">
            <MapPin className="w-6 h-6 text-blue-400" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-3 text-lg">
            <Info className="w-6 h-6 text-blue-400" />
            <span>Type: {event.eventType}</span>
          </div>
          <div className="flex items-center gap-3 text-lg">
            <DollarSign className="w-6 h-6 text-green-400" />
            <span>Cost: ₹{event.cost}</span>
          </div>
          <div className="flex items-center gap-3 text-lg">
            <Users className="w-6 h-6 text-purple-400" />
            <span>Bookings: {event.totalBookings || 0}</span>
          </div>
          <div className="flex items-center gap-3 text-lg">
            <DollarSign className="w-6 h-6 text-green-400" />
            <span>Revenue: ₹{event.totalRevenue || 0}</span>
          </div>
          {event.certificate && (
            <div className="flex items-center gap-3 text-lg">
              <Info className="w-6 h-6 text-blue-400" />
              <span>Certificate Provided</span>
            </div>
          )}
          {event.special && (
            <div className="flex items-center gap-3 text-lg">
              <Info className="w-6 h-6 text-blue-400" />
              <span>Special: {event.special}</span>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-blue-300 mt-8 mb-4">Seating Information</h2>
        {event.seats === 'RowColumns' ? (
          <p className="text-lg text-blue-200">Seat Map: Rows x Columns (details not rendered here)</p>
        ) : (
          <p className="text-lg text-blue-200">Total Seats: {event.seatMap?.length || 'N/A'}</p>
        )}
        <p className="text-lg text-blue-200">Status: <span className="font-semibold">{event.status?.charAt(0).toUpperCase() + event.status?.slice(1)}</span></p>

        <div className="mt-8 text-center">
          <Link to="/organizer/list-shows">
            <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-lg transition-colors">
              Back to Shows
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ShowDetails; 