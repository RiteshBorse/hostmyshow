import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Seats = () => {
  const [selectedTiming, setSelectedTiming] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketCost, setTicketCost] = useState(0);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchSeats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/events/get-seats-times/${id}`)
      console.log(response.data);
      setEventData(response.data);
      setTicketCost(response.data.cost || 0);
      if (response.data.eventDateTime && response.data.eventDateTime.length > 0) {
        setSelectedTiming(`${response.data.eventDateTime[0].date} ${response.data.eventDateTime[0].time}`);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(()=> {
    fetchSeats();
  } , [])

  const handleSeatClick = (seatId) => {
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seatId)
        ? prevSelectedSeats.filter((seat) => seat !== seatId)
        : [...prevSelectedSeats, seatId]
    );
  };

  // Add useEffect to log data whenever selections change
  useEffect(() => {
    const totalAmount = selectedSeats.length * ticketCost;
    console.log('Selected Seats:', selectedSeats);
    console.log('Selected Show Time:', selectedTiming);
    console.log('Total Amount:', totalAmount);
    console.log('Ticket Cost per seat:', ticketCost);
  }, [selectedSeats, selectedTiming, ticketCost]);

  const handleProceedToCheckout = () => {
    const totalAmount = selectedSeats.length * ticketCost;
    
    // Log the data being sent to checkout
    console.log('Data being sent to Checkout:');
    console.log('Selected Seats:', selectedSeats);
    console.log('Selected Show Time:', selectedTiming);
    console.log('Total Amount:', totalAmount);
    console.log('Event ID:', id);
    console.log('Event Data:', eventData);

    // Navigate to checkout with state data
    navigate(`/checkout/${id}`, {
      state: {
        selectedSeats,
        selectedTiming,
        totalAmount,
        ticketCost,
        eventData
      }
    });
  };

  const renderSeats = () => {
    if (!eventData?.seatMap) return [];

    return eventData.seatMap.map((seat) => {
      const isSelected = selectedSeats.includes(seat.seatLabel);
      const isBooked = seat.isBooked;

      return (
        <button
          key={seat._id}
          className={`w-10 h-10 m-1 rounded flex items-center justify-center text-sm font-semibold
            ${isSelected ? 'bg-blue-500 text-white' : isBooked ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-blue-800/50 text-blue-200 hover:bg-blue-700/50'}
            transition-colors duration-200`}
          onClick={() => !isBooked && handleSeatClick(seat.seatLabel)}
          disabled={isBooked}
        >
          {seat.seatLabel}
        </button>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-xl">Loading seats...</div>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-xl">Error loading seats</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left Section: Available Timings */}
        <div className="w-full lg:w-1/4 glass rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-6">Available Timings</h2>
          <div className="space-y-4">
            {eventData.eventDateTime?.map((dateTime, index) => {
              const timing = `${dateTime.date} ${dateTime.time}`;
              return (
                <button
                  key={timing}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center space-x-3
                    ${selectedTiming === timing ? 'bg-blue-600 text-white' : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'}
                    transition-colors duration-200`}
                  onClick={() => setSelectedTiming(timing)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span>{timing}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Section: Seat Selection */}
        <div className="w-full lg:w-3/4 glass rounded-xl p-6 shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-8">Select your seat</h2>
          
          {/* Screen Indicator */}
          <div className="w-3/4 bg-blue-700 h-2 rounded-full mb-4"></div>
          <p className="text-gray-400 text-sm mb-8">SCREEN SIDE</p>

          {/* Seat Grid */}
          <div className="grid grid-cols-5 gap-2 justify-center">
            {renderSeats()}
          </div>

          {/* Selected Seats and Total */}
          <div className="mt-8 w-full text-center">
            <p className="text-lg text-gray-300">Selected Seats: <span className="font-semibold text-white">{selectedSeats.join(', ') || 'None'}</span></p>
            <p className="text-lg text-gray-300">Total: <span className="font-semibold text-white">₹{selectedSeats.length * ticketCost}</span></p>
          </div>

          {/* Proceed Button */}
          <div className="mt-6 w-full flex justify-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={selectedSeats.length === 0}
              onClick={handleProceedToCheckout}
            >
              Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Seats;
