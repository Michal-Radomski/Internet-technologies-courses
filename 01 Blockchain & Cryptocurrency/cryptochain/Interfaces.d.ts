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
