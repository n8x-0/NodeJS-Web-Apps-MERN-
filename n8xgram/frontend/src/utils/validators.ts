export function nameValidator(name: string): void {
    if (typeof name !== "string") {
        throw new Error("Name must be a string.");
    }
    // Trim whitespace from both ends
    name = name.trim();
    // Length validation
    if (name.length < 3 || name.length > 30) {
        throw new Error("Name must be between 3 and 30 characters long.");
    }
    // Check for suspicious characters (e.g., <, >, &, multiple spaces)
    if (/[<>&]/.test(name)) {
        throw new Error("Name contains invalid characters.");
    }
    // Ensure it only contains letters and single spaces between words
    if (!/^[A-Za-z]+(\s[A-Za-z]+)*$/.test(name)) {
        throw new Error("Name can only contain letters and single spaces between words.");
    }
}

export function emailValidator(email: string): void {
    if (typeof email !== "string") {
        throw new Error("Email must be a string.");
    }
    // Trim whitespace
    email = email.trim();
    // Length validation
    if (email.length < 5 || email.length > 100) {
        throw new Error("Email must be between 5 and 100 characters long.");
    }
    // Check for suspicious characters (<, >, &, spaces)
    if (/[<>&\s]/.test(email)) {
        throw new Error("Email contains invalid characters.");
    }
    // Regex for a basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format.");
    }
}

export function passwordValidator(password: string): void {
    if (typeof password !== "string") {
        throw new Error("Password must be a string.");
    }
    if (password.length < 6 || password.length > 40) {
        throw new Error("Password must be between 6 and 40 characters long.");
    }
    if (!/\d/.test(password)) {
        throw new Error("Password must contain at least one number.");
    }
}

export function passwordSanitizer(password: string): void {
    if (typeof password !== "string") {
        throw new Error("Password must be a string.");
    }
    if (password.length > 40) {
        throw new Error("Unexpected length of password");
    }
}
