import { describe, expect, it } from "@jest/globals";

import Block from "./Block";
import { GENESIS_DATA } from "./config";

describe("Block", (): void => {
  const timestamp = "a-date";
  const lastHash = "foo-hash";
  const hash = "bar-hash";
  const data = ["blockchain", "data"];
  const block = new Block({ timestamp, lastHash, hash, data });

  it("has a timestamp, lastHash, hash, and a data property", (): void => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
  });

  describe("genesis()", (): void => {
    const genesisBlock: Block = Block.genesis();

    it("returns a Block instance", (): void => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it("returns the genesis data", (): void => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });

  describe("mineBlock", (): void => {
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
  });
});
