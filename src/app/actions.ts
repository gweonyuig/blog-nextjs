"use server";

// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

import prisma from "@/lib/prisma";

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return projects;
  } catch (error) {
    throw error;
  }
}

export async function getCategories() {
  try {
    // 모든 카테고리 가져오기
    const categories = await prisma.category.findMany({
      orderBy: {
        id: "asc",
      },
    });
    return categories;
  } catch (error) {
    throw error;
  }
}

// 카테고리랑 포스트랑 같이 불러와서그런가? ㅈㄴ느리네 ??
export async function getBlogs() {
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

    return {
      posts: formattedPosts,
    };
  } catch (error) {
    throw error;
  }
}

export async function getPost(id: number) {
  try {
    // 우선 포스트의 기본 정보 조회
    const post = await prisma.post.findUnique({
      where: { id },
      include: { category: true },
    });

    // 포스트가 존재하고 projectId가 있는 경우에만 프로젝트 정보도 조회
    if (post && post.projectId !== null) {
      const postWithProject = await prisma.post.findUnique({
        where: { id },
        include: {
          category: true,
          project: true,
        },
      });

      // date 필드를 ISO 문자열로 변환
      if (postWithProject && postWithProject.date) {
        return {
          ...postWithProject,
          date: postWithProject.date.toISOString(),
        };
      }

      return postWithProject;
    }

    // date 필드를 ISO 문자열로 변환
    if (post && post.date) {
      return {
        ...post,
        date: post.date.toISOString(),
      };
    }

    return post;
  } catch (error) {
    throw error;
  }
}

export async function getAboutMe() {
  try {
    const aboutMeItems = await prisma.aboutMeItem.findMany({
      orderBy: {
        id: "asc", // id 기준 오름차순 정렬
      },
    });

    return aboutMeItems;
  } catch (error) {
    throw error;
  }
}
