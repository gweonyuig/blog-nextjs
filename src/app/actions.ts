"use server";

export const getAboutMe = async () => {
  const response = await import("@/mocks/aboutMe.json");
  return response.default;
};

export const getProjects = async () => {
  const response = await import("@/mocks/projects.json");
  return response.default;
};
