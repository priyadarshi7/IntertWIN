import React, { useState } from 'react';
import axios from 'axios';

const Sell = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const newProject = { title, description, price };

    axios.post('http://localhost:5000/api/projects/create', newProject)
      .then(response => {
        console.log('Project created:', response.data);
      })
      .catch(error => {
        console.error('Error creating project:', error);
      });
  };

  return (
    <div>
      <h2>Sell a Project</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        <input type="number" placeholder="Price (ETH)" value={price} onChange={(e) => setPrice(e.target.value)} required />
        <button type="submit">Sell Project</button>
      </form>
    </div>
  );
};

export default Sell;
