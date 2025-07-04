import React from 'react'
import { Calendar, MapPin, Ticket, DollarSign } from 'lucide-react'

const Checkout = () => {
  // Mock data for selected event and seats
  const event = {
    title: "The Accountant²",
    date: "2025-08-12",
    time: "7:30 PM",
    location: "PVR Cinemas, Downtown",
    poster: "https://m.media-amazon.com/images/I/91dAIcmOjAL._AC_UF1000,1000_QL80_.jpg",
    duration: "2h 15m",
    genre: "Action, Thriller",
  };
  const selectedSeats = ["B5", "B6", "B7"];
  const seatPrice = 350;
  const convenienceFee = 50;
  const total = selectedSeats.length * seatPrice + convenienceFee;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 ">
      <div className="glass rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col items-center border border-blue-400/20">
        <h2 className="text-3xl font-bold text-white mb-8">Confirm Your Booking</h2>

        {/* Event Details Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 w-full mb-8 pb-8 border-b border-blue-400/20">
          <img src={event.poster} alt={event.title} className="w-32 h-44 object-cover rounded-lg shadow-lg border-2 border-blue-500" />
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-white mb-2">{event.title}</h3>
            <p className="text-blue-200 text-sm flex items-center justify-center md:justify-start gap-2 mb-1">
              <Calendar className="w-4 h-4" /> {event.date} • {event.time}
            </p>
            <p className="text-blue-200 text-sm flex items-center justify-center md:justify-start gap-2 mb-1">
              <MapPin className="w-4 h-4" /> {event.location}
            </p>
            <p className="text-blue-300 text-xs mt-2">Duration: {event.duration} | Genre: {event.genre}</p>
          </div>
        </div>

        {/* Booking Summary Section */}
        <div className="w-full mb-8">
          <h4 className="text-xl font-semibold text-white mb-4">Booking Summary</h4>
          
          <div className="space-y-3 mb-4">
            <div className="flex justify-between text-blue-200">
              <span>Seats ({selectedSeats.length})</span>
              <span className="font-semibold text-white flex items-center gap-2">
                <Ticket className="w-4 h-4" /> {selectedSeats.join(', ')}
              </span>
            </div>
            <div className="flex justify-between text-blue-200">
              <span>Price per seat</span>
              <span className="font-semibold text-white">₹{seatPrice}</span>
            </div>
            <div className="flex justify-between text-blue-200">
              <span>Convenience Fee</span>
              <span className="font-semibold text-white">₹{convenienceFee}</span>
            </div>
          </div>

          <div className="w-full flex justify-between items-center text-white font-bold text-2xl pt-4 border-t border-blue-400/20">
            <span>Total Payable</span>
            <span className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" /> ₹{total}
            </span>
          </div>
        </div>

        {/* Payment Button */}
        <div className="relative w-full p-1 rounded-lg overflow-hidden shining-border">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors shadow-lg text-xl relative z-10">
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
