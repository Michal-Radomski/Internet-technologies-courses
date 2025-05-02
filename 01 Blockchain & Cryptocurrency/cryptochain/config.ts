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

const STARTING_BALANCE = 1000;

const REWARD_INPUT = { address: "*authorized-reward*" };

const MINING_REWARD = 50;

export { GENESIS_DATA, MINE_RATE, STARTING_BALANCE, REWARD_INPUT, MINING_REWARD };
