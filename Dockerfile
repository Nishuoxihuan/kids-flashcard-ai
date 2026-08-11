# 使用 Node.js 20 镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 复制后端依赖文件
COPY backend/package*.json ./

# 安装依赖
RUN npm install --production

# 复制后端代码
COPY backend/server.js ./

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "server.js"]
