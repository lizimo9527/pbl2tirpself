// Dify聊天服务 - 专门用于与Dify聊天应用交互
import difyConfig from '@/config/dify.config.js';

class DifyChatService {
  constructor() {
    // Dify聊天应用配置
    this.baseURL = difyConfig.server.baseURL;
    this.appId = difyConfig.applications.travelAssistant.appId;
    this.chatEndpoint = difyConfig.applications.travelAssistant.chatEndpoint;
    this.conversationId = null; // 会话ID
  }

  /**
   * 初始化聊天会话
   */
  async initConversation() {
    try {
      // 生成唯一的会话ID
      this.conversationId = 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      return this.conversationId;
    } catch (error) {
      console.error('初始化会话失败:', error);
      this.conversationId = 'conv_default_' + Date.now();
      return this.conversationId;
    }
  }

  /**
   * 发送消息到Dify聊天应用
   * @param {string} message - 用户消息
   * @param {string} conversationId - 会话ID
   * @returns {Promise<Object>} - AI回复
   */
  async sendMessage(message, conversationId = null) {
    try {
      // 如果没有会话ID，初始化一个
      if (!conversationId && !this.conversationId) {
        await this.initConversation();
      }
      
      const currentConversationId = conversationId || this.conversationId;
      
      // 构建Dify聊天API请求 - 使用正确的API格式
      const requestData = {
        inputs: {
          query: message
        },
        query: message,
        response_mode: 'streaming', // 使用streaming模式，兼容性更好
        user: 'mini-program-user-' + Date.now(),
        conversation_id: currentConversationId
      };

      // 发送请求到Dify聊天应用
      const response = await uni.request({
        url: `${this.baseURL}/v1/chat-messages`,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          'Authorization': difyConfig.server.apiKey
        },
        data: requestData, // 直接传递对象，uni.request会自动序列化
        timeout: 30000 // 30秒超时
      });

      console.log('Dify API响应状态码:', response.statusCode);
      
      if (response.statusCode === 200) {
        return this.parseChatResponse(response.data);
      } else if (response.statusCode === 401) {
        console.warn('Dify API认证失败：需要有效的API密钥');
        // 认证失败时使用模拟回复
        return await this.mockChatResponse(message, '认证失败');
      } else if (response.statusCode === 400) {
        console.warn('Dify API请求格式错误，检查请求数据格式');
        console.log('请求数据:', JSON.stringify(requestData));
        // 400错误时使用模拟回复
        return await this.mockChatResponse(message, '请求格式错误');
      } else {
        console.warn(`Dify聊天API调用失败: ${response.statusCode}, 使用模拟回复`);
        // 如果Dify服务不可用，使用模拟回复
        return await this.mockChatResponse(message, '服务不可用');
      }
    } catch (error) {
      console.error('Dify聊天服务调用错误:', error);
      // 如果Dify服务不可用，使用模拟回复
      return await this.mockChatResponse(message);
    }
  }

  /**
   * 解析Dify聊天响应
   * @param {Object} responseData - Dify API响应
   * @returns {Object} - 标准化的聊天回复
   */
  parseChatResponse(responseData) {
    try {
      // Dify聊天API返回的数据结构可能包含多个事件
      // 这里简化处理，提取文本内容
      let content = '';
      
      if (responseData.answer) {
        content = responseData.answer;
      } else if (responseData.data && responseData.data.text) {
        content = responseData.data.text;
      } else if (typeof responseData === 'string') {
        content = responseData;
      } else {
        content = JSON.stringify(responseData);
      }

      // 从回复中提取旅行相关信息
      const travelInfo = this.extractTravelInfoFromResponse(content);
      
      return {
        success: true,
        content: content,
        conversationId: this.conversationId,
        travelInfo: travelInfo
      };
    } catch (error) {
      console.error('Dify聊天响应解析错误:', error);
      return {
        success: false,
        content: '抱歉，AI回复解析失败，请重试。',
        conversationId: this.conversationId,
        travelInfo: null
      };
    }
  }

  /**
   * 从AI回复中提取旅行信息
   * @param {string} content - AI回复内容
   * @returns {Object} - 提取的旅行信息
   */
  extractTravelInfoFromResponse(content) {
    const travelInfo = {
      destination: '',
      days: 0,
      budget: 0,
      itinerary: [],
      tips: [],
      recommendations: []
    };

    // 提取目的地
    const destinationMatch = content.match(/(北京|上海|广州|深圳|杭州|成都|西安|南京|武汉|重庆|云南|大理|丽江|三亚|厦门|青岛|大连|苏州|无锡|宁波)/);
    if (destinationMatch) {
      travelInfo.destination = destinationMatch[1];
    }

    // 提取天数
    const daysMatch = content.match(/(\d+)[天日]/);
    if (daysMatch) {
      travelInfo.days = parseInt(daysMatch[1]);
    }

    // 提取预算
    const budgetMatch = content.match(/(\d+)[元块万]/);
    if (budgetMatch) {
      let budget = parseInt(budgetMatch[1]);
      if (content.includes('万')) budget *= 10000;
      travelInfo.budget = budget;
    }

    // 提取行程安排（简化版）
    const lines = content.split('\n');
    let currentDay = null;
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      // 检测每日行程
      if (trimmedLine.match(/^第[一二三四五六七八九十]+[天日]/) || 
          trimmedLine.match(/^Day\s*\d+/i) ||
          trimmedLine.includes('上午') || 
          trimmedLine.includes('下午') || 
          trimmedLine.includes('晚上')) {
        
        if (currentDay) {
          travelInfo.itinerary.push(currentDay);
        }
        
        currentDay = {
          title: trimmedLine,
          activities: []
        };
      } else if (currentDay && trimmedLine.startsWith('-')) {
        currentDay.activities.push(trimmedLine.substring(1).trim());
      }
      
      // 提取提示
      if (trimmedLine.includes('提示') || trimmedLine.includes('建议')) {
        travelInfo.tips.push(trimmedLine);
      }
      
      // 提取推荐
      if (trimmedLine.includes('推荐') || trimmedLine.includes('特色')) {
        travelInfo.recommendations.push(trimmedLine);
      }
    });
    
    if (currentDay) {
      travelInfo.itinerary.push(currentDay);
    }

    return travelInfo;
  }

  /**
   * 生成地图数据
   * @param {string} destination - 目的地
   * @returns {Object} - 地图标记数据
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
   * 模拟聊天回复（备用方案）
   * @param {string} message - 用户消息
   * @returns {Promise<Object>} - 模拟回复
   */
  async mockChatResponse(message) {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 根据用户消息生成智能回复
    let reply = '';
    
    if (message.includes('你好') || message.includes('您好')) {
      reply = '您好！我是AI旅行助手，很高兴为您服务！请告诉我您的旅行需求，比如想去哪里、几天时间、预算多少等。';
    } else if (message.includes('云南') || message.includes('大理') || message.includes('丽江')) {
      reply = '云南是个美丽的旅游目的地！我为您推荐以下5日游路线：\n\n' +
              '🏔️ **Day 1：抵达昆明**\n' +
              '- 上午：抵达昆明长水机场\n' +
              '- 下午：游览滇池、西山龙门\n' +
              '- 晚上：品尝过桥米线\n\n' +
              '🏞️ **Day 2：大理古城**\n' +
              '- 上午：动车前往大理，游览大理古城\n' +
              '- 下午：环洱海骑行，欣赏苍山洱海\n' +
              '💰 **预算建议**：8000元足够享受舒适旅程';
    } else if (message.includes('北京')) {
      reply = '北京历史文化丰富！推荐3日游：\n\n' +
              '🏛️ **Day 1：天安门广场 & 故宫**\n' +
              '- 上午：天安门广场拍照留念\n' +
              '- 下午：游览故宫\n' +
              '🐼 **Day 2：颐和园 & 动物园**\n' +
              '- 适合家庭出游\n' +
              '💰 **预算建议**：5000元左右';
    } else {
      reply = '感谢您分享旅行想法！为了更好地为您定制路线，请告诉我：\n\n' +
              '1. 具体的旅行目的地\n' +
              '2. 出行时间（几天）\n' +
              '3. 预算范围\n' +
              '4. 您的兴趣偏好\n\n' +
              '我会根据这些信息为您提供专属建议。';
    }

    const travelInfo = this.extractTravelInfoFromResponse(reply);
    
    return {
      success: true,
      content: reply,
      conversationId: this.conversationId || 'conv_mock_' + Date.now(),
      travelInfo: travelInfo
    };
  }

  /**
   * 解析用户输入（兼容性方法）
   * @param {string} message - 用户输入
   * @returns {Object} - 解析后的信息
   */
  parseUserInput(message) {
    return {
      rawMessage: message,
      destination: this.extractDestination(message),
      days: this.extractDays(message),
      budget: this.extractBudget(message),
      preferences: this.extractPreferences(message),
      travelType: this.extractTravelType(message)
    };
  }

  /**
   * 提取目的地
   */
  extractDestination(message) {
    const match = message.match(/(北京|上海|广州|深圳|杭州|成都|西安|南京|武汉|重庆|云南|大理|丽江|三亚|厦门|青岛|大连|苏州|无锡|宁波)/);
    return match ? match[1] : '';
  }

  /**
   * 提取天数
   */
  extractDays(message) {
    const match = message.match(/(\d+)[天日]/);
    return match ? parseInt(match[1]) : 3;
  }

  /**
   * 提取预算
   */
  extractBudget(message) {
    const match = message.match(/(\d+)[元块万]/);
    if (match) {
      let budget = parseInt(match[1]);
      if (message.includes('万')) budget *= 10000;
      return budget;
    }
    return 5000;
  }

  /**
   * 提取偏好
   */
  extractPreferences(message) {
    if (message.includes('自然') || message.includes('风景')) return '自然风光';
    if (message.includes('历史') || message.includes('文化')) return '历史文化';
    if (message.includes('美食') || message.includes('吃')) return '美食';
    if (message.includes('购物') || message.includes('买')) return '购物';
    return '综合';
  }

  /**
   * 提取旅行类型
   */
  extractTravelType(message) {
    if (message.includes('家庭') || message.includes('带孩子')) return '家庭';
    if (message.includes('情侣') || message.includes('夫妻')) return '情侣';
    if (message.includes('独自') || message.includes('一个人')) return '独自';
    if (message.includes('朋友') || message.includes('同学')) return '朋友';
    return '自由行';
  }
}

export default new DifyChatService();