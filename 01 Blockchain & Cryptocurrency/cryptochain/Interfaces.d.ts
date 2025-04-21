export type DataI = string[] | string;

export interface BlockI {
  timestamp: number | Date | string;
  lastHash: string;
  hash: string;
  data: DataI;
}
