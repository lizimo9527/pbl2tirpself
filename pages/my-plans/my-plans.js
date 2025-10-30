// pages/my-plans/my-plans.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentFilter: 'all',
    plansList: [
      {
        id: 1,
        title: '云南大理深度游攻略',
        status: 'published',
        statusText: '已发布',
        destination: '云南大理',
        createTime: '2024-10-25',
        views: 156,
        likes: 45,
        comments: 23
      },
      {
        id: 2,
        title: '成都美食探店指南',
        status: 'draft',
        statusText: '草稿',
        destination: '四川成都',
        createTime: '2024-10-20',
        views: 0,
        likes: 0,
        comments: 0
      },
      {
        id: 3,
        title: '日本京都红叶季摄影攻略',
        status: 'published',
        statusText: '已发布',
        destination: '日本京都',
        createTime: '2024-10-15',
        views: 234,
        likes: 89,
        comments: 45
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('我的攻略页面加载');
  },

  /**
   * 筛选攻略
   */
  filterPlans(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({
      currentFilter: filter
    });
    
    wx.showToast({
      title: `显示${this.getFilterText(filter)}攻略`,
      icon: 'none'
    });
  },

  /**
   * 获取筛选文本
   */
  getFilterText(filter) {
    const filterMap = {
      'all': '全部',
      'published': '已发布',
      'draft': '草稿',
      'favorite': '收藏'
    };
    return filterMap[filter] || '全部';
  },

  /**
   * 查看攻略详情
   */
  viewPlanDetail(e) {
    const planId = e.currentTarget.dataset.plan;
    wx.navigateTo({
      url: `/pages/guide/guide-enhanced?id=${planId}`
    });
  },

  /**
   * 编辑攻略
   */
  editPlan(e) {
    const planId = e.currentTarget.dataset.plan;
    wx.navigateTo({
      url: `/pages/create/create?id=${planId}&type=edit`
    });
  },

  /**
   * 删除攻略
   */
  deletePlan(e) {
    const planId = e.currentTarget.dataset.plan;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个攻略吗？此操作不可恢复。',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '攻略已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 分享攻略
   */
  sharePlan(e) {
    const planId = e.currentTarget.dataset.plan;
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none'
    });
  },

  /**
   * 创建新攻略
   */
  createNewPlan() {
    wx.navigateTo({
      url: '/pages/create/create'
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