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
  // category 타입을 CategoryKey로 변경
  const [category, setCategory] = useState<CategoryKey>("react");

  useEffect(() => {
    const fetchData = async () => {
      const blogData = await getBlogs();
      setData(blogData);
    };

    fetchData();
  }, []);

  const handleCategoryClick = (clickedCategory: CategoryKey) => {
    setCategory(clickedCategory);
  };

  return (
    <div className={styles.main}>
      <h1>Blog</h1>
      <div className={styles.container}>
        <div className={styles.categories}>
          <h2 onClick={() => handleCategoryClick("react")}>React</h2>
          <h2 onClick={() => handleCategoryClick("typescript")}>Typescript</h2>
          <h2 onClick={() => handleCategoryClick("setting")}>Setting</h2>
        </div>
        <div className={styles.items}>
          {!data ? (
            <div className={styles.loading}>Loading blogs...</div>
          ) : (
            data[category]?.post.map((item, key) => (
              <div
                key={key}
                className={styles.item}
              >
                <Link href={`/blog/${item.id}`}>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                  <p>{item.date}</p>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingBlog;
