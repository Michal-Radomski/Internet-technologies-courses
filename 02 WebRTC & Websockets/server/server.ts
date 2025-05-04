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
import twilio from "twilio";
import { v4 as uuidv4 } from "uuid";
import { DefaultEventsMap, Server } from "socket.io";
import { ConnectedUser, Room } from "./Interfaces";

console.log("twilio:", twilio);
console.log("uuidv4():", uuidv4());

//* Import routes
// import indexRouter from "./indexRouter"; // Temp

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

//* Route middleware
// app.use("/api", indexRouter); // Temp

//* Favicon
app.get("/favicon.ico", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + "/favicon.svg"));
});
//* Test route
app.get("/", (req: Request, res: Response) => {
  console.log("req.ip:", req.ip);
  res.send("<h1 style='color:blue;text-align:center'>API is running</h1>");
});

const connectedUsers = [] as ConnectedUser[]; // Temp
const rooms = [] as Room[];

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

//* Port
const portHTTP = (process.env.HTTP_PORT || 5000) as number;
const httpServer = http.createServer(app);

const io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
console.log("io:", io);

httpServer.listen({ port: portHTTP }, () => {
  console.log(`🚀 Server is listening at http://localhost:${portHTTP}`);
  // For testing only
  console.log("Current Time:", new Date().toLocaleTimeString());
  // console.log('process.env.NODE_ENV === "development":', process.env.NODE_ENV === "development");
});
