import React, { useState, useMemo, useEffect } from 'react';
import { Calendar, Clock, User, Ticket, DollarSign, Search } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ListBookings = () => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Confirmed', 'Pending'
  const [events, setEvents] = useState([]);
  const [allBookings, setAllBookings] = useState({});

  useEffect(() => {
    // Fetch bookings from backend
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API}/events/get-bookings`, { withCredentials: true });
        const bookings = res.data.bookings || [];
        // Group bookings by event_id
        const bookingsByEvent = {};
        const eventMap = {};
        bookings.forEach(booking => {
          const eventId = booking.event_id?._id || booking.event_id;
          if (!bookingsByEvent[eventId]) bookingsByEvent[eventId] = [];
          bookingsByEvent[eventId].push({
            id: booking._id,
            userName: booking.user_id?.username || 'Unknown',
            bookingTime: booking.booking_dateTime,
            seats: booking.seats.split(','),
            total: booking.paymentAmt,
            status: 'Confirmed', // You can update this if you have a status field
          });
          // Collect event info
          if (booking.event_id && booking.event_id.title) {
            eventMap[eventId] = { id: eventId, title: booking.event_id.title };
          }
        });
        setAllBookings(bookingsByEvent);
        setEvents(Object.values(eventMap));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch bookings');
      }
    };
    fetchBookings();
  }, []);

  const bookingsForSelectedEvent = useMemo(() => {
    let filteredBookings = selectedEvent ? allBookings[selectedEvent] || [] : [];

    if (searchTerm) {
      filteredBookings = filteredBookings.filter(booking =>
        booking.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'All') {
      filteredBookings = filteredBookings.filter(booking =>
        booking.status === filterStatus
      );
    }

    return filteredBookings;
  }, [selectedEvent, searchTerm, filterStatus, allBookings]);

  return (
    <div className="min-h-screen p-10 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-300">Manage Bookings</h1>

      <div className="mb-8 flex flex-col md:flex-row items-center justify-center gap-4">
        <label htmlFor="event-select" className="text-lg font-semibold">Select Event:</label>
        <select
          id="event-select"
          className="glass p-3 rounded-lg border border-blue-400/20 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          <option value="">-- Select an Event --</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>
      </div>

      {selectedEvent && (
        <div className="mb-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by attendee name..."
              className="glass pl-10 pr-4 py-3 rounded-lg border border-blue-400/20 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="glass p-3 rounded-lg border border-blue-400/20 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      )}

      {selectedEvent && (bookingsForSelectedEvent.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookingsForSelectedEvent.map((booking) => (
            <div key={booking.id} className="glass rounded-lg shadow-xl p-6 border border-blue-400/20">
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-400" /> {booking.userName}
              </h3>
              <p className="text-blue-200 text-sm mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Booking Time: {new Date(booking.bookingTime).toLocaleString()}
              </p>
              <p className="text-blue-200 text-sm mb-2 flex items-center gap-2">
                <Ticket className="w-4 h-4" /> Seats: {booking.seats.join(', ')}
              </p>
              <p className="text-blue-200 text-sm mb-2 flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Total: ₹{booking.total}
              </p>
              <p className="text-blue-200 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" /> Status: <span className={`font-semibold ${booking.status === 'Confirmed' ? 'text-green-400' : 'text-yellow-400'}`}>{booking.status}</span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-blue-300 text-lg">No bookings found for this event matching your criteria.</p>
      ))}

      {!selectedEvent && (
        <p className="text-center text-blue-300 text-lg">Please select an event to view its bookings.</p>
      )}
    </div>
  );
};

export default ListBookings;