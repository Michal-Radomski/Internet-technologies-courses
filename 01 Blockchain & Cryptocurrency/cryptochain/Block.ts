import hexToBinary from "hex-to-binary";

import { GENESIS_DATA, MINE_RATE } from "./config";
import cryptoHash from "./crypto-hash";
import { BlockI, DataI } from "./Interfaces";

class Block {
  timestamp: number | Date | string;
  lastHash: string;
  hash: string;
  data: DataI;
  new?: string;
  difficulty: number;
  nonce: number;
  constructor({ timestamp, lastHash, hash, data, nonce, difficulty }: BlockI) {
    this.timestamp = timestamp; //* timestamp on the right: incoming timestamp
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce as number;
    this.difficulty = difficulty as number;
  }

  static genesis(): Block {
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }: { lastBlock: Block; data: DataI }): Block {
    const lastHash = lastBlock.hash;
    let hash: string, timestamp: number;
    let { difficulty }: { difficulty: number } = lastBlock;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({ originalBlock: lastBlock, timestamp });
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
      // console.log("hash:", hash);
      // console.log("hexToBinary(hash):", hexToBinary(hash));
    } while (hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty));

    return new this({ timestamp, lastHash, data, difficulty, nonce, hash });
  }

  static adjustDifficulty({ originalBlock, timestamp }: { originalBlock: Block; timestamp?: number }): number {
    const { difficulty } = originalBlock;

    if (difficulty < 1) {
      return 1;
    }

    if (timestamp && timestamp - (originalBlock.timestamp as number) > MINE_RATE) {
      return difficulty - 1;
    }

    return difficulty + 1;
  }
}

export default Block; //* commonjs: module.exports = Block;
