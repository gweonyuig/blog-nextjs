"use client";

import React, { useState, useRef } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import styles from "./page.module.css";

export default function MarkdownEditorPage() {
  const [markdownText, setMarkdownText] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownText(e.target.value);
  };

  const handleCopyToClipboard = () => {
    if (markdownText) {
      navigator.clipboard.writeText(markdownText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setMarkdownText("");
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>마크다운 에디터</h1>
      <div className={styles.editorContainer}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>입력</h2>
            <div className={styles.buttonGroup}>
              <button
                onClick={handleClear}
                className={`${styles.button} ${styles.clearButton}`}
              >
                지우기
              </button>
              <button
                onClick={handleCopyToClipboard}
                className={`${styles.button} ${styles.copyButton}`}
              >
                {isCopied ? "복사됨!" : "복사하기"}
              </button>
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={markdownText}
            onChange={handleTextChange}
            className={styles.textarea}
            placeholder="마크다운 텍스트를 입력하세요..."
          />
        </div>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>미리보기</h2>
            {/* 빈 div를 추가하여 입력 패널의 버튼 그룹과 같은 공간 확보 */}
            <div className={styles.buttonGroup} />
          </div>
          <div className={styles.previewContainer}>
            <div className={styles.markdownContent}>
              <MarkdownRenderer content={markdownText} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
