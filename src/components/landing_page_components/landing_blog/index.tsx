"use client";

import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Link from "next/link";
import { getBlogs } from "@/app/actions";

// Prisma 모델에 맞게 인터페이스 수정
interface Category {
  id: number; // Int @id @default(autoincrement()) 필드에 대응
  key: string; // String @unique 필드에 대응
  title: string; // String 필드에 대응
  posts?: Post[]; // Post[] 관계에 대응 - API 응답에 포함되지 않을 수 있으므로 선택적으로 변경
}

interface Post {
  id: number; // Int @id @default(autoincrement()) 필드에 대응
  title: string; // String 필드에 대응
  description: string | null; // String? (옵셔널) 필드에 대응
  date: string; // DateTime 필드가 문자열로 변환됨
  contents: string; // String @db.Text 필드에 대응
  categoryId: number; // Int 필드에 대응
  category: Category; // Category @relation 관계에 대응
}

// 카테고리 키 타입 정의
type CategoryKey = string;

const LandingBlog = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState<CategoryKey>("react");
  // 페이지네이션을 위한 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // useRef를 사용하여 초기 마운트 상태 추적
  const initialMount = React.useRef(true);
  // 초기 카테고리를 저장할 ref
  const initialCategory = React.useRef(category);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getBlogs();

        // 카테고리 목록 설정
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);

          // 초기 마운트시에만 카테고리 설정
          if (initialMount.current) {
            // 카테고리가 설정되지 않았거나 존재하지 않는 경우에만 첫 번째 카테고리로 설정
            const validCategory = data.categories.find(
              (c) => c.key === initialCategory.current
            );
            if (!validCategory && data.categories[0]) {
              setCategory(data.categories[0].key);
            }
            initialMount.current = false;
          }
        }

        // 포스트 설정
        if (data.posts) {
          setPosts(data.posts);
        }
      } catch (error) {
        // console.error("블로그 데이터를 가져오는 중 오류 발생:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // 의존성 배열은 비워 두어 컴포넌트 마운트 시에만 실행

  // 선택된 카테고리의 포스트만 필터링
  const filteredPosts = posts.filter((post) => post.category.key === category);

  // 카테고리 변경 시 1페이지로 리셋
  const handleCategoryClick = (clickedCategory: CategoryKey) => {
    setCategory(clickedCategory);
    setCurrentPage(1);
  };

  // 페이지네이션 관련 함수
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 현재 페이지의 아이템만 필터링
  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPosts.slice(startIndex, endIndex);
  };

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  // 날짜 포맷 변환 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Blog</h1>
      <div className={styles.container}>
        <div className={styles.categories}>
          {categories.map((cat) => (
            <h2
              key={cat.key}
              className={
                category === cat.key ? styles.activeCategory : styles.category
              }
              onClick={() => handleCategoryClick(cat.key)}
            >
              {cat.title}
            </h2>
          ))}
        </div>
        <div className={styles.items}>
          {isLoading ? (
            <div className={styles.loading}>Loading blogs...</div>
          ) : (
            <>
              {getCurrentItems().map((post) => (
                <div
                  key={post.id}
                  className={styles.item}
                >
                  <Link href={`/post/${post.category.key}/${post.id}`}>
                    <h2>{post.title}</h2>
                    <div>{post.description}</div>
                  </Link>
                  <p className={styles.date}>{formatDate(post.date)}</p>
                </div>
              ))}

              {/* 페이지네이션 컨트롤 */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <div
                    onClick={
                      currentPage > 1
                        ? () => handlePageChange(currentPage - 1)
                        : undefined
                    }
                    className={`${styles.arrowButton} ${currentPage === 1 ? styles.disabled : ""}`}
                  >
                    이전
                  </div>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <span
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={
                          currentPage === pageNum
                            ? styles.activePage
                            : styles.pageButton
                        }
                      >
                        {pageNum}
                      </span>
                    )
                  )}

                  <div
                    onClick={
                      currentPage < totalPages
                        ? () => handlePageChange(currentPage + 1)
                        : undefined
                    }
                    className={`${styles.arrowButton} ${currentPage === totalPages ? styles.disabled : ""}`}
                  >
                    다음
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingBlog;
