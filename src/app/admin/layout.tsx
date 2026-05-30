import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { readSessionFromCookies } from '@/lib/session-server';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  const session = await readSessionFromCookies();

  if (!session) {
    redirect('/login');
  }

  return children;
}
