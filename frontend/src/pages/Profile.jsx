import React from 'react'
import { Edit2, Calendar, MapPin, Users, Settings } from 'lucide-react'

const Profile = () => {
  // Enhanced user data with more details
  const user = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=6d28d9&color=fff',
    role: 'Event Organizer',
    bio: 'Passionate about creating memorable event experiences',
    location: 'New York, NY',
    eventsHosted: 24,
    upcomingEvents: 3,
    joinDate: 'March 2022'
  }

  return (
    <div className="min-h-screen  py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass rounded-2xl shadow-xl overflow-hidden">
          {/* Profile Header */}
          <div className="bg-blue-800/30 p-6 flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <img 
                src={user.avatar} 
                alt="avatar" 
                className="w-32 h-32 rounded-full border-4 border-white/50 shadow-lg"
              />
              <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 p-2 rounded-full shadow-md transition-all">
                <Edit2 className="w-4 h-4 text-white" />
              </button>
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                  <p className="text-blue-200">{user.email}</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="bg-blue-700/50 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {user.role}
                </span>
                <span className="bg-purple-700/50 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {user.location}
                </span>
                <span className="bg-green-700/50 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Member since {user.joinDate}
                </span>
              </div>
              
              <p className="mt-4 text-blue-100">{user.bio}</p>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-blue-800/30 bg-blue-900/20">
            <div className="p-6 text-center">
              <div className="text-4xl font-bold text-white">{user.eventsHosted}</div>
              <div className="text-blue-200 mt-1">Events Hosted</div>
            </div>
            <div className="p-6 text-center">
              <div className="text-4xl font-bold text-white">{user.upcomingEvents}</div>
              <div className="text-blue-200 mt-1">Upcoming Events</div>
            </div>
            <div className="p-6 text-center">
              <div className="text-4xl font-bold text-white">4.8</div>
              <div className="text-blue-200 mt-1">Average Rating</div>
            </div>
          </div>
          
          {/* Content Tabs */}
          <div className="border-b border-blue-800/30 flex">
            <button className="px-6 py-4 text-white font-medium border-b-2 border-blue-400">
              Overview
            </button>
            <button className="px-6 py-4 text-blue-300 hover:text-white font-medium">
              Events
            </button>
            <button className="px-6 py-4 text-blue-300 hover:text-white font-medium">
              Reviews
            </button>
          </div>
          
          {/* Main Content */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">About</h2>
            <p className="text-blue-100 mb-6">
              {user.bio} With over {user.eventsHosted} events hosted, I specialize in creating unforgettable experiences for all attendees. 
              My upcoming events include {user.upcomingEvents} exciting gatherings you won't want to miss!
            </p>
            
            <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <div className="bg-blue-800/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-full">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Created new event</h3>
                    <p className="text-blue-200 text-sm">Tech Conference 2023 - 2 days ago</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-800/20 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 p-2 rounded-full">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Updated event details</h3>
                    <p className="text-blue-200 text-sm">Music Festival - 1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
