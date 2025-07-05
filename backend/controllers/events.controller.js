import { Event } from "../models/events.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getEvents = asyncHandler( async(req ,res) => {
    let events = await Event.find({}).select("-users -totalbookings -totalRevenue -certificate");
    if(!events.length){
        return res.status(400).send({
            message : "No Events Found",
            success : true
        })
    }
    return res.status(200).send({
        events,
        message : "Events Found",
        success : true
    })
})

const getEventById = asyncHandler( async(req , res) => {
    const { id } = req.params;
    const event = await Event.findById(id).select("-users -totalbookings -totalRevenue -certificate");
    if(!event){
        return res.status(400).send({
            message : "Event Not Found",
            success : false
        })
    }
    return res.status(200).send({
        event,
        message : "Event Sent",
        success : true
    })
});
export {getEvents , getEventById};
