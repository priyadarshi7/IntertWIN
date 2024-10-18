import React from 'react';
import ProjectDetails from './ProjectDetails';

const ProjectList = ({ projects }) => {
  return (
    <div>
      {projects.map(project => (
        <ProjectDetails key={project._id} project={project} />
      ))}
    </div>
  );
};

export default ProjectList;
