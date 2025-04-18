import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 기존 데이터 정리
  await prisma.post.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.aboutMeItem.deleteMany({});
  await prisma.project.deleteMany({});

  // 카테고리 데이터 생성
  const reactCategory = await prisma.category.create({
    data: {
      key: "react",
      title: "React",
    },
  });

  const typescriptCategory = await prisma.category.create({
    data: {
      key: "typescript",
      title: "TypeScript",
    },
  });

  const nextjsCategory = await prisma.category.create({
    data: {
      key: "nextjs",
      title: "Next.js",
    },
  });

  // 포스트 데이터 생성
  await prisma.post.create({
    data: {
      title: "React 훅 사용법",
      description: "React의 다양한 훅 사용법에 대해 알아봅니다",
      date: new Date("2023-01-15"),
      contents: `
# React 훅 사용법

React 훅은 함수형 컴포넌트에서 상태와 라이프사이클 기능을 사용할 수 있게 해주는 기능입니다.

## useState 훅

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>현재 카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>증가</button>
    </div>
  );
}
\`\`\`

## useEffect 훅

\`\`\`jsx
function Timer() {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(seconds => seconds + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return <p>타이머: {seconds}초</p>;
}
\`\`\`
      `,
      categoryId: reactCategory.id,
    },
  });

  await prisma.post.create({
    data: {
      title: "TypeScript 타입 시스템 이해하기",
      description: "TypeScript의 타입 시스템에 대한 심층 가이드",
      date: new Date("2023-02-20"),
      contents: `
# TypeScript 타입 시스템 이해하기

TypeScript는 JavaScript에 타입을 추가한 언어로, 개발 경험을 크게 향상시킵니다.

## 기본 타입

\`\`\`typescript
// 기본 타입
let isDone: boolean = false;
let decimal: number = 6;
let color: string = "blue";
let list: number[] = [1, 2, 3];
let tuple: [string, number] = ["hello", 10];

// 열거형
enum Color {Red, Green, Blue}
let c: Color = Color.Green;

// Any
let notSure: any = 4;
notSure = "maybe a string";
\`\`\`

## 인터페이스

\`\`\`typescript
interface User {
  name: string;
  id: number;
  email?: string; // 선택적 속성
  readonly createdAt: Date; // 읽기 전용 속성
}

function createUser(user: User): User {
  return user;
}
\`\`\`
      `,
      categoryId: typescriptCategory.id,
    },
  });

  await prisma.post.create({
    data: {
      title: "Next.js로 SEO 최적화하기",
      description: "Next.js 애플리케이션의 검색 엔진 최적화 방법",
      date: new Date("2023-03-10"),
      contents: `
# Next.js로 SEO 최적화하기

Next.js는 React 기반 프레임워크로 SEO에 강점이 있습니다.

## 메타 태그 사용하기

\`\`\`jsx
import Head from 'next/head';

function HomePage() {
  return (
    <>
      <Head>
        <title>My Website</title>
        <meta name="description" content="Welcome to my website" />
        <meta property="og:title" content="My Website" />
        <meta property="og:description" content="Welcome to my website" />
        <meta property="og:image" content="https://example.com/og-image.jpg" />
      </Head>
      <main>
        <h1>Welcome to my website</h1>
      </main>
    </>
  );
}
\`\`\`

## 정적 생성과 서버 사이드 렌더링

\`\`\`jsx
// getStaticProps 사용 예
export async function getStaticProps() {
  const posts = await fetchPosts();
  return { props: { posts }, revalidate: 60 };
}

// getServerSideProps 사용 예
export async function getServerSideProps(context) {
  const { params, req, res } = context;
  const userData = await fetchUserData(params.id);
  return { props: { userData } };
}
\`\`\`
      `,
      categoryId: nextjsCategory.id,
    },
  });

  // AboutMe 데이터 생성
  await prisma.aboutMeItem.create({
    data: {
      title: "Name",
      description: "김개발",
      iconImg: "/icons/user.svg",
    },
  });

  await prisma.aboutMeItem.create({
    data: {
      title: "Email",
      description: "developer@example.com",
      iconImg: "/icons/mail.svg",
    },
  });

  await prisma.aboutMeItem.create({
    data: {
      title: "GitHub",
      description: "github.com/devkim",
      iconImg: "/icons/github.svg",
    },
  });

  // 프로젝트 데이터 생성
  await prisma.project.create({
    data: {
      title: "개인 블로그 프로젝트",
      description: "Next.js와 Prisma를 사용한 개인 블로그",
      image: "/projects/blog.jpg",
      contents: `
# 개인 블로그 프로젝트

Next.js, Prisma, PostgreSQL을 사용하여 만든 개인 블로그입니다.

## 주요 기능
- 마크다운 지원 블로그 포스트
- 카테고리별 포스트 필터링
- 반응형 디자인
- SEO 최적화

## 사용 기술
- Next.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Tailwind CSS
      `,
    },
  });

  await prisma.project.create({
    data: {
      title: "쇼핑몰 애플리케이션",
      description: "React와 Node.js를 사용한 이커머스 사이트",
      image: "/projects/ecommerce.jpg",
      contents: `
# 쇼핑몰 애플리케이션

React와 Node.js를 사용하여 구현한 이커머스 웹사이트입니다.

## 주요 기능
- 상품 목록 및 상세 페이지
- 장바구니 기능
- 사용자 인증
- 주문 및 결제 프로세스

## 사용 기술
- React
- Redux
- Node.js
- Express
- MongoDB
- AWS S3 및 CloudFront
      `,
    },
  });

  console.log("데이터베이스 시드가 완료되었습니다");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
