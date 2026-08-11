import { useState } from 'react'

function App() {
  const [topic, setTopic] = useState('')
  const [ageRange, setAgeRange] = useState('3-5 岁')
  const [cardCount, setCardCount] = useState(5)
  const [includeImages, setIncludeImages] = useState(false)
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const generateCards = async () => {
    if (!topic.trim()) {
      setError('请输入主题')
      return
    }

    setLoading(true)
    setError('')
    setCards([])

    try {
      const response = await fetch('/api/generate-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          ageRange,
          cardCount,
          includeImages,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.message || '生成失败')
      }

      setCards(data.cards)
    } catch (err) {
      setError(err.message || '网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const downloadAsPNG = () => {
    alert('下载功能：可以使用 html2canvas 库实现，这里仅作演示')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎨 AI 儿童学习卡片生成器
          </h1>
          <p className="text-gray-600">
            使用 AI 为 3-12 岁孩子生成有趣的学习卡片
          </p>
        </div>

        {/* 输入表单 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* 主题输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📚 学习主题
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="例如：动物、数字、颜色、水果..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 年龄范围 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                👶 年龄范围
              </label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="3-5 岁">3-5 岁（幼儿园）</option>
                <option value="6-8 岁">6-8 岁（小学低年级）</option>
                <option value="9-12 岁">9-12 岁（小学高年级）</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* 卡片数量 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🎴 卡片数量：{cardCount} 张
              </label>
              <input
                type="range"
                min="3"
                max="10"
                value={cardCount}
                onChange={(e) => setCardCount(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 是否生成图片 */}
            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeImages}
                  onChange={(e) => setIncludeImages(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-3 text-sm font-medium text-gray-700">
                  🖼️ 生成插图（会增加生成时间和费用）
                </span>
              </label>
            </div>
          </div>

          {/* 生成按钮 */}
          <button
            onClick={generateCards}
            disabled={loading}
            className={`w-full py-4 rounded-lg font-semibold text-white text-lg transition-all ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? '🤖 AI 正在生成中...' : '✨ 生成学习卡片'}
          </button>

          {/* 错误提示 */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              ❌ {error}
            </div>
          )}
        </div>

        {/* 卡片展示区 */}
        {cards.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                📖 生成的学习卡片（{cards.length}张）
              </h2>
              <button
                onClick={downloadAsPNG}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                📥 下载为 PNG
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* 卡片图片（如果有） */}
                  {card.image_url && (
                    <div className="h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={card.image_url}
                        alt={card.front}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* 卡片内容 */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        📌 正面
                      </h3>
                      <p className="text-lg text-gray-700">{card.front}</p>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        💡 背面
                      </h3>
                      <p className="text-lg text-gray-700">{card.back}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 底部提示 */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>💡 提示：生成内容已进行安全过滤，但建议家长审核后再给孩子使用</p>
          <p className="mt-2">
            💰 费用估算：每次生成约 $0.20（文本 + 图片），纯文本约 $0.002
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
