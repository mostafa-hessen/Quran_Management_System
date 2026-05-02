import { differenceInYears, isValid, parseISO } from 'date-fns';

/**
 * Calculates the age in years from a given birth date string.
 * @param birthDate string (YYYY-MM-DD)
 * @returns number
 */
export const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  
  const parsedDate = parseISO(birthDate);
  if (!isValid(parsedDate)) return 0;

  return differenceInYears(new Date(), parsedDate);
};

/**
 * Formats an age number into an Arabic string representation.
 * @param age number
 * @returns string
 */
export const formatArabicAge = (age: number): string => {
  if (age === 0) return 'أقل من سنة';
  if (age === 1) return 'سنة واحدة';
  if (age === 2) return 'سنتان';
  if (age >= 3 && age <= 10) return `${age} سنوات`;
  return `${age} سنة`;
};

/**
 * Checks if a given birth date is valid (not in the future, and implies a reasonable age).
 * @param date string (YYYY-MM-DD)
 * @returns boolean
 */
export const isValidBirthDate = (date: string): boolean => {
  if (!date) return true; // Could be optional
  
  const parsedDate = parseISO(date);
  if (!isValid(parsedDate)) return false;

  const today = new Date();
  if (parsedDate > today) return false;

  const age = differenceInYears(today, parsedDate);
  // Assuming students cannot be older than 100 years or realistically we can set it to 100
  if (age > 100) return false;

  return true;
};
