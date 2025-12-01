
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Add Educare color palette
export const educareColors = {
  blue: "#91D8F7",
  coral: "#EF4D65",
  pink: "#F9B8B5",
};
