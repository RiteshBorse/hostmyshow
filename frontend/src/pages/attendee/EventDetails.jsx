import React from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogClose } from '@/components/ui/dialog';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { userStore } from '@/context/userContext';

const EventDetails = () => {
  // Example event/movie data
  const [event , setEvent] = useState({});
  const {id} = useParams();
  const fetchEvent = async () => {
    console.log(id);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/events/get-events/${id}`);
      console.log(response.data)
      setEvent(response.data.event);
    } catch (error) {
      console.log(error)
    }
  }

  const [open, setOpen] = useState(false);
  const videoRef = useRef(null);

  const [reviews, setReviews] = useState([]);
const [newReview, setNewReview] = useState('');
const [loadingReviews, setLoadingReviews] = useState(false);

// Replace this with real user ID (from auth)
const user = userStore((state) => state.user);
console.log(user)

// Fetch reviews
const fetchReviews = async () => {
  try {
    setLoadingReviews(true);
    const res = await axios.get(`${import.meta.env.VITE_API}/review/getreviews/${id}`);
    const positiveReviews = res.data.data.positive || [];
    const neutralReviews = res.data.data.neutral || [];
    const negativeReviews = res.data.data.negative || [];
    setReviews(positiveReviews || neutralReviews || negativeReviews);
  } catch (err) {
    console.error("Error fetching reviews", err);
  } finally {
    setLoadingReviews(false);
  }
};

// Submit review
const submitReview = async () => {
  if (!newReview.trim()) return;

  try {
    await axios.post(`${import.meta.env.VITE_API}/review/addreview`, {
      user_id: user.id,
      event_id: id,
      review: newReview,
    });
    setNewReview('');
    fetchReviews(); // refresh list
  } catch (err) {
    console.error("Error submitting review", err);
  }
};


  // Reset video when dialog closes
  useEffect(()=> {
    fetchEvent();
    fetchReviews();
  },[])
  useEffect(() => {
    if (!open && videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [open]);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Banner background */}
      <div
        className="absolute inset-0 z-0 bg-black/90"
        style={{
          backgroundImage: `url(${event.banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(4px) brightness(1)',
        }}
      />
      <div className="absolute inset-0 bg-black/70 z-10" />
      {/* Main content */}
      <div className="my-14 relative z-20 w-full max-w-6xl flex flex-col md:flex-row items-center md:items-start gap-10 px-4 py-16">
        {/* Poster */}
        <img
          src={event.image}
          alt={event.title}
          className="h-2/3 w-1/2 object-cover object-center rounded-2xl shadow-4xl  border-2 border-amber-500/40 transition-all duration-300 flex-shrink-0"
        />
        {/* Details */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <span className="uppercase text-blue-400 font-semibold tracking-widest mb-2">{event.status}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-blue-400 text-lg">★</span>
            <span className="text-white font-semibold text-lg">{event.special}</span>
          </div>
          <p className="text-blue-100 mb-6 max-w-2xl">{event.description}</p>
          <div className="text-blue-200 font-medium mb-8">
          {event.eventDateTime && event.eventDateTime.map((date, index)  => (
            <span key={index}>
                {new Date(date).toLocaleString("en-IN", {
                dateStyle: "long",
                timeStyle: "short",
                timeZone: "Asia/Kolkata",
                })}
                {index < event.eventDateTime.length - 1 && <>, </>}
            </span>
            ))}
          </div>
          <div className="flex gap-4 flex-wrap justify-center md:justify-start">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow">Watch Trailer</button>
              </DialogTrigger>
              <DialogContent className="bg-black max-w-4xl w-full flex flex-col items-center p-0 overflow-hidden">
                <div className="w-full" style={{ aspectRatio: '16/7' }}>
                  <video
                    ref={videoRef}
                    width="100%"
                    height="100%"
                    controls
                    autoPlay
                    onEnded={() => setOpen(false)}
                    className="w-full h-full rounded-t-lg bg-black"
                  >
                    <source src={event.trailer} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </DialogContent>
            </Dialog>
            <Link to={`/seats/${id}`}><button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow">Buy Tickets</button></Link>
            <button className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 rounded-full transition-colors shadow border border-white/20 flex items-center justify-center"><span className="text-xl">♡</span></button>
          </div>
        </div>
      </div>
      {/* Reviews Section */}
      <div className="relative z-20 w-full max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-white mb-4">Reviews</h2>

        {/* Add New Review */}
        <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-6">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Add a public comment..."
            className="w-full p-3 bg-black/30 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={submitReview}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition-all"
            >
              Post
            </button>
          </div>
          <div className="space-y-4 max-h-[300px] mt-4 overflow-y-auto pr-2">
          {loadingReviews ? (
            <p className="text-blue-300">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-blue-300">No reviews yet. Be the first to add one!</p>
          ) : (
            reviews.map((review, index) => (
              <div key={index} className="bg-white/5 p-3 rounded-lg border border-white/10">
                <span className="text-lg text-blue-400 mt-1 block">{user.username}</span>
                <p className="text-blue-100 text-sm mt-1">{review.review}</p>
              </div>
            ))
          )}
        </div>
        </div>

        {/* Review List */}
        
      </div>

    </div>
  )
}

export default EventDetails
