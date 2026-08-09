import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "opendir_admin";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

function adminToken() {
  return process.env.ADMIN_TOKEN?.trim() ?? "";
}

function sessionValue() {
  const token = adminToken();
  if (!token) return "";
  return createHmac("sha256", token)
    .update("opendir-admin-session-v1")
    .digest("hex");
}

function safeEqual(left: string, right: string) {
  if (!left || !right) return false;
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

export function isValidAdminToken(candidate: string) {
  return safeEqual(candidate.trim(), adminToken());
}

export async function isAdminSession() {
  const value = (await cookies()).get(ADMIN_COOKIE)?.value ?? "";
  return safeEqual(value, sessionValue());
}

export function getAdminSessionValue() {
  return sessionValue();
}

export function isAdminConfigured() {
  return Boolean(adminToken());
}
