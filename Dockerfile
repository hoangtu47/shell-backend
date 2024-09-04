FROM node:lts-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && mv node_modules ../

COPY . .

EXPOSE 8080

# Set sticky bit to working directory
# Set SUID recursively so that everyone can execute file in working directory
RUN chmod +t /usr/src/app && chmod -R 4555 /usr/src/app

# Create user
RUN adduser -D stranger
USER stranger

CMD ["node", "shell-websocket.js"]
