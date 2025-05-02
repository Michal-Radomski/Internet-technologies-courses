import Block from "./Block";
import cryptoHash from "../util/crypto-hash";
import { DataI, ObjectI } from "../Interfaces";
import { MINING_REWARD, REWARD_INPUT } from "../config";
import Transaction from "../wallet/Transaction";
import Wallet from "../wallet/Wallet";

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

  replaceChain(chain: Block[], validateTransactions?: boolean, onSuccess?: Function): void {
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain must be longer");
      return;
    }

    if (!Blockchain.isValidChain(chain)) {
      console.error("The incoming chain must be valid");
      return;
    }

    if (validateTransactions && !this.validTransactionData({ chain })) {
      console.error("The incoming chain has invalid data");
      return;
    }

    if (onSuccess) {
      onSuccess();
    }
    console.log("replacing chain with", chain);
    this.chain = chain;
  }

  validTransactionData({ chain }: { chain: Block[] }): boolean {
    for (let i = 1; i < chain.length; i++) {
      const block: Block = chain[i];
      const transactionSet: Set<string> = new Set();
      let rewardTransactionCount: number = 0;

      for (let transaction of block.data) {
        if ((transaction as unknown as ObjectI).input.address === REWARD_INPUT.address) {
          rewardTransactionCount += 1;

          if (rewardTransactionCount > 1) {
            console.error("Miner rewards exceeds limit");
            return false;
          }

          if (Object.values((transaction as unknown as ObjectI).outputMap)[0] !== MINING_REWARD) {
            console.error("Miner reward amount is invalid");
            return false;
          }
        } else {
          if (!Transaction.validTransaction(transaction as any)) {
            console.error("Invalid transaction");
            return false;
          }

          const trueBalance: number = Wallet.calculateBalance({
            chain: this.chain,
            address: (transaction as unknown as ObjectI).input.address,
          });

          if ((transaction as unknown as ObjectI).input.amount !== trueBalance) {
            console.error("Invalid input amount");
            return false;
          }

          if (transactionSet.has(transaction)) {
            console.error("An identical transaction appears more than once in the block");
            return false;
          } else {
            transactionSet.add(transaction);
          }
        }
      }
    }

    return true;
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
