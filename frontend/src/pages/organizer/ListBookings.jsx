import React, { useState, useMemo } from 'react';
import { Calendar, Clock, User, Ticket, DollarSign, Search } from 'lucide-react';

const ListBookings = () => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'Confirmed', 'Pending'

  // Mock data for events and bookings
  const events = [
    { id: '1', title: 'The Accountant²' },
    { id: '2', title: 'Interstellar' },
    { id: '3', title: 'Inception' },
  ];

  const allBookings = {
    '1': [
      { id: 'b1', userName: 'Alice Smith', bookingTime: '2025-08-10 10:30 AM', seats: ['A1', 'A2'], total: 700, status: 'Confirmed' },
      { id: 'b2', userName: 'Bob Johnson', bookingTime: '2025-08-10 11:00 AM', seats: ['B5'], total: 350, status: 'Confirmed' },
      { id: 'b3', userName: 'Charlie Brown', bookingTime: '2025-08-10 01:00 PM', seats: ['C3', 'C4', 'C5'], total: 1050, status: 'Pending' },
    ],
    '2': [
      { id: 'b4', userName: 'Diana Prince', bookingTime: '2025-08-28 09:00 AM', seats: ['D1', 'D2'], total: 700, status: 'Confirmed' },
      { id: 'b5', userName: 'Clark Kent', bookingTime: '2025-08-29 02:00 PM', seats: ['E7'], total: 350, status: 'Confirmed' },
    ],
    '3': [
      { id: 'b6', userName: 'Bruce Wayne', bookingTime: '2025-07-18 05:00 PM', seats: ['F1', 'F2', 'F3'], total: 1050, status: 'Confirmed' },
    ],
  };

  const bookingsForSelectedEvent = useMemo(() => {
    let filteredBookings = selectedEvent ? allBookings[selectedEvent] : [];

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
  }, [selectedEvent, searchTerm, filterStatus]);

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