import styles from "./styles.module.css";
import Image from "next/image";
import ProfileInfo from "../profile_info";
import { getAboutMe } from "@/app/actions";

// 타입 정의 추가
interface AboutMeItem {
  title: string;
  description: string;
  iconImg: string;
}

interface AboutMeResponse {
  aboutMe: AboutMeItem[];
}

const LandingMain = async () => {
  // 데이터 구조에 맞게 접근을 수정
  const response: AboutMeResponse = await getAboutMe();
  const aboutMeItems = response.aboutMe;

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
          {aboutMeItems.map((item, index) => (
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
};
export default LandingMain;
