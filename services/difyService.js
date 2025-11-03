// Dify工作流服务
import difyConfig from '@/config/dify.config.js';

class DifyService {
  constructor() {
    // Dify API配置
    this.baseURL = difyConfig.server.baseURL;
    this.apiKey = difyConfig.server.apiKey;
    this.appConfig = difyConfig.applications.travelAssistant;
  }

  /**
   * 调用Dify工作流生成AI旅行攻略
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
      // 构建Dify工作流请求数据
      const requestData = {
        inputs: {
          destination: userInput.destination || '',
          days: userInput.days || 3,
          budget: userInput.budget || 5000,
          preferences: userInput.preferences || '综合',
          travel_type: userInput.travelType || '自由行',
          user_message: userInput.rawMessage || ''
        },
        response_mode: 'blocking', // 阻塞模式，等待完整响应
        user: 'mini-program-user',
        files: []
      };

      const response = await uni.request({
        url: `${this.baseURL}${this.appConfig.endpoint}`,
        method: 'POST',
        header: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: requestData
      });

      if (response.statusCode === 200) {
        return this.parseDifyResponse(response.data);
      } else {
        throw new Error(`Dify工作流调用失败: ${response.statusCode}`);
      }
    } catch (error) {
      console.error('Dify服务调用错误:', error);
      // 如果Dify服务不可用，使用模拟数据
      return await this.mockAIResponse(userInput);
    }
  }

  /**
   * 解析Dify工作流响应
   * @param {Object} difyResponse - Dify API响应
   * @returns {Object} - 标准化的旅行攻略数据
   */
  parseDifyResponse(difyResponse) {
    try {
      // 解析Dify返回的文本内容
      const content = difyResponse.data || difyResponse.answer || '';
      
      // 尝试从文本中提取结构化数据
      return this.extractTravelPlanFromText(content);
    } catch (error) {
      console.error('Dify响应解析错误:', error);
      return {
        success: false,
        error: '响应解析失败',
        plan: null
      };
    }
  }

