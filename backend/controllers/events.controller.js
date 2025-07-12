import { Booking } from "../models/bookings.model.js";
import { Event } from "../models/events.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import QRCode from 'qrcode';
import { areArraysEqual } from "../utils/arrayUtils.js";

const getEvents = asyncHandler(async (req, res) => {
  let events = await Event.find({}).select(
    "-users -totalBookings -totalRevenue -certificate"
  );
  if (!events.length) {
    return res.status(400).send({
      message: "No Events Found",
      success: true,
    });
  }
  return res.status(200).send({
    events,
    message: "Events Found",
    success: true,
  });
});

const getEventById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await Event.findById(id).select(
    "-users -totalbookings -totalRevenue -certificate"
  );
  if (!event) {
    return res.status(400).send({
      message: "Event Not Found",
      success: false,
    });
  }
  return res.status(200).send({
    event,
    message: "Event Sent",
    success: true,
  });
});

const getEventSeatsAndTimings = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const event = await Event.findById(id).select("seats seatMap eventDateTime cost");

  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event not found.",
    });
  }

  const formattedTimings = event.eventDateTime.map((dt) => {
    const dateObj = new Date(dt);
    return {
      date: dateObj.toLocaleDateString("en-CA"),
      time: dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
    };
  });

  return res.status(200).json({
    seats: event.seats,
    cost : event.cost,
    seatMap: event.seatMap,
    eventDateTime: formattedTimings,
    success: true,
    message: "Event seats and timings fetched successfully",
  });
});

const getMyEvents = asyncHandler(async(req , res) => {
  const userId = req.user.id ;
  const events = await Event.find({organizer : userId}).select("-seatMap")
console.log(events)
  if(!events.length)
{
  return res.status(404).json({
    success : false , 
    message : "You have not created any events yet"
  }) ;
}
    return res.status(200).json({
    success: true,
    events,
    message: "Events you organized fetched successfully"
  });

});

const getMyEventById = asyncHandler(async(req , res) => {

  const userId = req.user.id ;
  const {id} = req.params ;

  const event = await Event.findOne({_id : id , organizer : userId});

  if(!event)
  {
    return res.status(404).json({
      success : false ,
      message : "Event not found"
    });
  }

  return res.status(200).json({
    success : true ,
    event ,
    message : "Event fetched successfully !"
  })
})

const postEvent = asyncHandler(async (req, res) => {
  if (req.user.role != "Organizer") {
    return res.status(400).send({
      message: "You need to create a new account for organizing events",
      success: false,
    });
  }
  const {
    title,
    description,
    location,
    eventType,
    banner,
    image ,
    eventDateTime,
    seats,
    seatMap,
    cost,
    certificate,
    special,
  } = req.body;

  if (
    !title ||
    !description ||
    !location ||
    !eventType ||
    !banner ||
    !eventDateTime ||
    !seats ||
    !cost
  ) {
    return res.status(400).json({
      success: false,
      message: "All required fields must be provided.",
    });
  }

  let finalSeatMap = [];

  if (seats.type === "RowColumns") {
    const [rows, cols] = seats.value.split("x").map(Number);

    if (isNaN(rows) || isNaN(cols)) {
      return res.status(400).json({
        success: false,
        message: "Invalid RowColumns format. Use format like '10x8'.",
      });
    }

    for (let r = 0; r < rows; r++) {
      const rowLabel = String.fromCharCode(65 + r); // 'A' + r
      for (let c = 1; c <= cols; c++) {
        finalSeatMap.push({ seatLabel: `${rowLabel}${c}`, isBooked: false });
      }
    }
  } else if (seats.type === "direct") {
    if (!Array.isArray(seatMap) || seatMap.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Seat map is required when seats.type is 'direct'.",
      });
    }
    finalSeatMap = seatMap;
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid seats.type. Must be 'RowColumns' or 'direct'.",
    });
  }
  const user = await User.findById(req.user.id);
  const event = await Event.create({
    title,
    description,
    location,
    eventType,
    banner,
    image,
    eventDateTime,
    seats,
    seatMap: finalSeatMap,
    cost,
    certificate,
    special,
    organizer: req.user.id,
  });

  user.eventsOrganized.push(event._id);
  await user.save();

  return res.status(201).json({
    event,
    message: "Event Created Successfully",
    success: true,
  });
});

