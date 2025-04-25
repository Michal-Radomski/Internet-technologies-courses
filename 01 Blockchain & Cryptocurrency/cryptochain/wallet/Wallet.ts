import { ec as EC } from "elliptic";

import { STARTING_BALANCE } from "../config";
import { ec } from "../util";
import { DataI } from "../Interfaces";
import cryptoHash from "../util/crypto-hash";
import Transaction from "./Transaction";

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
  }

  sign(data: DataI): EC.Signature {
    return this.keyPair.sign(cryptoHash(data));
  }

  createTransaction({ recipient, amount }: { recipient: string; amount: number }): Transaction {
    if (amount > this.balance) {
      throw new Error("Amount exceeds balance");
    }

    return new Transaction({ senderWallet: this, recipient, amount });
  }
}

export default Wallet;
