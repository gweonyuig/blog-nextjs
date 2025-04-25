import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 모든 포스트 가져오기 (카테고리 정보 포함)
    const posts = await prisma.post.findMany({
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    // date 필드를 ISO 문자열로 변환
    const formattedPosts = posts.map((post) => ({
      ...post,
      date: post.date.toISOString(),
    }));

    return new Response(
      JSON.stringify({
        posts: formattedPosts,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch posts",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