const updateMyEvent = asyncHandler(async(req , res) => {
  const {id} =  req.params ;
  const userId = req.user.id ;

  const event = await Event.findOne({_id : id , organizer : userId });

  if(!event) {
    return res.status(404).json({
      success  : false ,
      message : "Event Not Found"
    })
  }

  const { seats: newSeats, seatMap: newDirectSeatMap, ...restOfUpdatedData } = req.body;

  // Check if seat configuration is changing
  // It's crucial to compare against the *current* state of event.seats and event.seatMap
  const isSeatConfigChanging =
    (newSeats?.type && newSeats.type !== event.seats.type) ||
    (newSeats?.type === 'RowColumns' && newSeats.value !== event.seats.value) ||
    (newSeats?.type === 'direct' && newDirectSeatMap && !areArraysEqual(newDirectSeatMap, event.seatMap));

  let finalSeatMap = event.seatMap; // Default to existing map
  let finalSeatsObject = event.seats; // Default to existing seats object

  if (isSeatConfigChanging) {
    const existingBookings = await Booking.find({ event_id: id });
    if (existingBookings.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot change seating configuration: bookings already exist for this event.",
      });
    }

    // Regenerate seatMap based on new configuration
    if (newSeats.type === "RowColumns") {
      const [rows, cols] = newSeats.value.split("x").map(Number);
      if (isNaN(rows) || isNaN(cols) || rows < 1 || cols < 1) {
        return res.status(400).json({ success: false, message: "Invalid RowColumns format for seating." });
      }
      finalSeatMap = [];
      for (let r = 0; r < rows; r++) {
        const rowLabel = String.fromCharCode(65 + r);
        for (let c = 1; c <= cols; c++) {
          finalSeatMap.push({ seatLabel: `${rowLabel}${c}`, isBooked: false });
        }
      }
    } else if (newSeats.type === "direct") {
      if (!Array.isArray(newDirectSeatMap) || newDirectSeatMap.length === 0) {
        return res.status(400).json({ success: false, message: "Seat map is required for direct seat type." });
      }
      // Ensure new seats are not booked by default if the map is provided directly
      finalSeatMap = newDirectSeatMap.map(seat => ({ ...seat, isBooked: false }));
    } else {
        return res.status(400).json({ success: false, message: "Invalid seats.type. Must be 'RowColumns' or 'direct'." });
    }
    finalSeatsObject = newSeats; // Use the new seats object
  } else {
    if (newSeats) {
        finalSeatsObject = newSeats;
    }
  }

  // Debugging: Log finalSeatMap before update
  console.log("Final Seat Map before update:", finalSeatMap);
  console.log("Final Seat Map length:", finalSeatMap.length);

  // Construct a single update document for all fields EXCEPT seatMap
  let updateDoc = {
    ...restOfUpdatedData,
  };

  if (isSeatConfigChanging) {
    updateDoc.seats = finalSeatsObject;
  } else {
    if (newSeats) {
        updateDoc.seats = newSeats;
    }
  }

  const updatedEvent = await Event.findByIdAndUpdate(
    id,
    { $set: updateDoc },
    { new: true, runValidators: true }
  );

  if (!updatedEvent) {
    return res.status(404).json({ success: false, message: "Event not found after update attempt." });
  }

  // If seat configuration changed, perform separate operations to unset and then set seatMap
  // This is a workaround to avoid potential Mongoose recursion issues with array replacement.
  if (isSeatConfigChanging) {
    // 1. Unset (remove) the existing seatMap field
    await Event.updateOne({ _id: id }, { $unset: { seatMap: "" } });
    // 2. Set (add) the new seatMap array
    await Event.updateOne({ _id: id }, { $set: { seatMap: finalSeatMap } });
    
    // Refresh the updatedEvent object to include the latest seatMap
    updatedEvent.seatMap = finalSeatMap;
  }

  return res.status(200).json({
    success : true ,
    event  : updatedEvent ,
    message : "Event Updated Successfully"
  })
});

const deleteMyEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;
  const event = await Event.findOne({ _id: id, organizer: userId });

  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event not found "
    });
  }

  if (event.status !== 'upcoming') {
    return res.status(400).json({
      success: false,
      message: "Only upcoming events can be deleted",
    });
  }
  const existingBookings = await Booking.find({ event_id: id });

  if (existingBookings.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Event cannot be deleted because bookings already exist",
    });
  }
  
  await Event.findByIdAndDelete(id);

  return res.status(200).json({
    success: true,
    message: "Event deleted successfully",
  });
});


//Organizer
const getBookings = asyncHandler(async(req , res) => {
  const userId = req.user.id ;

  const bookings = await Booking.find({ organizer_id : userId})
  .populate("user_id" , )
  .populate("event_id" , "title");

  if(!bookings.length)
  {
    return res.status(404).json({
      success : false , 
      message : "No bookings" 
    })
  }
    return res.status(200).json({
    success: true,
    bookings,
    message: "Bookings fetched successfully",
  });
});

