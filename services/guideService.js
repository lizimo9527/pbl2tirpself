// 攻略数据存储服务
class GuideService {
  constructor() {
    this.storageKey = 'travel_guides';
    this.initTemplateGuides();
  }

  // 初始化模板攻略数据
  initTemplateGuides() {
    const guides = this.getAllGuides();
    const templateGuides = this.getTemplateGuides();
    
    // 检查是否已经存在模板攻略
    const existingTemplateIds = guides.filter(g => g.isTemplate).map(g => g.id);
    const newTemplates = templateGuides.filter(template => !existingTemplateIds.includes(template.id));
    
    if (newTemplates.length > 0) {
      const updatedGuides = [...newTemplates, ...guides];
      uni.setStorageSync(this.storageKey, JSON.stringify(updatedGuides));
    }
  }

  // 获取模板攻略数据
  getTemplateGuides() {
    return [
      {
        id: 'hebei_classic_3days',
        title: '河北经典3日游',
        destination: '承德、秦皇岛、山海关',
        content: `第一天：承德避暑山庄
- 上午：抵达承德，游览避暑山庄，感受清代皇家园林的宏伟
- 下午：参观普宁寺，了解藏传佛教文化
- 晚上：品尝承德特色美食，入住承德市区

第二天：秦皇岛北戴河
- 上午：前往秦皇岛，游览北戴河海滨浴场
- 下午：参观鸽子窝公园，欣赏海景日落
- 晚上：海鲜大餐，入住北戴河

第三天：山海关
- 上午：游览天下第一关——山海关
- 下午：参观老龙头，感受长城入海的壮观
- 晚上：返回，结束愉快的河北之旅`,
        tags: ['河北旅游', '经典路线', '3天行程', '历史古迹'],
        status: 'published',
        createTime: '2024-01-01T00:00:00.000Z',
        updateTime: '2024-01-01T00:00:00.000Z',
        isTemplate: true,
        mapMarkers: [
          {
            id: 1,
            latitude: 40.9769,
            longitude: 117.9061,
            title: '承德避暑山庄',
            iconPath: '/static/images/marker.png'
          },
          {
            id: 2,
            latitude: 39.9389,
            longitude: 119.5886,
            title: '北戴河海滨',
            iconPath: '/static/images/marker.png'
          },
          {
            id: 3,
            latitude: 40.0083,
            longitude: 119.7536,
            title: '山海关',
            iconPath: '/static/images/marker.png'
          }
        ]
      },
      {
        id: 'hebei_cultural_5days',
        title: '河北文化深度5日游',
        destination: '保定、正定、赵县',
        content: `第一天：保定直隶总督署
- 上午：抵达保定，参观直隶总督署，了解清代官署建筑
- 下午：游览古莲花池，感受北方园林的精致
- 晚上：品尝保定驴肉火烧，入住保定

第二天：满城汉墓
- 上午：参观满城汉墓，探索汉代墓葬文化
- 下午：游览清西陵，了解清代帝王陵寝
- 晚上：返回保定市区

第三天：正定古城
- 上午：前往正定，参观隆兴寺，欣赏宋代木构建筑
- 下午：游览临济寺，了解禅宗文化
- 晚上：入住正定古城

第四天：赵州桥
- 上午：前往赵县，参观世界闻名的赵州桥
- 下午：游览柏林禅寺，感受佛教文化
- 晚上：返回石家庄

第五天：石家庄市区
- 上午：参观河北省博物馆
- 下午：自由活动，购物休闲
- 晚上：结束文化之旅`,
        tags: ['河北文化', '深度游', '5天行程', '历史探索'],
        status: 'published',
        createTime: '2024-01-01T00:00:00.000Z',
        updateTime: '2024-01-01T00:00:00.000Z',
        isTemplate: true,
        mapMarkers: [
          {
            id: 1,
            latitude: 38.8510,
            longitude: 115.4900,
            title: '保定直隶总督署',
            iconPath: '/static/images/marker.png'
          },
          {
            id: 2,
            latitude: 38.7350,
            longitude: 114.5700,
            title: '正定隆兴寺',
            iconPath: '/static/images/marker.png'
          },
          {
            id: 3,
            latitude: 37.7560,
            longitude: 114.7690,
            title: '赵州桥',
            iconPath: '/static/images/marker.png'
          }
        ]
      },
      {
        id: 'hebei_natural_4days',
        title: '河北自然风光4日游',
        destination: '野三坡、白石山、苍岩山',
        content: `第一天：野三坡国家地质公园
- 上午：抵达野三坡，游览百里峡景区
- 下午：体验拒马河漂流，感受山水之美
- 晚上：入住野三坡景区

第二天：白石山国家地质公园
- 上午：前往白石山，欣赏奇峰怪石
- 下午：徒步登山，观赏云海奇观
- 晚上：入住涞源县城

第三天：苍岩山
- 上午：游览苍岩山，参观悬空寺
- 下午：探访古建筑群，感受宗教文化
- 晚上：返回石家庄

第四天：嶂石岩
- 上午：前往嶂石岩，欣赏丹霞地貌
- 下午：自由活动，拍照留念
- 晚上：结束自然之旅`,
        tags: ['自然风光', '户外探险', '4天行程', '地质公园'],
        status: 'published',
        createTime: '2024-01-01T00:00:00.000Z',
        updateTime: '2024-01-01T00:00:00.000Z',
        isTemplate: true,
        mapMarkers: [
          {
            id: 1,
            latitude: 39.6830,
            longitude: 115.3880,
            title: '野三坡',
            iconPath: '/static/images/marker.png'
          },
          {
            id: 2,
            latitude: 39.2000,
            longitude: 114.6830,
            title: '白石山',
            iconPath: '/static/images/marker.png'
          },
          {
            id: 3,
            latitude: 37.9500,
            longitude: 114.1500,
            title: '苍岩山',
            iconPath: '/static/images/marker.png'
          }
        ]
      },
      {
        id: 'hebei_greatwall_2days',
        title: '河北长城精华2日游',
        destination: '金山岭长城、喜峰口长城',
        content: `第一天：金山岭长城
- 上午：抵达金山岭，开始长城徒步
- 下午：欣赏长城壮丽景色，拍照留念
- 晚上：入住长城脚下民宿

第二天：喜峰口长城
- 上午：前往喜峰口，游览水下长城奇观
- 下午：参观潘家口水库，感受长城与水景的完美结合
- 晚上：结束长城之旅`,
        tags: ['长城文化', '摄影之旅', '2天行程', '户外徒步'],
        status: 'published',
        createTime: '2024-01-01T00:00:00.000Z',
        updateTime: '2024-01-01T00:00:00.000Z',
        isTemplate: true,
        mapMarkers: [
          {
            id: 1,
            latitude: 40.6830,
            longitude: 117.2330,
            title: '金山岭长城',
            iconPath: '/static/images/marker.png'
          },
          {
            id: 2,
            latitude: 40.3830,
            longitude: 118.2330,
            title: '喜峰口长城',
            iconPath: '/static/images/marker.png'
          }
        ]
      }
    ];
  }

