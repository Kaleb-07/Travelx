/**
 * Validates an email address format.
 * @param {string} email
 * @returns {{ valid: boolean, message: string }}
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return { valid: false, message: 'Email is required.' };
  }
  // Must have exactly one @ with a domain containing at least one dot
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, message: 'Please enter a valid email address.' };
  }
  return { valid: true, message: '' };
}

/**
 * Validates password strength.
 * Requirements: min 8 chars, uppercase, lowercase, number, special character.
 * @param {string} password
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePassword(password) {
  if (!password) {
    return { valid: false, message: 'Password is required.' };
  }
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter.' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter.' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number.' };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character.' };
  }
  return { valid: true, message: '' };
}

/**
 * Validates that two passwords match.
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePasswordMatch(password, confirmPassword) {
  if (!confirmPassword) {
    return { valid: false, message: 'Please confirm your password.' };
  }
  if (password !== confirmPassword) {
    return { valid: false, message: 'Passwords do not match.' };
  }
  return { valid: true, message: '' };
}
