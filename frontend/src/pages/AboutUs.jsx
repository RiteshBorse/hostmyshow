import React from 'react'

const AboutUs = () => {
  return (
    <div className="min-h-screen px-4 py-12 flex flex-col items-center text-white">
      <div className="w-full max-w-3xl glass rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold mb-6 text-blue-400 text-center">About Us</h1>
        {/* About Website */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-blue-300">About This Website</h2>
          <p className="text-blue-100 mb-2">
            HostMyShow is a modern event management and ticketing platform designed for hackathons, live shows, and conferences. It allows organizers to create, manage, and promote events, while attendees can discover, book, and enjoy seamless event experiences.
          </p>
        </section>
        {/* Tech Stack */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-blue-300">Tech Stack</h2>
          <ul className="list-disc list-inside text-blue-100 space-y-1">
            <li>Frontend: React, Vite, Tailwind CSS, shadcn/ui, Radix UI</li>
            <li>Backend: Node.js, Express (planned)</li>
            <li>Icons: Lucide React</li>
            <li>State Management: React Context</li>
            <li>Routing: React Router DOM</li>
            <li>Other: Modern CSS, Glassmorphism, Responsive Design</li>
          </ul>
        </section>
        {/* Privacy & Policies */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2 text-blue-300">Privacy & Policies</h2>
          <ul className="list-disc list-inside text-blue-100 space-y-1">
            <li>Your data is used solely for event management and ticketing purposes.</li>
            <li>We do not share your personal information with third parties.</li>
            <li>All payments are processed securely through trusted gateways.</li>
            <li>Cookies are used only to enhance your browsing experience.</li>
            <li>By using this website, you agree to our terms and privacy policy.</li>
          </ul>
        </section>
        {/* About Me */}
        <section>
          <h2 className="text-2xl font-semibold mb-2 text-blue-300">About Me</h2>
          <div className="bg-blue-900/30 rounded-lg p-4">
            <p className="text-lg font-bold text-white mb-1">Ritesh Borse</p>
            <p className="text-blue-100 mb-1">Final Year Student, Computer Engineering</p>
            <p className="text-blue-100">Passionate about building modern web applications, UI/UX, and solving real-world problems with technology. Always eager to learn and collaborate!</p>
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
