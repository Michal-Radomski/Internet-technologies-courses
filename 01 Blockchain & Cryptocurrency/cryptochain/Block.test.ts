import { describe, expect, it } from "@jest/globals";
import hexToBinary from "hex-to-binary";

import Block from "./Block";
import { GENESIS_DATA, MINE_RATE } from "./config";
import cryptoHash from "./crypto-hash";

//* current value === expected value!
describe("Block", (): void => {
  const timestamp = 2000;
  const lastHash = "foo-hash";
  const hash = "bar-hash";
  const data = ["blockchain", "data"];
  const nonce: number = 1;
  const difficulty: number = 1;
  const block: Block = new Block({ timestamp, lastHash, hash, data, nonce, difficulty });

  it("has a timestamp, lastHash, hash, and a data property", (): void => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.nonce).toEqual(nonce);
    expect(block.difficulty).toEqual(difficulty);
  });

  describe("genesis()", (): void => {
    const genesisBlock: Block = Block.genesis();

    it("returns a Block instance", (): void => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it("returns the genesis data", (): void => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });

    // console.log("genesisBlock:", genesisBlock);
  });

  describe("mineBlock()", (): void => {
    const lastBlock: Block = Block.genesis();
    const data = "mined data";
    const minedBlock: Block = Block.mineBlock({ lastBlock, data });

    it("returns a Block instance", (): void => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it("sets the `lastHash` to be the `hash` of the lastBlock", (): void => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it("sets the `data`", (): void => {
      expect(minedBlock.data).toEqual(data);
    });

    it("sets a `timestamp`", (): void => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it("creates a SHA-256 `hash` based on the proper inputs", (): void => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(minedBlock.timestamp, minedBlock.nonce, minedBlock.difficulty, lastBlock.hash, data)
      );
    });

    it("sets a `hash` that matches the difficulty criteria", (): void => {
      expect(hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)).toEqual("0".repeat(minedBlock.difficulty));
    });

    it("adjusts the difficulty", (): void => {
      const possibleResults = [lastBlock.difficulty + 1, lastBlock.difficulty - 1];

      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
    });
  });

  describe("adjustDifficulty()", (): void => {
    it("raises the difficulty for a quickly mined block", (): void => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: (block.timestamp as number) + MINE_RATE - 100,
        })
      ).toEqual(block.difficulty + 1);
    });

    it("lowers the difficulty for a slowly mined block", (): void => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: (block.timestamp as number) + MINE_RATE + 100,
        })
      ).toEqual(block.difficulty - 1);
    });

    it("has a lower limit of 1", (): void => {
      block.difficulty = -1;
      expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
    });
  });
});
