"use client";

import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import Link from "next/link";
import { getBlogs } from "@/app/actions";

interface CategoryData {
  title: string;
  post: BlogItem[];
}

interface BlogItem {
  id: number;
  title: string;
  description: string;
  date: string;
}

interface BlogData {
  react: CategoryData;
  typescript: CategoryData;
  setting: CategoryData;
}

// 'category'를 위한 타입 정의 추가
type CategoryKey = keyof BlogData;

const LandingBlog = () => {
  const [data, setData] = useState<BlogData | null>(null);
  const [category, setCategory] = useState<CategoryKey>("react");
  // 페이지네이션을 위한 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      const blogData = await getBlogs();
      setData(blogData);
    };

    fetchData();
  }, []);

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
    if (!data) return [];

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data[category]?.post.slice(startIndex, endIndex);
  };

  // 총 페이지 수 계산
  const totalPages = data
    ? Math.ceil(data[category]?.post.length / itemsPerPage)
    : 0;

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Blog</h1>
      <div className={styles.container}>
        <div className={styles.categories}>
          <h2
            className={
              category === "react" ? styles.activeCategory : styles.category
            }
            onClick={() => handleCategoryClick("react")}
          >
            React
          </h2>
          <h2
            className={
              category === "typescript"
                ? styles.activeCategory
                : styles.category
            }
            onClick={() => handleCategoryClick("typescript")}
          >
            Typescript
          </h2>
          <h2
            className={
              category === "setting" ? styles.activeCategory : styles.category
            }
            onClick={() => handleCategoryClick("setting")}
          >
            Setting
          </h2>
        </div>
        <div className={styles.items}>
          {!data ? (
            <div className={styles.loading}>Loading blogs...</div>
          ) : (
            <>
              {getCurrentItems().map((item, key) => (
                <div
                  key={key}
                  className={styles.item}
                >
                  <Link href={`/post/${item.id}`}>
                    <h2>{item.title}</h2>
                    <p>{item.description}</p>
                  </Link>
                  <p>{item.date}</p>
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
