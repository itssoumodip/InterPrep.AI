import mappings, { interviewCovers } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const techIconBaseURL = "https://raw.githubusercontent.com/devicons/devicon/6910f0503efdd315c8f9b858234310c06e04d9c0/icons/";

const normalizeTechName = (tech: string) => {
  if (!tech) return null;
  const key = tech.toLowerCase().replace(/\.js$/, "").replace(/\s+/g, "");
  return mappings[key as keyof typeof mappings] || key; // Return the key itself if not found in mappings
};

const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok; // Returns true if the icon exists
  } catch {
    return false;
  }
};

export const getTechLogos = async (techArray? : string[]) => {
  // If techArray is undefined or empty, return an empty array
  if (!techArray || techArray.length === 0) {
    return [];
  }
  
  const logoURLs = techArray.map((tech) => {
    const normalized = normalizeTechName(tech);
    console.log("Normalized tech name:", normalized);
    return {
      tech,
      url: normalized ? `${techIconBaseURL}/${normalized}/${normalized}-original.svg` : "/tech.svg",
    };
  });

  const results = await Promise.all(
    logoURLs.map(async ({ tech, url }) => ({
      tech,
      url: (await checkIconExists(url)) ? url : "/tech.svg",
    }))
  );

  return results;
};

export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};
