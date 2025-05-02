import path from "path";
import http from "http";
import express, { Express, Request, Response } from "express";
// import hexToBinary from "hex-to-binary";
import bodyParser from "body-parser";
import cors from "cors";
import request from "request";
import * as dotenv from "dotenv";
// import { v1 as uuid } from "uuid";
dotenv.config();

// import Block from "./Block";
import Blockchain from "./blockchain/Blockchain";
import { DataI, ObjectI } from "./Interfaces";
import PubSub from "./app/Pubsub";
import Block from "./blockchain/Block";
import TransactionPool from "./wallet/TransactionPool";
import Wallet from "./wallet/Wallet";
import Transaction from "./wallet/Transaction";
import TransactionMiner from "./app/TransactionMiner";

const transactionPool: TransactionPool = new TransactionPool();
const blockchain: Blockchain = new Blockchain();
const wallet: Wallet = new Wallet();
const pubsub: PubSub = new PubSub({ blockchain, transactionPool });
const transactionMiner: TransactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });

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

// @ts-ignore
app.post("/api/transact", (req: Request, res: Response) => {
  const { amount, recipient } = req.body as { amount: number; recipient: string };

  try {
    let transaction = transactionPool.existingTransaction({ inputAddress: wallet.publicKey }) as Transaction;

    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({
        recipient,
        amount,
        chain: blockchain.chain,
      }) as Transaction;
    }
    // console.log("transaction:", transaction);
    transactionPool.setTransaction(transaction);
    pubsub.broadcastTransaction(transaction);
    return res.status(200).json({ type: "success", transaction });
  } catch (error) {
    return res.status(400).json({ type: "error", message: (error as Error).message });
  }
});

app.get("/api/transaction-pool-map", (req: Request, res: Response) => {
  console.log("req.ip:", req.ip);
  res.json(transactionPool.transactionMap);
});

app.get("/api/mine-transactions", (req: Request, res: Response) => {
  console.log("req.ip:", req.ip);
  transactionMiner.mineTransactions();

  res.redirect("/api/blocks");
});

app.get("/api/wallet-info", (req: Request, res: Response) => {
  console.log("req.ip:", req.ip);
  const address: string = wallet.publicKey;

  res.json({
    address,
    balance: Wallet.calculateBalance({ chain: blockchain.chain, address }),
  });
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
const syncChainsWithRootState = (): void => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootChain = JSON.parse(body) as Block[];

      console.log("Replace chain on a sync with", rootChain);
      blockchain.replaceChain(rootChain);
    }
  });

  request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootTransactionPoolMap = JSON.parse(body) as ObjectI;

      console.log("Replace transaction pool map on a sync with", rootTransactionPoolMap);
      transactionPool.setMap(rootTransactionPoolMap);
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
    syncChainsWithRootState();
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

// const id = uuid();
// console.log("id:", id);
