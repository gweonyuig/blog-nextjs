"use client";
import React from "react";
import styles from "./page.module.css";
import LandingBlog from "@/components/landing_page_components/landing_blog";

const BlogPage = () => {
  const page: number = 10;
  return (
    <div className={styles.container}>
      <div className={styles.component}>
        <LandingBlog page={page} />
      </div>
    </div>
  );
};

export default BlogPage;
