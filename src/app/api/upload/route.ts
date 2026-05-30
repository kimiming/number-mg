import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import { readSessionTokenFromCookieStore } from '@/lib/session';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const session = await readSessionTokenFromCookieStore({
      get: (name) => {
        const header = request.headers.get('cookie') ?? '';
        const match = header.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
        return match ? { value: decodeURIComponent(match[1]) } : undefined;
      }
    });

    if (!session) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: '请选择文件' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const safeName = file.name.replace(/[^\w.\-]+/g, '_');
    const storedName = `${Date.now()}_${safeName}`;
    const targetPath = path.join(uploadsDir, storedName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(targetPath, buffer);

    return NextResponse.json({ path: `/uploads/${storedName}` });
  } catch {
    return NextResponse.json({ error: '上传失败' }, { status: 500 });
  }
}
