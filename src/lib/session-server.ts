import 'server-only';

import { cookies } from 'next/headers';
import { sessionCookieName, verifySession } from '@/lib/session';

export async function readSessionFromCookies() {
  const token = (await cookies()).get(sessionCookieName)?.value;
  if (!token) {
    return null;
  }

  try {
    return await verifySession(token);
  } catch {
    return null;
  }
}
