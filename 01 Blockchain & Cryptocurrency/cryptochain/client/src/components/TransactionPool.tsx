import React from "react";
import { Button } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";

import Transaction from "./Transaction";

const POLL_INTERVAL_MS = 10000;

class TransactionPool extends React.Component<{ history: string[] }> {
  state = { transactionPoolMap: {} as ObjectI };

  fetchTransactionPoolMap = (): void => {
    fetch("http://localhost:3000/api/transaction-pool-map")
      .then((response) => response.json())
      .then((json) => this.setState({ transactionPoolMap: json }));
  };

  fetchMineTransactions = (): void => {
    fetch("http://localhost:3000/api/mine-transactions").then((response) => {
      if (response.status === 200) {
        alert("success");
        this.props.history.push("/blocks");
      } else {
        alert("The mine-transactions block request did not complete.");
      }
    });
  };
  fetchPoolMapInterval!: NodeJS.Timeout;

  componentDidMount(): void {
    this.fetchTransactionPoolMap();

    this.fetchPoolMapInterval = setInterval(() => this.fetchTransactionPoolMap(), POLL_INTERVAL_MS);
  }

  componentWillUnmount(): void {
    clearInterval(this.fetchPoolMapInterval);
  }

  render() {
    return (
      <div className="TransactionPool">
        <div>
          <Link to="/">Home</Link>
        </div>
        <h3>Transaction Pool</h3>
        {Object.values(this.state.transactionPoolMap).map((transaction) => {
          return (
            <div key={transaction.id}>
              <hr />
              <Transaction transaction={transaction} />
            </div>
          );
        })}
        <hr />
        <Button variant="danger" onClick={this.fetchMineTransactions}>
          Mine the Transactions
        </Button>
      </div>
    );
  }
}

export default withRouter(TransactionPool as any);
