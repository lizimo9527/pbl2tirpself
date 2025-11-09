// 地点名称到坐标转换服务
import { mapUtils, mapConfig } from '../config/map.config.js'

class LocationService {
  constructor() {
    this.cache = new Map() // 缓存地点坐标，避免重复请求
    this.cacheTimeout = 3600000 // 缓存过期时间：1小时
  }

  /**
   * 根据地点名称获取坐标
   * @param {string} locationName - 地点名称
   * @param {string} region - 搜索区域（可选）
   * @returns {Promise<{longitude: number, latitude: number, address: string, confidence: number}>}
   */
  async getCoordinatesByName(locationName, region = '') {
    if (!locationName || locationName.trim() === '') {
      throw new Error('地点名称不能为空')
    }

    // 检查缓存
    const cacheKey = `${locationName}_${region}`
    const cached = this.cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data
    }

    // 检查腾讯地图API密钥是否配置
    if (!mapConfig.key || mapConfig.key.trim() === '') {
      console.warn('腾讯地图API密钥未配置，将使用默认坐标')
      console.log('请前往 https://lbs.qq.com/dev/keyconsole/ 申请API密钥并填入 config/map.config.js')
      
      // 返回默认坐标并提示用户配置密钥
      const defaultCoords = {
        longitude: 116.3974,
        latitude: 39.9093,
        address: locationName,
        confidence: 0.1,
        isFallback: true
      }
      
      // 缓存默认坐标
      this.cache.set(cacheKey, {
        timestamp: Date.now(),
        data: defaultCoords
      })
      
      return defaultCoords
    }

