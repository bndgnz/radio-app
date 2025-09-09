/**
 * Text sanitization utility to remove zero-width characters and other invisible characters
 * that can be injected through CMS data to create security vulnerabilities or display issues.
 */

/**
 * Sanitizes text by removing zero-width characters, HTML entities, and other invisible characters
 * @param text - The text to sanitize
 * @returns Clean text without invisible characters
 */
export const sanitizeText = (text: string | undefined): string => {
  if (!text) return '';
  
  return text
    // Remove ALL zero-width characters (comprehensive list)
    .replace(/[\u200B\u200C\u200D\u200E\u200F\uFEFF]/g, '')
    
    // Remove bidirectional text control characters
    .replace(/[\u202A-\u202E]/g, '')
    
    // Remove word joiners and invisible separators  
    .replace(/[\u2060-\u2069]/g, '')
    
    // Remove interlinear annotation characters
    .replace(/[\uFFF9-\uFFFB]/g, '')
    
    // Remove specific problematic characters
    .replace(/[\u180E\u061C\u115F\u1160\u17B4\u17B5\u3164]/g, '')
    
    // Remove all control characters (C0 and C1 controls)
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    
    // Remove line/paragraph separators that can break JSON
    .replace(/[\u2028\u2029]/g, '')
    
    // Remove other invisible/formatting characters (comprehensive)
    .replace(/[\u00AD\u034F\u061C\u115F\u1160\u17B4\u17B5\u180E\u200B-\u200F\u202A-\u202E\u2060-\u206F\u3164\uFEFF\uFFA0]/g, '')
    
    // Remove HTML entity versions of zero-width characters
    .replace(/&zwnj;|&zwj;|&#x?200[B-F];|&#x?202[A-E];|&#x?206[0-9A-F];|&#x?FEFF;/gi, '')
    .replace(/&#8203;|&#8204;|&#8205;|&#8206;|&#8207;|&#65279;/g, '')
    
    // Normalize Unicode to NFC form
    .normalize('NFC')
    
    // Ultra-aggressive: Remove any remaining non-printable characters
    // Keep printable ASCII, Latin Extended, and common symbols
    .replace(/[^\x20-\x7E\u00A0-\u024F\u1E00-\u1EFF]/g, '')
    
    // Clean up multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Sanitizes text specifically for use in HTML attributes
 * @param text - The text to sanitize
 * @returns Clean text safe for HTML attributes
 */
export const sanitizeHtmlAttribute = (text: string | undefined): string => {
  if (!text) return '';
  
  return sanitizeText(text)
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/**
 * Sanitizes text for use in URLs
 * @param text - The text to sanitize
 * @returns Clean text safe for URLs
 */
export const sanitizeUrl = (text: string | undefined): string => {
  if (!text) return '';
  
  return sanitizeText(text)
    .replace(/[^a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]/g, '');
};

/**
 * Recursively sanitize all string values in an object or array
 * @param obj - The object/array to sanitize
 * @returns Sanitized object/array with all strings cleaned
 */
export const deepSanitizeObject = (obj: any): any => {
  if (typeof obj === 'string') {
    return sanitizeText(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(deepSanitizeObject);
  }
  
  if (obj && typeof obj === 'object' && obj.constructor === Object) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      // Also sanitize keys if they're strings
      const cleanKey = typeof key === 'string' ? sanitizeText(key) : key;
      sanitized[cleanKey] = deepSanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
};

/**
 * Applies deep sanitization to any data structure and logs what was cleaned
 * @param data - Data to sanitize
 * @param label - Label for logging
 * @returns Sanitized data
 */
export const sanitizeWithLogging = (data: any, label = 'data'): any => {
  const originalJson = JSON.stringify(data);
  const cleaned = deepSanitizeObject(data);
  const cleanedJson = JSON.stringify(cleaned);
  
  if (originalJson !== cleanedJson) {
    console.log(`🧹 Sanitized ${label} - removed zero-width characters`);
  }
  
  return cleaned;
};

export default {
  sanitizeText,
  sanitizeHtmlAttribute,
  sanitizeUrl,
  deepSanitizeObject,
  sanitizeWithLogging
};