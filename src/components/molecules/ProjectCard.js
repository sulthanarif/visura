// src/components/molecules/ProjectCard.js
import React from 'react';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 dark:bg-gray-800">
      <h2 className="text-xl font-semibold mb-2 dark:text-white">{project.projectName}</h2>
    </div>
  );
};

export default ProjectCard;