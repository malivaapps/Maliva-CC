# Testing field (NOT FIXED)

FROM node:20 AS builder

WORKDIR /usr/src/app 

COPY package.json package-lock.json ./ 

RUN npm ci
  COPY . .

FROM node:20 AS runner

WORKDIR /usr/src/app 