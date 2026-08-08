import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const SECRET =
  process.env.ENCRYPTION_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "studymate-production-encryption-secret-key-32chars";

function getDerivedKey(): Buffer {
  return crypto.createHash("sha256").update(SECRET).digest();
}

/**
 * Encrypts a raw string (e.g., Gemini API key) using AES-256-GCM
 */
export function encryptApiKey(text: string): string {
  if (!text) return "";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getDerivedKey(), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts an AES-256-GCM encrypted API key
 */
export function decryptApiKey(cipherText: string): string {
  if (!cipherText) return "";
  const parts = cipherText.split(":");
  if (parts.length !== 3) {
    // Return original string if plain text legacy key
    return cipherText;
  }
  const [ivHex, authTagHex, encryptedHex] = parts;
  try {
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, getDerivedKey(), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("[Decryption Error]: Failed to decrypt API key", err);
    return cipherText;
  }
}

/**
 * Returns a safe masked representation of an API key (e.g. "••••••••1234")
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey) return "";
  const clean = apiKey.trim();
  if (clean.length <= 8) return "••••••••";
  return `••••••••${clean.slice(-4)}`;
}
