import { GENESIS_DATA } from "./config";

class Block {
  timestamp: number | Date | string;
  lastHash: string;
  hash: string;
  data: DataI;
  constructor({ timestamp, lastHash, hash, data }: BlockI) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  static genesis(): Block {
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }: { lastBlock: Block; data: DataI }): Block {
    return new this({
      timestamp: Date.now(),
      lastHash: lastBlock.hash,
      data,
      hash: "",
    });
  }
}

export default Block;
