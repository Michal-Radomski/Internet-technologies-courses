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
