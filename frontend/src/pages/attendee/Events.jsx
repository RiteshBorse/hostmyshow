import { Input } from '@/components/ui/input';
import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

// Gold glowing animation for sponsored plate
const goldGlowStyle = `
@keyframes glow-gold {
  0% { box-shadow: 0 0 16px 4px #FFD700, 0 0 32px 8px #FFD70055; }
  50% { box-shadow: 0 0 32px 8px #FFD700, 0 0 64px 16px #FFD70099; }
  100% { box-shadow: 0 0 16px 4px #FFD700, 0 0 32px 8px #FFD70055; }
}
.animate-glow-gold {
  animation: glow-gold 2s infinite alternate;
}

@keyframes glow-silver {
  0% { box-shadow: 0 0 16px 4px #C0C0C0, 0 0 32px 8px #C0C0C055; }
  50% { box-shadow: 0 0 32px 8px #C0C0C0, 0 0 64px 16px #C0C0C099; }
  100% { box-shadow: 0 0 16px 4px #C0C0C0, 0 0 32px 8px #C0C0C055; }
}
.animate-glow-silver {
  animation: glow-silver 2s infinite alternate;
}

@keyframes glow-blue {
  0% { box-shadow: 0 0 16px 4px #3B82F6, 0 0 32px 8px #3B82F655; }
  50% { box-shadow: 0 0 32px 8px #3B82F6, 0 0 64px 16px #3B82F699; }
  100% { box-shadow: 0 0 16px 4px #3B82F6, 0 0 32px 8px #3B82F655; }
}
.animate-glow-blue {
  animation: glow-blue 2s infinite alternate;
}

@keyframes glow-purple {
  0% { box-shadow: 0 0 16px 4px #A21CAF, 0 0 32px 8px #A21CAF55; }
  50% { box-shadow: 0 0 32px 8px #A21CAF, 0 0 64px 16px #A21CAF99; }
  100% { box-shadow: 0 0 16px 4px #A21CAF, 0 0 32px 8px #A21CAF55; }
}
.animate-glow-purple {
  animation: glow-purple 2s infinite alternate;
}
`;

// EventCard component
const plateStyles = {
  'Special Sponsored': {
    className: 'absolute top-4 left-1/2 -translate-x-1/2 z-10 px-6 py-2 rounded-full font-bold text-yellow-900 text-sm bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 shadow-lg animate-glow-gold border-2 border-yellow-400',
    label: 'Special Sponsored',
  },
  'Spotlight Event': {
    className: 'absolute top-4 left-1/2 -translate-x-1/2 z-10 px-6 py-2 rounded-full font-bold text-gray-900 text-sm bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 shadow-lg animate-glow-silver border-2 border-gray-300',
    label: 'Spotlight Event',
  },
  'Prime Listing': {
    className: 'absolute top-4 left-1/2 -translate-x-1/2 z-10 px-6 py-2 rounded-full font-bold text-blue-900 text-sm bg-gradient-to-r from-blue-200 via-blue-400 to-blue-500 shadow-lg animate-glow-blue border-2 border-blue-400',
    label: 'Prime Listing',
  },
  'Elite': {
    className: 'absolute top-4 left-1/2 -translate-x-1/2 z-10 px-6 py-2 rounded-full font-bold text-purple-900 text-sm bg-gradient-to-r from-purple-200 via-purple-400 to-purple-500 shadow-lg animate-glow-purple border-2 border-purple-400',
    label: 'Elite',
  },
};

function EventCard({ _id, title, date, category, location, image, description, plate }) {
  return (
    <div className="glass rounded-xl shadow-lg overflow-hidden flex flex-col items-center relative">
      {plate && plateStyles[plate] && (
        <div className={plateStyles[plate].className}>{plateStyles[plate].label}</div>
      )}
      <img src={image} alt={title} className="w-[90%] h-2/3 object-cover object-center rounded-lg mt-6 shadow-lg  bg-white" />
      <div className="p-6 flex flex-col flex-1 w-full items-center">
        <h3 className="text-xl font-bold text-white mb-2 text-center">{title}</h3>
        <div className="flex flex-wrap items-center gap-2 text-blue-200 text-sm mb-2 justify-center">
          <span className="bg-blue-700 text-white px-2 py-0.5 rounded-full text-xs font-semibold">{category}</span>
          <span>{date}</span>
          <span>•</span>
          <span>{location}</span>
        </div>
        <p className="text-blue-100 mb-4 flex-1 text-center">{description}</p>
        <Link to={`/events/${_id}`}><button className="mt-auto bg-blue-700 hover:bg-blue-800 px-4 text-white font-semibold py-2 rounded-lg transition-colors shadow glow-blue w-full">View Details</button></Link>
      </div>
    </div>
  );
}

