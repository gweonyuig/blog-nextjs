import React from "react";
import styles from "./page.module.css";
import { getPost, getCategories } from "@/app/actions";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import "@/styles/markdown.css";

// 반환 타입을 명시적으로 지정하는 것이 좋습니다
const getPostId = async (category: string, id: string) => {
  try {
    // id를 숫자로 변환하여 비교
    const numId = parseInt(id, 10);
    if (isNaN(numId)) {
      return null;
    }
    const postData = await getPost(numId);
    const categories = await getCategories();

    // 데이터 구조 확인
    if (!categories || !postData) {
      return null;
    }

    // categories 배열에서 일치하는 카테고리 찾기
    const categoryObj = categories.find(
      (cat) => cat.key && cat.key.toLowerCase() === category.toLowerCase()
    );

    if (!categoryObj) {
      return null;
    }

    // posts 배열에서 카테고리ID와 포스트ID가 모두 일치하는 게시물 찾기
    const post = postData;

    return post;
  } catch (error) {
    throw error;
  }
};

// Next.js의 페이지 컴포넌트 규칙에 맞게 수정하는 것이 좋습니다
interface PageProps {
  params: Promise<{
    category: string;
    id: string;
  }>;
}

// Next.js 페이지 컴포넌트로 수정
const Page = async ({ params }: PageProps) => {
  // params를 await로 비동기 처리
  const { category, id } = await params;
  const post = await getPostId(category, id);

  if (!post) {
    return <div className={styles.main}>Post not found</div>;
  }

  /* 
  날짜 포맷 변환 함수 
  React가 Date 객체를 직접 렌더링할 수 없기 때문에 발생했습니다.
  */
  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // post 내용 조건부 렌더링으로 안전하게 처리
  return (
    <div className={styles.main}>
      <div className={styles.intro}>
        <h1>{post.title}</h1>
        {post.date && <div>{formatDate(post.date)}</div>}
        {post.description && <div>{post.description}</div>}
      </div>
      <div className={styles.content}>
        {post.contents ? (
          <MarkdownRenderer content={post.contents} />
        ) : (
          <div>내용이 없습니다</div>
        )}
      </div>
    </div>
  );
};

export default Page;
