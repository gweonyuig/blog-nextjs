import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

// 새로운 Prisma 인스턴스 생성 방식
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "지원하지 않는 메서드입니다" });
  }

  try {
    const { title, description, contents, categoryId, date } = req.body;

    // 필수 필드 검증
    if (!title || !description || !contents || !categoryId) {
      return res.status(400).json({ message: "모든 필수 필드를 입력해주세요" });
    }

    // categoryId 변환 및 검증
    let categoryIdNum: number;
    try {
      categoryIdNum = parseInt(categoryId, 10);
      if (isNaN(categoryIdNum)) {
        throw new Error("categoryId를 숫자로 변환할 수 없습니다");
      }
    } catch (parseError) {
      return res.status(400).json({
        message: "카테고리 ID는 숫자여야 합니다",
        receivedValue: categoryId,
        error: (parseError as Error).message,
      });
    }

    // 전체 요청 프로세스를 테스트하기 위한 분리된 단계

    // 1. 데이터베이스 연결 테스트
    try {
      // 간단한 쿼리로 연결 테스트
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbConnError) {
      return res.status(500).json({
        message: "데이터베이스 연결 오류가 발생했습니다",
        error: (dbConnError as Error).message,
      });
    }

    // 2. 카테고리 확인
    let categoryExists;
    try {
      categoryExists = await prisma.category.findFirst({
        where: { id: categoryIdNum }, // 정수로 변환된 ID 사용
      });
    } catch (catError) {
      return res.status(500).json({
        message: "카테고리 조회 중 오류가 발생했습니다",
        error: (catError as Error).message,
      });
    }

    if (!categoryExists) {
      return res.status(400).json({
        message: "존재하지 않는 카테고리입니다",
        categoryId,
      });
    }

    // 날짜 형식 확인 및 변환
    let formattedDate;
    try {
      formattedDate = date ? new Date(date) : new Date();
      // 유효하지 않은 날짜인지 확인
      if (isNaN(formattedDate.getTime())) {
        throw new Error("유효하지 않은 날짜 형식");
      }
    } catch (dateError) {
      return res.status(400).json({
        message: "유효하지 않은 날짜 형식입니다",
        error: (dateError as Error).message,
      });
    }

    // 3. 포스트 생성 시도
    try {
      const post = await prisma.post.create({
        data: {
          title,
          description,
          contents,
          date: formattedDate,
          categoryId: categoryIdNum, // 정수로 변환된 ID 사용
        },
      });

      return res.status(201).json({
        message: "포스트가 성공적으로 생성되었습니다",
        post,
      });
    } catch {
      // 오류에 대한 상세 정보 반환
      return res.status(500).json({
        message: "포스트 생성 중 오류가 발생했습니다",
      });
    }
  } catch {
    return res.status(500).json({
      message: "서버 오류가 발생했습니다",
    });
  }
}
