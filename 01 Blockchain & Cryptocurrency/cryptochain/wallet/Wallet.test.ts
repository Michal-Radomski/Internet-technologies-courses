import { describe, expect, it, beforeEach, jest } from "@jest/globals";

import Wallet from "./Wallet";
import verifySignature from "../util";
import Transaction from "./Transaction";
import { DataI, ObjectI } from "../Interfaces";
import Blockchain from "../blockchain/Blockchain";
import { STARTING_BALANCE } from "../config";

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

    describe("and a chain is passed", (): void => {
      it("calls `Wallet.calculateBalance`", (): void => {
        const calculateBalanceMock = jest.fn();

        const originalCalculateBalance = Wallet.calculateBalance;

        Wallet.calculateBalance = calculateBalanceMock as any;

        wallet.createTransaction({
          recipient: "foo",
          amount: 10,
          chain: new Blockchain().chain,
        });

        expect(calculateBalanceMock).toHaveBeenCalled();

        Wallet.calculateBalance = originalCalculateBalance;
      });
    });
  });

  describe("calculateBalance()", (): void => {
    let blockchain: Blockchain;

    beforeEach((): void => {
      blockchain = new Blockchain();
    });

    describe("and there are no outputs for the wallet", (): void => {
      it("returns the `STARTING_BALANCE`", (): void => {
        expect(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          })
        ).toEqual(STARTING_BALANCE);
      });
    });

    describe("and there are outputs for the wallet", (): void => {
      let transactionOne: Transaction, transactionTwo: Transaction;

      beforeEach((): void => {
        transactionOne = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 50,
        });

        transactionTwo = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 60,
        });

        blockchain.addBlock({ data: [transactionOne as any, transactionTwo as any] });
      });

      it("adds the sum of all outputs to the wallet balance", (): void => {
        expect(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          })
        ).toEqual(
          STARTING_BALANCE +
            (transactionOne.outputMap as ObjectI)[wallet.publicKey] +
            (transactionTwo.outputMap as ObjectI)[wallet.publicKey]
        );
      });

      describe("and the wallet has made a transaction", (): void => {
        let recentTransaction: Transaction;

        beforeEach(() => {
          recentTransaction = wallet.createTransaction({
            recipient: "foo-address",
            amount: 30,
          });

          blockchain.addBlock({ data: [recentTransaction as any] });
        });

        it("returns the output amount of the recent transaction", (): void => {
          expect(
            Wallet.calculateBalance({
              chain: blockchain.chain,
              address: wallet.publicKey,
            })
          ).toEqual((recentTransaction.outputMap as ObjectI)[wallet.publicKey]);
        });

        describe("and there are outputs next to and after the recent transaction", (): void => {
          let sameBlockTransaction: Transaction, nextBlockTransaction: Transaction;

          beforeEach((): void => {
            recentTransaction = wallet.createTransaction({
              recipient: "later-foo-address",
              amount: 60,
            });

            sameBlockTransaction = Transaction.rewardTransaction({ minerWallet: wallet });

            blockchain.addBlock({ data: [recentTransaction, sameBlockTransaction] as any });

            nextBlockTransaction = new Wallet().createTransaction({
              recipient: wallet.publicKey,
              amount: 75,
            });

            blockchain.addBlock({ data: [nextBlockTransaction as any] });
          });

          it("includes the output amounts in the returned balance", (): void => {
            expect(
              Wallet.calculateBalance({
                chain: blockchain.chain,
                address: wallet.publicKey,
              })
            ).toEqual(
              (recentTransaction.outputMap as ObjectI)[wallet.publicKey] +
                (sameBlockTransaction.outputMap as ObjectI)[wallet.publicKey] +
                (nextBlockTransaction.outputMap as ObjectI)[wallet.publicKey]
            );
          });
        });
      });
    });
  });
});
