import { describe, expect, it, beforeEach } from "@jest/globals";

import TransactionPool from "./TransactionPool";
import Wallet from "./Wallet";
import Transaction from "./Transaction";
import { ObjectI } from "../Interfaces";

describe("TransactionPool", (): void => {
  let transactionPool: TransactionPool, transaction: Transaction, senderWallet: Wallet;

  beforeEach((): void => {
    transactionPool = new TransactionPool();
    senderWallet = new Wallet();
    transaction = new Transaction({
      senderWallet,
      recipient: "fake-recipient",
      amount: 50,
    });
  });

  describe("setTransaction()", (): void => {
    it("adds a transaction", (): void => {
      transactionPool.setTransaction(transaction);
      // console.log("transactionPool:", transactionPool);

      expect((transactionPool.transactionMap as ObjectI)[transaction.id]).toBe(transaction);
    });
  });

  describe("existingTransaction()", (): void => {
    it("returns an existing transaction given an input address", (): void => {
      transactionPool.setTransaction(transaction);
      // console.log("transactionPool:", transactionPool);

      expect(transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey })).toBe(transaction);
    });
  });
});
