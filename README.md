# AI Kids Flashcard Generator 🎨

一个使用国外 AI（Claude + DALL-E 3）生成适合儿童的学习卡片的 Web 应用。

## ✨ 功能特点

- 🤖 使用 **Claude 3.5 Sonnet** 生成适合儿童的卡片内容
- 🖼️ 可选 **DALL-E 3** 生成卡通插图
- 🎯 支持自定义年龄范围（3-5 岁、6-8 岁、9-12 岁）
- 🌍 后端部署在 Vercel，解决网络访问问题
- 📱 响应式设计，支持手机和桌面
- 🛡️ 内置儿童内容安全过滤

## 🚀 在线演示

- **前端**: https://kids-flashcard-frontend-nishuoxihuan.vercel.app
- **后端 API**: https://kids-flashcard-backend-nishuoxihuan.vercel.app

## 📦 本地开发

### 1. 克隆项目

```bash
git clone https://github.com/Nishuoxihuan/kids-flashcard-ai.git
cd kids-flashcard-ai
```

### 2. 配置环境变量

复制环境变量模板：

```bash
cp backend/.env.example backend/.env
```

编辑 `backend/.env` 文件，填入你的 API Key：

```env
# OpenAI API Key (用于 DALL-E 3 插图)
OPENAI_API_KEY=sk-xxxxx

# Anthropic API Key (用于 Claude 文本生成)
ANTHROPIC_API_KEY=sk-ant-xxxxx

# 服务器端口
PORT=3000

# 生产环境设置
NODE_ENV=production
```

### 3. 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd ../frontend
npm install
```

### 4. 启动开发服务器

```bash
# 启动后端（终端 1）
cd backend
npm run dev

# 启动前端（终端 2）
cd frontend
npm run dev
```

访问 `http://localhost:5173` 查看应用。

## 📖 部署到 Vercel

详见 [DEPLOY.md](DEPLOY.md) 中的完整部署指南。

## 🎯 使用示例

1. 打开网页，输入主题（如："动物"、"数字"、"颜色"）
2. 选择年龄范围（3-5 岁、6-8 岁、9-12 岁）
3. 点击"生成卡片"
4. AI 会在 5-10 秒内生成 5 张学习卡片
5. 可下载为 PNG 或直接打印

## 🛠️ 技术栈

- **前端**: React + Vite + TailwindCSS
- **后端**: Node.js + Express
- **AI 文本**: Anthropic Claude 3.5 Sonnet
- **AI 图片**: OpenAI DALL-E 3
- **部署**: Vercel（前后端分离部署）

## ⚠️ 注意事项

1. **API 费用**: 每次生成约 $0.20（文本 +5 张图），请注意控制成本
2. **内容安全**: 已内置基础过滤，但建议家长审核后再给孩子使用
3. **Vercel 限制**: 免费版有 100 小时/月构建时长限制，生产使用建议升级

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题，请通过 GitHub Issues 联系。
