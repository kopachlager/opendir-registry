export function getPublicOrigin(request: Request) {
  const configuredOrigin = process.env.PUBLIC_APP_URL?.trim();
  if (configuredOrigin) return configuredOrigin.replace(/\/$/, "");

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();

  if (host) return `${forwardedProto || "https"}://${host}`;
  return new URL(request.url).origin;
}
