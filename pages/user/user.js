// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      name: '旅行爱好者',
      level: 'Lv.5 资深玩家',
      desc: '热爱旅行，喜欢探索未知的世界',
      stats: {
        plans: 12,
        followers: 156,
        following: 89,
        likes: 234
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('个人中心页面加载');
  },

  /**
   * 查看我的攻略
   */
  viewMyPlans() {
    wx.navigateTo({
      url: '/pages/my-plans/my-plans'
    });
  },

  /**
   * 查看我的搭子
   */
  viewMyMatches() {
    wx.showToast({
      title: '查看我的搭子',
      icon: 'none'
    });
  },

  /**
   * 查看我的帖子
   */
  viewMyPosts() {
    wx.showToast({
      title: '查看我的帖子',
      icon: 'none'
    });
  },

  /**
   * 查看我的收藏
   */
  viewMyFavorites() {
    wx.showToast({
      title: '查看我的收藏',
      icon: 'none'
    });
  },

  /**
   * 编辑资料
   */
  editProfile() {
    wx.showToast({
      title: '编辑资料',
      icon: 'none'
    });
  },

  /**
   * 账号设置
   */
  accountSettings() {
    wx.showToast({
      title: '账号设置',
      icon: 'none'
    });
  },

  /**
   * 通知设置
   */
  notificationSettings() {
    wx.showToast({
      title: '通知设置',
      icon: 'none'
    });
  },

  /**
   * 隐私设置
   */
  privacySettings() {
    wx.showToast({
      title: '隐私设置',
      icon: 'none'
    });
  },

  /**
   * 帮助中心
   */
  helpCenter() {
    wx.showToast({
      title: '帮助中心',
      icon: 'none'
    });
  },

  /**
   * 关于应用
   */
  aboutApp() {
    wx.showModal({
      title: '关于TripSelf',
      content: 'TripSelf - 旅行自助服务平台
版本: 1.0.0
打造您的专属旅行体验',
      showCancel: false
    });
  },

  /**
   * 退出登录
   */
  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '退出中...'
          });
          
          // 模拟退出登录
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '退出成功',
              icon: 'success'
            });
            
            // 返回首页
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/index/index'
              });
            }, 1500);
          }, 1000);
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('个人中心页面显示');
  }
})