import Block from "./Block";
import Blockchain from "./Blockchain";

const block: Block = new Block({ timestamp: Date.now(), lastHash: "lastHash", hash: "hash", data: ["data"] });
console.log("block:", block);

const blockchain: Blockchain = new Blockchain();
blockchain.addBlock({ data: "Data_1" });
blockchain.addBlock({ data: "Data_2" });
blockchain.addBlock({ data: "Data_3" });
console.log("blockchain:", blockchain);

//* Reminder
// const obj1 = { a: 1 };
// const obj2 = { a: 1 };
// console.log("obj1 === obj2:", obj1 === obj2); // false
// console.log("JSON.stringify(obj1) === JSON.stringify(obj2):", JSON.stringify(obj1) === JSON.stringify(obj2)); // true

// const obj3 = obj1;
// console.log("obj1 === obj3:", obj1 === obj3); // true
