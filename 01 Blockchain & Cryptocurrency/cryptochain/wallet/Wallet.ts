import { ec as EC } from "elliptic";

import { STARTING_BALANCE } from "../config";
import { ec } from "../util";
import { DataI, ObjectI } from "../Interfaces";
import cryptoHash from "../util/crypto-hash";
import Transaction from "./Transaction";
import Block from "../blockchain/Block";

// console.log("curve:", curve);

class Wallet {
  balance: number;
  keyPair: EC.KeyPair;
  publicKey: string;
  constructor() {
    this.balance = STARTING_BALANCE;
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex", false);
    // console.log("this.keyPair:", this.keyPair);
    // console.log("this.publicKey:", this.publicKey);
    // console.log("this.keyPair.getPublic():", this.keyPair.getPublic() as curve.base.BasePoint);
  }

  sign(data: DataI): EC.Signature {
    return this.keyPair.sign(cryptoHash(data));
  }

  createTransaction({ recipient, amount, chain }: { recipient: string; amount: number; chain?: Block[] }): Transaction {
    if (chain) {
      this.balance = Wallet.calculateBalance({
        chain,
        address: this.publicKey,
      });
    }

    if (amount > this.balance) {
      throw new Error("Amount exceeds balance");
    }

    return new Transaction({ senderWallet: this, recipient, amount } as any);
  }

  static calculateBalance({ chain, address }: { chain: Block[]; address: string }): number {
    let hasConductedTransaction: boolean = false;
    let outputsTotal: number = 0;

    for (let i = chain.length - 1; i > 0; i--) {
      const block = chain[i];

      for (let transaction of block.data) {
        if ((transaction as unknown as ObjectI).input.address === address) {
          hasConductedTransaction = true;
        }

        const addressOutput = (transaction as unknown as ObjectI).outputMap[address];

        if (addressOutput) {
          outputsTotal = outputsTotal + addressOutput;
        }
      }

      if (hasConductedTransaction) {
        break;
      }
    }

    return hasConductedTransaction ? outputsTotal : STARTING_BALANCE + outputsTotal;
  }
}

export default Wallet;
