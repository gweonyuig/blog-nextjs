"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import MarkdownRenderer from "@/components/MarkdownRenderer";
// import { headers } from "next/headers";

interface Category {
  id: number;
  key: string;
  title: string;
}

interface Project {
  id: number;
  title: string;
  description: string | null;
  image: string;
  contents: string;
}

export default function PostingPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    content: "",
    projectId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("카테고리를 불러오는데 실패했습니다.");
        }
        const data = await response.json();
        setCategories(data);
      } catch {
        setError("카테고리를 불러오는데 실패했습니다.");
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("프로젝트를 불러오는데 실패했습니다.");
        }
        const data = await response.json();
        setProjects(data);
      } catch {
        setError("프로젝트를 불러오는데 실패했습니다.");
      }
    };

    fetchCategories();
    fetchProjects();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // 폼 데이터 정리
      const submissionData = {
        ...formData,
        projectId: formData.projectId === "" ? null : formData.projectId,
      };

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "포스트 생성 중 오류가 발생했습니다.");
      }

      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "포스트 생성 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      content: "",
      projectId: "",
    });
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>새 포스트 작성</h1>
      {error && <div className={styles.error}>{error}</div>}
      <form
        onSubmit={handleSubmit}
        className={styles.form}
      >
        <div className={styles.formGroup}>
          <label
            htmlFor="title"
            className={styles.label}
          >
            제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label
            htmlFor="category"
            className={styles.label}
          >
            카테고리
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">카테고리 선택</option>
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.key}
              >
                {category.title}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label
            htmlFor="projectId"
            className={styles.label}
          >
            프로젝트
          </label>
          <select
            id="projectId"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="">연결된 프로젝트 없음</option>
            {projects.map((project) => (
              <option
                key={project.id}
                value={project.id}
              >
                {project.title}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label
            htmlFor="description"
            className={styles.label}
          >
            설명
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.editorContainer}>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>내용</h2>
            </div>
            <textarea
              ref={textareaRef}
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="마크다운 텍스트를 입력하세요..."
              required
            />
          </div>
          <div className={styles.panel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>미리보기</h2>
            </div>
            <div className={styles.previewContainer}>
              <div className={styles.markdownContent}>
                <MarkdownRenderer content={formData.content} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={handleClear}
            className={styles.clearButton}
            disabled={isSubmitting}
          >
            초기화
          </button>
          <button
            type="submit"
            className={styles.button}
            disabled={isSubmitting}
          >
            {isSubmitting ? "저장 중..." : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
