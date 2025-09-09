// Security utilities for preventing injection attacks
// Created to address zero-width character injection vulnerability

/**
 * Remove zero-width characters and other potentially malicious Unicode characters
 * that could be used for injection attacks or content hiding
 */
export const removeZeroWidthCharacters = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  // Remove various zero-width and invisible characters
  return input.replace(/[\u200B-\u200D\uFEFF\u00AD\u061C\u2060\u2061\u2062\u2063\u2064\u2065\u2066\u2067\u2068\u2069]/g, '');
};

/**
 * Sanitize text alignment values to only allow valid CSS text-align values
 */
export const sanitizeTextAlign = (value: string): string => {
  if (!value || typeof value !== 'string') return '';
  
  // Remove malicious characters first
  const clean = removeZeroWidthCharacters(value);
  
  // Only allow valid text-align values
  const validAlignments = ['left', 'center', 'right', 'justify'];
  const cleanValue = clean.replace(/[^\w-]/g, '').toLowerCase();
  return validAlignments.includes(cleanValue) ? cleanValue : '';
};

/**
 * Sanitize Bootstrap column size values (1-12)
 */
export const sanitizeColumnSize = (value: any): number => {
  const parsed = parseInt(value);
  if (isNaN(parsed) || parsed < 1 || parsed > 12) {
    return 4; // Safe default
  }
  return parsed;
};

/**
 * Sanitize HTML class names to prevent injection
 */
export const sanitizeClassName = (value: string): string => {
  if (!value || typeof value !== 'string') return '';
  
  // Remove zero-width characters first
  const clean = removeZeroWidthCharacters(value);
  
  // Only allow alphanumeric, hyphens, underscores
  return clean.replace(/[^a-zA-Z0-9_-\s]/g, '').trim();
};

/**
 * Clean any string content from potential injection attacks
 */
export const sanitizeString = (value: string): string => {
  if (!value || typeof value !== 'string') return '';
  
  return removeZeroWidthCharacters(value).trim();
};