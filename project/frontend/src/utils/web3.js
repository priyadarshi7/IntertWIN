// src/utils/web3.js

import Web3 from 'web3';
import MarketplaceContract from '../artifacts/Marketplace.json';

let web3;
let marketplaceContract;

export const initWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = MarketplaceContract.networks[networkId];
    marketplaceContract = new web3.eth.Contract(
      MarketplaceContract.abi,
      deployedNetwork && deployedNetwork.address,
    );
  } else {
    alert('Please install MetaMask!');
  }
};

export { web3, marketplaceContract };
