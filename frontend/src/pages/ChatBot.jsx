import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X } from 'lucide-react';

const ChatCard = ({ event }) => (
  <div className="bg-white/10 text-white rounded-xl p-4 shadow border border-blue-400/20 w-full max-w-sm">
    <img
      src={event.image}
      alt={event.title}
      className="w-full h-40 object-cover rounded-md mb-3"
    />
    <h2 className="text-lg font-bold mb-1">{event.title}</h2>
    <p className="text-sm">📅 {event.date} | 🕒 {event.time}</p>
    <p className="text-sm">📍 {event.location}</p>
    <p className="text-sm text-green-400">🎟️ Seats: {event.availableSeats}</p>
  </div>
);

const Message = ({ message, isBot }) => {
  // If message is an array of events (for cards)
  if (Array.isArray(message) && message[0]?.title) {
    return (
      <div className="flex flex-col gap-4 mb-4">
        {message.map((event, idx) => (
          <div key={idx} className="flex justify-start">
            <ChatCard event={event} />
          </div>
        ))}
      </div>
    );
  }

  // If message is an object (not events)
  if (typeof message === 'object') {
    return (
      <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
        <div className={`max-w-[70%] p-3 rounded-xl shadow border border-blue-400/20 text-white ${isBot ? 'glass' : 'glass-dark'}`}>
          {Object.entries(message).map(([key, value]) => (
            <div key={key} className="mb-2">
              <span className="font-semibold">{key}: </span>
              <span>{JSON.stringify(value)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default plain text
  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[70%] p-3 rounded-xl shadow border border-blue-400/20 text-white ${isBot ? 'glass' : 'glass-dark'}`}>
        {message}
      </div>
    </div>
  );
};

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { text: input, isBot: false }]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API}/events/ask`, {
        prompt: input
      });

      let botResponse = response.data.reply;

      setMessages(prev => [...prev, { text: botResponse, isBot: true }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        text: 'Sorry, I encountered an error. Please try again.',
        isBot: true
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 ease-in-out backdrop-blur-md bg-opacity-80 border border-blue-400/20"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-96 h-[800px] glass rounded-3xl flex flex-col border border-blue-400/20 shadow-2xl bg-white/10 backdrop-blur-md">
          {/* Header */}
          <div className="bg-blue-900/40 text-white px-6 py-4 rounded-t-3xl border-b border-blue-400/20 flex items-center justify-between">
            <h1 className="text-xl font-semibold">AI Assistant</h1>
            <button onClick={() => setIsOpen(false)} className="ml-2 text-white hover:text-blue-200">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-blue-100">
                👋 Hi! How can I help you today?
              </div>
            )}
            {messages.map((msg, idx) => (
              <Message key={idx} message={msg.text} isBot={msg.isBot} />
            ))}
            {loading && (
              <div className="flex items-center space-x-2">
                <div className="animate-bounce bg-blue-200 rounded-full h-2 w-2"></div>
                <div className="animate-bounce bg-blue-200 rounded-full h-2 w-2 delay-100"></div>
                <div className="animate-bounce bg-blue-200 rounded-full h-2 w-2 delay-200"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-blue-400/20 bg-white/10 backdrop-blur-md rounded-b-3xl">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/10 backdrop-blur-sm placeholder:text-white/50 text-white"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500/80 text-white px-6 py-2 rounded-xl hover:bg-blue-600/80 transition-colors disabled:bg-blue-300/60 shadow border border-blue-400/20"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
