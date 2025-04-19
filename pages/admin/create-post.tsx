"use client";
import { useState, FormEvent } from "react";
import { GetServerSideProps } from "next";
// import { PrismaClient } from "@prisma/client";
import prisma from "@/lib/prisma";
import { useRouter } from "next/router";
import styles from "./CreatePost.module.css";

interface CreatePostProps {
  categories: {
    id: string;
    key: string;
    title: string;
  }[];
}

export default function CreatePost({ categories }: CreatePostProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title || !description || !content || !categoryId) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      // 데이터 형식 검증 및 디버깅
      const postData = {
        title,
        description,
        contents: content,
        categoryId,
        date: new Date().toISOString(),
      };

      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      // 응답 본문을 텍스트로 먼저 받아서 로깅
      const responseText = await response.text();

      // 텍스트가 비어있지 않은 경우에만 JSON으로 파싱
      const data = responseText ? JSON.parse(responseText) : {};

      if (!response.ok) {
        throw new Error(
          `API 오류 (${response.status}): ${data.message || "포스트 생성에 실패했습니다."}`
        );
      }

      // 성공시 블로그 메인으로 리다이렉트
      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>새 포스트 작성</h1>

      {error && <div className={styles.errorContainer}>{error}</div>}

      <form
        onSubmit={handleSubmit}
        className={styles.form}
      >
        <div className={styles.formGroup}>
          <label className={styles.label}>카테고리</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={styles.select}
            required
          >
            <option value="">카테고리 선택</option>
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.title}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>설명</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>내용 (마크다운)</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            className={styles.textarea}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <button
            type="submit"
            disabled={isSubmitting} // 폼 제출 중일 때 버튼을 비활성화함
            className={styles.button} // CSS 모듈에서 가져온 버튼 스타일 적용
          >
            {isSubmitting ? "저장 중..." : "포스트 저장"}
          </button>
        </div>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  // 서버 사이드에서 실행되는 데이터 페칭 함수 선언
  // const prisma = new PrismaClient(); // Prisma 데이터베이스 클라이언트 인스턴스 생성

  try {
    const categories = await prisma.category.findMany(); // 데이터베이스에서 모든 카테고리 목록 조회

    return {
      props: {
        categories: JSON.parse(JSON.stringify(categories)), // Date 객체 등을 포함한 데이터를 직렬화하기 위해 JSON 변환 후 다시 파싱
      },
    };
  } catch {
    // 데이터베이스 조회 중 오류 발생 시 처리 (매개변수 없이 catch 블록 사용)
    // 매개변수 없이 catch 블록 사용
    return {
      props: {
        categories: [], // 오류 발생 시 빈 카테고리 배열 반환하여 페이지가 에러 없이 렌더링되도록 함
      },
    };
  } finally {
    await prisma.$disconnect(); // Prisma 클라이언트 연결 해제
  }
};
