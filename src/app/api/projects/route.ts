import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // 모든 프로젝트 가져오기
    const projects = await prisma.project.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return new Response(JSON.stringify(projects), {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({
        error: "프로젝트를 불러오는데 실패했습니다.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
