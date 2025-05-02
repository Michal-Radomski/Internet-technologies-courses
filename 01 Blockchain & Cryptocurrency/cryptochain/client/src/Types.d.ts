declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}
declare module "*.svg" {
  const value: string;
  export default value;
}

interface ObjectI {
  [key: string]: any;
}

interface TransactionI {
  id: string;
  input: {
    address: string;
    amount: number;
  };
  outputMap: { [key: string]: ObjectI };
}

interface BlockI {
  data?: any;
  timestamp?: number;
  hash?: string;
}
