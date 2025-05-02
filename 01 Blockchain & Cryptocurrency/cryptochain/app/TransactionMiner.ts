import { DataI, ObjectI } from "./../Interfaces.d";
import Blockchain from "../blockchain/Blockchain";
import Transaction from "../wallet/Transaction";
import TransactionPool from "../wallet/TransactionPool";
import Wallet from "../wallet/Wallet";
import PubSub from "./Pubsub";

class TransactionMiner {
  blockchain: Blockchain;
  transactionPool: TransactionPool;
  wallet: Wallet;
  pubsub: PubSub;
  constructor({
    blockchain,
    transactionPool,
    wallet,
    pubsub,
  }: {
    blockchain: Blockchain;
    transactionPool: TransactionPool;
    wallet: Wallet;
    pubsub: PubSub;
  }) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubsub = pubsub;
  }

  mineTransactions(): void {
    const validTransactions: ObjectI = this.transactionPool.validTransactions();

    validTransactions.push(Transaction.rewardTransaction({ minerWallet: this.wallet }));

    this.blockchain.addBlock({ data: validTransactions as unknown as DataI });

    this.pubsub.broadcastChain();

    this.transactionPool.clear();
  }
}

export default TransactionMiner;
