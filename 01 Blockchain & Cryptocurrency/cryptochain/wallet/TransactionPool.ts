import { ObjectI } from "../Interfaces";
import Transaction from "./Transaction";

class TransactionPool {
  transactionMap: {};
  constructor() {
    this.transactionMap = {} as ObjectI;
  }

  setTransaction(transaction: Transaction): void {
    (this.transactionMap as ObjectI)[transaction.id] = transaction;
  }

  setMap(transactionMap: ObjectI): void {
    this.transactionMap = transactionMap;
  }

  existingTransaction({ inputAddress }: { inputAddress: string }): ObjectI {
    const transactions = Object.values(this.transactionMap) as ObjectI[];

    return transactions.find((transaction: ObjectI) => transaction.input.address === inputAddress) as ObjectI;
  }
}

export default TransactionPool;