    try {
      // 优先使用地址解析API，精度更高
      let geocodeResult = null
      try {
        geocodeResult = await mapUtils.geocode(locationName, region)
        
        if (geocodeResult && geocodeResult.location) {
          // 降低可靠性阈值，从7改为5，提高地址解析的成功率
          const reliability = geocodeResult.reliability || 5
          
          if (reliability >= 5) {
            const coordinates = {
              longitude: geocodeResult.location.lng,
              latitude: geocodeResult.location.lat,
              address: geocodeResult.address || locationName,
              confidence: reliability / 10 || 0.5,
              source: 'geocode'
            }
            
            // 更新缓存
            this.cache.set(cacheKey, {
              timestamp: Date.now(),
              data: coordinates
            })
            
            return coordinates
          }
        }
      } catch (geocodeError) {
        // 地址解析失败，继续尝试地点搜索
        console.warn('地址解析失败，尝试地点搜索:', geocodeError.message)
      }
      
      // 如果地址解析精度不够或失败，使用地点搜索API
      // 注意：searchPlaces使用boundary参数，region为空时不传递boundary参数
      const searchResults = await mapUtils.searchPlaces(locationName, region)
      
      if (searchResults && searchResults.length > 0) {
        // 寻找最匹配的结果
        let bestResult = null
        let highestScore = 0
        
        for (const result of searchResults) {
          // 计算匹配度分数
          let score = 0
          
          // 名称匹配度
          if (result.title && result.title.includes(locationName)) {
            score += 0.6
          }
          
          // 地址匹配度
          if (result.address && result.address.includes(locationName)) {
            score += 0.4
          }
          
          // 地理位置权重（优先区域内的结果）
          if (result.ad_info && result.ad_info.adcode) {
            score += 0.2
          }
          
          if (score > highestScore) {
            highestScore = score
            bestResult = result
          }
        }
        
        if (bestResult) {
          const coordinates = {
            longitude: bestResult.location.lng,
            latitude: bestResult.location.lat,
            address: bestResult.title || bestResult.address || locationName,
            confidence: Math.min(highestScore, 0.7),
            source: 'search'
          }
          
          // 更新缓存
          this.cache.set(cacheKey, {
            timestamp: Date.now(),
            data: coordinates
          })
          
          return coordinates
        }
      }
      
      // 如果以上方法都失败，尝试使用智能解析
      const smartCoords = await this.smartLocationParse(locationName, region)
      if (smartCoords) {
        return smartCoords
      }
      
      throw new Error(`无法精确找到地点: ${locationName}`)
      
    } catch (error) {
      console.error('获取地点坐标失败:', error)
      
      // 返回降级坐标，但使用更精确的默认值
      return {
        longitude: 116.3974,
        latitude: 39.9093,
        address: locationName,
        confidence: 0.1,
        isFallback: true
      }
    }
  }

  /**
   * 智能地点解析 - 针对常见地点名称进行优化
   */
  async smartLocationParse(locationName, region = '') {
    const smartLocationMap = {
      // 北京地区著名景点
      '故宫': { longitude: 116.397128, latitude: 39.916327, confidence: 0.95 },
      '天安门': { longitude: 116.397388, latitude: 39.908722, confidence: 0.95 },
      '颐和园': { longitude: 116.275596, latitude: 39.998576, confidence: 0.95 },
      '长城': { longitude: 116.570374, latitude: 40.431908, confidence: 0.9 },
      '鸟巢': { longitude: 116.396565, latitude: 39.990884, confidence: 0.95 },
      '南锣鼓巷': { longitude: 116.407045, latitude: 39.946942, confidence: 0.95 },
      
      // 上海地区著名景点
      '外滩': { longitude: 121.490158, latitude: 31.233705, confidence: 0.95 },
      '东方明珠': { longitude: 121.499717, latitude: 31.239853, confidence: 0.95 },
      '南京路': { longitude: 121.475338, latitude: 31.233247, confidence: 0.9 },
      
      // 广州地区著名景点
      '广州塔': { longitude: 113.323568, latitude: 23.106414, confidence: 0.95 },
      '白云山': { longitude: 113.279000, latitude: 23.179000, confidence: 0.9 },
      
      // 深圳地区著名景点
      '世界之窗': { longitude: 113.975022, latitude: 22.536010, confidence: 0.95 },
      '欢乐谷': { longitude: 113.985022, latitude: 22.546010, confidence: 0.9 }
    }
    
    // 检查是否在智能地图中
    for (const [key, value] of Object.entries(smartLocationMap)) {
      if (locationName.includes(key)) {
        return {
          longitude: value.longitude,
          latitude: value.latitude,
          address: locationName,
          confidence: value.confidence,
          source: 'smart_map'
        }
      }
    }
    
    return null
  }

  /**
   * 批量获取地点坐标
   * @param {Array} locationNames - 地点名称数组
   * @param {string} region - 搜索区域（可选）
   * @returns {Promise<Array>}
   */
  async getBatchCoordinates(locationNames, region = '') {
    if (!Array.isArray(locationNames)) {
      throw new Error('地点名称必须是数组')
    }

    const results = []
    
    for (const locationName of locationNames) {
      try {
        const coordinates = await this.getCoordinatesByName(locationName, region)
        results.push({
          name: locationName,
          ...coordinates,
          success: true
        })
      } catch (error) {
        results.push({
          name: locationName,
          longitude: null,
          latitude: null,
          address: locationName,
          success: false,
          error: error.message
        })
      }
      
      // 添加延迟避免API限制
      await this.delay(100)
    }
    
    return results
  }

  /**
   * 验证坐标是否有效
   * @param {number} longitude - 经度
   * @param {number} latitude - 纬度
   * @returns {boolean}
   */
  isValidCoordinates(longitude, latitude) {
    return (
      longitude !== null && 
      latitude !== null && 
      !isNaN(longitude) && 
      !isNaN(latitude) &&
      Math.abs(longitude) <= 180 &&
      Math.abs(latitude) <= 90
    )
  }

  /**
   * 根据地点名称获取坐标，如果坐标无效则重试
   * @param {string} locationName - 地点名称
   * @param {number} maxRetries - 最大重试次数
   * @returns {Promise}
   */
  async getCoordinatesWithRetry(locationName, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const coordinates = await this.getCoordinatesByName(locationName)
        
        if (this.isValidCoordinates(coordinates.longitude, coordinates.latitude)) {
          return coordinates
        }
        
        if (attempt < maxRetries) {
          console.warn(`第${attempt}次获取坐标无效，重试中...`)
          await this.delay(500 * attempt) // 指数退避
        }
      } catch (error) {
        if (attempt < maxRetries) {
          console.warn(`第${attempt}次获取坐标失败，重试中:`, error)
          await this.delay(500 * attempt)
        } else {
          throw error
        }
      }
    }
    
    throw new Error(`无法获取有效坐标: ${locationName}`)
  }

  /**
   * 清空缓存
   */
  clearCache() {
    this.cache.clear()
  }

  /**
   * 获取路线规划
   * @param {Object} from - 起点坐标 {longitude, latitude}
   * @param {Object} to - 终点坐标 {longitude, latitude}
   * @param {string} mode - 出行方式: 'driving' | 'walking' | 'bicycling'
   * @returns {Promise<Object>}
   */
  async getRoutePlanning(from, to, mode = 'driving') {
    try {
      if (!from || !to || !from.longitude || !from.latitude || !to.longitude || !to.latitude) {
        throw new Error('起点或终点坐标无效')
      }

      // 调用腾讯地图路线规划API
      const routeResult = await mapUtils.getRoute(from, to, mode)
      
      if (routeResult && routeResult.routes && routeResult.routes.length > 0) {
        const route = routeResult.routes[0]
        
        // 提取路线点信息
        const polyline = {
          points: route.polyline || [],
          distance: route.distance || 0, // 距离（米）
          duration: route.duration || 0, // 时间（秒）
          mode: mode,
          steps: route.steps || [] // 分段路线信息
        }
        
        return polyline
      }
      
      throw new Error('路线规划失败')
      
    } catch (error) {
      console.error('路线规划失败:', error)
      
      // 降级方案：返回直线路径
      return {
        points: [
          { longitude: from.longitude, latitude: from.latitude },
          { longitude: to.longitude, latitude: to.latitude }
        ],
        distance: this.calculateDistance(from, to),
        duration: this.calculateDuration(from, to, mode),
        mode: mode,
        steps: []
      }
    }
  }

  /**
   * 批量获取同一天地点的路线
   * @param {Array} locations - 地点数组，包含coordinates属性
   * @param {string} mode - 出行方式
   * @returns {Promise<Array>}
   */
  async getDayRoutePlanning(locations, mode = 'driving') {
    if (!Array.isArray(locations) || locations.length < 2) {
      throw new Error('需要至少2个地点才能规划路线')
    }

    const routes = []
    
    // 为连续的地点对规划路线
    for (let i = 0; i < locations.length - 1; i++) {
      const fromLocation = locations[i]
      const toLocation = locations[i + 1]
      
      if (fromLocation.coordinates && toLocation.coordinates) {
        try {
          const route = await this.getRoutePlanning(
            fromLocation.coordinates,
            toLocation.coordinates,
            mode
          )
          
          routes.push({
            from: fromLocation.name,
            to: toLocation.name,
            ...route,
            stepIndex: i // 路线段的索引
          })
          
          // 添加延迟避免API限制
          await this.delay(200)
          
        } catch (error) {
          console.warn(`从 ${fromLocation.name} 到 ${toLocation.name} 的路线规划失败:`, error)
          
          // 即使失败也添加降级路线
          routes.push({
            from: fromLocation.name,
            to: toLocation.name,
            points: [
              { longitude: fromLocation.coordinates.longitude, latitude: fromLocation.coordinates.latitude },
              { longitude: toLocation.coordinates.longitude, latitude: toLocation.coordinates.latitude }
            ],
            distance: this.calculateDistance(fromLocation.coordinates, toLocation.coordinates),
            duration: this.calculateDuration(fromLocation.coordinates, toLocation.coordinates, mode),
            mode: mode,
            steps: [],
            stepIndex: i,
            isFallback: true
          })
        }
      }
    }
    
    return routes
  }

  /**
   * 计算两点间的直线距离（米）
   */
  calculateDistance(from, to) {
    const R = 6371000 // 地球半径（米）
    const dLat = (to.latitude - from.latitude) * Math.PI / 180
    const dLon = (to.longitude - from.longitude) * Math.PI / 180
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(from.latitude * Math.PI / 180) * Math.cos(to.latitude * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  /**
   * 估算行程时间（秒）
   */
  calculateDuration(from, to, mode) {
    const distance = this.calculateDistance(from, to)
    
    // 根据出行方式估算速度
    let speed = 5 // 默认步行速度（公里/小时）
    switch (mode) {
      case 'driving':
        speed = 40 // 驾车速度
        break
      case 'bicycling':
        speed = 15 // 骑行速度
        break
      case 'walking':
      default:
        speed = 5 // 步行速度
    }
    
    // 计算时间（秒）
    return (distance / 1000) / speed * 3600
  }

  /**
   * 获取路线规划统计信息
   */
  getRouteStats(routes) {
    const totalDistance = routes.reduce((sum, route) => sum + route.distance, 0)
    const totalDuration = routes.reduce((sum, route) => sum + route.duration, 0)
    
    return {
      totalDistance: Math.round(totalDistance), // 米
      totalDuration: Math.round(totalDuration), // 秒
      segmentCount: routes.length,
      mode: routes[0]?.mode || 'driving'
    }
  }

  /**
   * 延迟函数
   * @param {number} ms - 延迟毫秒数
   * @returns {Promise}
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// 创建单例实例
export const locationService = new LocationService()

export default locationService