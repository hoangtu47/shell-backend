FROM node:lts-alpine

RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && mv node_modules ../

COPY . .

EXPOSE 8080

# Create user
# Set sticky bit to working directory
# Set SUID recursively so that everyone can execute file in working directory
RUN adduser -D stranger && chmod +t /usr/src/app && chmod -R u+s /usr/src/app

# Set UID 

USER stranger

CMD ["node", "shell-websocket.js"]
