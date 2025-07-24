
import dayjs from "dayjs";
import { Event } from "../models/events.model.js";

export const updateStatus = async () => {
  const now = dayjs();
  const events = await Event.find();
  console.log(`Running event status update at ${now.format()}`);
  console.log(`Found ${events.length} events`);

  for (const event of events) {
    const eventStart = dayjs(event.eventDateTime[0]);

    let newStatus = 'upcoming';
    if (now.isAfter(eventStart.add(3, 'hour'))) {
      newStatus = 'completed';
    } else if (now.isAfter(eventStart)) {
      newStatus = 'active';
    }

    if (event.status !== newStatus) {
      console.log(`Updating event ${event._id}: ${event.status} → ${newStatus}`);
      event.status = newStatus;
      await event.save({ validateBeforeSave: false });
    }
  }
};
