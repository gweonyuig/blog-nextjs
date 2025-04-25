import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  try {
    const { title, categoryId, description, contents } = await request.json();

    // 마크다운 파일 내용 생성
    const markdownContent = `---
title: ${title}
category: ${categoryId}
description: ${description}
date: ${new Date().toISOString()}
---

${contents}
`;

    // 파일명 생성 (제목을 URL-friendly하게 변환)
    const fileName =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") + ".md";

    // 파일 저장 경로
    const filePath = join(process.cwd(), "src", "posts", fileName);

    // 파일 저장
    await writeFile(filePath, markdownContent, "utf-8");

    return NextResponse.json(
      { message: "포스트가 성공적으로 생성되었습니다", fileName },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { message: "포스트 생성 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
