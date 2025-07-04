import React from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogClose } from '@/components/ui/dialog';

const EventDetails = () => {
  // Example event/movie data
  const event = {
    title: "The Accountant²",
    language: "ENGLISH",
    rating: 7.1,
    userRating: "7.1 User Rating",
    description:
      "When an old acquaintance is murdered, Wolff is compelled to solve the case. Realizing more extreme measures are necessary, Wolff recruits his estranged and highly lethal brother, Brax, to help. In partnership with Marybeth Medina, they uncover a deadly conspiracy, becoming targets of a ruthless network of killers who will stop at nothing to keep their secrets buried.",
    duration: "2h 13m",
    genre: "Crime, Thriller, Action",
    year: 2025,
    poster: "https://m.media-amazon.com/images/I/91dAIcmOjAL._AC_UF1000,1000_QL80_.jpg",
    banner: "https://m.media-amazon.com/images/S/pv-target-images/6f9297a0e0325abbab2384f140597954e79acdcd1dcc3965ed51491457f0235e._SX1080_FMjpg_.jpg",
    trailer: "https://www.w3schools.com/html/mov_bbb.mp4" // Sample MP4 for demo
  };

  const [open, setOpen] = React.useState(false);
  const videoRef = React.useRef(null);

  // Reset video when dialog closes
  React.useEffect(() => {
    if (!open && videoRef.current) {
      videoRef.current.currentTime = 0;
    }
  }, [open]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Banner background */}
      <div
        className="absolute inset-0 z-0 bg-black/90"
        style={{
          backgroundImage: `url(${event.banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(4px) brightness(1)',
        }}
      />
      {/* Overlay for dark effect */}
      <div className="absolute inset-0 bg-black/70 z-10" />
      {/* Main content */}
      <div className="relative z-20 w-full max-w-6xl flex flex-col md:flex-row items-center md:items-start gap-10 px-4 py-16">
        {/* Poster */}
        <img
          src={event.poster}
          alt={event.title}
          className="w-1/3 h-1/3 object-cover object-center rounded-2xl shadow-4xl border-b-4 border-b-white flex-shrink-0"
        />
        {/* Details */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <span className="uppercase text-blue-400 font-semibold tracking-widest mb-2">{event.language}</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-blue-400 text-lg">★</span>
            <span className="text-white font-semibold text-lg">{event.userRating}</span>
          </div>
          <p className="text-blue-100 mb-6 max-w-2xl">{event.description}</p>
          <div className="text-blue-200 font-medium mb-8">
            {event.duration} • {event.genre} • {event.year}
          </div>
          <div className="flex gap-4 flex-wrap justify-center md:justify-start">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow">Watch Trailer</button>
              </DialogTrigger>
              <DialogContent className="bg-black max-w-4xl w-full flex flex-col items-center p-0 overflow-hidden">
                <div className="w-full" style={{ aspectRatio: '16/7' }}>
                  <video
                    ref={videoRef}
                    width="100%"
                    height="100%"
                    controls
                    autoPlay
                    onEnded={() => setOpen(false)}
                    className="w-full h-full rounded-t-lg bg-black"
                  >
                    <source src={event.trailer} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </DialogContent>
            </Dialog>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow">Buy Tickets</button>
            <button className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-3 rounded-full transition-colors shadow border border-white/20 flex items-center justify-center"><span className="text-xl">♡</span></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetails
