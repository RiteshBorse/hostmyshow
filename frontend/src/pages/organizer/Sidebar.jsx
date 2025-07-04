import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarPlus, List, Ticket } from 'lucide-react';

const Sidebar = () => (
  <aside className="w-64 glass p-6 shadow-lg flex flex-col">
    <h2 className="text-2xl font-bold mb-8 text-blue-400">Organizer Panel</h2>
    <nav className="flex-1">
      <ul className="space-y-4">
        <li>
          <NavLink
            to="/organizer/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 text-lg transition-colors px-3 py-2 rounded-lg ${isActive ? 'bg-blue-700 text-white' : 'hover:text-blue-300'}`
            }
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/organizer/add-event"
            className={({ isActive }) =>
              `flex items-center gap-3 text-lg transition-colors px-3 py-2 rounded-lg ${isActive ? 'bg-blue-700 text-white' : 'hover:text-blue-300'}`
            }
          >
            <CalendarPlus className="w-5 h-5" /> Add Event
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/organizer/list-shows"
            className={({ isActive }) =>
              `flex items-center gap-3 text-lg transition-colors px-3 py-2 rounded-lg ${isActive ? 'bg-blue-700 text-white' : 'hover:text-blue-300'}`
            }
          >
            <List className="w-5 h-5" /> List Shows
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/organizer/list-bookings"
            className={({ isActive }) =>
              `flex items-center gap-3 text-lg transition-colors px-3 py-2 rounded-lg ${isActive ? 'bg-blue-700 text-white' : 'hover:text-blue-300'}`
            }
          >
            <Ticket className="w-5 h-5" /> List Bookings
          </NavLink>
        </li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar; 