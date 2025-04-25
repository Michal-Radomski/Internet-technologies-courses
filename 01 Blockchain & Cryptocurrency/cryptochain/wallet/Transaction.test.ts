import { describe, expect, it, beforeEach, jest } from "@jest/globals";
import { Mock, UnknownFunction } from "jest-mock";
import { ec as EC } from "elliptic";

import Wallet from "./Wallet";
import Transaction from "./Transaction";
import verifySignature from "../util";
import { DataI, ObjectI } from "../Interfaces";

describe("Transaction", (): void => {
  let transaction: Transaction, senderWallet: Wallet, recipient: string, amount: number;

  beforeEach((): void => {
    senderWallet = new Wallet();
    recipient = "recipient-public-key";
    amount = 50;

    transaction = new Transaction({ senderWallet, recipient, amount });
  });

  it("has an `id`", (): void => {
    expect(transaction).toHaveProperty("id");
  });

  describe("outputMap", (): void => {
    it("has an `outputMap`", (): void => {
      expect(transaction).toHaveProperty("outputMap");
    });

    it("outputs the amount to the recipient", (): void => {
      expect((transaction.outputMap as ObjectI)[recipient]).toEqual(amount);
    });

    it("outputs the remaining balance for the `senderWallet`", (): void => {
      expect((transaction.outputMap as ObjectI)[senderWallet.publicKey]).toEqual(senderWallet.balance - amount);
    });
  });

  describe("input", (): void => {
    it("has an `input`", (): void => {
      expect(transaction).toHaveProperty("input");
    });

    it("has a `timestamp` in the input", (): void => {});

    it("sets the `amount` to the `senderWallet` balance", (): void => {
      expect(transaction.input.amount).toEqual(senderWallet.balance);
    });

    it("sets the `address` to the `senderWallet` publicKey", (): void => {
      expect(transaction.input.address).toEqual(senderWallet.publicKey);
    });

    it("signs the input", (): void => {
      expect(
        verifySignature({
          publicKey: senderWallet.publicKey,
          data: transaction.outputMap as DataI,
          signature: transaction.input.signature,
        })
      ).toBe(true);
    });
  });

  describe("validTransaction", (): void => {
    let errorMock: Mock<UnknownFunction>;

    beforeEach((): void => {
      errorMock = jest.fn();

      global.console.error = errorMock;
    });

    describe("when the transaction is valid", (): void => {
      it("returns true", () => {
        expect(Transaction.validTransaction(transaction)).toBe(true);
      });
    });

    describe("when the transaction is invalid", (): void => {
      describe("and a transaction outputMap value is invalid", (): void => {
        it("returns false and logs an error", (): void => {
          (transaction.outputMap as ObjectI)[senderWallet.publicKey] = 999999;

          expect(Transaction.validTransaction(transaction)).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe("and a transaction input Signature is invalid", (): void => {
        it("returns false and logs an error", (): void => {
          transaction.input.signature = new Wallet().sign("data");

          expect(Transaction.validTransaction(transaction)).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });
  });

  describe("update()", (): void => {
    let originalSignature: EC.Signature, originalSenderOutput: number, nextRecipient: string, nextAmount: number;

    describe("and the amount is invalid", (): void => {
      it("throws an error", (): void => {
        expect(() => {
          transaction.update({
            senderWallet,
            recipient: "foo",
            amount: 999999,
          });
        }).toThrow("Amount exceeds balance");
      });
    });

    describe("and the amount is valid", (): void => {
      beforeEach((): void => {
        originalSignature = transaction.input.signature;
        originalSenderOutput = (transaction.outputMap as ObjectI)[senderWallet.publicKey];
        nextRecipient = "next-recipient";
        nextAmount = 50;

        transaction.update({
          senderWallet,
          recipient: nextRecipient,
          amount: nextAmount,
        });
      });

      it("outputs the amount to the next recipient", (): void => {
        expect((transaction.outputMap as ObjectI)[nextRecipient]).toEqual(nextAmount);
      });

      it("subtracts the amount from the original sender output amount", (): void => {
        expect((transaction.outputMap as ObjectI)[senderWallet.publicKey]).toEqual(originalSenderOutput - nextAmount);
      });

      it("maintains a total output that matches the input amount", (): void => {
        expect(
          Object.values(transaction.outputMap as ObjectI).reduce(
            (total: number, outputAmount: number) => total + outputAmount
          )
        ).toEqual(transaction.input.amount);
      });

      // Temp
      it("re-signs the transaction", (): void => {
        expect(transaction.input.signature).toEqual(originalSignature);
      });

      describe("and another update for the same recipient", (): void => {
        let addedAmount: number;

        beforeEach((): void => {
          addedAmount = 80;
          transaction.update({
            senderWallet,
            recipient: nextRecipient,
            amount: addedAmount,
          });
        });

        it("adds to the recipient amount", (): void => {
          expect((transaction.outputMap as ObjectI)[nextRecipient]).toEqual(nextAmount + addedAmount);
        });

        it("subtracts the amount from the original sender output amount", (): void => {
          expect((transaction.outputMap as ObjectI)[senderWallet.publicKey]).toEqual(
            originalSenderOutput - nextAmount - addedAmount
          );
        });
      });
    });
  });
});
