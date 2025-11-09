// 腾讯地图配置
const mapConfig = {
  // 腾讯地图开发者密钥（需要申请）
  key: 'WAOBZ-VZZKB-BY5UJ-NTNHU-5YXJQ-JEBWH', // 腾讯地图API密钥
  
  // 地图默认配置
  defaultCenter: {
    longitude: 116.3974, // 北京经度
    latitude: 39.9093    // 北京纬度
  },
  
  // 地图缩放级别
  zoomLevel: 12,
  
  // 地图样式
  mapStyle: 'standard', // standard:标准, dark:深色, light:浅色
  
  // 控件配置
  controls: {
    scale: true,     // 比例尺
    zoom: true,      // 缩放控件
    compass: true,   // 指南针
    location: true   // 定位控件
  },
  
  // 标记点配置
  markers: {
    defaultIcon: '/static/images/map/marker.png',
    selectedIcon: '/static/images/map/marker-selected.png',
    size: { width: 30, height: 30 }
  }
}

// 腾讯地图API URL
const mapApiUrls = {
  // 逆地址解析（坐标转地址）
  reverseGeocoder: 'https://apis.map.qq.com/ws/geocoder/v1/',
  
  // 地址解析（地址转坐标）
  geocoder: 'https://apis.map.qq.com/ws/geocoder/v1/',
  
  // 路线规划
  direction: 'https://apis.map.qq.com/ws/direction/v1/',
  
  // 地点搜索
  search: 'https://apis.map.qq.com/ws/place/v1/search/',
  
  // 周边搜索
  around: 'https://apis.map.qq.com/ws/place/v1/around/'
}

// 地图工具函数
const mapUtils = {
  // 获取当前位置
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      uni.getLocation({
        type: 'gcj02', // 坐标系类型，gcj02为火星坐标系
        success: (res) => {
          resolve({
            longitude: res.longitude,
            latitude: res.latitude,
            speed: res.speed,
            accuracy: res.accuracy
          })
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
  
  // 地址解析（地址转坐标）
  geocode(address, region = '') {
    return new Promise((resolve, reject) => {
      const requestData = {
        key: mapConfig.key,
        address: address
      }
      // 只有当region不为空时才添加region参数
      if (region && region.trim()) {
        requestData.region = region.trim()
      }
      
      uni.request({
        url: mapApiUrls.geocoder,
        data: requestData,
        success: (res) => {
          if (res.data.status === 0) {
            resolve(res.data.result)
          } else {
            reject(new Error(res.data.message || '地址解析失败'))
          }
        },
        fail: (err) => {
          reject(new Error('网络请求失败: ' + (err.errMsg || '未知错误')))
        }
      })
    })
  },
  
  // 逆地址解析（坐标转地址）
  reverseGeocode(latitude, longitude) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: mapApiUrls.reverseGeocoder,
        data: {
          key: mapConfig.key,
          location: `${latitude},${longitude}`,
          get_poi: 0 // 不返回周边POI列表
        },
        success: (res) => {
          if (res.data.status === 0) {
            resolve(res.data.result)
          } else {
            reject(new Error(res.data.message))
          }
        },
        fail: reject
      })
    })
  },
  
  // 搜索地点
  searchPlaces(keyword, region = '') {
    return new Promise((resolve, reject) => {
      const requestData = {
        key: mapConfig.key,
        keyword: keyword,
        page_size: 20,
        page_index: 1
      }
      // 腾讯地图地点搜索API使用boundary参数，格式为region(城市名)
      // 只有当region不为空时才添加boundary参数
      if (region && region.trim()) {
        requestData.boundary = `region(${region.trim()})`
      }
      // 注意：不要同时传递region和boundary参数，腾讯地图API会报错
      
      uni.request({
        url: mapApiUrls.search,
        data: requestData,
        success: (res) => {
          if (res.data.status === 0) {
            resolve(res.data.data || [])
          } else {
            reject(new Error(res.data.message || '搜索失败'))
          }
        },
        fail: (err) => {
          reject(new Error('网络请求失败: ' + (err.errMsg || '未知错误')))
        }
      })
    })
  },
  
  // 路线规划
  getRoute(from, to, mode = 'driving') {
    return new Promise((resolve, reject) => {
      uni.request({
        url: mapApiUrls.direction,
        data: {
          key: mapConfig.key,
          from: `${from.latitude},${from.longitude}`,
          to: `${to.latitude},${to.longitude}`,
          output: 'json',
          mode: mode // driving:驾车, walking:步行, bicycling:骑行
        },
        success: (res) => {
          if (res.data.status === 0) {
            resolve(res.data.result)
          } else {
            reject(new Error(res.data.message))
          }
        },
        fail: reject
      })
    })
  }
}

export { mapConfig, mapApiUrls, mapUtils }