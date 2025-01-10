FROM node:alpine

RUN mkdir -p /home/node/app/node_modules 

WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "node", "index.js" ]
