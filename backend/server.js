import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 限流保护（防止滥用）
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 分钟
  max: 100, // 每个 IP 最多 100 次请求
  message: '请求过于频繁，请稍后再试'
});
app.use('/api', limiter);

// 初始化 AI 客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// 儿童内容安全过滤
function isChildSafe(text) {
  const bannedWords = [
    '暴力', '死亡', '恐怖', '成人', '血腥', '武器',
    'kill', 'death', 'blood', 'weapon', 'violence', 'adult'
  ];
  const lowerText = text.toLowerCase();
  return !bannedWords.some(word => lowerText.includes(word));
}

// 生成卡片的主接口
app.post('/api/generate-cards', async (req, res) => {
  try {
    const { topic, ageRange, cardCount = 5, includeImages = false } = req.body;
    
    console.log(`收到请求：主题=${topic}, 年龄=${ageRange}, 数量=${cardCount}`);
    
    // 用 Claude 生成卡片文本
    const prompt = `你是一位儿童教育专家，请为${ageRange}的孩子生成${cardCount}张学习卡片。
主题：${topic}

要求：
1. 每张卡片包含：正面（问题/词汇）、背面（答案/解释）
2. 语言简单易懂，适合儿童
3. 内容积极、安全、无暴力或成人内容
4. 输出纯 JSON 数组格式：[{"front": "...", "back": "...", "image_prompt": "..."}]
5. image_prompt 用英文描述，用于生成卡通插图

示例：
[{"front": "这是什么动物？🐘", "back": "大象！它有长长的鼻子和大大的耳朵。", "image_prompt": "cartoon style elephant, colorful, children's book illustration, cute, simple background"}]

请直接返回 JSON 数组，不要有其他文字。`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }]
    });
    
    let cards;
    try {
      cards = JSON.parse(message.content[0].text);
    } catch (e) {
      console.error('JSON 解析失败:', e);
      throw new Error('AI 返回格式错误');
    }
    
    // 安全检查
    cards = cards.filter(card => 
      isChildSafe(card.front) && 
      isChildSafe(card.back)
    );
    
    // 可选：生成插图
    if (includeImages) {
      console.log('开始生成插图...');
      for (const card of cards) {
        if (card.image_prompt) {
          try {
            const image = await openai.images.generate({
              model: 'dall-e-3',
              prompt: card.image_prompt + ', children book style, bright colors, cute, simple background, no text',
              n: 1,
              size: '1024x1024'
            });
            card.image_url = image.data[0].url;
            console.log(`生成图片：${card.front}`);
          } catch (imgErr) {
            console.error('图片生成失败:', imgErr.message);
            card.image_url = null; // 失败时不中断
          }
        }
      }
    }
    
    res.json({ 
      success: true, 
      cards,
      count: cards.length,
      message: `成功生成${cards.length}张卡片`
    });
    
  } catch (error) {
    console.error('生成失败:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || '生成失败，请稍后重试'
    });
  }
});

// 健康检查接口
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📝 健康检查：http://localhost:${PORT}/api/health`);
});
