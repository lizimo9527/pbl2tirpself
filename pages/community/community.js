// pages/community/community.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchText: '',
    hotCategories: [
      { id: 1, name: '饮食', icon: '🍽️', count: 312 },
      { id: 2, name: '交通', icon: '🚗', count: 156 },
      { id: 3, name: '住宿', icon: '🏨', count: 234 },
      { id: 4, name: '景点', icon: '🏞️', count: 189 }
    ],
    travelStyles: [
      { id: 1, name: '特种兵式', icon: '⚡', desc: '高效打卡' },
      { id: 2, name: '拍照打卡式', icon: '📸', desc: '记录美好' },
      { id: 3, name: '细品慢游式', icon: '🌿', desc: '深度体验' }
    ],
    latestPosts: [
      {
        id: 1,
        authorAvatar: '/static/images/default-avatar.png',
        authorName: '旅行达人',
        createTime: '2小时前',
        title: '云南大理深度游攻略',
        content: '分享我在大理7天的深度游玩体验，包括小众景点和美食推荐...',
        likes: 45,
        comments: 23,
        tag: '国内游'
      },
      {
        id: 2,
        authorAvatar: '/static/images/default-avatar.png',
        authorName: '摄影爱好者',
        createTime: '5小时前',
        title: '日本京都红叶季摄影指南',
        content: '京都红叶季最佳拍摄地点和时间安排，附详细路线规划...',
        likes: 78,
        comments: 34,
        tag: '出境游'
      },
      {
        id: 3,
        authorAvatar: '/static/images/default-avatar.png',
        authorName: '自驾游玩家',
        createTime: '1天前',
        title: '川西环线自驾游全攻略',
        content: '成都出发，7天川西小环线自驾游路线，包含住宿和美食推荐...',
        likes: 112,
        comments: 56,
        tag: '自驾游'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('社区页面加载');
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
   * 搜索帖子
   */
  searchPosts() {
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
   * 查看分类
   */
  viewCategory(e) {
    const category = e.currentTarget.dataset.category;
    wx.showToast({
      title: `查看分类: ${category}`,
      icon: 'none'
    });
  },

  /**
   * 选择旅行风格
   */
  selectTravelStyle(e) {
    const style = e.currentTarget.dataset.style;
    wx.showToast({
      title: `选择旅行风格: ${style}`,
      icon: 'none'
    });
  },

  /**
   * 查看全部帖子
   */
  viewAllPosts() {
    wx.showToast({
      title: '查看全部帖子',
      icon: 'none'
    });
  },

  /**
   * 查看帖子详情
   */
  viewPostDetail(e) {
    const postId = e.currentTarget.dataset.post;
    wx.showToast({
      title: `查看帖子详情: ${postId}`,
      icon: 'none'
    });
  },

  /**
   * 创建帖子
   */
  createPost() {
    wx.navigateTo({
      url: '/pages/publish/publish'
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('社区页面显示');
  }
})