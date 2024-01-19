# Stage 1
FROM node:18 as builder

WORKDIR /build 

COPY package*.json .

RUN npm install

COPY . .
RUN npm run build

# Stage 2
FROM node:18 as runner

WORKDIR /app
COPY --from=builder build/package*.json .
COPY --from=builder build/node_modules node_modules
COPY --from=builder build/dist dist/
COPY --from=builder build/.env .

CMD [ "npm","start" ]