// pages/create/create.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    destination: '',
    content: '',
    imagePath: '',
    tagInput: '',
    tags: [],
    selectedLocation: null,
    markers: [],
    mapZoom: 12
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('创建攻略页面加载');
  },

  /**
   * 输入框事件处理
   */
  onTitleInput(e) {
    this.setData({
      title: e.detail.value
    });
  },

  onDestinationInput(e) {
    this.setData({
      destination: e.detail.value
    });
  },

  onContentInput(e) {
    this.setData({
      content: e.detail.value
    });
  },

  onTagInput(e) {
    this.setData({
      tagInput: e.detail.value
    });
  },

  /**
   * 添加标签
   */
  addTag(e) {
    const tag = this.data.tagInput.trim();
    if (tag && this.data.tags.length < 5) {
      const newTags = [...this.data.tags, tag];
      this.setData({
        tags: newTags,
        tagInput: ''
      });
    }
  },

  /**
   * 移除标签
   */
  removeTag(e) {
    const index = e.currentTarget.dataset.index;
    const newTags = [...this.data.tags];
    newTags.splice(index, 1);
    this.setData({
      tags: newTags
    });
  },

  /**
   * 选择图片
   */
  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          imagePath: res.tempFilePaths[0]
        });
      }
    });
  },

  /**
   * 移除图片
   */
  removeImage() {
    this.setData({
      imagePath: ''
    });
  },

  /**
   * 地图相关方法
   */
  locateOnMap() {
    if (!this.data.destination.trim()) {
      wx.showToast({
        title: '请先输入目的地',
        icon: 'none'
      });
      return;
    }
    
    // 模拟地理编码
    wx.showLoading({
      title: '正在定位...'
    });
    
    setTimeout(() => {
      wx.hideLoading();
      this.setData({
        selectedLocation: {
          longitude: 116.3974,
          latitude: 39.9093,
          address: this.data.destination
        }
      });
      wx.showToast({
        title: '定位成功',
        icon: 'success'
      });
    }, 1500);
  },

  searchOnMap() {
    wx.showToast({
      title: '打开地图搜索',
      icon: 'none'
    });
  },

  addMarker() {
    if (!this.data.selectedLocation) {
      wx.showToast({
        title: '请先定位目的地',
        icon: 'none'
      });
      return;
    }
    
    const newMarker = {
      id: Date.now(),
      longitude: this.data.selectedLocation.longitude,
      latitude: this.data.selectedLocation.latitude,
      title: this.data.destination,
      iconPath: '/static/images/marker.png',
      width: 30,
      height: 30
    };
    
    const markers = [...this.data.markers, newMarker];
    this.setData({
      markers: markers
    });
    wx.showToast({
      title: '标记添加成功',
      icon: 'success'
    });
  },

  clearMarkers() {
    if (this.data.markers.length === 0) {
      wx.showToast({
        title: '暂无标记可清除',
        icon: 'none'
      });
      return;
    }
    
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有地图标记吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            markers: []
          });
          wx.showToast({
            title: '标记已清除',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 保存草稿
   */
  saveDraft() {
    if (!this.data.title.trim()) {
      wx.showToast({
        title: '请输入攻略标题',
        icon: 'none'
      });
      return;
    }

    // 模拟保存草稿逻辑
    const draftData = {
      title: this.data.title,
      destination: this.data.destination,
      content: this.data.content,
      tags: this.data.tags,
      imagePath: this.data.imagePath,
      createTime: new Date().toISOString()
    };

    // 保存到本地存储
    try {
      wx.setStorageSync('guideDraft', draftData);
      wx.showToast({
        title: '草稿保存成功',
        icon: 'success'
      });
    } catch (e) {
      wx.showToast({
        title: '保存失败',
        icon: 'none'
      });
    }
  },

  /**
   * 发布攻略
   */
  publishGuide() {
    if (!this.data.title.trim()) {
      wx.showToast({
        title: '请输入攻略标题',
        icon: 'none'
      });
      return;
    }

    if (!this.data.content.trim()) {
      wx.showToast({
        title: '请输入攻略内容',
        icon: 'none'
      });
      return;
    }

    // 模拟发布逻辑
    const guideData = {
      title: this.data.title,
      destination: this.data.destination,
      content: this.data.content,
      tags: this.data.tags,
      imagePath: this.data.imagePath,
      publishTime: new Date().toISOString(),
      status: 'published'
    };

    wx.showLoading({
      title: '发布中...'
    });

    // 模拟网络请求
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      });
      
      // 发布成功后返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 2000);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 页面显示时检查是否有草稿
    try {
      const draftData = wx.getStorageSync('guideDraft');
      if (draftData) {
        this.setData({
          title: draftData.title || '',
          destination: draftData.destination || '',
          content: draftData.content || '',
          tags: draftData.tags || [],
          imagePath: draftData.imagePath || ''
        });
      }
    } catch (e) {
      console.log('无草稿数据');
    }
  }
})