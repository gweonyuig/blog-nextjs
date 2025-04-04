"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
}
// `code` 컴포넌트에 전달되는 props 타입 정의
interface CodeProps {
  inline?: boolean; // 인라인 코드 여부
  className?: string; // 언어 클래스 (예: language-js)
  children?: React.ReactNode; // 코드 내용
  // HTML <code> 태그에 전달될 수 있는 속성
  // React.HTMLAttributes<HTMLElement>를 사용하여 표준 HTML 속성 포함
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => (
  <div className="markdown-content">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // 코드 블록 커스터마이징
        code: ({
          inline,
          className,
          children,
          ...props
        }: CodeProps & React.HTMLAttributes<HTMLElement>) => {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <pre className={`language-${match[1]}`}>
              <code
                className={className}
                {...props}
              >
                {children}
              </code>
            </pre>
          ) : (
            <code
              className={className}
              {...props}
            >
              {children}
            </code>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default MarkdownRenderer;
