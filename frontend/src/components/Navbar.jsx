import { Sparkles } from 'lucide-react'
import React from 'react'
import { Button } from './ui/button'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="glass-dark sticky top-0 z-50">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center glow-blue">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white">
          <span className='text-gradient-to-br from-blue-400 to-purple-500'>H</span>ostMyShow</span>
      </div>
      <div className="hidden md:flex items-center space-x-8">
        <Link to="/" className="text-blue-100 hover:text-white transition-colors">
          Home
        </Link>
        <Link to="/events" className="text-blue-100 hover:text-white transition-colors">
          Events
        </Link>
        <Link to="/favorites" className="text-blue-100 hover:text-white transition-colors">
          Favorites
        </Link>
        <Link to="/about-us" className="text-blue-100 hover:text-white transition-colors">
          About Us
        </Link>
        <Link to="/sign-up"><Button
          variant="outline"
          size="lg"
          className="border-blue-400/30 text-blue-100 bg-transparent"
        >
          Sign In
        </Button></Link>
      </div>
    </div>
  </nav>
  )
}

export default Navbar