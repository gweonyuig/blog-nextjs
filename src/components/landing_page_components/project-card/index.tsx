import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import Link from "next/link";

interface ProjectsProps {
  id: number; // Changed key to id
  title: string;
  description: string;
  image: string;
}

const ProjectCard = (props: ProjectsProps) => (
  <div className={styles.main}>
    <Link href={`/project/${props.id}`}>
      {" "}
      {/* Updated key to id */}
      <Image
        className={styles.projectImg}
        src={props.image}
        alt="no-image"
        width={350}
        height={250}
      />
    </Link>
    <div className={styles.projectInfo}>
      <Link href={`/project/${props.id}`}>
        {" "}
        {/* Updated key to id */}
        <div>
          <h3 className={styles.projectTitle}>{props.title}</h3>
          <p className={styles.projectDescription}>{props.description}</p>
        </div>
      </Link>
      <div className={styles.projectLink}>
        <Link href="https://github.com/gweonyuig">Github</Link>
      </div>
    </div>
  </div>
);

export default ProjectCard;
