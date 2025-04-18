import { NextApiRequest, NextApiResponse } from "next"; // Next.js의 API 요청 및 응답 타입 가져오기
import { PrismaClient } from "@prisma/client"; // Prisma ORM 클라이언트 가져오기

// 새로운 Prisma 인스턴스 생성 방식
const prisma = new PrismaClient(); // 데이터베이스 접근을 위한 Prisma 클라이언트 인스턴스 생성

export default async function handler(
  req: NextApiRequest, // Next.js에서 제공하는 요청 객체
  res: NextApiResponse // Next.js에서 제공하는 응답 객체
) {
  if (req.method !== "POST") {
    // HTTP 메서드가 POST가 아닌 경우 체크
    return res.status(405).json({ message: "지원하지 않는 메서드입니다" }); // 405 Method Not Allowed 에러 반환
  }

  try {
    // 전체 요청 처리를 try-catch로 감싸서 예외 처리
    const { title, description, contents, categoryId, date } = req.body; // 요청 본문에서 필요한 데이터 추출

    // 필수 필드 검증
    if (!title || !description || !contents || !categoryId) {
      // 필수 필드가 누락된 경우 체크
      return res.status(400).json({ message: "모든 필수 필드를 입력해주세요" }); // 400 Bad Request 에러 반환
    }

    // categoryId 변환 및 검증
    let categoryIdNum: number; // 문자열 형태의 categoryId를 숫자로 변환할 변수 선언
    try {
      categoryIdNum = parseInt(categoryId, 10); // 문자열을 10진수 정수로 변환 (라디스 10 사용)
      if (isNaN(categoryIdNum)) {
        // 변환 결과가 숫자가 아닌 경우
        throw new Error("categoryId를 숫자로 변환할 수 없습니다"); // 에러 발생시키기
      }
    } catch (parseError) {
      // categoryId 파싱 과정에서 발생한 오류 처리
      return res.status(400).json({
        message: "카테고리 ID는 숫자여야 합니다", // 에러 메시지
        receivedValue: categoryId, // 받은 원래 값 포함
        error: (parseError as Error).message, // 상세 에러 메시지
      });
    }

    // 전체 요청 프로세스를 테스트하기 위한 분리된 단계

    // 1. 데이터베이스 연결 테스트
    try {
      // 간단한 쿼리로 연결 테스트
      await prisma.$queryRaw`SELECT 1`; // 데이터베이스 연결 상태 확인을 위한 간단한 쿼리 실행
    } catch (dbConnError) {
      // 데이터베이스 연결 오류 처리
      return res.status(500).json({
        message: "데이터베이스 연결 오류가 발생했습니다", // 에러 메시지
        error: (dbConnError as Error).message, // 상세 에러 메시지
      });
    }

    // 2. 카테고리 확인
    let categoryExists; // 카테고리 존재 여부를 저장할 변수
    try {
      categoryExists = await prisma.category.findFirst({
        // 해당 ID의 카테고리 조회
        where: { id: categoryIdNum }, // 정수로 변환된 ID 사용
      });
    } catch (catError) {
      // 카테고리 조회 중 오류 발생 시 처리
      return res.status(500).json({
        message: "카테고리 조회 중 오류가 발생했습니다", // 에러 메시지
        error: (catError as Error).message, // 상세 에러 메시지
      });
    }

    if (!categoryExists) {
      // 카테고리가 존재하지 않는 경우
      return res.status(400).json({
        message: "존재하지 않는 카테고리입니다", // 에러 메시지
        categoryId, // 요청에 포함된 카테고리 ID 반환
      });
    }

    // 날짜 형식 확인 및 변환
    let formattedDate; // 변환된 날짜를 저장할 변수
    try {
      formattedDate = date ? new Date(date) : new Date(); // 날짜가 제공되면 변환, 아니면 현재 날짜 사용
      // 유효하지 않은 날짜인지 확인
      if (isNaN(formattedDate.getTime())) {
        // 날짜 변환 결과가 유효하지 않은 경우
        throw new Error("유효하지 않은 날짜 형식"); // 에러 발생시키기
      }
    } catch (dateError) {
      // 날짜 변환 중 오류 처리
      return res.status(400).json({
        message: "유효하지 않은 날짜 형식입니다", // 에러 메시지
        error: (dateError as Error).message, // 상세 에러 메시지
      });
    }

    // 3. 포스트 생성 시도
    try {
      const post = await prisma.post.create({
        // Prisma를 사용하여 새 포스트 생성
        data: {
          // 생성할 포스트 데이터
          title, // 제목
          description, // 설명
          contents, // 내용
          date: formattedDate, // 포맷팅된 날짜
          categoryId: categoryIdNum, // 정수로 변환된 카테고리 ID
        },
      });

      return res.status(201).json({
        // 201 Created 상태 코드로 성공 응답
        message: "포스트가 성공적으로 생성되었습니다", // 성공 메시지
        post, // 생성된 포스트 데이터 포함
      });
    } catch {
      // 포스트 생성 중 오류 처리
      // 오류에 대한 상세 정보 반환
      return res.status(500).json({
        message: "포스트 생성 중 오류가 발생했습니다", // 에러 메시지
      });
    }
  } catch {
    // 전체 요청 처리 중 발생한 예상치 못한 오류 처리
    return res.status(500).json({
      message: "서버 오류가 발생했습니다", // 일반적인 서버 오류 메시지
    });
  }
}
