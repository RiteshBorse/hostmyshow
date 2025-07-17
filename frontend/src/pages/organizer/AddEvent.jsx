import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const eventTypes = ['Hackathon', 'Live Show'];
const totalSteps = 5;

const AddEvent = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    type: eventTypes[0],
    times: [''],
    date: '',
    banner: '',
    image: '',
    certificate: false,
    personalized: false,
    seatMode: 'rows-cols', // or 'direct'
    rows: '',
    cols: '',
    seats: '',
    cost: '',
    eventTier: '',
  });
  const navigate = useNavigate();

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSelectType = (value) => {
    setForm((prev) => ({ ...prev, type: value }));
  };

  const handleTimeChange = (idx, value) => {
    setForm((prev) => {
      const times = [...prev.times];
      times[idx] = value;
      return { ...prev, times };
    });
  };

  const addTime = () => setForm((prev) => ({ ...prev, times: [...prev.times, ''] }));
  const removeTime = (idx) => setForm((prev) => ({ ...prev, times: prev.times.filter((_, i) => i !== idx) }));

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!form.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!form.location.trim()) {
      toast.error('Location is required');
      return;
    }
    if (!form.banner.trim()) {
      toast.error('Banner image link is required');
      return;
    }
    if (!form.image.trim()) {
      toast.error('Image link is required');
      return;
    }
    if (!form.cost || isNaN(form.cost) || Number(form.cost) < 0) {
      toast.error('Valid ticket cost is required');
      return;
    }
    if (!form.date) {
      toast.error('Event date is required');
      return;
    }
    if (form.times.some(time => !time)) {
      toast.error('All event timings must be filled');
      return;
    }
    if (form.seatMode === 'rows-cols') {
      if (!form.rows || isNaN(form.rows) || Number(form.rows) < 1) {
        toast.error('Valid number of rows is required');
        return;
      }
      if (!form.cols || isNaN(form.cols) || Number(form.cols) < 1) {
        toast.error('Valid number of columns is required');
        return;
      }
    } else {
      if (!form.seats || isNaN(form.seats) || Number(form.seats) < 1) {
        toast.error('Valid number of seats is required');
        return;
      }
    }

    // Combine date and times into eventDateTime array
    const eventDateTime = form.times.map(time => {
      const dateTimeString = `${form.date}T${time}:00`; // YYYY-MM-DDTHH:MM:SS
      return new Date(dateTimeString).toISOString();
    });

    let seats, seatMap;
    if (form.seatMode === 'rows-cols') {
      seats = {
        type: 'RowColumns',
        value: `${form.rows}x${form.cols}`
      };
      seatMap = undefined;
    } else {
      seats = {
        type: 'direct'
      };
      seatMap = Array.from({ length: Number(form.seats) }, (_, i) => ({
        seatLabel: `S${i + 1}`,
        isBooked: false
      }));
    }

    const payload = {
      title: form.title,
      description: form.description,
      location: form.location,
      eventType: form.type,
      banner: form.banner,
      image: form.image,
      eventDateTime,
      seats,
      seatMap,
      cost: Number(form.cost),
      certificate: form.certificate,
      special: form.eventTier || "none",
    };

    try {
      const res = await axios.post(`${import.meta.env.VITE_API}/events/add-events`, payload, { withCredentials: true });
      toast.success('Event created successfully!');
      navigate('/organizer/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    }
  };

  return (
    <div className="px-10 text-white w-[80vw] max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add Event</h1>
      {/* Improved Progress Bar with Step Indicators */}
      <div className="mb-8">
        {/* Step Indicators */}
        <div className="flex items-center justify-between mb-4">
          {[
            { label: 'Basic Info', step: 1 },
            { label: 'Schedule & Seats', step: 2 },
            { label: 'Options', step: 3 },
            { label: 'Event Tier', step: 4 },
            { label: 'Review', step: 5 },
          ].map(({ label, step: s }, idx, arr) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div
                  className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-all duration-300
                    ${step === s ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : step > s ? 'bg-blue-400 border-blue-400 text-white' : 'bg-gray-800 border-blue-900 text-blue-300'}`}
                  aria-current={step === s ? 'step' : undefined}
                >
                  {step > s ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    s
                  )}
                </div>
                <span className={`mt-2 text-xs font-semibold text-center truncate ${step === s ? 'text-blue-300' : 'text-blue-200/60'}`}>{label}</span>
              </div>
              {idx < arr.length - 1 && (
                <div className={`flex-1 h-1 mx-1 ${step > s ? 'bg-blue-400' : 'bg-blue-900'} transition-all duration-300 rounded-full`} />
              )}
            </React.Fragment>
          ))}
        </div>
        {/* Progress Bar */}
        <div className="text-blue-300 text-sm mt-2 text-right">Step {step} of {totalSteps}</div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8 w-full">
        {/* Step 1: Basic Info + Banner */}
        {step === 1 && (
          <div className="space-y-4 glass py-8 px-16 flex flex-col w-full rounded-2xl">
            <div>
              <label className="block mb-1 font-semibold text-xl">Title</label>
              <Input className="h-10 border-white/30" placeholder="e.g Github Hackathon" name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-xl">Description</label>
              <Textarea className="h-10 border-white/30" placeholder="e.g Problem Statement will be provided to team..." name="description" value={form.description} onChange={handleChange} required />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-xl">Location</label>
              <Input className="h-10 border-white/30" placeholder="e.g Nashik" name="location" value={form.location} onChange={handleChange} required />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-xl">Type of Event</label>
              <Select value={form.type} onValueChange={handleSelectType}>
                <SelectTrigger className="h-10 border-white/30">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block mb-1 font-semibold text-xl">Banner Image Link</label>
              <Input className="h-10 border-white/30" placeholder="e.g https://..." name="banner" value={form.banner} onChange={handleChange} required />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-xl">Image Link</label>
              <Input className="h-10 border-white/30" placeholder="e.g https://..." name="image" value={form.image} onChange={handleChange} required />
            </div>
            <div className="flex justify-end">
              <Button className="bg-blue-700 hover:bg-blue-800 text-white" onClick={next}>Next</Button>
            </div>
          </div>
        )}
        {/* Step 2: Schedule, Seating, Cost */}
        {step === 2 && (
          <div className="space-y-4 glass py-8 px-16 flex flex-col w-full rounded-2xl">
            <label className="block mb-1 font-semibold text-xl">Event Date</label>
            <Input type="date" className="h-10 border-white/30" name="date" value={form.date} onChange={handleChange} required />
            <label className="block mb-1 font-semibold text-xl">Event Timings</label>
            {form.times.map((time, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <Input type="time" className="h-10 border-white/30" value={time} onChange={e => handleTimeChange(idx, e.target.value)} required />
                {form.times.length > 1 && (
                  <Button type="button" variant="destructive" onClick={() => removeTime(idx)} className="px-2">Remove</Button>
                )}
              </div>
            ))}
            <Button type="button" variant="secondary" className="bg-blue-700 hover:bg-blue-800 text-white" onClick={addTime}>Add Time</Button>
            <label className="block mb-4 font-semibold text-xl mt-4">Seating Arrangement</label>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div
                className={`relative flex flex-col items-center p-6 rounded-xl border-2 transition-all cursor-pointer
                  ${form.seatMode === 'rows-cols' 
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
                    : 'border-white/30 hover:border-blue-400/50 hover:bg-blue-500/5'
                  }`}
                onClick={() => handleChange({ target: { name: 'seatMode', value: 'rows-cols' } })}
              >
                <input
                  type="radio"
                  name="seatMode"
                  value="rows-cols"
                  checked={form.seatMode === 'rows-cols'}
                  onChange={handleChange}
                  className="hidden"
                />
                <div className="mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Rows & Columns</h3>
                <p className="text-sm text-center text-blue-200/70">
                  Organize seats in a grid layout with specific rows and columns
                </p>
                {form.seatMode === 'rows-cols' && (
                  <div className="absolute top-2 right-2 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>

              <div
                className={`relative flex flex-col items-center p-6 rounded-xl border-2 transition-all cursor-pointer
                  ${form.seatMode === 'direct' 
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
                    : 'border-white/30 hover:border-blue-400/50 hover:bg-blue-500/5'
                  }`}
                onClick={() => handleChange({ target: { name: 'seatMode', value: 'direct' } })}
              >
                <input
                  type="radio"
                  name="seatMode"
                  value="direct"
                  checked={form.seatMode === 'direct'}
                  onChange={handleChange}
                  className="hidden"
                />
                <div className="mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Direct Seats</h3>
                <p className="text-sm text-center text-blue-200/70">
                  Specify total number of seats without grid arrangement
                </p>
                {form.seatMode === 'direct' && (
                  <div className="absolute top-2 right-2 text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
            {form.seatMode === 'rows-cols' ? (
              <div className="flex gap-4">
                <Input name="rows" className="h-10 border-white/30" value={form.rows} onChange={handleChange} type="number" min="1" max="25" placeholder="Rows" required />
                <Input name="cols" className="h-10 border-white/30" value={form.cols} onChange={handleChange} type="number" min="1" max="25"placeholder="Columns" required />
              </div>
            ) : (
              <Input name="seats" className="h-10 border-white/30" value={form.seats} onChange={handleChange} type="number" min="1" max="500" placeholder="Total Seats" required />
            )}
            <label className="block mb-1 font-semibold text-xl mt-4">Cost of Ticket (₹)</label>
            <Input className="h-10 border-white/30" placeholder="e.g 500" name="cost" value={form.cost} onChange={handleChange} type="number" min="0" required />
            <div className="flex justify-between">
              <Button type="button" variant="secondary" className="bg-gray-700 hover:bg-gray-800 text-white" onClick={back}>Back</Button>
              <Button type="button" className="bg-blue-700 hover:bg-blue-800 text-white" onClick={next}>Next</Button>
            </div>
          </div>
        )}
        {/* Step 3: Options */}
        {step === 3 && (
          <div className="space-y-4 glass py-8 px-16 flex flex-col w-full rounded-2xl">
            <div className="flex items-center gap-2">
              <Checkbox id="certificate" name="certificate" checked={form.certificate} onCheckedChange={val => handleChange({ target: { name: 'certificate', type: 'checkbox', checked: val } })} />
              <label htmlFor="certificate" className="text-lg">Give certificate for participants</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="personalized" name="personalized" checked={form.personalized} onCheckedChange={val => handleChange({ target: { name: 'personalized', type: 'checkbox', checked: val } })} />
              <label htmlFor="personalized" className="text-lg">Need a personalized website</label>
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="secondary" className="bg-gray-700 hover:bg-gray-800 text-white" onClick={back}>Back</Button>
              <Button type="button" className="bg-blue-700 hover:bg-blue-800 text-white" onClick={next}>Next</Button>
            </div>
          </div>
        )}
        {/* Step 4: Event Tier */}
        {step === 4 && (
          <div className="space-y-4 glass py-8 px-16 flex flex-col w-full rounded-2xl">
            <h2 className="text-2xl font-bold mb-6">Select Event Tier</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Elite Tier */}
              <div
                className={`relative flex flex-col p-6 rounded-xl border-2 transition-all cursor-pointer
                  ${form.eventTier === 'elite' 
                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20' 
                    : 'border-white/30 hover:border-purple-400/50 hover:bg-purple-500/5'
                  }`}
                onClick={() => handleChange({ target: { name: 'eventTier', value: 'elite' } })}
              >
                <div className="absolute -top-3 -right-3">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                    Premium
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-purple-400">Elite</h3>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Featured placement
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    24/7 Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Custom branding
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Advanced analytics
                  </li>
                </ul>
              </div>

              {/* Prime Tier */}
              <div
                className={`relative flex flex-col p-6 rounded-xl border-2 transition-all cursor-pointer
                  ${form.eventTier === 'prime' 
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20' 
                    : 'border-white/30 hover:border-blue-400/50 hover:bg-blue-500/5'
                  }`}
                onClick={() => handleChange({ target: { name: 'eventTier', value: 'prime' } })}
              >
                <div className="absolute -top-3 -right-3">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    Popular
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-blue-400">Prime</h3>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Enhanced visibility
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Basic analytics
                  </li>
                </ul>
              </div>

              {/* Spotlight Tier */}
              <div
                className={`relative flex flex-col p-6 rounded-xl border-2 transition-all cursor-pointer
                  ${form.eventTier === 'spotlight' 
                    ? 'border-yellow-500 bg-yellow-500/10 shadow-lg shadow-yellow-500/20' 
                    : 'border-white/30 hover:border-yellow-400/50 hover:bg-yellow-500/5'
                  }`}
                onClick={() => handleChange({ target: { name: 'eventTier', value: 'spotlight' } })}
              >
                <div className="absolute -top-3 -right-3">
                  <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                    Featured
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-yellow-400">Spotlight</h3>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Homepage feature
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Email promotions
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Standard support
                  </li>
                </ul>
              </div>

              {/* Sponsored Tier */}
              <div
                className={`relative flex flex-col p-6 rounded-xl border-2 transition-all cursor-pointer
                  ${form.eventTier === 'sponsored' 
                    ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20' 
                    : 'border-white/30 hover:border-green-400/50 hover:bg-green-500/5'
                  }`}
                onClick={() => handleChange({ target: { name: 'eventTier', value: 'sponsored' } })}
              >
                <h3 className="text-xl font-bold mb-4 text-green-400">Sponsored</h3>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Sponsored tag
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Standard listing
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Basic support
                  </li>
                </ul>
              </div>

              {/* None/Standard Tier */}
              <div
                className={`relative flex flex-col p-6 rounded-xl border-2 transition-all cursor-pointer
                  ${form.eventTier === 'none' 
                    ? 'border-gray-500 bg-gray-500/10 shadow-lg shadow-gray-500/20' 
                    : 'border-white/30 hover:border-gray-400/50 hover:bg-gray-500/5'
                  }`}
                onClick={() => handleChange({ target: { name: 'eventTier', value: 'none' } })}
              >
                <h3 className="text-xl font-bold mb-4 text-gray-400">Standard</h3>
                <ul className="space-y-2 text-sm mb-4">
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Basic listing
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Standard features
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Email support
                  </li>
                </ul>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <Button type="button" variant="secondary" className="bg-gray-700 hover:bg-gray-800 text-white" onClick={back}>Back</Button>
              <Button type="button" className="bg-blue-700 hover:bg-blue-800 text-white" onClick={next}>Next</Button>
            </div>
          </div>
        )}
        {/* Step 4: Summary & Submit */}
        {step === 5 && (
          <div className="space-y-4 glass py-8 px-16 flex flex-col w-full rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Review & Submit</h2>
            <div className="bg-gray-900 rounded p-4 border border-blue-400">
              <p><span className="font-semibold">Title:</span> {form.title}</p>
              <p><span className="font-semibold">Description:</span> {form.description}</p>
              <p><span className="font-semibold">Location:</span> {form.location}</p>
              <p><span className="font-semibold">Type:</span> {form.type}</p>
              <p><span className="font-semibold">Banner:</span> {form.banner}</p>
              <p><span className="font-semibold">Image:</span> {form.image}</p>
              <p><span className="font-semibold">Timings:</span> {form.times.join(', ')}</p>
              <p><span className="font-semibold">Seating:</span> {form.seatMode === 'rows-cols' ? `${form.rows} rows x ${form.cols} columns` : `${form.seats} seats`}</p>
              <p><span className="font-semibold">Ticket Cost:</span> ₹{form.cost}</p>
              <p><span className="font-semibold">Certificate:</span> {form.certificate ? 'Yes' : 'No'}</p>
              <p><span className="font-semibold">Personalized Website:</span> {form.personalized ? 'Yes' : 'No'}</p>
              <p><span className="font-semibold">Event Tier:</span> {form.eventTier ? form.eventTier.charAt(0).toUpperCase() + form.eventTier.slice(1) : 'None'}</p>
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="secondary" className="bg-gray-700 hover:bg-gray-800 text-white" onClick={back}>Back</Button>
              <Button type="submit" variant="success" className="bg-green-600 hover:bg-green-700 text-white">Submit</Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddEvent;