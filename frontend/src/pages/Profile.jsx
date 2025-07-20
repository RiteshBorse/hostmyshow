import React, { useEffect, useState } from 'react'
import { Edit2 } from 'lucide-react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Profile = () => {
  const [user, setUser] = useState(null)
  const [bookedEvents, setBookedEvents] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get(
          `${import.meta.env.VITE_API}/user/getUserProfile`,
          { withCredentials: true }
        )
        const currentUser = profileRes.data.user
        setUser(currentUser)

        if (currentUser.role?.toLowerCase() === 'attendee') {
          const bookingRes = await axios.get(
            `${import.meta.env.VITE_API}/events/get-booked-events`,
            { withCredentials: true }
          )
          const events = bookingRes.data.data || []
          setBookedEvents(events)
          console.log('Booked Events:', events)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        navigate('/login')
      }
    }

    fetchData()
  }, [])

  if (!user) return <div className="text-white text-center mt-20">Loading profile...</div>

  const isOrganizer = user.role?.toLowerCase() === 'organizer'
  const isAttendee = user.role?.toLowerCase() === 'attendee'
  const avatarUrl = `https://ui-avatars.com/api/?name=${user.username}&background=2563eb&color=fff`

  const today = new Date()

  const upcomingEvents = bookedEvents.filter(
    event => new Date(getSafeEventDate(event.eventDateTime)) > today
  )
  const completedEvents = bookedEvents.filter(
    event => new Date(getSafeEventDate(event.eventDateTime)) <= today
  )

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto glass rounded-2xl overflow-hidden shadow-xl">

        {/* Header */}
        <div className="bg-blue-800/30 p-6 flex flex-col md:flex-row items-start gap-6">
          <div className="relative">
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-32 h-32 rounded-full border-4 border-white/50 shadow-md"
            />
            <div className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full">
              <Edit2 className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start flex-wrap">
              <div>
                <h1 className="text-3xl font-bold text-white">{user.username}</h1>
                <p className="text-blue-200">{user.email}</p>
              </div>
            </div>

            <p className="mt-4 text-blue-100">
              {isOrganizer
                ? `You've organized ${user.eventsOrganized.length} events.`
                : isAttendee
                ? `You've booked ${bookedEvents.length} events.`
                : ''}
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 bg-blue-900/30 divide-y md:divide-y-0 md:divide-x divide-blue-800/40 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-white">
              {isOrganizer ? user.eventsOrganized.length : isAttendee ? bookedEvents.length : 0}
            </div>
            <div className="text-blue-200 mt-1">
              {isOrganizer ? 'Events Organized' : isAttendee ? 'Events Booked' : ''}
            </div>
          </div>

          <div className="p-6 flex items-center justify-center">
            {isOrganizer ? (
              <button
                onClick={() => navigate('/organizer/Dashboard')}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all"
              >
                Go to Dashboard
              </button>
            ) : isAttendee ? (
              <button
                onClick={() => navigate('/events')}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition-all"
              >
                Browse Events
              </button>
            ) : null}
          </div>
        </div>

        {/* Events Display */}
        <div className="p-6 space-y-12">
          {isOrganizer ? (
            <>
              <h2 className="text-xl font-semibold text-white">Your Organized Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {user.eventsOrganized.map(event => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
              {!user.eventsOrganized.length && (
                <p className="text-blue-300 text-center mt-6">No events organized yet.</p>
              )}
            </>
          ) : isAttendee ? (
            <>
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">Upcoming Booked Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map(event => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
                {!upcomingEvents.length && (
                  <p className="text-blue-300 text-center mt-4">No upcoming events booked.</p>
                )}
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mt-10 mb-4">Completed Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {completedEvents.map(event => (
                    <EventCard key={event._id} event={event} />
                  ))}
                </div>
                {!completedEvents.length && (
                  <p className="text-blue-300 text-center mt-4">No completed events found.</p>
                )}
              </section>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

const getSafeEventDate = (dateArray) => {
  if (Array.isArray(dateArray) && dateArray.length) {
    return dateArray[0]
  }
  return dateArray
}

const EventCard = ({ event }) => {
  return (
    <div className="bg-blue-800/30 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
      <img src={event.banner} alt={event.title} className="w-full h-40 object-cover" />
      <div className="p-4 space-y-1">
        <h3 className="text-white text-lg font-bold">{event.title}</h3>
        <p className="text-blue-300 text-sm capitalize">{event.status}</p>
        <p className="text-blue-200 text-xs">
          {new Date(getSafeEventDate(event.eventDateTime)).toLocaleString()}
        </p>
      </div>
    </div>
  )
}

export default Profile
