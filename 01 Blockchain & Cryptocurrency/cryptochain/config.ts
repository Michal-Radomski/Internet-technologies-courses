import { BlockI, DataI } from "./Interfaces";

const MINE_RATE: number = 1000; //* 1s
const INITIAL_DIFFICULTY: number = 3;

const GENESIS_DATA: BlockI = {
  timestamp: 1,
  lastHash: "-----",
  hash: "hash-one",
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  data: [] as DataI,
};

export { GENESIS_DATA, MINE_RATE };
