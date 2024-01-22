# Stage 1
FROM node:18 as builder

WORKDIR /build 

COPY package*.json .
RUN npm install

COPY . .
RUN npm run build



# Stage 2
FROM node:alpine as runner

WORKDIR /app
COPY --from=builder build/package*.json .
COPY --from=builder build/dist dist/
RUN npm install --only=production

CMD [ "npm","start" ]