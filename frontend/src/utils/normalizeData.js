/**
 * Type-Safe Data Normalization Utilities for CollegeConnect
 */

/**
 * Safely converts an input value of any type (string, comma-separated string, array, object, null, undefined)
 * into a clean, normalized array of strings or objects.
 *
 * @param {any} value - The input value to normalize
 * @param {Array} fallback - The default array if value is null/undefined/empty
 * @returns {Array} A guaranteed Array
 */
export function normalizeToArray(value, fallback = []) {
  if (value === null || value === undefined) {
    return Array.isArray(fallback) ? [...fallback] : [];
  }

  // Already an array
  if (Array.isArray(value)) {
    return value.filter((item) => item !== null && item !== undefined);
  }

  // Comma-separated or formatted string
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) {
      return Array.isArray(fallback) ? [...fallback] : [];
    }

    if (trimmed.includes(',')) {
      return trimmed
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    if (trimmed.includes('/')) {
      return trimmed
        .split('/')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    if (trimmed.includes(';')) {
      return trimmed
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    return [trimmed];
  }

  // Plain object with values
  if (typeof value === 'object') {
    return Object.values(value).filter(Boolean);
  }

  // Primitive value (number, boolean)
  return [value];
}

/**
 * Safely checks if a collection contains a specific term (case-insensitive)
 *
 * @param {any} collection - Array or string
 * @param {string} term - Search term
 * @returns {boolean}
 */
export function safeArrayIncludes(collection, term) {
  if (!term) return true;
  const arr = normalizeToArray(collection);
  if (arr.length === 0) return false;

  const normalizedTerm = term.toString().trim().toLowerCase();
  if (normalizedTerm === 'all' || normalizedTerm === 'all branches' || normalizedTerm === 'all departments') {
    return true;
  }

  return arr.some((item) => {
    if (typeof item === 'string') {
      const lowerItem = item.toLowerCase();
      return (
        lowerItem === normalizedTerm ||
        lowerItem.includes(normalizedTerm) ||
        normalizedTerm.includes(lowerItem) ||
        lowerItem === 'all' ||
        lowerItem === 'all branches'
      );
    }
    return false;
  });
}
