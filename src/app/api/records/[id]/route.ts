import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { phoneRecordSchema } from '@/lib/schemas';
import { readSessionTokenFromCookieStore } from '@/lib/session';

export const runtime = 'nodejs';

function cookieGetter(request: Request) {
  return {
    get(name: string) {
      const header = request.headers.get('cookie') ?? '';
      const match = header.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
      return match ? { value: decodeURIComponent(match[1]) } : undefined;
    }
  };
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const record = await prisma.phoneRecord.findUnique({ where: { id } });

  if (!record) {
    return NextResponse.json({ error: '记录不存在' }, { status: 404 });
  }

  return NextResponse.json({
    record: {
      ...record,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString()
    }
  });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await readSessionTokenFromCookieStore(cookieGetter(request));
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = await request.json();
    const parsed = phoneRecordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? '参数错误' }, { status: 400 });
    }

    await prisma.phoneRecord.update({
      where: { id },
      data: {
        customerPhoneNumber: parsed.data.customerPhoneNumber,
        whatsappNumber: parsed.data.whatsappNumber,
        voiceFilePath: parsed.data.voiceFilePath ?? null
      }
    });

    return NextResponse.json({ id });
  } catch {
    return NextResponse.json({ error: '更新失败' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await readSessionTokenFromCookieStore(cookieGetter(request));
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    await prisma.phoneRecord.delete({ where: { id } });
    return NextResponse.json({ message: '已删除' });
  } catch {
    return NextResponse.json({ error: '删除失败' }, { status: 500 });
  }
}
