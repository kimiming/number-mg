# Docker Deploy

This document covers the full flow for Ubuntu 22.x:

1. Install Docker Engine and Docker Compose v2
2. Start the services for this project
3. Run the database migration
4. Open the site in the browser

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

## 1. Install Docker and Compose on Ubuntu 22.x

Run these commands on the server:

```bash
sudo apt update
sudo apt install -y ca-certificates curl

sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo \"$UBUNTU_CODENAME\") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

sudo systemctl enable docker
sudo systemctl start docker

docker --version
docker compose version
sudo docker run hello-world
```

Optional: allow your current user to run Docker without `sudo`:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

## 2. Deploy the project

Assuming the code is already uploaded to `/opt/number-manager`:

```bash
cd /opt/number-manager
cp .env.example .env
```

Open `.env` and set a strong password:

```env
POSTGRES_DB=phone_admin_system
POSTGRES_USER=phone_admin
POSTGRES_PASSWORD=change-me-now
```

Then edit the file on the server:

```bash
nano .env
```

## 3. Build and start the stack

```bash
docker compose up -d --build
```

## 4. Run Prisma migrations

```bash
docker compose exec app npx prisma migrate deploy
```

## 5. Check status and logs

```bash
docker compose ps
docker compose logs -f app
```

## 6. Open the site

- Frontend: `http://your-server-ip:3000`
- Admin: `http://your-server-ip:3000/admin`

If the server firewall is enabled, open port 3000:

```bash
sudo ufw allow 3000/tcp
sudo ufw status
```

## Update workflow

When you update the code later, use:

```bash
cd /opt/number-manager
docker compose up -d --build
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
