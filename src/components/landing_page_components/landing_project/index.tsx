import React from "react";
import styles from "./styles.module.css";
import ProjectCard from "../project-card";
import { getProjects } from "@/app/actions";

const LandingProject = async () => {
  // PostgreSQL에서 프로젝트 데이터 직접 가져오기
  const projects = await getProjects();

  return (
    <div className={styles.main}>
      <div>
        <h1 className={styles.title}>Project</h1>
      </div>
      <div className={styles.items}>
        {projects.map((item) => (
          <ProjectCard
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description || ""} // null 처리
            image={item.image}
          />
        ))}
      </div>
    </div>
  );
};

export default LandingProject;
