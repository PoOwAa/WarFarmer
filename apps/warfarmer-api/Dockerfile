FROM node:20-alpine as builder

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

RUN npm i -g nx
RUN nx run warfarmer-api:build --prod

FROM node:20-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY --from=builder /app/dist/apps/warfarmer-api ./dist

CMD ["node", "dist/main"]
