
export function generatePassword() {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numericChars = '0123456789';
    const specialChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  
    let password = '';
    const totalChars = 16;
  
    for (let i = 0; i < totalChars; i++) {
      const charSet =
        Math.floor(Math.random() * 4) === 0
          ? uppercaseChars
          : Math.floor(Math.random() * 4) === 1
          ? lowercaseChars
          : Math.floor(Math.random() * 4) === 2
          ? numericChars
          : specialChars;
      password += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }
  
    return password;
  }
  

  export function calculatePasswordStrength(password) {
    let score = 0;
  
    // Check password length
    if (password.length >= 8) {
      score++;
    }
  
    // Check for uppercase letters
    if (/[A-Z]/.test(password)) {
      score++;
    }
  
    // Check for lowercase letters
    if (/[a-z]/.test(password)) {
      score++;
    }
  
    // Check for numbers
    if (/\d/.test(password)) {
      score++;
    }
  
    // Check for special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score++;
    }
  
    return score;
  }