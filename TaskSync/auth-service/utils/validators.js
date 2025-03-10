const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return input;
  
  // Remove any <script>...</script> blocks (including their content)
  input = input.replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '');
  
  // Remove any remaining HTML tags
  input = input.replace(/<[^>]*>/g, '');
  
  // Optionally remove curly braces and similar symbols if needed
  input = input.replace(/[{}]/g, '');
  
  return input.trim();
};
  
  const validateEmail = (email) => {
    email = sanitizeInput(email);
    if (!email) throw new Error("Email is required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email format");
    }
  };
  
  const validatePassword = (password) => {
    password = sanitizeInput(password);
    if (!password) throw new Error("Password is required");
    if (password.length < 6) throw new Error("Password must be at least 6 characters long");
    if (!/[A-Z]/.test(password)) throw new Error("Password must contain at least one uppercase letter");
    if (!/[a-z]/.test(password)) throw new Error("Password must contain at least one lowercase letter");
    if (!/[0-9]/.test(password)) throw new Error("Password must contain at least one number");
    if (!/[^A-Za-z0-9]/.test(password)) throw new Error("Password must contain at least one special character");
  };
  
  const validateUsername = (username) => {
    username = sanitizeInput(username);
    if (!username) throw new Error("Username is required");
    if (username.length < 3) throw new Error("Username must be at least 3 characters long");
    if (username.length > 20) throw new Error("Username must not exceed 20 characters");
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      throw new Error("Username can only contain letters, numbers, and underscores");
    }
  };
  

  module.exports = {
    validateEmail,
    validatePassword,
    validateUsername
  }