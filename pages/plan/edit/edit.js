// pages/plan/edit/edit.js
Page({
  data: {
    currentDateIndex: 0,
    dates: [
      { name: '7月3号', desc: '第一天' },
      { name: '7月4号', desc: '第二天' },
      { name: '7月5号', desc: '第三天' },
      { name: '7月6号', desc: '第四天' }
    ],
    locations: {
      0: [
        { 
          name: '北京故宫', 
          type: '景点',
          transport: '驾车',
          distance: '7km',
          duration: '21分钟',
          note: '建议上午9点到达，游览时间约3小时'
        },
        { 
          name: '王府井大街', 
          type: '购物',
          transport: '步行',
          distance: '3km',
          duration: '11分钟',
          note: '午餐推荐：全聚德烤鸭'
        }
      ],
      1: [],
      2: [],
      3: []
    },
    showSearch: false,
    showNoteModal: false,
    searchKeyword: '',
    searchResults: [
      { name: '天安门广场', type: '景点' },
      { name: '颐和园', type: '景点' },
      { name: '北京首都国际机场', type: '交通枢纽' },
      { name: '北京饭店', type: '住宿' },
      { name: '全聚德烤鸭店', type: '餐饮' }
    ],
    currentNote: '',
    currentEditingLocation: null,
    routeInfo: {
      totalDistance: '10km',
      totalDuration: '32分钟',
      segments: [
        { distance: '7km', duration: '21分钟' },
        { distance: '3km', duration: '11分钟' }
      ]
    }
  },

  // 计算属性
  getCurrentLocations() {
    return this.data.locations[this.data.currentDateIndex] || []
  },

  // 日期切换
  switchDate(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      currentDateIndex: index
    })
  },

  // 地图控制
  zoomIn() {
    wx.showToast({ title: '地图放大', icon: 'none' })
  },

  zoomOut() {
    wx.showToast({ title: '地图缩小', icon: 'none' })
  },

  // 搜索功能
  showSearchModal() {
    this.setData({ showSearch: true })
  },

  hideSearchModal() {
    this.setData({ 
      showSearch: false,
      searchKeyword: '' 
    })
  },

  searchLocations() {
    if (!this.data.searchKeyword.trim()) {
      wx.showToast({ title: '请输入搜索关键词', icon: 'none' })
      return
    }
    wx.showToast({ title: `搜索: ${this.data.searchKeyword}`, icon: 'none' })
  },

  // 地点管理
  addLocationFromSearch(e) {
    const index = e.currentTarget.dataset.index
    const result = this.data.searchResults[index]
    
    const newLocation = {
      name: result.name,
      type: result.type,
      transport: '驾车',
      distance: '0km',
      duration: '0分钟',
      note: ''
    }
    
    const locations = this.data.locations
    locations[this.data.currentDateIndex].push(newLocation)
    
    this.setData({ locations })
    this.hideSearchModal()
    wx.showToast({ title: '地点添加成功', icon: 'success' })
  },

  editLocation(e) {
    const index = e.currentTarget.dataset.index
    const location = this.getCurrentLocations()[index]
    
    this.setData({
      showNoteModal: true,
      currentNote: location.note || '',
      currentEditingLocation: { index, location }
    })
  },

  deleteLocation(e) {
    const index = e.currentTarget.dataset.index
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个地点吗？',
      success: (res) => {
        if (res.confirm) {
          const locations = this.data.locations
          locations[this.data.currentDateIndex].splice(index, 1)
          
          this.setData({ locations })
          wx.showToast({ title: '删除成功', icon: 'success' })
        }
      }
    })
  },

  // 备注管理
  hideNoteModal() {
    this.setData({
      showNoteModal: false,
      currentNote: '',
      currentEditingLocation: null
    })
  },

  saveNote() {
    if (this.data.currentEditingLocation) {
      const { index, location } = this.data.currentEditingLocation
      const locations = this.data.locations
      locations[this.data.currentDateIndex][index].note = this.data.currentNote
      
      this.setData({ locations })
      wx.showToast({ title: '备注保存成功', icon: 'success' })
    }
    this.hideNoteModal()
  },

  // 路线规划
  generateRoute() {
    const currentLocations = this.getCurrentLocations()
    if (currentLocations.length < 2) {
      wx.showToast({ title: '请至少添加2个地点进行路线规划', icon: 'none' })
      return
    }
    
    wx.showToast({ title: '正在生成智能路线...', icon: 'loading' })
    
    // 模拟路线规划
    setTimeout(() => {
      const routeInfo = {
        totalDistance: `${currentLocations.length * 5}km`,
        totalDuration: `${currentLocations.length * 15}分钟`,
        segments: currentLocations.map((_, index) => ({
          distance: `${index + 1}km`,
          duration: `${index + 5}分钟`
        }))
      }
      
      this.setData({ routeInfo })
      wx.showToast({ title: '路线规划完成', icon: 'success' })
    }, 1000)
  },

  // 地图聚焦
  focusOnLocation(e) {
    const index = e.currentTarget.dataset.index
    const location = this.getCurrentLocations()[index]
    wx.showToast({ 
      title: `聚焦到: ${location.name}`,
      icon: 'none' 
    })
  },

  // 输入框变化
  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value })
  },

  onNoteInput(e) {
    this.setData({ currentNote: e.detail.value })
  },

  onLoad(options) {
    // 页面加载时的初始化
  },

  onReady() {
    // 页面渲染完成
  },

  onShow() {
    // 页面显示
  },

  onHide() {
    // 页面隐藏
  },

  onUnload() {
    // 页面卸载
  }
})