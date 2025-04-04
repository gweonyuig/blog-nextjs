import React from "react";
import styles from "./page.module.css";
import { getBlogs } from "@/app/actions";

// 반환 타입을 명시적으로 지정하는 것이 좋습니다
const getPost = async (category: string, id: string) => {
  const blogData = await getBlogs();
  // 문자열 category가 blogData의 키로 존재하는지 확인
  if (!blogData[category as keyof typeof blogData]) {
    return null;
  }
  // id를 숫자로 변환하여 비교
  const numId = parseInt(id, 10);
  // NaN 체크가 필요합니다
  if (isNaN(numId)) {
    return null;
  }

  const post = blogData[category as keyof typeof blogData].post.find(
    (item) => item.id === numId
  );
  return post;
};

// Next.js의 페이지 컴포넌트 규칙에 맞게 수정하는 것이 좋습니다
interface PageProps {
  params: {
    category: string;
    id: string;
  };
}

// Next.js 페이지 컴포넌트로 수정
const Page = async ({ params }: PageProps) => {
  const { category, id } = params;
  const post = await getPost(category, id);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className={styles.main}>
      <div className={styles.intro}>
        <h1>{post.title}</h1>
        <div>{post.date}</div>
        <div>{post.description}</div>
      </div>
      <div className={styles.content}>{post.contents}</div>
    </div>
  );
};

export default Page;
