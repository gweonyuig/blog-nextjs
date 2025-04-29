import styles from "./page.module.css";
import LandingInfo from "@/components/landing_page_components/landing_info";
import LandingProject from "@/components/landing_page_components/landing_project";
import LandingBlog from "@/components/landing_page_components/landing_blog";

export default function Home() {
  const page: number = 5;
  return (
    <div className={styles.page}>
      <LandingInfo />
      <LandingProject />
      <LandingBlog page={page} />
    </div>
  );
}
