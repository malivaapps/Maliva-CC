FROM node:20-alpine3.18

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

ENV PORT 3000

EXPOSE 3000

CMD ["npm", "run", "start"]
