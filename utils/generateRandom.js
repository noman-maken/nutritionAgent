import jwt from "jsonwebtoken";
/**
 * Generate an n-digit random integer code.
 *
 * @param {number} length - Number of digits (e.g. 6 for a 6-digit code)
 * @returns {number} Random integer code with exactly `length` digits
 */
export function generateNumberCode(length = 6) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random string of given length.
 *
 * @param {number} length - Length of the string.
 * @param {boolean} includeSymbols - Whether to include symbols.
 * @returns {string} Random alphanumeric (and optional symbol) string.
 */
export function generateRandomString(length = 12, includeSymbols = false) {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_-+=<>?/{}[]|";

    let characters = letters + numbers;
    if (includeSymbols) characters += symbols;

    let result = "";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}




/**
 * Generate a secure random token.
 *
 *                          e.g. 64 bytes → 128-character token.
 * @returns {string} A cryptographically secure random token.
 * @param user
 */
export function generateSecureToken(user) {
    const payload = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
    };

    // Token will expire in 24 hours (adjust as needed)
    return jwt.sign(payload, process.env.AUTH_SECRET, { expiresIn: "24h" });
}