import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { userStore } from "@/context/userContext";

const Navbar = () => {
  const isAuth = userStore((state) => state.isAuth);
  const user = userStore((state) => state.user);
  const logout = userStore((state) => state.logout);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/sign-up");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="glass-dark sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to="/">
            <span className="text-2xl font-bold text-white">
              <span className="text-blue-500">Host</span>MyShow
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-blue-100 hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/events" className="text-blue-100 hover:text-white transition-colors">
            Events
          </Link>
          <Link to="/my-bookings" className="text-blue-100 hover:text-white transition-colors">
            Bookings
          </Link>
          <Link to="/about-us" className="text-blue-100 hover:text-white transition-colors">
            About Us
          </Link>

          {/* If NOT logged in */}
          {!isAuth && (
            <Link to="/sign-up">
              <Button
                variant="outline"
                size="lg"
                className="border-blue-400/30 text-white bg-transparent hover:border-white hover:text-white hover:bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          )}

          {/* If logged in */}
          {isAuth && (
            <div className="relative" ref={dropdownRef}>
              {/* Round profile button */}
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 text-white font-bold flex items-center justify-center hover:scale-105 transition-all duration-200 shadow-md border border-white/20"
              >
                {user?.username?.[0]?.toUpperCase() || "U"}
              </button>

              {/* Dropdown menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-5 w-56 rounded-xl border border-white/10 shadow-xl bg-white/10 backdrop-blur-lg text-white z-50 overflow-hidden animate-fade-in">
                  <div className="px-4 py-3 text-sm border-b border-white/10">
                    Hello, <span className="font-semibold">{user?.username}</span>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2 text-sm hover:bg-white/20 transition-all"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-white/20 transition-all"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
