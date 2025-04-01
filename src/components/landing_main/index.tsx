import React from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import ProfileInfo from "../profile_info";

const aboutMe = [
  { title: "Name", description: "권유익", iconImg: "/icons/icon_name.svg" },
  {
    title: "Phone",
    description: "010-1234-5678",
    iconImg: "/icons/icon_phone.svg",
  },
  {
    title: "Email",
    description: "gweonyuig@gmail.com",
    iconImg: "/icons/icon_email.svg",
  },
  {
    title: "Birthday",
    description: "1997-08-01",
    iconImg: "/icons/icon_calendar.svg",
  },
  {
    title: "Location",
    description: "Cheonan, South Korea",
    iconImg: "/icons/icon_location.svg",
  },
  {
    title: "University",
    description: "Sunmoon University",
    iconImg: "/icons/icon_univer.svg",
  },
];

const LandingMain = () => (
  <main className={styles.main}>
    <Image
      className={styles.profileImage}
      src="/bualapha.png"
      alt="no-image"
      width={250}
      height={250}
    />
    <div>
      <h1 className={styles.headerTitle}>Information</h1>
      <div className={styles.description}>
        {aboutMe.map((item, index) => (
          <ProfileInfo
            key={index}
            title={item.title}
            description={item.description}
            iconImg={item.iconImg}
          />
        ))}
      </div>
    </div>
  </main>
);

export default LandingMain;
