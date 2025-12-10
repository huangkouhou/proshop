# --- 第一阶段：构建 React ---
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# 开始构建，生成 build 或 dist 文件夹
RUN npm run build

# --- 第二阶段：Caddy 服务 ---
FROM caddy:alpine
# 1. 也就是把根目录下的 Caddyfile 复制进容器
# (注意：因为 docker build context 的问题，这一步我们在 GitHub Actions 里通过 cp 命令来辅助，稍后说明)
COPY Caddyfile /etc/caddy/Caddyfile

# 2. 把 React 构建好的静态文件复制到 Caddy 的网站目录
# (请确认你的 React 打包目录是 build 还是 dist，Create React App 是 build，Vite 是 dist)
COPY --from=builder /app/build /srv

EXPOSE 80
EXPOSE 443