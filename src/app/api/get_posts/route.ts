import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 우선 모든 포스트를 조회
    const posts = await prisma.post.findMany({
      include: {
        category: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    if (posts.length === 0) {
      return new Response(
        JSON.stringify({
          posts: [],
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // projectId가 있는 포스트의 ID 목록 추출
    const postsWithProjectIds = posts
      .filter((post) => post.projectId !== null)
      .map((post) => post.id);

    // projectId가 있는 포스트만 다시 조회하여 project 정보 포함
    const postsWithProjects =
      postsWithProjectIds.length > 0
        ? await prisma.post.findMany({
            where: {
              id: { in: postsWithProjectIds },
            },
            include: {
              category: true,
              project: true,
            },
          })
        : [];

    // 두 결과 합치기
    const mergedPosts = posts.map((post) => {
      if (post.projectId !== null) {
        const postWithProject = postsWithProjects.find((p) => p.id === post.id);
        return postWithProject || post;
      }
      return post;
    });

    // date 필드를 ISO 문자열로 변환
    const formattedPosts = mergedPosts.map((post) => ({
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
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to fetch posts",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
