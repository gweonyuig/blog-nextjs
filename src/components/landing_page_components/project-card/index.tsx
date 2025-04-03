import React from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import Link from "next/link";

interface ProjectsProps {
  title: string;
  description: string;
  image: string;
}

const ProjectCard = (props: ProjectsProps) => (
  <div className={styles.main}>
    <Image
      className={styles.projectImg}
      src={props.image}
      alt="no-image"
      width={450}
      height={250}
    />
    <div className={styles.projectInfo}>
      <div>
        <h3 className={styles.projectTitle}>{props.title}</h3>
        <p className={styles.projectDescription}>{props.description}</p>
      </div>
      <div className={styles.projectLink}>
        <Link href="https://github.com/gweonyuig">Github</Link>
      </div>
    </div>
  </div>
);

export default ProjectCard;
