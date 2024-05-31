# syntax=docker/dockerfile:1

FROM 20.13.1-alpine
LABEL name = daApi

RUN apk update
RUN apk add git

RUN git clone https://github.com/ItzMiracleOwO/discord-avatar-api/ /application

WORKDIR /application
RUN npm run deploy

EXPOSE 3000
ENTRYPOINT ["npm", "start"]
