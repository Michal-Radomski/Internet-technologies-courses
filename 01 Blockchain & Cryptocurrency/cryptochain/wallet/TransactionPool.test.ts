import { describe, expect, it, beforeEach, jest } from "@jest/globals";

import TransactionPool from "./TransactionPool";
import Wallet from "./Wallet";
import Transaction from "./Transaction";
import { ObjectI } from "../Interfaces";
import { Mock, UnknownFunction } from "jest-mock";
import Blockchain from "../blockchain/Blockchain";

describe("TransactionPool", (): void => {
  let transactionPool: TransactionPool, transaction: Transaction, senderWallet: Wallet;

  beforeEach((): void => {
    transactionPool = new TransactionPool();
    senderWallet = new Wallet();
    transaction = new Transaction({
      senderWallet,
      recipient: "fake-recipient",
      amount: 50,
    } as any);
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

  describe("validTransactions()", () => {
    let validTransactions: ObjectI, errorMock: Mock<UnknownFunction>;

    beforeEach((): void => {
      validTransactions = [];
      errorMock = jest.fn();
      global.console.error = errorMock;

      for (let i = 0; i < 10; i++) {
        transaction = new Transaction({
          senderWallet,
          recipient: "any-recipient",
          amount: 30,
        } as any);

        if (i % 3 === 0) {
          transaction.input.amount = 999999;
        } else if (i % 3 === 1) {
          transaction.input.signature = new Wallet().sign("foo");
        } else {
          validTransactions.push(transaction);
        }

        transactionPool.setTransaction(transaction);
      }
    });

    it("returns valid transactions", (): void => {
      expect(transactionPool.validTransactions()).toEqual(validTransactions);
    });

    it("logs errors for the invalid transactions", (): void => {
      transactionPool.validTransactions();
      expect(errorMock).toHaveBeenCalled();
    });
  });

  describe("clear()", (): void => {
    it("clears the transactions", (): void => {
      transactionPool.clear();

      expect(transactionPool.transactionMap).toEqual({});
    });
  });

  describe("clearBlockchainTransactions()", (): void => {
    it("clears the pool of any existing blockchain transactions", (): void => {
      const blockchain: Blockchain = new Blockchain();
      const expectedTransactionMap = {} as ObjectI;

      for (let i = 0; i < 6; i++) {
        const transaction: Transaction = new Wallet().createTransaction({
          recipient: "foo",
          amount: 20,
        } as any);

        transactionPool.setTransaction(transaction);

        if (i % 2 === 0) {
          blockchain.addBlock({ data: [transaction as any] });
        } else {
          expectedTransactionMap[transaction.id] = transaction;
        }
      }

      transactionPool.clearBlockchainTransactions({ chain: blockchain.chain });

      expect(transactionPool.transactionMap).toEqual(expectedTransactionMap);
    });
  });
});
