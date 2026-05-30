import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authSchema } from '@/lib/schemas';
import { sessionCookieName, signSession } from '@/lib/session';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = authSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? '参数错误' },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { username: parsed.data.username }
    });

    if (!admin) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
    }

    const verified = await bcrypt.compare(parsed.data.password, admin.passwordHash);
    if (!verified) {
      return NextResponse.json({ error: '用户名或密码错误' }, { status: 401 });
    }

    const token = await signSession({ sub: admin.id, username: admin.username });
    const response = NextResponse.json({ message: '登录成功' });
    response.cookies.set(sessionCookieName, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });
    return response;
  } catch {
    return NextResponse.json({ error: '登录失败' }, { status: 500 });
  }
}
