import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Mock, UnknownFunction } from "jest-mock";

import Blockchain from "./Blockchain";
import Block from "./Block";
import { DataI } from "../Interfaces";
import cryptoHash from "../util/crypto-hash";

describe("Blockchain", (): void => {
  let blockchain: Blockchain, newChain: Blockchain, originalChain: Block[];

  beforeEach((): void => {
    blockchain = new Blockchain();
    newChain = new Blockchain();

    originalChain = blockchain.chain as Block[];
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
    let errorMock: Mock<UnknownFunction>, logMock: Mock<UnknownFunction>;

    beforeEach((): void => {
      errorMock = jest.fn();
      logMock = jest.fn();

      global.console.error = errorMock;
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
  });
});
