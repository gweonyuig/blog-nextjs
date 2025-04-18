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
  } finally {
    await prisma.$disconnect();
  }
}

export async function getBlogs() {
  try {
    // 모든 카테고리 가져오기
    const categories = await prisma.category.findMany({
      orderBy: {
        id: "asc",
      },
    });

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

    return {
      categories,
      posts: formattedPosts,
    };
  } catch (error) {
    throw error;
  } finally {
    await prisma.$disconnect();
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
  } finally {
    await prisma.$disconnect();
  }
}
