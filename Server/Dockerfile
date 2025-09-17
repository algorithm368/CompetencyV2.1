FROM node:20-bullseye
RUN apt-get update && apt-get install -y default-mysql-client
WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate --schema=prisma/competency.prisma && \
    npx prisma generate --schema=prisma/sfia.prisma && \
    npx prisma generate --schema=prisma/tpqi.prisma

EXPOSE 3000

CMD ["npm", "run", "dev"]
