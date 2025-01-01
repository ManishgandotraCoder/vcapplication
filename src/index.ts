// src/index.ts
import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

const app: express.Application = express();
const port = 3000;

app.use(express.text());
app.use(bodyParser.json());
app.use(cors());
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*", // or specify your client URL, e.g., "http://localhost:3001"
  },
});
const onlineUsers = new Map<string, string>();

io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("join", (userId: string) => {
    console.log(`User ${userId} connected with socketId: ${socket.id}`);

    // 1. Store in-memory tracking
    onlineUsers.set(userId, socket.id);

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

app.listen(port, () => {
  console.log(`server is listening on ${port}`);
});

app.get("/", (req: Request, res: Response): void => {
  res.send("Welff dcome to Manish Gandotra testing domain");
});
