FROM node:20.12.2

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
