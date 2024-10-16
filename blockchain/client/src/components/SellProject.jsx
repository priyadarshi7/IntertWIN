import React, { useState } from 'react';
import Web3 from 'web3';
import MarketplaceABI from '../../../build/contracts/Marketplace.json';  // ABI generated by Truffle

const SellProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSell = async () => {
    const web3 = new Web3(Web3.givenProvider);
    const accounts = await web3.eth.requestAccounts();
    const networkId = await web3.eth.net.getId();
    const marketplaceData = MarketplaceABI.networks[networkId];

    if (marketplaceData) {
      const marketplace = new web3.eth.Contract(MarketplaceABI.abi, marketplaceData.address);

      const priceInWei = web3.utils.toWei(price, 'ether');

      await marketplace.methods.createProject(title, description, priceInWei)
        .send({ from: accounts[0] })
        .on('receipt', (receipt) => {
          console.log('Project successfully listed!', receipt);
          alert('Project successfully listed!');
        })
        .on('error', (error) => {
          console.error('Error listing project:', error);
          alert('Failed to list the project');
        });
    } else {
      alert('Marketplace contract not deployed on this network.');
    }
  };

  return (
    <div>
      <h2>Sell Your Project</h2>
      <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="number" placeholder="Price in ETH" value={price} onChange={(e) => setPrice(e.target.value)} />
      <button onClick={handleSell}>Sell</button>
    </div>
  );
};

export default SellProject;