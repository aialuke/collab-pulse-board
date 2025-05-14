
/**
 * Utility functions for accessibility compliance
 */

/**
 * Calculate the relative luminance of a color
 * Formula from WCAG 2.0: https://www.w3.org/TR/WCAG20/#relativeluminancedef
 * @param r Red value (0-255)
 * @param g Green value (0-255)
 * @param b Blue value (0-255)
 * @returns Relative luminance value
 */
function getLuminance(r: number, g: number, b: number): number {
  // Convert RGB values to sRGB
  let R = r / 255;
  let G = g / 255;
  let B = b / 255;

  // Apply the formula for linearizing RGB values
  R = R <= 0.03928 ? R / 12.92 : Math.pow((R + 0.055) / 1.055, 2.4);
  G = G <= 0.03928 ? G / 12.92 : Math.pow((G + 0.055) / 1.055, 2.4);
  B = B <= 0.03928 ? B / 12.92 : Math.pow((B + 0.055) / 1.055, 2.4);

  // Return the luminance value
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

/**
 * Convert hex color to RGB values
 * @param hex Hex color string (#RRGGBB)
 * @returns Array of [r, g, b] values
 */
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error('Invalid hex color format');
  }
  
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ];
}

/**
 * Calculate the contrast ratio between two colors
 * Formula from WCAG 2.0: https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 * @param color1 First color in hex format (#RRGGBB)
 * @param color2 Second color in hex format (#RRGGBB)
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  const luminance1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const luminance2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if a color combination meets WCAG AAA contrast requirements
 * @param textColor Text color in hex format (#RRGGBB)
 * @param backgroundColor Background color in hex format (#RRGGBB)
 * @param isLargeText Whether the text is considered "large" (≥24px or ≥19px bold)
 * @returns Object with results for both AA and AAA standards
 */
export function meetsContrastRequirements(
  textColor: string, 
  backgroundColor: string, 
  isLargeText: boolean = false
): { AA: boolean; AAA: boolean } {
  const ratio = getContrastRatio(textColor, backgroundColor);
  
  return {
    AA: isLargeText ? ratio >= 3 : ratio >= 4.5,
    AAA: isLargeText ? ratio >= 4.5 : ratio >= 7
  };
}

/**
 * Verify if focus indicator meets WCAG requirements (3:1 contrast)
 * @param indicatorColor Color of the focus indicator in hex
 * @param adjacentColor Color adjacent to the indicator in hex
 * @returns Boolean indicating if the contrast ratio is at least 3:1
 */
export function validFocusIndicator(indicatorColor: string, adjacentColor: string): boolean {
  const ratio = getContrastRatio(indicatorColor, adjacentColor);
  return ratio >= 3;
}

/**
 * Check if an element should have a keyboard focus indicator
 * @param tagName Element tag name (e.g., 'button', 'a')
 * @param role ARIA role if present
 * @returns Boolean indicating if the element should have a focus indicator
 */
export function shouldShowFocusIndicator(tagName: string, role?: string): boolean {
  const interactiveElements = ['a', 'button', 'input', 'select', 'textarea'];
  const interactiveRoles = ['button', 'checkbox', 'link', 'menuitem', 'radio', 'tab'];
  
  return interactiveElements.includes(tagName.toLowerCase()) || 
    (!!role && interactiveRoles.includes(role));
}