//attendee
const getMyBookings = asyncHandler(async(req , res) => {
  const userId = req.user.id ;
  const bookings = await Booking.find({ user_id: userId })
    .populate("event_id", "title eventDateTime location image eventType");

    if (!bookings.length) {
    return res.status(404).json({
      success: false,
      message: "You have not booked any events",
    });
  }

  return res.status(200).json({
    success: true,
    bookings,
    message: "Your bookings fetched successfully",
  });
})

const getOrganizerSummary = asyncHandler(async (req , res) => {
  const organizerId =  req.user.id;

  let events = await Event.find({ organizer : organizerId });
  let sum = 0;
  for(let a of events){
      sum += a.totalBookings;
  }
  console.log(sum)
  const bookings = await Booking.find({ organizer_id: organizerId }).select("paymentAmt");

  let totalRevenue = 0;
  for (let b of bookings) 
  {
    totalRevenue += b.paymentAmt;
  }
  const totalActiveEvents = await Event.countDocuments({
    organizer: organizerId,
    status: "active"
  });

  return res.status(200).json({
    success: true,
    message: "Dashboard stats fetched",
    counts: {
      totalBookings : sum,
      totalRevenue,
      activeShows : totalActiveEvents,
      totalUsers : 354
    }
  });
})


const checkSeatsAvailability = asyncHandler(async (req, res) => {
  const { event_id, seats } = req.body; // seats: array of seat labels, e.g. ['A1', 'A2']

  if (!event_id || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Event ID and seats array are required."
    });
  }

  const event = await Event.findById(event_id).select("seatMap");
  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event not found."
    });
  }

  const seatSet = new Set(seats);
  const alreadyBooked = event.seatMap
    .filter(seatObj => seatSet.has(seatObj.seatLabel) && seatObj.isBooked)
    .map(seatObj => seatObj.seatLabel);

  if (alreadyBooked.length > 0) {
    return res.status(400).json({
      success: true,
      available: false,
      alreadyBooked,
      message: `Some seats are already booked: ${alreadyBooked.join(', ')}`
    });
  }
  return res.status(200).json({
    success: true,
    available: true,
    message: "All selected seats are available."
  });
});
  



const generateTicketQR = async (data) => {
  const qrContent = JSON.stringify(data);
  return await QRCode.toDataURL(qrContent); // base64 image
};

const bookTicket = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const { event_id, booking_dateTime, seats, payment_id, paymentAmt } = req.body;
  console.log(req.body)
  if (!event_id || !booking_dateTime || !seats || !payment_id || !paymentAmt) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required.',
    });
  }

  const event = await Event.findById(event_id);
  if (!event) {
    return res.status(404).json({
      success: false,
      message: 'Event not found.',
    });
  }

  const seatList = seats.split(',').map(s => s.trim());

  const invalidSeats = [];
  const updatedSeatMap = event.seatMap.map(seatObj => {
    if (seatList.includes(seatObj.seatLabel)) {
      if (seatObj.isBooked) {
        invalidSeats.push(seatObj.seatLabel);
      }
      return { ...seatObj, isBooked: true };
    }
    return seatObj;
  });

  if (invalidSeats.length > 0) {
    return res.status(400).json({
      success: false,
      message: `These seats are already booked: ${invalidSeats.join(', ')}`,
    });
  }

  // Save updated seat status
  event.seatMap = updatedSeatMap;
  await event.save();

  // Get event organizer
  const organizer_id = event.organizer;

  // Generate QR code
  const qrCodeData = {
    event: event_id,
    user: user_id,
    seats: seatList,
    time: booking_dateTime,
    payment: payment_id
  };
  const qrCode = await generateTicketQR(qrCodeData);

  // Create booking
  const booking = await Booking.create({
    user_id,
    event_id,
    event_title : event.title,
    organizer_id,
    booking_dateTime,
    seats: seatList.join(','),
    ticket_qr: qrCode,
    payment_id,
    paymentAmt
  });
  event.totalBookings = (event.totalBookings || 0) + seatList.length;
  event.totalRevenue = (event.totalRevenue || 0) + Number(paymentAmt);
  await event.save();

  res.status(201).json({
    success: true,
    message: 'Booking successful!',
    booking
  });
});

export { getEvents, getEventById, postEvent, getEventSeatsAndTimings , getMyEvents , getMyEventById , updateMyEvent , deleteMyEvent , getBookings , getMyBookings , getOrganizerSummary ,  bookTicket , checkSeatsAvailability};