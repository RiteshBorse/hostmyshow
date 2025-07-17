import { Event } from "../models/events.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { eventMarketingFormat, mail } from "../utils/email.js";

const getEmailList = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "Attendee" }).select("email");
  console.log(users);
  return res.status(200).send({
    message: "Emails of Attendee",
    success: true,
    users,
  });
});
const sendBulkEmails = asyncHandler(async (req, res) => {
  const { event_id, email } = req.body;
  const event = await Event.findById(event_id); // Fixed: Changed 'id' to 'event_id'

  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event not found"
    });
  }

  const content = {
    to: email,
    subject: `New Event: ${event.title}`,
    html: eventMarketingFormat(event),
    attachments: [{
      filename: 'event-banner.jpg',
      path: event.banner,
      cid: 'event-banner' // Content-ID for the banner image
    }]
  };

  const result = await mail(content);
  
  if (!result) {
    return res.status(500).json({
      success: false,
      message: "Failed to send email"
    });
  }

  return res.status(200).json({
    success: true,
    message: "Email sent successfully"
  });
});
export { sendBulkEmails, getEmailList };
