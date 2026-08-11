# 部署指南 🚀

> 当前默认按 NayutoAI 中转站 配置：
> - `OPENAI_BASE_URL = https://api.nayutoai.xyz/v1`
> - `OPENAI_MODEL = gpt-image-2`（Nayuto 的做图模型）

## 方案 A：部署到 Vercel（最简单，推荐）

### 前置准备

1. 注册 Vercel 账号：https://vercel.com/signup（可用 GitHub 登录）
2. 安装 Vercel CLI（可选）：
   ```bash
   npm install -g vercel
   ```

### 第一步：部署后端（Node.js API）

1. 在 Vercel 控制台导入 `kids-flashcard-ai` 仓库，Root Directory 选择 `backend`
2. 在 **Settings → Environment Variables** 中添加：
   ```text
   OPENAI_API_KEY  = 你的 NayutoAI Key
   OPENAI_BASE_URL = https://api.nayutoai.xyz/v1
   OPENAI_MODEL    = gpt-image-2

   # 如需使用 Claude 文本生成，再按需添加：
   ANTHROPIC_API_KEY  = （可选）
   ANTHROPIC_BASE_URL = https://api.nayutoai.xyz/v1  或官方地址
   ANTHROPIC_MODEL    = claude-3-5-sonnet-20241022

   NODE_ENV = production
   ```
3. 保存后 Redeploy 一次后端

（其余 Vercel / VPS / Docker 步骤保持不变，下略，与之前版本一致）
