import Block from "../blockchain/Block";
import { ObjectI } from "../Interfaces";
import Transaction from "./Transaction";

class TransactionPool {
  transactionMap: {};
  constructor() {
    this.transactionMap = {} as ObjectI;
  }

  clear(): void {
    this.transactionMap = {} as ObjectI;
  }

  validTransactions(): ObjectI {
    return Object.values(this.transactionMap).filter((transaction) =>
      Transaction.validTransaction(transaction as Transaction)
    ) as ObjectI[];
  }

  clearBlockchainTransactions({ chain }: { chain: Block[] }): void {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];

      for (let transaction of block.data) {
        if ((this.transactionMap as ObjectI)[(transaction as unknown as ObjectI).id]) {
          delete (this.transactionMap as ObjectI)[(transaction as unknown as ObjectI).id];
        }
      }
    }
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
