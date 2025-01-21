import { randomBytes, scrypt, timingSafeEqual } from "crypto";

const keyLength = 32;

/**
 * Hashes a password using the scrypt algorithm.
 * @param password - The plain text password to hash.
 * @returns A promise that resolves to the salt+hash string.
 */
export const hash = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Generate a random 16-byte salt
    const salt = randomBytes(16).toString("hex");

    // Perform the scrypt hash
    scrypt(password, salt, keyLength, (err, derivedKey) => {
      if (err) reject(err);
      // Combine the salt and the derived key (both as hex strings)
      resolve(`${salt}.${derivedKey.toString("hex")}`);
    });
  });
};

/**
 * Compares a plain text password with a salt+hash string.
 * @param password - The plain text password to check.
 * @param hash - The stored salt+hash string.
 * @returns A promise that resolves to true if the passwords match, otherwise false.
 */
export const compare = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      // Split the stored hash into salt and derived key
      const [salt, storedKey] = hash.split(".");

      if (!salt || !storedKey) {
        throw new Error("Invalid hash format");
      }

      // Perform scrypt with the same salt
      scrypt(password, salt, keyLength, (err, derivedKey) => {
        if (err) reject(err);

        // Compare the derived key with the stored key securely
        const isMatch = timingSafeEqual(
          Buffer.from(storedKey, "hex"),
          derivedKey
        );

        resolve(isMatch);
      });
    } catch (err) {
      reject(err);
    }
  });
};

// Example usage:
(async () => {
  const password = "mypassword123";
  const hashedPassword = await hash(password);

  const isMatch = await compare(password, hashedPassword);
 
})();
