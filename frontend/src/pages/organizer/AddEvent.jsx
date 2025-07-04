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

const eventTypes = ['Hackathon', 'Live Show'];
const totalSteps = 4;

const AddEvent = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    type: eventTypes[0],
    times: [''],
    banner: '',
    certificate: false,
    personalized: false,
    seatMode: 'rows-cols', // or 'direct'
    rows: '',
    cols: '',
    seats: '',
    cost: '',
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Event submitted! (see console for data)');
    console.log(form);
  };

  return (
    <div className="p-10 text-white w-[80vw] max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Add Event</h1>
      {/* Progress Bar */}
      <div className="mb-8">
        <Progress value={(step / totalSteps) * 100} className="h-3 text-blue-500 bg-blue-900" />
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
            <div className="flex justify-end">
              <Button className="bg-blue-700 hover:bg-blue-800 text-white" onClick={next}>Next</Button>
            </div>
          </div>
        )}
        {/* Step 2: Schedule, Seating, Cost */}
        {step === 2 && (
          <div className="space-y-4 glass py-8 px-16 flex flex-col w-full rounded-2xl">
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
            <label className="block mb-1 font-semibold text-xl mt-4">Seating Arrangement</label>
            <div className="flex gap-4 mb-2">
              <label className="flex items-center gap-2">
                <Input type="radio" name="seatMode" value="rows-cols" checked={form.seatMode === 'rows-cols'} onChange={handleChange} /> Rows & Columns
              </label>
              <label className="flex items-center gap-2">
                <Input type="radio" name="seatMode" value="direct" checked={form.seatMode === 'direct'} onChange={handleChange} /> Direct Seat Count
              </label>
            </div>
            {form.seatMode === 'rows-cols' ? (
              <div className="flex gap-4">
                <Input name="rows" className="h-10 border-white/30" value={form.rows} onChange={handleChange} type="number" min="1" placeholder="Rows" required />
                <Input name="cols" className="h-10 border-white/30" value={form.cols} onChange={handleChange} type="number" min="1" placeholder="Columns" required />
              </div>
            ) : (
              <Input name="seats" className="h-10 border-white/30" value={form.seats} onChange={handleChange} type="number" min="1" placeholder="Total Seats" required />
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
        {/* Step 4: Summary & Submit */}
        {step === 4 && (
          <div className="space-y-4 glass py-8 px-16 flex flex-col w-full rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Review & Submit</h2>
            <div className="bg-gray-900 rounded p-4 border border-blue-400">
              <p><span className="font-semibold">Title:</span> {form.title}</p>
              <p><span className="font-semibold">Description:</span> {form.description}</p>
              <p><span className="font-semibold">Location:</span> {form.location}</p>
              <p><span className="font-semibold">Type:</span> {form.type}</p>
              <p><span className="font-semibold">Banner:</span> {form.banner}</p>
              <p><span className="font-semibold">Timings:</span> {form.times.join(', ')}</p>
              <p><span className="font-semibold">Seating:</span> {form.seatMode === 'rows-cols' ? `${form.rows} rows x ${form.cols} columns` : `${form.seats} seats`}</p>
              <p><span className="font-semibold">Ticket Cost:</span> ₹{form.cost}</p>
              <p><span className="font-semibold">Certificate:</span> {form.certificate ? 'Yes' : 'No'}</p>
              <p><span className="font-semibold">Personalized Website:</span> {form.personalized ? 'Yes' : 'No'}</p>
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