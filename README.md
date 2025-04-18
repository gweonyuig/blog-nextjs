# Blog Next.js

## 환경 변수 설정 - 중요!

이 프로젝트는 PostgreSQL 데이터베이스를 사용합니다. 다음 환경 변수를 설정해야 합니다:

### 로컬 개발 환경

`.env` 파일에 데이터베이스 연결 정보를 추가하세요:

```
DATABASE_URL="postgresql://username:password@localhost:5432/blogdb?schema=public"
```

실제 사용 중인 PostgreSQL 데이터베이스 정보로 위 URL을 수정하세요.

### Vercel 배포

Vercel 프로젝트 설정에서 환경 변수를 추가해야 합니다:

1. Vercel 대시보드에서 프로젝트 선택
2. Settings > Environment Variables 선택
3. 다음 변수를 추가:
   - 이름: `DATABASE_URL`
   - 값: 실제 사용 중인 PostgreSQL 데이터베이스 URL
4. 저장 후 프로젝트 재배포

## 개발 시작하기

```bash
# 의존성 설치
npm install

# Prisma 클라이언트 생성
npx prisma generate

# 개발 서버 실행
npm run dev
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
