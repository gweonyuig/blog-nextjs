"use client";

import React, { useState, useRef } from "react";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import styles from "./page.module.css";

// Markdown example template
const MARKDOWN_EXAMPLE = `# Hello, Markdown!

This is a simple markdown editor.

## Features
- **Bold** text
- _Italic_ text
- [Link](https://example.com)
- \`Inline code\`

\`\`\`javascript
console.log('Hello, World!');
\`\`\`

> Blockquote example.

1. First item
2. Second item
3. Third item

\\"name\\": \\"John Doe\\"
`;

export default function MarkdownEditorPage() {
  const [markdownText, setMarkdownText] = useState<string>("");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isStringCopied, setIsStringCopied] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(false);
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

  const handleInsertExample = () => {
    setMarkdownText(MARKDOWN_EXAMPLE);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const toggleGuide = () => {
    setShowGuide(!showGuide);
  };

  const handleConvertAndCopy = () => {
    if (markdownText) {
      // Convert multiline text to a single line with \n escape sequences
      const singleLineText = markdownText.replace(/\n/g, "\\n");
      navigator.clipboard.writeText(singleLineText);
      setIsStringCopied(true);
      setTimeout(() => setIsStringCopied(false), 2000);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>마크다운 에디터</h1>

      <div className={styles.guideSection}>
        <button
          onClick={toggleGuide}
          className={styles.guideToggleButton}
        >
          {showGuide ? "사용법 숨기기" : "사용법 보기"}
        </button>
        {showGuide && (
          <div className={styles.guideContent}>
            <h3>마크다운 사용법</h3>
            <div className={styles.guideColumns}>
              <div className={styles.guideColumn}>
                <h4>기본 문법</h4>
                <ul>
                  <li>
                    <code># 제목</code> - 제목 (크기는 # 개수로 조절)
                  </li>
                  <li>
                    <code>**굵게**</code> - <strong>굵게</strong>
                  </li>
                  <li>
                    <code>_기울임_</code> - <em>기울임</em>
                  </li>
                  <li>
                    <code>[링크](URL)</code> - <a href="#">링크</a>
                  </li>
                  <li>
                    <code>![대체텍스트](이미지URL)</code> - 이미지
                  </li>
                  <li>
                    <code>\{'"'}</code> - 큰따옴표
                  </li>
                </ul>
              </div>
              <div className={styles.guideColumn}>
                <h4>리스트 & 인용</h4>
                <ul>
                  <li>
                    <code>- 항목</code> 또는 <code>* 항목</code> - 글머리 기호
                  </li>
                  <li>
                    <code>1. 항목</code> - 번호 매기기
                  </li>
                  <li>
                    <code>{">"} 인용문</code> - 인용 블록
                  </li>
                </ul>
              </div>
              <div className={styles.guideColumn}>
                <h4>코드 & 그 외</h4>
                <ul>
                  <li>
                    <code>`인라인 코드`</code> - <code>인라인 코드</code>
                  </li>
                  <li>
                    <code>```언어 코드블록 ```</code> - 코드 블록
                  </li>
                  <li>
                    <code>--- 또는 ***</code> - 구분선
                  </li>
                </ul>
              </div>
            </div>
            <button
              onClick={handleInsertExample}
              className={`${styles.button} ${styles.exampleButton}`}
            >
              예시 템플릿 삽입하기
            </button>
          </div>
        )}
      </div>

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
              <button
                onClick={handleConvertAndCopy}
                className={`${styles.button} ${styles.stringButton}`}
              >
                {isStringCopied ? "변환 복사됨!" : "문자열로 변환"}
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
