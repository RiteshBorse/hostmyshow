import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
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
        <Route path="/event-details" element={<EventDetails/>}/>
        <Route path="/seats" element={<Seats/>}/>
        <Route path="/checkout" element={<Checkout/>}/>

        <Route path="/organizer" element={<Dashboard />}>
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