  // 获取所有攻略
  getGuides() {
    try {
      const guides = uni.getStorageSync(this.storageKey);
      return guides ? JSON.parse(guides) : [];
    } catch (error) {
      console.error('获取攻略列表失败:', error);
      return [];
    }
  }

  // 获取所有攻略（兼容旧版本）
  getAllGuides() {
    return this.getGuides();
  }

  // 根据ID获取攻略详情
  getGuideById(id) {
    const guides = this.getAllGuides();
    return guides.find(guide => guide.id === id);
  }

  // 保存攻略（创建或更新）
  saveGuide(guideData) {
    try {
      const guides = this.getAllGuides();
      
      if (guideData.id) {
        // 更新现有攻略
        const index = guides.findIndex(guide => guide.id === guideData.id);
        if (index !== -1) {
          guides[index] = {
            ...guides[index],
            ...guideData,
            updateTime: new Date().toISOString()
          };
        }
      } else {
        // 创建新攻略
        const newGuide = {
          id: this.generateId(),
          ...guideData,
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
          author: 'default',
          // 保持原有的状态，不强制设置为published
          status: guideData.status || 'draft'
        };
        guides.unshift(newGuide); // 新攻略放在最前面
      }

      uni.setStorageSync(this.storageKey, JSON.stringify(guides));
      return true;
    } catch (error) {
      console.error('保存攻略失败:', error);
      return false;
    }
  }

  // 删除攻略
  deleteGuide(id) {
    try {
      const guides = this.getAllGuides();
      const filteredGuides = guides.filter(guide => guide.id !== id);
      uni.setStorageSync(this.storageKey, JSON.stringify(filteredGuides));
      return true;
    } catch (error) {
      console.error('删除攻略失败:', error);
      return false;
    }
  }

  // 获取用户创建的攻略
  getUserGuides(userId = 'default') {
    const guides = this.getAllGuides();
    return guides.filter(guide => guide.author === userId);
  }

  // 生成唯一ID
  generateId() {
    return 'guide_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // 搜索攻略
  searchGuides(keyword) {
    const guides = this.getAllGuides();
    if (!keyword) return guides;
    
    const lowerKeyword = keyword.toLowerCase();
    return guides.filter(guide => 
      guide.title.toLowerCase().includes(lowerKeyword) ||
      guide.destination.toLowerCase().includes(lowerKeyword) ||
      (guide.tags && guide.tags.some(tag => tag.toLowerCase().includes(lowerKeyword)))
    );
  }
}

export default new GuideService();