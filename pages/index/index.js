// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 精简后的数据，专注于攻略制作
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  },

  /**
   * 开始制作攻略
   */
  startPlanning: function() {
    wx.navigateTo({
      url: '/pages/create/create'
    })
  },

  /**
   * 查看我的攻略
   */
  viewMyPlans: function() {
    wx.navigateTo({
      url: '/pages/my-plans/my-plans'
    })
  },

  /**
   * 查看攻略模板
   */
  viewTemplates: function() {
    wx.navigateTo({
      url: '/pages/templates/templates'
    })
  },

  /**
   * 智能路线规划
   */
  showRoutePlanning: function() {
    wx.showToast({
      title: '智能路线规划功能开发中',
      icon: 'none'
    })
  },

  /**
   * 预算管理
   */
  showBudgetManagement: function() {
    wx.showToast({
      title: '预算管理功能开发中',
      icon: 'none'
    })
  },

  /**
   * 时间安排
   */
  showTimeArrangement: function() {
    wx.showToast({
      title: '时间安排功能开发中',
      icon: 'none'
    })
  },

  /**
   * 多端同步
   */
  showMultiDeviceSync: function() {
    wx.showToast({
      title: '多端同步功能开发中',
      icon: 'none'
    })
  },

})