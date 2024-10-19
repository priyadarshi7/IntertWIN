// src/components/ProjectDetail.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { initWeb3, marketplaceContract } from '../utils/web3';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [account, setAccount] = useState('');

  useEffect(() => {
    const loadProject = async () => {
      await initWeb3();
      // Fetch project data from the smart contract
      // Assume you have a function to fetch project details by ID
      const data = await marketplaceContract.methods.projects(id).call();
      setProject(data);

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      setAccount(accounts[0]);
    };

    loadProject();
  }, [id]);

  const buyProject = async () => {
    try {
      await marketplaceContract.methods.purchaseProject(project.id).send({
        from: account,
        value: project.price,
      });
      alert('Purchase successful!');
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  return (
    <div>
      {project ? (
        <>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
          <p>Price: {project.price} Wei</p>
          <button onClick={buyProject}>Buy Project</button>
        </>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>
  );
};

export default ProjectDetail;
