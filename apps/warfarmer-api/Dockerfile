FROM node:20-alpine as builder

WORKDIR /app
RUN apk add --no-cache openssl
COPY package.json package-lock.json ./
RUN npm install
COPY . .

RUN npm i -g nx
RUN nx run api-prisma-schema:generate-types
RUN nx run warfarmer-api:build --prod

FROM node:20-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app
RUN apk add --no-cache openssl
COPY package.json package-lock.json ./
RUN npm install --only=production

COPY --from=builder /app/node_modules/.prisma  ./node_modules/.prisma
COPY --from=builder /app/dist/apps/warfarmer-api ./dist

CMD ["node", "dist/main"]
