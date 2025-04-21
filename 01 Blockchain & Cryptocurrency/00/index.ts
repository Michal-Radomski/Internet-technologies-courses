import { createHash } from "crypto";

/**
 * Returns the SHA256 hash of the given string in hexadecimal format.
 * @param content - The input string to hash.
 * @returns The SHA256 hash as a hex string.
 */
const sha256 = (content: string): string => {
  const str: string = createHash("sha256").update(content).digest("hex");
  return str;
};

// Example usage:
const hash: string = sha256("Hello, World!");
console.log("hash:", hash);

//* BlockChain
const lightingChain = (data: string) => {
  return data + "*";
};

class Block {
  data: string;
  hash: string;
  lastHash: string;
  constructor(data: string, hash: string, lastHash: string) {
    this.data = data;
    this.hash = hash;
    this.lastHash = lastHash;
  }
}

class BlockChain {
  chain: Block[];
  constructor() {
    const genesis: Block = new Block("gen-data", "gen-hash", "gen-lastHash");
    this.chain = [genesis];
  }

  addBlock(data: string): void {
    const lastHash: string = this.chain[this.chain.length - 1].hash;
    const hash: string = lightingChain(data + lastHash);
    const block: Block = new Block(data, hash, lastHash);
    this.chain.push(block);
  }
}

const fooBlockChain: BlockChain = new BlockChain();
fooBlockChain.addBlock("one");
fooBlockChain.addBlock("two");
fooBlockChain.addBlock("three");
console.log("fooBlockChain:", fooBlockChain);
