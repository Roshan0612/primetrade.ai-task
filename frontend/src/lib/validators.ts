export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 4) {
    errors.push('Password must be at least 4 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateUsername = (username: string): boolean => {
  return typeof username === 'string' && username.trim().length > 0;
};
