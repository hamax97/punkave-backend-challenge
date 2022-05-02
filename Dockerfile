FROM node:16.14-alpine3.15 as builder

USER node

ARG app=/home/node/app
RUN mkdir -p ${app}
WORKDIR ${app}

COPY --chown=node:node package*.json ./
RUN npm install

COPY --chown=node:node . .
RUN npm run build

# ---

FROM node:16.14-alpine3.15

USER node

ARG app=/home/node/app
RUN mkdir -p ${app}
WORKDIR ${app}

COPY --chown=node:node package*.json ./
RUN npm i --production
COPY --from=builder --chown=node:node ${app}/dist/ ./dist/

CMD ["npm", "run", "start:prod"]
