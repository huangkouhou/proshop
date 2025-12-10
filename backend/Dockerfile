# 1. 换成标准版镜像 (解决了 99% 的构建报错)
FROM node:18 

WORKDIR /app
COPY package*.json ./


RUN npm install 

COPY . .
EXPOSE 5001

CMD ["node", "server.js"]