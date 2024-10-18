import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import MarketplaceABI from '../abis/Marketplace.json';  // ABI generated from contract compilation

const ProjectDetails = ({ project }) => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);

  useEffect(() => {
    async function loadBlockchainData() {
      const web3 = new Web3(Web3.givenProvider || 'http://localhost:7545');
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);

      const networkId = await web3.eth.net.getId();
      const networkData = MarketplaceABI.networks[networkId];

      if (networkData) {
        const marketplace = new web3.eth.Contract(MarketplaceABI.abi, networkData.address);
        setContract(marketplace);
      } else {
        window.alert('Marketplace contract not deployed to detected network.');
      }
    }
    loadBlockchainData();
  }, []);

  const handleBuy = async () => {
    await contract.methods.purchaseProject(project.id).send({
      from: account,
      value: Web3.utils.toWei(project.price, 'ether'),
    });
  };

  return (
    <div>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <p>Price: {project.price} ETH</p>
      <button onClick={handleBuy}>Buy Project</button>
    </div>
  );
};

export default ProjectDetails;

