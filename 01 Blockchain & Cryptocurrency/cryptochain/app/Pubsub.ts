import { createClient, RedisClientType } from "redis";
import * as dotenv from "dotenv";
dotenv.config();

import Blockchain from "../blockchain/Blockchain";
import Block from "../blockchain/Block";
import TransactionPool from "../wallet/TransactionPool";
import Transaction from "../wallet/Transaction";

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
  TRANSACTION: "TRANSACTION",
};

const redisConfig = {
  readonly: false,
  url: `redis://:${process.env.RedisSecret}@${process.env.RedisHost}:${process.env.RedisPort}`,
} as { [key: string]: string | boolean };

class PubSub {
  blockchain: Blockchain;
  publisher: RedisClientType;
  subscriber: RedisClientType;
  transactionPool: TransactionPool;
  constructor({ blockchain, transactionPool }: { blockchain: Blockchain; transactionPool: TransactionPool }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;

    // Setup the Redis clients for publishing and subscribing
    this.publisher = createClient(redisConfig);
    this.subscriber = createClient(redisConfig);

    this.connectAndSubscribe();
  }

  async connectAndSubscribe(): Promise<void> {
    try {
      this.publisher.on("connect", (): void => console.log("Publisher connected to Redis-Server"));
      this.publisher.on("ready", (): void => console.log("Publisher connected and ready..."));
      this.subscriber.on("connect", (): void => console.log("Subscriber connected to Redis-Server"));
      this.subscriber.on("ready", (): void => console.log("Subscriber connected and ready..."));

      await this.publisher.connect().catch((error: Error) => console.log("error:", error));
      await this.subscriber.connect().catch((error: Error) => console.log("error:", error));

      this.subscribeToChannels();

      this.subscriber.on("message", (channel: string, message: string) => {
        console.log(`Message received. Channel: ${channel}. Message: ${message}`);
      });
    } catch (error) {
      console.error(`Unable to connect to Redis: ${error}`);
    }
  }

  handleMessage(channel: string, message: string): void {
    console.log(`Message received. Channel: ${channel}. Message: ${message}`);

    const parsedMessage = JSON.parse(message) as Block[] | Transaction;

    // if (channel === CHANNELS.BLOCKCHAIN) {
    //   this.blockchain.replaceChain(parsedMessage);
    // }
    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain(parsedMessage as Block[]);
        break;
      case CHANNELS.TRANSACTION:
        this.transactionPool.setTransaction(parsedMessage as Transaction);
        break;
      default:
        return;
    }
  }

  subscribeToChannels(): void {
    Object.values(CHANNELS).forEach(async (channel: string) => {
      await this.subscriber.subscribe(channel, (message: string) => {
        console.log(`Received message from ${channel}: ${message}`);
      });
    });
  }

  async publish({ channel, message }: { channel: string; message: string }): Promise<void> {
    await this.publisher.publish(channel, message);
  }

  //* Doesn't work!
  // async publish({ channel, message }: { channel: string; message: string }): Promise<void> {
  //   await this.subscriber.unsubscribe(channel, async (): Promise<void> => {
  //     await this.publisher.publish(channel, message, async (): Promise<void> => {
  //       await this.subscriber.subscribe(channel);
  //     });
  //   });
  // }

  async broadcastChain(): Promise<void> {
    await this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }

  broadcastTransaction(transaction: Transaction): void {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction),
    });
  }
}

//* Test
// const blockchain: Blockchain = new Blockchain();
// const testPubSub: PubSub = new PubSub({ blockchain });
// setTimeout(() => testPubSub.publisher.publish(CHANNELS.TEST, "foo"), 1000);

export default PubSub;
