// n8n工作流服务
class N8NService {
  constructor() {
    // n8n工作流API配置 - 使用真实webhook地址
    this.baseURL = 'https://lzm.app.n8n.cloud/webhook/44c8111b-fc92-4461-abc7-d7181b2077ea';
    this.apiKey = ''; // webhook通常不需要API密钥
  }

  /**
   * 调用n8n工作流生成AI旅行攻略
   * @param {Object} userInput - 用户输入信息
   * @param {string} userInput.destination - 目的地
   * @param {number} userInput.days - 旅行天数
   * @param {number} userInput.budget - 预算
   * @param {string} userInput.preferences - 偏好
   * @param {string} userInput.travelType - 旅行类型（家庭/情侣/独自等）
   * @returns {Promise<Object>} - AI生成的攻略数据
   */
  async generateTravelPlan(userInput) {
    try {
      const response = await uni.request({
        url: this.baseURL, // 直接使用webhook地址
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          userInput: userInput,
          timestamp: new Date().toISOString(),
          platform: 'mini-program',
          action: 'generate-travel-plan'
        }
      });

      if (response.statusCode === 200) {
        return response.data;
      } else {
        throw new Error(`n8n工作流调用失败: ${response.statusCode}`);
      }
    } catch (error) {
      console.error('n8n服务调用错误:', error);
      throw error;
    }
  }

  /**
   * 解析用户输入，提取关键信息
   * @param {string} message - 用户输入的消息
   * @returns {Object} - 解析后的旅行信息
   */
  parseUserInput(message) {
    const result = {
      destination: '',
      days: 0,
      budget: 0,
      preferences: '',
      travelType: '',
      rawMessage: message
    };

    // 提取目的地
    const destinationPatterns = [
      /(?:去|想去|计划去|打算去)([^，。！？\d]{2,10})/, 
      /(?:在|到)([^，。！？\d]{2,10})(?:旅游|旅行|玩)/
    ];
    
    for (const pattern of destinationPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        result.destination = match[1].trim();
        break;
      }
    }

    // 提取天数
    const daysMatch = message.match(/(\d+)(?:天|日)/);
    if (daysMatch) {
      result.days = parseInt(daysMatch[1]);
    }

    // 提取预算
    const budgetMatch = message.match(/(\d+)(?:元|块钱|预算)/);
    if (budgetMatch) {
      result.budget = parseInt(budgetMatch[1]);
    }

    // 提取偏好
    const preferenceKeywords = {
      '自然风光': ['自然', '风景', '山水', '风光', '大自然'],
      '历史文化': ['历史', '文化', '古迹', '博物馆', '传统'],
      '美食': ['美食', '小吃', '特色菜', '吃货', '美味'],
      '购物': ['购物', '买买买', '商场', '逛街', '购物中心'],
      '休闲': ['休闲', '放松', '度假', '悠闲', '慢生活'],
      '冒险': ['冒险', '刺激', '探险', '挑战', '极限']
    };

    for (const [preference, keywords] of Object.entries(preferenceKeywords)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        result.preferences = preference;
        break;
      }
    }

    // 提取旅行类型
    const travelTypeKeywords = {
      '家庭': ['家庭', '带家人', '老人', '小孩', '亲子'],
      '情侣': ['情侣', '夫妻', '男女朋友', '恋爱'],
      '独自': ['独自', '一个人', '单身'],
      '朋友': ['朋友', '哥们', '闺蜜', '同学', '同事']
    };

    for (const [type, keywords] of Object.entries(travelTypeKeywords)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        result.travelType = type;
        break;
      }
    }

    return result;
  }

  /**
   * 获取目的地坐标信息
   * @param {string} destination - 目的地名称
   * @returns {Promise<Object>} - 坐标和地图标记数据
   */
  async getDestinationCoordinates(destination) {
    try {
      const response = await uni.request({
        url: `${this.baseURL}/geocoding`,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': this.apiKey
        },
        data: {
          destination: destination
        }
      });

      if (response.statusCode === 200) {
        return response.data;
      } else {
        // 如果n8n服务不可用，使用默认坐标
        return this.getDefaultCoordinates(destination);
      }
    } catch (error) {
      console.error('获取坐标失败，使用默认坐标:', error);
      return this.getDefaultCoordinates(destination);
    }
  }

  /**
   * 获取默认坐标（备用方案）
   * @param {string} destination - 目的地名称
   * @returns {Object} - 默认坐标数据
   */
  getDefaultCoordinates(destination) {
    const defaultCoordinates = {
      '北京': { longitude: 116.3974, latitude: 39.9093 },
      '上海': { longitude: 121.4737, latitude: 31.2304 },
      '广州': { longitude: 113.2644, latitude: 23.1291 },
      '深圳': { longitude: 114.0579, latitude: 22.5431 },
      '杭州': { longitude: 120.1551, latitude: 30.2741 },
      '成都': { longitude: 104.0665, latitude: 30.5728 },
      '西安': { longitude: 108.9402, latitude: 34.3416 },
      '南京': { longitude: 118.7969, latitude: 32.0603 },
      '武汉': { longitude: 114.3054, latitude: 30.5931 },
      '重庆': { longitude: 106.5516, latitude: 29.5630 },
      '云南': { longitude: 102.7123, latitude: 25.0406 },
      '大理': { longitude: 100.2676, latitude: 25.6065 },
      '丽江': { longitude: 100.2330, latitude: 26.8721 },
      '三亚': { longitude: 109.5119, latitude: 18.2528 },
      '厦门': { longitude: 118.0894, latitude: 24.4798 }
    };

    const coords = defaultCoordinates[destination] || { longitude: 116.3974, latitude: 39.9093 };
    
    return {
      destination: destination,
      coordinates: coords,
      markers: [{
        name: destination,
        longitude: coords.longitude,
        latitude: coords.latitude
      }]
    };
  }

  /**
   * 模拟AI响应（开发环境使用）
   * @param {Object} userInput - 用户输入信息
   * @returns {Promise<Object>} - 模拟的AI响应
   */
  async mockAIResponse(userInput) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { destination, days, budget, preferences, travelType } = userInput;
    
    let response = {
      success: true,
      plan: {
        title: `${destination}${days}日游${travelType ? `(${travelType})` : ''}`,
        destination: destination,
        days: days || 3,
        budget: budget || 5000,
        preferences: preferences || '综合',
        travelType: travelType || '自由行',
        itinerary: [],
        tips: [],
        recommendations: []
      },
      mapData: null
    };

    // 生成行程安排
    for (let i = 1; i <= (days || 3); i++) {
      response.plan.itinerary.push({
        day: i,
        title: `第${i}天`,
        activities: [
          `上午：游览${destination}著名景点`,
          `下午：体验当地特色活动`,
          `晚上：品尝地道美食`
        ]
      });
    }

    // 生成提示和建议
    response.plan.tips = [
      '建议提前预订住宿和交通',
      '注意当地天气变化',
      '准备好必要的旅行证件'
    ];

    response.plan.recommendations = [
      '推荐尝试当地特色美食',
      '可以购买一些当地特产作为纪念',
      '注意保护环境，文明旅游'
    ];

    // 获取地图数据
    response.mapData = await this.getDestinationCoordinates(destination);

    return response;
  }
}

// 创建单例实例
export default new N8NService();