import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  UserCheck, 
  UserX, 
  Eye, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Ticket,
  MapPin,
  Clock
} from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data for demonstration
  const stats = {
    totalUsers: 12500,
    totalOrganizers: 450,
    totalAttendees: 12050,
    totalEvents: 1250,
    totalRevenue: 2500000,
    activeEvents: 89,
    completedEvents: 1161,
    pendingEvents: 12
  };

  const recentUsers = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      role: 'organizer',
      status: 'active',
      joinDate: '2024-01-15',
      eventsCount: 5,
      lastActive: '2024-01-20 10:30 AM'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      role: 'attendee',
      status: 'active',
      joinDate: '2024-01-14',
      eventsCount: 12,
      lastActive: '2024-01-20 09:15 AM'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      email: 'mike.w@email.com',
      role: 'organizer',
      status: 'pending',
      joinDate: '2024-01-13',
      eventsCount: 0,
      lastActive: '2024-01-19 03:45 PM'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily.d@email.com',
      role: 'attendee',
      status: 'suspended',
      joinDate: '2024-01-12',
      eventsCount: 8,
      lastActive: '2024-01-18 11:20 AM'
    }
  ];

  const recentEvents = [
    {
      id: 1,
      title: 'Tech Conference 2024',
      organizer: 'John Smith',
      date: '2024-02-15',
      location: 'San Francisco, CA',
      attendees: 250,
      revenue: 25000,
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Music Festival',
      organizer: 'Sarah Johnson',
      date: '2024-01-20',
      location: 'Los Angeles, CA',
      attendees: 500,
      revenue: 50000,
      status: 'completed'
    },
    {
      id: 3,
      title: 'Startup Meetup',
      organizer: 'Mike Wilson',
      date: '2024-02-01',
      location: 'New York, NY',
      attendees: 100,
      revenue: 10000,
      status: 'active'
    }
  ];

  const analytics = {
    userGrowth: [1200, 1350, 1420, 1580, 1650, 1800, 1950, 2100, 2250, 2400, 2550, 2700],
    revenueGrowth: [150000, 180000, 200000, 220000, 240000, 260000, 280000, 300000, 320000, 340000, 360000, 380000],
    eventCategories: [
      { name: 'Technology', value: 35, color: '#3B82F6' },
      { name: 'Music', value: 25, color: '#10B981' },
      { name: 'Business', value: 20, color: '#F59E0B' },
      { name: 'Education', value: 15, color: '#EF4444' },
      { name: 'Other', value: 5, color: '#8B5CF6' }
    ]
  };

  const filteredUsers = recentUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'organizer': return 'bg-blue-500';
      case 'attendee': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="admin min-h-screen p-6 mx-auto px-24 text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-blue-300 mb-2">Admin Dashboard</h1>
        <p className="text-blue-200">Monitor and manage organizers and attendees</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'users', label: 'User Management', icon: Users },
          { id: 'events', label: 'Event Monitoring', icon: Calendar },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass p-6 rounded-lg shadow-xl border border-blue-400/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-blue-200">Total Users</p>
                </div>
                <Users className="w-10 h-10 text-blue-400" />
              </div>
            </div>
            <div className="glass p-6 rounded-lg shadow-xl border border-blue-400/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{stats.totalOrganizers.toLocaleString()}</p>
                  <p className="text-blue-200">Organizers</p>
                </div>
                <UserCheck className="w-10 h-10 text-green-400" />
              </div>
            </div>
            <div className="glass p-6 rounded-lg shadow-xl border border-blue-400/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">{stats.totalEvents.toLocaleString()}</p>
                  <p className="text-blue-200">Total Events</p>
                </div>
                <Calendar className="w-10 h-10 text-purple-400" />
              </div>
            </div>
            <div className="glass p-6 rounded-lg shadow-xl border border-blue-400/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-white">₹{stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-blue-200">Total Revenue</p>
                </div>
                <DollarSign className="w-10 h-10 text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-lg shadow-xl border border-blue-400/20">
              <h3 className="text-lg font-semibold text-white mb-4">Event Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-200">Active Events</span>
                  <span className="font-semibold text-white">{stats.activeEvents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Completed Events</span>
                  <span className="font-semibold text-white">{stats.completedEvents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Pending Events</span>
                  <span className="font-semibold text-white">{stats.pendingEvents}</span>
                </div>
              </div>
            </div>
            <div className="glass p-6 rounded-lg shadow-xl border border-blue-400/20">
              <h3 className="text-lg font-semibold text-white mb-4">User Distribution</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-200">Organizers</span>
                  <span className="font-semibold text-white">{((stats.totalOrganizers / stats.totalUsers) * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-200">Attendees</span>
                  <span className="font-semibold text-white">{((stats.totalAttendees / stats.totalUsers) * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
            <div className="glass p-6 rounded-lg shadow-xl border border-blue-400/20">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-2 text-sm">
                <p className="text-blue-200">New user registrations: <span className="text-white">+45 today</span></p>
                <p className="text-blue-200">Events created: <span className="text-white">+12 today</span></p>
                <p className="text-blue-200">Revenue generated: <span className="text-white">₹125,000 today</span></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Management Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="glass p-6 rounded-lg shadow-xl border border-blue-400/20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-blue-400/20 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <select
                className="px-4 py-2 rounded-lg border border-blue-400/20 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="organizer">Organizers</option>
                <option value="attendee">Attendees</option>
              </select>
              <select
                className="px-4 py-2 rounded-lg border border-blue-400/20 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="glass rounded-lg shadow-xl border border-blue-400/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Events</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Last Active</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-sm text-blue-200">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {user.eventsCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">
                        {user.lastActive}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button className="text-blue-400 hover:text-blue-300">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="text-green-400 hover:text-green-300">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Event Monitoring Tab */}
      {activeTab === 'events' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentEvents.map((event) => (
              <div key={event.id} className="glass rounded-lg shadow-xl border border-blue-400/20 p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEventStatusColor(event.status)}`}>
                    {event.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-blue-200 flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    {event.organizer}
                  </p>
                  <p className="text-blue-200 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </p>
                  <p className="text-blue-200 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </p>
                  <p className="text-blue-200 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {event.attendees} attendees
                  </p>
                  <p className="text-blue-200 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    ₹{event.revenue.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                    View Details
                  </button>
                  <button className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Charts Placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass p-6 rounded-lg shadow-xl border border-blue-400/20">
              <h3 className="text-lg font-semibold text-white mb-4">User Growth</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <p className="text-blue-200">User growth chart will be displayed here</p>
                </div>
              </div>
            </div>
            <div className="glass p-6 rounded-lg shadow-xl border border-blue-400/20">
              <h3 className="text-lg font-semibold text-white mb-4">Revenue Trends</h3>
              <div className="h-64 flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <p className="text-blue-200">Revenue trends chart will be displayed here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Event Categories */}
          <div className="glass p-6 rounded-lg shadow-xl border border-blue-400/20">
            <h3 className="text-lg font-semibold text-white mb-4">Event Categories Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {analytics.eventCategories.map((category, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center"
                    style={{ backgroundColor: category.color }}
                  >
                    <span className="text-white font-bold">{category.value}%</span>
                  </div>
                  <p className="text-blue-200 text-sm">{category.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass p-6 rounded-lg shadow-xl border border-blue-400/20 text-center">
              <Activity className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <p className="text-2xl font-bold text-white">89%</p>
              <p className="text-blue-200">User Engagement Rate</p>
            </div>
            <div className="glass p-6 rounded-lg shadow-xl border border-blue-400/20 text-center">
              <Ticket className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-2xl font-bold text-white">₹2.5M</p>
              <p className="text-blue-200">Total Revenue</p>
            </div>
            <div className="glass p-6 rounded-lg shadow-xl border border-blue-400/20 text-center">
              <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-2xl font-bold text-white">99.9%</p>
              <p className="text-blue-200">System Uptime</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
