import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { userStore } from "@/context/userContext";
import axios from "axios";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const isAuth = userStore((state) => state.isAuth);
  const login = userStore((state) => state.login);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/user/login`,
        formData,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      await login(response.data.user);
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth]);

  if (isAuth) {
    return <div className="h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 pt-12 px-8">
      <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl w-[960px] flex justify-between gap-24">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-3xl"></div>

        {/* Left side - Illustration */}
        <div className="relative z-10 hidden lg:flex lg:w-1/2 items-center justify-center">
          <img
            src="/images/login.svg"
            alt="Login Illustration"
            className="w-full h-auto max-w-[400px] drop-shadow-2xl"
          />
        </div>

        {/* Right side - Login Form */}
        <div className="relative z-10 w-full lg:w-1/2">
          <div className="text-center mb-8">
            <h1 className="text-white text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text">
              Log In
            </h1>
            <p className="text-white/70 text-sm">Access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="text-white h-14 placeholder:text-white/50 text-lg w-full border-white/30 bg-white/10 rounded-xl backdrop-blur-sm"
              placeholder="Email"
              type="email"
              required
            />
            <Input
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="text-white h-14 placeholder:text-white/50 text-lg w-full border-white/30 bg-white/10 rounded-xl backdrop-blur-sm"
              placeholder="Password"
              type="password"
              required
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-blue-700 hover:bg-blue-800 text-white font-semibold text-lg rounded-xl transition-all duration-300 shadow hover:shadow-lg hover:shadow-blue-500/20 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging In...
                </div>
              ) : (
                "Log In"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-white/70 text-sm">
              Don't have an account?{" "}
              <Link
                to="/sign-up"
                className="text-blue-300 hover:text-blue-200 font-semibold hover:underline"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
