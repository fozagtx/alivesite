import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.BETTER_AUTH_SECRET || "default-secret"
);

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export function getSessionTokenFromCookies(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'better-auth.session_token') {
      return value;
    }
  }
  return null;
}