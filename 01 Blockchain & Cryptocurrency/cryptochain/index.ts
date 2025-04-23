import hexToBinary from "hex-to-binary";

import Block from "./Block";
import Blockchain from "./Blockchain";

const block: Block = new Block({ timestamp: Date.now(), lastHash: "lastHash", hash: "hash", data: ["data"] });
console.log("block:", block);

const blockchain: Blockchain = new Blockchain();
blockchain.addBlock({ data: "Data_1" });
blockchain.addBlock({ data: "Data_2" });
blockchain.addBlock({ data: "Data_3" });
console.log("blockchain:", blockchain);

const hexString: string = "AF30B"; //* 717579
console.log("hexToBinary(hexString):", hexToBinary(hexString)); //* 10101111001100001011 -> dec: 717579

//* Reminder
// const obj1 = { a: 1 };
// const obj2 = { a: 1 };
// console.log("obj1 === obj2:", obj1 === obj2); // false
// console.log("JSON.stringify(obj1) === JSON.stringify(obj2):", JSON.stringify(obj1) === JSON.stringify(obj2)); // true

// const obj3 = obj1;
// console.log("obj1 === obj3:", obj1 === obj3); // true

// const mood = "Happy! ";
// console.log(`I feel ${mood.repeat(3)}`); // Expected output: "I feel Happy! Happy! Happy!"
