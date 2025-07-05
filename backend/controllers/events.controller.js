import { Booking } from "../models/bookings.model.js";
import { Event } from "../models/events.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getEvents = asyncHandler(async (req, res) => {
  let events = await Event.find({}).select(
    "-users -totalbookings -totalRevenue -certificate"
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

  const event = await Event.findById(id).select("seatMap eventDateTime");

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
    seatMap: event.seatMap,
    eventDateTime: formattedTimings,
    success: true,
    message: "Event seats and timings fetched successfully",
  });
});

const getMyEvents = asyncHandler(async(req , res) => {
  const userId = req.user.id ;
  const events = await Event.find({organizer : userId}).select("-seatMap")

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

  const event = await Event.findOne({_id : id , organizer : userId}).select("-seatMap");

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
        finalSeatMap.push({
          seatLabel: `${rowLabel}${c}`,
          isBooked: false,
        });
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
    eventDateTime,
    seats: seats.type,
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
      success  : true , 
      message : "Event Not Found"
    })
  }

  const updatedData = req.body ;

  const updatedEvent = await Event.findByIdAndUpdate(id , updatedData , {
    new : true
  })

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
    .populate("event_id", "title eventDateTime location");

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
  const organizerId =  req.user.id ;

  const totalBookings =await Booking.countDocuments({ organizer_id: organizerId })

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
      totalBookings,
      totalRevenue,
      totalActiveEvents
    }
  });
})


export { getEvents, getEventById, postEvent, getEventSeatsAndTimings , getMyEvents , getMyEventById , updateMyEvent , deleteMyEvent , getBookings , getMyBookings , getOrganizerSummary};