const Events = () => {
  // Example event data
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState("All");
  const [dateFilter, setDateFilter] = React.useState("All");
  const [specialFilter, setSpecialFilter] = React.useState("All");
  const [startDate, setStartDate] = React.useState("");
  const categories = ["All", "Conference", "Workshop", "Meetup", "Webinar"];
  const dateFilters = ["All", "Upcoming", "Past"];
  const specialFilters = ["All", "Special Sponsored", "Spotlight Event", "Prime Listing",
   "Elite"];
  const [events , setEvents] = useState([]);
  // const events = [
  //   {
  //     id: 1,
  //     title: "React Summit 2024",
  //     date: "2024-08-12",
  //     category: "Conference",
  //     location: "San Francisco, CA",
  //     image: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  //     description: "A global React conference with top speakers and workshops.",
  //     special: "Special Sponsored"
  //   },
  //   {
  //     id: 2,
  //     title: "AI & ML Workshop",
  //     date: "2024-09-05",
  //     category: "Workshop",
  //     location: "Online",
  //     image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  //     description: "Hands-on workshop on Artificial Intelligence and Machine Learning.",
  //     special: "Spotlight Event"
  //   },
  //   {
  //     id: 3,
  //     title: "Tech Meetup Night",
  //     date: "2024-07-20",
  //     category: "Meetup",
  //     location: "New York, NY",
  //     image: "https://images.unsplash.com/photo-1515168833906-d2a3b82b3029?auto=format&fit=crop&w=400&q=80",
  //     description: "Network with tech enthusiasts and professionals.",
  //     special: "Prime Listing"
  //   },
  //   {
  //     id: 4,
  //     title: "Web Development Webinar",
  //     date: "2024-10-10",
  //     category: "Webinar",
  //     location: "Online",
  //     image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
  //     description: "Learn the latest in web development from industry experts.",
  //     special: "Elite"
  //   },
  // ];
  
  const fetchEvent = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API}/events/get-events`)
        console.log(response.data);
        setEvents(response.data.events)
      } catch (error) {
        console.log(error.response.data.message)
        console.log(error)
      }
  }
  useEffect(() => {
    fetchEvent();
  },[])
  // Filter and search logic
  const now = new Date();
  const filteredEvents = events?.filter((event) => {
    const matchesCategory = filter === "All" || event.category === filter;
    const matchesSearch = event.title.toLowerCase().includes(search.toLowerCase()) || event.description.toLowerCase().includes(search.toLowerCase());
    let matchesDate = true;
    if (dateFilter === "Upcoming") {
      matchesDate = new Date(event.date) >= now;
    } else if (dateFilter === "Past") {
      matchesDate = new Date(event.date) < now;
    }
    if (startDate) {
      matchesDate = matchesDate && event.date === startDate;
    }
    let matchesSpecial = true;
    if (specialFilter !== "All") {
      matchesSpecial = event.special === specialFilter;
    }
    return matchesCategory && matchesSearch && matchesDate && matchesSpecial;
  });

  return (
    <>
      <style>{goldGlowStyle}</style>
      <div className="min-h-screen px-4 py-5 bg-transparent flex flex-col items-center">
        <p className='text-white text-3xl font-bold self-start px-20 py-4'>Events</p>
        <div className="w-full px-20 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col w-1/2">
            <label htmlFor="search" className="text-white mb-1">Search</label>
            <Input
              id="search"
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-12 text-white border-white/40 placeholder:text-white/60"
            />
          </div>
          <div className="flex flex-col w-1/4">
            <label htmlFor="category" className="text-white mb-1">Category</label>
            <select
              id="category"
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="px-2 h-12 text-white placeholder:text-white/60 border-1 rounded-md border-white/40"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-1/4">
            <label htmlFor="dateFilter" className="text-white mb-1">Date Filter</label>
            <select
              id="dateFilter"
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="h-12 px-2 text-white placeholder:text-white/60 border-1 rounded-md border-white/40"
            >
              {dateFilters.map(df => (
                <option key={df} value={df}>{df}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-1/4">
            <label htmlFor="specialFilter" className="text-white mb-1">Special</label>
            <select
              id="specialFilter"
              value={specialFilter}
              onChange={e => setSpecialFilter(e.target.value)}
              className="h-12 px-2 text-white placeholder:text-white/60 border-1 rounded-md border-white/40"
            >
              {specialFilters.map(sf => (
                <option key={sf} value={sf}>{sf}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col w-1/4">
            <label htmlFor="startDate" className="text-white mb-1">Event Date</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="h-12 text-white bg-transparent border-1 rounded-md border-white/40 px-2"
            />
          </div>
        </div>
        <div className="w-full px-20 grid gap-8 grid-cols-1 md:grid-cols-3">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center text-blue-200">No events found.</div>
          ) : (
            filteredEvents.map((event) => (
              <EventCard
                _id = {event._id}
                title={event.title}
                date={event.date}
                category={event.category}
                location={event.location}
                image={event.image}
                description={event.description}
                plate={event.special || undefined}
              />
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default Events
