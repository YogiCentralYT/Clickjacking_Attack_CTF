FROM node:20.14.0-alpine

WORKDIR /app

COPY . /app/

RUN npm install

EXPOSE 9000

ENV NAME=clickjacking_attack_medium

CMD ["npm", "start"]