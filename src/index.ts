// src/index.ts
import express, { Request, Response } from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app: express.Application = express();
const port = 3000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // or specify your client URL, e.g., "http://localhost:3001"
  },
});

app.use(express.text());
app.use(bodyParser.json());
app.use(cors());
// (async () => {
//   httpServer.listen(port, () => {
//     console.log(`Server running on port ${port}`);
//   });
// })();

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});
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

app.get("/", (req: Request, res: Response): void => {
  res.send("Welcome to Manish Gandotra testing domain");
});
