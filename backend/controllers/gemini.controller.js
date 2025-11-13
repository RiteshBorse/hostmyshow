import { model } from "../app.js";
import { Event } from "../models/events.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const simplifyEvent = (event, queryDate = new Date()) => {
  const availableSeats =
    event.seatMap?.filter((seat) => !seat.isBooked).length || 0;

  const upcoming = event.eventDateTime
    .filter((dt) => new Date(dt) >= queryDate)
    .sort((a, b) => new Date(a) - new Date(b));

  const next = upcoming[0] || event.eventDateTime[0];
  const dateObj = new Date(next);
  const [d, t] = dateObj.toISOString().split("T");
  const timeOnly = t.slice(0, 5);

  return {
    id: event._id.toString(),
    title: event.title,
    date: d,
    time: timeOnly,
    availableSeats: availableSeats,
    location: event.location,
    image: event.image || "https://via.placeholder.com/400x200",
  };
};

const getRecommendedEvents = async (date, time) => {
  let queryDate = new Date();
  if (date && time) queryDate = new Date(`${date}T${time}`);
  else if (date) queryDate = new Date(`${date}T00:00`);
  else if (time) queryDate = new Date(`${new Date().toISOString().split("T")[0]}T${time}`);

  const matchedEvents = await Event.find({
    eventDateTime: { $elemMatch: { $gte: queryDate } }
  }).sort({ eventDateTime: 1 }).limit(5);

  return matchedEvents.map(e => simplifyEvent(e, queryDate));
};

const getTodaysEvents = async () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const matchedEvents = await Event.find({
    eventDateTime: { $elemMatch: { $gte: start, $lte: end } }
  }).sort({ eventDateTime: 1 });

  return matchedEvents.map(e => simplifyEvent(e, start));
};

const getEventsByLocation = async (location) => {
  const matchedEvents = await Event.find({
    location: { $regex: location, $options: "i" }
  }).sort({ eventDateTime: 1 }).limit(10);

  return matchedEvents.map(e => simplifyEvent(e));
};

const getEventsByTitle = async (title) => {
  const matchedEvents = await Event.find({
    title: { $regex: title, $options: "i" }
  }).sort({ eventDateTime: 1 }).limit(10);

  return matchedEvents.map(e => simplifyEvent(e));
};

const getEventsByDescription = async (keyword) => {
  const matchedEvents = await Event.find({
    description: { $regex: keyword, $options: "i" }
  }).sort({ eventDateTime: 1 }).limit(10);

  return matchedEvents.map(e => simplifyEvent(e));
};

const geminiChatBot = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  const chat = model.startChat();
  const result = await chat.sendMessage(prompt);
  const response = result.response;
  const toolCalls = response.functionCalls?.() || [];

  if (toolCalls.length > 0) {
    const call = toolCalls[0];
    const args = call.args || {};
    let data;

    switch (call.name) {
      case "getRecommendedEvents":
        data = await getRecommendedEvents(args.date, args.time);
        break;
      case "getTodaysEvents":
        data = await getTodaysEvents();
        break;
      case "getEventsByLocation":
        data = await getEventsByLocation(args.location);
        break;
      case "getEventsByTitle":
        data = await getEventsByTitle(args.title);
        break;
      case "getEventsByDescription":
        data = await getEventsByDescription(args.keyword);
        break;
      default:
        return res.json({ reply: response.text() });
    }

    return res.json({ reply: data });
  }

  return res.json({ reply: response.text() });
});

export { geminiChatBot };
