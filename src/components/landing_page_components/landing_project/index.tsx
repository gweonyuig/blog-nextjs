import React from "react";
import styles from "./styles.module.css";
import ProjectCard from "../project-card";
import { getProjects } from "@/app/actions";

const LandingProject = async () => {
  const response = await getProjects();
  const projects = response.projects;

  return (
    <div className={styles.main}>
      <div>
        <h1 className={styles.title}>Project</h1>
      </div>
      <div className={styles.items}>
        {projects.map((item) => (
          <ProjectCard
            key={item.id} // Changed key to id
            id={item.id}
            title={item.title}
            description={item.description}
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default LandingProject;
