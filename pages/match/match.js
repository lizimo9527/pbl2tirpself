// pages/match/match.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    destinationOptions: ['全部目的地', '国内游', '出境游', '东南亚', '欧洲', '北美'],
    destinationIndex: 0,
    dateOptions: ['全部时间', '近期出行', '本月', '下个月', '半年内'],
    dateIndex: 0,
    recommendedPartners: [
      {
        id: 1,
        avatar: '/static/images/default-avatar.png',
        name: '旅行达人小王',
        tags: ['摄影', '美食', '文化'],
        matchRate: 85,
        destination: '云南大理',
        travelDate: '2024-12-15',
        travelStyle: '深度游'
      },
      {
        id: 2,
        avatar: '/static/images/default-avatar.png',
        name: '背包客小李',
        tags: ['徒步', '露营', '探险'],
        matchRate: 92,
        destination: '川西环线',
        travelDate: '2024-11-20',
        travelStyle: '自驾游'
      },
      {
        id: 3,
        avatar: '/static/images/default-avatar.png',
        name: '美食爱好者小张',
        tags: ['美食探店', '城市漫步', '休闲'],
        matchRate: 78,
        destination: '成都重庆',
        travelDate: '2024-12-01',
        travelStyle: '美食之旅'
      }
    ],
    myMatches: [
      {
        id: 1,
        avatar: '/static/images/default-avatar.png',
        name: '摄影达人',
        status: '已匹配',
        lastContact: '2小时前'
      },
      {
        id: 2,
        avatar: '/static/images/default-avatar.png',
        name: '自驾游伙伴',
        status: '等待回复',
        lastContact: '1天前'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('匹配搭子页面加载');
  },

  /**
   * 目的地选择
   */
  onDestinationChange(e) {
    this.setData({
      destinationIndex: e.detail.value
    });
  },

  /**
   * 时间选择
   */
  onDateChange(e) {
    this.setData({
      dateIndex: e.detail.value
    });
  },

  /**
   * 搜索搭子
   */
  searchPartners() {
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
    }, 1500);
  },

  /**
   * 查看搭子详情
   */
  viewPartnerDetail(e) {
    const partnerId = e.currentTarget.dataset.partner;
    wx.showToast({
      title: `查看搭子详情: ${partnerId}`,
      icon: 'none'
    });
  },

  /**
   * 联系搭子
   */
  contactPartner(e) {
    const partnerId = e.currentTarget.dataset.partner;
    wx.showModal({
      title: '联系搭子',
      content: '确定要联系这位搭子吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '联系请求已发送',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 喜欢搭子
   */
  likePartner(e) {
    const partnerId = e.currentTarget.dataset.partner;
    wx.showToast({
      title: '已添加到喜欢列表',
      icon: 'success'
    });
  },

  /**
   * 查看全部匹配
   */
  viewAllMatches() {
    wx.showToast({
      title: '查看全部匹配',
      icon: 'none'
    });
  },

  /**
   * 查看匹配详情
   */
  viewMatchDetail(e) {
    const matchId = e.currentTarget.dataset.match;
    wx.showToast({
      title: `查看匹配详情: ${matchId}`,
      icon: 'none'
    });
  },

  /**
   * 创建匹配
   */
  createMatch() {
    wx.showModal({
      title: '创建匹配',
      content: '确定要创建新的匹配请求吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '匹配请求已创建',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('匹配搭子页面显示');
  }
})