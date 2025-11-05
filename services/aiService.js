// AI服务 - 集成Dify AI助手
import difyService from './difyService.js';

class AIService {
  constructor() {
    this.difyService = difyService;
  }

  /**
   * 生成旅游攻略
   * @param {string} prompt - 用户提示词
   * @returns {Promise<Object>} - 生成的攻略数据
   */
  async generateGuide(prompt) {
    try {
      // 从提示词中提取目的地信息
      const destination = this.extractDestination(prompt);
      
      // 构建Dify工作流输入
      const userInput = {
        destination: destination,
        days: 3, // 默认3天
        budget: 5000, // 默认5000元
        preferences: '综合',
        travelType: '自由行',
        rawMessage: prompt
      };

      // 调用Dify服务生成攻略
      const result = await this.difyService.generateTravelPlan(userInput);
      
      if (result.success) {
        return {
          success: true,
          data: {
            content: result.data.content,
            destinationData: {
              destination: destination,
              markers: this.extractMarkersFromContent(result.data.content)
            }
          }
        };
      } else {
        return {
          success: false,
          error: result.error || 'AI生成失败'
        };
      }
    } catch (error) {
      console.error('AI服务生成攻略失败:', error);
      return {
        success: false,
        error: '生成失败，请稍后重试'
      };
    }
  }

  /**
   * 从提示词中提取目的地
   * @param {string} prompt - 用户提示词
   * @returns {string} - 提取的目的地
   */
  extractDestination(prompt) {
    // 简单的目的地提取逻辑
    const destinationPatterns = [
      /(?:去|前往|到|游览|游玩|旅游)(.+?)(?:的|旅游|攻略|行程|地方|景点|城市|地区|国家)/,
      /(.+?)(?:旅游|旅行|攻略|行程|景点|地方)/,
      /(?:目的地|地点|位置)[：:](.+)/
    ];

    for (const pattern of destinationPatterns) {
      const match = prompt.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    // 如果没有匹配到特定模式，返回整个提示词作为目的地
    return prompt.trim();
  }

  /**
   * 从攻略内容中提取地图标记点
   * @param {string} content - 攻略内容
   * @returns {Array} - 地图标记点数组
   */
  extractMarkersFromContent(content) {
    // 这里可以添加更复杂的地理位置提取逻辑
    // 目前返回空数组，后续可以集成地理编码服务
    return [];
  }

  /**
   * 简化版AI生成（用于快速测试）
   * @param {string} destination - 目的地
   * @returns {Promise<Object>} - 生成的攻略数据
   */
  async generateSimpleGuide(destination) {
    try {
      // 模拟AI生成延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // 生成模拟攻略内容
      const content = this.generateMockContent(destination);
      
      return {
        success: true,
        data: {
          content: content,
          destinationData: {
            destination: destination,
            markers: []
          }
        }
      };
    } catch (error) {
      console.error('简化版AI生成失败:', error);
      return {
        success: false,
        error: '生成失败'
      };
    }
  }

  /**
   * 生成模拟攻略内容
   * @param {string} destination - 目的地
   * @returns {string} - 模拟攻略内容
   */
  generateMockContent(destination) {
    return `# ${destination}旅游攻略

## 景点推荐
1. **${destination}著名景点** - 必去的经典景点
2. **当地特色街区** - 体验当地文化
3. **自然风光区** - 欣赏美丽的自然景观

## 美食推荐
- **当地特色菜** - 品尝地道美食
- **小吃街** - 体验街头美食文化
- **网红餐厅** - 打卡热门美食地点

## 交通指南
- **公共交通**：地铁、公交方便快捷
- **出租车**：起步价合理，适合短途
- **自驾**：周边道路状况良好

## 住宿建议
- **市中心酒店**：交通便利，设施完善
- **特色民宿**：体验当地生活
- **经济型酒店**：性价比高

## 温馨提示
- 建议游玩时间：2-3天
- 最佳季节：春秋季
- 预算参考：人均2000-3000元

祝您旅途愉快！`;
  }
}

// 创建单例实例
const aiService = new AIService();

export default aiService;