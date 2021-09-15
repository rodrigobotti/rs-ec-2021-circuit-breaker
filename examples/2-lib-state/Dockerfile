FROM node:14-alpine

WORKDIR /app

COPY ./src ./src
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm ci
