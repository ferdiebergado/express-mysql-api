FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
# RUN npm ci --only=production

COPY --chown=node:node . .

USER node

CMD [ "nodemon", "src/server.ts" ]
