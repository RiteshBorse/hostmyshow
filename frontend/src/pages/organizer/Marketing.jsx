import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Loader2, Mail, Send, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const Marketing = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [events, setEvents] = useState([]);

  // Fetch emails
  useEffect(() => {
    const fetchEmails = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${import.meta.env.VITE_API}/marketing/get-emails`, {
          withCredentials: true
        });
        setEmails(res.data.users.map(user => user.email));
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch emails');
      } finally {
        setLoading(false);
      }
    };

    const fetchEvents = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API}/events/get-my-events`, {
          withCredentials: true
        });
        setEvents(res.data.events || []);
      } catch (error) {
        toast.error('Failed to fetch events');
      }
    };

    fetchEmails();
    fetchEvents();
  }, []);

  const sendEmails = async () => {
    if (!selectedEvent) {
      toast.error('Please select an event');
      return;
    }

    setSending(true);
    setProgress(0);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < emails.length; i++) {
      try {
        await axios.post(
          `${import.meta.env.VITE_API}/marketing/bulk-email`,
          {
            event_id: selectedEvent,
            email: emails[i]
          },
          { withCredentials: true }
        );
        successCount++;
      } catch (error) {
        failCount++;
        console.error(`Failed to send email to ${emails[i]}:`, error);
      }
      setProgress(((i + 1) / emails.length) * 100);
    }

    toast.success(`Successfully sent ${successCount} emails${failCount > 0 ? `, ${failCount} failed` : ''}`);
    setSending(false);
  };

  return (
    <div className="min-h-screen px-10 py-8 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-blue-300">Email Marketing</h1>

        {/* Event Selection */}
        <div className="glass p-6 rounded-xl mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Event to Promote</h2>
          <Select onValueChange={setSelectedEvent} value={selectedEvent}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose an event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event._id} value={event._id}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Email List */}
        <div className="glass p-6 rounded-xl mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recipient List</h2>
            <div className="flex items-center gap-2 text-blue-300">
              <UserCheck />
              <span>{emails.length} Recipients</span>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {emails.map((email, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 rounded-lg bg-gray-800/50 border border-gray-700"
                >
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="text-sm truncate">{email}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Send Button and Progress */}
        <div className="glass p-6 rounded-xl">
          <div className="flex flex-col items-center gap-4">
            <Button
              className="w-full max-w-md flex items-center gap-2"
              size="lg"
              onClick={sendEmails}
              disabled={sending || !selectedEvent}
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending... ({Math.round(progress)}%)
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send to All Recipients
                </>
              )}
            </Button>

            {sending && (
              <div className="w-full max-w-md h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketing;