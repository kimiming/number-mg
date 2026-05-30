import { SignJWT, jwtVerify } from 'jose';

export const sessionCookieName = 'phone_admin_token';

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return new TextEncoder().encode(secret);
}

export type SessionPayload = {
  sub: string;
  username: string;
};

export async function signSession(payload: SessionPayload) {
  return new SignJWT({ username: payload.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifySession(token: string) {
  const { payload } = await jwtVerify(token, getSecret());
  if (!payload.sub || typeof payload.username !== 'string') {
    throw new Error('Invalid session payload');
  }

  return {
    id: payload.sub,
    username: payload.username
  };
}

export async function readSessionTokenFromCookieStore(cookieStore: {
  get(name: string): { value: string } | undefined;
}) {
  const token = cookieStore.get(sessionCookieName)?.value;
  if (!token) {
    return null;
  }

  try {
    return await verifySession(token);
  } catch {
    return null;
  }
}
