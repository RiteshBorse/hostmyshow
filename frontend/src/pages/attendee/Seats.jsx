import React, { useState } from 'react'

const Seats = () => {
  const [selectedTiming, setSelectedTiming] = useState('11:30 PM');
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Example data for timings and seats (can be fetched from backend)
  const timings = ['08:30 PM', '11:30 PM', '04:30 AM'];
  const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = 9;

  const handleSeatClick = (seatId) => {
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seatId)
        ? prevSelectedSeats.filter((seat) => seat !== seatId)
        : [...prevSelectedSeats, seatId]
    );
  };

  const renderSeats = () => {
    const seats = [];
    seatRows.forEach((rowLetter) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const seatId = `${rowLetter}${i}`;
        const isSelected = selectedSeats.includes(seatId);
        const isReserved = ['A1', 'A2', 'C1', 'C2'].includes(seatId); // Example reserved seats

        seats.push(
          <button
            key={seatId}
            className={`w-10 h-10 m-1 rounded flex items-center justify-center text-sm font-semibold
              ${isSelected ? 'bg-blue-500 text-white' : isReserved ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-blue-800/50 text-blue-200 hover:bg-blue-700/50'}
              transition-colors duration-200`}
            onClick={() => !isReserved && handleSeatClick(seatId)}
            disabled={isReserved}
          >
            {seatId}
          </button>
        );
      }
    });
    return seats;
  };

  return (
    <div className="min-h-screen  text-white py-12 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Left Section: Available Timings */}
        <div className="w-full lg:w-1/4 glass rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-6">Available Timings</h2>
          <div className="space-y-4">
            {timings.map((timing) => (
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
            ))}
          </div>
        </div>

        {/* Right Section: Seat Selection */}
        <div className="w-full lg:w-3/4 glass rounded-xl p-6 shadow-lg flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-8">Select your seat</h2>
          
          {/* Screen Indicator */}
          <div className="w-3/4 bg-blue-700 h-2 rounded-full mb-4"></div>
          <p className="text-gray-400 text-sm mb-8">SCREEN SIDE</p>

          {/* Seat Grid */}
          <div className="grid grid-cols-9 gap-2 justify-center">
            {renderSeats()}
          </div>

          {/* Selected Seats and Total */}
          <div className="mt-8 w-full text-center">
            <p className="text-lg text-gray-300">Selected Seats: <span className="font-semibold text-white">{selectedSeats.join(', ') || 'None'}</span></p>
            <p className="text-lg text-gray-300">Total: <span className="font-semibold text-white">${selectedSeats.length * 10}</span></p> {/* Assuming $10 per seat */}
          </div>

          {/* Proceed Button */}
          <div className="mt-6 w-full flex justify-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={selectedSeats.length === 0}
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
