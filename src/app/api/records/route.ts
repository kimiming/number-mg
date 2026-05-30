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

export async function GET() {
  const records = await prisma.phoneRecord.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({
    records: records.map((record) => ({
      ...record,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString()
    }))
  });
}

export async function POST(request: Request) {
  const session = await readSessionTokenFromCookieStore(cookieGetter(request));
  if (!session) {
    return NextResponse.json({ error: '未登录' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = phoneRecordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? '参数错误' }, { status: 400 });
    }

    const record = await prisma.phoneRecord.create({
      data: {
        customerServiceNumber: '',
        customerPhoneNumber: parsed.data.customerPhoneNumber,
        whatsappNumber: parsed.data.whatsappNumber,
        voiceFilePath: parsed.data.voiceFilePath ?? null
      }
    });

    return NextResponse.json({ id: record.id });
  } catch {
    return NextResponse.json({ error: '创建失败' }, { status: 500 });
  }
}
