import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import NFTMarketplaceContract from "./contracts/NFTMarketplace.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { storageValue: "Loading...", web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        NFTMarketplaceContract.abi,
        deployedNetwork && "0x635FA71793EB8d6f2f71D88560096805448a8E4C",
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    // await contract.methods.set(89).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.symbol().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };

  checkPlayed = async () => {
    const { accounts, contract } = this.state;

    const ip = document.querySelector(".check-played").value;
    const response = await contract.methods.getNftUsage(ip).call();
    const op = document.querySelector(".check-played-result");
    op.innerHTML =response;
  };

  registerPlayed = async () => {
    const { accounts, contract } = this.state;

    const ip = document.querySelector(".register-played").value;
    const response = await contract.methods.useNFT(ip).send({ from: accounts[0] });
    const op = document.querySelector(".check-played-result");
    op.innerHTML =response;
  };

  holdNFT = async () => {
    const { accounts, contract } = this.state;

    const ip1 = document.querySelector(".nft-address").value;
    const ip2 = document.querySelector(".user-address").value;
    const response = await contract.methods.checkNFTowner(ip1,ip2).call();
    const op = document.querySelector(".holdNFT-result");
    op.innerHTML = response;
  };

  

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Admin Dashboard {this.state.storageValue}</h1>
        <div>
          <h2>Check contests played:</h2>
          <input type="text" className="check-played" placeholder="tokenID"></input>
          <button type="submit" onClick={this.checkPlayed}>Submit</button>
          <p className="check-played-result"></p>
        </div>
        <div>
          <h2>Register use of NFT for contest:</h2>
          <input type="text" className="register-played" placeholder="tokenID"></input>
          <button type="submit" onClick={this.registerPlayed}>Submit</button>
          <p className="register-played-result"></p>
        </div>
        <div>
          <h2>Check if user holds NFT</h2>
          <input type="text" className="nft-address" placeholder="NFT address"></input>
          <input type="text" className="user-address" placeholder="User address"></input>
          <button type="submit" onClick={this.holdNFT}>Submit</button>
          <p className="holdNFT-result"></p>
        </div>
      </div>
    );
  }
}

export default App;
