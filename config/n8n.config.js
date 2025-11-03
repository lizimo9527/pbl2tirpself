// n8n工作流配置
const n8nConfig = {
  // n8n服务器配置
  server: {
    baseURL: 'https://lzm.app.n8n.cloud/webhook/44c8111b-fc92-4461-abc7-d7181b2077ea', // 使用真实n8n webhook地址
    apiKey: '', // 如果webhook不需要API密钥，可以留空
    timeout: 30000 // 30秒超时
  },

  // 工作流端点配置
  endpoints: {
    travelPlanGenerator: '', // 旅行攻略生成工作流（使用主webhook地址）
    geocoding: '', // 地理编码工作流
    weatherForecast: '', // 天气预报工作流
    aiChat: '' // AI聊天工作流
  },

  // 默认旅行参数
  defaultTravelParams: {
    days: 3,
    budget: 5000,
    travelType: '自由行',
    preferences: '综合'
  },

  // 支持的目的地列表
  supportedDestinations: [
    '北京', '上海', '广州', '深圳', '杭州', '成都', '西安', '南京', '武汉', '重庆',
    '云南', '大理', '丽江', '三亚', '厦门', '青岛', '大连', '苏州', '无锡', '宁波'
  ],

  // 旅行类型映射
  travelTypes: {
    '家庭': 'family',
    '情侣': 'couple', 
    '独自': 'solo',
    '朋友': 'friends',
    '商务': 'business'
  },

  // 偏好映射
  preferences: {
    '自然风光': 'nature',
    '历史文化': 'culture',
    '美食': 'food',
    '购物': 'shopping',
    '休闲': 'relaxation',
    '冒险': 'adventure'
  }
};

// 导出配置
export default n8nConfig;