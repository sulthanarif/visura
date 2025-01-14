// src/components/organisms/UploadBox/ProjectInput.js
import React from "react";
import Icon from "../../atoms/Icon";
import Input from "../../atoms/Input";

function ProjectInput({ projectName, setProjectName }) {
  return (
    <div className="title-container" id="titleContainer">
      <h2>
        <Icon name="folder" />
        Name of Project
      </h2>
      <Input
        placeholder="Enter project name"
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
    </div>
  );
}

export default ProjectInput;