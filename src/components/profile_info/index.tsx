import React from "react";
import styles from "./styles.module.css";
import Image from "next/image";

interface ProfileInfoProps {
  title: string;
  description: string;
  iconImg: string;
}

const ProfileInfo = (props: ProfileInfoProps) => (
  <div className={styles.container}>
    <div className={styles.profileImg}>
      <Image
        className={styles.image}
        src={props.iconImg}
        alt="no-image"
        width={45}
        height={45}
      />
      <div className={styles.description}>
        <h4>{props.title}</h4>
        <div>{props.description}</div>
      </div>
    </div>
  </div>
);

export default ProfileInfo;
