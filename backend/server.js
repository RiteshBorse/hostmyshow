import { connectDB } from "./utils/connectDB.js";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

//cron file import
import "./cron/updatedEventsStatus.js" 

// Create HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join event room for seat updates
    socket.on('join-event', (eventId) => {
        socket.join(`event-${eventId}`);
        console.log(`User ${socket.id} joined event ${eventId}`);
    });

    // Leave event room
    socket.on('leave-event', (eventId) => {
        socket.leave(`event-${eventId}`);
        console.log(`User ${socket.id} left event ${eventId}`);
    });

    // Handle seat selection
    socket.on('select-seat', async (data) => {
        const { eventId, seatLabel, userId } = data;
        try {
            // Emit seat selection to all users in the event room
            socket.to(`event-${eventId}`).emit('seat-selected', {
                seatLabel,
                userId,
                timestamp: new Date()
            });
        } catch (error) {
            socket.emit('seat-selection-error', { error: error.message });
        }
    });

    // Handle seat deselection
    socket.on('deselect-seat', (data) => {
        const { eventId, seatLabel, userId } = data;
        socket.to(`event-${eventId}`).emit('seat-deselected', {
            seatLabel,
            userId,
            timestamp: new Date()
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Export io for use in other files
export { io };

server.listen(process.env.PORT || 8000 , ()=> {
    connectDB();
    console.log(`Server listening on ${process.env.PORT || 8000}`)
})
