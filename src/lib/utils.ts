
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculate aspect ratio from width and height
 * @param width - Width of the image
 * @param height - Height of the image
 * @returns Aspect ratio as a number (width/height)
 */
export function calculateAspectRatio(width: number, height: number): number {
  return width / height;
}

/**
 * Get standard aspect ratio closest to the given dimensions
 * @param width - Width of the image
 * @param height - Height of the image
 * @returns Standard aspect ratio (16/9, 4/3, 1/1, 3/4, etc.)
 */
export function getStandardAspectRatio(width: number, height: number): number {
  const ratio = width / height;
  
  // Common aspect ratios
  const standardRatios = [
    { value: 16/9, name: '16:9' },
    { value: 4/3, name: '4:3' },
    { value: 1, name: '1:1' },
    { value: 3/4, name: '3:4' },
    { value: 9/16, name: '9:16' }
  ];
  
  // Find the closest standard ratio
  let closest = standardRatios[0];
  let minDiff = Math.abs(ratio - closest.value);
  
  for (let i = 1; i < standardRatios.length; i++) {
    const diff = Math.abs(ratio - standardRatios[i].value);
    if (diff < minDiff) {
      minDiff = diff;
      closest = standardRatios[i];
    }
  }
  
  return closest.value;
}
