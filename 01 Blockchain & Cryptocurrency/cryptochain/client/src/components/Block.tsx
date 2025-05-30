import React from "react";
import { Button } from "react-bootstrap";

import Transaction from "./Transaction";

class Block extends React.Component<{ block: BlockI }> {
  state = { displayTransaction: false };

  toggleTransaction = (): void => {
    this.setState({ displayTransaction: !this.state.displayTransaction });
  };

  get displayTransaction(): React.JSX.Element {
    const { data } = this.props.block;

    const stringifiedData: string = JSON.stringify(data);

    const dataDisplay = stringifiedData.length > 35 ? `${stringifiedData.substring(0, 35)}...` : stringifiedData;

    if (this.state.displayTransaction) {
      return (
        <div>
          {data.map((transaction: TransactionI) => (
            <div key={transaction.id}>
              <hr />
              <Transaction transaction={transaction} />
            </div>
          ))}
          <br />
          <Button variant="danger" size="sm" onClick={this.toggleTransaction}>
            Show Less
          </Button>
        </div>
      );
    }

    return (
      <div>
        <div>Data: {dataDisplay}</div>
        <Button variant="danger" size="sm" onClick={this.toggleTransaction}>
          Show More
        </Button>
      </div>
    );
  }

  render(): React.JSX.Element {
    const { timestamp, hash } = this.props.block;

    const hashDisplay = `${hash?.substring(0, 15)}...`;

    return (
      <div className="Block">
        <div>Hash: {hashDisplay}</div>
        <div>Timestamp: {new Date(timestamp!).toLocaleString()}</div>
        {this.displayTransaction}
      </div>
    );
  }
}

export default Block;
