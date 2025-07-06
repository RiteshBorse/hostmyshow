import { Sparkles } from "lucide-react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { userStore } from "@/context/userContext";

const Navbar = () => {
  const isAuth = userStore((state) => state.isAuth);
  const user = userStore((state) => state.user);
  const logout = userStore((state) => state.logout)
  return (
    <nav className="glass-dark sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to='/'>
          <span className="text-2xl font-bold text-white">
            <span className="text-blue-500">
              Host
            </span>
            MyShow
          </span>
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className="text-blue-100 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            to="/events"
            className="text-blue-100 hover:text-white transition-colors"
          >
            Events
          </Link>
          <Link
            to="/favorites"
            className="text-blue-100 hover:text-white transition-colors"
          >
            Favorites
          </Link>
          <Link
            to="/about-us"
            className="text-blue-100 hover:text-white transition-colors"
          >
            About Us
          </Link>
          {!isAuth && (
            <Link to="/sign-up">
              <Button
                variant="outline"
                size="lg"
                className="border-blue-400/30 text-blue-100 bg-transparent"
              >
                Sign In
              </Button>
            </Link>
          )}
          {
            isAuth && (
              <Button onClick={() => logout()}><p className="text-blue-400 font-bold">Hii , {user?.username}</p></Button>
            )
          }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
