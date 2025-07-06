import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Link, useNavigate } from 'react-router-dom'
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
      console.log(error)
      toast.error(error.response.data.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth, navigate]);

  if (isAuth) {
    return <div className="h-screen">Loading...</div>;
  }

  return (
    <div className='pt-12 px-24 mx-auto h-screen'>
      <div className='glass rounded-md p-8 flex flex-col h-1/2 justify-center items-center'>
        <h1 className='text-white text-3xl font-bold mb-4'>Log In</h1>
        <form onSubmit={handleLogin} className='flex flex-col gap-5 py-4 w-1/2 justify-center items-center'>
          <Input 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="text-white h-12 placeholder:text-white/60 text-lg placeholder:text-lg w-full border-white/60" 
            placeholder="Email" 
            type="email"
            required
          />
          <Input 
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="text-white h-12 placeholder:text-white/60 text-lg placeholder:text-lg w-full border-white/60" 
            placeholder="Password" 
            type="password"
            required
          />
          <Button 
            type="submit"
            disabled={isLoading}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 rounded-lg transition-colors shadow glow-blue w-1/2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging In...
              </div>
            ) : (
              "Log In"
            )}
          </Button>
        </form>
        <div className="mt-4 text-white/80 text-sm">
          Don't have an account? <Link to="/sign-up" className="text-blue-300 hover:underline font-semibold">Sign up</Link>
        </div>
      </div>
    </div>
  )
}

export default Login 