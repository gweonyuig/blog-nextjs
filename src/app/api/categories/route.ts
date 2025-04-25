import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { error: "카테고리 목록을 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
