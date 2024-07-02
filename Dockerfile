FROM node:20-alpine3.18 as builder

WORKDIR /app

RUN apk update && apk add --no-cache openssl ca-certificates git bash nano curl

COPY prisma ./prisma

COPY package.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm @nestjs/cli

RUN pnpm install

COPY . .

EXPOSE 3000

CMD ["pnpm", "start:dev"]