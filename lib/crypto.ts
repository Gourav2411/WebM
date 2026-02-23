import crypto from "crypto";

function getKey() {
  return Buffer.from(process.env.ENCRYPTION_KEY || "", "utf8");
}

export function encrypt(text: string) {
  const key = getKey();
  if (key.length < 32) throw new Error("ENCRYPTION_KEY must be >= 32 chars");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key.subarray(0, 32), iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decrypt(payload: string) {
  const key = getKey();
  if (key.length < 32) throw new Error("ENCRYPTION_KEY must be >= 32 chars");
  const [ivHex, dataHex] = payload.split(":");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key.subarray(0, 32), Buffer.from(ivHex, "hex"));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]);
  return decrypted.toString("utf8");
}
