// pages/templates/templates.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText: '',
    currentCategory: 'all',
    templatesList: [
      {
        id: 1,
        image: '/static/images/template-1.jpg',
        category: '国内游',
        title: '云南大理深度游模板',
        description: '包含大理古城、洱海、苍山等经典景点，适合7天深度游',
        rating: 4.8,
        usageCount: 234,
        tags: ['大理', '洱海', '古城', '7天']
      },
      {
        id: 2,
        image: '/static/images/template-2.jpg',
        category: '出境游',
        title: '日本京都红叶季模板',
        description: '京都红叶季最佳路线，包含寺庙、美食、购物推荐',
        rating: 4.9,
        usageCount: 189,
        tags: ['京都', '红叶', '寺庙', '5天']
      },
      {
        id: 3,
        image: '/static/images/template-3.jpg',
        category: '自驾游',
        title: '川西环线自驾游模板',
        description: '成都出发，川西小环线自驾游，包含高原风光和藏族文化',
        rating: 4.7,
        usageCount: 156,
        tags: ['川西', '自驾', '高原', '8天']
      },
      {
        id: 4,
        image: '/static/images/template-4.jpg',
        category: '背包客',
        title: '东南亚背包客模板',
        description: '泰国、越南、柬埔寨三国背包游，经济实惠的旅行方案',
        rating: 4.6,
        usageCount: 98,
        tags: ['东南亚', '背包客', '经济', '15天']
      },
      {
        id: 5,
        image: '/static/images/template-5.jpg',
        category: '美食之旅',
        title: '成都重庆美食模板',
        description: '川渝美食深度游，包含火锅、小吃、特色餐厅推荐',
        rating: 4.8,
        usageCount: 312,
        tags: ['成都', '重庆', '美食', '6天']
      },
      {
        id: 6,
        image: '/static/images/template-6.jpg',
        category: '摄影攻略',
        title: '西藏摄影之旅模板',
        description: '西藏高原风光摄影，包含最佳拍摄点和时间安排',
        rating: 4.5,
        usageCount: 145,
        tags: ['西藏', '摄影', '高原', '10天']
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('模板页面加载');
  },

  /**
   * 搜索输入
   */
  onSearchInput(e) {
    this.setData({
      searchText: e.detail.value
    });
  },

  /**
   * 搜索模板
   */
  searchTemplates() {
    if (!this.data.searchText.trim()) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '搜索中...'
    });

    // 模拟搜索请求
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '搜索完成',
        icon: 'success'
      });
    }, 1000);
  },

  /**
   * 筛选模板
   */
  filterTemplates(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      currentCategory: category
    });
    
    wx.showToast({
      title: `显示${this.getCategoryText(category)}模板`,
      icon: 'none'
    });
  },

  /**
   * 获取分类文本
   */
  getCategoryText(category) {
    const categoryMap = {
      'all': '全部',
      'domestic': '国内游',
      'overseas': '出境游',
      'self-driving': '自驾游',
      'backpacking': '背包客',
      'food': '美食之旅'
    };
    return categoryMap[category] || '全部';
  },

  /**
   * 使用模板
   */
  useTemplate(e) {
    const templateId = e.currentTarget.dataset.template;
    wx.showModal({
      title: '使用模板',
      content: '确定要使用这个模板创建新攻略吗？',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: `/pages/create/create?templateId=${templateId}`
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})