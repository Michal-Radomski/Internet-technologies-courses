import { v1 as uuid } from "uuid"; //* V1 - based on timestamp
import { ec as EC } from "elliptic";

import verifySignature from "../util";
import Wallet from "./Wallet";
import { DataI, Input, ObjectI, Output } from "../Interfaces";
import { MINING_REWARD, REWARD_INPUT } from "../config";

class Transaction {
  id: string;
  outputMap: {};
  input: { timestamp: number; amount: number; address: string; signature: EC.Signature };
  constructor({
    senderWallet,
    recipient,
    amount,
    outputMap,
    input,
  }: {
    senderWallet: Wallet;
    recipient: string;
    amount: number;
    outputMap: Output;
    input: Input;
  }) {
    this.id = uuid();
    // this.outputMap = this.createOutputMap({ senderWallet, recipient, amount });
    this.outputMap = outputMap || this.createOutputMap({ senderWallet, recipient, amount });
    // this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
    this.input = input || this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  createOutputMap({
    senderWallet,
    recipient,
    amount,
  }: {
    senderWallet: Wallet;
    recipient: string;
    amount: number;
  }): ObjectI {
    const outputMap = {} as ObjectI;

    outputMap[recipient] = amount;
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
    // console.log("outputMap:", outputMap);

    return outputMap;
  }

  createInput({ senderWallet, outputMap }: { senderWallet: Wallet; outputMap: ObjectI }): {
    timestamp: number;
    amount: number;
    address: string;
    signature: EC.Signature;
  } {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputMap as DataI),
    };
  }

  update({ senderWallet, recipient, amount }: { senderWallet: Wallet; recipient: string; amount: number }): void {
    if (amount > this.outputMap[senderWallet.publicKey as keyof typeof this.outputMap]) {
      throw new Error("Amount exceeds balance");
    }

    if (!this.outputMap[recipient as keyof typeof this.outputMap]) {
      (this.outputMap as ObjectI)[recipient] = amount;
    } else {
      (this.outputMap as ObjectI)[recipient] = this.outputMap[recipient as keyof typeof this.outputMap] + amount;
    }

    (this.outputMap as ObjectI)[senderWallet.publicKey] =
      this.outputMap[senderWallet.publicKey as keyof typeof this.outputMap] - amount;

    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  static validTransaction(transaction: {
    input: { address: string; amount: number; signature: EC.Signature };
    outputMap: ObjectI;
  }): boolean {
    const {
      input: { address, amount, signature },
      outputMap,
    } = transaction;

    const outputTotal: number = Object.values(outputMap).reduce(
      (total: number, outputAmount: number) => total + outputAmount
    );

    if (amount !== outputTotal) {
      console.error(`Invalid transaction from ${address}`);

      return false;
    }

    if (!verifySignature({ publicKey: address, data: outputMap as DataI, signature })) {
      console.error(`Invalid signature from ${address}`);
      return false;
    }

    return true;
  }

  static rewardTransaction({ minerWallet }: { minerWallet: Wallet }): Transaction {
    return new this({
      input: REWARD_INPUT as Input,
      outputMap: { [minerWallet.publicKey]: MINING_REWARD },
    } as any);
  }
}

export default Transaction;
