// Todo: fix the interfaces!

export type DataI = string[] | string;

export interface ObjectI {
  [key: string]: any;
}

export interface BlockI {
  timestamp: number | Date | string;
  lastHash: string;
  hash: string;
  data: DataI;
  nonce?: number;
  difficulty?: number;
}

export interface Input {
  timestamp: number;
  amount: number;
  address: string;
  signature: EC.Signature;
}

export interface Output {
  senderWallet: Wallet;
  recipient: string;
  amount: number;
}
