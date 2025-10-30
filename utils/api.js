// API接口模拟工具
const api = {
  // 模拟延迟
  delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms))
  },
  
  // 模拟网络请求
  async request(url, options = {}) {
    await this.delay()
    
    // 模拟成功响应
    return {
      success: true,
      data: null,
      message: '请求成功'
    }
  },
  
  // 用户相关API
  user: {
    // 登录
    async login(credentials) {
      await api.delay(1000)
      
      // 模拟登录成功
      return {
        success: true,
        data: {
          id: 1,
          username: credentials.username || '用户' + Date.now(),
          avatar: '/static/logo.png',
          token: 'mock_token_' + Date.now()
        },
        message: '登录成功'
      }
    },
    
    // 注册
    async register(userInfo) {
      await api.delay(1000)
      
      return {
        success: true,
        data: {
          id: Date.now(),
          username: userInfo.username,
          avatar: '/static/logo.png',
          token: 'mock_token_' + Date.now()
        },
        message: '注册成功'
      }
    },
    
    // 获取用户信息
    async getUserInfo() {
      await api.delay(500)
      
      return {
        success: true,
        data: {
          id: 1,
          username: '旅行达人',
          avatar: '/static/logo.png',
          stats: {
            guides: 12,
            posts: 28,
            matches: 5
          }
        }
      }
    }
  },
  
  // 攻略相关API
  guide: {
    // 获取攻略列表
    async getGuideList(params = {}) {
      await api.delay(800)
      
      const mockGuides = [
        {
          id: 1,
          title: '北京三日游完整攻略',
          destination: '北京',
          category: '景点',
          style: '特种兵式',
          cover: '/static/logo.png',
          rating: 4.8,
          author: '旅行达人',
          createTime: '2024-10-20'
        },
        {
          id: 2,
          title: '成都美食探店攻略',
          destination: '成都',
          category: '饮食',
          style: '拍照打卡式',
          cover: '/static/logo.png',
          rating: 4.9,
          author: '美食爱好者',
          createTime: '2024-10-19'
        },
        {
          id: 3,
          title: '上海外滩夜景攻略',
          destination: '上海',
          category: '景点',
          style: '细品慢游式',
          cover: '/static/logo.png',
          rating: 4.7,
          author: '摄影爱好者',
          createTime: '2024-10-18'
        }
      ]
      
      // 根据参数过滤
      let filteredGuides = mockGuides
      
      if (params.category) {
        filteredGuides = filteredGuides.filter(guide => guide.category === params.category)
      }
      
      if (params.destination) {
        filteredGuides = filteredGuides.filter(guide => guide.destination.includes(params.destination))
      }
      
      return {
        success: true,
        data: filteredGuides,
        total: filteredGuides.length
      }
    },
    
    // 获取攻略详情
    async getGuideDetail(id) {
      await api.delay(600)
      
      const mockDetail = {
        id: parseInt(id),
        title: '北京三日游完整攻略',
        destination: '北京',
        travelDate: '2024-12-01 至 2024-12-03',
        category: '景点',
        style: '特种兵式',
        cover: '/static/logo.png',
        budget: '约2000元',
        transportation: '地铁+公交',
        accommodation: '经济型酒店',
        food: '北京特色美食',
        days: [
          {
            title: '故宫天安门一日游',
            places: [
              { time: '09:00', name: '天安门广场', type: '景点' },
              { time: '10:30', name: '故宫博物院', type: '景点' },
              { time: '12:30', name: '王府井小吃街', type: '美食' },
              { time: '14:00', name: '景山公园', type: '景点' }
            ]
          }
        ],
        tips: [
          '建议提前预约故宫门票',
          '长城建议选择八达岭或慕田峪',
          '注意天气变化，带好防晒用品'
        ]
      }
      
      return {
        success: true,
        data: mockDetail
      }
    },
    
    // 创建攻略
    async createGuide(guideData) {
      await api.delay(1000)
      
      return {
        success: true,
        data: {
          id: Date.now(),
          ...guideData,
          createTime: new Date().toISOString()
        },
        message: '攻略创建成功'
      }
    },
    
    // 更新攻略
    async updateGuide(id, guideData) {
      await api.delay(800)
      
      return {
        success: true,
        data: {
          id: parseInt(id),
          ...guideData,
          updateTime: new Date().toISOString()
        },
        message: '攻略更新成功'
      }
    },
    
    // 删除攻略
    async deleteGuide(id) {
      await api.delay(500)
      
      return {
        success: true,
        message: '攻略删除成功'
      }
    }
  },
  
  // 帖子相关API
  post: {
    // 获取帖子列表
    async getPostList(params = {}) {
      await api.delay(700)
      
      const mockPosts = [
        {
          id: 1,
          title: '北京胡同美食探店攻略',
          content: '今天带大家探索北京胡同里的隐藏美食，每一家都是本地人才知道的好味道！',
          category: '饮食',
          author: '旅行达人',
          avatar: '/static/logo.png',
          images: ['/static/logo.png'],
          likes: 128,
          comments: 45,
          shares: 23,
          createTime: '2小时前'
        },
        {
          id: 2,
          title: '故宫最佳拍照机位分享',
          content: '避开人群，找到故宫最美的拍照角度，让你的照片刷爆朋友圈！',
          category: '景点',
          author: '摄影爱好者',
          avatar: '/static/logo.png',
          images: ['/static/logo.png'],
          likes: 89,
          comments: 32,
          shares: 15,
          createTime: '5小时前'
        }
      ]
      
      // 根据参数过滤
      let filteredPosts = mockPosts
      
      if (params.category && params.category !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === params.category)
      }
      
      return {
        success: true,
        data: filteredPosts,
        total: filteredPosts.length
      }
    },
    
    // 创建帖子
    async createPost(postData) {
      await api.delay(1000)
      
      return {
        success: true,
        data: {
          id: Date.now(),
          ...postData,
          author: '当前用户',
          avatar: '/static/logo.png',
          likes: 0,
          comments: 0,
          shares: 0,
          createTime: '刚刚'
        },
        message: '帖子发布成功'
      }
    }
  },
  
  // 匹配相关API
  match: {
    // 获取匹配列表
    async getMatchList() {
      await api.delay(800)
      
      const mockMatches = [
        {
          id: 1,
          name: '小美',
          avatar: '/static/logo.png',
          type: '拍照打卡式',
          tags: ['摄影', '美食', '城市探索'],
          score: 85
        },
        {
          id: 2,
          name: '阿强',
          avatar: '/static/logo.png',
          type: '特种兵式',
          tags: ['高效', '打卡', '攻略达人'],
          score: 78
        }
      ]
      
      return {
        success: true,
        data: mockMatches
      }
    },
    
    // 开始匹配
    async startMatching(params) {
      await api.delay(1500)
      
      return {
        success: true,
        data: {
          matchId: Date.now(),
          status: 'matching',
          estimatedTime: '30秒'
        },
        message: '开始匹配搭子'
      }
    }
  }
}

export default api