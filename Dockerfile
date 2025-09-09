FROM node:20-alpine
WORKDIR /usr/src/app

COPY package*.json ./
COPY nest-cli.json ./
RUN npm install

COPY src/ ./src/
COPY tsconfig.json ./
COPY tsconfig.backend.json ./
COPY .env ./

COPY FRONTEND/react-dist/ ./FRONTEND/react-dist/
COPY FRONTEND/uploads/ ./FRONTEND/uploads/

RUN npm run build

EXPOSE 8080
CMD ["node", "dist/main.js"]