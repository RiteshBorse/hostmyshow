import axios from 'axios';
import React, { useState, useRef } from 'react'
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';

const Seats = () => {
  const [selectedTiming, setSelectedTiming] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketCost, setTicketCost] = useState(0);
  const [lockedSeats, setLockedSeats] = useState(new Set());
  const [seatLocks, setSeatLocks] = useState(new Map());
  const [isSelecting, setIsSelecting] = useState(false);
  const socketRef = useRef(null);
  const lockTimeouts = useRef(new Map());
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

  // Initialize WebSocket connection
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API, {
      withCredentials: true
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to server');
      socketRef.current.emit('join-event', id);
    });

    socketRef.current.on('seat-selected', (data) => {
      const { seatLabel, userId } = data;
      // Only add to locked seats if it's not the current user
      // Current user's selections are handled by selectedSeats state
      setSeatLocks(prev => new Map(prev.set(seatLabel, { 
        userId, 
        timestamp: data.timestamp,
        isCurrentUser: false // This is from another user
      })));
      setLockedSeats(prev => new Set(prev.add(seatLabel)));
    });

    socketRef.current.on('seat-deselected', (data) => {
      const { seatLabel } = data;
      setSeatLocks(prev => {
        const newMap = new Map(prev);
        newMap.delete(seatLabel);
        return newMap;
      });
      setLockedSeats(prev => {
        const newSet = new Set(prev);
        newSet.delete(seatLabel);
        return newSet;
      });
    });

    socketRef.current.on('seat-selection-error', (data) => {
      toast.error(data.error);
    });

    socketRef.current.on('seats-booked', (data) => {
      const { seats } = data;
      // Remove booked seats from selected seats if user had them selected
      setSelectedSeats(prev => prev.filter(seat => !seats.includes(seat)));
      
      // Update locked seats to remove booked ones
      setLockedSeats(prev => {
        const newSet = new Set(prev);
        seats.forEach(seat => newSet.delete(seat));
        return newSet;
      });
      
      // Clear timeouts for booked seats
      seats.forEach(seat => {
        if (lockTimeouts.current.has(seat)) {
          clearTimeout(lockTimeouts.current.get(seat));
          lockTimeouts.current.delete(seat);
        }
      });
      
      toast.info(`Seats ${seats.join(', ')} have been booked by another user`);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave-event', id);
        socketRef.current.disconnect();
      }
      
      // Clear all timeouts
      lockTimeouts.current.forEach(timeoutId => clearTimeout(timeoutId));
      lockTimeouts.current.clear();
    };
  }, [id]);

  useEffect(()=> {
    fetchSeats();
  } , [])

  // Periodic refresh of seat locks to handle expired locks
  useEffect(() => {
    const refreshLocks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API}/events/seat-locks/${id}`, { withCredentials: true });
        if (response.data.success) {
          const currentUserId = response.data.currentUserId;
          
          // Separate locks by current user vs other users
          const currentUserLocks = response.data.locks.filter(lock => lock.isCurrentUser);
          const otherUserLocks = response.data.locks.filter(lock => !lock.isCurrentUser);
          
          // Only show other users' locks as "locked" - current user's locks are handled by selectedSeats
          const otherUserLockedSeats = new Set(otherUserLocks.map(lock => lock.seatLabel));
          const allSeatLocks = new Map(response.data.locks.map(lock => [lock.seatLabel, { 
            userId: lock.userId, 
            timestamp: lock.lockedAt,
            isCurrentUser: lock.isCurrentUser
          }]));
          
          setLockedSeats(otherUserLockedSeats);
          setSeatLocks(allSeatLocks);
        }
      } catch (error) {
        console.error('Error refreshing seat locks:', error);
      }
    };

    // Refresh locks every 30 seconds
    const interval = setInterval(refreshLocks, 30000);
    
    // Initial refresh
    refreshLocks();

    return () => clearInterval(interval);
  }, [id]);

  const handleSeatClick = async (seatId) => {
    if (isSelecting) return;
    
    const isCurrentlySelected = selectedSeats.includes(seatId);
    const isCurrentlyLocked = lockedSeats.has(seatId);
    
    if (isCurrentlySelected) {
      // Deselecting seat
      await handleSeatDeselection(seatId);
    } else if (!isCurrentlyLocked) {
      // Selecting seat
      await handleSeatSelection(seatId);
    } else {
      const lockInfo = seatLocks.get(seatId);
      const lockAge = lockInfo ? Date.now() - new Date(lockInfo.timestamp).getTime() : 0;
      const remainingTime = Math.max(0, 5 * 60 * 1000 - lockAge); // 5 minutes total lock time
      
      if (remainingTime > 0) {
        toast.error(`This seat is being selected by another user. Available in ${Math.ceil(remainingTime / 1000)} seconds`);
      } else {
        toast.error('This seat is currently being selected by another user');
      }
    }
  };

  const handleSeatSelection = async (seatId, retryCount = 0) => {
    setIsSelecting(true);
    try {
      // Lock seat on server
      const response = await axios.post(`${import.meta.env.VITE_API}/events/lock-seat`, {
        eventId: id,
        seatLabel: seatId
      }, { withCredentials: true });
      
      if (response.data.success) {
        // Add to selected seats
        setSelectedSeats(prev => [...prev, seatId]);
        
        // Emit selection to other users
        if (socketRef.current) {
          socketRef.current.emit('select-seat', {
            eventId: id,
            seatLabel: seatId,
            userId: 'current-user' // You might want to get this from context
          });
        }
        
        // Set timeout to auto-unlock after 4.5 minutes (before server expiry)
        const timeoutId = setTimeout(async () => {
          try {
            await handleSeatDeselection(seatId);
          } catch (error) {
            console.error('Error auto-unlocking seat:', error);
          }
        }, 4.5 * 60 * 1000); // 4.5 minutes
        
        lockTimeouts.current.set(seatId, timeoutId);
        toast.success(`Seat ${seatId} selected`);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to select seat';
      
      // Retry logic for network errors
      if (retryCount < 2 && (error.code === 'NETWORK_ERROR' || error.response?.status >= 500)) {
        toast.error(`Retrying seat selection... (${retryCount + 1}/2)`);
        setTimeout(() => handleSeatSelection(seatId, retryCount + 1), 1000);
        return;
      }
      
      toast.error(errorMessage);
      console.error('Error selecting seat:', error);
    } finally {
      setIsSelecting(false);
    }
  };

  const handleSeatDeselection = async (seatId, retryCount = 0) => {
    try {
      // Unlock seat on server
      await axios.post(`${import.meta.env.VITE_API}/events/unlock-seat`, {
        eventId: id,
        seatLabel: seatId
      }, { withCredentials: true });
      
      // Remove from selected seats
      setSelectedSeats(prev => prev.filter(seat => seat !== seatId));
      
      // Emit deselection to other users
      if (socketRef.current) {
        socketRef.current.emit('deselect-seat', {
          eventId: id,
          seatLabel: seatId,
          userId: 'current-user' // You might want to get this from context
        });
      }
      
      // Clear timeout if exists
      if (lockTimeouts.current.has(seatId)) {
        clearTimeout(lockTimeouts.current.get(seatId));
        lockTimeouts.current.delete(seatId);
      }
      
      toast.success(`Seat ${seatId} deselected`);
    } catch (error) {
      // Retry logic for network errors
      if (retryCount < 2 && (error.code === 'NETWORK_ERROR' || error.response?.status >= 500)) {
        toast.error(`Retrying seat deselection... (${retryCount + 1}/2)`);
        setTimeout(() => handleSeatDeselection(seatId, retryCount + 1), 1000);
        return;
      }
      
      toast.error('Failed to deselect seat');
      console.error('Error deselecting seat:', error);
    }
  };

  // Add useEffect to log data whenever selections change
  useEffect(() => {
    const totalAmount = selectedSeats.length * ticketCost;
    console.log('Selected Seats:', selectedSeats);
    console.log('Selected Show Time:', selectedTiming);
    console.log('Total Amount:', totalAmount);
    console.log('Ticket Cost per seat:', ticketCost);
  }, [selectedSeats, selectedTiming, ticketCost]);

  // Cleanup on page unload
  useEffect(() => {
    const handleBeforeUnload = async () => {
      // Unlock all selected seats when user leaves the page
      for (const seatId of selectedSeats) {
        try {
          await axios.post(`${import.meta.env.VITE_API}/events/unlock-seat`, {
            eventId: id,
            seatLabel: seatId
          }, { withCredentials: true });
        } catch (error) {
          console.error('Error unlocking seat on page unload:', error);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [selectedSeats, id]);

  const handleProceedToCheckout = async () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    const totalAmount = selectedSeats.length * ticketCost;
    
    try {
      // Check seat availability with locks before proceeding
      const response = await axios.post(`${import.meta.env.VITE_API}/events/check-seats-with-locks`, {
        event_id: id,
        seats: selectedSeats
      }, { withCredentials: true });

      if (!response.data.available) {
        if (response.data.alreadyBooked?.length > 0) {
          toast.error(`Seats ${response.data.alreadyBooked.join(', ')} are already booked`);
        }
        if (response.data.currentlyLocked?.length > 0) {
          toast.error(`Seats ${response.data.currentlyLocked.join(', ')} are being selected by other users`);
        }
        return;
      }

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
    } catch (error) {
      toast.error('Failed to verify seat availability');
      console.error('Error checking seat availability:', error);
    }
  };

  const renderSeats = () => {
    if (!eventData?.seatMap) return [];

    return eventData.seatMap.map((seat) => {
      const isSelected = selectedSeats.includes(seat.seatLabel);
      const isBooked = seat.isBooked;
      const isLockedByOthers = lockedSeats.has(seat.seatLabel); // This now only contains other users' locks
      const isCurrentlySelecting = isSelecting; // Renamed to avoid conflict

      let seatClass = 'w-10 h-10 m-1 rounded flex items-center justify-center text-sm font-semibold transition-colors duration-200 ';
      
      if (isBooked) {
        seatClass += 'bg-gray-600 text-gray-400 cursor-not-allowed';
      } else if (isSelected) {
        seatClass += 'bg-green-500 text-white shadow-lg ring-2 ring-green-300';
      } else if (isLockedByOthers) {
        seatClass += 'bg-yellow-500 text-yellow-900 cursor-not-allowed animate-pulse';
      } else if (isCurrentlySelecting) {
        seatClass += 'bg-blue-300 text-blue-900 cursor-wait';
      } else {
        seatClass += 'bg-blue-800/50 text-blue-200 hover:bg-blue-700/50 cursor-pointer';
      }

      return (
        <button
          key={seat._id}
          className={seatClass}
          onClick={() => !isBooked && !isLockedByOthers && !isCurrentlySelecting && handleSeatClick(seat.seatLabel)}
          disabled={isBooked || isLockedByOthers || isCurrentlySelecting}
          title={
            isBooked ? 'Booked' : 
            isSelected ? 'Selected by you' : 
            isLockedByOthers ? 'Being selected by another user' : 
            'Available'
          }
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

          {/* Seat Legend */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-800/50 rounded"></div>
              <span className="text-gray-300">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded ring-2 ring-green-300"></div>
              <span className="text-gray-300">Selected by you</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded animate-pulse"></div>
              <span className="text-gray-300">Being selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-600 rounded"></div>
              <span className="text-gray-300">Booked</span>
            </div>
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
