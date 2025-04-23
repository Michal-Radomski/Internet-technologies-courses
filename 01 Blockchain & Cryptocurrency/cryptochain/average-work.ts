import Block from "./Block";
import Blockchain from "./Blockchain";

const blockchain: Blockchain = new Blockchain();

blockchain.addBlock({ data: "initial" });
console.log("first block", blockchain.chain[blockchain.chain.length - 1]);

let prevTimestamp: number, nextTimestamp: number, nextBlock: Block, timeDiff: number, average: number;

const times = [] as number[];

for (let i = 0; i < 10000; i++) {
  prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp as number;

  blockchain.addBlock({ data: `block: ${i}` });
  nextBlock = blockchain.chain[blockchain.chain.length - 1];

  nextTimestamp = nextBlock.timestamp as number;
  timeDiff = nextTimestamp - prevTimestamp;
  times.push(timeDiff);

  average = times.reduce((total: number, num: number) => total + num, 0) / times.length;
  console.log({ i }, `Time to mine block: ${timeDiff}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${average}ms`);
}
