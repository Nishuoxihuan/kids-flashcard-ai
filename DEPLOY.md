# 部署指南 🚀

## 方案 A：部署到 Vercel（最简单，推荐）

### 前置准备

1. 注册 Vercel 账号：https://vercel.com/signup（可用 GitHub 登录）
2. 安装 Vercel CLI（可选）：
   ```bash
   npm install -g vercel
   ```

### 第一步：部署后端（Node.js API）

#### 方法 1：使用 Vercel 网页端（推荐）

1. 登录 Vercel 控制台：https://vercel.com/dashboard
2. 点击 **"New Project"**
3. 选择 **"Import Git Repository"**
4. 找到并选择 `kids-flashcard-ai` 仓库
5. **重要**：点击 **"Configure"** 前，先设置：
   - **Framework Preset**: 选择 `Other`
   - **Root Directory**: 点击 `Edit`，输入 `backend`
   - **Build Command**: 留空（Node.js 无需构建）
   - **Output Directory**: 留空
6. 点击 **"Environment Variables"**，添加以下变量：
   - `OPENAI_API_KEY` = 你的 OpenAI API Key
   - `ANTHROPIC_API_KEY` = 你的 Anthropic API Key
   - `PORT` = `3000`
   - `NODE_ENV` = `production`
7. 点击 **"Deploy"**

部署成功后，你会得到类似 `https://kids-flashcard-ai-xxx.vercel.app` 的后端 URL。

#### 方法 2：使用 Vercel CLI

```bash
cd backend

# 登录 Vercel
vercel login

# 首次部署（会提示项目名称）
vercel

# 按提示选择：
# - Set up and deploy? Y
# - Which scope? 选择你的账号
# - Link to existing project? N
# - Project name? kids-flashcard-backend
# - Directory? ./
# - Override settings? N

# 添加环境变量
vercel env add OPENAI_API_KEY production
vercel env add ANTHROPIC_API_KEY production
vercel env add PORT production

# 重新部署（应用环境变量）
vercel --prod
```

### 第二步：部署前端（React + Vite）

#### 方法 1：使用 Vercel 网页端

1. 在 Vercel 控制台再次点击 **"New Project"**
2. 选择同一个 Git 仓库 `kids-flashcard-ai`
3. **重要**：点击 **"Configure"** 前，设置：
   - **Framework Preset**: 选择 `Vite`
   - **Root Directory**: 点击 `Edit`，输入 `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. 点击 **"Environment Variables"**（前端不需要 API Key，可留空）
5. 点击 **"Deploy"**

部署成功后，你会得到类似 `https://kids-flashcard-ai-xxx.vercel.app` 的前端 URL。

#### 方法 2：使用 Vercel CLI

```bash
cd frontend

# 登录 Vercel（如果还没登录）
vercel login

# 首次部署
vercel

# 按提示选择：
# - Set up and deploy? Y
# - Which scope? 选择你的账号
# - Link to existing project? N
# - Project name? kids-flashcard-frontend
# - Directory? ./
# - Override settings? N

# 部署到生产环境
vercel --prod
```

### 第三步：配置前端 API 地址

部署完成后，你需要让前端知道后端的 URL：

#### 方案 A：修改代码（推荐）

1. 编辑 `frontend/src/App.jsx`，找到 `fetch('/api/generate-cards'` 这一行
2. 修改为完整的后端 URL：
   ```javascript
   const response = await fetch('https://kids-flashcard-backend.vercel.app/api/generate-cards', {
     // ...其他配置
   })
   ```
3. 提交并推送代码：
   ```bash
   git add .
   git commit -m "Update API URL to production"
   git push
   ```
4. Vercel 会自动重新部署前端

#### 方案 B：使用环境变量

1. 在 `frontend/` 目录下创建 `.env.production` 文件：
   ```env
   VITE_API_URL=https://kids-flashcard-backend.vercel.app
   ```
2. 修改 `frontend/src/App.jsx`：
   ```javascript
   const API_URL = import.meta.env.VITE_API_URL || '/api'
   
   const response = await fetch(`${API_URL}/generate-cards`, {
     // ...其他配置
   })
   ```
3. 提交并推送代码

### 第四步：验证部署

1. 访问前端 URL，应该能看到应用界面
2. 输入主题，点击"生成卡片"
3. 如果成功生成卡片，说明前后端连接正常
4. 如果失败，检查：
   - 浏览器控制台（F12）是否有 CORS 错误
   - Vercel 后端日志：https://vercel.com/dashboard → 选择项目 → Deployments → 点击最新部署 → "View Logs"

## 方案 B：部署到海外 VPS（成本更低，适合生产）

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
| Vercel（免费） | $0 | 最简单，自动 HTTPS，CDN | 100 小时/月构建限制 |
| Vercel（Pro） | $20/月 | 无限构建，更高配额 | 需要付费 |
| VPS | $6-10 | 完全控制，无限制 | 需手动配置 |
| Docker | $6-10（VPS 上） | 易迁移，易管理 | 需学习 Docker |

## 监控和维护

### 查看日志

```bash
# Vercel 网页端
https://vercel.com/dashboard → 选择项目 → Deployments → View Logs

# Vercel CLI
vercel logs

# PM2（VPS）
pm2 logs kids-flashcard

# Docker
docker logs kids-flashcard
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

### Q1: Vercel 部署失败，提示 "Build Error"
A: 检查 `vercel.json` 配置是否正确，确保 `backend/` 目录包含 `package.json` 和 `server.js`。

### Q2: 前端调用 API 时出现 CORS 错误
A: 后端已启用 `cors()` 中间件，应该没问题。如果还有问题，检查浏览器控制台的具体错误信息。

### Q3: API 调用失败，返回 500 错误
A: 
1. 检查 Vercel 环境变量是否正确配置
2. 查看 Vercel 日志：https://vercel.com/dashboard → Deployments → View Logs
3. 确认 API Key 格式正确（没有多余空格）

### Q4: 生成速度慢或超时
A: 
- 首次生成需要 10-20 秒（含图片），纯文本约 3-5 秒
- Vercel 免费版有 10 秒超时限制，建议关闭图片生成或升级 Pro
- 考虑使用 VPS 部署（无超时限制）

### Q5: 费用超标
A: 
- 在代码中添加每日限额
- 关闭图片生成功能（默认不勾选）
- 使用 Vercel 用量监控：https://vercel.com/dashboard → Usage
