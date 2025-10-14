import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  ArrowRight, 
  Play, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Shield, 
  BarChart3,
  Users,
  Award // or ScrollText, depending on your preference
} from "lucide-react"
import { Link } from "react-router-dom"
import axios from "axios"

const Landing = () => {
  const [testimonials , setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
  const fetchTestimonials = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API}/review/top`);
      console.log("fetched testimonials : " , response.data);
      setTestimonials(response.data.reviews || []);
    } catch (error) {
      console.error("failed to fetch testimonials", error);
    }
  };

  fetchTestimonials();
}, []);


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center mt-10">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-6 px-4 py-2 glass text-blue-100 border-blue-400/30">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Event Management
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Plan. Host. Experience.
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              The Future of Events.
            </span>
          </h1>

          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            AI-powered platform to create, manage, and elevate events like never before. From hackathons to conferences,
            make every moment extraordinary.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/organizer/dashboard">
              <Button
                size="lg"
                className="px-8 py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 glow-blue"
              >
                Create Event
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to='/events'><Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg border-blue-400/30 text-blue-100 hover:bg-white/10 hover:text-white bg-transparent"
            >
              <Play className="mr-2 w-5 h-5" />
              Join Event
            </Button>
            </Link>
          </div>

          {/* Platform Preview */}
        <div className="relative scale-[0.6] md:scale-[0.65] lg:scale-[0.7] xl:scale-[0.75] origin-center py-10 my-[-20px]">
          <div className="relative z-10 max-w-7xl mx-auto px-8">
           <div className="grid lg:grid-cols-2 gap-12 items-center lg:items-center justify-center lg:justify-between">
                {/* Left side - Vertical Mobile Phone */}
                <div className="relative flex justify-center lg:justify-end items-center">
                  <div className="relative" style={{ perspective: '1500px' }}>
                    {/* Glow effect behind phone */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 blur-3xl opacity-30 animate-pulse" />
                    
                    {/* Vertical Mobile Phone */}
                    <div 
                      className="relative transition-transform duration-700 hover:scale-105"
                      style={{
                        transform: 'rotateY(25deg) rotateX(8deg) rotateZ(-3deg)',
                        transformStyle: 'preserve-3d',
                        animation: 'float 6s ease-in-out infinite'
                      }}
                    >
                      {/* Phone Frame */}
                      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3.5rem] p-3 shadow-2xl border-2 border-slate-700"
                          style={{ 
                            width: '340px', 
                            height: '700px',
                            transform: 'translateZ(20px)'
                          }}>
                        
                        {/* Screen bezel */}
                        <div className="relative w-full h-full bg-black rounded-[3rem] overflow-hidden border-[6px] border-slate-900">
                          {/* Notch */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-20 flex items-center justify-center space-x-2">
                            <div className="w-16 h-1.5 bg-slate-800 rounded-full" />
                            <div className="w-2.5 h-2.5 bg-slate-700 rounded-full" />
                          </div>

                          {/* Screen Content - HostMyShow App */}
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
                            {/* Status bar */}
                            <div className="flex justify-between items-center px-8 pt-2 text-white text-xs font-medium">
                              <span>10:30</span>
                              <div className="flex items-center space-x-1.5">
                                <div className="flex space-x-0.5">
                                  <div className="w-1 h-3 bg-white rounded-sm" />
                                  <div className="w-1 h-3 bg-white rounded-sm" />
                                  <div className="w-1 h-3 bg-white rounded-sm" />
                                  <div className="w-1 h-3 bg-white rounded-sm" />
                                </div>
                                <span className="text-xs">100%</span>
                              </div>
                            </div>

                            {/* App Header */}
                            <div className="px-6 py-5 mt-4">
                              <div className="flex items-center justify-between">
                                <h2 className="text-3xl font-bold">
                                  <span className="text-white">Host</span>
                                  <span className="text-blue-400">MyShow</span>
                                </h2>
                                <div className="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                  S
                                </div>
                              </div>
                            </div>

                            {/* Spotlight Event - Large Card */}
                            <div className="px-6 mt-4">
                              <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-blue-500/30 shadow-2xl">
                                <div className="relative h-48 bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900">
                                  <div className="absolute top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-blue-600 rounded-full text-white text-xs font-bold tracking-wide shadow-lg">
                                    SPOTLIGHT
                                  </div>
                                  {/* Stage/Audience illustration */}
                                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900/80 to-transparent" />
                                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-1">
                                    <div className="w-12 h-12 bg-blue-600/30 rounded-full blur-sm" />
                                    <div className="w-16 h-16 bg-cyan-500/30 rounded-full blur-sm" />
                                    <div className="w-12 h-12 bg-blue-600/30 rounded-full blur-sm" />
                                  </div>
                                </div>
                                <div className="p-5">
                                  <h3 className="text-white font-bold text-2xl mb-2">DevCon 2025</h3>
                                  <div className="flex items-center space-x-3 mb-2">
                                    <span className="px-4 py-1.5 bg-blue-600 rounded-full text-white text-xs font-bold">hackathon</span>
                                    <span className="text-blue-300 text-sm font-medium">12/9/2025</span>
                                  </div>
                                  <p className="text-blue-200/80 text-sm">Event HostAuditorium</p>
                                </div>
                              </div>

                              {/* Event Cards Grid */}
                              <div className="grid grid-cols-2 gap-4 mt-5">
                                {/* Tech Meet Up */}
                                <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl rounded-2xl overflow-hidden border border-blue-500/20 shadow-xl">
                                  <div className="relative h-28 bg-gradient-to-br from-blue-800 to-slate-900 overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-20 h-20 bg-blue-500/20 rounded-full blur-xl" />
                                    </div>
                                  </div>
                                  <div className="p-3">
                                    <h4 className="text-white font-bold text-sm mb-2">Tech meet up</h4>
                                    <span className="inline-block px-3 py-1 bg-blue-600 rounded-full text-white text-xs font-semibold mb-2">Live Show</span>
                                    <p className="text-blue-200/70 text-xs">6/7/2025</p>
                                    <p className="text-blue-200/60 text-xs mt-1">New York, NY</p>
                                    <button className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white text-xs font-bold transition-colors">
                                      Book Now
                                    </button>
                                  </div>
                                </div>

                                {/* Comedy Show */}
                                <div className="bg-gradient-to-br from-slate-800/70 to-slate-900/70 backdrop-blur-xl rounded-2xl overflow-hidden border border-purple-500/20 shadow-xl">
                                  <div className="relative h-28 bg-gradient-to-br from-purple-800 to-slate-900 overflow-hidden">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-20 h-20 bg-purple-500/20 rounded-full blur-xl" />
                                    </div>
                                  </div>
                                  <div className="p-3">
                                    <h4 className="text-white font-bold text-sm mb-2">comedy show</h4>
                                    <span className="inline-block px-3 py-1 bg-purple-600 rounded-full text-white text-xs font-semibold mb-2">Live Show</span>
                                    <p className="text-blue-200/70 text-xs">15/7/2025</p>
                                    <p className="text-blue-200/60 text-xs mt-1">nagar, bejhr</p>
                                    <button className="w-full mt-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-xs font-bold transition-colors">
                                      Book Now
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Power button */}
                        <div className="absolute -right-1.5 top-32 w-1 h-16 bg-slate-700 rounded-l" style={{ transform: 'translateZ(10px)' }} />
                        
                        {/* Volume buttons */}
                        <div className="absolute -left-1.5 top-24 w-1 h-12 bg-slate-700 rounded-r" style={{ transform: 'translateZ(10px)' }} />
                        <div className="absolute -left-1.5 top-40 w-1 h-12 bg-slate-700 rounded-r" style={{ transform: 'translateZ(10px)' }} />
                      </div>

                      {/* Floating particles */}
                      <div className="absolute -top-4 -left-8 w-3 h-3 bg-cyan-400 rounded-full blur-sm animate-ping" />
                      <div className="absolute bottom-20 -right-8 w-2 h-2 bg-blue-400 rounded-full blur-sm animate-ping" style={{ animationDelay: '500ms' }} />
                      <div className="absolute top-1/3 -right-12 w-4 h-4 bg-purple-400 rounded-full blur-sm animate-ping" style={{ animationDelay: '1000ms' }} />
                    </div>
                  </div>
                </div>
                {/* Right side - Title, Content and Button */}
                <div className="flex flex-col items-start justify-center space-y-8 px-6 lg:pl-12">
      

                  <p className="text-blue-100/80 text-2xl font-light leading-relaxed max-w-xl">
                    Discover and book amazing live events, workshops, and experiences right from your phone.
                  </p>

                
                
                </div>
              </div>
            </div>

            <style jsx>{`
              @keyframes float {
                0%, 100% {
                  transform: rotateY(25deg) rotateX(8deg) rotateZ(-3deg) translateY(0px);
                }
                50% {
                  transform: rotateY(25deg) rotateX(8deg) rotateZ(-3deg) translateY(-20px);
                }
              }
            `}</style>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Everything you need to create extraordinary events</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Comprehensive tools to manage your events from start to finish
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 glass border-blue-400/20 hover:glow-blue transition-all duration-300">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Event Tiers</h3>
              <p className="text-blue-100">
                Choose from Elite, Prime, Spotlight, and Sponsored tiers to get the perfect visibility and features for your event
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 glass border-blue-400/20 hover:glow-purple transition-all duration-300">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Smart Ticketing</h3>
              <p className="text-blue-100">
                Secure QR-based tickets, flexible seat selection, and automated email confirmations for seamless entry management
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 glass border-blue-400/20 hover:glow-green transition-all duration-300">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Marketing & Analytics</h3>
              <p className="text-blue-100">
                Email marketing campaigns, attendee feedback system, and comprehensive booking analytics
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 glass border-blue-400/20 hover:glow-orange transition-all duration-300">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Organizer Dashboard</h3>
              <p className="text-blue-100">
                Manage events, track bookings, handle reviews, and access detailed revenue insights all in one place
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 glass border-blue-400/20 hover:glow-red transition-all duration-300">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" /> {/* Changed from Certificate to Award */}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Certificates & Custom Sites</h3>
              <p className="text-blue-100">
                Optional participant certificates and personalized event microsites to enhance attendee experience
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 glass border-blue-400/20 hover:glow-indigo transition-all duration-300">
            <CardContent className="p-0">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Review System</h3>
              <p className="text-blue-100">
                Collect and manage attendee feedback with categorized positive, neutral, and negative reviews
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section id="testimonials" className="container mx-auto px-4 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-white">Trusted by event organizers worldwide</h2>
            <p className="text-xl text-blue-100">See what our community has to say about their experience</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="p-8 glass border-blue-400/20">
              <CardContent className="p-0">
                <div className="flex items-center justify-between mb-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={prevTestimonial}
                    className="rounded-full text-blue-100 hover:bg-blue-400/10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentTestimonial ? "bg-blue-400" : "bg-blue-400/30"
                        }`}
                      />
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={nextTestimonial}
                    className="rounded-full text-blue-100 hover:bg-blue-400/10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>

                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <blockquote className="text-lg mb-6 italic text-blue-100">
                    "{testimonials[currentTestimonial].review}"
                  </blockquote>

                  <div className="flex items-center justify-center space-x-4">
                    <Avatar>
                      <AvatarImage src={"/placeholder.svg"} />
                      <AvatarFallback className="bg-blue-500 text-white">
                        {testimonials[currentTestimonial]?.user_id?.username
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-semibold text-white">
                        {testimonials[currentTestimonial]?.user_id?.username || "Anonymous"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 text-center glass border-blue-400/20 glow-blue">
          <CardContent className="p-0">
            <h2 className="text-4xl font-bold mb-4 text-white">Ready to create your next extraordinary event?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of organizers who trust HostMyShow to bring their vision to life
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 glow-blue"
                >
                  Start Creating
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg border-blue-400/30 text-blue-100 hover:bg-blue-400/10 bg-transparent"
              >
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default Landing;
