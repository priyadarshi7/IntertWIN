// src/components/CreateProject.jsx

import React, { useState } from 'react';
import axios from 'axios';

const CreateProject = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const owner = ''; // Set the project owner (will be the connected user's address)

    try {
      await axios.post('http://localhost:5000/api/projects', { title, description, price, owner });
      alert('Project created successfully!');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create New Project</h2>
      <label>
        Title:
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>
      <label>
        Description:
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
      </label>
      <label>
        Price (in Wei):
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </label>
      <button type="submit">Create Project</button>
    </form>
  );
};

export default CreateProject;
