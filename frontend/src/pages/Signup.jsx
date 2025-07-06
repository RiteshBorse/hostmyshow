import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Link } from 'react-router-dom'
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { userStore } from "@/context/userContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Confetti = () => (
  <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
    <svg width="400" height="400" viewBox="0 0 400 400">
      <g>
        {/* Enhanced confetti with more particles */}
        <circle cx="100" cy="50" r="8" fill="#60a5fa">
          <animate
            attributeName="cy"
            values="50;350;50"
            dur="1.8s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="200" cy="50" r="8" fill="#f472b6">
          <animate
            attributeName="cy"
            values="50;340;50"
            dur="1.6s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="1.6s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="300" cy="50" r="8" fill="#34d399">
          <animate
            attributeName="cy"
            values="50;330;50"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="150" cy="80" r="6" fill="#fbbf24">
          <animate
            attributeName="cy"
            values="80;360;80"
            dur="1.7s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="1.7s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="250" cy="80" r="6" fill="#a78bfa">
          <animate
            attributeName="cy"
            values="80;355;80"
            dur="1.9s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="1.9s"
            repeatCount="indefinite"
          />
        </circle>
        <rect
          x="75"
          y="120"
          width="8"
          height="8"
          fill="#ef4444"
          transform="rotate(45 79 124)"
        >
          <animate
            attributeName="y"
            values="120;320;120"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </rect>
        <rect
          x="225"
          y="120"
          width="8"
          height="8"
          fill="#f59e0b"
          transform="rotate(45 229 124)"
        >
          <animate
            attributeName="y"
            values="120;330;120"
            dur="1.4s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="1.4s"
            repeatCount="indefinite"
          />
        </rect>
      </g>
    </svg>
  </div>
);

const SuccessCheck = () => (
  <div className="flex flex-col items-center justify-center gap-6 py-8">
    <div className="relative">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="#10b981" opacity="0.1" />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="#10b981"
          className="animate-pulse"
        />
        <polyline
          points="32,52 44,64 68,36"
          fill="none"
          stroke="#fff"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <animate
            attributeName="stroke-dasharray"
            from="0,80"
            to="80,0"
            dur="0.8s"
            fill="freeze"
          />
        </polyline>
      </svg>
      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-20 animate-ping"></div>
    </div>
    <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent animate-bounce">
      Congratulations!
    </h2>
    <p className="text-lg text-gray-600 font-medium">
      Your account has been verified successfully.
    </p>
  </div>
);

const Signup = () => {
  const [type, setType] = useState("Attendee");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    role: "Attendee",
  });

  const isAuth = userStore((state) => state.isAuth);
  const login = userStore((state) => state.login);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/user/register`,
        formData,
        { withCredentials: true }
      );
      toast.success(response.data.message);
      setDialogOpen(true);
      setOtp("");
      setSuccess(false);
      setError("");
    } catch (error) {
      toast.error(error.response.data.message)
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (otp.length === 6) {
      handleOtpVerify(otp);
    }
  }, [otp]);

  const handleOtpChange = (value) => {
    setOtp(value);
    setError("");
  };

  const handleOtpVerify = async (value) => {
    setVerifying(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/user/otp-verify`,
        {
          otp: value,
          email: formData.email,
        },
        { withCredentials: true }
      );
      setDialogOpen(false);
      toast.success(response.data.message);
      await login(response.data.user);
      navigate("/")
    } catch (error) {
      toast.error(error.response.data.message)
    }
    setVerifying(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setOtp("");
    setSuccess(false);
    setError("");
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuth) {
      navigate("/");
    }
  }, [isAuth]);

  if (isAuth) {
    return <div className="h-screen">Loading...</div>;
  } else {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl max-w-md w-full">
          {/* Glassmorphism effect enhancement */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-3xl"></div>

          <div className="relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-white text-4xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text">
                Create Account
              </h1>
              <p className="text-white/70 text-sm">
                Join us and start your journey
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              <div className="group">
                <Input
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="text-white h-14 placeholder:text-white/50 text-lg w-full border-white/30 bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-300 focus:border-purple-400 focus:bg-white/20 focus:shadow-lg focus:shadow-purple-500/20"
                  placeholder="Email address"
                  type="email"
                  required
                />
              </div>

              <div className="group">
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="text-white h-14 placeholder:text-white/50 text-lg w-full border-white/30 bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-300 focus:border-purple-400 focus:bg-white/20 focus:shadow-lg focus:shadow-purple-500/20"
                  placeholder="Username"
                  required
                />
              </div>

              <div className="group">
                <Input
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="text-white h-14 placeholder:text-white/50 text-lg w-full border-white/30 bg-white/10 rounded-xl backdrop-blur-sm transition-all duration-300 focus:border-purple-400 focus:bg-white/20 focus:shadow-lg focus:shadow-purple-500/20"
                  placeholder="Password"
                  type="password"
                  required
                />
              </div>

              <div className="group">
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full h-14 rounded-xl border-white/30 bg-white/10 backdrop-blur-sm text-white text-lg px-4 transition-all duration-300 focus:border-purple-400 focus:bg-white/20 focus:shadow-lg focus:shadow-purple-500/20 focus:outline-none"
                >
                  <option value="Organizer" className="bg-gray-800 text-white">
                    Organizer
                  </option>
                  <option value="Attendee" className="bg-gray-800 text-white">
                    Attendee
                  </option>
                </select>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-white/70 text-sm">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-purple-300 hover:text-purple-200 font-semibold transition-colors duration-300 hover:underline"
                >
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
          <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl border-white/20 rounded-2xl shadow-2xl">
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-bold text-gray-800">
                Verify Your Account
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-2">
                We've sent a verification code to your email address. Please
                enter it below to complete your registration.
              </DialogDescription>
            </DialogHeader>

            {success ? (
              <>
                <Confetti />
                <SuccessCheck />
                <DialogFooter className="mt-6">
                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      className="w-full h-12 text-lg font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-300"
                    >
                      Continue
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </>
            ) : (
              <div className="flex flex-col items-center gap-6 py-6">
                <div className="w-full max-w-sm">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={handleOtpChange}
                    className="justify-center"
                    autoFocus
                    disabled={verifying}
                  >
                    <InputOTPGroup className="gap-3">
                      {[...Array(6)].map((_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="w-12 h-12 text-xl border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {error && (
                  <div className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}

                <Button
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                  onClick={() => handleOtpVerify(otp)}
                  disabled={otp.length !== 6 || verifying}
                >
                  {verifying ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Verifying...
                    </div>
                  ) : (
                    "Verify Code"
                  )}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  Didn't receive the code?{" "}
                  <button className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-300">
                    Resend
                  </button>
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
};

export default Signup;
