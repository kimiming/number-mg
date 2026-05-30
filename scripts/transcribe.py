#!/usr/bin/env python3
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path

from faster_whisper import WhisperModel


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Transcribe audio from public/uploads")
    parser.add_argument("--filename", required=True, help="File name inside public/uploads")
    return parser


def resolve_audio_path(repo_root: Path, filename: str) -> Path:
    clean_name = Path(filename.replace("\\", "/")).name
    uploads_dir = repo_root / "public" / "uploads"
    uploads_dir_resolved = uploads_dir.resolve()
    audio_path = (uploads_dir / clean_name).resolve()

    if uploads_dir_resolved not in audio_path.parents and audio_path != uploads_dir_resolved:
        raise FileNotFoundError("Invalid filename")

    if not audio_path.exists():
        raise FileNotFoundError(f"Audio file not found: {clean_name}")

    return audio_path


def load_model() -> WhisperModel:
    model_path = os.getenv("WHISPER_MODEL_PATH", "").strip() or None
    model_size = os.getenv("WHISPER_MODEL_SIZE", "base").strip()
    device = os.getenv("WHISPER_DEVICE", "cpu").strip()
    compute_type = os.getenv("WHISPER_COMPUTE_TYPE", "int8").strip()

    model_name_or_path = model_path or model_size
    return WhisperModel(model_name_or_path, device=device, compute_type=compute_type)


def main() -> int:
    args = build_parser().parse_args()
    repo_root = Path(__file__).resolve().parent.parent

    try:
        audio_path = resolve_audio_path(repo_root, args.filename)
        model = load_model()
        language = os.getenv("WHISPER_LANGUAGE", "zh").strip() or None
        beam_size = int(os.getenv("WHISPER_BEAM_SIZE", "5"))
        vad_filter = os.getenv("WHISPER_VAD_FILTER", "true").strip().lower() not in {"0", "false", "no"}

        segments, _info = model.transcribe(
            str(audio_path),
            language=language,
            beam_size=beam_size,
            vad_filter=vad_filter,
        )

        text = "".join(segment.text for segment in segments).strip()
        sys.stdout.write(json.dumps({"text": text}, ensure_ascii=False))
        return 0
    except Exception as exc:
        sys.stdout.write(json.dumps({"error": str(exc)}, ensure_ascii=False))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
