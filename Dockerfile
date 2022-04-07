FROM node:16

WORKDIR /divideals_apis

COPY package*.json ./

RUN npm install

RUN npm run build

COPY . .

EXPOSE 8080

CMD [ "node", "dist/main.js"]