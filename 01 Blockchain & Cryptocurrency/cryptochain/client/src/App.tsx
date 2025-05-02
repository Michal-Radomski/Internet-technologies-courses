// Todo: fix the router!

import React from "react";
import { Link } from "react-router-dom";

import logo from "./assets/logo.png";
import "./App.scss";
import { ObjectI } from "../../Interfaces";

class App extends React.Component {
  state = { walletInfo: {} as ObjectI };

  componentDidMount(): void {
    fetch("http://localhost:3000/api/wallet-info")
      .then((response) => response.json())
      .then((json) => this.setState({ walletInfo: json }));
  }

  render(): React.JSX.Element {
    const { address, balance } = this.state.walletInfo;

    return (
      <div className="App">
        <img className="logo" src={logo} width={"auto"} height={"auto"} />
        <br />
        <div>Welcome to the blockchain...</div>
        <br />
        <div>
          <Link to="/blocks">Blocks</Link>
        </div>
        <div>
          <Link to="/conduct-transaction">Conduct a Transaction</Link>
        </div>
        <div>
          <Link to="/transaction-pool">Transaction Pool</Link>
        </div>
        <br />
        <div className="WalletInfo">
          <div>Address: {address}</div>
          <div>Balance: {balance}</div>
        </div>
      </div>
    );
  }
}

export default App;
