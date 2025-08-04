import React from 'react'
import {
  Atom,
  Zap,
  Paintbrush,
  Server,
  Braces,
  Layers,
  Route,
  Component,
  Palette,
  Database,
  Sparkles,
} from 'lucide-react';

const PROFILE_RITESH = "https://media.licdn.com/dms/image/v2/D4D03AQHPVOtEVdufkA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1709465192531?e=1757548800&v=beta&t=TOWVk50k32L_7v2HThlg0OFtP49zEICP2aAm0W1NU-k";
const PROFILE_SAKSHI = "https://media.licdn.com/dms/image/v2/D4D03AQF_F9C46Qdt3Q/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1729233246043?e=1757548800&v=beta&t=ypU6AG6OsBHzMAcuo4cgN8A4cPpWdvFUZYDMYxw6HvI"; 

const techStack = [
  { name: 'React', icon: <Atom className="inline mr-2 text-cyan-300" /> },
  { name: 'Vite', icon: <Zap className="inline mr-2 text-yellow-300" /> },
  { name: 'Tailwind CSS', icon: <Paintbrush className="inline mr-2 text-sky-300" /> },
  { name: 'shadcn/ui', icon: <Component className="inline mr-2 text-pink-300" /> },
  { name: 'Radix UI', icon: <Layers className="inline mr-2 text-purple-300" /> },
  { name: 'Backend: Node.js', icon: <Server className="inline mr-2 text-green-300" /> },
  { name: 'Express', icon: <Braces className="inline mr-2 text-gray-300" /> },
  { name: 'Icons: Lucide React', icon: <Sparkles className="inline mr-2 text-blue-300" /> },
  { name: 'State Management: Zustand', icon: <Database className="inline mr-2 text-orange-300" /> },
  { name: 'Routing: React Router DOM', icon: <Route className="inline mr-2 text-red-300" /> },
  { name: 'Other: Modern CSS, Glassmorphism, Responsive Design', icon: <Palette className="inline mr-2 text-indigo-300" /> },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen px-4 py-12 flex flex-col items-center  text-white">
      <div className="w-full max-w-4xl glass rounded-3xl shadow-2xl p-10 backdrop-blur-md bg-white/10 border border-blue-400/20">
        <h1 className="text-5xl font-extrabold mb-10 text-blue-300 text-center tracking-tight drop-shadow-lg">About Us</h1>
        {/* About Website */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-blue-200">About This Website</h2>
          <p className="text-blue-100 mb-2 text-lg">
            HostMyShow is a modern event management and ticketing platform designed for hackathons, live shows, and conferences. It allows organizers to create, manage, and promote events, while attendees can discover, book, and enjoy seamless event experiences.
          </p>
        </section>
        {/* Tech Stack */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-3 text-blue-200">Tech Stack</h2>
          <ul className="list-none text-blue-100 space-y-2 text-lg pl-0">
            {techStack.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                {item.icon}
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </section>
        {/* Privacy & Policies */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-3 text-blue-200">Privacy & Policies</h2>
          <ul className="list-disc list-inside text-blue-100 space-y-1 text-lg pl-4">
            <li>Your data is used solely for event management and ticketing purposes.</li>
            <li>We do not share your personal information with third parties.</li>
            <li>All payments are processed securely through trusted gateways.</li>
            <li>Cookies are used only to enhance your browsing experience.</li>
            <li>By using this website, you agree to our terms and privacy policy.</li>
          </ul>
        </section>
        {/* About Me & Contributor */}
        <section className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          {/* Ritesh Borse */}
          <div className="flex-1 bg-blue-900/40 rounded-2xl p-6 flex flex-col items-center shadow-lg hover:scale-[1.03] transition-transform duration-200">
            <img src={PROFILE_RITESH} alt="Ritesh Borse" className="w-24 h-24 rounded-full border-4 border-blue-400 shadow-md mb-4 object-cover" />
            <p className="text-xl font-bold text-white mb-1">Ritesh Borse</p>
            <p className="text-blue-100 mb-1">Final Year Student, Computer Engineering</p>
            <p className="text-blue-100 text-center">Passionate about building modern web applications, UI/UX, and solving real-world problems with technology. Always eager to learn and collaborate!</p>
          </div>
          {/* Sakshi Nehe */}
          <div className="flex-1 bg-blue-900/40 rounded-2xl p-6 flex flex-col items-center shadow-lg hover:scale-[1.03] transition-transform duration-200">
            <img src={PROFILE_SAKSHI} alt="Sakshi Nehe" className="w-24 h-24 rounded-full border-4 border-blue-400 shadow-md mb-4 object-cover" />
            <p className="text-xl font-bold text-white mb-1">Sakshi Nehe</p>
            <p className="text-blue-100 mb-1">Full Stack Developer</p>
            <p className="text-blue-100 text-center">Focused on building web applications with strength in backend development, databases, and secure systems. Enjoys turning real-world challenges into scalable solutions and thrives in collaborative, tech-driven environments.</p>
          </div>
          {/*<div className="bg-blue-900/30 rounded-lg p-4">
            <p className="text-lg font-bold text-white mb-1">Sakshi Nehe</p>
            <p className="text-blue-100 mb-1">Final Year Student, Computer Engineering</p>
            <p className="text-blue-100">Focused on building web applications with strength in backend development, databases, and secure systems. Enjoy turning real-world challenges into scalable solutions and thrive in collaborative, tech-driven environments.</p>
          </div>*/}
        </section>
      </div>
    </div>
  )
}

export default AboutUs
