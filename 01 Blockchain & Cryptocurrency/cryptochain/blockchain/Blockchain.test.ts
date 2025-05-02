import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Mock, UnknownFunction } from "jest-mock";

import Blockchain from "./Blockchain";
import Block from "./Block";
import { DataI, ObjectI } from "../Interfaces";
import cryptoHash from "../util/crypto-hash";
import Wallet from "../wallet/Wallet";
import Transaction from "../wallet/Transaction";

describe("Blockchain", (): void => {
  let blockchain: Blockchain, newChain: Blockchain, originalChain: Block[], errorMock: Mock<UnknownFunction>;

  beforeEach((): void => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    errorMock = jest.fn();

    originalChain = blockchain.chain as Block[];
    global.console.error = errorMock;
  });

  //* 1
  it("contains a `chain` Array instance", (): void => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("starts with the genesis block", (): void => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it("adds a new block to the chain", (): void => {
    const newData = "foo bar";
    blockchain.addBlock({ data: newData });

    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  //* 2
  describe("isValidChain()", (): void => {
    describe("when the chain does not start with the genesis block", (): void => {
      it("returns false", (): void => {
        blockchain.chain[0] = { data: "fake-genesis" } as Block;

        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("when the chain starts with the genesis block and has multiple blocks", (): void => {
      beforeEach((): void => {
        blockchain.addBlock({ data: "Bears" });
        blockchain.addBlock({ data: "Beets" });
        blockchain.addBlock({ data: "Battlestar Galactica" });
      });

      describe("and a lastHash reference has changed", (): void => {
        it("returns false", (): void => {
          blockchain.chain[2].lastHash = "broken-lastHash";

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with an invalid field", (): void => {
        it("returns false", (): void => {
          blockchain.chain[2].data = "some-bad-and-evil-data";

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with a jumped difficulty", (): void => {
        it("returns false", (): void => {
          const lastBlock: Block = blockchain.chain[blockchain.chain.length - 1];
          const lastHash: string = lastBlock.hash;
          const timestamp: number = Date.now();
          const nonce: number = 0;
          const data = [] as DataI;
          const difficulty: number = lastBlock.difficulty - 3;

          const hash: string = cryptoHash(timestamp, lastHash, difficulty, nonce, data);

          const badBlock: Block = new Block({
            timestamp,
            lastHash,
            hash,
            nonce,
            difficulty,
            data,
          });

          blockchain.chain.push(badBlock);

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain does not contain any invalid blocks", (): void => {
        it("returns true", (): void => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  //* 3
  describe("replaceChain()", (): void => {
    let logMock: Mock<UnknownFunction>;

    beforeEach((): void => {
      logMock = jest.fn();

      global.console.log = logMock;
    });

    describe("when the new chain is not longer", (): void => {
      beforeEach((): void => {
        newChain.chain[0] = { new: "chain" } as Block;

        blockchain.replaceChain(newChain.chain);
      });

      it("does not replace the chain", (): void => {
        expect(blockchain.chain).toEqual(originalChain);
      });

      it("logs an error", (): void => {
        expect(errorMock).toHaveBeenCalled();
      });
      // console.log("errorMock was fired");
    });

    describe("when the new chain is longer", (): void => {
      beforeEach((): void => {
        newChain.addBlock({ data: "Bears" });
        newChain.addBlock({ data: "Beets" });
        newChain.addBlock({ data: "Battlestar Galactica" });
      });

      describe("and the chain is invalid", (): void => {
        beforeEach((): void => {
          newChain.chain[2].hash = "some-fake-hash";
          blockchain.replaceChain(newChain.chain);
        });

        it("does not replace the chain", (): void => {
          blockchain.replaceChain(newChain.chain);
          expect(blockchain.chain).toEqual(originalChain);
        });

        it("logs an error", (): void => {
          expect(errorMock).toHaveBeenCalled();
        });
        // console.log("errorMock was fired");
      });

      describe("and the chain is valid", (): void => {
        beforeEach((): void => {
          blockchain.replaceChain(newChain.chain);
        });

        it("replaces the chain", (): void => {
          expect(blockchain.chain).toEqual(newChain.chain);
        });

        it("logs about the chain replacement", (): void => {
          expect(logMock).toHaveBeenCalled();
        });
        // console.log("logMock was fired");
      });
    });

    describe("and the `validateTransactions` flag is true", (): void => {
      it("calls validateTransactionData()", (): void => {
        const validateTransactionDataMock = jest.fn();

        blockchain.validTransactionData = validateTransactionDataMock as any;

        newChain.addBlock({ data: "foo" });
        blockchain.replaceChain(newChain.chain, true);

        expect(validateTransactionDataMock).toHaveBeenCalled();
      });
    });
  });

  //* 4
  describe("validTransactionData()", (): void => {
    let transaction: Transaction, rewardTransaction: Transaction, wallet: Wallet;

    beforeEach(() => {
      wallet = new Wallet();
      transaction = wallet.createTransaction({ recipient: "foo-address", amount: 65 });
      rewardTransaction = Transaction.rewardTransaction({ minerWallet: wallet });
    });

    describe("and the transaction data is valid", (): void => {
      it("returns true", (): void => {
        newChain.addBlock({ data: [transaction, rewardTransaction] as any });

        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(true);
        expect(errorMock).not.toHaveBeenCalled();
      });
    });

    describe("and the transaction data has multiple rewards", (): void => {
      it("returns false and logs an error", (): void => {
        newChain.addBlock({ data: [transaction, rewardTransaction, rewardTransaction] as any });

        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("and the transaction data has at least one malformed outputMap", (): void => {
      describe("and the transaction is not a reward transaction", (): void => {
        it("returns false and logs an error", (): void => {
          (transaction.outputMap as ObjectI)[wallet.publicKey] = 999999;

          newChain.addBlock({ data: [transaction, rewardTransaction] as any });

          expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe("and the transaction is a reward transaction", (): void => {
        it("returns false and logs an error", (): void => {
          (rewardTransaction.outputMap as ObjectI)[wallet.publicKey] = 999999;

          newChain.addBlock({ data: [transaction, rewardTransaction] as any });

          expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
          expect(errorMock).toHaveBeenCalled();
        });
      });
    });

    describe("and the transaction data has at least one malformed input", (): void => {
      it("returns false and logs an error", (): void => {
        wallet.balance = 9000;

        const evilOutputMap = {
          [wallet.publicKey]: 8900,
          fooRecipient: 100,
        };

        const evilTransaction = {
          input: {
            timestamp: Date.now(),
            amount: wallet.balance,
            address: wallet.publicKey,
            signature: wallet.sign(evilOutputMap as unknown as DataI),
          },
          outputMap: evilOutputMap,
        };

        newChain.addBlock({ data: [evilTransaction, rewardTransaction] as any });
        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("and a block contains multiple identical transactions", (): void => {
      it("returns false and logs an error", (): void => {
        newChain.addBlock({
          data: [transaction, transaction, transaction, rewardTransaction] as any,
        });

        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(false);
        expect(errorMock).toHaveBeenCalled();
      });
    });
  });
});
