# syntax=docker/dockerfile:1

FROM node:20.13.1-alpine3.20
LABEL name = daApi

RUN apk update
RUN apk add git

RUN git clone https://github.com/ItzMiracleOwO/discord-avatar-api/ /application

WORKDIR /application

EXPOSE 3000
ENTRYPOINT ["npm", "start"]
