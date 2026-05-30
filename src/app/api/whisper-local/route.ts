import { NextResponse } from "next/server";
import { access } from "fs/promises";
import path from "path";
import { promisify } from "util";
import { execFile } from "child_process";

export const runtime = "nodejs";

const execFileAsync = promisify(execFile);
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
const TRANSCRIBE_SCRIPT = path.join(process.cwd(), "scripts", "transcribe.py");

function normalizeFilename(input: string) {
  const value = input.trim().replace(/\\/g, "/");
  const cleaned = value.startsWith("/api/uploads/")
    ? value.slice("/api/uploads/".length)
    : value.startsWith("/uploads/")
      ? value.slice("/uploads/".length)
      : value;
  return path.basename(cleaned);
}

async function fileExists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function runTranscribeScript(filename: string) {
  const pythonCandidates = [
    process.env.PYTHON_BIN?.trim(),
    "python",
    "python3",
    "py"
  ].filter((value): value is string => Boolean(value));

  let lastError: unknown = null;

  for (const pythonBin of pythonCandidates) {
    try {
      const { stdout } = await execFileAsync(
        pythonBin,
        [TRANSCRIBE_SCRIPT, "--filename", filename],
        {
          cwd: process.cwd(),
          maxBuffer: 10 * 1024 * 1024,
          windowsHide: true,
          env: {
            ...process.env,
            PYTHONIOENCODING: "utf-8"
          }
        }
      );

      const parsed = JSON.parse(stdout) as { text?: string; error?: string };
      if (parsed.error) {
        throw new Error(parsed.error);
      }

      return parsed.text ?? "";
    } catch (error) {
      const execError = error as Error & { code?: string; stdout?: string; stderr?: string };
      if (execError.code === "ENOENT" || execError.code === "EACCES") {
        lastError = error;
        continue;
      }

      if (execError.stdout) {
        try {
          const parsed = JSON.parse(execError.stdout) as { text?: string; error?: string };
          if (parsed.error) {
            lastError = new Error(parsed.error);
            break;
          }
        } catch {
          // Fall through to the original error handling below.
        }
      }

      lastError =
        execError.stderr?.trim()
          ? new Error(execError.stderr.trim())
          : error;
      break;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Python 转写脚本执行失败");
}

export async function POST(request: Request) {
  try {
    const { filename } = (await request.json()) as { filename?: string };
    if (!filename) {
      return NextResponse.json({ error: "缺少音频文件名" }, { status: 400 });
    }

    const safeFilename = normalizeFilename(filename);
    const audioPath = path.join(UPLOADS_DIR, safeFilename);

    if (!(await fileExists(audioPath))) {
      return NextResponse.json({ error: "音频文件不存在" }, { status: 404 });
    }

    if (!(await fileExists(TRANSCRIBE_SCRIPT))) {
      return NextResponse.json(
        { error: "未找到 scripts/transcribe.py" },
        { status: 500 }
      );
    }

    const text = await runTranscribeScript(safeFilename);
    return NextResponse.json({ text });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "识别失败";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
