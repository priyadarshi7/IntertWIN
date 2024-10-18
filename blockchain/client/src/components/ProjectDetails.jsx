import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import MarketplaceABI from '../../../build/contracts/Marketplace.json'; // ABI generated from contract compilation

const ProjectDetails = ({ project }) => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);

          // Get network ID and contract instance
          const networkId = await web3.eth.net.getId();
          const networkData = MarketplaceABI.networks[networkId];

          if (networkData) {
            const marketplace = new web3.eth.Contract(MarketplaceABI.abi, networkData.address);
            setContract(marketplace);
          } else {
            window.alert('Marketplace contract not deployed to detected network.');
          }
        } catch (error) {
          console.error('User denied account access:', error);
        }
      } else {
        alert('Please install MetaMask!');
      }
    };

    loadBlockchainData();
  }, []);

  const handleBuy = async () => {
    // Check if contract is loaded
    if (!contract) {
      console.error('Contract is not loaded.');
      return;
    }

    // Check if project data is valid
    if (!project || !project.id || !project.price) {
      console.error('Project ID or price is missing.');
      return;
    }

    // Log project details for debugging
    console.log('Attempting to purchase project with ID:', project.id);
    console.log('Project price (in ETH):', project.price);

    try {
      // Convert price to Wei
      const priceInWei = Web3.utils.toWei(project.price.toString(), 'ether');

      // Call the purchase method
      await contract.methods.purchaseProject(project.id).send({
        from: account,
        value: priceInWei,
      });

      console.log('Project purchased successfully!');
    } catch (error) {
      console.error('Error purchasing project:', error);
    }
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
