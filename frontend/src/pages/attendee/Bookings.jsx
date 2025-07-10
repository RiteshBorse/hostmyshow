import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BookingCard = ({ booking }) => {
  const event = booking.event_id;

  if (!event) return null;

  return (
    <div className="glass rounded-xl shadow-lg overflow-hidden flex flex-col items-center relative">
      {event.image && (
        <img
          src={event.image}
          alt={event.title}
          className="w-3/4 h-2/3 object-cover object-center rounded-lg mt-6 shadow-lg border-1 bg-white"
        />
      )}

      <div className="p-6 flex flex-col flex-1 w-full items-center">
        <h3 className="text-xl font-bold text-white mb-2 text-center">{event.title}</h3>

        <div className="flex flex-wrap items-center gap-2 text-blue-200 text-sm mb-2 justify-center">
          {event.eventType && (
            <span className="bg-blue-700 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
              {event.eventType}
            </span>
          )}
          <span>
            {new Date(event.eventDateTime[0]).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short',
              timeZone: 'Asia/Kolkata'
            })}
          </span>
          <span>•</span>
          <span>{event.location}</span>
        </div>

        <div className="text-sm text-blue-100 mb-1">Seats: {booking.seats}</div>
        <div className="text-sm text-blue-100 mb-1">Paid: ₹{booking.paymentAmt}</div>

        <div className="text-sm font-semibold px-2 py-1 rounded text-yellow-300">
          Status: {booking.event_status}
        </div>

        <Link to={`/events/${event._id}`}>
          <button className="mt-4 bg-blue-700 hover:bg-blue-800 px-4 text-white font-semibold py-2 rounded-lg transition-colors shadow glow-blue w-full">
            View Event
          </button>
        </Link>
      </div>
    </div>
  );
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API}/events/get-my-bookings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setBookings(res.data.bookings);
    } catch (error) {
      console.log("Failed to fetch bookings", error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen px-4 py-5 bg-transparent flex flex-col items-center">
      <p className="text-white text-3xl font-bold self-start px-20 py-4">My Bookings</p>
      {loading ? (
        <p className="text-blue-200 text-center mt-10">Loading bookings...</p>
      ) : bookings.length === 0 ? (
        <p className="text-blue-200 text-center mt-10">You haven't booked any events yet.</p>
      ) : (
        <div className="w-full px-20 grid gap-8 grid-cols-1 md:grid-cols-3">
          {bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
