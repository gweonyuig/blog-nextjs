import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { title, category, description, content, projectId } =
      await request.json();

    if (!title || !category || !description || !content) {
      return NextResponse.json(
        { error: "필수 필드를 모두 입력해주세요." },
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

    // 프로젝트 확인 - projectId가 "null"이 아닌 경우에만 확인
    let resolvedProjectId = null;
    if (projectId && projectId !== "null" && projectId !== "") {
      const projectIdNum = parseInt(projectId);

      const projectObj = await prisma.project.findUnique({
        where: { id: projectIdNum },
      });

      if (!projectObj) {
        return NextResponse.json(
          { error: "존재하지 않는 프로젝트입니다." },
          { status: 400 }
        );
      }

      resolvedProjectId = projectIdNum;
    }

    const date = new Date();

    // 데이터 생성 객체 준비
    const postData = {
      title,
      description,
      contents: content,
      date,
      categoryId: categoryObj.id,
    };

    // projectId가 있는 경우에만 추가
    if (resolvedProjectId !== null) {
      Object.assign(postData, { projectId: resolvedProjectId });
    }

    // Prisma를 사용하여 데이터베이스에 저장
    const post = await prisma.post.create({
      data: postData,
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
