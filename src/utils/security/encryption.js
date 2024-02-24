import crypto from "crypto";

const SECRET_KEY = "031fc86e765af72bd96327f8b4772a8f8d61bf8d9b30f159313cec541439a79f";

const algo = "aes-256-cbc";
export function encrypt(text) {
  const iv = Buffer.alloc(16, 0);
  const cipher = crypto.createCipheriv(
    algo,
    Buffer.from(SECRET_KEY, "hex"),
    iv
  );
  const encrypted = cipher.update(text, "utf8", "hex") + cipher.final("hex");
  return encrypted;
}
export function decrypt(text) {
  const iv = Buffer.alloc(16, 0);
  const decipher = crypto.createDecipheriv(
    algo,
    Buffer.from(SECRET_KEY, "hex"),
    iv
  );
  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
