FROM node:22-alpine AS base
WORKDIR /app

COPY package*.json ./

FROM base AS development
RUN --mount=type=cache,target=/root/.npm \
    npm install

COPY . .

EXPOSE 4000
CMD ["sh", "-c", "npm run db:migrate && npm run dev"]