import crypto from "crypto";

import { DataI } from "../Interfaces";

const cryptoHash = (...inputs: (DataI | Date | string | number)[]): string => {
  // console.log("inputs:", inputs);

  const hash: crypto.Hash = crypto.createHash("sha256");
  // console.log("hash:", hash);

  // hash.update(inputs.sort().join(" "));
  hash.update(
    inputs
      .map((input) => JSON.stringify(input))
      .sort()
      .join(" ")
  );

  return hash.digest("hex");
};

export default cryptoHash;
