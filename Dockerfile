FROM node:16
WORKDIR /app
RUN npm install -g typescript
COPY package.json .
RUN npm install
COPY . .
RUN tsc
EXPOSE 3000
ENV NODE_ENV "production"
CMD npm run start