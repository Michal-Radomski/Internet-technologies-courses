type DataI = string[] | string;

interface BlockI {
  timestamp: number | Date | string;
  lastHash: string;
  hash: string;
  data: DataI;
}
