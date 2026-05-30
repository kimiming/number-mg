import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { authSchema } from '@/lib/schemas';

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

    const adminCount = await prisma.admin.count();
    if (adminCount > 0) {
      return NextResponse.json(
        { error: '管理员已存在，注册入口已锁定。请直接登录。' },
        { status: 409 }
      );
    }

    const existing = await prisma.admin.findUnique({
      where: { username: parsed.data.username }
    });

    if (existing) {
      return NextResponse.json({ error: '用户名已存在' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);

    await prisma.admin.create({
      data: {
        username: parsed.data.username,
        passwordHash
      }
    });

    return NextResponse.json({ message: '管理员创建成功' });
  } catch {
    return NextResponse.json({ error: '注册失败' }, { status: 500 });
  }
}
