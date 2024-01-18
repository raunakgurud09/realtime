FROM node

RUN mkdir -p /usr/app/realtime && chown -R node:node /usr/app/realtime

WORKDIR /usr/app/realtime

# Copy package json and yarn lock only to optimise the image building
COPY yarn.lock ./

USER node

RUN yarn install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "npm", "start" ]