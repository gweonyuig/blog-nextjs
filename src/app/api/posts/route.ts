import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { title, category, description, content } = await request.json();

    if (!title || !category || !description || !content) {
      return NextResponse.json(
        { error: "모든 필드를 입력해주세요." },
        { status: 400 }
      );
    }

    // 카테고리 확인
    const categoryObj = await prisma.category.findFirst({
      where: { key: category },
    });

    if (!categoryObj) {
      return NextResponse.json(
        { error: "존재하지 않는 카테고리입니다." },
        { status: 400 }
      );
    }

    // 마크다운 파일 생성
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const date = new Date();
    const frontmatter = `---
title: "${title}"
date: "${date.toISOString()}"
category: "${category}"
description: "${description}"
---

`;

    const markdownContent = frontmatter + content;
    const filePath = path.join(process.cwd(), "src/posts", `${slug}.md`);

    // 마크다운 파일 저장
    fs.writeFileSync(filePath, markdownContent);

    // Prisma를 사용하여 데이터베이스에 저장
    const post = await prisma.post.create({
      data: {
        title,
        description,
        contents: content,
        date,
        categoryId: categoryObj.id,
      },
    });

    return NextResponse.json(
      { message: "포스트가 성공적으로 생성되었습니다.", slug: post.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "포스트 생성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
