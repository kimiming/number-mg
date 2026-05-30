# Docker Deploy

## Target

- Ubuntu 22.x
- Docker Engine
- Docker Compose v2

## What the stack contains

- Next.js app
- Prisma Client
- PostgreSQL 16 container
- Python 3
- `ffmpeg`
- `faster-whisper`

## Setup

1. Copy `.env.example` to `.env`
2. Edit `POSTGRES_PASSWORD`
3. Build and start:

```bash
docker compose up -d --build
```

4. Run Prisma migrations:

```bash
docker compose exec app npx prisma migrate deploy
```

## Environment variables

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `DATABASE_URL` is assembled automatically inside Compose
- `WHISPER_MODEL_SIZE`
- `WHISPER_MODEL_PATH`
- `WHISPER_LANGUAGE`
- `WHISPER_DEVICE`
- `WHISPER_COMPUTE_TYPE`
- `WHISPER_BEAM_SIZE`
- `WHISPER_VAD_FILTER`

## Notes

- Uploads are persisted in the `uploads` Docker volume.
- The database is persisted in the `postgres_data` Docker volume.
- If `faster-whisper` needs to download a model, the server must have outbound network access.
- You do not need to install Node.js, Python, or ffmpeg on the Ubuntu host. Docker handles those inside the container.
