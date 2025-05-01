# Blog Next.js

## 환경 변수 설정

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
