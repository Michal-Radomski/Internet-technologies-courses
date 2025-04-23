import Block from "./Block";
import cryptoHash from "./crypto-hash";
import { DataI } from "./Interfaces";

class Blockchain {
  chain: Block[];
  blockchain?: Blockchain;
  newChain?: Block[];

  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }: { data: DataI }): void {
    const newBlock: Block = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    });

    this.chain.push(newBlock);
  }

  replaceChain(chain: Block[]): void {
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain must be longer");
      return;
    }

    if (!Blockchain.isValidChain(chain)) {
      console.error("The incoming chain must be valid");
      return;
    }

    console.log("Replacing chain with", chain);
    this.chain = chain;
  }

  static isValidChain(chain: Block[]): boolean {
    //* First block must be a genesis block
    //* Compare two objects
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    for (let i = 1; i < chain.length; i++) {
      const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];
      const actualLastHash: string = chain[i - 1].hash;
      const lastDifficulty: number = chain[i - 1].difficulty;

      if (lastHash !== actualLastHash) {
        return false;
      }

      const validatedHash: string = cryptoHash(timestamp, lastHash, data, nonce, difficulty);

      if (hash !== validatedHash) {
        return false;
      }

      if (Math.abs(lastDifficulty - difficulty) > 1) {
        return false;
      }
    }

    return true;
  }
}

export default Blockchain;
