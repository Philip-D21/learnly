FROM node:14-alpine

WORKDIR /project

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 2024

CMD ["npm", "run", "start:prod"]
