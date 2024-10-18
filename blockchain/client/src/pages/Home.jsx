import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProjectList from '../components/ProjectList';

const Home = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then(response => {
        setProjects(response.data);
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
      });
  }, []);

  return (
    <div>
      <h2>Available Projects</h2>
      <ProjectList projects={projects} />
    </div>
  );
};

export default Home;
