// Dify工作流配置
const difyConfig = {
  // Dify服务器配置
  server: {
    baseURL: 'https://dify.aipfuture.com', // Dify应用地址
    apiKey: 'Bearer app-1i1suD6MWKtMYQuq', // 使用正确的API密钥和应用ID
    timeout: 30000 // 30秒超时
  },

  // 应用和工作流配置
  applications: {
    travelAssistant: {
      appId: '1i1suD6MWKtMYQuq', // 旅行助手应用ID
      chatEndpoint: '/v1/chat-messages', // 聊天消息端点
      endpoint: '/v1/workflows/run' // 工作流运行端点
    }
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
  },

  // Dify API请求配置
  apiConfig: {
    headers: {
      'Authorization': 'Bearer {apiKey}',
      'Content-Type': 'application/json'
    }
  }
};

export default difyConfig;