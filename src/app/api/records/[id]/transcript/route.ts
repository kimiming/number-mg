import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    const body = (await request.json().catch(() => ({}))) as {
      transcriptText?: string;
    };

    const transcriptText = body.transcriptText?.trim();

    if (!transcriptText) {
      return NextResponse.json({ error: '转写文本不能为空' }, { status: 400 });
    }

    const record = await prisma.phoneRecord.update({
      where: { id },
      data: { transcriptText }
    });

    return NextResponse.json({ id: record.id, transcriptText: record.transcriptText });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : '保存转写失败';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
