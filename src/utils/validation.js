/**
 * requisitos: 8 caracteres+, pelo menos 1 letra maiúscula, 1 minúscula, 1 número
 */
export function isValidPassword(password) {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long.' };
  }
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  
  if (!hasUpperCase) {
    return { valid: false, message: 'Password must contain at least one uppercase letter.' };
  }
  
  if (!hasLowerCase) {
    return { valid: false, message: 'Password must contain at least one lowercase letter.' };
  }
  
  if (!hasNumber) {
    return { valid: false, message: 'Password must contain at least one number.' };
  }
  
  return { valid: true, message: 'Password is strong.' };
}

/**
 * mínimo 3 caracteres, apenas letras, números e underscore)
 */
export function isValidUsername(username) {
  if (username.length < 3) {
    return { valid: false, message: 'Username must be at least 3 characters long.' };
  }
  
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return { valid: false, message: 'Username can only contain letters, numbers and underscores.' };
  }
  
  return { valid: true, message: 'Username is valid.' };
}