import crypto from "crypto";

const cryptoHash = (...inputs: (string | number)[]): string => {
  // console.log("inputs:", inputs);

  const hash: crypto.Hash = crypto.createHash("sha256");
  // console.log("hash:", hash);

  hash.update(inputs.sort().join(" "));

  return hash.digest("hex");
};

export default cryptoHash;
