FROM node:22-alpine

WORKDIR /app

COPY ./my-app/package*.json ./
RUN npm i

COPY ./my-app .

EXPOSE 5173

CMD ["npm", "run", "dev"]
