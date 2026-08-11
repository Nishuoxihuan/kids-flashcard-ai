# 部署指南 🚀

## 方案 A：部署到 Vercel（最简单）

### 1. 部署后端

```bash
cd backend

# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署（首次会提示项目名称）
vercel --prod
```

部署成功后，你会得到一个类似 `https://kids-flashcard-backend.vercel.app` 的 URL。

### 2. 配置环境变量

在 Vercel 控制台：
1. 进入项目 → Settings → Environment Variables
2. 添加以下变量：
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY`
   - `PORT`（设为 3000）

### 3. 部署前端

```bash
cd frontend

# 修改 vite.config.js 中的代理地址为你的后端 URL
# 或者直接在 .env 文件中设置：
# VITE_API_URL=https://kids-flashcard-backend.vercel.app

vercel --prod
```

## 方案 B：部署到海外 VPS（推荐，成本更低）

### 1. 购买 VPS

推荐服务商：
- **DigitalOcean**：$6/月（新加坡）
- **Vultr**：$6/月（东京/新加坡）
- **Hetzner**：€5/月（德国/芬兰）

### 2. 安装 Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash
sudo apt install nodejs -y

# 验证安装
node -v  # 应显示 v20.x
npm -v   # 应显示 10.x
```

### 3. 上传代码

```bash
# 在本地打包
tar -czf kids-flashcard.tar.gz backend/

# 上传到 VPS（替换为你的 VPS IP）
scp kids-flashcard.tar.gz user@your-vps-ip:/tmp/

# 在 VPS 上解压
ssh user@your-vps-ip
cd /tmp
tar -xzf kids-flashcard.tar.gz
sudo mv backend /opt/kids-flashcard
cd /opt/kids-flashcard
```

### 4. 安装依赖并启动

```bash
cd /opt/kids-flashcard

# 安装依赖
npm install --production

# 创建 .env 文件
nano .env
# 填入你的 API Key

# 启动服务
npm start

# 后台运行（使用 pm2）
npm install -g pm2
pm2 start server.js --name kids-flashcard
pm2 save
pm2 startup
```

### 5. 配置域名和 HTTPS（可选）

```bash
# 安装 Nginx
sudo apt install nginx -y

# 配置反向代理
sudo nano /etc/nginx/sites-available/kids-flashcard

# 内容：
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 启用配置
sudo ln -s /etc/nginx/sites-available/kids-flashcard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 使用 Certbot 配置 HTTPS
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

## 方案 C：使用 Docker 部署

```bash
# 构建镜像
docker build -t kids-flashcard .

# 运行容器
docker run -d \
  -p 3000:3000 \
  -e OPENAI_API_KEY=sk-xxx \
  -e ANTHROPIC_API_KEY=sk-ant-xxx \
  --name kids-flashcard \
  kids-flashcard
```

## 成本估算

| 方案 | 月成本 | 优点 | 缺点 |
|------|--------|------|------|
| Vercel | 免费（$0-20） | 最简单，自动 HTTPS | 有请求限制 |
| VPS | $6-10 | 完全控制，无限制 | 需手动配置 |
| Docker | $6-10（VPS 上） | 易迁移，易管理 | 需学习 Docker |

## 监控和维护

### 查看日志

```bash
# PM2
pm2 logs kids-flashcard

# Docker
docker logs kids-flashcard

# Vercel
vercel logs
```

### 健康检查

访问 `https://your-domain.com/api/health` 应返回：

```json
{
  "status": "ok",
  "timestamp": "2026-08-10T12:00:00.000Z"
}
```

## 常见问题

### Q: API 调用失败
A: 检查 `.env` 文件中的 API Key 是否正确，确保 VPS 能访问国外网络。

### Q: 生成速度慢
A: 首次生成需要 10-20 秒（含图片），纯文本约 3-5 秒。可考虑添加缓存。

### Q: 费用超标
A: 在代码中添加每日限额，或关闭图片生成功能。
