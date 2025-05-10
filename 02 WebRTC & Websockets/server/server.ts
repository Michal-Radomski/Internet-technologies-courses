import path from "path";
import http from "http";

import * as dotenv from "dotenv";
dotenv.config();
import express, { Express, Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import twilio, { Twilio } from "twilio";
import { v4 as uuidv4 } from "uuid";
import { DefaultEventsMap, Server, Socket } from "socket.io";
import { ConnectedUser, Room } from "./Interfaces";
import { TokenInstance } from "twilio/lib/rest/api/v2010/account/token";
// console.log("twilio:", twilio);
// console.log("uuidv4():", uuidv4());

//* The server
const app: Express = express();

const corsOptions = {
  origin: true,
  methods: ["POST", "GET", "OPTIONS"],
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Accept"], // Specify
};

//* Middlewares
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
  })
);
// Compress all responses
app.use(compression({ level: 6 }));

//* Favicon
app.get("/favicon.ico", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + "/favicon.svg"));
});
//* Test route
app.get("/", (req: Request, res: Response) => {
  console.log("req.ip:", req.ip);
  res.send("<h1 style='color:blue;text-align:center'>API is running</h1>");
});

let connectedUsers = [] as ConnectedUser[];
let rooms = [] as Room[];

// Create route to check if room exists
// @ts-ignore
app.get("/api/room-exists/:roomId", (req: Request, res: Response) => {
  const { roomId } = req.params as { roomId: string };
  const room = rooms.find((room) => room.id === roomId) as Room;

  if (room) {
    // Send response that room exists
    if (room.connectedUsers.length > 3) {
      return res.send({ roomExists: true, full: true });
    } else {
      return res.send({ roomExists: true, full: false });
    }
  } else {
    // Send response that room does not exists
    return res.send({ roomExists: false });
  }
});

app.get("/api/get-turn-credentials", (req: Request, res: Response) => {
  console.log("req.ip:", req.ip);

  const accountSid = process.env.accountSid as string;
  const authToken = process.env.authToken as string;

  const client: Twilio = twilio(accountSid, authToken);

  res.send({ token: null });
  try {
    client.tokens.create().then((token: TokenInstance) => {
      res.send({ token });
    });
  } catch (err) {
    console.log("error occurred when fetching turn server credentials");
    console.log("err:", err);
    res.send({ token: null });
  }
});

//* Port
const portHTTP = (process.env.HTTP_PORT || 5000) as number;
const httpServer = http.createServer(app);

const io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// console.log("io:", io);

io.on("connection", (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) => {
  // console.log("socket:", socket);
  console.log(`User connected ${socket.id}`);

  socket.on("create-new-room", (data) => {
    // console.log("data:", data);
    createNewRoomHandler(data, socket);
  });

  socket.on("join-room", (data) => {
    console.log("data:", data);
    joinRoomHandler(data, socket);
  });

  socket.on("disconnect", () => {
    disconnectHandler(socket);
  });

  socket.on("conn-signal", (data) => {
    console.log("data:", data);
    signalingHandler(data, socket);
  });

  socket.on("conn-init", (data) => {
    console.log("data:", data);
    initializeConnectionHandler(data, socket);
  });

  socket.on("direct-message", (data) => {
    console.log("data:", data);
    // directMessageHandler(data, socket);
  });
});

httpServer.listen({ port: portHTTP }, (): void => {
  console.log(`🚀 Server is listening at http://localhost:${portHTTP}`);
  // For testing only
  console.log("Current Time:", new Date().toLocaleTimeString());
  // console.log('process.env.NODE_ENV === "development":', process.env.NODE_ENV === "development");
});

//* Socket.io handlers
const createNewRoomHandler = (
  data: ConnectedUser,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): void => {
  console.log("host is creating new room");
  console.log("data:", data);
  const { identity, onlyAudio } = data;

  const roomId: string = uuidv4();

  // Create new user
  const newUser = {
    identity,
    id: uuidv4(),
    socketId: socket.id,
    roomId,
    onlyAudio,
  } as ConnectedUser;

  // Push that user to connectedUsers
  connectedUsers = [...connectedUsers, newUser];

  // Create new room
  const newRoom = {
    id: roomId,
    connectedUsers: [newUser],
  };
  // Join socket.io room
  socket.join(roomId);

  rooms = [...rooms, newRoom];

  // Emit to that client which created that room roomId
  socket.emit("room-id", { roomId });

  // Emit an event to all users connected to that room about new users which are right in this room
  socket.emit("room-update", { connectedUsers: newRoom.connectedUsers });
};

const joinRoomHandler = (
  data: ConnectedUser,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): void => {
  const { identity, roomId, onlyAudio } = data;

  const newUser = {
    identity,
    id: uuidv4(),
    socketId: socket.id,
    roomId,
    onlyAudio,
  };

  // Join room as user which just is trying to join room passing room id
  const room = rooms.find((room: Room) => room.id === roomId) as Room;
  room.connectedUsers = [...room.connectedUsers, newUser];

  // Join socket.io room
  socket.join(roomId);

  // Add new user to connected users array
  connectedUsers = [...connectedUsers, newUser];

  // Emit to all users which are already in this room to prepare peer connection
  room.connectedUsers.forEach((user: ConnectedUser) => {
    if (user.socketId !== socket.id) {
      const data = {
        connUserSocketId: socket.id,
      };

      io.to(user.socketId).emit("conn-prepare", data);
    }
  });

  io.to(roomId).emit("room-update", { connectedUsers: room.connectedUsers });
};

const disconnectHandler = (socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void => {
  // Find if user has been registered - if yes remove him from room and connected users array
  const user = connectedUsers.find((user: ConnectedUser) => user.socketId === socket.id) as ConnectedUser;

  if (user) {
    // Remove user from room in server
    const room = rooms.find((room: Room) => room.id === user.roomId) as Room;

    room.connectedUsers = room.connectedUsers.filter((user: ConnectedUser) => user.socketId !== socket.id);

    // Leave socket io room
    socket.leave(user.roomId);

    // Close the room if amount of the users which will stay in room will be 0
    if (room.connectedUsers.length > 0) {
      // Emit to all users which are still in the room that user disconnected
      io.to(room.id).emit("user-disconnected", { socketId: socket.id });

      // Emit an event to rest of the users which left in the room new connectedUsers in room
      io.to(room.id).emit("room-update", {
        connectedUsers: room.connectedUsers,
      });
    } else {
      rooms = rooms.filter((r: Room) => r.id !== room.id);
    }
  }
};

const signalingHandler = (
  data: { connUserSocketId: string; signal: string },
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  const { connUserSocketId, signal } = data;
  console.log("signal:", signal);

  const signalingData = { signal, connUserSocketId: socket.id };
  io.to(connUserSocketId).emit("conn-signal", signalingData);
};

// Information from clients which are already in room that They have prepared for incoming connection
const initializeConnectionHandler = (
  data: { connUserSocketId: string },
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  const { connUserSocketId } = data;

  const initData = { connUserSocketId: socket.id };
  io.to(connUserSocketId).emit("conn-init", initData);
};
