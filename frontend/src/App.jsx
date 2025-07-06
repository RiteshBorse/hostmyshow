import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Events from './pages/attendee/Events'
import EventDetails from './pages/attendee/EventDetails'
import Seats from './pages/attendee/Seats'
import Checkout from './pages/attendee/Checkout'
import Dashboard from './pages/organizer/Dashboard'
import DashboardHome from './pages/organizer/DashboardHome'
import AddEvent from './pages/organizer/AddEvent'
import ListShows from './pages/organizer/ListShows'
import ListBookings from './pages/organizer/ListBookings'
import AdminDashboard from './pages/admin/Dashboard'
import AboutUs from './pages/AboutUs'
import axios from 'axios'
import { userStore } from './context/userContext'
import toast from 'react-hot-toast'

axios.defaults.withCredentials = true;

const ProtectedOrganizerRoute = ({ children }) => {
  const isAuth = userStore((state) => state.isAuth);
  const user = userStore((state) => state.user);
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== 'Organizer') {
    toast.error("You have made an Attendee account");
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/sign-up" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/about-us" element={<AboutUs/>}/>
        <Route path="/events" element={<Events/>}/>
        <Route path="/events/:id" element={<EventDetails/>}/>
        <Route path="/seats/:id" element={<Seats/>}/>
        <Route path="/checkout/:id" element={<Checkout/>}/>

        <Route path="/organizer" element={
          <ProtectedOrganizerRoute>
            <Dashboard />
          </ProtectedOrganizerRoute>
        }>
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="add-event" element={<AddEvent />} />
          <Route path="list-shows" element={<ListShows />} />
          <Route path="list-bookings" element={<ListBookings />} />
        </Route>

        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <Footer/>
    </BrowserRouter>
  )
}

export default App