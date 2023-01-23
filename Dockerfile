FROM node:19-alpine
WORKDIR /usr/src/sji-bdl-api
COPY package*.json ./
RUN apk add --update-cache netcat-openbsd
RUN npm install
COPY . .
EXPOSE 3001
ENTRYPOINT [ "node", "index.js" ]
