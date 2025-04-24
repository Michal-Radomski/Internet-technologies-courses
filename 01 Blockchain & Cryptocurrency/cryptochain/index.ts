import path from "path";
import http from "http";
import express, { Express, Request, Response } from "express";
// import hexToBinary from "hex-to-binary";
import bodyParser from "body-parser";
import cors from "cors";
import request from "request";
import * as dotenv from "dotenv";
dotenv.config();

// import Block from "./Block";
import Blockchain from "./Blockchain";
import { DataI } from "./Interfaces";
import PubSub from "./Pubsub";
import Block from "./Block";

const blockchain: Blockchain = new Blockchain();
const pubsub: PubSub = new PubSub({ blockchain });
//* Test
// setTimeout(() => pubsub.broadcastChain(), 1000);

//* Port
const DEFAULT_PORT = (process.env.PORT || 3000) as number;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

//* The server
const app: Express = express();

const corsOptions = {
  origin: true,
  methods: ["POST", "GET", "OPTIONS"],
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get("/api/blocks", (req: Request, res: Response) => {
  console.log("req.ip:", req.ip);
  res.json(blockchain.chain);
});

app.post("/api/mine", (req: Request, res: Response) => {
  const { data } = req.body as { data: DataI };
  blockchain.addBlock({ data });
  pubsub.broadcastChain();
  res.redirect("/api/blocks");
});

//* Favicon
app.get("/favicon.ico", (_req: Request, res: Response) => {
  res.sendFile(path.join(__dirname + "/favicon.svg"));
});
//* Test route
app.get("/test", (req: Request, res: Response) => {
  console.log("req.ip:", req.ip);
  res.send("<h1 style='color:blue;text-align:center'>API is running</h1>");
});

//* Blockchain - get request
// Todo: replace with axios
const syncChains = (): void => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body) as Block[];

      console.log("Replace chain on a sync with", rootChain);
      blockchain.replaceChain(rootChain);
    }
  });
};

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_PORT = (DEFAULT_PORT + Math.ceil(Math.random() * 1000)) as number;
}

const PORT: number = PEER_PORT || DEFAULT_PORT;

const httpServer = http.createServer(app);
httpServer.listen({ port: PORT }, () => {
  console.log(`🚀 Server is listening at http://localhost:${PORT}`);
  // For testing only
  console.log("Current Time:", new Date().toLocaleTimeString());

  if (PORT !== DEFAULT_PORT) {
    syncChains();
  }
});

//* Testing
// const block: Block = new Block({ timestamp: Date.now(), lastHash: "lastHash", hash: "hash", data: ["data"] });
// console.log("block:", block);

// const blockchain: Blockchain = new Blockchain();
// blockchain.addBlock({ data: "Data_1" });
// blockchain.addBlock({ data: "Data_2" });
// blockchain.addBlock({ data: "Data_3" });
// console.log("blockchain:", blockchain);

// const hexString: string = "AF30B"; //* 717579
// console.log("hexToBinary(hexString):", hexToBinary(hexString)); //* 10101111001100001011 -> dec: 717579

//* Reminder
// const obj1 = { a: 1 };
// const obj2 = { a: 1 };
// console.log("obj1 === obj2:", obj1 === obj2); // false
// console.log("JSON.stringify(obj1) === JSON.stringify(obj2):", JSON.stringify(obj1) === JSON.stringify(obj2)); // true

// const obj3 = obj1;
// console.log("obj1 === obj3:", obj1 === obj3); // true

// const mood = "Happy! ";
// console.log(`I feel ${mood.repeat(3)}`); // Expected output: "I feel Happy! Happy! Happy!"

// let i = 0;
// do {
//   i += 1;
//   console.log({ i });
// } while (i < 5);

// let j = 0;
// while (j < 5) {
//   j += 1;
//   console.log({ j });
// }
