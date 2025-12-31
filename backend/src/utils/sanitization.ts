/**
 * Input sanitization utilities to prevent XSS attacks
 */

export const sanitizeString = (input: unknown): string => {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .replace(/[<>]/g, '') // Remove HTML tags
    .trim()
    .slice(0, 1000); // Limit length
};

export const sanitizeEmail = (email: unknown): string => {
  if (typeof email !== 'string') {
    return '';
  }

  return email.toLowerCase().trim().slice(0, 254);
};

export const sanitizeNumber = (value: unknown): number | null => {
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

export const sanitizeArray = (arr: unknown): string[] => {
  if (!Array.isArray(arr)) {
    return [];
  }

  return arr
    .filter((item) => typeof item === 'string')
    .map((item) => sanitizeString(item))
    .filter((item) => item.length > 0);
};
