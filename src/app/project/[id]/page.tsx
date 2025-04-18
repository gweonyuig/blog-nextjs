import React from "react";
import styles from "./page.module.css";
import { getProjects } from "@/app/actions";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import "@/styles/markdown.css";

// 반환 타입을 명시적으로 지정하는 것이 좋습니다
const getPost = async (id: string) => {
  const projectData = await getProjects();
  // 프로젝트 데이터가 존재하는지 확인
  if (!projectData) {
    return null;
  }
  // id를 숫자로 변환하여 비교
  const numId = parseInt(id, 10);
  // NaN 체크가 필요합니다
  if (isNaN(numId)) {
    return null;
  }

  // projectData가 이미 배열이므로 직접 find 메소드 사용
  const post = projectData.find((item) => item.id === numId);
  return post;
};

// Next.js의 페이지 컴포넌트 규칙에 맞게 수정하는 것이 좋습니다
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Next.js 페이지 컴포넌트로 수정
const Page = async ({ params }: PageProps) => {
  // params를 await로 비동기 처리
  // const resolvedParams = await params;
  const { id } = await params;
  const post = await getPost(id);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className={styles.main}>
      <div className={styles.intro}>
        <h1>{post.title}</h1>
        <div>{post.description}</div>
      </div>
      <div className={styles.content}>
        <MarkdownRenderer content={post.contents} />
      </div>
    </div>
  );
};

export default Page;
