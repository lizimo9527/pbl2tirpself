// pages/guide/guide-enhanced.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guideData: {
      title: '云南大理深度游攻略',
      destination: '云南大理',
      travelDate: '2024-11-15 至 2024-11-22',
      duration: 7,
      tags: ['大理', '洱海', '古城', '深度游', '摄影'],
      author: {
        avatar: '/static/images/default-avatar.png',
        name: '旅行达人小王',
        level: 'Lv.8 资深玩家'
      },
      views: 156,
      likes: 45,
      comments: 23,
      overview: '本攻略详细介绍了云南大理7天深度游的行程安排，包含大理古城、洱海、苍山等经典景点，以及当地美食和住宿推荐。适合喜欢深度体验的旅行者。',
      itinerary: [
        {
          day: 1,
          title: '抵达大理，游览古城',
          time: '09:00-18:00',
          location: '大理古城',
          description: '上午抵达大理，入住古城附近的客栈。下午游览大理古城，参观五华楼、洋人街，感受古城的历史文化氛围。',
          tips: '古城内有很多特色小吃，推荐尝试烤乳扇和鲜花饼。'
        },
        {
          day: 2,
          title: '环洱海骑行',
          time: '08:00-17:00',
          location: '洱海',
          description: '租自行车环洱海骑行，沿途欣赏洱海美景，途经喜洲古镇、双廊古镇等景点。',
          tips: '建议早上出发，避开中午的强烈阳光，记得做好防晒。'
        },
        {
          day: 3,
          title: '苍山徒步',
          time: '08:30-16:00',
          location: '苍山',
          description: '乘坐苍山索道上山，徒步游览苍山景区，欣赏高山植被和远眺洱海全景。',
          tips: '山上气温较低，记得带件外套。索道票建议提前购买。'
        }
      ],
      budget: [
        { category: '交通', amount: 1200 },
        { category: '住宿', amount: 1400 },
        { category: '餐饮', amount: 800 },
        { category: '门票', amount: 400 },
        { category: '购物', amount: 500 }
      ],
      totalBudget: 4300
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('攻略详情页面加载');
    if (options.id) {
      // 根据ID加载攻略数据
      this.loadGuideData(options.id);
    }
  },

  /**
   * 加载攻略数据
   */
  loadGuideData(guideId) {
    wx.showLoading({
      title: '加载中...'
    });

    // 模拟数据加载
    setTimeout(() => {
      wx.hideLoading();
      // 这里可以根据ID加载不同的攻略数据
      console.log(`加载攻略ID: ${guideId}`);
    }, 500);
  },

  /**
   * 点赞攻略
   */
  likeGuide() {
    const guideData = this.data.guideData;
    this.setData({
      'guideData.likes': guideData.likes + 1
    });
    
    wx.showToast({
      title: '点赞成功',
      icon: 'success'
    });
  },

  /**
   * 显示评论
   */
  showComments() {
    wx.showToast({
      title: '评论功能开发中',
      icon: 'none'
    });
  },

  /**
   * 分享攻略
   */
  shareGuide() {
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none'
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