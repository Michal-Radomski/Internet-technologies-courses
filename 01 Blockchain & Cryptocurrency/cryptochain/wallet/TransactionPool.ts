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

  existingTransaction({ inputAddress }: { inputAddress: string }): Transaction {
    const transactions = Object.values(this.transactionMap) as Transaction[];
    // console.log("transactions:", transactions);

    return transactions.find((transaction: Transaction) => transaction.input.address === inputAddress) as Transaction;
  }
}

export default TransactionPool;
