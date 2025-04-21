import Block from "./Block";

const block1: Block = new Block({ timestamp: Date.now(), lastHash: "lastHash", hash: "hash", data: ["data"] });
console.log("block1:", block1);
