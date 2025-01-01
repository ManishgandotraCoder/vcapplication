// src/index.ts
import express, { Application, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app: Application = express();
const PORT = 3000;

// Create HTTP server and Socket.IO server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // or specify your client URL, e.g., "http://localhost:3001"
  },
});
const corsOptions = {
  origin: "*", // or an array of domains
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // if you need to allow cookies/auth headers
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());

// Routes

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from the Node-TS-Mongo + Socket app!");
});

// ------------------------------------------
// In-memory store of online users (basic)
// Key: userId, Value: socket.id
// ------------------------------------------
const onlineUsers = new Map<string, string>();

// Socket.IO connection logic
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join", (userId: string) => {
    console.log(`User ${userId} connected with socketId: ${socket.id}`);

    // 1. Store in-memory tracking
    onlineUsers.set(userId, socket.id);

    // 2. Update user status in DB

    // 3. Broadcast updated online user list
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);

    // 4. Remove user from online users Map
    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);

        break;
      }
    }

    // 6. Broadcast updated online user list again
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));
  });
});

(async () => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
