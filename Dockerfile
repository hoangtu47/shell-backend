FROM node:lts-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && mv node_modules ../

COPY . .

EXPOSE 8080

RUN chown -R node /usr/src/app

USER node

CMD ["node", "shell-websocket.js"]
