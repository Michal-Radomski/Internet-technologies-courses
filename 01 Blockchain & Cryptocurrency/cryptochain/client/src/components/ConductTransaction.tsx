import React from "react";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import { Link, withRouter } from "react-router-dom";

class ConductTransaction extends React.Component<{ history: string[] }> {
  state = { recipient: "", amount: 0, knownAddresses: [] as string[] };

  componentDidMount(): void {
    fetch("http://localhost:3000/api/known-addresses")
      .then((response) => response.json())
      .then((json) => this.setState({ knownAddresses: json }));
  }

  updateRecipient = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ recipient: event.target.value });
  };

  updateAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ amount: Number(event.target.value) });
  };

  conductTransaction = (): void => {
    const { recipient, amount } = this.state;

    fetch("http://localhost:3000/api/transact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient, amount }),
    })
      .then((response) => response.json())
      .then((json) => {
        alert(json.message || json.type);
        this.props.history.push("/transaction-pool");
      });
  };

  render() {
    return (
      <div className="ConductTransaction">
        <Link to="/">Home</Link>
        <h3>Conduct a Transaction</h3>
        <br />
        <h4>Known Addresses</h4>
        {this.state.knownAddresses.map((knownAddress: string) => {
          return (
            <div key={knownAddress}>
              <div>{knownAddress}</div>
              <br />
            </div>
          );
        })}
        <br />
        <FormGroup>
          <FormControl type="text" placeholder="recipient" value={this.state.recipient} onChange={this.updateRecipient} />
        </FormGroup>
        <FormGroup>
          <FormControl type="number" placeholder="amount" value={this.state.amount} onChange={this.updateAmount} />
        </FormGroup>
        <div>
          <Button variant="danger" onClick={this.conductTransaction}>
            Submit
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(ConductTransaction as any);
