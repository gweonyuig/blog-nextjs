import styles from "./page.module.css";
import LandingMain from "@/components/landing_main";

export default function Home() {
  return (
    <div className={styles.page}>
      <LandingMain />
    </div>
  );
}
