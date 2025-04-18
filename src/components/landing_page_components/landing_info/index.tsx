import styles from "./styles.module.css";
import Image from "next/image";
import ProfileInfo from "../profile_info";
import { getAboutMe } from "@/app/actions";

const LandingMain = async () => {
  // PostgreSQL에서 데이터 가져오기
  const aboutMeItems = await getAboutMe();

  return (
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
          {aboutMeItems.map((item) => (
            <ProfileInfo
              key={item.id}
              title={item.title}
              description={item.description}
              iconImg={item.iconImg}
            />
          ))}
        </div>
      </div>
    </main>
  );
};
export default LandingMain;