  /**
   * 从文本中提取旅行攻略结构
   * @param {string} text - Dify返回的文本内容
   * @returns {Object} - 结构化的旅行攻略
   */
  extractTravelPlanFromText(text) {
    // 简单的文本解析逻辑，可以根据实际Dify返回格式调整
    const lines = text.split('\n').filter(line => line.trim());
    
    let destination = '';
    let days = 3;
    const itinerary = [];
    const tips = [];
    const recommendations = [];
    let budget = 5000;
    let currentDay = null;

    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // 提取目的地
      if (!destination && (trimmedLine.includes('目的地') || trimmedLine.includes('前往'))) {
        const match = trimmedLine.match(/(北京|上海|广州|深圳|杭州|成都|西安|南京|武汉|重庆|云南|大理|丽江|三亚|厦门|青岛|大连|苏州|无锡|宁波)/);
        if (match) destination = match[1];
      }

      // 提取天数
      if (trimmedLine.includes('日') || trimmedLine.includes('天')) {
        const match = trimmedLine.match(/(\d+)[日天]/);
        if (match) days = parseInt(match[1]);
      }

      // 提取预算
      if (trimmedLine.includes('预算') || trimmedLine.includes('元')) {
        const match = trimmedLine.match(/(\d+)[元块]/);
        if (match) budget = parseInt(match[1]);
      }

      // 提取每日行程
      if (trimmedLine.match(/^第[一二三四五六七八九十]+[天日]/) || trimmedLine.match(/^Day\s*\d+/i)) {
        if (currentDay) itinerary.push(currentDay);
        currentDay = {
          title: trimmedLine,
          activities: []
        };
      } else if (currentDay && trimmedLine.startsWith('-')) {
        currentDay.activities.push(trimmedLine.substring(1).trim());
      }

      // 提取旅行提示
      if (trimmedLine.startsWith('💡') || trimmedLine.includes('提示')) {
        tips.push(trimmedLine.replace(/^💡\s*/, '').trim());
      }

      // 提取推荐
      if (trimmedLine.startsWith('🌟') || trimmedLine.includes('推荐')) {
        recommendations.push(trimmedLine.replace(/^🌟\s*/, '').trim());
      }
    });

    // 添加最后一个行程日
    if (currentDay) itinerary.push(currentDay);

    return {
      success: true,
      plan: {
        destination: destination || '未知目的地',
        days: days,
        budget: budget,
        itinerary: itinerary.length > 0 ? itinerary : this.generateDefaultItinerary(destination, days),
        tips: tips.length > 0 ? tips : this.generateDefaultTips(),
        recommendations: recommendations.length > 0 ? recommendations : this.generateDefaultRecommendations(destination),
        travelType: '自由行'
      },
      mapData: this.generateMapData(destination)
    };
  }

  /**
   * 生成默认行程安排
   */
  generateDefaultItinerary(destination, days) {
    const itinerary = [];
    for (let i = 1; i <= days; i++) {
      itinerary.push({
        title: `第${i}天：${destination}探索`,
        activities: [
          '上午：游览当地著名景点',
          '下午：体验当地文化和美食',
          '晚上：休闲放松，准备次日行程'
        ]
      });
    }
    return itinerary;
  }

  /**
   * 生成默认旅行提示
   */
  generateDefaultTips() {
    return [
      '提前预订住宿和交通工具',
      '准备常用药品和防晒用品',
      '了解当地天气情况，准备合适衣物',
      '保管好个人证件和贵重物品'
    ];
  }

  /**
   * 生成默认推荐
   */
  generateDefaultRecommendations(destination) {
    return [
      `品尝${destination}当地特色美食`,
      '参观当地博物馆了解历史文化',
      '体验当地特色活动或表演'
    ];
  }

  /**
   * 生成地图数据
   */
  generateMapData(destination) {
    const coordinates = {
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
      '丽江': { longitude: 100.2330, latitude: 26.8721 }
    };

    const coord = coordinates[destination] || { longitude: 116.3974, latitude: 39.9093 };
    
    return {
      destination: destination,
      markers: [
        { name: destination, longitude: coord.longitude, latitude: coord.latitude }
      ]
    };
  }

  /**
   * 解析用户输入，提取关键信息
   * @param {string} message - 用户输入的消息
   * @returns {Object} - 解析后的旅行信息
   */
  parseUserInput(message) {
    const input = {
      rawMessage: message,
      destination: '',
      days: 3,
      budget: 5000,
      preferences: '综合',
      travelType: '自由行'
    };

    // 提取目的地
    const destinationMatch = message.match(/(北京|上海|广州|深圳|杭州|成都|西安|南京|武汉|重庆|云南|大理|丽江|三亚|厦门|青岛|大连|苏州|无锡|宁波)/);
    if (destinationMatch) {
      input.destination = destinationMatch[1];
    }

    // 提取天数
    const daysMatch = message.match(/(\d+)[天日]/);
    if (daysMatch) {
      input.days = parseInt(daysMatch[1]);
    }

    // 提取预算
    const budgetMatch = message.match(/(\d+)[元块万]/);
    if (budgetMatch) {
      let budget = parseInt(budgetMatch[1]);
      if (message.includes('万')) budget *= 10000;
      input.budget = budget;
    }

    // 提取旅行类型
    if (message.includes('家庭') || message.includes('带孩子')) input.travelType = '家庭';
    else if (message.includes('情侣') || message.includes('夫妻')) input.travelType = '情侣';
    else if (message.includes('独自') || message.includes('一个人')) input.travelType = '独自';
    else if (message.includes('朋友') || message.includes('同学')) input.travelType = '朋友';

    // 提取偏好
    if (message.includes('自然') || message.includes('风景')) input.preferences = '自然风光';
    else if (message.includes('历史') || message.includes('文化')) input.preferences = '历史文化';
    else if (message.includes('美食') || message.includes('吃')) input.preferences = '美食';
    else if (message.includes('购物') || message.includes('买')) input.preferences = '购物';

    return input;
  }

  /**
   * 模拟AI响应（备用方案）
   */
  async mockAIResponse(userInput) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    return this.extractTravelPlanFromText(`根据您的需求，我为您定制了${userInput.destination}${userInput.days}日游路线。行程包含当地特色景点、美食体验和文化探索。预算建议：${userInput.budget}元。`);
  }
}

export default new DifyService();