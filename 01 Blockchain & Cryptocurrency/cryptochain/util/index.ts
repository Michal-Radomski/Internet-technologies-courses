import { ec as EC } from "elliptic"; //* CommonJS: const EC = require('elliptic').ec;

import { DataI } from "../Interfaces";
import cryptoHash from "./crypto-hash";

export const ec: EC = new EC("secp256k1"); //* Used by Bitcoin
// console.log("ec:", ec);

const verifySignature = ({
  publicKey,
  data,
  signature,
}: {
  publicKey: string;
  data: DataI;
  signature: EC.Signature;
}): boolean => {
  const keyFromPublic: EC.KeyPair = ec.keyFromPublic(publicKey, "hex");
  // console.log("JSON.stringify(keyFromPublic):", JSON.stringify(keyFromPublic));

  return keyFromPublic.verify(cryptoHash(data), signature);
};

export default verifySignature;
