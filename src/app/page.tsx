import styles from "./page.module.css";
import LandingInfo from "@/components/landing_info";
import LandingProject from "@/components/landing_project";

export default function Home() {
  return (
    <div className={styles.page}>
      <LandingInfo />
      <LandingProject />
    </div>
  );
}
