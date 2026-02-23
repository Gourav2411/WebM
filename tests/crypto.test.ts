import { describe, expect, it } from "vitest";
import { decrypt, encrypt } from "@/lib/crypto";

describe("crypto", () => {
  it("encrypts and decrypts", () => {
    process.env.ENCRYPTION_KEY = "0123456789abcdef0123456789abcdef";
    const value = "token";
    expect(decrypt(encrypt(value))).toBe(value);
  });
});
