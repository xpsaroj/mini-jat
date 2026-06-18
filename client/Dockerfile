FROM node:22-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install

COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
    