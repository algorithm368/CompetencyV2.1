# หลัง build Docker images
Write-Host "Generating Prisma clients..."
docker compose run --rm server npx prisma generate --schema=prisma/competency.prisma
docker compose run --rm server npx prisma generate --schema=prisma/sfia.prisma
docker compose run --rm server npx prisma generate --schema=prisma/tpqi.prisma

Write-Host "Running Prisma migrations..."
docker compose run --rm server npx prisma migrate deploy --schema=prisma/competency.prisma
docker compose run --rm server npx prisma migrate deploy --schema=prisma/sfia.prisma
docker compose run --rm server npx prisma migrate deploy --schema=prisma/tpqi.prisma

# Start server container
docker compose up -d server
docker compose ps
