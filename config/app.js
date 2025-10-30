// 应用配置文件
const appConfig = {
  // 应用信息
  appInfo: {
    name: 'TripSelf',
    version: '1.0.0',
    description: '旅行自助服务平台'
  },
  
  // 主题配置
  theme: {
    primaryColor: '#1A9E8F',
    secondaryColor: '#157d6f',
    backgroundColor: '#f5f5f5',
    textColor: '#333333',
    textSecondary: '#666666',
    borderColor: '#e9ecef'
  },
  
  // API配置
  api: {
    baseURL: 'https://api.tripself.com',
    timeout: 10000,
    retryCount: 3
  },
  
  // 地图配置
  map: {
    provider: 'amap', // 高德地图
    key: 'your_map_key_here',
    zoom: 15
  },
  
  // 上传配置
  upload: {
    maxSize: 10 * 1024 * 1024, // 10MB
    accept: ['image/jpeg', 'image/png', 'image/gif'],
    maxCount: 9
  },
  
  // 缓存配置
  cache: {
    guideListTTL: 3600, // 1小时
    postListTTL: 1800, // 30分钟
    userInfoTTL: 7200 // 2小时
  },
  
  // 功能开关
  features: {
    enableMap: true,
    enableChat: true,
    enablePush: true,
    enableAnalytics: true
  }
}

// 分类配置
const categories = {
  // 旅行分类
  travelCategories: [
    { value: '饮食', label: '🍜 饮食', color: '#FF6B6B' },
    { value: '交通', label: '🚗 交通', color: '#4ECDC4' },
    { value: '住宿', label: '🏨 住宿', color: '#45B7D1' },
    { value: '景点', label: '🏛️ 景点', color: '#96CEB4' }
  ],
  
  // 旅行风格
  travelStyles: [
    { value: '特种兵式', label: '⚡ 特种兵式', desc: '高效打卡' },
    { value: '拍照打卡式', label: '📸 拍照打卡式', desc: '记录美好' },
    { value: '细品慢游式', label: '☕ 细品慢游式', desc: '体验感至上' },
    { value: '文化探索式', label: '📚 文化探索式', desc: '深度体验' }
  ],
  
  // 地点类型
  placeTypes: [
    { value: '景点', label: '🏛️ 景点' },
    { value: '美食', label: '🍜 美食' },
    { value: '购物', label: '🛍️ 购物' },
    { value: '娱乐', label: '🎭 娱乐' },
    { value: '交通', label: '🚗 交通' },
    { value: '住宿', label: '🏨 住宿' }
  ]
}

// 默认数据
const defaultData = {
  // 默认用户信息
  user: {
    username: '旅行者',
    avatar: '/static/logo.png',
    stats: {
      guides: 0,
      posts: 0,
      matches: 0
    }
  },
  
  // 默认攻略模板
  guideTemplate: {
    title: '',
    destination: '',
    travelDate: '',
    category: '',
    style: '',
    visibility: 'public',
    days: []
  },
  
  // 默认帖子模板
  postTemplate: {
    content: '',
    images: [],
    category: '',
    guideTitle: ''
  }
}

// 错误码配置
const errorCodes = {
  // 网络错误
  NETWORK_ERROR: 1001,
  TIMEOUT_ERROR: 1002,
  
  // 业务错误
  INVALID_PARAMS: 2001,
  UNAUTHORIZED: 2002,
  FORBIDDEN: 2003,
  NOT_FOUND: 2004,
  
  // 系统错误
  SERVER_ERROR: 5001,
  DATABASE_ERROR: 5002
}

export {
  appConfig,
  categories,
  defaultData,
  errorCodes
}