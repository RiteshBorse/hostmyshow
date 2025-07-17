import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Minus, Search, User, Calendar } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Reviews = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [reviews, setReviews] = useState({
    positive: [],
    neutral: [],
    negative: []
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API}/events/get-my-events`, { withCredentials: true });
        setEvents(res.data.events || []);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch events');
      }
    };
    fetchEvents();
  }, []);

  // Fetch reviews for selected event
  const fetchReviews = async (eventId) => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API}/review/getreviews/${eventId}`);
      setReviews({
        positive: res.data.data.positive || [],
        neutral: res.data.data.neutral || [],
        negative: res.data.data.negative || []
      });
    } catch (err) {
      toast.error('Error fetching reviews');
      console.error("Error fetching reviews", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEventChange = (e) => {
    const eventId = e.target.value;
    setSelectedEvent(eventId);
    if (eventId) {
      fetchReviews(eventId);
    }
  };

  const ReviewCard = ({ review, type }) => {
    const getTypeStyles = () => {
      switch (type) {
        case 'positive':
          return 'border-green-500/30 bg-green-500/5';
        case 'negative':
          return 'border-red-500/30 bg-red-500/5';
        default:
          return 'border-yellow-500/30 bg-yellow-500/5';
      }
    };

    const getTypeIcon = () => {
      switch (type) {
        case 'positive':
          return <ThumbsUp className="w-5 h-5 text-green-400" />;
        case 'negative':
          return <ThumbsDown className="w-5 h-5 text-red-400" />;
        default:
          return <Minus className="w-5 h-5 text-yellow-400" />;
      }
    };

    return (
      <div className={`glass rounded-lg p-4 border ${getTypeStyles()}`}>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-gray-800">
            {getTypeIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 font-medium">{review.user_id?.username || 'Anonymous'}</span>
            </div>
            <p className="text-white/90">{review.review}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-blue-300">
              <Calendar className="w-4 h-4" />
              <span>{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen px-10 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-300">Event Reviews</h1>

      <div className="mb-8 flex flex-col md:flex-row items-center justify-center gap-4">
        <select
          className="glass p-3 rounded-lg border border-blue-400/20 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedEvent}
          onChange={handleEventChange}
        >
          <option value="">-- Select an Event --</option>
          {events.map((event) => (
            <option key={event._id} value={event._id}>
              {event.title}
            </option>
          ))}
        </select>

        <div className="relative flex items-center">
          <Search className="absolute left-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search reviews..."
            className="glass pl-10 pr-4 py-3 rounded-lg border border-blue-400/20 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center text-blue-300">Loading reviews...</div>
      ) : selectedEvent ? (
        <div className="space-y-8">
          {/* Positive Reviews */}
          <div>
            <h2 className="text-2xl font-semibold text-green-400 mb-4 flex items-center gap-2">
              <ThumbsUp />
              Positive Reviews ({reviews.positive.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.positive
                .filter(review => review.review.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(review => (
                  <ReviewCard key={review._id} review={review} type="positive" />
                ))}
            </div>
          </div>

          {/* Neutral Reviews */}
          <div>
            <h2 className="text-2xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
              <Minus />
              Neutral Reviews ({reviews.neutral.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.neutral
                .filter(review => review.review.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(review => (
                  <ReviewCard key={review._id} review={review} type="neutral" />
                ))}
            </div>
          </div>

          {/* Negative Reviews */}
          <div>
            <h2 className="text-2xl font-semibold text-red-400 mb-4 flex items-center gap-2">
              <ThumbsDown />
              Negative Reviews ({reviews.negative.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.negative
                .filter(review => review.review.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(review => (
                  <ReviewCard key={review._id} review={review} type="negative" />
                ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-blue-300 text-lg">
          Please select an event to view its reviews.
        </div>
      )}
    </div>
  );
};

export default Reviews;