import { describe, expect, it, beforeEach } from "@jest/globals";

import Wallet from "./Wallet";
import verifySignature from "../util";
import Transaction from "./Transaction";
import { ObjectI } from "../Interfaces";

describe("Wallet", (): void => {
  let wallet: Wallet;

  beforeEach((): void => {
    wallet = new Wallet();
  });

  it("has a `balance`", (): void => {
    expect(wallet).toHaveProperty("balance");
  });

  it("has a `publicKey`", (): void => {
    expect(wallet).toHaveProperty("publicKey");
  });

  describe("signing data", (): void => {
    const data = "foobar";

    it("verifies a signature", (): void => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: wallet.sign(data), //* Old signature
        })
      ).toBe(true);
    });

    it("does not verify an invalid signature", (): void => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: new Wallet().sign(data), //* New signature
        })
      ).toBe(false);
    });
  });

  describe("createTransaction", (): void => {
    describe("and the amount exceeds the balance", (): void => {
      it("throws an error", (): void => {
        expect(() => wallet.createTransaction({ amount: 999999, recipient: "foo-recipient" })).toThrow(
          "Amount exceeds balance"
        );
      });
    });

    describe("and the amount is valid", (): void => {
      let transaction: Transaction, amount: number, recipient: string;

      beforeEach((): void => {
        amount = 50;
        recipient = "foo-recipient";
        transaction = wallet.createTransaction({ amount, recipient });
      });

      it("creates an instance of `Transaction`", (): void => {
        expect(transaction instanceof Transaction).toBe(true);
      });

      it("matches the transaction input with the wallet", (): void => {
        expect(transaction.input.address).toEqual(wallet.publicKey);
      });

      it("outputs the amount to the recipient", (): void => {
        expect((transaction.outputMap as ObjectI)[recipient]).toEqual(amount);
      });
    });
  });
});
