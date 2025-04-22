import { GENESIS_DATA } from "./config";
import cryptoHash from "./crypto-hash";
import { BlockI, DataI } from "./Interfaces";

class Block {
  timestamp: number | Date | string;
  lastHash: string;
  hash: string;
  data: DataI;
  new?: string;
  constructor({ timestamp, lastHash, hash, data }: BlockI) {
    this.timestamp = timestamp; //* timestamp on the right: incoming timestamp
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  static genesis(): Block {
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }: { lastBlock: Block; data: DataI }): Block {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;

    return new this({
      timestamp: timestamp,
      lastHash: lastHash,
      data: data,
      hash: cryptoHash(timestamp, lastHash, data as string),
    });
  }
}

export default Block; //* commonjs: module.exports = Block;
